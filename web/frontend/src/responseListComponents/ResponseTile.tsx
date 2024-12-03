//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** Response Tiles used in Response Tile Dashboard

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
            <button onClick={toggleExpansion}>
                {isExpanded ? "Collapse" : "Expand"}
            </button>
            {group.results.sort((a,b) => // sort to show most recent first
                b.createdAt.toLocaleString().localeCompare(a.createdAt.toLocaleString()))
                .map((result) => ( // map to components
                <div className={`expanded-content ${isExpanded ? "expanded" : ""}`}>
                    {isExpanded && <>
                        <p>{new Date(result.createdAt).toLocaleString()}</p>
                        <div key="result-shorthand">
                            {loadResultShorthand(result.overallSuccess)}
                        </div>
                        <ResponeDetails result={result} />
                    </>}
                </div>
            ))}
        </div>
    )
}

export default ResponseTile;
