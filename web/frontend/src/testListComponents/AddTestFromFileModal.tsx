import React, { useState } from "react";
import api from "../api";
import { Test } from "../testGroupComponents/types";

interface AddTestFromFileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddTests: (tests: Test[]) => void;
}

const AddTestFromFileModal: React.FC<AddTestFromFileModalProps> = ({
    isOpen,
    onClose,
    onAddTests,
}) => {
    const [fileName, setFileName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Don't close out of modal if clicking IN modal
    const handleModalClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };

    const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFileName(event.target.value);
    }

    const handleAddTestsFromFile = async () => {
        // Clear old messages
        setErrorMessage("");
        setSuccessMessage("");

        api.post(`/api/test/${fileName}/add-tests-from-file`)
            .then((res) => {
                setSuccessMessage(`Tests added successfully: ${res.data.tests.map((test: any) => test.testName).join(", ")}`);
                console.log(res.data.tests);
                onAddTests(res.data.tests);
                // Reset input once updated
                setFileName("");
            }).catch((error) => {
                setErrorMessage(error.response?.data?.error || "Failed to add tests from file.");
            });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={handleModalClick}>
                <h2>Add Test From File</h2>
                <p>Enter the test directory name to add tests:</p>
                <input
                    type="text"
                    value={fileName}
                    onChange={handleFileNameChange}
                    placeholder="Enter a test directory (e.g., unit_tests)"
                />
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
                <div className="modal-buttons">
                    <button onClick={handleAddTestsFromFile} disabled={!fileName}>
                        Add Tests
                    </button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default AddTestFromFileModal;
