import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { TestGroup } from "../entity/TestGroup";
import { scheduleTestGroupJob } from "../scheduler";

const router = Router();

router.put("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, schedule } = req.body;
    console.log("ID:", id, "body:", name, schedule);

    try {
        const repo = AppDataSource.getRepository(TestGroup)
        const existingTestGroup = await repo.findOne({
            where: { testGroupId: parseInt(id) },
            relations: ["tests", "results"],
        });

        if (!existingTestGroup) {
            res.status(404).json({ error: "Test group not found" });
            return;
        }

        if (name) existingTestGroup.name = name;
        //update schedule
        // We can only update cron job AFTER the new test group is saved
        if (schedule) existingTestGroup.schedule = schedule;

        const finalTestGroup = await repo.save(existingTestGroup);

        // Create new Cron job if schedule was updated
        // we won't hit this code if the save failed
        if (schedule) scheduleTestGroupJob(finalTestGroup);

        res.status(200).json(finalTestGroup);
    } catch (error) {
        console.error("Error updating test group:", error);
        res.status(500).json({ error: "Error updating test group" });
    }
});

export default router;
