//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** Add new test to test group

import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { TestGroup } from "../entity/TestGroup";
import { Test } from "../entity/Test";

const router = Router();

// Add test to test group
router.post("/test-group/:testGroupId/tests/:testId", async (req: Request, res: Response) => {
    const { testGroupId, testId } = req.params;

    try {
        // Load DB
        const testGroupRepo = AppDataSource.getRepository(TestGroup);
        const testRepo = AppDataSource.getRepository(Test);

        // Load vars from DB
        const testGroup = await testGroupRepo.findOne({
            where: { testGroupId: parseInt(testGroupId) },
            relations: ["tests"],
        });
        const test = await testRepo.findOne({
            where: { testId: parseInt(testId) },
        });

        // If not found, early return
        if (!testGroup) {
            res.status(404).json({ error: "Test group not found" });
            return;
        } else if (!test) {
            res.status(404).json({ error: "Test not found" });
            return
        }

        // Confirm it doesn't exist in array
        if (!testGroup.tests.find(t => t.testId === test.testId)) {
            // Add test
            testGroup.tests.push(test);
        }

        // Update DB
        await testGroupRepo.save(testGroup)

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
