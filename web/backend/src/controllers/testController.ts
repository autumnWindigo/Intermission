//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** Router for Tests

import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Test } from "../entity/Test";

const router = Router();

router.get("/:id?", async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const repo = AppDataSource.getRepository(Test);

        if (id) {
            const parsedId = parseInt(id, 10);
            // Find test by ID
            if (isNaN(parsedId)) {
                res.status(400).json({ error: "Invalid Test ID" });
                return;
            }
            const test = await repo.findOne({
                where: { testId: parsedId },
                relations: ["groups", "timestamp"],
            });

            // Early return if none
            if (!test) {
                res.status(404).json({ error: "test not found" });
                return;
            }

            res.json(test);
            return;
        }

        const tests = await repo.find({
            relations: ["groups", "timestamp"],
        });

        res.json(tests)

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Error" });
    }
});

export default router;
