import React from 'react';
import { SearchIcon, BellIcon } from './icon';
import Image from 'next/image';
import { TbLogout2 } from "react-icons/tb";
import { dummyAdmin } from '@/data/dummyAdmin';
import Link from 'next/link';


const Header: React.FC = () => {
    const admin = dummyAdmin.slice(0, 1)[0]; 

    return (
        <header className="bg-contentBg pt-4 px-10 flex items-center justify-end top-0 z-10 shadow-subtle">
            {/* Right side icons & profile */}
            <div className="flex items-center space-x-8">
                <Link href="/admin/settings" legacyBehavior>
                    <a className="flex items-center space-x-5 bg-white pl-10 pr-6 py-3 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition duration-200 ease-in-out">
                        {/* Replace with actual image */}
                        
                        <div className='space-y-0.5'>
                            <div className="font-semibold text-sm text-black">{admin.name}</div>
                            <div className="text-sm text-black">Admin</div>
                        </div>
                        <Image
                            className="h-12 w-12 rounded-full object-cover"
                            src={admin.imageSrc} // Placeholder Image
                            width={64}
                            height={64}
                            alt="Admin Avatar"
                        />
                    </a>
                </Link>
            </div>
        </header>
    );
};

export default Header;