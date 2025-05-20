'use client';

// Import useState and useEffect
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import ReplyInputForm from '@/components/alumni/reply-input-form';

// --- Type Definitions ---
interface Reply {
    id: string; // Usually strings for replies to avoid collision with main IDs
    author: string;
    date: string;
    text: string;
    avatar: string;
    likes: number;
    commentCount: number; // Assuming this is for nested replies, maybe keep 0 for now
}

interface MainComment {
    id: number; // Keep as number if it's distinct from reply IDs
    author: string;
    date: string;
    text: string;
    avatar: string;
    likes: number;
    replyCount: number;
}

interface CommentData {
    mainComment: MainComment;
    replies: Reply[];
}

// --- Dummy Data Simulation (Keep as is) ---
const getAllComments = () => ({
    
    '1': {
        mainComment: { id: 1,
            author: "Wina",
            date: "April 10, 2025",
            text: "Witnessing all of these women excel—boldly leading, producing, and overcoming barriers—inspired me. Their resilience reminded me that my value is not set by the limitations that society seeks to impose upon me, or the negative doubts of lesser voices.",
            avatar: "/alumnis/wina.jpeg",
            likes: 15, // Added likes count
            replyCount: 2 // Added reply count
        },
        replies: [
            { id: 'reply-1-1', author: "Iqbal", date: "Nov 27, 2024", text: "Great perspective!", avatar: "/alumnis/iqbal.jpeg", likes: 2, commentCount: 0 },
            { id: 'reply-1-2', author: "Rahma", date: "Nov 28, 2024", text: "Absolutely inspiring.", avatar: "/alumnis/rahma.png", likes: 3, commentCount: 0 }
        ]
    },
    '2': {
        mainComment: { id: 2,
            author: "Andita", 
            date: "April 8, 2025",
            text: "As a woman, I have the power to become something magnificent, to overcome expectations, and to build a world where courage, not confinement, characterizes us. Their paths became the mirror that reflected all that I am able to become.",
            avatar: "/alumnis/andita.jpeg",
            likes: 8, // Added likes count
            replyCount: 0 // Added reply count
        },
        replies: []
    },
    '3': {
         mainComment: { id: 3,
            author: "Dewi", 
            date: "April 5, 2025",
            text: "These women are the epitome of strength in showing up. They stay soft in a world that literally hardens, but they keep growing nonetheless. Their resilience, their nature, their character reminded me that I, too, am becoming.",
            avatar: "/alumnis/dewi.jpeg",
            likes: 22, // Added likes count
            replyCount: 1 // Added reply count
         },
         replies: [ { id: 'reply-3-1', author: "Wina", date: "April 6, 2025", text: "Well said!", avatar: "/alumnis/wina.jpeg", likes: 5, commentCount: 0 } ]
    }
});

const getCommentData = (id: string): CommentData | null => {
    const allData = getAllComments();
    const commentIdStr = id as keyof typeof allData;
    return allData[commentIdStr] || null;
};

// --- Page Component ---
export default function CommentDetailPage({ params }: { params: { id: string } }) {
    const { id } = params;

    // --- State for Comment Data ---
    const [commentState, setCommentState] = useState<CommentData | null>(null);
    // --- State for Liked Item IDs (main comment ID or reply ID) ---
    const [likedItemIds, setLikedItemIds] = useState<Set<number | string>>(new Set());
    // State for loading/error handling (optional but good practice)
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [replyingToId, setReplyingToId] = useState<number | string | null>(null);

    // --- Fetch data and set initial state ---
    useEffect(() => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedData = getCommentData(id);
            if (fetchedData) {
                setCommentState(fetchedData);
                // TODO: In a real app, you might fetch the user's liked status
                // for this comment/replies and initialize likedItemIds here.
            } else {
                setError("Comment not found.");
            }
        } catch (err) {
            console.error("Error fetching comment data:", err);
            setError("Failed to load comment data.");
        } finally {
            setIsLoading(false);
        }
    }, [id]); // Re-run effect if the comment ID changes

    // --- Like/Unlike Toggle Handler ---
    const handleLikeToggle = (itemId: number | string, type: 'main' | 'reply') => {
        const isCurrentlyLiked = likedItemIds.has(itemId);

        // Update the comment state (main or reply likes)
        setCommentState(prevState => {
            if (!prevState) return null; // Should not happen if called correctly, but type safety

            // Create a deep enough copy to modify likes safely
            const newState = {
                ...prevState,
                // Important: Create new mainComment object if modifying it
                mainComment: { ...prevState.mainComment },
                // Important: Create new replies array if modifying any reply
                replies: prevState.replies.map(r => ({ ...r }))
            };

            if (type === 'main') {
                const currentLikes = newState.mainComment.likes;
                newState.mainComment.likes = Math.max(0, isCurrentlyLiked ? currentLikes - 1 : currentLikes + 1);
            } else { // type === 'reply'
                const replyIndex = newState.replies.findIndex(r => r.id === itemId);
                if (replyIndex > -1) {
                    const currentLikes = newState.replies[replyIndex].likes;
                    newState.replies[replyIndex].likes = Math.max(0, isCurrentlyLiked ? currentLikes - 1 : currentLikes + 1);
                }
            }
            return newState;
        });

        // Update the set of liked IDs
        setLikedItemIds(prevSet => {
            const newSet = new Set(prevSet);
            if (isCurrentlyLiked) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });

         console.log(isCurrentlyLiked ? `Unliked ${type} ID: ${itemId}` : `Liked ${type} ID: ${itemId}`);
    };

    // --- Reply Handlers (Keep as is) ---
    const handleStartReply = (itemId: number | string) => {
        setReplyingToId(itemId);
    };
    const handleCancelReply = () => {
        setReplyingToId(null);
    };
    const handleReplySubmit = (text: string) => {
        if (!replyingToId || !commentState) return;
        const newReply: Reply = {
            id: `reply-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            author: "CurrentUser", // TODO: Replace
            date: new Date().toLocaleDateString('en-CA'),
            text: text,
            avatar: "/alumnis/default-avatar.png", // TODO: Replace
            likes: 0,
            commentCount: 0,
        };
        setCommentState(prevState => {
            if (!prevState) return null;
            const newState = {
                ...prevState,
                mainComment: { ...prevState.mainComment },
                replies: [...prevState.replies, newReply]
            };
            return newState;
        });
        setReplyingToId(null);
        console.log(`Submitted reply to ${replyingToId}:`, text);
    };



    // --- Render Logic ---
    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center p-8">Loading...</div>;
    }

    if (error || !commentState) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8">
                {error || "Comment data unavailable."}
                <Link href="/alumni-discussion" className="ml-2 text-blue-600 hover:underline"> Go back to discussion</Link>
            </div>
        );
    }

    // Destructure after confirming commentState is not null
    const { mainComment, replies } = commentState;
    const isMainCommentLiked = likedItemIds.has(mainComment.id);

    return (
        <div className="container mx-auto py-12 md:py-16 px-4 sm:px-8 md:px-12 lg:px-32 min-h-screen">
            <h2 className="text-3xl font-bold sm:text-3xl xl:text-4xl/none text-pink text-center mb-10 md:mb-12">
                Discussion
            </h2>

            {/* --- Main Comment Section --- */}
            <div className="mb-8 md:mb-12 p-5 border border-blueSky rounded-lg bg-white shadow-sm space-y-5">
                {/* Author Info */}
                <div className="flex items-start space-x-4 mb-3">
                    <img src={mainComment.avatar} alt={`${mainComment.author}'s avatar`} className="w-12 h-12 rounded-full bg-gray-200 object-cover" />
                    <div className='space-y-1'>
                        <p className="font-semibold text-gray-800">{mainComment.author}</p>
                        <p className="text-xs text-gray-500">{mainComment.date}</p>
                    </div>
                </div>
                {/* Comment Text */}
                <p className="text-gray-700 text-base leading-relaxed">{mainComment.text}</p>
                {/* Actions */}
                <div className="flex items-center justify-between space-x-4 text-gray-500">
                    <div className='flex gap-4'>
                        {/* Like Button - Main Comment */}
                        <button
                            className={`flex items-center space-x-1 border rounded-full border-purple-2 px-2.5 py-1 transition-colors duration-200 ${
                                isMainCommentLiked ? 'text-pink-500 bg-pink-100 border-pink-300' : 'hover:text-pink-500'
                            }`}
                            onClick={() => handleLikeToggle(mainComment.id, 'main')}
                            aria-pressed={isMainCommentLiked}
                            aria-label={isMainCommentLiked ? `Unlike ${mainComment.author}'s comment` : `Like ${mainComment.author}'s comment`}
                        >
                            <img src="/icons/facebooklike.svg" alt="" className={`w-4 h-4 ${isMainCommentLiked ? 'text-pink-600' : 'text-current'}`}/>
                            <p className={`font-bold text-sm ${isMainCommentLiked ? 'text-pink-600' : 'text-black'}`}>{mainComment.likes}</p>
                        </button>
                    </div>
                    <div>
                        <button
                            className='text-purple-2 font-semibold text-sm hover:text-purple-400'
                            onClick={() => handleStartReply(mainComment.id)}
                        >
                            Reply
                        </button>
                    </div>
                </div>

                {replyingToId === mainComment.id && (
                    <div className="pl-0 mt-4">
                        {/* Use the imported component */}
                        <ReplyInputForm
                            onSubmit={handleReplySubmit}
                            onCancel={handleCancelReply}
                        />
                    </div>
                )}
            </div>

            {/* --- Replies Section (Conditionally Rendered) --- */}
            {replies && replies.length > 0 && (
                <div className="pl-0 md:pl-5">
                    <h3 className="text-xl font-semibold mb-6 border-b pb-2">
                        {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
                    </h3>

                    {replies.map((reply) => {
                        // Check if the current reply is liked in this session
                        const isReplyLiked = likedItemIds.has(reply.id);

                        return (
                            <div key={reply.id} className="mb-6 p-5 space-y-4 border-l-2 border-gray-200 pl-4">
                                {/* Reply Author Info & Actions */}
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start space-x-4">
                                        <img src={reply.avatar} alt={`${reply.author}'s avatar`} className="w-10 h-10 rounded-full bg-gray-200 object-cover" />
                                        <div className='space-y-0.5'>
                                            <p className="font-semibold text-gray-800 text-sm">{reply.author}</p>
                                            <p className="text-xs text-gray-500">{reply.date}</p>
                                        </div>
                                    </div>
                                    {/* Actions (Share, More) */}
                                    <div className="flex items-center gap-3 text-gray-500">
                                        <button className="hover:text-gray-700"><img src="/icons/share.svg" alt="Share" className="w-4 h-4"/></button>
                                        <button className="hover:text-gray-700"><img src="/icons/more_vert.svg" alt="More options" className="w-4 h-4"/></button>
                                    </div>
                                </div>
                                {/* Reply Text */}
                                <p className="text-gray-700 text-sm leading-relaxed ml-14">{reply.text}</p>
                                {/* Reply Actions (Like, Comment Count, Reply Button) */}
                                <div className="flex items-center justify-between space-x-4 text-gray-500 ml-14">
                                    <div className='flex gap-4'>
                                        {/* Like Button - Reply */}
                                        <button
                                            className={`flex items-center space-x-1 border rounded-full border-gray-300 px-2.5 py-1 transition-colors duration-200 ${
                                                isReplyLiked ? 'text-pink-500 bg-pink-100 border-pink-300' : 'hover:text-pink-500' // Adjust styling as needed
                                            }`}
                                             onClick={() => handleLikeToggle(reply.id, 'reply')}
                                             aria-pressed={isReplyLiked}
                                             aria-label={isReplyLiked ? `Unlike ${reply.author}'s reply` : `Like ${reply.author}'s reply`}
                                        >
                                            <img src="/icons/facebooklike.svg" alt="Like icon" className={`w-4 h-4 ${isReplyLiked ? 'text-pink-600' : 'text-current'}`}/>
                                            <p className={`font-bold text-xs ${isReplyLiked ? 'text-pink-600' : 'text-black'}`}>{reply.likes}</p>
                                        </button>
                                        {/* Comment Button - Reply */}
                                        <button className="flex items-center space-x-1 hover:text-blue-500 border rounded-full border-gray-300 px-2.5 py-1">
                                            <img src="/icons/comment.svg" alt="Comment icon" className="w-4 h-4"/>
                                            <p className='font-bold text-xs text-black'>{reply.commentCount}</p>
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            className='text-purple-2 font-semibold text-xs hover:text-purple-400'
                                            onClick={() => handleStartReply(reply.id)}
                                        >
                                            Reply
                                        </button>
                                    </div>
                                </div>

                                {replyingToId === reply.id && (
                                    <div className="ml-14 mt-4"> {/* Indent the reply box */}
                                            <ReplyInputForm
                                            onSubmit={handleReplySubmit}
                                            onCancel={handleCancelReply}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            
        </div>
    );
}