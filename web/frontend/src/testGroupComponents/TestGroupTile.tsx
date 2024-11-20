import React, { useState } from "react";
import { TestGroup } from "./types";
import TestGroupDetails from "./TestGroupDetails";
import TestAddToGroupModal from "./TestAddToGroupModal";
import EditTestGroupModal from "./EditTestGroupModal";
import api from "../api";

interface TestGroupTileProps {
    // TestGroup from backend
    group: TestGroup,
    // Pass callback function into Tile to update testGroup
    onUpdate: (updatedGroup: TestGroup) => void;
};

const TestGroupTile: React.FC<TestGroupTileProps> = ({ group, onUpdate }) => {
    // Our States! Only adding test uses the modal, not editing them
    const [isExpanded, setIsExpanded] = useState(false); // If expanded to show all tests & results
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // If modal open duh
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // If modal open duh

    // Pass into AddTestModal
    const handleAddTests = (selectedTestIds: number[]) => {
        api
            .post(`/api/test-group/${group.testGroupId}/add-tests`, { testIds: selectedTestIds })
            .then((response) => {
                const updatedGroup = response.data;
                // Notify parent of changes
                onUpdate(updatedGroup);
            })
            .catch((error) => {
                console.error("Error adding tests:", error);
            });
    };

    const handleEditSave = (updatedGroup: { name: string; schedule: string | null }) => {
        // Pass group info to Edit Modal
        // Too much code to have here
        onUpdate({ ...group, ...updatedGroup });
    };

    const toggleExpansion = () => {
        setIsExpanded((prev) => !prev);
    }

    // Tile which holds...
    // TestGroup information
    // Drop down for tests & results
    // Button for editing (through modal)
    // Button for adding tests (through modal)
    return (
        <div>
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
                schedule: {group.schedule || "Not Set"}
            </p>
            <button onClick={toggleExpansion}>
                {isExpanded ? "Collapse" : "Expand"}
            </button>
            <button onClick={() => setIsAddModalOpen(true)}>
                Add Tests
            </button>
            <button onClick={() => setIsEditModalOpen(true)}>
                Edit Group
            </button>

            {/*
                Only show details if expanded
                because there can be a LOT of details after time
            */}
            {isExpanded && <TestGroupDetails group={group} />}

            <TestAddToGroupModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAddTests={handleAddTests}
            />

            <EditTestGroupModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                testGroupId={group.testGroupId}
                currentName={group.name}
                currentSchedule={group.schedule}
                onSave={handleEditSave}
            />
        </div>
    )
};

export default TestGroupTile;
