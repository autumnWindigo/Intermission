//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** POST for Test entity

import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { TestGroup } from "../entity/TestGroup";

const router = Router()

// Tests own test groups. Add tests to group through them.
router.post("/", async (req: Request, res: Response) => {
    const { name, schedule, results } = req.body;

    try {
        const repo = AppDataSource.getRepository(TestGroup);
        const newTestGroup = new TestGroup();

        newTestGroup.name = name;

        newTestGroup.schedule = schedule ? schedule : null;
        newTestGroup.results = results ? results : [];
        newTestGroup.tests = [];

        const finalTestGroup = await repo.save(newTestGroup);

        //201 created
        res.status(201).json(finalTestGroup);
    } catch (error) {
        console.error("Error creating new testGroup:", error);
        res.status(500).json({ error: "Failed creating new test" });
    }
});

export default router;
