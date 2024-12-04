import { TestGroup } from "../entity/TestGroup";
import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { removeTestGroupJob } from "../scheduler";

const router = Router();

router.delete("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const repo = AppDataSource.getRepository(TestGroup);
        const existingTestGroup = await repo.findOne({
            where: {testGroupId: parseInt(id) },
            relations: ["tests", "results"],
        });

        if (!existingTestGroup) {
            res.status(404).json({ error: "Test group not found" });
            return;
        }

        // Delete cron job
        removeTestGroupJob(existingTestGroup);

        const removed = await repo.remove(existingTestGroup);

        // respond with deleted group
        res.status(200).json({removed})
    } catch (error) {
        console.error("error deleting test:", error);
        res.status(500).json({ error: "Error deleting test group" });
    }
});

export default router;
