import { AppDataSource } from "./data-source";
import { spawn } from "child_process";
import { TestResult } from "./entity/TestResult";
import { TestGroup } from "./entity/TestGroup";

export async function runPytestForTestGroup(groupId: number): Promise<TestResult> {
    const testGroupRepository = AppDataSource.getRepository(TestGroup);
    const testResultRepository = AppDataSource.getRepository(TestResult);

    // Fetch the TestGroup along with its associated tests
    const testGroup = await testGroupRepository.findOne({
        where: { testGroupId: groupId },
        relations: ["tests"],
    });

    if (!testGroup) {
        throw new Error(`TestGroup with ID ${groupId} not found.`);
    }

    // This is getting extremely out of hand.
    // But typescript was being VERY and I mean VERY particular about this not being null.
    // The .filter is a type gaurd and only does that.
    // Set garuntees no dups.
    const filePaths: string[] = [...new Set(testGroup.tests.map((test) => test.filePath).filter(
            (filePath): filePath is string => filePath !== null))];

    if (filePaths.length === 0) {
        throw new Error(`No valid file paths found for TestGroup with ID ${groupId}.`);
    }

    // Construct the pytest command
    // Pytest command will look like this in terminal:
    //   pytest path1 path2 --allow test1,test2,test3
    const command = "pytest";
    const args = [...filePaths, "--allow", testGroup.tests.map((t) => t.testName).join(",")];

    // Run pytest
    // We need a promise so it doesn't stop the site for 20
    // years when we run multiple tests (async my beloved)
    return new Promise((resolve, reject) => {
        const pytest = spawn(command, args);

        let stdout = "";
        let stderr = "";

        // On writes append to stdout & error
        pytest.stdout.on("data", (data) => {
            stdout += data.toString();
        });

        pytest.stderr.on("data", (data) => {
            stderr += data.toString();
        });

        // When pytest successfully closes
        pytest.on("close", async (code) => {
            /* TODO TODO TODO
            tests/unit_tests/unit_tests.py .u,.  [ 50%]
            pytest output lines look like this for each file
            need to write regex to match the ',' and 'u' between '.'
            to count amount of passed and failed tests

            (in case of skip I want to explicitly count failed)
            */

            // Parse output from pytest success
            const passedSubtests = -1
            const failedSubtests = -1
            const overallSuccess = code === 0;

            // Create and save TestResult
            const testResult = new TestResult();
            testResult.testGroup = testGroup;
            testResult.output = stdout;
            testResult.passedSubtests = passedSubtests;
            testResult.failedSubtests = failedSubtests;
            testResult.overallSuccess = overallSuccess;

            // Save results to DB
            try {
                const savedResult = await testResultRepository.save(testResult);

                // Spread results (if none have empty array) + new result
                testGroup.results = [...(testGroup.results || []), savedResult];
                // Finally really save (for real) to DB
                await testGroupRepository.save(testGroup);

                resolve(savedResult);
            } catch (error) {
                // Should not reach here
                // can't add failure clause because DB error
                reject(error);
            }
        });

        pytest.on("error", (error) => {
            // Add failure clause
            reject(error);
        });
    });
}
