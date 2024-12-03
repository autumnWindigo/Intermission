//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** holds expandable details for reach response

import { useState } from "react";
import { TestResult } from "../testGroupComponents/types"

interface ResponseDetailsProps {
    result: TestResult
}

const ResponeDetails: React.FC<ResponseDetailsProps> = ({ result }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpansion = () => {
        setIsExpanded((prev) => !prev);
    }

    return (
        <div className="reponse-details">
            <button onClick={toggleExpansion}>
                {isExpanded ? "Collapse" : "Expand"}
            </button>
            <div className={`expanded-content ${isExpanded ? "expanded" : ""}`}>
                {isExpanded && <>
                    <div>Passed: {result.passedSubtests}</div>
                    <div>Failed: {result.failedSubtests}</div>
                    <p>Output: {result.output}</p>
                </>}
            </div>
        </div>
    )
}

export default ResponeDetails;
