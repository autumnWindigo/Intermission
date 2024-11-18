//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** PUT for Test entity

import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Test } from "../entity/Test";

// Type gaurd because compiler is being sassy
function isTest(test: Test | null): test is Test {
    return test !== null;
}

const testPut = Router();

testPut.put("/api/test/:id", async (req: Request, res: Response) => {
    // setup
    const { id } = req.params;
    const { fileName, testName, filePath, groups, timestamp, reports } = req.body;

    try {
        const repo = AppDataSource.getRepository(Test);
        const existingTest = await repo.findOne({
            where: { testId: parseInt(id) },
            relations: ["groups", "timestamp", "reports"],
        });

        // Confirm Test is not null
        if (!isTest(existingTest)) {
            res.status(404).json({ error: "Test not found" });
            return;
        }

        // Now update fields if provided
        if (fileName) existingTest.fileName = fileName;
        if (testName) existingTest.testName = testName;
        if (filePath) existingTest.filePath = filePath;

        if (groups) existingTest.groups = groups;
        if (timestamp) existingTest.timestamp = timestamp;
        if (reports) existingTest.reports = reports;

        const finalTest = await repo.save(existingTest);
        res.json(finalTest);
    } catch (error) {
        console.error("Error updating test:", error);
        res.status(500).json({ error: "Error updating test" })
    }
});

export default testPut;