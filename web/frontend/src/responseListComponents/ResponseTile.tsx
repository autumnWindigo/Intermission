//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** Response Tiles used in Response Tile Dashboard

import React, { useState } from "react";
import { TestGroup } from "../testGroupComponents/types";
import ResponeDetails from "./ResponseDetails";

interface ResponseTileProps {
    group: TestGroup;
};

const ResponseTile: React.FC<ResponseTileProps> = ({ group }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpansion = () => {
        setIsExpanded((prev) => !prev);
    }


    return (
        <div className="response-tile" key={group.testGroupId}>
            <div className="response-tile-header">
                <button onClick={toggleExpansion}>
                <h3>{group.name}</h3>
                </button>
            </div>
            {group.results.sort((a, b) => // sort to show most recent first
                b.createdAt.toLocaleString().localeCompare(a.createdAt.toLocaleString()))
                .map((result) => ( // map to components
                    <div className={`expanded-content ${isExpanded ? "expanded" : ""}`}>
                        {isExpanded && <>
                            <ResponeDetails result={result} />
                        </>}
                    </div>
                ))}
        </div>
    )
}

export default ResponseTile;
