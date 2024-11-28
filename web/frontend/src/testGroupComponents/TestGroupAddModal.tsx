import React, { useState } from "react";

interface TestGroupAddModalProps {
    isOpen: Boolean;
    onClose: () => void;
    onAddGroup: (newGroupName: string) => void;
};

const TestGroupAddModal: React.FC<TestGroupAddModalProps> = ({
    isOpen,
    onClose,
    onAddGroup,
}) => {
    const [name, setName] = useState<string>("");

    // Don't close out of modal if clicking IN modal
    const handleModalClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }

    const handleCreateGroup = () => {
        onAddGroup(name);
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={handleModalClick}>
                <h4>Enter Name For New Test Group</h4>
                <input
                    className="name-input"
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                />
                <button onClick={handleCreateGroup}>Create Group</button>
            </div>
        </div>
    )
}

export default TestGroupAddModal;
