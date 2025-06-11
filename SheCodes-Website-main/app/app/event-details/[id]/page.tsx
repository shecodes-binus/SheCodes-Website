import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, CheckCircle2, ArrowUp } from "lucide-react";
import {
  LayoutGrid,
  ListChecks,
  Briefcase,
  Settings as SettingsIcon, // Alias Settings icon
  UploadCloud, // Icon for upload area
  Check,
  User, // Fallback icon
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { allEventsData } from '@/data/dummyEvent';
import { ScrollUpButton } from "@/components/scroll-up-button";
import type { CombinedEventData } from '@/types/events';
import { normalizeDate, formatEventGroupDate, calculateDuration, formatEventDateTime, formatStartDate } from '@/lib/eventUtils';
import { useAuth } from "@/contexts/AuthContext";

// --- Sidebar Component (Reuse or adapt) ---
const SidebarNav = () => {
    const activePath = '/app/settings'; // Set active path for this page
    const { logout } = useAuth();

    const navItems = [
        { href: '/app/dashboard', label: 'Dashboard', icon: LayoutGrid },
        { href: '/app/my-activity', label: 'My Activities', icon: ListChecks },
        { href: '/app/portfolio', label: 'Portfolio', icon: Briefcase },
        { href: '/app/settings', label: 'Settings', icon: SettingsIcon }, // Use aliased icon
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

function getEventDataById(id: string): CombinedEventData | undefined {
    // Convert id from string to number for comparison
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
        return undefined; // Handle cases where id is not a valid number
    }
    return allEventsData.find(event => event.id === numericId);
}

export default function EventDetailPage( { params }: { params: { id: string } }) {
    const eventData = getEventDataById(params.id);
    const now = new Date();

    if (!eventData) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold text-red-600">Event Not Found</h1>
                <p className="text-gray-600 mt-4">
                    Sorry, we couldn't find the event you were looking for.
                </p>
                <Link href="/events" className="mt-6 inline-block">
                    <Button variant="outline">Back to Events</Button>
                </Link>
            </div>
        );
    }

  return (
    <div className="flex min-h-screen w-full bg-gray-50"> {/* Root Flex Container */}
      {/* Sidebar */}
      <aside className="hidden lg:block w-72 bg-white border-r border-gray-200 p-4 rounded-lg shadow-sm m-4 mt-16 self-start flex-shrink-0"> {/* Fixed width, prevent shrinking */}
         <div className="sticky top-4"> 
            <SidebarNav />
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 lg:py-16 lg:px-10 overflow-y-auto">
         <div className="flex flex-col space-y-16 md:space-y-20 bg-white rounded-lg px-10 pt-10 pb-20 shadow-md">
            <section className="flex flex-col gap-10 lg:gap-16">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-5xl lg:text-6xl font-bold text-blueSky tracking-normal">
                    {eventData.title}
                </h1>
                <div className="flex flex-wrap gap-2">
                    {eventData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-gray-200 text-grey-3 hover:bg-gray-300 px-4 py-1 text-sm"> {/* Adjusted styling slightly */}
                        {tag}
                    </Badge>
                    ))}
                </div>
                <p className="text-base text-gray-700 leading-relaxed max-w-3xl">
                    {eventData.description}
                </p>

                {/* --- Info Box (New Structure) --- */}
                <div className="rounded-xl p-6 md:p-8 border border-gray-200 shadow-md mt-8">
                  <div className="flex flex-col md:flex-row justify-around items-center text-center gap-8 md:gap-4"> 
                    {/* Date Column */}
                    <div className="flex flex-col items-center gap-2 md:flex-1">
                        <Calendar className="h-7 w-7 text-blueSky mb-1" /> 
                        <span className="text-sm font-semibold text-blueSky">Date</span>
                        <span className="text-sm text-gray-800">{formatEventDateTime(eventData.startDate, eventData.endDate).dateRange}</span>
                    </div>

                    {/* Time Column */}
                    <div className="flex flex-col items-center gap-2 md:flex-1">
                        <Clock className="h-7 w-7 text-blueSky mb-1" /> 
                        <span className="text-sm font-semibold text-blueSky">Time</span>
                        <span className="text-sm text-gray-800">{formatEventDateTime(eventData.startDate, eventData.endDate).timeRange}</span>
                    </div>

                    {/* Location Column */}
                    <div className="flex flex-col items-center gap-2 md:flex-1">
                        <MapPin className="h-7 w-7 text-blueSky mb-1" /> 
                        <span className="text-sm font-semibold text-blueSky">Location</span>
                        <span className="text-sm text-gray-800 whitespace-pre-line">{eventData.location}</span>
                    </div>

                  </div>
                </div>
              </div>
            </section>

            {/* --- Group Whatsapp Section --- */}
            <section className="text-center space-y-12">
                <h2 className="text-4xl font-bold text-pink text-left">Class Group</h2>
                {/* This already uses flex correctly */}
                <div className="flex justify-start items-start gap-8 md:gap-16 flex-wrap">
                    <div className="flex flex-col items-center gap-2">
                        <a href={eventData.groupLink} target="_blank" rel="noopener noreferrer" className="text-black text-lg font-medium underline">
                            Link to Whatsapp Group
                        </a>
                    </div>                
                </div>
            </section>

            {/* --- Tools Section --- */}
            <section className="text-center space-y-12">
                <h2 className="text-4xl font-bold text-pink text-left">Tools</h2>
                {/* This already uses flex correctly */}
                <div className="flex justify-start items-start gap-8 md:gap-16 flex-wrap">
                {eventData.tools.map((tool) => (
                    <div key={tool.name} className="flex flex-col items-center gap-2">
                    <Image
                        src={tool.logoSrc} // Make sure logos exist in /public/logos
                        alt={`${tool.name} logo`}
                        width={220} // Adjust size as needed
                        height={220}
                        className="object-contain"
                    />
                    {/* <span className="text-sm text-gray-600">{tool.name}</span> */}
                    </div>
                ))}
                </div>
            </section>

            {/* --- About Mentors Section --- */}
            <section className="bg-gradient-to-b from-blueSky to-purple-2 py-10 md:py-12 px-6 md:px-10 rounded-xl">
                <h2 className="text-3xl font-bold text-left mb-8 text-white text-left">About Mentors</h2>
                {/* Inner layout already uses flex correctly */}
                <div className="space-y-6 mx-auto">
                    {eventData.mentors.map((mentor) => (
                        <div key={mentor.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col sm:flex-row items-start sm:items-start gap-6 border border-purple-2/30">
                            <Image
                                src="/photo.png" // Assuming this is the correct path
                                alt={mentor.name} // More specific alt text
                                width={100}
                                height={100}
                                className="rounded-lg object-cover flex-shrink-0" // Prevent image shrinking
                                priority={false} // Only hero image should be priority usually
                            />
                            <div className="space-y-2 flex-grow"> {/* Allow text content to grow */}
                                <h3 className="text-xl font-semibold text-gray-900">{mentor.name}</h3>
                                <p className="text-sm font-medium text-pink">{mentor.occupation}</p>
                                <p className="text-gray-600 text-sm leading-relaxed">{mentor.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- Workshop Timeline Section --- */}
            {eventData.sessions && eventData.sessions.length > 0 && (
                <section className="space-y-10">
                    <h2 className="text-3xl font-bold text-pink text-left">Workshop Timeline</h2>
                    {/* Relative container with left padding for the line/dots */}
                    <div className="relative pl-6 sm:pl-8">
                        {/* The Timeline Line (Optional: single line, or rely on item borders) */}
                        {/* <div className="absolute left-2 sm:left-3 top-1 bottom-0 w-0.5 bg-gray-300"></div> */}

                        {eventData.sessions.map((session, index) => {
                            const sessionStartDate = new Date(session.start);
                            const sessionEndDate = new Date(session.end);

                            if (isNaN(sessionStartDate.getTime()) || isNaN(sessionEndDate.getTime())) {
                                console.error("Invalid date found in session:", session);
                                return null; // Skip rendering this invalid session
                                }

                            // Determine status
                            const isPast = now > sessionEndDate;
                            const isFuture = !isPast;

                            return (
                                // Each item is relative, with margin bottom
                                <div key={session.id} className="relative pb-8 last:pb-0">
                                    {/* Connecting line using border (only if not the last item) */}
                                    {index < eventData.sessions.length - 1 && (
                                        <div className={cn(
                                            "absolute left-[7px] sm:left-[9px] top-3 h-full w-0.5", // Positioning & Size
                                            isPast ? "bg-blueSky" : "bg-gray-300" // Conditional Color
                                        )}></div>
                                    )}

                                    {/* Marker Dot/Icon */}
                                    <div className={cn(
                                        "absolute left-0 top-1 h-5 w-5 rounded-full flex items-center justify-center ring-4",
                                        isPast ? "bg-blueSky text-white ring-blue-100" : "bg-gray-400 ring-gray-100"
                                        // Add specific style for 'active' state if needed
                                    )}>
                                        {isPast && <Check className="w-3 h-3" />}
                                    </div>

                                    {/* Content Box */}
                                    <div className={cn(
                                        "ml-12 sm:ml-16 p-4 sm:p-6 rounded-xl border shadow-md space-y-2",
                                        isFuture ? "bg-gray-50 border-gray-200 opacity-80" : "bg-white border-gray-200"
                                    )}>
                                        <p className={cn(
                                            "font-semibold text-lg sm:text-lg",
                                            isFuture ? "text-gray-600" : "text-gray-800"
                                        )}>
                                            {formatStartDate(session.start)} ({formatEventDateTime(session.start, session.end).timeRange})
                                        </p>
                                        <div className="space-y-4">
                                            <p className={cn(
                                                "font-semibold text-sm",
                                                    isFuture ? "text-gray-500" : "text-pink"
                                            )}>
                                                {session.topic || "Session Topic"} {/* Fallback text */}
                                            </p>
                                            <p className={cn(
                                                "text-sm",
                                                isFuture ? "text-gray-500" : "text-gray-600"
                                            )}>
                                                {session.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."} {/* Fallback text */}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* --- Scroll Up Button --- */}
            {/* Position remains unchanged, centered */}
            <section className="space-y-10">
                <h2 className="text-3xl font-bold text-pink text-left">Certificate</h2>
                <button className=" bg-purple-2 text-white hover:bg-purple-2/90 text-sm px-10 py-3 rounded-xl flex items-center gap-2">
                  Download Certificate
                </button>
            </section>

         </div> {/* End of vertical spacing wrapper */}
      </main> {/* End Main Content Area */}

    </div> // End Root Flex Container
  );
}