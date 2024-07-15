import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/solid';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
        console.log("showing toast");
      setIsVisible(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
    error: <XCircleIcon className="w-6 h-6 text-red-500" />,
    warning: <ExclamationCircleIcon className="w-6 h-6 text-yellow-500" />,
    info: <InformationCircleIcon className="w-6 h-6 text-blue-500" />,
  };

  const colors = {
    success: 'bg-green-100 border-green-300 text-green-800',
    error: 'bg-red-100 border-red-300 text-red-800',
    warning: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    info: 'bg-blue-100 border-blue-300 text-blue-800',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          className={`fixed z-50 bottom-4 right-4 flex items-center p-4 rounded-lg shadow-lg border ${colors[type]}`}
        >
          <div className="flex-shrink-0">{icons[type]}</div>
          <div className="ml-3 font-medium">{message}</div>
          <button
            onClick={() => setIsVisible(false)}
            className="ml-4 text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <XCircleIcon className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;