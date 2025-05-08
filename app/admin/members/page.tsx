"use client"

import React, { useState, useMemo, useCallback } from 'react';
// Import the new type and data
import { Member } from '@/types/members';
import { dummyMembers } from '@/data/dummyMembers'; // Adjust path as needed
import MemberTable from '@/components/admin/member-table';
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


const MemberPage: React.FC = () => {
    const router = useRouter();
    // Use the imported dummy data and the correct type
    const [allMembers] = useState<Member[]>(dummyMembers);
    const [searchTerm, setSearchTerm] = useState('');
    // Filter status now aligns with the 'status' field in your data
    const [filterStatus, setFilterStatus] = useState<'All' | 'recent' | 'last'>('All');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    // Selected events store numbers (IDs) now
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 

    // Filtering Logic
    const filteredMembers = useMemo(() => {
        const searchLower = searchTerm.toLowerCase();
      
        // Filter by fullName only
        let result = allMembers.filter(member =>
          member.fullName.toLowerCase().includes(searchLower)
        );
      
        // Sort logic based on filterStatus
        if (filterStatus === 'recent') {
          // Sort by most recent `createdAt`
          result = result.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        } else if (filterStatus === 'last') {
          // Sort by oldest `createdAt`
          result = result.sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        }
      
        return result;
      }, [allMembers, searchTerm, filterStatus]);

    // Pagination Logic (remains the same logic)
    const totalItems = filteredMembers.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedEvents = useMemo(() => {
        return filteredMembers.slice(startIndex, endIndex);
    }, [filteredMembers, startIndex, endIndex]);


    // Handlers
    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        setSelectedMembers([]); // Clear selection when changing page
    }, []);

    const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1);
        setSelectedMembers([]);
    };

     // Handler for selecting/deselecting a single event (ID is number)
     const handleSelectMember = useCallback((id: number, checked: boolean) => {
        setSelectedMembers(prev =>
            checked ? [...prev, id] : prev.filter(membersId => membersId !== id)
        );
    }, []);

    // Handler for the "Select All" checkbox in the header
    const handleSelectAll = useCallback((checked: boolean) => {
        if (checked) {
            // Select all IDs *on the current page*
            setSelectedMembers(paginatedEvents.map(member => member.id));
        } else {
            // Deselect all IDs *on the current page*
            // Note: If you want "Select All" to truly select *all* filtered events across pages,
            // you would need to adjust this logic to use `filteredEvents` instead of `paginatedEvents`.
            // For simplicity matching most UI patterns, this selects/deselects current page.
            const currentPageIds = paginatedEvents.map(member => member.id);
             // Keep selections from other pages
             setSelectedMembers(prev => prev.filter(id => !currentPageIds.includes(id)));
            // Or simply clear all selections:
            // setSelectedEvents([]);
        }
    }, [paginatedEvents]); // Depend on paginatedEvents

    const handleViewEvent = (id: number) => {
        console.log("View Event Clicked");
        router.push(`/admin/members/${id}/events`);
    };

    // Handlers now receive number IDs
    const handleViewMember = (id: number) => {
        console.log("View Member Clicked:", id);
        router.push(`/admin/members/${id}/details`);
    };

    const handleDeleteConfirmed = () => {
        if (selectedMembers.length === 0) return;

        console.log("Deleting Mentors:", selectedMembers);

        setSelectedMembers([]);
        setIsDeleteModalOpen(false); // Close the modal
        console.log("Simulated Delete Complete. Selection cleared.");
    };

    return (
        <div className="px-10 py-6">
            {/* Top Header Section */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-black">Member <span className='text-grey-3'>({totalItems})</span></h1>
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
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
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
                        onChange={(e) => { setFilterStatus(e.target.value as 'All' | 'recent' | 'last'); setCurrentPage(1); setSelectedMembers([]); }}
                        className="appearance-none w-32 py-3.5 px-3.5 pr-8 bg-white rounded-lg shadow-sm focus:border-blueSky focus:ring-blueSky text-sm"
                    >
                         <option value="All">All</option>
                         <option value="recent">Recent</option>
                         <option value="last">Last</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
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
                        placeholder="Search Member Name" // Be more specific
                        value={searchTerm}
                        // Update state and reset page on change
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); setSelectedMembers([]); }}
                        className="w-full pl-9 pr-3 py-3.5 rounded-lg focus:ring-blueSky focus:border-blueSky text-sm bg-white shadow-sm placeholder:text-grey-2"
                    />
                </div>
             </div>


            {/* Table Section */}
            <div className="bg-white rounded-lg shadow-card overflow-hidden border border-gray-200">
                <MemberTable
                    // Pass the currently visible page of events
                    members={paginatedEvents}
                    selectedMember={selectedMembers}
                    onSelectMember={handleSelectMember}
                    onSelectAll={handleSelectAll}
                    onViewEvent={handleViewEvent}
                    onViewMember={handleViewMember}
                />
            </div>

            {/* Footer Section (Delete Button & Pagination) */}
            <div className="mt-6 flex flex-col justify-end items-end">
                <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                     <DialogTrigger asChild>
                         <button
                            // Button is disabled if nothing is selected OR modal is open (prevent double click)
                            disabled={selectedMembers.length === 0 || isDeleteModalOpen}
                            className={`flex items-center space-x-2 px-6 py-3.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                                selectedMembers.length > 0
                                ? 'bg-[#EE7373] text-white hover:bg-[#EE7373]/90 focus:ring-[#EE7373]/50'
                                : 'bg-[#BFBFBF]/45 text-white cursor-not-allowed' // Adjusted disabled style
                            }`}
                        >
                            <DeleteIcon className="w-4 h-4"/>
                            <span>Delete ({selectedMembers.length})</span>
                        </button>
                    </DialogTrigger>
                    {/* Render Modal Content when open */}
                    <DeleteConfirmationModal
                        itemCount={selectedMembers.length}
                        itemName="members"
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

export default MemberPage;