import React, { useEffect, useState} from "react";
import api from "../api";
import { Test } from "../testGroupComponents/types";
import TestTile from "./TestTile";

const TestDashboard: React.FC = () => {
    const [tests, setTests] = useState<Test[]>([]);
    const [currentTest, setCurrentTest] = useState<Test | null>(null);
    // const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
    const removeTest = (testID: number) => {
        api
            .delete("/api/test/number")
    };
    return(
        <div className="test-dashboard-container">
            <div className="test-dashboard">
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
