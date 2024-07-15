import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import PageCanvas from '../components/PageCanvas';
import ConfigModal from '../components/ConfigModal';
import { ArrowLeftIcon, DownloadIcon, MenuIcon, MoonIcon, SaveIcon, SunIcon } from '@heroicons/react/solid';
import { baseurl } from '../constant';
import Toast from '../components/Toast';
import Loader from '../components/Loader';

const Workspace = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [workspace, setWorkspace] = useState(null);
    const [elements, setElements] = useState([]);
    const [selectedElement, setSelectedElement] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({});
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const isInitialMount = useRef(true);
    const token = localStorage.getItem('token');
    const [darkMode, setDarkMode] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [canvasColor, setCanvasColor] = useState('#ffffff');
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    const handleCanvasColorChange = (newColor) => {
        setCanvasColor(newColor);
        setHasUnsavedChanges(true);
      };

    useEffect(() => {
        fetchWorkspace();
        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);
        return () => window.removeEventListener('resize', updateCanvasSize);
    }, [id]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [selectedElement]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            // saveWorkspace();
        }
    }, [elements]);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [hasUnsavedChanges]);

    const fetchWorkspace = async () => {
        try {
            const res = await axios.get(`${baseurl}/workspaces/${id}`, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                }
            });
            setWorkspace(res.data);
            setElements(res.data.elements || []);
            setCanvasColor(res.data.canvasColor || '#ffffff');
            showToast('Saved workspace fetched successfully', 'success');
        } catch (error) {
            console.error('Error fetching workspace:', error);
            showToast('Failed to fetch saved workspace', 'error');
            if (error.response && error.response.status === 401) {
                navigate('/login');
            }
        }
    };

    const saveWorkspace = async () => {
        try {
            await axios.put(`${baseurl}/workspaces/${id}`, {
                name: workspace?.name,
                elements: elements,
                canvasColor: canvasColor,
            }, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                }
            });
            showToast('Workspace saved successfully', 'success');
            setHasUnsavedChanges(false);
        } catch (error) {
            console.error('Error saving workspace:', error);
            showToast('Error saving workspace', 'error');
            if (error.response && error.response.status === 401) {
                navigate('/login');
            }
        }
    };

    const updateCanvasSize = () => {
        const canvas = document.getElementById('page-canvas');
        if (canvas) {
            setCanvasSize({ width: canvas.offsetWidth, height: canvas.offsetHeight });
        }
    };

    const handleDrop = (type, x, y) => {
        setSelectedElement(null);
        const newElement = {
            id: Date.now(),
            type,
            x,
            y,
            content: '',
            width: 100,
            height: 40,
            color: '#000000',
            shape: 'rectangle',
        };
        setModalConfig(newElement);
        setShowModal(true);
        setHasUnsavedChanges(true);
    };

    const handleConfigSave = (config) => {
        if (selectedElement && config.id === selectedElement.id) {
            setElements(prevElements => prevElements.map(el => el.id === selectedElement.id ? { ...el, ...config } : el));
        } else {
            setElements(prevElements => [...prevElements, config]);
        }
        setShowModal(false);
        setSelectedElement(null);
        setHasUnsavedChanges(true);
    };

    const handleElementSelect = (element) => {
        setSelectedElement(element);
        document.getElementById('page-builder-container').focus();
    };

    const handleElementMove = (id, x, y) => {
        setElements(prevElements => prevElements.map(el => el.id === id ? { ...el, x, y } : el));
        setHasUnsavedChanges(true);
    };

    const handleElementResize = (id, width, height) => {
        setElements(prevElements => prevElements.map(el => el.id === id ? { ...el, width, height } : el));
        setHasUnsavedChanges(true);
    };

    const handleElementDelete = (id) => {
        setElements(prevElements => prevElements.filter(el => el.id !== id));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && selectedElement) {
            e.preventDefault();
            setModalConfig(selectedElement);
            setShowModal(true);
        } else if (e.key === 'Delete' && selectedElement) {
            handleElementDelete(selectedElement.id);
            setSelectedElement(null);
            setHasUnsavedChanges(true);
        }
    };

    const handleGoBack = () => {
        navigate('/dashboard');
    };

    const handleExportJSON = () => {
        if (!workspace) return;
    
        const exportData = {
            userId: workspace.user, 
            elements: elements,
            workspaceName:workspace.name,
            canvasColor: canvasColor,
            createdAt: workspace.createdAt, 
            updatedAt: workspace.updatedAt
        };
    
        const dataStr = JSON.stringify(exportData, null, 2); 
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `${workspace.name}_export.json`;
    
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
        console.log("toggle", sidebarOpen);
    };

    if (!workspace) {
        return (
            <Loader />
        );
    }

    return (
        <div onKeyDown={handleKeyPress} className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        {!sidebarOpen && (<button
                            onClick={toggleSidebar}
                            className="mr-4 text-blue-500 focus:outline-none"
                        >
                            <MenuIcon className="h-6 w-6" />
                        </button>)}
                        <h1 className={`text-2xl sm:text-3xl flex items-center font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {workspace?.name}
                            {hasUnsavedChanges && (
                                <span className="ml-2 text-xs font-medium text-black rounded-lg px-2 py-1 bg-yellow-400">
                                    Unsaved changes
                                </span>
                            )}
                        </h1>
                    </div>
                    <div className="flex space-x-2 sm:space-x-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleGoBack}
                            className={`flex items-center px-2 sm:px-4 py-2 border ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'} text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
                        >
                            <ArrowLeftIcon className="h-5 w-5 sm:mr-2 text-blue-500" />
                            <span className="hidden sm:inline">Back</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={saveWorkspace}
                            disabled={!hasUnsavedChanges}
                            className={`flex items-center px-2 sm:px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${darkMode
                                ? hasUnsavedChanges ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 cursor-not-allowed'
                                : hasUnsavedChanges ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200`}
                        >
                            <SaveIcon className="h-5 w-5 sm:mr-2" />
                            <span className="hidden sm:inline">Save</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleExportJSON}
                            className={`flex items-center px-2 sm:px-4 py-2 border ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'} text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
                        >
                            <DownloadIcon className="h-5 w-5 sm:mr-2 text-blue-500" />
                            <span className="hidden sm:inline">Export</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleDarkMode}
                            className={`p-2 rounded-full ${darkMode ? 'bg-yellow-400' : 'bg-gray-800'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
                        >
                            {darkMode ? (
                                <SunIcon className="h-5 w-5 text-gray-900" />
                            ) : (
                                <MoonIcon className="h-5 w-5 text-white" />
                            )}
                        </motion.button>
                    </div>
                </div>
            </div>
            <div id="page-builder-container" className="flex flex-1 overflow-hidden" tabIndex="0">
                <Sidebar
                    darkMode={darkMode}
                    isOpen={sidebarOpen}
                    onClose={toggleSidebar}
                    canvasColor={canvasColor}
                    onCanvasColorChange={handleCanvasColorChange}
                />
                <PageCanvas
                    elements={elements}
                    onDrop={handleDrop}
                    onElementSelect={handleElementSelect}
                    onElementMove={handleElementMove}
                    onElementResize={handleElementResize}
                    selectedElement={selectedElement}
                    canvasSize={canvasSize}
                    darkMode={darkMode}
                    canvasColor={canvasColor}
                />
                <AnimatePresence>
                    {showModal && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
                        >
                            <ConfigModal
                                config={modalConfig}
                                onSave={handleConfigSave}
                                onClose={() => setShowModal(false)}
                                canvasSize={canvasSize}
                                darkMode={darkMode}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Workspace;