import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTag, FaKeyboard, FaMousePointer, FaImage, FaShapes, FaPalette } from 'react-icons/fa';

const ConfigModal = ({ config, onSave, onClose, canvasSize, darkMode }) => {
    const [localConfig, setLocalConfig] = useState(config);

    useEffect(() => {
        setLocalConfig(config);
    }, [config]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        let newValue = type === 'number' ? parseFloat(value) : value;

        setLocalConfig(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setLocalConfig(prev => ({ ...prev, content: event.target.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(localConfig);
    };

    const getIcon = (type) => {
        switch (type) {
            case 'Label': return FaTag;
            case 'Input': return FaKeyboard;
            case 'Button': return FaMousePointer;
            case 'Image': return FaImage;
            case 'Shape': return FaShapes;
            default: return FaTag;
        }
    };

    const Icon = getIcon(config.type);

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
        exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2, ease: "easeIn" } }
    };

    const inputVariants = {
        focus: { scale: 1.05, transition: { duration: 0.2 } },
        blur: { scale: 1, transition: { duration: 0.2 } }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        >
            <div className={`bg-white p-6 rounded-lg max-w-md w-full ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-white' : 'bg-gradient-to-br from-white to-gray-100 text-gray-800'}`}>
                <div className="flex items-center mb-4">
                    <Icon className={`text-3xl ${darkMode ? 'text-blue-400' : 'text-blue-600'} mr-3`} />
                    <h2 className="text-2xl font-bold">Configure {config.type}</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">X:</label>
                            <motion.input
                                type="number"
                                name="x"
                                value={localConfig.x}
                                onChange={handleChange}
                                className={`w-full border p-2 rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                                required
                                variants={inputVariants}
                                whileFocus="focus"
                                whileBlur="blur"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Y:</label>
                            <motion.input
                                type="number"
                                name="y"
                                value={localConfig.y}
                                onChange={handleChange}
                                className={`w-full border p-2 rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                                required
                                variants={inputVariants}
                                whileFocus="focus"
                                whileBlur="blur"
                            />
                        </div>
                    </div>
                    {config.type !== 'Label' && (<div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">Width:</label>
                            <motion.input
                                type="number"
                                name="width"
                                value={localConfig.width}
                                onChange={handleChange}
                                className={`w-full border p-2 rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                                required
                                variants={inputVariants}
                                whileFocus="focus"
                                whileBlur="blur"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Height:</label>
                            <motion.input
                                type="number"
                                name="height"
                                value={localConfig.height}
                                onChange={handleChange}
                                className={`w-full border p-2 rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                                required
                                variants={inputVariants}
                                whileFocus="focus"
                                whileBlur="blur"
                            />
                        </div>
                    </div>)}
                    {config.type === 'Label' && (
                        <>
                            <div>
                                <label className="block mb-2">Font Size:</label>
                                <motion.input
                                    type="number"
                                    name="fontSize"
                                    value={localConfig.fontSize || 16}
                                    onChange={handleChange}
                                    className={`w-full border p-2 rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                                    required
                                    variants={inputVariants}
                                    whileFocus="focus"
                                    whileBlur="blur"
                                />
                            </div>
                            <div>
                                <label className="block mb-2">Font Weight:</label>
                                <motion.select
                                    name="fontWeight"
                                    value={localConfig.fontWeight || 'normal'}
                                    onChange={handleChange}
                                    className={`w-full border p-2 rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                                    variants={inputVariants}
                                    whileFocus="focus"
                                    whileBlur="blur"
                                >
                                    <option value="normal">Normal</option>
                                    <option value="bold">Bold</option>
                                    <option value="lighter">Lighter</option>
                                    <option value="bolder">Bolder</option>
                                </motion.select>
                            </div>
                        </>
                    )}
                    {config.type !== 'Image' && config.type !== 'Shape' && (
                        <div>
                            <label className="block mb-2">{config.type === 'Input' ? 'Placeholder' : 'Content'}:</label>
                            <motion.input
                                type="text"
                                name="content"
                                value={localConfig.content}
                                onChange={handleChange}
                                className={`w-full border p-2 rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                                required
                                variants={inputVariants}
                                whileFocus="focus"
                                whileBlur="blur"
                            />
                        </div>
                    )}
                    {(config.type === 'Label' || config.type === 'Input' || config.type === 'Button' || config.type === 'Shape') && (
                        <div>
                            <label className="block mb-2">Color:</label>
                            <div className="flex items-center">
                                <FaPalette className={`text-xl mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                <motion.input
                                    type="color"
                                    name="color"
                                    value={localConfig.color}
                                    onChange={handleChange}
                                    className="w-full h-10 cursor-pointer"
                                    variants={inputVariants}
                                    whileFocus="focus"
                                    whileBlur="blur"
                                />
                            </div>
                        </div>
                    )}
                    {config.type === 'Image' && (
                        <div>
                            <label className="block mb-2">Image:</label>
                            <ImageUpload
                                darkMode={darkMode}
                                content={localConfig.content}
                                onChange={(file) => {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                        setLocalConfig(prev => ({ ...prev, content: event.target.result }));
                                    };
                                    reader.readAsDataURL(file);
                                }}
                            />
                        </div>
                    )}
                    {config.type === 'Shape' && (
                        <div>
                            <label className="block mb-2">Shape:</label>
                            <motion.select
                                name="shape"
                                value={localConfig.shape}
                                onChange={handleChange}
                                className={`w-full border p-2 rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                                required
                                variants={inputVariants}
                                whileFocus="focus"
                                whileBlur="blur"
                            >
                                <option value="rectangle">Rectangle</option>
                                <option value="circle">Circle</option>
                                <option value="triangle">Triangle</option>
                            </motion.select>
                        </div>
                    )}
                    <div className="flex justify-end space-x-2">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={onClose}
                            className={`px-4 py-2 rounded ${darkMode ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className={`px-4 py-2 rounded ${darkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                        >
                            Save
                        </motion.button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

const ImageUpload = ({ darkMode, content, onChange }) => {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onChange(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            onChange(e.target.files[0]);
        }
    };

    return (
        <div
            className={`relative p-4 mt-2 border-2 border-dashed rounded-lg transition-colors ${darkMode
                    ? dragActive
                        ? 'border-blue-400 bg-blue-900'
                        : 'border-gray-600 bg-gray-800'
                    : dragActive
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-300 bg-gray-50'
                }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="text-center">
                {content ? (
                    <img src={content} alt="Preview" className="mx-auto max-w-full h-40 object-contain mb-4" />
                ) : (
                    <FaImage className={`mx-auto text-5xl mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                )}
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Drag and drop an image here, or click to select a file
                </p>
            </div>
        </div>
    );
};

export default ConfigModal;