import React from "react";
import { TestGroup } from "./types";

interface TestGroupDetailsProps {
    group: TestGroup;
}

const TestGroupDetails: React.FC<TestGroupDetailsProps> = ({
    group
}) => {
    return (
        <div>
            <h4>Tests</h4>
            {/* List valid tests in group */}
            {group.tests.length > 0 ? (
                <ul>
                    {/* If valid tests, list them */}
                    {group.tests.map((test) => (
                        <li key={test.testId}>
                            {test.testName} ({test.testName})
                        </li>
                    ))}
                </ul>
            ) : (
                // Message if no valid tests in group
                <p>No tests in Group</p>
            )}

            <h4>Results</h4>
            {/* List results */}
            {group.results.length > 0 ? (
                <ul>
                    {/* Map all rsults to a list by Id */}
                    {/* TODO TODO TODO: Only show most recent tests
                            can do quite easily with map((result), index)
                            but would be nice to not have to go through entire array
                            like why O(n) if it doesn't need to be but also it's JS so shrug

                            could also map a spread slice at the end then map that slice
                    */}
                    {group.results.map((result) => (
                        <li key={result.resultId}>
                            <p>Passed: {result.passedSubtests}</p>
                            <p>Failed: {result.failedSubtests}</p>
                            <p>Success: {result.overallSuccess ? "Yes" : "No"}</p>
                            <p>Date: {new Date(result.createdAt).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                // Message if no valid results in group
                <p>No results available.</p>
            )}
        </div>
    );
};

export default TestGroupDetails;
