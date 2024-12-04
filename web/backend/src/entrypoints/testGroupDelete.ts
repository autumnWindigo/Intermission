import { TestGroup } from "../entity/TestGroup";
import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { removeTestGroupJob } from "../scheduler";
import { TestResult } from "../entity/TestResult";

const router = Router();

router.delete("/:id", async (req: Request, res: Response) => {
    const testGroupId = parseInt(req.params.id);

    try {
        const repo = AppDataSource.getRepository(TestGroup);
        const testResultRepo = AppDataSource.getRepository(TestResult);

        const existingTestGroup = await repo.findOne({
            where: {testGroupId: testGroupId },
            relations: ["tests", "results"],
        });

        const relatedResults = await testResultRepo.find({
            where: { testGroup: { testGroupId } },
        });

        if (!existingTestGroup) {
            res.status(404).json({ error: "Test group not found" });
            return;
        }

        // Delete cron job
        removeTestGroupJob(existingTestGroup);

        await testResultRepo.remove(relatedResults);
        const removedGroup = await repo.remove(existingTestGroup);

        // respond with deleted group
        res.status(200).json({removedGroup})
    } catch (error) {
        console.error("error deleting test:", error);
        res.status(500).json({ error: "Error deleting test group" });
    }
});

export default router;
