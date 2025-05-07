import React from 'react';
// Import the new type
import { EditIcon } from './icon';
import { BlogArticle } from '@/types/blog';

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

const formatTimeString = (isoString: string): string => {
    try {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) {
            return 'Invalid Time';
        }

        // Get hours and minutes
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        // Convert to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 => 12

        return `${hours}:${minutes} ${ampm}`;
    } catch (error) {
        console.error("Error formatting time:", isoString, error);
        return "Invalid Time";
    }
};

interface BlogTableProps {
    blogs: BlogArticle[]; // Use the new type
    selectedBlog: number[];    // IDs are numbers now
    onSelectBlog: (id: number, checked: boolean) => void; // ID is number
    onSelectAll: (checked: boolean) => void;
    onEditBlog: (id: number) => void;     // ID is number
}

const BlogTable: React.FC<BlogTableProps> = ({
    blogs,
    selectedBlog,
    onSelectBlog,
    onSelectAll,    
    onEditBlog,
}) => {
    // These calculations remain the same logic, but operate on the current page's events
    const currentEventIds = blogs.map(e => e.id);
    const allSelectedOnPage = blogs.length > 0 && currentEventIds.every(id => selectedBlog.includes(id));
    const isIndeterminate = blogs.length > 0 && currentEventIds.some(id => selectedBlog.includes(id)) && !allSelectedOnPage;

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
                                disabled={blogs.length === 0}
                            />
                        </th>
                        <th className="px-4 py-3 text-left text-base font-semibold">
                            Article Title
                        </th>
                        <th className="px-4 py-3 text-left text-base font-semibold">
                            Publish Date
                        </th>
                        <th className="px-4 py-3 text-left text-base font-semibold">
                            Time
                        </th>
                        <th className="px-4 py-3 text-left text-base font-semibold">
                            Author Name
                        </th>
                        <th className="px-4 py-3 text-left text-base font-semibold">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {blogs.map((blog) => (
                        // Use the number id as the key
                        <tr key={blog.id} className="hover:bg-grey-1">
                            <td className="px-6 py-2 whitespace-nowrap align-middle">
                                <input
                                    type="checkbox"
                                    className="rounded border-black text-blueSky focus:ring-primary w-4 h-4"
                                    // Check if this specific event id (number) is selected
                                    checked={selectedBlog.includes(blog.id)}
                                    // Pass the number id to the handler
                                    onChange={(e) => onSelectBlog(blog.id, e.target.checked)}
                                />
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap text-sm font-medium text-gray-900">
                                {blog.title}
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap text-sm text-textMuted">
                                {formatDateString(blog.publishedAt)}
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap text-sm text-textMuted">
                                {formatTimeString(blog.publishedAt)}
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap text-sm text-textMuted">
                                {blog.authorName}
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-3">
                                    <button
                                        // Pass number id
                                        onClick={() => onEditBlog(blog.id)}
                                        className="flex items-center justify-center space-x-2 px-6 py-2.5 border border-blueSky rounded-lg text-sm text-blueSky bg-white hover:bg-blueSky hover:text-white border-[1.5px] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-light"
                                    >
                                        <EditIcon className="w-4 h-4" />
                                        <span>Edit</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                     {blogs.length === 0 && (
                        <tr>
                            <td colSpan={5} className="text-center py-10 text-gray-500">
                                No articles found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default BlogTable;