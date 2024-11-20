import React, { useState } from "react";
import cron from 'cron-validator';
import api from "../api";

interface EditTestGroupModalProps {
    // Modal Specific
    isOpen: boolean
    onClose: () => void;

    // Test Group Data
    testGroupId: number;
    currentName: string;
    currentSchedule: string | null;
    // Only name & schedule updated through menu
    // Tests handled by seperate modal due to complexity
    // VV Callback to handle DB save when closing
    onSave: (updatedGroup: { name: string; schedule: string | null }) => void;
}

const EditTestGroupModal: React.FC<EditTestGroupModalProps> = ({
    isOpen,
    onClose,
    testGroupId,
    currentName,
    currentSchedule,
    onSave,
}) => {
    const [name, setName] = useState(currentName);
    const [schedule, setSchedule] = useState(currentSchedule);
    // True by default because no cron is valid cron
    const [isValidCron, setIsValidCron] = useState(true);


    // alias: alias support for months and weekdays
    // allowBlankDay: enabled to mark days or weekdays blank with a ? symbol
    const validateCron = (cronValue: string) => {
        return cron.isValidCron(cronValue, { alias: true, allowBlankDay: true });
    };


    // == handlers ==

    // On schedule state change:
    // Validate cron & update cron
    const handleSceduleChange = (cron: string) => {
        setSchedule(cron);
        // If empty or valid -> true
        setIsValidCron(cron === "" || validateCron(cron));
    };

    // On save button press:
    // Update test in DB & Close Modal
    const handleSave = () => {
        const updatedTestGroup = { name, schedule: schedule || null };

        api
            .put(`/test-group/${testGroupId}`, updatedTestGroup)
            .then(() => {
                onSave(updatedTestGroup);
                onClose();
            })
            .catch((error) => {
                console.error("Error updateing test group:", error);
            });
    };

    // == modal ==

    // if not open don't render modal
    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                {/* Maybe replace close button with X in the corner? */}
                <h4>Edit Test Group</h4>
                <button onClick={onClose}>Close</button>

                {/* Inputs for editing TestGroup */}
                <div>
                    <label>
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(input) => setName(input.target.value)}
                    />
                    </label>
                </div>
                {/* Note: Includes checking for valid data!!! Show off!!! */}
                <div>
                    <label>
                    Schedule (Cron):
                    <input
                            type="text"
                            value={schedule || ""}
                            onChange={(input) => handleSceduleChange(input.target.value)}
                            placeholder="0 0 * * 0 (weekly)"
                    />
                    </label>
                    {/* Alert user if they don't know how cron works and need to google it */}
                    {!isValidCron && <p>Invalid cron!</p>}
                </div>
                {/* Only allow saves if all entries are valid */}
                <button onClick={handleSave} disabled={!isValidCron}>
                    Save
                </button>
            </div>
        </div>
    );
};

export default EditTestGroupModal;
