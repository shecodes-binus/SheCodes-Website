'use client';

import React, { useState } from 'react';
import { RxCross2 } from "react-icons/rx";

export interface ReplyInputFormProps {
    onSubmit: (text: string) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

const ReplyInputForm: React.FC<ReplyInputFormProps> = ({ onSubmit, onCancel, isSubmitting = false }) => {
    const [replyText, setReplyText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim() || isSubmitting) return;
        onSubmit(replyText);
        setReplyText('');
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row items-center gap-2">
            <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-grow text-sm p-3 border border-grey-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none placeholder:text-grey-2"
                placeholder="Write a reply..."
                aria-label="Add a reply"
            />
            <div className="flex gap-2 flex-shrink-0 self-start sm:self-end">
                 <button
                    type="submit"
                    className="p-3 bg-blueSky text-white text-sm rounded-md hover:bg-blueSky/90 disabled:opacity-50"
                    disabled={!replyText.trim() || isSubmitting}
                 >
                    <img src="/icons/send.svg" alt="Send reply" />
                </button>
                 <button
                    type="button"
                    onClick={onCancel}
                    className="p-3 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300"
                >
                    <RxCross2 size={25} />
                </button>
            </div>
        </form>
    );
};

export default ReplyInputForm;