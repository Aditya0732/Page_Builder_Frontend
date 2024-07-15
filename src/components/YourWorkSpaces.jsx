import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/solid';
import { workspaceImages } from '../constant';
import NoWorkSpaceComponent from './NoWorkSpaceComponent';
import NoMatchingWorkSpaces from './NoMatchingWorkSpaces';

const YourWorkSpaces = ({ 
    filteredWorkspaces, 
    workspaces, 
    currentWorkspaces, 
    searchTerm, 
    setIsModalOpen, 
    setSearchTerm 
}) => {
    if (filteredWorkspaces.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16"
            >
                {workspaces.length === 0 ? (
                    <NoWorkSpaceComponent
                        handleClick={() => setIsModalOpen(true)}
                    />
                ) : (
                    <NoMatchingWorkSpaces
                        handleClick={() => setSearchTerm('')}
                        searchTerm={searchTerm}
                    />
                )}
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
        >
            <CreateWorkspaceCard setIsModalOpen={setIsModalOpen} />

            {currentWorkspaces.map((workspace, index) => (
                <WorkspaceCard key={workspace._id} workspace={workspace} index={index} />
            ))}
        </motion.div>
    );
};

const CreateWorkspaceCard = ({ setIsModalOpen }) => (
    <motion.div
        whileHover={{ scale: 1.03, boxShadow: "0px 10px 30px rgba(0,0,0,0.1)" }}
        className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer transform transition duration-300 ease-in-out"
        onClick={() => setIsModalOpen(true)}
    >
        <div className="p-8 flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-100 to-purple-100">
            <PlusIcon className="h-16 w-16 text-blue-500 mb-4" />
            <span className="text-xl font-semibold text-gray-800">Create New Workspace</span>
        </div>
    </motion.div>
);

const WorkspaceCard = ({ workspace, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        whileHover={{ scale: 1.03, boxShadow: "0px 10px 30px rgba(0,0,0,0.1)" }}
        className="bg-white rounded-2xl shadow-md overflow-hidden transform transition duration-300 ease-in-out"
    >
        <Link to={`/workspace/${workspace._id}`}>
            <div className="relative h-48">
                <img
                    src={workspaceImages[index % 3]}
                    alt="Workspace"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="p-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">{workspace.name}</h2>
                <p className="text-gray-600 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    {workspace.elements ? workspace.elements.length : 0} elements
                </p>
            </div>
        </Link>
    </motion.div>
);

export default YourWorkSpaces;