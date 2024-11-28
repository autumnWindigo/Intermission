import React, { useState } from "react";
import TestGroupDashboard from "../testGroupComponents/TestGroupDashboard";
import TestDashboard from "../testListComponents/TestDashboard";
import './DashboardLayout.css';

// Parent to dashboards treat this as Main
const DashboardLayout: React.FC = () => {
    const [currentDashboard, setCurrentDashboard] = useState('testGroupDashboard');

    // Set dashboard based on button press
    const loadDashboard = () => {
        switch (currentDashboard) {
            case 'testGroupDashboard':
                return <TestGroupDashboard />;
            case 'testDashboard':
                return <TestDashboard />;
            default:
                return <p> No Dashboard Selected! </p>;
        }
    };

    return (
        <div className="dashboard-layout">
            {/* SideBar (have on top) */}
            <aside className="sidebar">
                {/* Add buttons to activate dashboards here */}
                <button onClick={() => setCurrentDashboard('testGroupDashboard')}>Test Groups</button>
                <button onClick={() => setCurrentDashboard('testDashboard')}>Tests</button>
                <button onClick={() => setCurrentDashboard('temp')}>Temp</button>
            </aside>

            {/* Header */}
            <div className="dashboard-content">
                <header className="top-bar">
                    {currentDashboard}
                </header>

                {/* Dashboard Window: all new pages should be designed to fit in here */}
                <div className="dashboard-window">
                    {loadDashboard()}
                </div>
            </div>
        </div>
    );
}

export default DashboardLayout;
