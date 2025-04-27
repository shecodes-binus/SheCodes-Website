'use client'; // Keep this if using client-side state/hooks

import React, { useState } from 'react';
import { FaCross } from 'react-icons/fa';
import { RxCross2 } from "react-icons/rx";


// Interface defines the props the component expects
export interface ReplyInputFormProps {
    onSubmit: (text: string) => void; // Function to call when submitting
    onCancel: () => void;          // Function to call when canceling
    initialText?: string;          // Optional initial text for editing (not used here yet)
    placeholder?: string;          // Custom placeholder text
    submitButtonText?: string;     // Custom submit button text
    cancelButtonText?: string;     // Custom cancel button text
}

const ReplyInputForm: React.FC<ReplyInputFormProps> = ({
    onSubmit,
    onCancel,
    initialText = '',
    placeholder = "Write a reply...", // Default placeholder
    submitButtonText = "Reply",      // Default submit text
    cancelButtonText = "Cancel"      // Default cancel text
}) => {
    const [replyText, setReplyText] = useState(initialText);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent page reload if used in a form tag
        if (!replyText.trim()) return; // Don't submit empty replies
        onSubmit(replyText);
        setReplyText(''); // Clear the input after submit
    };

    const handleCancel = () => {
        onCancel();
        setReplyText(''); // Clear text on cancel
    };

    return (
        // Using form for better accessibility and potential Enter key submission
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row items-center gap-2">
            <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-grow text-sm p-3 border border-grey-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none placeholder:text-grey-2"
                // rows={4}
                placeholder="Add a comment..."
                aria-label="Add a comment"
            />
            <div className="flex gap-2 flex-shrink-0 self-start sm:self-end">
                 <button
                    type="submit"
                    className="p-3 bg-blueSky text-white text-sm rounded-md hover:bg-blueSky/90 disabled:opacity-50"
                    disabled={!replyText.trim()}
                 >
                    <img src="/icons/send.svg" alt="" />
                </button>
                 <button
                    type="button" // Important: type="button" to prevent form submission
                    onClick={handleCancel}
                    className="p-3 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300"
                >
                    {/* {cancelButtonText} */}
                    <RxCross2 size={25} />
                </button>
            </div>
        </form>
    );
};

// Export the component to make it available for import
export default ReplyInputForm;