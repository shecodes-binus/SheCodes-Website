"use client"

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { EventParticipant } from '@/types/eventParticipant'; 
import { DeleteConfirmationModal } from '@/components/admin/confirm-delete-modal';
import EventParticipantTable from '@/components/admin/event-participant-table';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { FiChevronDown } from 'react-icons/fi';
import { DeleteIcon } from '@/components/admin/icon';
import Pagination from '@/components/admin/pagination';
import { IoMdSearch } from "react-icons/io";
import { Button } from '@/components/ui/button';
import apiService from '@/lib/apiService';
import toast from 'react-hot-toast';

const EventParticipantPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const eventId = params.id as string;

    const [participants, setParticipants] = useState<EventParticipant[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterStatus, setFilterStatus] = useState<'All' | 'registered' | 'cancelled' | 'attended'>('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedParticipantIds, setSelectedParticipantIds] = useState<number[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
    const [eventName, setEventName] = useState('');

    const fetchParticipants = useCallback(async () => {
        if (!eventId) return;
        setLoading(true);
        try {
            const response = await apiService.get<EventParticipant[]>(`/participants/event/${eventId}`);
            setParticipants(response.data);
            if (response.data.length > 0) {
                setEventName(response.data[0].event.title); // Set event name from the first participant
            }
        } catch (error) {
            toast.error("Could not load event participants.");
        } finally {
            setLoading(false);
        }
    }, [eventId]);

    useEffect(() => {
        fetchParticipants();
    }, [fetchParticipants]);

    const filteredParticipants = useMemo(() => {
        if (!participants) return [];
        return participants.filter(participant => {
            const statusMatch = filterStatus === 'All' || participant.status === filterStatus;
            const searchLower = searchTerm.toLowerCase();
            const nameMatch = participant.user?.name?.toLowerCase().includes(searchLower);
            return statusMatch && nameMatch;
        });
    }, [participants, searchTerm, filterStatus]);

    const totalItems = filteredParticipants.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedParticipants = useMemo(() => {
        return filteredParticipants.slice(startIndex, startIndex + itemsPerPage);
     }, [filteredParticipants, startIndex, itemsPerPage]);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        setSelectedParticipantIds([]);
    }, []);

    const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1);
        setSelectedParticipantIds([]);
    };

    const handleSelectParticipant = useCallback((id: number, checked: boolean) => {
        setSelectedParticipantIds(prev => checked ? [...prev, id] : prev.filter(pId => pId !== id));
    }, []);

    const handleSelectAllOnPage = useCallback((checked: boolean) => {
        setSelectedParticipantIds(checked ? paginatedParticipants.map(p => p.id) : []);
    }, [paginatedParticipants]);

    const handleDeleteConfirmed = async () => {
        if (selectedParticipantIds.length === 0) return;
        setIsDeleting(true);
        const toastId = toast.loading("Deleting participants...");
        try {
            await apiService.post('/participants/delete-batch', selectedParticipantIds);
            toast.success("Participants deleted successfully!", { id: toastId });
            setSelectedParticipantIds([]);
            fetchParticipants(); // Re-fetch data
        } catch (err) {
            toast.error("Failed to delete participants.", { id: toastId });
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };
    
    const handleChangeStatus = async (participantId: number, newStatus: 'registered' | 'attended' | 'cancelled') => {
        const toastId = toast.loading("Updating status...");
        try {
            await apiService.patch(`/participants/${participantId}/status`, { status: newStatus });
            toast.success("Status updated successfully!", { id: toastId });
            fetchParticipants(); // Re-fetch data to ensure consistency
        } catch (error) {
            toast.error("Failed to update status.", { id: toastId });
        }
    };

    console.log(participants);

    if (loading) return <div className="p-10 text-center">Loading participants...</div>;

    return (
        <div className="px-10 py-6">
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
                        onChange={(e) => { setFilterStatus(e.target.value as 'All' | 'attended' | 'registered' | 'cancelled'); setCurrentPage(1); setSelectedParticipantIds([]); }}
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
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); setSelectedParticipantIds([]); }}
                        className="w-full pl-9 pr-3 py-3.5 rounded-lg focus:ring-blueSky focus:border-blueSky text-sm bg-white shadow-sm placeholder:text-grey-2"
                    />
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-lg shadow-card overflow-hidden border border-gray-200">
                <EventParticipantTable
                    participants={paginatedParticipants}
                    selectedParticipantIds={selectedParticipantIds}
                    onSelectParticipant={handleSelectParticipant}
                    onSelectAll={handleSelectAllOnPage}
                    onChangeStatus={handleChangeStatus}
                />
            </div>

            {/* Footer Section (Delete Button & Pagination) */}
            <div className="mt-6 flex flex-col justify-end items-end">
                <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                     <DialogTrigger asChild>
                         <button
                            // Button is disabled if nothing is selected OR modal is open (prevent double click)
                            disabled={selectedParticipantIds.length === 0 || isDeleteModalOpen}
                            className={`flex items-center space-x-2 px-6 py-3.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                                selectedParticipantIds.length > 0
                                ? 'bg-[#EE7373] text-white hover:bg-[#EE7373]/90 focus:ring-[#EE7373]/50'
                                : 'bg-[#BFBFBF]/45 text-white cursor-not-allowed' // Adjusted disabled style
                            }`}
                        >
                            <DeleteIcon className="w-4 h-4"/>
                            <span>Delete ({selectedParticipantIds.length})</span>
                        </button>
                    </DialogTrigger>
                    {/* Render Modal Content when open */}
                    <DeleteConfirmationModal
                        itemCount={selectedParticipantIds.length}
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
                    endIndex={startIndex + paginatedParticipants.length}
                />
        </div>
    );
    
};

export default EventParticipantPage;