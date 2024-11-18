import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Test } from "../entity/Test";

const testController = Router();

testController.get("/test/:id", async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const repo = AppDataSource.getRepository(Test);

        // Find test by ID
        const test = await repo.findOne({
            where: { testId: parseInt(id) },
            relations: ["groups", "timestamp", "reports"],
        });

        // Early return if none
        if (!test) {
            res.status(404).json({ error: "test not found" });
            return;
        }

        res.json(test);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Error" });
    }
});

export default testController;
