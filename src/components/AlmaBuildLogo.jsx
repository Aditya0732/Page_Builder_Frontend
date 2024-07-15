import React from 'react'
import {motion} from "framer-motion"

const AlmaBuildLogo = () => (
    <svg className="h-8 w-auto" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="logo-gradient" x1="0" y1="0" x2="200" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3B82F6" />
                <stop offset="1" stopColor="#8B5CF6" />
            </linearGradient>
        </defs>

        <motion.text
            x="10"
            y="30"
            fontFamily="Arial, sans-serif"
            fontSize="28"
            fontWeight="bold"
            fill="url(#logo-gradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            AlmaBuild
        </motion.text>

        <motion.rect
            x="5"
            y="33"
            width="190"
            height="2"
            fill="url(#logo-gradient)"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ transformOrigin: '0 0' }}
        />
    </svg>
);

export default AlmaBuildLogo