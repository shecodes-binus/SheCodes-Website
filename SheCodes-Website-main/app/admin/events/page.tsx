"use client"

import React, { useState, useMemo, useCallback } from 'react';
// Import the new type and data
import { CombinedEventData } from '@/types/events';
import { allEventsData } from '@/data/dummyEvent'; // Adjust path as needed
import EventTable from '@/components/admin/event-table';
import Pagination from '@/components/admin/pagination';
import { PlusIcon, SearchIcon, DeleteIcon } from '@/components/admin/icon';
import { FiChevronDown } from 'react-icons/fi';
import { IoMdSearch } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { DeleteConfirmationModal } from '@/components/admin/confirm-delete-modal';
import {
    Dialog,
    DialogTrigger,
    // DialogContent, DialogHeader etc. are NOT needed here anymore for these modals
  } from "@/components/ui/dialog";


const EventPage: React.FC = () => {
    const router = useRouter();
    // Use the imported dummy data and the correct type
    const [allEvents] = useState<CombinedEventData[]>(allEventsData);
    const [searchTerm, setSearchTerm] = useState('');
    // Filter status now aligns with the 'status' field in your data
    const [filterStatus, setFilterStatus] = useState<'All' | 'upcoming' | 'past'>('All');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    // Selected events store numbers (IDs) now
    const [selectedEvents, setSelectedEvents] = useState<number[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 

    // Filtering Logic
    const filteredEvents = useMemo(() => {
        return allEvents.filter(event => {
            // Filter by status ('upcoming' or 'past')
            const statusMatch = filterStatus === 'All' || event.status === filterStatus;

            // Filter by search term (checking the title)
            const searchLower = searchTerm.toLowerCase();
            const titleMatch = event.title.toLowerCase().includes(searchLower);
            // You could also add description or tags to search:
            // const descriptionMatch = event.description.toLowerCase().includes(searchLower);
            // const tagMatch = event.tags.some(tag => tag.toLowerCase().includes(searchLower));
            // return statusMatch && (titleMatch || descriptionMatch || tagMatch);

            return statusMatch && titleMatch;
        });
    }, [allEvents, searchTerm, filterStatus]);

    // Pagination Logic (remains the same logic)
    const totalItems = filteredEvents.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedEvents = useMemo(() => {
        return filteredEvents.slice(startIndex, endIndex);
    }, [filteredEvents, startIndex, endIndex]);


    // Handlers
    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        setSelectedEvents([]); // Clear selection when changing page
    }, []);

    const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1);
        setSelectedEvents([]);
    };

     // Handler for selecting/deselecting a single event (ID is number)
     const handleSelectEvent = useCallback((id: number, checked: boolean) => {
        setSelectedEvents(prev =>
            checked ? [...prev, id] : prev.filter(eventId => eventId !== id)
        );
    }, []);

    // Handler for the "Select All" checkbox in the header
    const handleSelectAll = useCallback((checked: boolean) => {
        if (checked) {
            // Select all IDs *on the current page*
            setSelectedEvents(paginatedEvents.map(event => event.id));
        } else {
            // Deselect all IDs *on the current page*
            // Note: If you want "Select All" to truly select *all* filtered events across pages,
            // you would need to adjust this logic to use `filteredEvents` instead of `paginatedEvents`.
            // For simplicity matching most UI patterns, this selects/deselects current page.
            const currentPageIds = paginatedEvents.map(event => event.id);
             // Keep selections from other pages
            setSelectedEvents(prev => prev.filter(id => !currentPageIds.includes(id)));
            // Or simply clear all selections:
            // setSelectedEvents([]);
        }
    }, [paginatedEvents]); // Depend on paginatedEvents

    const handleAddEvent = () => {
        router.push('/admin/events/add-event'); 
    };

    // Handlers now receive number IDs
    const handleEditEvent = (id: number) => {
        router.push(`/admin/events/edit-event/${id}`);
    };

    const handleCloseRegister = (id: number) => {
        console.log("Close Register Clicked:", id);
    };

    const handleViewParticipants = (id: number) => {
        console.log("View Participants Clicked:", id);
        router.push(`/admin/events/participants/${id}`);
    };

    const handleDeleteConfirmed = () => {
        if (selectedEvents.length === 0) return;

        console.log("Deleting Events:", selectedEvents);

        setSelectedEvents([]);
        setIsDeleteModalOpen(false); // Close the modal
        console.log("Simulated Delete Complete. Selection cleared.");
    };


    return (
        <div className="px-10 py-6">
            {/* Top Header Section */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-black">Event <span className='text-grey-3'>({totalItems})</span></h1>
                 <button
                    onClick={handleAddEvent}
                    className="flex items-center space-x-2 bg-blueSky text-sm text-white px-6 py-3.5 rounded-lg hover:bg-blueSky/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>Add Event</span>
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
                        onChange={(e) => { setFilterStatus(e.target.value as 'All' | 'upcoming' | 'past'); setCurrentPage(1); setSelectedEvents([]); }}
                        className="appearance-none w-32 py-3.5 px-3.5 pr-8 bg-white rounded-lg shadow-sm focus:border-blueSky focus:ring-blueSky text-sm"
                    >
                         <option value="All">All</option>
                         {/* Use the actual status values from your data */}
                         <option value="upcoming">Upcoming</option>
                         <option value="past">Past</option>
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
                        placeholder="Search Event Title" // Be more specific
                        value={searchTerm}
                        // Update state and reset page on change
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); setSelectedEvents([]); }}
                        className="w-full pl-9 pr-3 py-3.5 rounded-lg focus:ring-blueSky focus:border-blueSky text-sm bg-white shadow-sm placeholder:text-grey-2"
                    />
                </div>
             </div>


            {/* Table Section */}
            <div className="bg-white rounded-lg shadow-card overflow-hidden border border-gray-200">
                <EventTable
                    // Pass the currently visible page of events
                    events={paginatedEvents}
                    selectedEvents={selectedEvents}
                    onSelectEvent={handleSelectEvent}
                    onSelectAll={handleSelectAll}
                    onCloseRegister={handleCloseRegister}
                    onEditEvent={handleEditEvent}
                    onViewParticipants={handleViewParticipants}
                />
            </div>

            {/* Footer Section (Delete Button & Pagination) */}
            <div className="mt-6 flex flex-col justify-end items-end">
                <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                     <DialogTrigger asChild>
                         <button
                            // Button is disabled if nothing is selected OR modal is open (prevent double click)
                            disabled={selectedEvents.length === 0 || isDeleteModalOpen}
                            className={`flex items-center space-x-2 px-6 py-3.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                                selectedEvents.length > 0
                                ? 'bg-[#EE7373] text-white hover:bg-[#EE7373]/90 focus:ring-[#EE7373]/50'
                                : 'bg-[#BFBFBF]/45 text-white cursor-not-allowed' // Adjusted disabled style
                            }`}
                        >
                            <DeleteIcon className="w-4 h-4"/>
                            <span>Delete ({selectedEvents.length})</span>
                        </button>
                    </DialogTrigger>
                    {/* Render Modal Content when open */}
                    <DeleteConfirmationModal
                        itemCount={selectedEvents.length}
                        itemName="events"
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

export default EventPage;