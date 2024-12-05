//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** Part of test group tile. More detailed info.

import React from "react";
import { TestGroup } from "./types";

interface TestGroupDetailsProps {
    group: TestGroup;
}


const TestGroupDetails: React.FC<TestGroupDetailsProps> = ({
    group
}) => {
    const latestResult = group.results.length > 0
        ? group.results[group.results.length - 1]
        : null;

    return (
        <div className="test-group-details">
            <h4>Tests</h4>
            {/* List valid tests in group */}
            <div className="test-group-test-list">
            {group.tests.length > 0 ? (
                <ul>
                    {/* If valid tests, list them */}
                    {group.tests.map((test) => (
                        <li key={test.testId}>
                            {test.testName}
                            <div className="test-path">
                                ({test.filePath})
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                // Message if no valid tests in group
                <p>No tests in Group</p>
            )}
            </div>

            <h4>Last Result</h4>
            {/* List results */}
            { latestResult ? (
                <ul>
                        <li key={latestResult.resultId}>
                            <p>Passed: {latestResult.passedSubtests}</p>
                            <p>Failed: {latestResult.failedSubtests}</p>
                            <p>Success: {latestResult.overallSuccess ? "Yes" : "No"}</p>
                            <p>Date: {new Date(latestResult.createdAt).toLocaleString()}</p>
                        </li>

                </ul>
            ) : (
                // Message if no valid results in group
                <p>No results available.</p>
            )}
        </div>
    );
};

export default TestGroupDetails;
