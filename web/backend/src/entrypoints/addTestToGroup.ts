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
        const testGroup: TestGroup | null = await testGroupRepo.findOne({
            where: { testGroupId: parseInt(testGroupId) },
            relations: ["tests", "results"],
        });

        // If not found, early return
        if (!testGroup) {
            res.status(404).json({ error: "Test group not found" });
            return;
        }

        // Gather selected tests
        const testsToAssign = await testRepo.findBy({
            testId: In(testIds),
        });

        // Verify all are valid tests
        if (testsToAssign.length !== testIds.length) {
            res.status(404).json({ error: "One or more testIds are invalid." });
            return;
        }

        // Replace tests in the group with the new ones
        testGroup.tests = testsToAssign;
        await testGroupRepo.manager.save(testGroup);

        // Return updated test group
        const updatedTestGroup = await testGroupRepo.findOne({
            where: { testGroupId: parseInt(testGroupId) },
            relations: ["tests", "results"],
        });

        res.status(200).json(updatedTestGroup);
    } catch (error) {
        console.error("Failed to update tests in group:", error);
        res.status(500).json({ error: "Failed to update tests in group" });
    }
});

export default router;
