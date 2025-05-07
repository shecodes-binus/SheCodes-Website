"use client"

import React, { useState, useMemo, useCallback } from 'react';
import { dummyMembers } from '@/data/dummyMembers';
import { dummyEventParticipants } from '@/data/dummyParticipants';
import { useParams } from 'next/navigation';
import type { Member } from '@/types/members'; // Or from '@/types/events' if you put it there
import type { EventParticipant } from '@/types/eventParticipant'; // Or from '@/types/participants'
import { DeleteConfirmationModal } from '@/components/admin/confirm-delete-modal';
import EventParticipantTable from '@/components/admin/event-participant-table';
import {
    Dialog,
    DialogTrigger,
    // DialogContent, DialogHeader etc. are NOT needed here anymore for these modals
  } from "@/components/ui/dialog";
import { FiChevronDown } from 'react-icons/fi';
import { PlusIcon, SearchIcon, DeleteIcon } from '@/components/admin/icon';
import Pagination from '@/components/admin/pagination';
import { IoMdSearch } from "react-icons/io";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const EventParticipantPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const eventId = params.id ? parseInt(params.id as string, 10) : null;
    const participantsForThisEvent = dummyEventParticipants.filter(p => p.eventId === eventId);

    const participantDetails = participantsForThisEvent.map(participation => {
        const memberInfo = dummyMembers.find(m => m.id === participation.memberId);
        return {
            ...memberInfo, 
            registrationDate: participation.registrationDate,
            participationStatus: participation.status,
        };
    }).filter((details): details is Required<typeof details> => details.id !== undefined);

    const [currentParticipants, setCurrentParticipants] = useState(participantDetails);

    const [itemsPerPage, setItemsPerPage] = React.useState(10);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [filterStatus, setFilterStatus] = React.useState<'All' | 'registered' | 'cancelled' | 'attended'>('All');
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 

    // Filtering Logic
    const filteredParticipants = useMemo(() => {
        return currentParticipants.filter(participant => {
            const statusMatch = filterStatus === 'All' || participant.participationStatus === filterStatus;
            const searchLower = searchTerm.toLowerCase();
            const titleMatch = (participant.fullName ?? '').toLowerCase().includes(searchLower);
            return statusMatch && titleMatch;
        });
    }, [currentParticipants, searchTerm, filterStatus]);

    // Pagination Logic (remains the same logic)
    const totalItems = filteredParticipants.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedParticipants = useMemo(() => { // Renamed variable for clarity
        return filteredParticipants.slice(startIndex, endIndex);
     }, [filteredParticipants, startIndex, endIndex]);

    // Handlers
    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        setSelectedParticipants([]); // Clear selection when changing page
    }, []);

    const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1);
        setSelectedParticipants([]);
    };

    // Handler for selecting/deselecting a single event (ID is number)
    const handleSelectParticipant = useCallback((id: number, checked: boolean) => {
        setSelectedParticipants(prev =>
            checked ? [...prev, id] : prev.filter(participantId => participantId !== id)
        );
    }, []);

    // Handler for the "Select All" checkbox in the header
    const handleSelectAll = useCallback((checked: boolean) => {
        if (checked) {
            // Select all IDs *on the current page*
            setSelectedParticipants(paginatedParticipants.map(participant => participant.id).filter((id): id is number => id !== undefined));
        } else {
            // Deselect all IDs *on the current page*
            // Note: If you want "Select All" to truly select *all* filtered events across pages,
            // you would need to adjust this logic to use `filteredEvents` instead of `paginatedEvents`.
            // For simplicity matching most UI patterns, this selects/deselects current page.
            const currentPageIds = paginatedParticipants.map(participant => participant.id);
                // Keep selections from other pages
                setSelectedParticipants(prev => prev.filter(id => !currentPageIds.includes(id)));
            // Or simply clear all selections:
            // setSelectedEvents([]);
        }
    }, [paginatedParticipants]); // Depend on paginatedEvents

    const handleDeleteConfirmed = () => {
        if (selectedParticipants.length === 0) return;

        console.log("Deleting Events:", selectedParticipants);

        setSelectedParticipants([]);
        setIsDeleteModalOpen(false); // Close the modal
        console.log("Simulated Delete Complete. Selection cleared.");
    };

    const handleChangeStatus = (participantId: number, newStatus: 'registered' | 'attended' | 'cancelled') => {
        console.log(`Changing status for participant ${participantId} to ${newStatus}`);
    
        // --- Frontend State Update (Simulation) ---
        setCurrentParticipants(prevParticipants =>
            prevParticipants.map(p =>
                p.id === participantId
                    ? { ...p, participationStatus: newStatus }
                    : p
            )
        );

        // --- API Call Placeholder (Real Application) ---
        // async function updateStatusAPI() {
        // try {
        //     const response = await fetch(`/api/participants/${participantId}/status`, {
        //         method: 'PATCH', // or PUT
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({ status: newStatus }),
        //     });
        //     if (!response.ok) {
        //         throw new Error('Failed to update status');
        //     }
        //     // If API is successful, the local state update above is correct.
        //     // If API fails, you might want to revert the local state change or show an error.
        //     console.log("Status updated via API successfully");
        // } catch (error) {
        //     console.error("API Status Update Error:", error);
        //     // Revert state change on error
        //      setCurrentParticipants(prevParticipants =>
        //         prevParticipants.map(p =>
        //             p.id === participantId
        //                 ? { ...p, participationStatus: /* original status before change */ } // Need original status logic here
        //                 : p
        //         )
        //      );
        //      alert("Failed to update status.");
        //   }
        // }
        // updateStatusAPI();
    };

    return (
        <div className="p-10">
            {/* Top Header Section */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-black">Event Participants <span className='text-grey-3'>({totalItems})</span></h1>
                <Button variant="outline" onClick={() => router.back()} className="text-sm">
                    Back
                </Button>
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
                        onChange={(e) => { setFilterStatus(e.target.value as 'All' | 'attended' | 'registered' | 'cancelled'); setCurrentPage(1); setSelectedParticipants([]); }}
                        className="appearance-none w-32 py-3.5 px-3.5 pr-8 bg-white rounded-lg shadow-sm focus:border-blueSky focus:ring-blueSky text-sm"
                    >
                            <option value="All">All</option>
                            {/* Use the actual status values from your data */}
                            <option value="registered">Registered</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="attended">Attended</option>
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
                        placeholder="Search Participant Name" // Be more specific
                        value={searchTerm}
                        // Update state and reset page on change
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); setSelectedParticipants([]); }}
                        className="w-full pl-9 pr-3 py-3.5 rounded-lg focus:ring-blueSky focus:border-blueSky text-sm bg-white shadow-sm placeholder:text-grey-2"
                    />
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-lg shadow-card overflow-hidden border border-gray-200">
                <EventParticipantTable
                    participants={paginatedParticipants} // Pass paginated data
                    selectedParticipants={selectedParticipants}
                    onSelectParticipant={handleSelectParticipant}
                    onSelectAll={handleSelectAll}
                    onChangeStatus={handleChangeStatus} // Pass the new handler
                />
            </div>

            {/* Footer Section (Delete Button & Pagination) */}
            <div className="mt-6 flex flex-col justify-end items-end">
                <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                     <DialogTrigger asChild>
                         <button
                            // Button is disabled if nothing is selected OR modal is open (prevent double click)
                            disabled={selectedParticipants.length === 0 || isDeleteModalOpen}
                            className={`flex items-center space-x-2 px-6 py-3.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                                selectedParticipants.length > 0
                                ? 'bg-[#EE7373] text-white hover:bg-[#EE7373]/90 focus:ring-[#EE7373]/50'
                                : 'bg-[#BFBFBF]/45 text-white cursor-not-allowed' // Adjusted disabled style
                            }`}
                        >
                            <DeleteIcon className="w-4 h-4"/>
                            <span>Delete ({selectedParticipants.length})</span>
                        </button>
                    </DialogTrigger>
                    {/* Render Modal Content when open */}
                    <DeleteConfirmationModal
                        itemCount={selectedParticipants.length}
                        itemName="participants"
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

export default EventParticipantPage;