//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** Test DELETE for api

import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Test } from "../entity/Test";

const router = Router();

router.delete("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const repo = AppDataSource.getRepository(Test);
        const existingTest = await repo.findOne({
            where: {testId: parseInt(id) },
            relations: ["groups", "timestamp"],
        });

        if (!existingTest) {
            res.status(404).json({ error: "Test not found" });
            return;
        }

        // Deletion in related tables is handled by typeorm
        //  because of cascading
        await repo.remove(existingTest);

    } catch (error) {
        console.error("Error deleting test:", error);
        res.status(500).json({ error: "Error deleting test" });
    }
});

export default router;
