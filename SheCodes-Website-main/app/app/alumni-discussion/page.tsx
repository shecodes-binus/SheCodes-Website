'use client'; // If using state for input

import React, { useState } from 'react';
import Link from "next/link"
import { Button } from "@/components/ui/button"

const initialDummyComments = [
    {
      id: 1,
      author: "Wina",
      date: "April 10, 2025",
      text: "Witnessing all of these women excel—boldly leading, producing, and overcoming barriers—inspired me. Their resilience reminded me that my value is not set by the limitations that society seeks to impose upon me, or the negative doubts of lesser voices.",
      avatar: "/alumnis/wina.jpeg",
      likes: 15, // Added likes count
      replyCount: 2 // Added reply count
    },
    {
      id: 2,
      author: "Andita", 
      date: "April 8, 2025",
      text: "As a woman, I have the power to become something magnificent, to overcome expectations, and to build a world where courage, not confinement, characterizes us. Their paths became the mirror that reflected all that I am able to become.",
      avatar: "/alumnis/andita.jpeg",
      likes: 8, // Added likes count
      replyCount: 0 // Added reply count
    },
    {
      id: 3,
      author: "Dewi", 
      date: "April 5, 2025",
      text: "These women are the epitome of strength in showing up. They stay soft in a world that literally hardens, but they keep growing nonetheless. Their resilience, their nature, their character reminded me that I, too, am becoming.",
      avatar: "/alumnis/dewi.jpeg",
      likes: 22, // Added likes count
      replyCount: 1 // Added reply count
    },
];

interface Comment {
    id: number;
    author: string;
    date: string;
    text: string;
    avatar: string;
    likes: number;
    replyCount: number;
  }
  
export default function AlumniDiscussion() {
    const [comments, setComments] = useState<Comment[]>(initialDummyComments);
    const [newComment, setNewComment] = useState('');
    const [likedCommentIds, setLikedCommentIds] = useState<Set<number>>(new Set());

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return; // Don't submit empty comments
        console.log("Submitting comment:", newComment);
        // TODO: Add logic to actually submit the comment (API call, update state)
        // Example: Add new comment to the list
        // const newCommentObj = { id: Date.now(), author: "CurrentUser", date: new Date().toLocaleDateString(), text: newComment, avatar: "/path/to/default/avatar.png", likes: 0, replyCount: 0 };
        // setComments(prevComments => [newCommentObj, ...prevComments]); // Add to the beginning
        setNewComment('');
    };

    const handleLikeToggle = (commentId: number) => {
        const isCurrentlyLiked = likedCommentIds.has(commentId);

        setComments(prevComments =>
            prevComments.map(comment => {
            if (comment.id === commentId) {
                // If liked, decrement; otherwise, increment
                const newLikes = isCurrentlyLiked ? comment.likes - 1 : comment.likes + 1;
                // Ensure likes don't go below zero if unliking an already 0-liked comment (edge case)
                return { ...comment, likes: Math.max(0, newLikes) };
            }
            return comment;
            })
        );
    
        // Update the set of liked IDs
        setLikedCommentIds(prevSet => {
            const newSet = new Set(prevSet); // Create a mutable copy
            if (isCurrentlyLiked) {
            newSet.delete(commentId); // Remove ID if unliking
            } else {
            newSet.add(commentId);    // Add ID if liking
            }
            return newSet; // Return the updated set
        });

    // Optional log
        console.log(isCurrentlyLiked ? `Unliked comment ID: ${commentId}` : `Liked comment ID: ${commentId}`);
    };
    

    return(
        <div className="mx-auto space-y-20 mb-20 min-h-screen">
            {/* Comment Input */}
            <section className="space-y-12 md:space-y-16 py-12 md:py-16 px-12 sm:px-8 md:px-12 lg:px-32"> 
                <div className="flex flex-col items-center justify-center space-y-8 text-center mb-8 md:mb-12">
                    <h3 className="text-3xl font-bold sm:text-3xl xl:text-4xl/none text-pink text-center mb-4">
                        Discussion
                    </h3>
                

                    <form onSubmit={handleCommentSubmit} className=" w-full flex gap-x-5">
                        <input
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="flex-grow p-4 border border-grey-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none placeholder:text-grey-2"
                            // rows={4}
                            placeholder="Add a comment..."
                            aria-label="Add a comment"
                        />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-5 py-2 bg-blueSky text-white rounded-lg hover:bg-blueSky/90 "
                                disabled={!newComment.trim()}
                                >
                                <img src="/icons/send.svg" alt="" />
                            </button>
                        </div>
                    </form>

                    {/* Displayed Comments */}
                    <div className="space-y-8 text-left">
                        {comments.map((comment) => {
                            // Determine if the current comment is liked
                            const isLiked = likedCommentIds.has(comment.id);

                            return (
                                <div key={comment.id} className="p-5 border border-blueSky rounded-lg bg-white shadow-sm space-y-5">
                                    <div className="flex items-start space-x-4 mb-3">
                                        <img src={comment.avatar} alt={`${comment.author}'s avatar`} className="w-12 h-12 rounded-full bg-gray-200 object-cover" /> {/* Placeholder styling */}
                                        <div className='space-y-1'>
                                        <p className="font-semibold text-gray-800">{comment.author}</p>
                                        <p className="text-xs text-gray-500">{comment.date}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 mb-4 text-base leading-relaxed">{comment.text}</p>
                                    <div className="flex items-center justify-between space-x-4 text-gray-500">
                                        <div className='flex gap-4'>
                                        {/* Placeholder actions */}
                                        <button
                                            className={`flex items-center space-x-1 border rounded-full px-2.5 py-1 transition-colors duration-200 ease-in-out ${
                                                isLiked
                                                ? 'bg-pink-100 border-pink-300 text-pink-600' // Liked state styles
                                                : 'border-purple-2 text-gray-500 hover:text-pink-500 hover:border-pink-300' // Default state styles
                                            }`}
                                            onClick={() => handleLikeToggle(comment.id)} // Use the toggle handler
                                            aria-pressed={isLiked} // Accessibility state
                                            aria-label={isLiked ? `Unlike ${comment.author}'s comment` : `Like ${comment.author}'s comment`} // Dynamic label
                                        >
                                            <img src="/icons/facebooklike.svg"/>
                                            <p className='font-bold text-sm text-black'>{comment.likes}</p>
                                            {/* <span>{comment.likes || 0}</span> */}
                                        </button>
                                        <Link href={`/app/comment/${comment.id}`} className="flex items-center space-x-1 hover:text-blue-500 border rounded-full border-purple-2 px-2.5 py-1">
                                            <img src="/icons/comment.svg"/>
                                            <p className='font-bold text-sm text-black'>{comment.replyCount}</p>
                                            {/* <span>Reply</span> */}
                                        </Link>
                                        </div>
                                        <div>
                                            <Link
                                                href={`/app/comment/${comment.id}`} // Construct the dynamic URL
                                                className='text-purple-2 font-semibold text-sm hover:text-purple-400' // Apply original styles + hover effect
                                            >
                                                Reply
                                            </Link>
                                        </div>
                                    </div>
                                {/* Add nested comments/reply functionality here if needed */}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    )
}
