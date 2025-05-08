'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MdOutlineEventNote } from "react-icons/md";
import { IoGlassesOutline } from "react-icons/io5"
import { MdOutlineAssignmentInd, MdOutlineSettings, MdLogout } from "react-icons/md";
import { GrArticle } from "react-icons/gr";
import { PiGraduationCapBold } from "react-icons/pi";

const LogoPlaceholder = () => (
    <div className="flex items-center space-x-2 mx-auto mb-5">
        <Link href="/admin/events" className="font-bold text-xl text-purple-800">
            <Image src="/logos/shecodeslogo.svg" alt="SheCodes Logo" width={200} height={200} />
        </Link>
    </div>
);

const Sidebar: React.FC = () => {
    const pathname = usePathname();
    
    const menuItems = [
        { name: 'Events', link: "/admin/events", icon: MdOutlineEventNote },
        { name: 'Mentors', link: "/admin/mentors", icon: IoGlassesOutline },
        { name: 'Members', link: "/admin/members", icon: MdOutlineAssignmentInd },
        { name: 'Articles', link: "/admin/articles", icon: GrArticle },
        { name: 'Alumnis', link: "/admin/alumni", icon: PiGraduationCapBold },
    ];

    const bottomMenuItems = [
        { name: 'Settings', link: "/admin/settings", icon: MdOutlineSettings },
        { name: 'Sign Out', link: "/auth/signout", icon: MdLogout, isSignOut: true }, 
    ];

    const renderMenuItem = (item: any, isBottomItem: boolean = false) => {
        const isActive = item.isSignOut 
            ? false 
            : (pathname === item.link || pathname.startsWith(`${item.link}/`));
        
        const IconComponent = item.icon;

        return (
            <li key={item.name} className="px-6 py-1"> 
                <Link
                    href={item.link}
                    className={`flex items-center space-x-5 px-3.5 py-3 rounded-lg transition-colors duration-200 ${
                        isActive
                            ? 'text-black font-semibold' 
                            : 'text-grey-3 font-semibold' 
                    }`}
                >
                    <IconComponent className={`w-5 h-5 ${isActive ? 'text-black' : 'text-grey-3'}`} />
                    <span>{item.name}</span>
                </Link>
            </li>
        );
    };


    return (
        <div className="w-60 h-screen bg-sidebar shadow-sm flex flex-col py-8 fixed top-0 left-0">
            <LogoPlaceholder />
            <nav className="flex-grow overflow-y-auto">
                <ul>
                    {menuItems.map((item) => renderMenuItem(item))}
                </ul>
            </nav>
            <nav> 
                <ul>
                    {bottomMenuItems.map((item) => renderMenuItem(item, true))}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;

