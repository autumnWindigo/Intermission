//*** Andrew Kantner, Antonio Cima
//*** Database Management Systems
//*** December 5
//*** Test Tiles used in Test Tile Dashboard

import React, {useState} from "react";
import { Test } from "../testGroupComponents/types";
import testRunApi from "../testRunApi";
import { FaPlay } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";

interface TestTileProps {
    test: Test, // Test object obvious
    // For editing tests (need to update parent)
    onUpdateTest: (result: Boolean, output: string) => void,
    onRemoveTest: (testId: number) => void; // New prop for removing test
};

// Tile to be in a list of tests.
// Should be thin & scrollable cause list but that css junk.
const TestTile: React.FC<TestTileProps> = ({
    test,
    onUpdateTest,
    onRemoveTest
}) => {
    const [isTestRunning, setIsTestRunning] = useState(false);

    // DONT USE YET
    // I need to update the backend still to like
    // make this api call exist
    const handleRunTest = () => {
        setIsTestRunning(true);
        testRunApi
            .post(`/api/test/${test.testId}/run-test`)
            .then((response) => {
                console.log("Completed running test:", response);
                const res = response.data;
                onUpdateTest(res.result, res.output);
            })
            .catch((error) => {
                console.log(test)
                console.error("Error Running test", error);
            })
            .finally(() => {
                setIsTestRunning(false);
            })
    }

    /* this should hold
    button to run test
    button to edit test
    only return boolean and output from pytest (not saved in DB)
      test groups should be used for long term tracking.
    */
    const handleRemoveTest = () => {
        console.log("Remove button clicked for test", test.testId);
        onRemoveTest(test.testId); // Pass the testId back to the parent component
    };
    return (
        <div className='test-tile'>
            <button onClick={handleRunTest} disabled={isTestRunning}>
                {isTestRunning ? ( <ImSpinner2 className="spinner-icon" /> ) : ( <FaPlay className="play-icon" />)}
            </button>
            <button onClick={handleRemoveTest} className="Remove-test">Remove</button>
            <div className='test-name'>
                {test.testName}
            </div>
            {/* Corrected line */}
        </div>
    )
};

export default TestTile;
