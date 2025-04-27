'use client'; // If using state for input

import React, { useState } from 'react';
import { FaHeart, FaCommentDots } from 'react-icons/fa'; // Example icons
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Dummy comment data (replace with actual data fetching later)
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


const DiscussionSection: React.FC = () => {
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
          const newLikes = isCurrentlyLiked ? comment.likes - 1 : comment.likes + 1;
          return { ...comment, likes: Math.max(0, newLikes) };
        }
        return comment;
      })
    );

    setLikedCommentIds(prevSet => {
      const newSet = new Set(prevSet);
      if (isCurrentlyLiked) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });

    console.log(isCurrentlyLiked ? `Unliked comment ID: ${commentId}` : `Liked comment ID: ${commentId}`);
  };

  return (
    <section className="pb-32 px-20 lg:px-32 md:px-20">
      <div className="mx-auto space-y-16"> {/* Limit width */}
        <h3 className="text-xl font-bold sm:text-3xl xl:text-4xl/none text-pink text-center">
            Discussion
        </h3>
        

        {/* Displayed Comments */}
        <div className="space-y-8">
          {comments.slice(0, 2).map((comment) => {
            // Determine if the current comment is liked
            const isLiked = likedCommentIds.has(comment.id);

            return (
                <div key={comment.id} className="p-5 border border-blue-200 rounded-lg bg-white shadow-sm space-y-5">
                  {/* Author Info */}
                  <div className="flex items-start space-x-4 mb-3">
                    <img src={comment.avatar} alt={`${comment.author}'s avatar`} className="w-12 h-12 rounded-full bg-gray-200 object-cover" />
                    <div className='space-y-1'>
                      <p className="font-semibold text-gray-800">{comment.author}</p>
                      <p className="text-xs text-gray-500">{comment.date}</p>
                    </div>
                  </div>
                  {/* Comment Text */}
                  <p className="text-gray-700 mb-4 text-base leading-relaxed">{comment.text}</p>
                  {/* Actions */}
                  <div className="flex items-center justify-between space-x-4 text-gray-500">
                    <div className='flex gap-4'>
                      {/* Like Button with conditional styling */}
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
                          {/* Icon: Ensure path is correct. Color changes via parent text color */}
                          <img src="/icons/facebooklike.svg" alt="" className="w-4 h-4" />
                          {/* Text: Conditional color applied */}
                          <p className={`font-bold text-sm ${isLiked ? 'text-pink-700' : 'text-black'}`}>
                              {comment.likes}
                          </p>
                      </button>

                      {/* Comment Count Link */}
                      <Link href={`/app/comment/${comment.id}`} className="flex items-center space-x-1 hover:text-blue-500 border rounded-full border-purple-2 px-2.5 py-1">
                          <img src="/icons/comment.svg" alt="" className="w-4 h-4"/>
                          <p className='font-bold text-sm text-black'>{comment.replyCount}</p>
                      </Link>
                    </div>
                    {/* Reply Link */}
                    <div>
                      <Link
                          href={`/app/comment/${comment.id}`}
                          className='text-purple-2 font-semibold text-sm hover:text-purple-400'
                      >
                          Reply
                      </Link>
                    </div>
                  </div>
                </div>
            );
          })}

          {comments.length === 0 ? (
            <p className="text-center text-gray-500">
              No comments yet. Be the first to share your thoughts!
            </p>
          ) : (
            <>
              {comments.length > 2 && (
                <div className="text-center pt-4">
                  <Link href="/app/alumni-discussion">
                    <Button className="bg-blueSky text-white rounded-full px-12 py-6 font-bold text-lg shadow-lg hover:bg-blueSky/90 transition-all duration-300">
                      View More
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </section>
  );
};

export default DiscussionSection;