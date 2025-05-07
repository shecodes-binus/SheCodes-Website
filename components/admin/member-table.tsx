import React from 'react';
// Import the new type
import { EditIcon, EventIcon } from './icon';
import { Member } from '@/types/members';
import { EyeIcon, InfoIcon } from 'lucide-react';

interface MemberTableProps {
    members: Member[]; // Use the new type
    selectedMember: number[];    // IDs are numbers now
    onSelectMember: (id: number, checked: boolean) => void; // ID is number
    onSelectAll: (checked: boolean) => void;
    onViewEvent: (id: number) => void;     // ID is number
    onViewMember: (id: number) => void;     // ID is number
}

const MentorTable: React.FC<MemberTableProps> = ({
    members,
    selectedMember,
    onSelectMember,
    onSelectAll,    
    onViewEvent,
    onViewMember,
}) => {
    // These calculations remain the same logic, but operate on the current page's events
    const currentEventIds = members.map(e => e.id);
    const allSelectedOnPage = members.length > 0 && currentEventIds.every(id => selectedMember.includes(id));
    const isIndeterminate = members.length > 0 && currentEventIds.some(id => selectedMember.includes(id)) && !allSelectedOnPage;

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSelectAll(event.target.checked); // Pass the check state to the parent
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-collapse">
                <thead className='border-b border-gray-300'>
                    <tr>
                        <th className="px-6 py-4 w-12 text-left">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4"
                                checked={allSelectedOnPage} // Check if all on *current page* are selected
                                ref={input => {
                                    if (input) {
                                        input.indeterminate = isIndeterminate;
                                    }
                                }}
                                onChange={handleSelectAll}
                                // Disable if no events on the current page
                                disabled={members.length === 0}
                            />
                        </th>
                        <th className="px-4 py-3 text-left text-base font-semibold">
                            Member Name
                        </th>
                        <th className="pl-10 px-4 py-3 text-left text-base font-semibold">
                            Gender
                        </th>
                        <th className="pl-10 px-4 py-3 text-left text-base font-semibold">
                            Email
                        </th>
                        <th className="px-4 py-3 text-left text-base font-semibold">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((member) => (
                        // Use the number id as the key
                        <tr key={member.id} className="hover:bg-grey-1">
                            <td className="px-6 py-2 whitespace-nowrap align-middle">
                                <input
                                    type="checkbox"
                                    className="rounded border-black text-blueSky focus:ring-primary w-4 h-4"
                                    // Check if this specific event id (number) is selected
                                    checked={selectedMember.includes(member.id)}
                                    // Pass the number id to the handler
                                    onChange={(e) => onSelectMember(member.id, e.target.checked)}
                                />
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center space-x-3">
                                <img src={member.profilePicUrl} alt={`${member.fullName}'s avatar`} className="w-10 h-10 rounded-full bg-gray-200 object-cover" />
                                <div>{member.fullName}</div>
                            </td>
                            <td className="pl-10 px-4 py-3.5 text-sm text-textMuted">
                                {member.gender}
                            </td>
                            <td className="pl-10 px-4 py-3.5 text-sm text-textMuted">
                                {member.occupation}
                            </td>
                            <td className="pr-10 px-4 py-3.5 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-5">
                                    <button
                                        // Pass number id
                                        onClick={() => onViewMember(member.id)}
                                        className="flex items-center justify-center space-x-2 px-6 py-2.5 border border-blueSky rounded-lg text-sm text-blueSky bg-white hover:bg-blueSky hover:text-white border-[1.5px] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-light"
                                    >
                                        <InfoIcon className="w-4 h-4" />
                                        <span>Details</span>
                                    </button>
                                    <button
                                        // Pass number id
                                        onClick={() => onViewEvent(member.id)}
                                        className="flex items-center justify-center space-x-2 px-6 py-2.5 border border-blueSky rounded-lg text-sm text-blueSky bg-white hover:bg-blueSky hover:text-white border-[1.5px] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-light"
                                    >
                                        <EventIcon className="w-4 h-4" />
                                        <span>Events</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                     {members.length === 0 && (
                        <tr>
                            <td colSpan={5} className="text-center py-10 text-gray-500">
                                No members found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MentorTable;