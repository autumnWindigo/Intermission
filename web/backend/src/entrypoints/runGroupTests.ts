import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { TestGroup } from "../entity/TestGroup";
import { runPytestForTestGroup } from "../runPytestOnTestGroup";
import { TestResult } from "../entity/TestResult";
import { Test } from "../entity/Test";

const router = Router();

router.post("/:id/run-tests", async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const repo = AppDataSource.getRepository(TestGroup);
        const testGroup = await repo.findOne({
            where: { testGroupId: parseInt(id) },
            relations: ["tests", "results"],
        });

        if (!testGroup) {
            res.status(404).json({ error: "Test group not found" })
            return;
        }

        // Run tests
        // Result updated inside this
        // Returns updated group
        const updatedGroup = await runPytestForTestGroup(testGroup.testGroupId);

        // Manually map the new data we want because it's feisty
        const response = {
            testGroupId: updatedGroup.testGroupId,
            name: updatedGroup.name,
            schedule: updatedGroup.schedule,
            tests: updatedGroup.tests.map((test: Test) => ({
                testId: test.testId,
                testName: test.testName,
                filePath: test.filePath,
            })),
            results: updatedGroup.results.map((result: TestResult) => ({
                resultId: result.resultId,
                output: result.output,
                passedSubtests: result.passedSubtests,
                failedSubtests: result.failedSubtests,
                overallSuccess: result.overallSuccess,
                createdAt: result.createdAt.toISOString(),  // Convert Date to string format
            })),
        }

        res.status(200).json(response);
    } catch (error) {
        console.error("Error launching tests:", error);
        res.status(500).json({ error: "Error launching tests" });
    }
});

export default router;
