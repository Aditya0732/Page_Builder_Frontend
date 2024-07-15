import React from 'react';
import { motion } from 'framer-motion';
import { XIcon } from '@heroicons/react/solid';

const CreateWorkspaceModal = ({ isOpen, onClose, onCreateWorkspace }) => {
    const [newWorkspaceName, setNewWorkspaceName] = React.useState('');

    const handleCreateWorkspace = () => {
        if (newWorkspaceName.trim() === '') return;
        onCreateWorkspace(newWorkspaceName);
        setNewWorkspaceName('');
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">New Workspace</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                <input
                    type="text"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    placeholder="Enter workspace name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                />
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleCreateWorkspace}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                    >
                        Create Workspace
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default CreateWorkspaceModal;