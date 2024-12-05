import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Test } from "../entity/Test";
import fs from "fs";
import path from "path";

// Extract pytest functions from file
const extractTestFunctions = (fileContent: string): string[] => {
    // regex to find test function
    const testFunctionRegex = /\s*def\s+(bundle_[a-zA-Z0-9_]*)\s*\(/gm;
    const matches: string[] = [];
    let match;
    while ((match = testFunctionRegex.exec(fileContent)) !== null) {
        matches.push(match[1]); // Capture function name
    }
    console.log(matches);
    return matches;
};

const router = Router();

router.post("/:file/add-tests-from-file", async (req: Request, res: Response) => {
    const { file } = req.params;

    console.log("Received file:", file);
    console.log("TEST_DIR:", process.env.TEST_DIR);

    if (!process.env.TEST_DIR) {
        res.status(500).json({ error: "TEST_DIR environment variable is not set." });
        return;
    }

    const filePath = path.join(process.env.TEST_DIR, file, `${file}.py`);

    console.log("looking for:", filePath.toString());
    try {
        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            res.status(404).json({ error: `File ${file}.py not found.` });
            return;
        }

        // Read the file content
        const fileContent = fs.readFileSync(filePath, "utf-8");

        // Extract test functions
        const testFunctions = extractTestFunctions(fileContent);

        if (testFunctions.length === 0) {
            res.status(400).json({ error: "No test functions found in the file." });
            return;
        }

        // Create test entities for each function
        const testRepo = AppDataSource.getRepository(Test);

        // Create test entities for each function
        const newTests = testFunctions.map((testName) => {
            const test = new Test();
            test.testName = testName;
            test.fileName = file;
            test.filePath = (`${process.env.TEST_DIR}/${file}/${file}.py`);
            test.groups = [];
            return test;
        });

        // Save new tests to the database
        await testRepo.save(newTests);

        res.status(200).json({ message: "Tests added successfully", tests: newTests });
    } catch (error) {
        console.error("Error adding tests from file:", error);
        res.status(500).json({ error: "Failed to add tests from file" });
    }
});

export default router;
