import React from 'react';
// Import the new type
import { CombinedEventData } from '@/types/events';
import { EditIcon, CloseIcon, ViewParticipantsIcon } from './icon';
import {
    Dialog,
    DialogTrigger,
    // DialogContent, DialogHeader etc. are NOT needed here anymore for these modals
  } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { CloseRegisterModal } from './close-register-modal';
import { useRouter } from 'next/navigation';

// Helper function to format ISO date string to MM/DD/YY
const formatDateString = (isoString: string): string => {
    try {
        const date = new Date(isoString);
        // Basic error check for invalid dates resulting from bad input
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        // Intl.DateTimeFormat is generally good for locale-aware formatting
        // return new Intl.DateTimeFormat('en-US', { // Adjust locale as needed
        //     year: '2-digit',
        //     month: '2-digit',
        //     day: '2-digit',
        // }).format(date);

        // Or simple MM/DD/YY formatting:
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2); // Get last 2 digits
        return `${month}/${day}/${year}`;

    } catch (error) {
        console.error("Error formatting date:", isoString, error);
        return "Invalid Date";
    }
};


interface EventTableProps {
    events: CombinedEventData[]; // Use the new type
    selectedEvents: number[];    // IDs are numbers now
    onSelectEvent: (id: number, checked: boolean) => void; // ID is number
    onSelectAll: (checked: boolean) => void;
    onCloseRegister: (id: number) => void; // ID is number
    onEditEvent: (id: number) => void;     // ID is number
    onViewParticipants: (id: number) => void; // ID is number
}

const EventTable: React.FC<EventTableProps> = ({
    events,
    selectedEvents,
    onSelectEvent,
    onSelectAll,
    onCloseRegister,
    onEditEvent,
    onViewParticipants,
}) => {
    // These calculations remain the same logic, but operate on the current page's events
    const currentEventIds = events.map(e => e.id);
    const allSelectedOnPage = events.length > 0 && currentEventIds.every(id => selectedEvents.includes(id));
    const isIndeterminate = events.length > 0 && currentEventIds.some(id => selectedEvents.includes(id)) && !allSelectedOnPage;

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSelectAll(event.target.checked); // Pass the check state to the parent
    };

    const [openModalEventId, setOpenModalEventId] = React.useState<number | null>(null);

    const closeModal = () => setOpenModalEventId(null);

    const handleConfirmCloseRegister = (id: number) => {
        onCloseRegister(id);
        closeModal();
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-collapse">
                <thead className='border-b border-gray-300'>
                    <tr>
                        <th className="px-6 py-4 w-12 text-left">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                                checked={allSelectedOnPage} // Check if all on *current page* are selected
                                ref={input => {
                                    if (input) {
                                        input.indeterminate = isIndeterminate;
                                    }
                                }}
                                onChange={handleSelectAll}
                                // Disable if no events on the current page
                                disabled={events.length === 0}
                            />
                        </th>
                        <th className="px-4 py-3 text-left text-base font-semibold">
                            Event
                        </th>
                        <th className="pl-20 px-4 py-3 text-left text-base font-semibold">
                            Start Date
                        </th>
                        <th className="px-4 py-3 text-left text-base font-semibold">
                            End Date
                        </th>
                        <th className="px-4 py-3 text-left text-base font-semibold">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event) => (
                        // Use the number id as the key
                        <tr key={event.id} className="hover:bg-grey-1">
                            <td className="px-6 py-2 whitespace-nowrap align-middle">
                                <input
                                    type="checkbox"
                                    className="rounded border-black text-blueSky focus:ring-primary  h-4 w-4"
                                    // Check if this specific event id (number) is selected
                                    checked={selectedEvents.includes(event.id)}
                                    // Pass the number id to the handler
                                    onChange={(e) => onSelectEvent(event.id, e.target.checked)}
                                />
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap text-sm font-medium text-gray-900">
                                {/* Display the title */}
                                {event.title}
                            </td>
                            <td className="pl-20 px-4 py-3.5 whitespace-nowrap text-sm text-textMuted">
                                {/* Format the start date */}
                                {formatDateString(event.startDate)}
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap text-sm text-textMuted">
                                {/* Format the end date */}
                                {formatDateString(event.endDate)}
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-3">
                                    <Dialog open={openModalEventId === event.id} onOpenChange={(isOpen) => setOpenModalEventId(isOpen ? event.id : null)}>
                                        <DialogTrigger asChild>
                                            <Button type="button" variant="outline" onClick={() => setOpenModalEventId(event.id)} className="flex items-center justify-center space-x-0 px-6 py-2.5 border border-blueSky rounded-lg text-sm text-blueSky bg-white hover:bg-blueSky hover:text-white border-[1.5px] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-light">
                                                <CloseIcon className="w-4 h-4" />
                                                <span>Close Register</span>
                                                </Button>
                                        </DialogTrigger>
                                        <CloseRegisterModal
                                            onSuccess={() => handleConfirmCloseRegister(event.id)}
                                        />
                                    </Dialog>
                                    <button
                                        // Pass number id
                                        onClick={() => onEditEvent(event.id)}
                                        className="flex items-center justify-center space-x-2 px-6 py-2.5 border border-blueSky rounded-lg text-sm text-blueSky bg-white hover:bg-blueSky hover:text-white border-[1.5px] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-light"
                                    >
                                        <EditIcon className="w-4 h-4" />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        // Pass number id
                                        onClick={() => onViewParticipants(event.id)}
                                        className="flex items-center justify-center space-x-2 px-6 py-2.5 border border-blueSky rounded-lg text-sm text-blueSky bg-white hover:bg-blueSky hover:text-white border-[1.5px] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-light"
                                    >
                                        <ViewParticipantsIcon className="w-4 h-4" />
                                        <span>View Participants</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                     {events.length === 0 && (
                        <tr>
                            <td colSpan={5} className="text-center py-10 text-gray-500">
                                No events found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default EventTable;