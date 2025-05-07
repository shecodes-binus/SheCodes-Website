"use client"

import React, { useState, useMemo, useCallback } from 'react';
// Import the new type and data
import { BlogArticle } from '@/types/blog';
import { dummyArticles } from '@/data/dummyBlogs'; // Adjust path as needed
import BlogTable from '@/components/admin/blog-table';
import Pagination from '@/components/admin/pagination';
import { PlusIcon, SearchIcon, DeleteIcon } from '@/components/admin/icon';
import { FiChevronDown } from 'react-icons/fi';
import { IoMdSearch } from "react-icons/io";
import { DeleteConfirmationModal } from '@/components/admin/confirm-delete-modal';
import {
    Dialog,
    DialogTrigger,
    // DialogContent, DialogHeader etc. are NOT needed here anymore for these modals
  } from "@/components/ui/dialog";
import { useRouter } from 'next/navigation';

const ArticlePage: React.FC = () => {
    const router = useRouter();
    // Use the imported dummy data and the correct type
    const [allBlogs] = useState<BlogArticle[]>(dummyArticles);
    const [searchTerm, setSearchTerm] = useState('');
    // Filter status now aligns with the 'status' field in your data
    const [filterStatus, setFilterStatus] = useState<'All' | 'Tech & Innovation' | 'Career Growth' | 'Community' | 'Event' | 'Success Stories' | 'Others'>('All');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    // Selected events store numbers (IDs) now
    const [selectedBlog, setSelectedBlog] = useState<number[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 

    // Filtering Logic
    const filteredBlog = useMemo(() => {
        return allBlogs.filter(blog => {
            // Filter by status ('upcoming' or 'past')
            const statusMatch = filterStatus === 'All' || String(blog.category) === filterStatus;

            // Filter by search term (checking the title)
            const searchLower = searchTerm.toLowerCase();
            const blogTitle = blog.title.toLowerCase().includes(searchLower);
            // You could also add description or tags to search:
            // const descriptionMatch = event.description.toLowerCase().includes(searchLower);
            // const tagMatch = event.tags.some(tag => tag.toLowerCase().includes(searchLower));
            // return statusMatch && (titleMatch || descriptionMatch || tagMatch);

            return statusMatch && blogTitle;
        });
    }, [allBlogs, searchTerm, filterStatus]);

    // Pagination Logic (remains the same logic)
    const totalItems = filteredBlog.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedEvents = useMemo(() => {
        return filteredBlog.slice(startIndex, endIndex);
    }, [filteredBlog, startIndex, endIndex]);


    // Handlers
    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        setSelectedBlog([]); // Clear selection when changing page
    }, []);

    const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1);
        setSelectedBlog([]);
    };

     // Handler for selecting/deselecting a single event (ID is number)
     const handleSelectBlog = useCallback((id: number, checked: boolean) => {
        setSelectedBlog(prev =>
            checked ? [...prev, id] : prev.filter(blogId => blogId !== id)
        );
    }, []);

    // Handler for the "Select All" checkbox in the header
    const handleSelectAll = useCallback((checked: boolean) => {
        if (checked) {
            // Select all IDs *on the current page*
            setSelectedBlog(paginatedEvents.map(blog => blog.id));
        } else {
            // Deselect all IDs *on the current page*
            // Note: If you want "Select All" to truly select *all* filtered events across pages,
            // you would need to adjust this logic to use `filteredEvents` instead of `paginatedEvents`.
            // For simplicity matching most UI patterns, this selects/deselects current page.
            const currentPageIds = paginatedEvents.map(blog => blog.id);
             // Keep selections from other pages
            setSelectedBlog(prev => prev.filter(id => !currentPageIds.includes(id)));
            // Or simply clear all selections:
            // setSelectedEvents([]);
        }
    }, [paginatedEvents]); // Depend on paginatedEvents

    const handleAddBlog = () => {
        console.log("Add Article Clicked");
        router.push('/admin/articles/add-article'); 
    };

    // Handlers now receive number IDs
    const onEditBlog = (id: number) => {
        console.log("Edit Article Clicked:", id);
        router.push(`/admin/articles/edit-article/${id}`);
    };

    const handleDeleteConfirmed = () => {
        if (selectedBlog.length === 0) return;

        console.log("Deleting Articles:", selectedBlog);

        setSelectedBlog([]);
        setIsDeleteModalOpen(false); // Close the modal
        console.log("Simulated Delete Complete. Selection cleared.");
    };

    return (
        <div className="p-10">
            {/* Top Header Section */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-black">Article <span className='text-grey-3'>({totalItems})</span></h1>
                 <button
                    onClick={handleAddBlog}
                    className="flex items-center space-x-2 bg-blueSky text-sm text-white px-6 py-3.5 rounded-lg hover:bg-blueSky/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>Add Article</span>
                </button>
            </div>

             {/* Filters and Search Section */}
             <div className="mb-4 flex flex-wrap gap-6 items-center pb-2 rounded-lg">
                 {/* Show X entries */}
                 <div className="flex items-center space-x-4 text-sm">
                     <label htmlFor="itemsPerPage" className="text-black">Show</label>
                     <div className='relative'>
                        <select
                            id="itemsPerPage"
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                            className="appearance-none w-16 py-3.5 px-3.5 pr-6 bg-white rounded-lg shadow-sm focus:border-primary focus:ring-primary text-sm"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            {/* Add total count if you want a huge list */}
                            {/* <option value={totalItems}>All</option> */}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"> {/* Adjust right padding (pr-3) to move icon left/right */}
                            <FiChevronDown className="w-4 h-4 text-gray-500" />
                        </div>
                     </div>
                 </div>

                 {/* Status Filter */}
                <div className="flex items-center space-x-2 text-sm relative">
                    
                    {/* Bind value to filterStatus state */}
                    <select
                        value={filterStatus}
                        // Update state and reset page on change
                        onChange={(e) => { setFilterStatus(e.target.value as 'All' | 'Tech & Innovation' | 'Career Growth' | 'Community' | 'Event' | 'Success Stories' | 'Others'); setCurrentPage(1); setSelectedBlog([]); }}
                        className="appearance-none w-32 py-3.5 px-3.5 pr-8 bg-white rounded-lg shadow-sm focus:border-blueSky focus:ring-blueSky text-sm"
                    >
                         <option value="All">All</option>
                         {/* Use the actual status values from your data */}
                         <option value="Tech & Innovation">Tech & Innovation</option>
                         <option value="Career Growth">Career Growth</option>
                         <option value="Community">Community</option>
                         <option value="Event">Event</option>
                         <option value="Success Stories">Success Stories</option>
                         <option value="Others">Others</option>
                         {/* Add Draft if you add it to your data */}
                         {/* <option value="Draft">Draft</option> */}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"> {/* Adjust right padding (pr-3) to move icon left/right */}
                        <FiChevronDown className="w-4 h-4 text-gray-500" />
                    </div>
                </div>


                 {/* Event Search (searches title) */}
                <div className="relative ml-auto min-w-[400px]">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IoMdSearch className="h-4 w-4 text-grey-2" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search Article Title" // Be more specific
                        value={searchTerm}
                        // Update state and reset page on change
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); setSelectedBlog([]); }}
                        className="w-full pl-9 pr-3 py-3.5 rounded-lg focus:ring-blueSky focus:border-blueSky text-sm bg-white shadow-sm placeholder:text-grey-2"
                    />
                </div>
             </div>


            {/* Table Section */}
            <div className="bg-white rounded-lg shadow-card overflow-hidden border border-gray-200">
                <BlogTable
                    // Pass the currently visible page of events
                    blogs={paginatedEvents}
                    selectedBlog={selectedBlog}
                    onSelectBlog={handleSelectBlog}
                    onSelectAll={handleSelectAll}
                    onEditBlog={onEditBlog}
                />
            </div>

            {/* Footer Section (Delete Button & Pagination) */}
            <div className="mt-6 flex flex-col justify-end items-end">
                <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                    <DialogTrigger asChild>
                        <button
                        // Button is disabled if nothing is selected OR modal is open (prevent double click)
                        disabled={selectedBlog.length === 0 || isDeleteModalOpen}
                        className={`flex items-center space-x-2 px-6 py-3.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                            selectedBlog.length > 0
                            ? 'bg-[#EE7373] text-white hover:bg-[#EE7373]/90 focus:ring-[#EE7373]/50'
                            : 'bg-[#BFBFBF]/45 text-white cursor-not-allowed' // Adjusted disabled style
                        }`}
                    >
                        <DeleteIcon className="w-4 h-4"/>
                        <span>Delete ({selectedBlog.length})</span>
                    </button>
                </DialogTrigger>
                {/* Render Modal Content when open */}
                <DeleteConfirmationModal
                    itemCount={selectedBlog.length}
                    itemName="articles"
                    onConfirm={handleDeleteConfirmed} // Pass the actual delete handler
                    onClose={() => setIsDeleteModalOpen(false)} // Ensure modal closes on cancel/X
                />
            </Dialog>
            </div>

            <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalItems}
                    startIndex={startIndex}
                    endIndex={endIndex}
                />
        </div>
    );
};

export default ArticlePage;