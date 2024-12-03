//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** Runs pytest for single test when testId is passed
// This is NOT preferred to test group it's more for end user
//   testing that single tests work and debugging systems
//   results will NOT be saved only returned to frontend temporarily

import { AppDataSource } from "./data-source"
import { Test } from "./entity/Test"
import { TestResult } from "./entity/TestResult";
import { spawn } from "child_process";
import path from "path";


export async function runPytestForSingleTest(testId: number): Promise<{
    result: Boolean,
    output: string,
}> {
    const testRepo = AppDataSource.getRepository(Test);
    const testResultRepository = AppDataSource.getRepository(TestResult);


    // get test
    const test = await testRepo.findOne({
        where: { testId: testId },
    })

    // Confirm is valid test
    if (!test || !test.filePath || !test.testName) {
        throw new Error(`Test (${test?.testName}) is not properly initialized`)
    }

    const command = "pytest";
    const args = [...test.filePath, "--allow", test.testName];
    const pythonExecutable = process.env.PYTHON_EXEC || "";

    if (process.env.PYTHON_EXEC === "") {
        throw new Error("PYTHON_EXEC not set or found");
    }

    return new Promise((resolve, reject) => {
        const pytest = spawn(command, args, {
        env: {...process.env, PATH: path.dirname(pythonExecutable)}
        });

        let stdout = "";

        // On writes append to stdout & error
        pytest.stdout.on("data", (data) => {
            stdout += data.toString();
        });

        pytest.on("close", (code) => {
            resolve({result: code === 0, output: stdout});
        });

        pytest.on("error", (error) => {
            reject({result: false, output: error});
        });
    });
}