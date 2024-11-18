//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** Test POST for api

import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Test } from "../entity/Test";

const testPost = Router();

// Post to server without ID to create new test
// ID auto generated by database.
testPost.post("/api/test", async (req: Request, res: Response) => {
    const { fileName, testName, filePath, groups, timestamp, reports } = req.body;

    try {
        const repo = AppDataSource.getRepository(Test);
        const newTest = new Test();

        newTest.fileName = fileName;
        newTest.testName = testName;
        newTest.filePath = filePath;

        // Add generics for each here
        if (groups) newTest.groups = groups;
        if (timestamp) newTest.timestamp = timestamp;
        if (reports) newTest.reports = reports;

        const finalTest = await repo.save(newTest);

        // 201 = created
        res.status(201).json(finalTest);
    } catch (error) {
        console.error("Error adding new test:", error);
        res.status(500).json({ error: "Failed adding new test" });
    }
});

export default testPost;