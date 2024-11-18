//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** Router for TestGroups

import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { TestGroup } from "../entity/TestGroup";

const testGroupController = Router();

testGroupController.get("/test-groups/:id?", async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const repo = AppDataSource.getRepository(TestGroup);

        // Return specific group if Id provided
        if (id) {
            const testGroup = await repo.findOne({
                where: { TestGroupID: parseInt(id) },
                relations: ["tests"],
            });

            if (!testGroup) {
                res.status(404).json({ error: "Test group not found" });
                return;
            }

            const response = {
                testGroupId: testGroup.TestGroupID,
                testIds: testGroup.tests.map(test => test.testId), // map test -> id's to save memory & speed
            };

            res.json(response);
            return;
        }

        // Return all if no Id provided
        const testGroups = await repo.find({
            relations: ["tests"],
        });

        // Same mapping as before
        const response = testGroups.map(group => ({
            testGroupId: group.TestGroupID,
            testIds: group.tests.map(test => test.testId),
        }));

        res.json(response)

    } catch (error) {
        console.error("Error getting test group:", error);
        res.status(500).json({ error: "Error getting test group" });
    }
});

export default testGroupController;
