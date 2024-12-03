//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** Modal for adding tests to groups through api

import React, { useState, useEffect } from "react";
import { Test, TestGroup } from "./types";
import api from "../api";

interface TestAddToGroupModalProps {
    isOpen: Boolean;
    onClose: () => void;
    onAddTests: (selectedTestIds: number[]) => void;
    group: TestGroup | null;
}

const TestAddToGroupModal: React.FC<TestAddToGroupModalProps> = ({
    isOpen,
    onClose,
    onAddTests,
    group,
}) => {
    const [availableTests, setAvailableTests] = useState<Test[]>([]);
    const [selectedTestIds, setSelectedTestIds] = useState<number[]>([]);
    const [search, setSearch] = useState("");

    // Update available tests on opening modal
    useEffect(() => {
        if (isOpen) {
            api
                .get("/api/test").then((res) => {
                    setAvailableTests(res.data);
                });
            setSelectedTestIds([...group?.tests.map((test) => test.testId) || []]);
        }
    }, [isOpen]);

    // When test is toggled, add / remove from selected tests
    const toggleTestSelection = (testID: number) => {
        setSelectedTestIds((prev) =>
            prev.includes(testID) // If test is in selected
                ? prev.filter((id) => id !== testID) // then remove it from selected
                : [...prev, testID] // else append it to selected
        );
    }

    // Filter available tests by the user search
    const filteredTests = availableTests.filter((test) =>
        test.testName.toLowerCase().includes(search)
    );


    // == Handlers ==

    // Update search when user input changes -> lets us filter as they type
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value.toLowerCase());
    };

    // Activated when user hits 'add tests'
    // Will run callback function in Tile (updates DB)
    // Resets selected tests & closes modal
    const handleAddTests = () => {
        onAddTests(selectedTestIds);
        onClose();
    };

    // Don't close out of modal if clicking IN modal
    const handleModalClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };

    // == modal ==

    // Don't render modal if it shouldn't be open
    if (!isOpen) return null;

    return (
        <>
            <div className="modal-overlay" onClick={() => {
                setSelectedTestIds([]);
                onClose();
            }}>
                <div className="modal" onClick={handleModalClick}>
                    <div className="modal-content">
                        {/* Headers and Buttons of Modal */}
                        <h4>Select Tests</h4>
                        <input
                            className="search-bar"
                            type="text"
                            placeholder="Search Tests"
                            value={search}
                            onChange={handleSearch}
                        />
                        {/* List of available tests to select */}
                        <ul>
                            {/* If there are valid tests in the filtered list */}
                            {filteredTests.length > 0 ? (
                                // Then create list of tests with check boxes
                                // When box is toggled, update selected list
                                // (init toggle is based on selected tests when search updates)
                                filteredTests.map((test) => (
                                    <li key={test.testId}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={selectedTestIds.includes(test.testId)}
                                                onChange={() => toggleTestSelection(test.testId)}
                                            />
                                            {test.testName.toString()}
                                        </label>
                                    </li>
                                ))
                            ) : (
                                // Else let user know search is bad
                                <p>No tests match the search.</p>
                            )}
                        </ul>
                        {/* Add selected tests and close modal */}
                        <button onClick={handleAddTests}>Add Selected</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TestAddToGroupModal;
