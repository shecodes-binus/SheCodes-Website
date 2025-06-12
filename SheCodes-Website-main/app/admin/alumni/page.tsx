"use client"

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AlumniTable from '@/components/admin/alumni-table';
import Pagination from '@/components/admin/pagination';
import { PlusIcon, DeleteIcon } from '@/components/admin/icon';
import { FiChevronDown } from 'react-icons/fi';
import { IoMdSearch } from "react-icons/io";
import { DeleteConfirmationModal } from '@/components/admin/confirm-delete-modal';
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import apiService from '@/lib/apiService';
import { Alumni } from '@/types/alumnis';
import toast from 'react-hot-toast';

const AlumniPage: React.FC = () => {
    const router = useRouter();
    
    const [allAlumni, setAllAlumni] = useState<Alumni[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'All' | '1' | '2'>('All');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedAlumni, setSelectedAlumni] = useState<number[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 

    const fetchAlumni = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiService.get<Alumni[]>("/alumni");
            setAllAlumni(response.data);
        } catch (err) {
            toast.error("Could not load alumni data.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAlumni();
    }, [fetchAlumni]);

    const filteredAlumni = useMemo(() => {
        return allAlumni.filter(alumnus => {
            const statusMatch = filterStatus === 'All' || String(alumnus.batch) === filterStatus;
            const searchMatch = alumnus.name.toLowerCase().includes(searchTerm.toLowerCase());
            return statusMatch && searchMatch;
        });
    }, [allAlumni, searchTerm, filterStatus]);

    const totalItems = filteredAlumni.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedEvents = useMemo(() => {
        return filteredAlumni.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredAlumni, startIndex, itemsPerPage]);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        setSelectedAlumni([]);
    }, []);

    const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1);
        setSelectedAlumni([]);
    };

    const handleSelectAlumni = useCallback((id: number, checked: boolean) => {
        setSelectedAlumni(prev =>
            checked ? [...prev, id] : prev.filter(alumniId => alumniId !== id)
        );
    }, []);

    const handleSelectAll = useCallback((checked: boolean) => {
        if (checked) {
            setSelectedAlumni(paginatedEvents.map(alumnus => alumnus.id));
        } else {
            setSelectedAlumni([]);
        }
    }, [paginatedEvents]);

    const handleAddAlumni = () => {
        router.push('/admin/alumni/add-alumni'); 
    };

    const onEditAlumni = (id: number) => {
        router.push(`/admin/alumni/edit-alumni/${id}`);
    };

    const handleDeleteConfirmed = async () => {
        if (selectedAlumni.length === 0) return;
        const toastId = toast.loading(`Deleting ${selectedAlumni.length} alumni...`);
        try {
            await Promise.all(
                selectedAlumni.map(id => apiService.delete(`/alumni/${id}`))
            );
            toast.success("Alumni deleted successfully!", { id: toastId });
            setSelectedAlumni([]);
            fetchAlumni();
        } catch (err) {
            toast.error("Failed to delete alumni.", { id: toastId });
        } finally {
            setIsDeleteModalOpen(false);
        }
    };

    if (loading) {
        return <div className="p-10 text-center text-gray-500">Loading alumni...</div>;
    }

    return (
        <div className="px-10 py-6">
            {/* Top Header Section */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-black">Alumni <span className='text-grey-3'>({totalItems})</span></h1>
                 <button
                    onClick={handleAddAlumni}
                    className="flex items-center space-x-2 bg-blueSky text-sm text-white px-6 py-3.5 rounded-lg hover:bg-blueSky/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>Add Alumni</span>
                </button>
            </div>

             {/* Filters and Search Section */}
             <div className="mb-4 flex flex-wrap gap-6 items-center pb-2 rounded-lg">
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

                 <div className="flex items-center space-x-2 text-sm relative">
                    <select
                        value={filterStatus}
                        onChange={(e) => { setFilterStatus(e.target.value as 'All' | "1" | "2"); setCurrentPage(1); setSelectedAlumni([]); }}
                        className="appearance-none w-32 py-3.5 px-3.5 pr-8 bg-white rounded-lg shadow-sm focus:border-blueSky focus:ring-blueSky text-sm"
                    >
                         <option value="All">All Batches</option>
                         <option value="1">Batch 1</option>
                         <option value="2">Batch 2</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <FiChevronDown className="w-4 h-4 text-gray-500" />
                    </div>
                </div>

                <div className="relative ml-auto min-w-[400px]">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IoMdSearch className="h-4 w-4 text-grey-2" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search Alumni Name"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); setSelectedAlumni([]); }}
                        className="w-full pl-9 pr-3 py-3.5 rounded-lg focus:ring-blueSky focus:border-blueSky text-sm bg-white shadow-sm placeholder:text-grey-2"
                    />
                </div>
             </div>


            {/* Table Section */}
            <div className="bg-white rounded-lg shadow-card overflow-hidden border border-gray-200">
                <AlumniTable
                    // Pass the currently visible page of events
                    alumni={paginatedEvents}
                    selectedAlumni={selectedAlumni}
                    onSelectAlumni={handleSelectAlumni}
                    onSelectAll={handleSelectAll}
                    onEditAlumni={onEditAlumni}
                />
            </div>

            {/* Footer Section (Delete Button & Pagination) */}
            <div className="mt-6 flex flex-col justify-end items-end">
                <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                     <DialogTrigger asChild>
                        <button
                            disabled={selectedAlumni.length === 0 || isDeleteModalOpen}
                            className={`flex items-center space-x-2 px-6 py-3.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                                selectedAlumni.length > 0
                                ? 'bg-[#EE7373] text-white hover:bg-[#EE7373]/90 focus:ring-[#EE7373]/50'
                                : 'bg-[#BFBFBF]/45 text-white cursor-not-allowed'
                            }`}
                        >
                            <DeleteIcon className="w-4 h-4"/>
                            <span>Delete ({selectedAlumni.length})</span>
                        </button>
                    </DialogTrigger>
                    <DeleteConfirmationModal
                        itemCount={selectedAlumni.length}
                        itemName="alumni"
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
                endIndex={paginatedEvents.length > 0 ? startIndex + paginatedEvents.length : 0}
            />
        </div>
    );
};

export default AlumniPage;