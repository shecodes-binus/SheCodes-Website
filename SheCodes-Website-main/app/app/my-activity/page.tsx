'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card'; // Keep if Card is used elsewhere
import {
  LayoutGrid,
  ListChecks,
  Briefcase,
  Settings,
  ArrowRight, // Icon for continue button
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { allEventsData } from '@/data/dummyEvent'; // Adjust path
import type { CombinedEventData } from '@/types/events'; // Adjust path
import { getEventStatus, formatEventDateTime } from '@/lib/eventUtils'; // Adjust path
import { useAuth } from '@/contexts/AuthContext';

// --- Sidebar Component (Reuse or adapt) ---
const SidebarNav = () => {
    const activePath = '/app/settings'; // Set active path for this page
    const { logout } = useAuth();

    const navItems = [
        { href: '/app/dashboard', label: 'Dashboard', icon: LayoutGrid },
        { href: '/app/my-activity', label: 'My Activities', icon: ListChecks },
        { href: '/app/portfolio', label: 'Portfolio', icon: Briefcase },
        { href: '/app/settings', label: 'Settings', icon: Settings }, // Use aliased icon
    ];

    const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        logout(); // Call the logout function from context
    };

    return (
        <nav className="flex flex-col space-y-1"> {/* Reduced space */}
            {navItems.map((item) => {
                const isActive = item.href === activePath;
                const Icon = item.icon;
                return (
                    <Link
                        key={item.label}
                        href={item.href}
                         // Use light blue bg for active, gray text otherwise
                        className={cn(
                            "flex items-center gap-4 rounded-lg text-gray-500 transition-colors hover:bg-blue-100/50 hover:text-gray-900 px-6 py-3", // Adjusted padding/rounding
                            isActive && "bg-blue-200/60 text-gray-900 font-semibold hover:bg-blue-200/60 hover:text-gray-900"
                        )}
                    >
                        <Icon className="h-5 w-5" />
                        <span className='font-semibold text-lg'>{item.label}</span> {/* Adjusted size/weight */}
                    </Link>
                );
            })}
            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className={cn(
                    "flex items-center gap-4 rounded-lg text-red-500 transition-colors hover:bg-red-100/50 hover:text-red-700 px-6 py-3 w-full text-left"
                )}
            >
                <LogOut className="h-5 w-5" />
                <span className='font-semibold text-lg'>Log Out</span>
            </button>
        </nav>
    );
};

// --- Main Page Component ---
export default function MyActivitiesPage() {

  // Filter events if necessary (e.g., only show 'enrolled' events)
  // For now, we display all from dummy data
  const myEvents = allEventsData;

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden lg:block w-72 bg-white border-r border-gray-200 p-4 rounded-lg shadow-sm m-4 mt-16 self-start"> {/* Rounded, margin */}
         <div className="sticky top-4"> 
            <SidebarNav />
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 lg:py-16 lg:px-10">
        <div className='bg-white rounded-lg space-y-8 p-10 rounded-xl shadow-md'>
          <h1 className="text-3xl font-bold text-gray-800 mb-8">My Activities</h1>
          <div className="grid grid-cols-1 gap-10">
            {myEvents.map((event) => {
              const { status, currentLessonTopic } = getEventStatus(event);

              // Don't display 'upcoming' events in this specific design? Or handle differently.
              // if (status === 'upcoming') return null; // Option to hide upcoming

              return (
                <Card key={event.id} className="overflow-hidden rounded-none h-full">
                  <CardContent className="p-0 flex flex-col md:flex-row items-stretch h-full"> {/* No padding, flex layout */}

                    {/* Date Block */}
                    <div className="w-56 flex flex-col justify-center flex-shrink-0 bg-purple-3 p-4 text-black relative overflow-hidden">
                      {/* Optional decorative pattern - tricky with pure tailwind */}
                      {/* <div className="absolute top-2 right-2 opacity-20">...</div> */}
                      <div className='absolute -top-4 -right-6 z-0'> 
                        <Image
                            src="/cardelement.png"
                            alt={"Card Element"}
                            width={96}
                            height={96}
                            className="object-contain"
                          />
                      </div>
                      
                      <div className="relative z-10 space-y-4 md:space-y-5">
                        <p className="text-sm font-semibold text-black">Start:</p>
                        <div className='space-y-2'>
                          <p className="text-sm font-semibold text-black">
                              {formatEventDateTime(event.startDate, event.endDate).dateRange}
                          </p>
                          <p className="text-sm font-semibold text-black">{formatEventDateTime(event.startDate, event.endDate).timeRange}</p>
                        </div>
                      </div>
                    </div>

                    {/* Event Info Block */}
                    <div className="flex-grow px-4 md:px-5 space-y-1.5 flex flex-col justify-center min-h-[120px]">
                        <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 flex-grow">{event.description}</p>
                        {event.tags && event.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {event.tags.map((tag) => (
                              <span key={tag} className="px-3 py-1 bg-grey-2/50 text-grey-3 font-semibold text-xs rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                    </div>

                    {/* Status/Action Block */}
                    <div className="w-full md:w-40 lg:w-48 flex-shrink-0 flex flex-col items-end justify-between text-right px-4 md:px-5 py-1 space-y-1.5 md:border-l border-gray-200/60">
                      <p className="text-sm font-semibold text-black">
                          {status === 'Finished' ? 'Finished' : (status || 'Upcoming')}
                      </p>
                      {status === 'Finished' ? (
                          <button className="bg-purple-2 text-white hover:bg-certificate-button-bg/90 text-xs px-6 py-1 rounded-sm">
                              Certificate 
                          </button>
                      ) : ( // Assuming 'ongoing' or 'upcoming' shows lesson/continue
                          

                          <Link href={`/app/event-details/${event.id}`} passHref legacyBehavior={false} className="w-full">
                            <Button size="icon" variant="ghost" className="bg-blueSky text-white rounded-sm h-7 w-8 hover:bg-blueSky/80 hover:text-white">
                                <ArrowRight className="h-6 w-6" />
                            </Button>
                          </Link>

                          // <Link href={`/courses/${event.id}/continue`} passHref className='mt-auto'> {/* mt-auto pushes to bottom */}
                          // <Button size="icon" variant="ghost" className="bg-blue-400 text-white rounded-md h-8 w-8 hover:bg-blue-500">
                          //     <ArrowRight className="h-4 w-4" />
                          // </Button>
                          // </Link>
                      )}
                    </div>

                  </CardContent>
                </Card>
              );
            })}

            {myEvents.length === 0 && (
              <p className="text-center text-gray-500 mt-10">You are not currently enrolled in any courses or activities.</p>
            )}
          </div>
        </div>
        
      </main>
    </div>
  );
}