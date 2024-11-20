//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** Router for TestGroups

import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { TestGroup } from "../entity/TestGroup";

const router = Router();

router.get("/:id?", async (req: Request, res: Response) => {
    const { id } = req.params;

    console.log("input:", id);

    try {
        const repo = AppDataSource.getRepository(TestGroup);

        // Return specific group if Id provided
        if (id) {
            const testGroup = await repo.findOne({
                where: { testGroupId: parseInt(id) },
                relations: ['tests', 'results'],
            });

            if (!testGroup) {
                res.status(404).json({ error: "Test group not found" });
                return;
            }

            // const response = {
            //     testGroupId: testGroup.testGroupId,
            //     testIds: testGroup.tests.map(test => test.testId), // map test -> id's to save memory & speed
            // };

            res.json(testGroup);
            return;
        }

        // Return all if no Id provided
        const testGroups = await repo.find({
            relations: ["tests", 'results'],
        });

        // // Same mapping as before
        // const response = testGroups.map(group => ({
        //     testGroupId: group.testGroupId,
        //     testIds: group.tests.map(test => test.testId),
        // }));

        res.json(testGroups)

    } catch (error) {
        console.error("Error getting test group:", error);
        res.status(500).json({ error: "Error getting test group" });
    }
});

export default router;
