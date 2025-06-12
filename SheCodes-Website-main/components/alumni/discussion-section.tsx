'use client'; // If using state for input

import React, { useEffect, useState } from 'react';
import { FaHeart, FaCommentDots } from 'react-icons/fa'; // Example icons
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Comment } from '@/types/comment';
import apiService from '@/lib/apiService';
import { Skeleton } from '../ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// // Dummy comment data (replace with actual data fetching later)
// const initialDummyComments = [
//   {
//     id: 1,
//     author: "Wina",
//     date: "April 10, 2025",
//     text: "Witnessing all of these women excel—boldly leading, producing, and overcoming barriers—inspired me. Their resilience reminded me that my value is not set by the limitations that society seeks to impose upon me, or the negative doubts of lesser voices.",
//     avatar: "/alumnis/wina.jpeg",
//     likes: 15, // Added likes count
//     replyCount: 2 // Added reply count
//   },
//   {
//     id: 2,
//     author: "Andita", 
//     date: "April 8, 2025",
//     text: "As a woman, I have the power to become something magnificent, to overcome expectations, and to build a world where courage, not confinement, characterizes us. Their paths became the mirror that reflected all that I am able to become.",
//     avatar: "/alumnis/andita.jpeg",
//     likes: 8, // Added likes count
//     replyCount: 0 // Added reply count
//   },
//   {
//     id: 3,
//     author: "Dewi", 
//     date: "April 5, 2025",
//     text: "These women are the epitome of strength in showing up. They stay soft in a world that literally hardens, but they keep growing nonetheless. Their resilience, their nature, their character reminded me that I, too, am becoming.",
//     avatar: "/alumnis/dewi.jpeg",
//     likes: 22, // Added likes count
//     replyCount: 1 // Added reply count
//   },
// ];

const DiscussionSection: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyCounts, setReplyCounts] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);

  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());

  const DISCUSSION_ID = "alumni-hub";

  useEffect(() => {
      const fetchComments = async () => {
          setLoading(true);
          try {
              const [commentsResponse, likedIdsResponse] = await Promise.all([
                  apiService.get<Comment[]>(`/comments/${DISCUSSION_ID}`),
                  isAuthenticated ? apiService.get<number[]>('/comments/me/likes') : Promise.resolve({ data: [] })
              ]);
              
              // Get top-level comments for display
              const allComments = commentsResponse.data;
              const topLevelComments = allComments.filter(c => c.parent_id === null);
              setComments(topLevelComments);
              setLikedIds(new Set(likedIdsResponse.data));

              // Calculate reply counts for each top-level comment
              const counts: Record<number, number> = {};
              topLevelComments.forEach(mainComment => {
                  counts[mainComment.id] = allComments.filter(reply => reply.parent_id === mainComment.id).length;
              });
              setReplyCounts(counts);

          } catch (error) {
              console.error("Failed to fetch discussion comments:", error);
          } finally {
              setLoading(false);
          }
      };
      fetchComments();
    }, [isAuthenticated]);

    const handleToggleLike = async (commentId: number) => {
    // 1. Authorization check
    if (!isAuthenticated) {
        router.push('/auth/login');
        return;
    }

    const wasLiked = likedIds.has(commentId);
    
    // 2. Optimistic UI update for instant feedback
    setLikedIds(prev => {
        const newSet = new Set(prev);
        wasLiked ? newSet.delete(commentId) : newSet.add(commentId);
        return newSet;
    });
    setComments(prev => prev.map(c => 
        c.id === commentId ? { ...c, like_count: c.like_count + (wasLiked ? -1 : 1) } : c
    ));

    // 3. API call
    try {
        await apiService.put(`/comments/${commentId}/like`);
    } catch (error) {
        // 4. Revert UI on failure
        console.error("Failed to toggle like:", error);
        setLikedIds(prev => {
            const newSet = new Set(prev);
            wasLiked ? newSet.add(commentId) : newSet.delete(commentId);
            return newSet;
        });
        setComments(prev => prev.map(c => 
            c.id === commentId ? { ...c, like_count: c.like_count + (wasLiked ? 1 : -1) } : c
        ));
    }
  };

  return (
    <section className="pb-32 px-20 lg:px-32 md:px-20">
      <div className="mx-auto space-y-16"> {/* Limit width */}
        <h3 className="text-xl font-bold sm:text-3xl xl:text-4xl/none text-pink text-center">
            Discussion
        </h3>
        
        <div className="space-y-8">
          {loading ? (
              <>
                  <Skeleton className="h-40 w-full rounded-lg" />
                  <Skeleton className="h-40 w-full rounded-lg" />
              </>
          ) : comments.length > 0 ? (
            comments.slice(0, 2).map((comment) => {
              const isLiked = likedIds.has(comment.id);
              return (
                <div key={comment.id} className="p-5 border border-blue-200 rounded-lg bg-white shadow-sm space-y-5">
                    <div className="flex items-center space-x-4 mb-3">
                        <img src={comment.avatar || '/placeholder-woman.png'} alt={`${comment.author}'s avatar`} className="w-12 h-12 rounded-full bg-gray-200 object-cover" />
                        <div>
                            <p className="font-semibold text-gray-800 mb-1">{comment.author}</p>
                            <p className="text-xs text-gray-500">{new Date(comment.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                              })}</p>
                        </div>
                    </div>
                    <p className="text-gray-700 text-base leading-relaxed line-clamp-3">{comment.text}</p>
                    <div className="flex items-center justify-between">
                        <div className='flex gap-4'>
                            <button onClick={() => handleToggleLike(comment.id)} className={`flex items-center space-x-1 border rounded-full px-2.5 py-1 transition-colors ${isLiked ? 'bg-pink-100 border-pink-300 text-pink-600' : 'border-purple-2 hover:border-pink-300'}`}>
                                <img src="/icons/facebooklike.svg" alt="Likes" className="w-4 h-4" />
                                <p className={`font-bold text-sm ${isLiked ? 'text-pink-600' : 'text-black'}`}>{comment.like_count}</p>
                            </button>
                            <Link href={`/app/comment/${comment.id}`} className="flex items-center space-x-1 border rounded-full border-purple-2 px-2.5 py-1">
                                <img src="/icons/comment.svg" alt="Replies" className="w-4 h-4"/>
                                <p className='font-bold text-sm text-black'>{replyCounts[comment.id] || 0}</p>
                            </Link>
                        </div>
                        <Link href={`/app/comment/${comment.id}`} className='text-purple-2 font-semibold text-sm hover:text-purple-400'>
                            Reply
                        </Link>
                    </div>
                </div>
              )
            })
          ) : (
            <div className="text-center mb-10 text-gray-500 text-xl">
                <p className="">
                    No discussions yet.
                <Link href="/app/alumni-discussion" className="ml-2 text-blueSky font-semibold hover:underline">
                    Start the discussion!
                </Link>
                </p>
            </div>
          )}
        </div>

        {comments.length > 2 && (
            <div className="text-center pt-4">
                <Link href="/app/alumni-discussion">
                    <Button className="bg-blueSky text-white rounded-full px-12 py-6 font-bold text-lg shadow-lg hover:bg-blueSky/90">
                        View More
                    </Button>
                </Link>
            </div>
        )}
      </div>
    </section>
  );
};

export default DiscussionSection;