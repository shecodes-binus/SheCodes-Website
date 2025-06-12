"use client"

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import apiService from '@/lib/apiService';
import type { Comment } from '@/types/comment';
import { Skeleton } from '@/components/ui/skeleton';

export default function AlumniDiscussionPage() {
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();
    
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
    
    const DISCUSSION_ID = "alumni-hub";

    const fetchData = async () => {
        setLoading(true);
        try {
            const [commentsResponse, likedIdsResponse] = await Promise.all([
                apiService.get<Comment[]>(`/comments/${DISCUSSION_ID}`),
                isAuthenticated ? apiService.get<number[]>('/comments/me/likes') : Promise.resolve({ data: [] })
            ]);

            setComments(commentsResponse.data.filter(c => c.parent_id === null));
            setLikedIds(new Set(likedIdsResponse.data));
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [isAuthenticated]);

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !isAuthenticated) return;
        
        setIsSubmitting(true);
        try {
            const response = await apiService.post<Comment>('/comments/', {
                discussion_id: DISCUSSION_ID,
                text: newComment,
            });
            setComments(prev => [response.data, ...prev]);
            setNewComment('');
        } catch (error) {
            console.error("Failed to submit comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleLike = async (commentId: number) => {
        if (!isAuthenticated) {
            router.push('/auth/login');
            return;
        }

        const wasLiked = likedIds.has(commentId);
        
        // Optimistic UI update
        setLikedIds(prev => {
            const newSet = new Set(prev);
            wasLiked ? newSet.delete(commentId) : newSet.add(commentId);
            return newSet;
        });
        setComments(prev => prev.map(c => 
            c.id === commentId ? { ...c, like_count: c.like_count + (wasLiked ? -1 : 1) } : c
        ));

        try {
            await apiService.put(`/comments/${commentId}/like`);
        } catch (error) {
            // Revert on failure
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
        <div className="mx-auto space-y-20 mb-20 min-h-screen">
            <section className="space-y-12 py-12 px-4 md:px-12 lg:px-32"> 
                <div className="flex flex-col items-center justify-center space-y-8 text-center">
                    <h3 className="text-3xl font-bold text-pink text-center">Alumni Discussion</h3>
                
                    {/* --- INPUT FORM SECTION (ALWAYS VISIBLE TO LOGGED-IN USERS) --- */}
                    <div className="w-full max-w-4xl"> {/* Limit width for better readability */}
                        {isAuthenticated ? (
                            <form onSubmit={handleCommentSubmit} className="w-full flex gap-x-5">
                                <input 
                                    value={newComment} 
                                    onChange={(e) => setNewComment(e.target.value)} 
                                    className="flex-grow p-4 border rounded-lg" 
                                    placeholder="Start a new discussion..." 
                                />
                                <button type="submit" className="px-5 py-2 bg-blueSky text-white rounded-lg" disabled={!newComment.trim() || isSubmitting}>
                                    <img src="/icons/send.svg" alt="Send" />
                                </button>
                            </form>
                        ) : (
                            <p className="text-gray-600 bg-gray-100 p-4 rounded-lg w-full">
                                Please <Link href="/auth/login" className="text-blueSky font-semibold hover:underline">log in</Link> to join the discussion.
                            </p>
                        )}
                    </div>
                    {/* --- END INPUT FORM SECTION --- */}
                    
                    {/* --- COMMENTS LIST SECTION --- */}   
                    <div className="w-full space-y-8 text-left">
                        {loading ? (
                            <>
                                <Skeleton className="h-40 w-full rounded-lg" />
                                <Skeleton className="h-40 w-full rounded-lg" />
                            </>
                        ) : comments.length > 0 ? (
                            comments.map((comment) => {
                                const isLiked = likedIds.has(comment.id);
                                return (
                                    <div key={comment.id} className="p-5 border border-blueSky rounded-lg bg-white space-y-5">
                                        <div className="flex items-center space-x-4">
                                            <img src={comment.avatar || '/placeholder-woman.png'} alt={`${comment.author}'s avatar`} className="w-12 h-12 rounded-full object-cover" />
                                            <div>
                                                <p className="font-semibold mb-1">{comment.author}</p>
                                                <p className="text-xs text-gray-500">{new Date(comment.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-700">{comment.text}</p>
                                        <div className="flex items-center justify-between">
                                            <div className='flex gap-4'>
                                                <button onClick={() => handleToggleLike(comment.id)} className={`flex items-center space-x-1 border rounded-full px-2.5 py-1 ${isLiked ? 'bg-pink-100 border-pink-300 text-pink-600' : 'border-purple-2 hover:border-pink-300'}`}>
                                                    <img src="/icons/facebooklike.svg" alt="Like"/>
                                                    <p className='font-bold text-sm'>{comment.like_count}</p>
                                                </button>
                                                <Link href={`/app/comment/${comment.id}`} className="flex items-center space-x-1 border rounded-full border-purple-2 px-2.5 py-1">
                                                    <img src="/icons/comment.svg" alt="Comment"/>
                                                    <p className='font-bold text-sm'>Reply</p>
                                                </Link>
                                            </div>
                                            <Link href={`/app/comment/${comment.id}`} className='text-purple-2 font-semibold text-sm'>
                                                View & Reply
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            // Show a message if there are no comments
                            <div className="text-center text-gray-500 py-10 text-xl">
                                <p>No comments yet. Be the first to start the discussion!</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}