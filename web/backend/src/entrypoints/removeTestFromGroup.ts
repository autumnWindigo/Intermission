//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** Remove test from test group

import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { TestGroup } from "../entity/TestGroup";
import { Test } from "../entity/Test";

const router = Router();

router.delete("/test-groups/:testGroupId/tests/:testId", async (req: Request, res: Response) => {
    const { testGroupId, testId } = req.params;

    try {
        const testGroupRepo = AppDataSource.getRepository(TestGroup);
        const testRepo = AppDataSource.getRepository(Test);

        // Load vars from DB
        // free me from this boiler plate hell
        const testGroup = await testGroupRepo.findOne({
            where: { TestGroupID: parseInt(testGroupId) },
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

        // Remove test from test group
        testGroup.tests.filter(t => t.testId !== test.testId);

        await testGroupRepo.save(testGroup);

        // Return updated test group
        const response = {
            testGroupId: testGroup.TestGroupID,
            testIds: testGroup.tests.map(t => t.testId),
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("Failed to delete test from group:", error);
        res.status(500).json({ error: "Failed to delete test from group" });
    }

});
