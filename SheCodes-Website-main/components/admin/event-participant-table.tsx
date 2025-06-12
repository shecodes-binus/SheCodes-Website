"use client"

import React from 'react';
import Image from 'next/image';
import type { EventParticipant } from '@/types/eventParticipant';

// Helper function to format date string (e.g., YYYY-MM-DD to MM/DD/YYYY)
const formatDateString = (dateString: string | undefined | null): string => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        // Basic error check for invalid dates resulting from bad input
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        // Simple MM/DD/YYYY formatting:
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = String(date.getFullYear()); // Use full year
        return `${month}/${day}/${year}`;

    } catch (error) {
        console.error("Error formatting date:", dateString, error);
        return "Invalid Date";
    }
};

interface EventParticipantTableProps {
    participants: EventParticipant[];
    selectedParticipantIds: number[];
    onSelectParticipant: (id: number, checked: boolean) => void;
    onSelectAll: (checked: boolean) => void;
    onChangeStatus: (participantId: number, newStatus: 'registered' | 'attended' | 'cancelled') => void;
}

const EventParticipantTable: React.FC<EventParticipantTableProps> = ({
    participants,
    selectedParticipantIds,
    onSelectParticipant,
    onSelectAll,
    onChangeStatus,
}) => {
    // Calculate selection states for the header checkbox
    const currentParticipantIds = participants.map(p => p.id).filter((id): id is number => id !== undefined);
    const allSelectedOnPage = participants.length > 0 && currentParticipantIds.every(id => selectedParticipantIds.includes(id));
    const isIndeterminate = participants.length > 0 && currentParticipantIds.some(id => selectedParticipantIds.includes(id)) && !allSelectedOnPage;

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSelectAll(event.target.checked);
    };

    const handleStatusChange = (participantId: number | undefined, newStatus: string) => {
        if (participantId === undefined) return; // Should not happen with valid data

        // Type assertion as we know the possible values
        const validStatus = newStatus as 'registered' | 'attended' | 'cancelled';
        onChangeStatus(participantId, validStatus);
    };

    return (
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
                                disabled={participants.length === 0}
                                aria-label="Select all participants on this page"
                            />
                        </th>
                        <th className="px-4 py-3 text-left text-base font-semibold"> {/* Header style */}
                            Participant Name
                        </th>
                        <th className="px-4 py-3 text-left text-base font-semibold">
                            Email
                        </th>
                        <th className="px-4 py-3 text-left text-base font-semibold">
                            Registered On
                        </th>
                        <th className="px-4 py-3 text-left text-base font-semibold">
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200"> {/* Added row dividers */}
                    {participants.map((participant) => (
                        <tr key={participant.id} className="hover:bg-gray-50"> {/* Subtle hover */}
                            <td className="px-6 py-4 whitespace-nowrap align-middle"> {/* Adjusted padding */}
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-400 text-blueSky focus:ring-blueSky focus:ring-offset-0 h-4 w-4" // Adjusted styling
                                    checked={selectedParticipantIds.includes(participant.id)}
                                    onChange={(e) => onSelectParticipant(participant.id, e.target.checked)}
                                    aria-labelledby={`participant-name-${participant.id}`}
                                />
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center space-x-4">
                                <Image
                                    // Use a default/placeholder if profilePicUrl is missing
                                    src={participant.user.profile_picture || '/default-avatar.png'}
                                    alt={`${participant.user.name}'s profile picture`}
                                    width={40} // Specify width
                                    height={40} // Specify height
                                    className="w-10 h-10 rounded-full bg-gray-200 object-cover flex-shrink-0" // Added flex-shrink-0
                                />
                                <span id={`participant-name-${participant.id}`}>{participant.user.name}</span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-textMuted"> {/* Adjusted text color */}
                                {participant.user.email || 'N/A'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-textMuted">
                                {formatDateString(participant.registration_date)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                <div className='relative w-full'>
                                    {/* Status Dropdown */}
                                    <select
                                        value={participant.status || ''}
                                        onChange={(e) => handleStatusChange(participant.id, e.target.value)}
                                        className="appearance-none block w-full bg-white border border-gray-300 text-sm rounded-md shadow-sm py-1.5 pl-3 pr-10 focus:outline-none focus:ring-blueSky focus:border-blueSky"
                                        aria-label={`Change status for ${participant.user.name}`}
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
                        </tr>
                    ))}
                     {participants.length === 0 && (
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
    );
};

export default EventParticipantTable;