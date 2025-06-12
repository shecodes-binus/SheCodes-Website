"use client"

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Member } from '@/types/members';
import MemberTable from '@/components/admin/member-table';
import Pagination from '@/components/admin/pagination';
import { DeleteIcon } from '@/components/admin/icon';
import { FiChevronDown } from 'react-icons/fi';
import { IoMdSearch } from "react-icons/io";
import { DeleteConfirmationModal } from '@/components/admin/confirm-delete-modal';
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import apiService from '@/lib/apiService';
import toast from 'react-hot-toast';


const MemberPage: React.FC = () => {
    const router = useRouter();
    const [allMembers, setAllMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'All' | 'recent' | 'last'>('All');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]); // IDs are strings (UUIDs)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 

    const fetchMembers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiService.get<Member[]>('/users');
            // Filter out any non-member roles if necessary, e.g., admins
            setAllMembers(response.data.filter(u => u.role === 'member'));
        } catch (err) {
            toast.error("Could not load member data.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    const filteredMembers = useMemo(() => {
        let result = allMembers.filter(member =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filterStatus === 'recent') {
          result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        } else if (filterStatus === 'last') {
          result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        }
        return result;
    }, [allMembers, searchTerm, filterStatus]);

    const totalItems = filteredMembers.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedMembers = useMemo(() => {
        return filteredMembers.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredMembers, startIndex, itemsPerPage]);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        setSelectedMembers([]);
    }, []);

    const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1);
        setSelectedMembers([]);
    };

    const handleSelectMember = useCallback((id: string, checked: boolean) => {
        setSelectedMembers(prev => checked ? [...prev, id] : prev.filter(memberId => memberId !== id));
    }, []);

    const handleSelectAll = useCallback((checked: boolean) => {
        setSelectedMembers(checked ? paginatedMembers.map(member => member.id) : []);
    }, [paginatedMembers]);

    const handleViewEvent = (id: string) => {
        router.push(`/admin/members/${id}/events`);
    };

    const handleViewMember = (id: string) => {
        router.push(`/admin/members/${id}/details`);
    };

    const handleDeleteConfirmed = async () => {
        if (selectedMembers.length === 0) return;
        setIsDeleting(true);
        const toastId = toast.loading(`Deleting ${selectedMembers.length} member(s)...`);
        try {
            await Promise.all(
                selectedMembers.map(id => apiService.delete(`/users/${id}`))
            );
            toast.success("Members deleted successfully!", { id: toastId });
            setSelectedMembers([]);
            fetchMembers(); // Refresh data
        } catch (err) {
            toast.error("Failed to delete members.", { id: toastId });
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };
    
    if (loading) return <div className="p-10 text-center">Loading members...</div>;

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
                    members={paginatedMembers}
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
                endIndex={startIndex + paginatedMembers.length}
            />
        </div>
    );
};

export default MemberPage;