import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <motion.div
        className="flex space-x-2"
        animate={{
          scale: [1, 1.2, 1.2, 1, 1],
          rotate: [0, 0, 270, 270, 0],
          borderRadius: ["20%", "20%", "50%", "50%", "20%"],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          times: [0, 0.2, 0.5, 0.8, 1],
          repeat: Infinity,
          repeatDelay: 1
        }}
      >
        <motion.div
          className="w-6 h-6 bg-blue-500"
          animate={{ y: ["0%", "-50%", "0%"] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div
          className="w-6 h-6 bg-purple-500"
          animate={{ y: ["0%", "-50%", "0%"] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", delay: 0.1 }}
        />
        <motion.div
          className="w-6 h-6 bg-indigo-500"
          animate={{ y: ["0%", "-50%", "0%"] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
        />
      </motion.div>
    </div>
  );
};

export default Loader;