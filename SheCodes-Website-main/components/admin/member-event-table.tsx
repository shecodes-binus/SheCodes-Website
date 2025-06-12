"use client"

import React, { useState, useRef } from 'react';
import type { EventParticipant } from '@/types/eventParticipant';
import { PlusIcon, Pencil as PencilIcon } from 'lucide-react';
import { Dialog } from "@/components/ui/dialog";
import { CertificateUploadModal } from '@/components/admin/certificate-modal';
import { DialogContent } from '@radix-ui/react-dialog';

interface MemberEventTableProps {
    memberEvents: EventParticipant[];       
    selectedEvents: number[];           
    onSelectEvent: (id: number, checked: boolean) => void;
    onSelectAll: (checked: boolean) => void;
    onUploadCertificate: (eventId: number, file: File) => Promise<void>;
    onChangeStatus: (participantId: number, newStatus: 'registered' | 'attended' | 'cancelled') => void;
}

const MemberEventTable: React.FC<MemberEventTableProps> = ({
    memberEvents,
    selectedEvents,
    onSelectEvent,
    onSelectAll,
    onUploadCertificate,
    onChangeStatus,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [targetEventIdForUpload, setTargetEventIdForUpload] = useState<number | null>(null);

    const currentEventIds = memberEvents.map(p => p.id).filter((id): id is number => id !== undefined);
    const allSelectedOnPage = memberEvents.length > 0 && currentEventIds.every(id => selectedEvents.includes(id));
    const isIndeterminate = memberEvents.length > 0 && currentEventIds.some(id => selectedEvents.includes(id)) && !allSelectedOnPage;

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSelectAll(event.target.checked);
    };

    const displayStatus = (status: 'upcoming' | 'past' | 'ongoing' | undefined): string => {
        if (status === 'past') return 'Completed';
        if (status === 'ongoing') return 'Ongoing';
        if (status === 'upcoming') return 'Upcoming' 
        return 'N/A';
    };

    const handleCertificateButtonClick = (eventId: number) => {
        setTargetEventIdForUpload(eventId);
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0] && targetEventIdForUpload !== null) {
            const file = event.target.files[0];
            console.log(`Uploading certificate for event ${targetEventIdForUpload}: ${file.name}`);
            try {
                // Call the passed-in upload handler
                await onUploadCertificate(targetEventIdForUpload, file);
                // Optionally, trigger a re-fetch or update local state to reflect the new certificateUrl
                alert('Certificate uploaded successfully!');
            } catch (error) {
                console.error('Certificate upload failed:', error);
                alert('Certificate upload failed.');
            } finally {
                setTargetEventIdForUpload(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''; // Reset file input
                }
            }
        }
    };

    const handleStatusChange = (participantId: number, newStatus: string) => {
        const validStatus = newStatus as 'registered' | 'attended' | 'cancelled';
        onChangeStatus(participantId, validStatus);
    };

    const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
    const [managingParticipant, setManagingParticipant] = useState<EventParticipant | null>(null);

    const openCertificateModal = (participant: EventParticipant) => {
        setManagingParticipant(participant);
        setIsCertificateModalOpen(true);
    };

    const closeCertificateModal = () => {
        setIsCertificateModalOpen(false);
        setManagingParticipant(null);
    };

    const handleModalUploadConfirm = async (eventId: number, file: File) => {
        try {
            await onUploadCertificate(eventId, file); 
            closeCertificateModal();
            alert('Certificate uploaded successfully via modal!'); 
        } catch (error) {
            console.error('Modal upload failed:', error);
            alert('Certificate upload failed via modal.');
        }
    };

    return (
        <>
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-collapse">
                <thead className='border-b border-gray-300'> {/* Added subtle bg to header */}
                    <tr>
                        <th className="px-6 py-3 w-12 text-left"> {/* Adjusted padding */}
                            <input
                                type="checkbox"
                                className="rounded border-gray-400 text-primary focus:ring-blueSky focus:ring-offset-0 h-4 w-4" // Adjusted styling
                                checked={allSelectedOnPage}
                                ref={input => {
                                    if (input) {
                                        input.indeterminate = isIndeterminate;
                                    }
                                }}
                                onChange={handleSelectAll}
                                disabled={memberEvents.length === 0}
                                aria-label="Select all events on this page"
                            />
                        </th>
                        <th className="px-4 py-3 text-left text-base font-semibold"> {/* Header style */}
                            Event Name
                        </th>
                        <th className="px-4 py-3 text-left text-base font-semibold">
                            Participation Status
                        </th>
                        <th className="py-3 text-left text-base font-semibold">
                            Event Status
                        </th>
                        <th className="px-4 py-3 text-left text-base font-semibold">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200"> {/* Added row dividers */}
                    {memberEvents.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50"> {/* Subtle hover */}
                            <td className="px-6 py-4 whitespace-nowrap align-middle"> {/* Adjusted padding */}
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-400 text-blueSky focus:ring-blueSky focus:ring-offset-0 h-4 w-4" // Adjusted styling
                                    checked={selectedEvents.includes(p.id)}
                                    onChange={(e) => onSelectEvent(p.id, e.target.checked)}
                                    aria-labelledby={`event-name-${p.id}`}
                                />
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-textMuted"> {/* Adjusted text color */}
                                {p.event.title || 'N/A'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                                <div className="relative w-full max-w-[150px]">
                                    {/* Status Dropdown */}
                                    <select
                                        value={p.status || ''}
                                        onChange={(e) => handleStatusChange(p.id, e.target.value)}
                                        className="appearance-none block w-full bg-white border border-gray-300 text-sm rounded-md shadow-sm py-1.5 pl-3 pr-10 focus:outline-none focus:ring-blueSky focus:border-blueSky"
                                        aria-label={`Change status for ${p.event.title}`}
                                    >
                                        <option value="registered">Registered</option>
                                        <option value="attended">Attended</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                                        {/* Custom Arrow Icon */}
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                            {/* Using a more compact chevron icon path */}
                                            <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </td>
                            <td className="py-4 whitespace-nowrap text-sm text-gray-600">
                                {displayStatus(p.event.status)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                {/* Button to open the certificate modal */}
                                <button
                                    onClick={() => openCertificateModal(p)}
                                    className="flex items-center justify-center space-x-2 px-4 py-2.5 border border-blueSky rounded-lg text-sm text-blueSky bg-white hover:bg-blueSky hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blueSky/50"
                                    aria-label={p.certificate_url ? `Edit certificate for ${p.event.title}` : `Add certificate for ${p.event.title}`}
                                >
                                    {p.certificate_url ? <PencilIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
                                    <span>{p.certificate_url ? 'Edit Certificate' : 'Add Certificate'}</span>
                                </button>
                            </td>
                        </tr>
                    ))}
                     {memberEvents.length === 0 && (
                        <tr>
                            {/* Adjusted colspan */}
                            <td colSpan={5} className="text-center py-10 text-gray-500">
                                No participants found matching criteria.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        <Dialog open={isCertificateModalOpen} onOpenChange={setIsCertificateModalOpen}>
            <DialogContent>
                {managingParticipant && (
                    <CertificateUploadModal
                        participationId={managingParticipant.id}
                        currentCertificateUrl={managingParticipant.certificate_url}
                        onUpload={onUploadCertificate} 
                        onClose={closeCertificateModal}
                    />
                )}
            </DialogContent>
        </Dialog>
        </>
    );
};

export default MemberEventTable;