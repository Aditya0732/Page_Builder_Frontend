import { SearchIcon } from '@heroicons/react/solid'
import React from 'react'
import {motion} from "framer-motion"
const NoMatchingWorkSpaces = ({searchTerm,handleClick}) => {
  return (
    <>
    <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 120 }}
    >
        <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    </motion.div>
    <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-6 text-2xl font-medium text-gray-700"
    >
        No matching workspaces
    </motion.h3>
    <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-2 text-sm text-gray-500"
    >
        No workspaces match your search term "{searchTerm}"
    </motion.p>
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-8"
    >
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
            <SearchIcon className="h-5 w-5 mr-2" />
            Clear Search
        </motion.button>
    </motion.div>
</>
  )
}

export default NoMatchingWorkSpaces