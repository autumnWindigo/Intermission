import { useEffect, useState } from "react";
import api from "../api";
import { TestGroup } from "../testGroupComponents/types";
import ResponseTile from "./ResponseTile";
import './ResponseDashboard.css';

const ResponseDashboard: React.FC = () => {
    const [testGroups, setTestGroups] = useState<TestGroup[]>([]);

    useEffect(() => {
        api
            .get("/api/test-group")
            .then((res) => {
                setTestGroups(res.data)
            })
    }, []);

    return (
        <div className="results-dashboard">
            <div className="dashboard">
                {testGroups.map((group) => (
                    <div key={group.testGroupId}>
                        <ResponseTile group={group} key={group.testGroupId} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ResponseDashboard;
