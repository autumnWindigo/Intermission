//*** Andrew Kantner
//*** Database Management Systems
//*** December 5
//*** Modal for editing existing test groups

import React, { useState } from "react";
import * as cron from 'cron-validator';

interface EditTestGroupModalProps {
    // Modal Specific
    isOpen: boolean
    onClose: () => void;
    onEditGroup: (updatedGroup: {testGroupId: number, name: string, schedule: string | null}) => void;

    // Test Group Data
    currentName: string;
    currentSchedule: string | null;
    currentId: number;
    // Only name & schedule updated through menu
    // Tests handled by seperate modal due to complexity
    // VV Callback to handle DB save when closing
}

const EditTestGroupModal: React.FC<EditTestGroupModalProps> = ({
    isOpen,
    currentName,
    currentSchedule,
    currentId,
    onClose,
    onEditGroup
}) => {
    const [name, setName] = useState(currentName);
    const [schedule, setSchedule] = useState(currentSchedule);
    const [testGroupId, setTestGroupId] = useState(currentId);
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

    const handleModalClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };

    const handleEditTest = (() => {
        onEditGroup({testGroupId, name, schedule});
        onClose();
    });

    // == modal ==

    // if not open don't render modal
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={handleModalClick}>
                <div className="modal-content">
                    {/* Maybe replace close button with X in the corner? */}
                    <h4>Edit Test Group</h4>
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
                    <button onClick={handleEditTest} disabled={!isValidCron}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditTestGroupModal;
