import React, { useState } from "react";
import { TestGroup } from "../testGroupComponents/types";
import PassCircle from "./PassCircle";
import FailSquare from "./FailSquare";
import ResponeDetails from "./ResponseDetails";

interface ResponseTileProps {
    group: TestGroup;
};

const ResponseTile: React.FC<ResponseTileProps> = ({ group }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpansion = () => {
        setIsExpanded((prev) => !prev);
    }

    const loadResultShorthand = (result: Boolean) => {
        if (result) return <PassCircle />;
        return <FailSquare />
    }

    return (
        <div className="response-tile">
            <h3>{group.name}</h3>
            {group.results.map((result) => (
                <>
                    <div key="result-shorthand">
                        {loadResultShorthand(result.overallSuccess)}
                    </div>
                    <p>{result.createdAt.toString()}</p>
                    <button onClick={toggleExpansion}>
                        {isExpanded ? "Collapse" : "Expand"}
                    </button>
                    <div className={`expanded-content ${isExpanded ? "expanded" : ""}`}>
                        {isExpanded && <ResponeDetails result={result} />}
                    </div>
                </>
            ))}
        </div>
    )
}
