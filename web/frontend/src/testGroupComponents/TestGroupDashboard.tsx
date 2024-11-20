import React, { useState, useEffect } from "react";
import api from "../api";
import TestGroupTile from "./TestGroupTile";
import { TestGroup } from "./types";

const TestGroupDashboard: React.FC = () => {
    const [testGroups, setTestGroups] = useState<TestGroup[]>([]);

    // Run on innitial render to load test groups
    useEffect(() => {
        // Grab test groups from database on load
        api
            .get("/api/test-group")
            .then((res) => {
                setTestGroups(res.data);
            })
    }, []); // Empty array only runs on first render

        // On update run through the array
        // If we hit an updated test group then replace old with updated
        // could use .find() but it's still just O(n) and this is simpler
        const handleUpdateGroup = (updatedGroup: TestGroup) => {
            setTestGroups((prevGroups) =>
                prevGroups.map((group) =>
                    group.testGroupId === updatedGroup.testGroupId ? updatedGroup : group
                )
            );
        };

        // This is literally just a div to hold TestGroupTiles
        // Will make a nicer looking title / holding space for them later

        console.log(testGroups);
        return (
            <div className="test-group-dashboard">
                <h1>Test Group Dashboard</h1>
                <div className="test-group-tiles">
                    {testGroups.map((group) => (
                        <TestGroupTile
                            key={group.testGroupId}
                            group={group}
                            onUpdate={handleUpdateGroup}
                        />
                    ))}
                </div>
            </div>
        );
    };

    export default TestGroupDashboard;
