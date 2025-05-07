import React from 'react';
import { SearchIcon, BellIcon } from './icon';
import Image from 'next/image';
import { TbLogout2 } from "react-icons/tb";


const Header: React.FC = () => {
    return (
        <header className="bg-contentBg pt-4 pb-1 px-10 flex items-center justify-between top-0 z-10 shadow-subtle">
            {/* Search Bar */}
            <div className="relative w-full max-w-md lg:max-w-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-3.5 w-3.5 text-grey-3" />
                </div>
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-10 pr-4 py-4 rounded-lg focus:ring-primary focus:border-primary bg-white shadow-sm text-sm"
                />
            </div>

            {/* Right side icons & profile */}
            <div className="flex items-center space-x-8">
                <button className="bg-white relative p-3 text-black hover:text-white hover:bg-[#FF334B] rounded-full transition duration-200 ease-in-out">
                    <TbLogout2 className="h-6 w-6" />
                </button>

                <div className="flex items-center space-x-5 bg-white pl-10 pr-6 py-3 rounded-lg shadow-sm cursor-pointer">
                     {/* Replace with actual image */}
                    
                    <div className='space-y-0.5'>
                        <div className="font-semibold text-sm text-black">SheCodes Society</div>
                        <div className="text-sm text-black">Admin</div>
                    </div>
                    <Image
                        className="h-12 w-12 rounded-full object-cover"
                        src="/logonotext-v2.svg" // Placeholder Image
                        width={64}
                        height={64}
                        alt="Admin Avatar"
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;