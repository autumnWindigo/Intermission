//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** Test Tiles used in Test Tile Dashboard

import React, {useState} from "react";
import { Test } from "../testGroupComponents/types";
import testRunApi from "../testRunApi";

interface TestTileProps {
    test: Test, // Test object obvious
    // For editing tests (need to update parent)
    onUpdateTest: (updatedTest: Test) => void;
};

// Tile to be in a list of tests.
// Should be thin & scrollable cause list but that css junk.
const TestTile: React.FC<TestTileProps> = ({
    test,
    onUpdateTest,
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
                onUpdateTest(response.data);
            })
            .catch((error) => {
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
    return (
        <div className='test-tile'>

        </div>
    );


}
