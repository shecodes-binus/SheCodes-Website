'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';

const AuthButton: React.FC = () => {
    const { isAuthenticated, user, loading } = useAuth();

    // During the initial loading state, show a placeholder to prevent layout shift
    if (loading) {
        return <div className="h-10 w-24 rounded-full bg-gray-200 animate-pulse"></div>;
    }

    // If the user is authenticated, show their profile picture
    if (isAuthenticated && user) {
        // Use the user's profile picture or the placeholder if it's null/empty
        const profileImageSrc = user.profile_picture || '/logonotext-v2.svg';
        // console.log(user);

        return (
            <Link href="/app/dashboard" aria-label="Go to your dashboard">
                <Image
                    className="h-12 w-12 rounded-full object-cover cursor-pointer ring-2 ring-transparent hover:ring-pink transition-all"
                    src={profileImageSrc}
                    width={48} // Corresponds to h-12/w-12 (3rem = 48px)
                    height={48}
                    alt={user.name ? `${user.name}'s profile picture` : 'User profile'}
                    priority // Prioritize loading the avatar of the logged-in user
                />
            </Link>
        );
    }

    // If the user is not authenticated, show the Log In button
    return (
        <Link href="/auth/login">
            <Button className="bg-transparent hover:bg-purple-2 rounded-xl px-8 text-blueSky border-blueSky border-2 hover:bg-blueSky hover:text-white">Login</Button>
        </Link>
    );
};

export default AuthButton;