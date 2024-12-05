import React, { useEffect, useState } from "react";
import api from "../api";
import { Test } from "../testGroupComponents/types";
import AddTestFromFileModal from "./AddTestFromFileModal";
import TestTile from "./TestTile";
import "./TestDashboard.css";


const TestDashboard: React.FC = () => {
    const [tests, setTests] = useState<Test[]>([]);
    const [currentTest, setCurrentTest] = useState<Test | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleAddTests = (tests: Test[]) => {
        setTests((prevTests) => [...prevTests, ...tests]);
    }

    // Grab tests from DB on load
    useEffect(() => {
        api
            .get("/api/test")
            .then((res) => {
                setTests(res.data);
            });
    }, []); // Only run on first render

    // Update list of tests
    const updateTest = (result: Boolean, output: string) => {
    };

    // const handleEditTest = (
    //     updatedTest: { testId: number, name: string,  }
    // ) => {
    //     if (currentTest === null) return;
    //     // Update in DB
    //     api
    //         .put(`api/test/${currentTest.testId}`) // Update DB
    //         .then((res) => {
    //             console.log("Updated test:", res.data);
    //             updateTest(currentTest); // Update side
    //         })
    //         .catch((error) => {
    //             console.error("Error updating test", error);
    //         })
    //     setIsEditModalOpen(false);
    // };
    const removeTest = (testId: number) => {
        // Call API to delete the test
        api
            .delete(`/api/test/${testId}`)
            .then(() => {
                // Success: Remove test from local state
                setTests((prevTests) => prevTests.filter((test) => test.testId !== testId));
                console.log(`Test with ID ${testId} removed successfully.`);
            })
            .catch((error) => {
                console.error(`Failed to remove test with ID ${testId}.`, error);
            });
    };

    return (
        <div className="test-dashboard-container">
            <div className="test-dashboard">
                {/* Add Test From File Button */}
                <button className="add-test-from-file" onClick={() => setIsModalOpen(true)}>
                    Add Test From File
                </button>
                <AddTestFromFileModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAddTests={handleAddTests}
                />
                {tests.map((test) => (
                    <div key={test.testId}>
                        <TestTile
                            test={test}
                            onUpdateTest={updateTest}
                            onRemoveTest={removeTest}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TestDashboard;
