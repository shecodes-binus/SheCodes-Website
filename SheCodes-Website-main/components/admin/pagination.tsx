import React from 'react';
// Assuming your icons are correctly imported from './icon' or './Icons'
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from './icon'; // Or './icon'

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    itemsPerPage: number;
    totalItems: number;
    startIndex: number;
    endIndex: number;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    totalItems,
    startIndex,
    endIndex
}) => {

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) { // Avoid re-triggering on current page
            onPageChange(page);
        }
    };

    // --- Button Styles ---
    // Base style for all interactive elements (arrows, numbers) for consistent padding/hover
    const baseButtonClass = "flex items-center justify-center px-2 h-8 leading-tight"; // Adjusted padding/height
    const textHoverClass = "hover:text-black"; // Use primary color for text hover
    const disabledClass = "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-grey-3"; // Subtle disabled state

    // Style for the active page number button
    const activePageClass = "bg-blueSky text-white font-semibold rounded-md w-10 py-5"; // Blue bg, white text, rounded square-ish

    // Style for inactive page number buttons
    const inactivePageClass = "text-black w-8"; // Default text color

    // Style for arrow buttons
    const arrowButtonClass = "text-black"; // Slightly muted color for arrows


    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5; // Total elements including ellipsis if needed
        const pageSpread = 2; // How many pages to show around the current page

        // Always show page 1 unless it's the only page
        if (currentPage > pageSpread + 1 && totalPages > maxPagesToShow) {
             pageNumbers.push(
                <button
                    key={1}
                    onClick={() => handlePageChange(1)}
                    className={`${baseButtonClass} ${inactivePageClass} ${textHoverClass}`}
                    aria-label="Go to page 1"
                >
                    1
                </button>
            );
            // Add start ellipsis if needed
             if (currentPage > pageSpread + 2) {
                 pageNumbers.push(
                     <span key="start-ellipsis" className={`${baseButtonClass} text-gray-500 w-8`}>...</span>
                 );
             }
        }

        // Calculate the range of pages to display around the current page
        let startPage = Math.max(1, currentPage - pageSpread);
        let endPage = Math.min(totalPages, currentPage + pageSpread);

        // Adjust range if near the beginning
        if (currentPage <= pageSpread + 1) {
            endPage = Math.min(totalPages, maxPagesToShow - (totalPages > (maxPagesToShow -1) ? 1: 0) ); // Adjust end based on total pages & last page button
        }
         // Adjust range if near the end
        if (currentPage >= totalPages - pageSpread) {
           startPage = Math.max(1, totalPages - (maxPagesToShow - (1 > (totalPages - maxPagesToShow +1) ? 0 : 1) ) +1); // Adjust start based on total pages & first page button
        }
        // Special case: ensure range doesn't overlap ellipsis logic incorrectly when small total pages
         if (totalPages <= maxPagesToShow) {
             startPage = 1;
             endPage = totalPages;
         }


        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`${baseButtonClass} ${
                        i === currentPage ? activePageClass : `${inactivePageClass} ${textHoverClass}`
                    }`}
                    aria-current={i === currentPage ? 'page' : undefined}
                    aria-label={`Go to page ${i}`}
                    disabled={i === currentPage} // Optionally disable clicking the current page
                >
                    {i}
                </button>
            );
        }


         // Add end ellipsis and last page button if needed
         if (currentPage < totalPages - pageSpread && totalPages > maxPagesToShow) {
            if (currentPage < totalPages - pageSpread -1) {
                 pageNumbers.push(
                     <span key="end-ellipsis" className={`${baseButtonClass} text-gray-500 w-8`}>...</span>
                 );
            }
             pageNumbers.push(
                <button
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    className={`${baseButtonClass} ${inactivePageClass} ${textHoverClass}`}
                    aria-label={`Go to page ${totalPages}`}
                >
                    {totalPages}
                </button>
            );
        }

        return pageNumbers;
    };

    // Disable pagination if only one page or no items
    if (totalPages <= 0) {
        return (
             <div className="flex items-center justify-between mt-4 py-3 text-sm text-textMuted">
                <div>
                    Showing {totalItems > 0 ? startIndex + 1 : 0} - {Math.min(endIndex, totalItems)} of {totalItems} items
                </div>
                 {/* Optionally render an empty div or null if you want nothing on the right */}
                 <div></div>
            </div>
        )
    }


    return (
        <div className="flex items-center justify-between mt-4 py-3 text-sm text-textMuted">
            {/* Showing X-Y of Z */}
            <div className='text-grey-3 text-sm'>
                Showing {totalItems > 0 ? startIndex + 1 : 0} - {Math.min(endIndex, totalItems)} of {totalItems} items
            </div>

            {/* Pagination Controls Wrapper */}
            {/* Added bg-white, rounded-lg, padding, shadow */}
            <div className="flex items-center bg-white rounded-lg px-2 py-3 shadow-sm">
                 <nav aria-label="Pagination" className="flex items-center space-x-2"> {/* Use space-x for spacing */}
                    <button
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        className={`${baseButtonClass} ${arrowButtonClass} ${textHoverClass} ${disabledClass}`}
                        aria-label="First page"
                    >
                        <span className="sr-only">First page</span> {/* Accessibility */}
                        <ChevronsLeftIcon className="w-4 h-4" aria-hidden="true"/>
                    </button>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                         className={`${baseButtonClass} ${arrowButtonClass} ${textHoverClass} ${disabledClass}`}
                        aria-label="Previous page"
                    >
                         <span className="sr-only">Previous page</span>
                        <ChevronLeftIcon className="w-4 h-4" aria-hidden="true"/>
                    </button>

                    {renderPageNumbers()}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`${baseButtonClass} ${arrowButtonClass} ${textHoverClass} ${disabledClass}`}
                        aria-label="Next page"
                    >
                         <span className="sr-only">Next page</span>
                        <ChevronRightIcon className="w-4 h-4" aria-hidden="true"/>
                    </button>
                     <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className={`${baseButtonClass} ${arrowButtonClass} ${textHoverClass} ${disabledClass}`}
                        aria-label="Last page"
                    >
                         <span className="sr-only">Last page</span>
                        <ChevronsRightIcon className="w-4 h-4" aria-hidden="true"/>
                    </button>
                 </nav>
            </div>
        </div>
    );
};

export default Pagination;