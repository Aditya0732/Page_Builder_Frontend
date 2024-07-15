import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';

const Pagination = ({ totalItems, itemsPerPage, currentPage, paginate, setItemsPerPage }) => {
    const pageNumbers = Math.ceil(totalItems / itemsPerPage);
    
    const adjustedCurrentPage = Math.min(currentPage, pageNumbers);
    
    const startIndex = Math.min((adjustedCurrentPage - 1) * itemsPerPage + 1, totalItems);
    const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems);

    const pageRange = 3;
    const rangeStart = Math.max(1, adjustedCurrentPage - pageRange);
    const rangeEnd = Math.min(pageNumbers, adjustedCurrentPage + pageRange);

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        const newCurrentPage = Math.floor((startIndex - 1) / newItemsPerPage) + 1;
        paginate(newCurrentPage);
    };

    return (
        <div className="mt-8 flex flex-col items-center p-6 rounded-lg shadow-lg">
            <div className="mb-4 text-gray-700 font-semibold">
                Showing <span className="text-blue-600">{startIndex}</span> to <span className="text-blue-600">{endIndex}</span> of <span className="text-blue-600">{totalItems}</span> entries
            </div>
            <div className="flex items-center mb-6">
                <span className="mr-2 text-gray-700">Entries per page:</span>
                <select
                    value={itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                    className="border rounded-md px-3 py-2 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>
            </div>
            <div className="flex items-center space-x-2">
                <PaginationButton
                    onClick={() => paginate(Math.max(1, adjustedCurrentPage - 1))}
                    disabled={adjustedCurrentPage === 1}
                >
                    <ChevronLeftIcon className="h-5 w-5" />
                </PaginationButton>

                {rangeStart > 1 && (
                    <>
                        <PaginationButton onClick={() => paginate(1)}>1</PaginationButton>
                        {rangeStart > 2 && <span className="text-gray-500">...</span>}
                    </>
                )}

                {Array.from({ length: rangeEnd - rangeStart + 1 }, (_, i) => (
                    <PaginationButton
                        key={rangeStart + i}
                        onClick={() => paginate(rangeStart + i)}
                        active={adjustedCurrentPage === rangeStart + i}
                    >
                        {rangeStart + i}
                    </PaginationButton>
                ))}

                {rangeEnd < pageNumbers && (
                    <>
                        {rangeEnd < pageNumbers - 1 && <span className="text-gray-500">...</span>}
                        <PaginationButton onClick={() => paginate(pageNumbers)}>{pageNumbers}</PaginationButton>
                    </>
                )}

                <PaginationButton
                    onClick={() => paginate(Math.min(pageNumbers, adjustedCurrentPage + 1))}
                    disabled={adjustedCurrentPage === pageNumbers}
                >
                    <ChevronRightIcon className="h-5 w-5" />
                </PaginationButton>
            </div>
        </div>
    );
};

const PaginationButton = ({ children, onClick, active, disabled }) => (
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        disabled={disabled}
        className={`
            w-10 h-10 flex items-center justify-center rounded-full
            ${active
                ? 'bg-blue-500 text-white'
                : disabled
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
            }
            transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500
        `}
    >
        {children}
    </motion.button>
);

export default Pagination;