import React, { useEffect, useState } from "react";
import axios from "axios";
import { TestGroup } from "./types";

interface TestGroupTileProps {
    // TestGroup from backend
    group: TestGroup,
    // Pass callback function into Tile to update testGroup
    onUpdate: (updatedGroup: TestGroup) => void;
};

/*
TODO:   Add jsx to return
        Create function for adding new testGroup (make default then user edits)
            This should be in main app & be like a + button in the top

        Add parent object to hold TestGroupTile's in the main
        Parent test should be some kinda dashboard. We should have other menu's
        other than JUST test groups. Just makes sense to do this first.
        Map DB TestGroup's to the parent object
*/


const TestGroupTile: React.FC<TestGroupTileProps> = ({ group, onUpdate }) => {
    // Our States! Only adding test uses the modal, not editing them
    const [isEditing, setIsEditing] = useState(false); // If editing testGroupTile (will update testGroup)
    const [expanded, setExpanded] = useState(false); // If expanded to show all tests & results
    const [isModalOpen, setIsModalOpen] = useState(false); // If modal open duh
    const [availableTests, setAvailableTests] = useState([]); // List of tests to select
    const [selectedTests, setSelectedTests] = useState([]); // List of tests to add

    // Create useEffect to grab tests from API when modal is opened
    // useEffect(setup, dependencies?)
    // isModalOpened is the dependency, stops API calls when not needed
    useEffect(() => {
        if (isModalOpen) {
            // /test without ID returns all
            axios.get("/test").then((res) => {
                setAvailableTests(res.data);
            });
        }
    }, [isModalOpen]); // dependency: modal is open



    // Tile which holds...
    // TestGroup information
    // Drop down for tests & results
    // Button for editing
    // Button for adding tests (through modal)
    return (
    <div> </div>
    )
};

export default TestGroupTile;
