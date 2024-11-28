//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** Dashboard for editing and running test groups

import React, { useState, useEffect } from "react";
import api from "../api";
import TestGroupTile from "./TestGroupTile";
import { TestGroup } from "./types";
import './TestGroupDashboard.css';
import TestAddToGroupModal from "./TestAddToGroupModal";
import EditTestGroupModal from "./EditTestGroupModal";
import TestGroupAddModal from "./TestGroupAddModal";

const TestGroupDashboard: React.FC = () => {
    const [testGroups, setTestGroups] = useState<TestGroup[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [currentGroup, setCurrentGroup] = useState<TestGroup | null>(null);
    const [isGroupAddModelOpen, setIsGroupAddModelOpen] = useState(false);

    // Run on innitial render to load test groups
    useEffect(() => {
        // Grab test groups from database on load
        api
            .get("/api/test-group")
            .then((res) => {
                setTestGroups(res.data);
            })
    }, []); // Empty array only runs on first render

    // Update group objects which were passed to the tiles
    // Updates on DB changes in handlers
    const updateGroup = (updatedGroup: TestGroup) => {
        setTestGroups((prevGroups) =>
            prevGroups.map((group) =>
                group.testGroupId === updatedGroup.testGroupId
                    ? { ...group, ...updatedGroup, results: updatedGroup.results || [] }
                    : group
            )
        );
    };

    // On update run through the array
    // If we hit an updated test group then replace old with updated
    // could use .find() but it's still just O(n) and this is simpler
    const handleEditGroup = (
        updatedGroup: { testGroupId: number, name: string, schedule: string | null }) => {
        if (currentGroup === null) return;
        // Update Group in DB
        api
            .put(`/api/test-group/${currentGroup.testGroupId}`,
                { name: updatedGroup.name, schedule: updatedGroup.schedule })
            .then((response) => {
                console.log(`Updated group:`, response.data);
                updateGroup(response.data);
            })
            .catch((error) => {
                console.error("Error updateing test group:", error);
            });

        setIsEditModalOpen(false);
    };

    // Add tests to group (goes to AddToGroupModal)
    const handleAddTests = (selectedTestIds: number[]) => {
        if (currentGroup === null) return;
        api
            .post(`/api/test-group/${currentGroup.testGroupId}/add-tests`, { testIds: selectedTestIds })
            .then((response) => {
                console.log(`Updated group:`, response.data);
                updateGroup(response.data)
            })
            .catch((error) => {
                console.error("Error adding tests:", error);
            });
        setIsAddModalOpen(false);
    };

    // Update database and UI with new test group
    const handleNewGroup = (newGroupName: string) => {
        api
            .post('/api/test-group', { name: newGroupName })
            .then((res) => {
                console.log("Added new test group:", res.data);
                setTestGroups([...testGroups, res.data]); // Append New Group
            })
            .catch((error) => {
                console.error("Error adding new test group:", error);
            });

    }

    // This is literally just a div to hold TestGroupTiles
    // Will make a nicer looking title / holding space for them later
    console.log(testGroups);
    return (
        <div className="dashboard-container">
            <button className="add-group" onClick={() => setIsGroupAddModelOpen(true)}>
                Add Test Group
            </button>
            <div className="dashboard">
                {testGroups.map((group) => (
                    <div key={group.testGroupId}>
                        <TestGroupTile
                            key={group.testGroupId}
                            group={group}
                            onUpdateGroup={updateGroup}
                            onAddTests={() => {
                                setCurrentGroup(group);
                                setIsAddModalOpen(true);
                            }}
                            onEditGroup={() => {
                                setCurrentGroup(group);
                                setIsEditModalOpen(true);
                            }}
                        />
                    </div>
                ))}
                {/* Group set in modal when visible */}
                <TestAddToGroupModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onAddTests={handleAddTests}
                    group={currentGroup} // Pass the current group to the modal
                />

                <EditTestGroupModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onEditGroup={handleEditGroup}
                    currentName={currentGroup?.name || ""}
                    currentSchedule={currentGroup?.schedule || ""}
                    currentId={currentGroup?.testGroupId || -1}
                />

                <TestGroupAddModal
                    isOpen={isGroupAddModelOpen}
                    onClose={() => setIsGroupAddModelOpen(false)}
                    onAddGroup={handleNewGroup}
                />
            </div>
        </div>
    );
};

export default TestGroupDashboard;
