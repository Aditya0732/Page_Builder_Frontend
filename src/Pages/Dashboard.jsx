import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { SearchIcon, SortAscendingIcon, SortDescendingIcon } from '@heroicons/react/solid';
import { useAuth } from '../contexts/AuthContext';
import { baseurl } from '../constant';
import CreateWorkspaceModal from '../components/CreateWorkspaceModal';
import Pagination from '../components/Pagination';
import YourWorkSpaces from '../components/YourWorkSpaces';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import Toast from '../components/Toast';

const Dashboard = () => {
    const [workspaces, setWorkspaces] = useState([]);
    const [filteredWorkspaces, setFilteredWorkspaces] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState('desc');
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    useEffect(() => {
        const fetchWorkspaces = async () => {
            try {
                const token = localStorage.getItem('token');
                setIsLoading(true);
                const res = await axios.get(`${baseurl}/workspaces`, {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                    }
                });
                const sortedWorkspaces = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setWorkspaces(sortedWorkspaces);
                setFilteredWorkspaces(sortedWorkspaces);
                setIsLoading(false);
                showToast('Workspaces fetched successfully', 'success');
            } catch (error) {
                console.error('Error fetching workspaces:', error);
                showToast('Failed to fetch workspaces', 'error');
                if (error.response && error.response.status === 401) {
                    navigate('/login');
                }
            }
        };

        fetchWorkspaces();
    }, [navigate]);

    useEffect(() => {
        const results = workspaces.filter(workspace =>
            workspace.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredWorkspaces(results);
        setCurrentPage(1);
    }, [searchTerm, workspaces]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleCreateWorkspace = async (newWorkspaceName) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${baseurl}/workspaces`,
                { name: newWorkspaceName },
                {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                    }
                }
            );
            const newWorkspace = { ...res.data, createdAt: new Date().toISOString() };
            const updatedWorkspaces = [newWorkspace, ...workspaces];
            setWorkspaces(updatedWorkspaces);
            setFilteredWorkspaces(updatedWorkspaces);
            setIsModalOpen(false);
            showToast('Workspace created successfully', 'success');
        } catch (error) {
            console.error('Error creating workspace:', error);
            showToast('Failed to create workspace', 'error');
            if (error.response && error.response.status === 401) {
                navigate('/login');
            }
        }
    };

    const handleSort = () => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);
        const sorted = [...filteredWorkspaces].sort((a, b) => {
            if (newSortOrder === 'asc') {
                return new Date(a.createdAt) - new Date(b.createdAt);
            } else {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });
        setFilteredWorkspaces(sorted);
    };

    const indexOfLastWorkspace = currentPage * itemsPerPage;
    const indexOfFirstWorkspace = indexOfLastWorkspace - itemsPerPage;
    const currentWorkspaces = filteredWorkspaces.slice(indexOfFirstWorkspace, indexOfLastWorkspace);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (isLoading) {
        return <Loader />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}
            <Navbar handleLogout={handleLogout} />
            <div className="max-w-7xl mx-auto p-4 sm:p-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 sm:mb-12"
                >
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
                        Your Workspaces
                    </h1>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                        <SortButton handleSort={handleSort} sortOrder={sortOrder} />
                    </div>
                </motion.div>

                <YourWorkSpaces
                    filteredWorkspaces={filteredWorkspaces}
                    workspaces={workspaces}
                    currentWorkspaces={currentWorkspaces}
                    searchTerm={searchTerm}
                    setIsModalOpen={setIsModalOpen}
                    setSearchTerm={setSearchTerm}
                />

                {filteredWorkspaces.length > 0 && (
                    <Pagination
                        totalItems={filteredWorkspaces.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        paginate={paginate}
                        setItemsPerPage={setItemsPerPage}
                    />
                )}
            </div>

            <AnimatePresence>
                <CreateWorkspaceModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onCreateWorkspace={handleCreateWorkspace}
                />
            </AnimatePresence>
        </div>
    );
};

const SearchBar = ({ searchTerm, setSearchTerm }) => (
    <div className="relative w-full sm:w-64">
        <input
            type="text"
            placeholder="Search workspaces..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
        />
        <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
    </div>
);

const SortButton = ({ handleSort, sortOrder }) => (
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSort}
        className="flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none transition duration-300 ease-in-out shadow-lg"
    >
        {sortOrder === 'asc' ? (
            <SortAscendingIcon className="h-5 w-5 mr-2" />
        ) : (
            <SortDescendingIcon className="h-5 w-5 mr-2" />
        )}
        <span>Sort {sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
    </motion.button>
);

export default Dashboard;