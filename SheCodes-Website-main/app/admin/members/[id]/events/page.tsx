"use client"

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { allEventsData } from '@/data/dummyEvent';
import { dummyEventParticipants } from '@/data/dummyParticipants';
import { useParams } from 'next/navigation';
import type { Member } from '@/types/members'; // Or from '@/types/events' if you put it there
import type { EventParticipant } from '@/types/eventParticipant'; 
import type { CombinedEventData } from '@/types/events';
import { DeleteConfirmationModal } from '@/components/admin/confirm-delete-modal';
import {
    Dialog,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { FiChevronDown } from 'react-icons/fi';
import { PlusIcon, SearchIcon, DeleteIcon } from '@/components/admin/icon';
import Pagination from '@/components/admin/pagination';
import { IoMdSearch } from "react-icons/io";
import MemberEventTable from '@/components/admin/member-event-table';
import { dummyMembers } from '@/data/dummyMembers';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface EnrichedMemberEvent extends EventParticipant {
    title: string;          
    eventType: string;     
    eventStatus: 'upcoming' | 'past' | 'ongoing'; 
}

const ParticipantEventPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const memberId = params.id ? parseInt(params.id as string, 10) : null;

    const currentMember = useMemo(() => {
        if (!memberId) return null;
        return dummyMembers.find(m => m.id === memberId);
    }, [memberId]);

    const memberParticipations = useMemo(() => {
        if (!memberId) return [];
        return dummyEventParticipants.filter(p => p.memberId === memberId);
    }, [memberId]);

    const allEnrichedMemberEvents = useMemo<EnrichedMemberEvent[]>(() => {
        return memberParticipations.map(participation => {
            const eventInfo = allEventsData.find(e => e.id === participation.eventId);
            if (!eventInfo) {
                console.warn(`Event details not found for eventId: ${participation.eventId}`);
                return null; // Or a default object, but filtering null is safer
            }

            let derivedEventStatus: 'upcoming' | 'past' | 'ongoing' = eventInfo.status as 'upcoming' | 'past' | 'ongoing'; // Base status
            const now = new Date();
            const start = new Date(eventInfo.startDate);
            const end = new Date(eventInfo.endDate);

            if (start <= now && end >= now) {
                derivedEventStatus = 'ongoing';
            } else if (end < now) {
                derivedEventStatus = 'past';
            } else if (start > now) {
                derivedEventStatus = 'upcoming';
            }

            return {
                ...participation, // Spreads eventId, memberId, registrationDate, status (participant), certificateUrl
                title: eventInfo.title,
                eventType: eventInfo.type,
                eventStatus: derivedEventStatus,
            };
        }).filter((event): event is EnrichedMemberEvent => event !== null);
    }, [memberParticipations]);

    const [currentMemberEvents, setCurrentMemberEvents] = useState<EnrichedMemberEvent[]>([]);

    const [itemsPerPage, setItemsPerPage] = React.useState(10);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [filterParticipantStatus, setFilterParticipantStatus] = useState<'All' | 'upcoming' | 'past' | 'ongoing'>('All');
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedEventIds, setSelectedEventIds] = useState<number[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 

    useEffect(() => {
        setCurrentMemberEvents(allEnrichedMemberEvents);
        setCurrentPage(1);
        setSelectedEventIds([]);
    }, [allEnrichedMemberEvents]);

    // Filtering Logic
    const filteredMemberEvents = useMemo(() => {
        return currentMemberEvents.filter(event => {
            // Filter by participant's status for this event
            const statusMatch = filterParticipantStatus === 'All' || event.eventStatus === filterParticipantStatus;
            const searchLower = searchTerm.toLowerCase();
            // Search by event title
            const titleMatch = event.title.toLowerCase().includes(searchLower);
            return statusMatch && titleMatch;
        });
    }, [currentMemberEvents, searchTerm, filterParticipantStatus]);


    // Pagination Logic
    const totalItems = filteredMemberEvents.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedMemberEvents = useMemo(() => {
        return filteredMemberEvents.slice(startIndex, endIndex);
     }, [filteredMemberEvents, startIndex, endIndex]);

    // Handlers
    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        setSelectedEventIds([]);
    }, []);

    const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1);
        setSelectedEventIds([]);
    };

    const handleSelectEvent = useCallback((eventId: number, checked: boolean) => {
        setSelectedEventIds(prev =>
            checked ? [...prev, eventId] : prev.filter(id => id !== eventId)
        );
    }, []);

    const handleSelectAllOnPage = useCallback((checked: boolean) => {
        if (checked) {
            setSelectedEventIds(paginatedMemberEvents.map(event => event.eventId));
        } else {
            const currentPageEventIds = paginatedMemberEvents.map(event => event.eventId);
            setSelectedEventIds(prev => prev.filter(id => !currentPageEventIds.includes(id)));
        }
    }, [paginatedMemberEvents]);

    const handleDeleteConfirmed = () => {
        if (selectedEventIds.length === 0) return;

        console.log("Deleting participations for events (by eventId):", selectedEventIds, "for member:", memberId);
        // In a real app, you'd make API calls to delete these EventParticipant records.
        // For simulation, remove them from currentMemberEvents
        setCurrentMemberEvents(prev => prev.filter(event => !selectedEventIds.includes(event.eventId)));
        setSelectedEventIds([]);
        setIsDeleteModalOpen(false);
        console.log("Simulated Delete Complete. Selection cleared.");
    };

    const handleUploadCertificate = async (eventId: number, file: File) => {
        console.log(`Page: Uploading certificate for event ${eventId} (member ${memberId}), file: ${file.name}`);
        // Simulate upload and update certificateUrl for the specific event participation
        setCurrentMemberEvents(prevEvents =>
            prevEvents.map(event =>
                event.eventId === eventId
                    ? { ...event, certificateUrl: URL.createObjectURL(file) } // Temporary URL for display
                    : event
            )
        );
        // In a real app:
        // 1. Upload file to server, get back the permanent URL.
        // 2. Update the EventParticipant record in the database with this new certificateUrl.
        // 3. Re-fetch or update local state.
        alert('Certificate upload simulated! URL updated locally.');
    };

    const handleChangeParticipantStatus = (eventId: number, newStatus: 'registered' | 'attended' | 'cancelled') => {
        console.log(`Changing participant status for event ${eventId} to ${newStatus} for member ${memberId}`);
        setCurrentMemberEvents(prevEvents =>
            prevEvents.map(p =>
                p.eventId === eventId
                    ? { ...p, status: newStatus } // 'status' here is participant's status
                    : p
            )
        );
        // API call to update EventParticipant.status
    };

    return (
        <div className="px-10 py-6">
            {/* Top Header Section */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-black"> {(currentMember?.fullName)}'s Event <span className='text-grey-3'>({totalItems})</span></h1>
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
                        value={filterParticipantStatus}
                        // Update state and reset page on change
                        onChange={(e) => { setFilterParticipantStatus(e.target.value as 'All' | 'upcoming' | 'past' | 'ongoing'); setCurrentPage(1); setSelectedEventIds([]); }}
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
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); setSelectedEventIds([]); }}
                        className="w-full pl-9 pr-3 py-3.5 rounded-lg focus:ring-blueSky focus:border-blueSky text-sm bg-white shadow-sm placeholder:text-grey-2"
                    />
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-lg shadow-card overflow-hidden border border-gray-200">
                <MemberEventTable
                    memberEvents={paginatedMemberEvents} // Pass paginated data
                    selectedEvents={selectedEventIds}
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
                            disabled={selectedEventIds.length === 0 || isDeleteModalOpen}
                            className={`flex items-center space-x-2 px-6 py-3.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                                selectedEventIds.length > 0
                                ? 'bg-[#EE7373] text-white hover:bg-[#EE7373]/90 focus:ring-[#EE7373]/50'
                                : 'bg-[#BFBFBF]/45 text-white cursor-not-allowed' // Adjusted disabled style
                            }`}
                        >
                            <DeleteIcon className="w-4 h-4"/>
                            <span>Delete ({selectedEventIds.length})</span>
                        </button>
                    </DialogTrigger>
                    {/* Render Modal Content when open */}
                    <DeleteConfirmationModal
                        itemCount={selectedEventIds.length}
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
                    endIndex={endIndex}
                />
        </div>
    );
    
};

export default ParticipantEventPage;