//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** holds expandable details for reach response

import { useState } from "react";
import { TestResult } from "../testGroupComponents/types"
import AnsiToHtml from 'ansi-to-html';
import FailSquare from "./FailSquare";
import PassCircle from "./PassCircle";

interface ResponseDetailsProps {
    result: TestResult
}

const ResponeDetails: React.FC<ResponseDetailsProps> = ({ result }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const AnsiToHtmlConverter = new AnsiToHtml();

    const toggleExpansion = () => {
        setIsExpanded((prev) => !prev);
    }

    // Load symbol
    // This is extremely extra but I'm too lazy to change now
    const loadResultShorthand = (result: Boolean) => {
        if (result) return <PassCircle />;
        return <FailSquare />
    }

    // Convert pytest output to something readable to humans
    //   with colors!
    const cleanOutput = (output: string) => {
        return AnsiToHtmlConverter.toHtml(output).replace(/\n/g, '<br />');
    };


    return (
        <div className="reponse-details">
            <button onClick={toggleExpansion}>
                {loadResultShorthand(result.overallSuccess)}
                <p>{new Date(result.createdAt).toLocaleString()}</p>
            </button>
            <div className={`expanded-details ${isExpanded ? "expanded" : ""}`}>
                {isExpanded && <>
                    <div>Passed: {result.passedSubtests}</div>
                    <div>Failed: {result.failedSubtests}</div>
                    <div dangerouslySetInnerHTML={{ __html: cleanOutput(result.output) }} />
                </>}
            </div>
        </div>
    )
}

export default ResponeDetails;
