//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** Group Tiles used in Group Tile Dashboard

import React, { useState } from "react";
import { TestGroup } from "./types";
import TestGroupDetails from "./TestGroupDetails";
import * as cronstrue from "cronstrue";
import testRunApi from "../testRunApi";

interface TestGroupTileProps {
    // TestGroup from backend
    group: TestGroup,
    // Pass callback function into Tile to update testGroup
    onAddTests: () => void;
    onEditGroup: () => void;
    onUpdateGroup: (updatedGroup: TestGroup) => void;
    onRemoveGroup: (removedGroup: number) => void;
};

const TestGroupTile: React.FC<TestGroupTileProps> = ({
    group,
    onAddTests,
    onEditGroup,
    onUpdateGroup,
    onRemoveGroup,
}) => {
    const [isExpanded, setIsExpanded] = useState(false); // If expanded to show all tests & results
    const [isTestRunning, setIsTestRunning] = useState(false);

    const toggleExpansion = () => {
        setIsExpanded((prev) => !prev);
    }

    const handleRunTests = () => {
        setIsTestRunning(true);
        testRunApi
            .post(`/api/test-group/${group.testGroupId}/run-tests`)
            .then((response) => {
                console.log("Completed test updating group:", response)
                onUpdateGroup(response.data)
            })
            .catch((error) => {
                console.error("Error running tests:", error);
            })
            .finally(() => { setIsTestRunning(false) });
    }

    const handleRemoveGroup = () => {
        onRemoveGroup(group.testGroupId);
    }

    return (
        <div className={`test-group-tile ${isExpanded ? "expanded" : ""}`}>
            {/* Format for Group Tile:
                Name : static string
                Schedule : static string
                Tests & results: button that expands tile to show all test & results for group
                Add Tests: button to open modal to add tests
                Edit Group: button to open modal to edit TestGroup in DB

                TODO TODO TODO
                    Run Tests: button to run test group and return results in modal
            */}
            <h3>{group.name}</h3>
            <p>
                {(group.schedule !== null && group.schedule !== "" && cronstrue.toString(group.schedule)) || "Schedule Not Set"}
            </p>
            <button onClick={toggleExpansion}>
                {isExpanded ? "Collapse" : "Expand"}
            </button>
            <button onClick={onAddTests}>Set Tests</button>
            <button onClick={onEditGroup}>Edit Group</button>
            <button onClick={handleRunTests} disabled={isTestRunning}>
                {isTestRunning ? "Running..." : "Run Tests" }
            </button>
            <button onClick={handleRemoveGroup}>Delete Group</button>

            {/*
                Only show details if expanded
                because there can be a LOT of details after time
            */}
            <div className={`expanded-content ${isExpanded ? "expanded" : ""}`}>
                {isExpanded && <TestGroupDetails group={group} />}
            </div>
        </div>
    )
};

export default TestGroupTile;
