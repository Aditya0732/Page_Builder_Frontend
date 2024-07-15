import { LogoutIcon } from '@heroicons/react/solid';
import React from 'react'
import AlmaBuildLogo from './AlmaBuildLogo';
import {motion} from "framer-motion"

const Navbar = ({ handleLogout }) => (
    <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <div className="flex-shrink-0 flex items-center">
                    <AlmaBuildLogo />
                </div>
                <div className="flex items-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none transition duration-300 ease-in-out shadow-lg"
                    >
                        <LogoutIcon className="h-5 w-5 mr-2" />
                        <span>Logout</span>
                    </motion.button>
                </div>
            </div>
        </div>
    </nav>
);

export default Navbar