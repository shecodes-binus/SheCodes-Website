'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import apiService from '@/lib/apiService';
import ReplyInputForm from '@/components/alumni/reply-input-form';
import type { Comment } from '@/types/comment';
import { Skeleton } from '@/components/ui/skeleton';

export default function CommentDetailPage({ params }: { params: { id: string } }) {
    const mainCommentId = parseInt(params.id, 10);
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    const [mainComment, setMainComment] = useState<Comment | null>(null);
    const [replies, setReplies] = useState<Comment[]>([]);
    const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [replyingToId, setReplyingToId] = useState<number | null>(null);
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);

    const fetchData = useCallback(async () => {
        if (isNaN(mainCommentId)) {
            setError("Invalid comment ID.");
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            const [commentsResponse, likedIdsResponse] = await Promise.all([
                apiService.get<Comment[]>(`/comments/${mainCommentId}`),
                isAuthenticated ? apiService.get<number[]>('/comments/me/likes') : Promise.resolve({ data: [] })
            ]);

            const allComments = commentsResponse.data;
            const foundMainComment = allComments.find(c => c.id === mainCommentId && c.parent_id === null);
            
            if (!foundMainComment) {
                setError("Comment not found.");
                return;
            }
            
            setMainComment(foundMainComment);
            setReplies(allComments.filter(c => c.parent_id === mainCommentId));
            setLikedIds(new Set(likedIdsResponse.data));

        } catch (err) {
            setError("Failed to load discussion data.");
        } finally {
            setIsLoading(false);
        }
    }, [mainCommentId, isAuthenticated]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleToggleLike = async (commentId: number) => {
        if (!isAuthenticated) {
            router.push('/auth/login');
            return;
        }

        const wasLiked = likedIds.has(commentId);
        setLikedIds(prev => { const newSet = new Set(prev); wasLiked ? newSet.delete(commentId) : newSet.add(commentId); return newSet; });
        
        const updateCount = (item: Comment) => ({ ...item, like_count: item.like_count + (wasLiked ? -1 : 1) });
        setMainComment(prev => prev && prev.id === commentId ? updateCount(prev) : prev);
        setReplies(prev => prev.map(r => r.id === commentId ? updateCount(r) : r));

        try {
            await apiService.put(`/comments/${commentId}/like`);
        } catch (error) {
            // Revert on failure
            setLikedIds(prev => { const newSet = new Set(prev); wasLiked ? newSet.add(commentId) : newSet.delete(commentId); return newSet; });
            const revertCount = (item: Comment) => ({ ...item, like_count: item.like_count + (wasLiked ? 1 : -1) });
            setMainComment(prev => prev && prev.id === commentId ? revertCount(prev) : prev);
            setReplies(prev => prev.map(r => r.id === commentId ? revertCount(r) : r));
        }
    };
    
    const handleStartReply = (itemId: number) => {
        if (!isAuthenticated) {
            router.push('/auth/login');
            return;
        }
        setReplyingToId(itemId);
    };

    const handleReplySubmit = async (text: string) => {
        if (!replyingToId || !mainComment) return;
        setIsSubmittingReply(true);
        try {
            const response = await apiService.post<Comment>('/comments/', {
                discussion_id: mainComment.discussion_id,
                parent_id: replyingToId,
                text,
            });
            setReplies(prev => [...prev, response.data]);
            setReplyingToId(null);
        } catch (error) {
            console.error("Failed to submit reply:", error);
        } finally {
            setIsSubmittingReply(false);
        }
    };

    if (isLoading) return <div className="p-8 text-center"><Skeleton className="h-40 w-full" /></div>;
    if (error || !mainComment) return <div className="p-8 text-center text-red-500">{error || "Comment not found."}</div>;

    const isMainCommentLiked = likedIds.has(mainComment.id);

    return (
        <div className="container mx-auto py-12 px-4 md:px-12 lg:px-32">
            <h2 className="text-3xl font-bold text-pink text-center mb-10">Discussion</h2>
            
            <div className="mb-12 p-5 border border-blueSky rounded-lg bg-white space-y-5">
                <div className="flex items-center space-x-4">
                    <img src={mainComment.avatar || '/placeholder-woman.png'} alt={`${mainComment.author}'s avatar`} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                        <p className="font-semibold mb-1">{mainComment.author}</p>
                        <p className="text-xs text-gray-500">{new Date(mainComment.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}</p>
                    </div>
                </div>
                <p className="text-base leading-relaxed">{mainComment.text}</p>
                <div className="flex items-center justify-between">
                    {/* <button onClick={() => handleToggleLike(mainComment.id)} className={`flex items-center gap-1.5 p-1.5 rounded-full transition-colors ${isMainCommentLiked ? 'bg-pink-100' : 'hover:bg-gray-100'}`}>
                        <img src="/icons/facebooklike.svg" alt="Like" className="w-4 h-4"/>
                        <span className={`font-bold text-sm ${isMainCommentLiked ? 'text-pink-600' : 'text-black'}`}>{mainComment.like_count}</span>
                    </button> */}
                    <button onClick={() => handleToggleLike(mainComment.id)} className={`flex items-center space-x-1 border rounded-full px-2.5 py-1 transition-colors duration-200 ${isMainCommentLiked ? 'bg-pink-100 border-pink-300 text-pink-600' : 'border-purple-2 hover:border-pink-300'}`}>
                        <img src="/icons/facebooklike.svg" alt="Like" className="w-4 h-4"/>
                        <p className='font-bold text-sm'>{mainComment.like_count}</p>
                    </button>
                    <button onClick={() => handleStartReply(mainComment.id)} className='text-purple-2 font-semibold text-sm hover:text-purple-400'>
                        Reply
                    </button>
                </div>
                {replyingToId === mainComment.id && (
                    <ReplyInputForm onSubmit={handleReplySubmit} onCancel={() => setReplyingToId(null)} isSubmitting={isSubmittingReply} />
                )}
            </div>

            {replies.length > 0 && (
                <div className="pl-0 md:pl-5">
                    <h3 className="text-xl font-semibold mb-6 border-b pb-2">{replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}</h3>
                    {replies.map(reply => {
                        const isReplyLiked = likedIds.has(reply.id);
                        return (
                            <div key={reply.id} className="mb-6 p-5 space-y-4 border-l-2 border-gray-200 pl-4">
                               <div className="flex items-center space-x-4">
                                    <img src={reply.avatar || '/placeholder-woman.png'} alt={`${reply.author}'s avatar`} className="w-10 h-10 rounded-full object-cover" />
                                    <div>
                                        <p className="font-semibold text-sm mb-1">{reply.author}</p>
                                        <p className="text-xs text-gray-500">{new Date(reply.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}</p>
                                    </div>
                                </div>
                                <p className="text-sm leading-relaxed ml-14">{reply.text}</p>
                                <div className="flex items-center ml-14">
                                    {/* <button onClick={() => handleToggleLike(reply.id)} className={`flex items-center gap-1.5 p-1.5 rounded-full transition-colors ${isReplyLiked ? 'bg-pink-100' : 'hover:bg-gray-100'}`}>
                                        <img src="/icons/facebooklike.svg" alt="Like" className="w-4 h-4"/>
                                        <span className={`font-bold text-xs ${isReplyLiked ? 'text-pink-600' : 'text-black'}`}>{reply.like_count}</span>
                                    </button> */}
                                    <button onClick={() => handleToggleLike(reply.id)} className={`flex items-center space-x-1 border rounded-full px-2.5 py-1 transition-colors duration-200 ${isReplyLiked ? 'bg-pink-100 border-pink-300 text-pink-600' : 'border-purple-2 hover:border-pink-300'}`}>
                                        <img src="/icons/facebooklike.svg" alt="Like" className="w-4 h-4"/>
                                        <p className='font-bold text-sm'>{reply.like_count}</p>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}