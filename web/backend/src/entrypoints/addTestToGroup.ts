//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** Add new tests to test group

import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { TestGroup } from "../entity/TestGroup";
import { Test } from "../entity/Test";
import { In } from "typeorm";

const router = Router();

// Add test to test group
router.post("/:id/add-tests", async (req: Request, res: Response) => {
    const testGroupId = req.params.id;
    const { testIds } = req.body;

    try {
        // Load DB
        const testGroupRepo = AppDataSource.getRepository(TestGroup);
        const testRepo = AppDataSource.getRepository(Test);

        // Load vars from DB
        const testGroup = await testGroupRepo.findOne({
            where: { testGroupId: parseInt(testGroupId) },
            relations: ["tests"],
        });

        // If not found, early return
        if (!testGroup) {
            res.status(404).json({ error: "Test group not found" });
            return;
        }

        // Gather selected tests
        const testsToAdd = await testRepo.findBy({
            testId: In(testIds)
        });

        // Verify all are valid tests
        if (testsToAdd.length !== testIds.length) {
            res.status(404).json({ error: 'One or more testIds are invalid.' });
            return;
        }

        // Check for duplicates
        const existingTestIds = testGroup.tests.map((test) => test.testId);
        const duplicateTestIds = testsToAdd.filter((test) => existingTestIds.includes(test.testId));

        if (duplicateTestIds.length > 0) {
            // I don't think there's a matching status code for this so throw error
            throw new Error(`Duplicate tests detected: ${duplicateTestIds.map((test) => test.testId).join(', ')}`);
        }

        // Add tests to group
        testGroup.tests = [...testGroup.tests, ...testsToAdd];
        await testGroupRepo.manager.save(testGroup);

        // Return updated test group
          const response = {
            testGroupId: testGroup.testGroupId,
            testIds: testGroup.tests.map(t => t.testId),
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("Failed to add test to group:", error);
        res.status(500).json({ error: "Failed to add test to group" });
    }
});

export default router;
