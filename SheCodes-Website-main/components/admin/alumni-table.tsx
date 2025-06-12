import React from 'react';
// Import the new type
import { EditIcon } from './icon';
import { Alumni } from '@/types/alumnis';

interface AlumniTableProps {
    alumni: Alumni[]; // Use the new type
    selectedAlumni: number[];    // IDs are numbers now
    onSelectAlumni: (id: number, checked: boolean) => void; // ID is number
    onSelectAll: (checked: boolean) => void;
    onEditAlumni: (id: number) => void;     // ID is number
}

const AlumniTable: React.FC<AlumniTableProps> = ({
    alumni,
    selectedAlumni,
    onSelectAlumni,
    onSelectAll,    
    onEditAlumni,
}) => {
    // These calculations remain the same logic, but operate on the current page's events
    const currentEventIds = alumni.map(e => e.id);
    const allSelectedOnPage = alumni.length > 0 && currentEventIds.every(id => selectedAlumni.includes(id));
    const isIndeterminate = alumni.length > 0 && currentEventIds.some(id => selectedAlumni.includes(id)) && !allSelectedOnPage;

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
                                disabled={alumni.length === 0}
                            />
                        </th>
                        <th className="px-4 py-3 text-left text-base font-semibold">
                            Alumni Name
                        </th>
                        <th className="px-4 py-3 text-left text-base font-semibold">
                            Batch
                        </th>
                        <th className="px-4 py-3 text-left text-base font-semibold">
                            University
                        </th>
                        <th className="px-4 py-3 text-left text-base font-semibold">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {alumni.map((alumni) => (
                        // Use the number id as the key
                        <tr key={alumni.id} className="hover:bg-grey-1">
                            <td className="px-6 py-2 whitespace-nowrap align-middle">
                                <input
                                    type="checkbox"
                                    className="rounded border-black text-blueSky focus:ring-primary w-4 h-4"
                                    // Check if this specific event id (number) is selected
                                    checked={selectedAlumni.includes(alumni.id)}
                                    // Pass the number id to the handler
                                    onChange={(e) => onSelectAlumni(alumni.id, e.target.checked)}
                                />
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center space-x-3">
                                <img src={alumni.image_src} alt={`${alumni.name}'s avatar`} className="w-10 h-10 rounded-full bg-gray-200 object-cover" />
                                <div>{alumni.name}</div>
                            </td>
                            <td className="pl-5 pr-4 py-3.5 whitespace-nowrap text-sm text-textMuted">
                                {alumni.batch}
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap text-sm text-textMuted">
                                {alumni.university}
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-3">
                                    <button
                                        // Pass number id
                                        onClick={() => onEditAlumni(alumni.id)}
                                        className="flex items-center justify-center space-x-2 px-6 py-2.5 border border-blueSky rounded-lg text-sm text-blueSky bg-white hover:bg-blueSky hover:text-white border-[1.5px] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-light"
                                    >
                                        <EditIcon className="w-4 h-4" />
                                        <span>Edit</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {alumni.length === 0 && (
                        <tr>
                            <td colSpan={5} className="text-center py-10 text-gray-500">
                                No alumnis found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AlumniTable;