//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** API entrypoint to run test

import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Test } from "../entity/Test";
import { runPytestForSingleTest } from "../runPytestOnSingleTest";

const router = Router();

router.post("/tests/:id/run-test", async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const repo = AppDataSource.getRepository(Test);
        const test = await repo.findOne({
            where: { testId: parseInt(id) },
            relations: ["testGroups"],
        });

        if (!test) {
            return;
        }

        const singleTestResponse = await runPytestForSingleTest(test.testId);

        res.status(200).json(singleTestResponse);
    } catch (error) {
        console.error("Error launching test", error);
        res.status(500).json({ error: "Error launching test" });
    }
});

export default router;
