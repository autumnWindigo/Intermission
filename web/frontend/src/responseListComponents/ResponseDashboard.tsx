import { useEffect, useState } from "react";
import api from "../api";
import { TestGroup } from "../testGroupComponents/types";
import ResponseTile from "./ResponseTile";

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
        <div className="dashboard-container">
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
