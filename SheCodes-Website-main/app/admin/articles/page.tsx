"use client"

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BlogTable from '@/components/admin/blog-table';
import Pagination from '@/components/admin/pagination';
import { PlusIcon, DeleteIcon } from '@/components/admin/icon';
import { FiChevronDown } from 'react-icons/fi';
import { IoMdSearch } from "react-icons/io";
import { DeleteConfirmationModal } from '@/components/admin/confirm-delete-modal';
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import apiService from '@/lib/apiService';
import type { BlogArticle, ArticleCategory } from '@/types/blog';
import toast from 'react-hot-toast';

const ArticlePage: React.FC = () => {
    const router = useRouter();
    
    const [allBlogs, setAllBlogs] = useState<BlogArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<ArticleCategory | 'All'>('All');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    
    const [selectedBlog, setSelectedBlog] = useState<number[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 

    const fetchBlogs = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiService.get<BlogArticle[]>('/blogs');
            setAllBlogs(response.data);
        } catch (err) {
            toast.error("Could not load articles.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    const filteredBlog = useMemo(() => {
        return allBlogs.filter(blog => {
            const statusMatch = filterStatus === 'All' || blog.category === filterStatus;
            const searchMatch = blog.title.toLowerCase().includes(searchTerm.toLowerCase());
            return statusMatch && searchMatch;
        });
    }, [allBlogs, searchTerm, filterStatus]);

    const totalItems = filteredBlog.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedEvents = useMemo(() => {
        return filteredBlog.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredBlog, startIndex, itemsPerPage]);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        setSelectedBlog([]);
    }, []);

    const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1);
        setSelectedBlog([]);
    };

    const handleSelectBlog = useCallback((id: number, checked: boolean) => {
        setSelectedBlog(prev => checked ? [...prev, id] : prev.filter(blogId => blogId !== id));
    }, []);

    const handleSelectAll = useCallback((checked: boolean) => {
        setSelectedBlog(checked ? paginatedEvents.map(blog => blog.id) : []);
    }, [paginatedEvents]);

    const handleAddBlog = () => {
        router.push('/admin/articles/add-article'); 
    };

    const onEditBlog = (id: number) => {
        router.push(`/admin/articles/edit-article/${id}`);
    };

    const handleDeleteConfirmed = async () => {
        if (selectedBlog.length === 0) return;
        setIsDeleting(true);
        const toastId = toast.loading(`Deleting ${selectedBlog.length} article(s)...`);

        try {
            await Promise.all(
                selectedBlog.map(id => apiService.delete(`/blogs/${id}`))
            );
            toast.success("Articles deleted successfully!", { id: toastId });
            setSelectedBlog([]);
            fetchBlogs(); // Refresh the list
        } catch (err) {
            toast.error("Failed to delete articles.", { id: toastId });
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };
    
    if (loading) return <div className="p-10 text-center">Loading articles...</div>;

    return (
        <div className="px-10 py-6">
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
                endIndex={startIndex + paginatedEvents.length}
            />
        </div>
    );
};

export default ArticlePage;