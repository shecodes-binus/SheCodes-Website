"use client"

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Member } from '@/types/members';
import type { EventParticipant } from '@/types/eventParticipant'; 
import { DeleteConfirmationModal } from '@/components/admin/confirm-delete-modal';
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { FiChevronDown } from 'react-icons/fi';
import { DeleteIcon } from '@/components/admin/icon';
import Pagination from '@/components/admin/pagination';
import { IoMdSearch } from "react-icons/io";
import MemberEventTable from '@/components/admin/member-event-table';
import { Button } from '@/components/ui/button';
import apiService from '@/lib/apiService';
import toast from 'react-hot-toast';

const ParticipantEventPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const memberId = params.id as string;

    const [member, setMember] = useState<Member | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterEventStatus, setFilterEventStatus] = useState<'All' | 'upcoming' | 'past' | 'ongoing'>('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedParticipationIds, setSelectedParticipationIds] = useState<number[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 

    const fetchMemberData = useCallback(async () => {
        if (!memberId) return;
        setLoading(true);
        try {
            const response = await apiService.get<Member>(`/users/${memberId}`);
            setMember(response.data);
        } catch (err) {
            toast.error("Could not load member's event data.");
        } finally {
            setLoading(false);
        }
    }, [memberId]);

    useEffect(() => {
        fetchMemberData();
    }, [fetchMemberData]);

    const filteredMemberEvents = useMemo(() => {
        if (!member) return [];
        return member.participations.filter(p => {
            const statusMatch = filterEventStatus === 'All' || p.event.status === filterEventStatus;
            const titleMatch = p.event.title.toLowerCase().includes(searchTerm.toLowerCase());
            return statusMatch && titleMatch;
        });
    }, [member, searchTerm, filterEventStatus]);

    const totalItems = filteredMemberEvents.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedMemberEvents = useMemo(() => {
        return filteredMemberEvents.slice(startIndex, startIndex + itemsPerPage);
     }, [filteredMemberEvents, startIndex, itemsPerPage]);

     const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        setSelectedParticipationIds([]);
    }, []);

    const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1);
        setSelectedParticipationIds([]);
    };

    const handleSelectEvent = useCallback((participationId: number, checked: boolean) => {
        setSelectedParticipationIds(prev => checked ? [...prev, participationId] : prev.filter(id => id !== participationId));
    }, []);

    const handleSelectAllOnPage = useCallback((checked: boolean) => {
        setSelectedParticipationIds(checked ? paginatedMemberEvents.map(p => p.id) : []);
    }, [paginatedMemberEvents]);

    const handleDeleteConfirmed = async () => {
        if (selectedParticipationIds.length === 0) return;
        setIsDeleting(true);
        const toastId = toast.loading("Deleting event participations...");
        try {
            await apiService.post('/participants/delete-batch', selectedParticipationIds);
            toast.success("Participations deleted successfully!", { id: toastId });
            setSelectedParticipationIds([]);
            fetchMemberData();
        } catch (err) {
            toast.error("Failed to delete participations.", { id: toastId });
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    const handleUploadCertificate = async (participationId: number, file: File) => {
        const formData = new FormData();
        formData.append('certificate', file);
        const toastId = toast.loading("Uploading certificate...");
        try {
            // NOTE: You will need to create this endpoint in your backend
            await apiService.post(`/participants/${participationId}/certificate`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success("Certificate uploaded!", { id: toastId });
            fetchMemberData(); // Refresh to show new certificate URL
        } catch (error) {
            toast.error("Upload failed.", { id: toastId });
            throw error; // Re-throw to let the modal know
        }
    };
    
    const handleChangeParticipantStatus = async (participationId: number, newStatus: 'registered' | 'attended' | 'cancelled') => {
        const toastId = toast.loading("Updating status...");
        try {
            // NOTE: You will need to create this endpoint in your backend
            await apiService.patch(`/participants/${participationId}/status`, { status: newStatus });
            toast.success("Status updated!", { id: toastId });
            fetchMemberData(); // Refresh to show new status
        } catch (error) {
            toast.error("Failed to update status.", { id: toastId });
        }
    };
    
    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="px-10 py-6">
            {/* Top Header Section */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-black"> {(member?.name)}'s Event <span className='text-grey-3'>({totalItems})</span></h1>
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
                        value={filterEventStatus}
                        // Update state and reset page on change
                        onChange={(e) => { setFilterEventStatus(e.target.value as 'All' | 'upcoming' | 'past' | 'ongoing'); setCurrentPage(1); setSelectedParticipationIds([]); }}
                        className="appearance-none w-32 py-3.5 px-3.5 pr-8 bg-white rounded-lg shadow-sm focus:border-blueSky focus:ring-blueSky text-sm"
                    >
                            <option value="All">All</option>
                            {/* Use the actual status values from your data */}
                            <option value="upcoming">Upcoming</option>
                            <option value="past">Completed</option>
                            <option value="ongoing">Ongoing</option>
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
                        placeholder="Search Event Name" // Be more specific
                        value={searchTerm}
                        // Update state and reset page on change
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); setSelectedParticipationIds([]); }}
                        className="w-full pl-9 pr-3 py-3.5 rounded-lg focus:ring-blueSky focus:border-blueSky text-sm bg-white shadow-sm placeholder:text-grey-2"
                    />
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-lg shadow-card overflow-hidden border border-gray-200">
                <MemberEventTable
                    memberEvents={paginatedMemberEvents} // Pass paginated data
                    selectedEvents={selectedParticipationIds}
                    onSelectEvent={handleSelectEvent}
                    onSelectAll={handleSelectAllOnPage}
                    onUploadCertificate={handleUploadCertificate}
                    onChangeStatus={handleChangeParticipantStatus}
                />
            </div>

            {/* Footer Section (Delete Button & Pagination) */}
            <div className="mt-6 flex flex-col justify-end items-end">
                <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                     <DialogTrigger asChild>
                         <button
                            // Button is disabled if nothing is selected OR modal is open (prevent double click)
                            disabled={selectedParticipationIds.length === 0 || isDeleteModalOpen}
                            className={`flex items-center space-x-2 px-6 py-3.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                                selectedParticipationIds.length > 0
                                ? 'bg-[#EE7373] text-white hover:bg-[#EE7373]/90 focus:ring-[#EE7373]/50'
                                : 'bg-[#BFBFBF]/45 text-white cursor-not-allowed' // Adjusted disabled style
                            }`}
                        >
                            <DeleteIcon className="w-4 h-4"/>
                            <span>Delete ({selectedParticipationIds.length})</span>
                        </button>
                    </DialogTrigger>
                    {/* Render Modal Content when open */}
                    <DeleteConfirmationModal
                        itemCount={selectedParticipationIds.length}
                        itemName="events for this member"
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
                    endIndex={startIndex + paginatedMemberEvents.length}
                />
        </div>
    );
    
};

export default ParticipantEventPage;