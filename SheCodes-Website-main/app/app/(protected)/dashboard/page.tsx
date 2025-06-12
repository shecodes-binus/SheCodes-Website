// src/app/(app)/dashboard/page.tsx (Example route)

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Keep for potential future use
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import {
  LayoutGrid,
  ListChecks,
  Briefcase,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  NotebookText, // Assuming this or similar icon for default
  Presentation, // Example for Seminar
  Users, // Example for Mentorship
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
// import { allEventsData } from '@/data/dummyEvent'; 
import type { CombinedEventData, Session } from '@/types/events';
import { normalizeDate, formatEventGroupDate, calculateDuration, formatEventDateTime } from '@/lib/eventUtils';
import { format, parseISO, isSameDay, isAfter, isBefore, isEqual, min, max, differenceInMilliseconds } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import apiService from '@/lib/apiService';

// Interface representing an aggregated entry for an event on a specific day
interface DailyEventEntry {
  uniqueId: string;
  event_id: number;
  event_title: string;
  event_type: "Workshop" | "Seminar" | "Webinar" | "Mentorship";
  event_location: string;
  day_date: Date;
  day_start_time_iso: string;
  day_end_time_iso: string;
}

// Interface for the data structure used in the final grouped display list
interface ScheduleDayDisplayData {
  entry: DailyEventEntry; // Contains the aggregated daily event info
  IconComponent: React.ElementType;
  iconBg: string;
  iconColor: string;
}

// Adjusted GroupedEvents to hold Daily Event Display Data
interface GroupedEvents {
  [dateKey: string]: ScheduleDayDisplayData[]; // Key is "Today" or formatted date string
}

type EventStatus = 'Completed' | 'On Progress' | 'Upcoming';

interface EventProgressInfo {
    id: number;
    title: string;
    status: EventStatus;
    progressValue: number;
    tags: string[];
    sessions: Session[]; 
}

interface UserWithEvents {
    participations: {
        event: CombinedEventData;
    }[];
}

const eventTypeStyles: { [key: string]: { icon: React.ElementType; bg: string; color: string; } } = {
  Workshop: { icon: NotebookText, bg: 'bg-pink-100', color: 'text-pink-600' },
  Seminar: { icon: Presentation, bg: 'bg-purple-100', color: 'text-purple-600' },
  Mentorship: { icon: Users, bg: 'bg-green-100', color: 'text-green-600' },
  Default: { icon: NotebookText, bg: 'bg-gray-100', color: 'text-gray-600' }, // Fallback
};

// --- Sidebar Component (Reuse or adapt) ---
const SidebarNav = () => {
    const activePath = '/app/dashboard'; // Set active path for this page
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

// --- Main Dashboard Page Component ---
export default function DashboardPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [userEvents, setUserEvents] = React.useState<CombinedEventData[]>([]);
  const [activeFilter, setActiveFilter] = React.useState<EventStatus | 'All'>('All');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [expandedEvents, setExpandedEvents] = React.useState<Set<number>>(new Set());
  const { isAuthenticated, loading: authLoading } = useAuth();

  // State to track expanded events by their ID - START EMPTY
  React.useEffect(() => {
    if (isAuthenticated) {
        const fetchMyEvents = async () => {
            setLoading(true);
            try {
                const response = await apiService.get<UserWithEvents>('/users/me');
                const events = response.data.participations.map(p => p.event).filter(Boolean); // Filter out any null/undefined events
                setUserEvents(events);
            } catch (err) {
                console.error("Failed to fetch user activities:", err);
                setError("Could not load your activities.");
            } finally {
                setLoading(false);
            }
        };
        fetchMyEvents();
    }
  }, [isAuthenticated]);

  // Function to toggle expansion state (Keep as is)
  const toggleEventExpansion = (eventId: number) => {
    setExpandedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) newSet.delete(eventId);
      else newSet.add(eventId);
      return newSet;
    });
  };

  // --- Calculate Progress Stats based on Event Timings ---
  const progressStats = React.useMemo(() => {
    const now = new Date();
    let completedCount = 0;
    let inProgressCount = 0;
    let totalHoursSpent = 0;
    let relevantEventCount = 0;

    userEvents.forEach(event => {
        if (!event.sessions || event.sessions.length === 0) return;
        relevantEventCount++;
        let eventTotalDurationMs = 0;
        try {
            const sessionStarts = event.sessions.map(s => parseISO(s.start));
            const sessionEnds = event.sessions.map(s => parseISO(s.end));
            if (sessionStarts.some(d => isNaN(d.getTime())) || sessionEnds.some(d => isNaN(d.getTime()))) {
                throw new Error("Invalid date format");
            }

            const eventMinStartTime = min(sessionStarts);
            const eventMaxEndTime = max(sessionEnds);
            event.sessions.forEach(session => {
                eventTotalDurationMs += differenceInMilliseconds(parseISO(session.end), parseISO(session.start));
            });

            if (isBefore(eventMaxEndTime, now)) {
                completedCount++;
                totalHoursSpent += eventTotalDurationMs / (1000 * 60 * 60);
            } else if (isBefore(eventMinStartTime, now)) {
                inProgressCount++;
            }
        } catch (error) {
            console.error(`Error processing dates for event ${event.id}:`, error);
        }
    });

    const inProgressPercentage = relevantEventCount > 0 ? Math.round((inProgressCount / relevantEventCount) * 100) : 0;
    
    return {
      hoursSpent: Math.round(totalHoursSpent),
      completed: completedCount,
      inProgress: inProgressPercentage,
    };
  }, [userEvents]);

  // --- Calculate Event Progress List (NEW) ---
  const eventProgressList = React.useMemo((): EventProgressInfo[] => {
    const now = new Date();
    return userEvents.map(event => {
      let status: EventStatus = 'Upcoming';
      let progressValue = 0;
      
      // Handle events with no sessions
      if (!event.sessions || event.sessions.length === 0) {
         return { 
           id: event.id, 
           title: event.title, 
           status: 'Upcoming', 
           progressValue: 0, 
           sessions: [], 
           tags: event.tags || [] // FIX: Ensure tags is always an array
         };
      }

      try {
        const sessionStarts = event.sessions.map(s => parseISO(s.start));
        const sessionEnds = event.sessions.map(s => parseISO(s.end));
        
        // FIX: Check validity by calling .getTime() on each Date object
        if (sessionStarts.some(d => isNaN(d.getTime())) || sessionEnds.some(d => isNaN(d.getTime()))) {
            throw new Error("Invalid date format");
        }
        
        const eventMinStartTime = min(sessionStarts);
        const eventMaxEndTime = max(sessionEnds);

        if (isBefore(eventMaxEndTime, now)) {
          status = 'Completed';
          progressValue = 100;
        } else if (isBefore(eventMinStartTime, now)) {
          status = 'On Progress';
          const completedSessions = event.sessions.filter(s => isBefore(parseISO(s.end), now)).length;
          progressValue = event.sessions.length > 0 ? Math.round((completedSessions / event.sessions.length) * 100) : 0;
        }
        // If neither, status remains 'Upcoming' and progressValue remains 0
      } catch (error) {
        console.error(`Error calculating progress for event ${event.id}:`, error);
        // Default to Upcoming/0% on error
        status = 'Upcoming';
        progressValue = 0;
      }

      return { 
        id: event.id, 
        title: event.title, 
        status, 
        progressValue, 
        tags: event.tags || [], // FIX: Ensure tags is always an array
        sessions: event.sessions 
      };
    });
  }, [userEvents]);

  const filteredEventProgressList = React.useMemo(() => {
    if (activeFilter === 'All') {
      return [...eventProgressList].sort((a, b) => {
          const statusOrder = { 'On Progress': 1, 'Completed': 2, 'Upcoming': 3 };
          return statusOrder[a.status] - statusOrder[b.status];
      });
    }
    return eventProgressList.filter(event => event.status === activeFilter);
  }, [eventProgressList, activeFilter]);
  
  // --- Calculate unique dates with events for calendar highlighting ---
  const eventDates = React.useMemo(() => {
    const dates = new Set<string>();
    userEvents.forEach(event => {
      event.sessions?.forEach(session => {
        try {
          const normalizedDay = normalizeDate(parseISO(session.start));
          if (!isNaN(normalizedDay.getTime())) dates.add(normalizedDay.toISOString());
        } catch (e) { console.error(`Error parsing session date: ${session.id}`, e); }
      });
    });
    return Array.from(dates).map(iso => new Date(iso));
  }, [userEvents]); 

  // --- Process, Aggregate, Filter, and Group DAILY EVENT ENTRIES for Display ---
  const displayedScheduleEvents = React.useMemo(() => {
    const todayNormalized = normalizeDate(new Date());
    const groups: GroupedEvents = {};
    const dailyEventEntriesMap = new Map<string, { event: CombinedEventData; sessionDates: Date[] }>();

    userEvents.forEach(event => {
      if (!event.sessions || event.sessions.length === 0) return;
      event.sessions.forEach(session => {
        try {
            const sessionStartDate = parseISO(session.start);
            const dayKey = format(normalizeDate(sessionStartDate), 'yyyy-MM-dd');
            const mapKey = `event-${event.id}-date-${dayKey}`;

            if (!dailyEventEntriesMap.has(mapKey)) {
                dailyEventEntriesMap.set(mapKey, { event: event, sessionDates: [] });
            }
            dailyEventEntriesMap.get(mapKey)?.sessionDates.push(sessionStartDate, parseISO(session.end));
        } catch (e) { console.error(`Error processing session ${session.id} for event ${event.id}:`, e); }
      });
    });

    // 2. Convert Map entries into DailyEventEntry array
    const allDailyEventEntries: DailyEventEntry[] = Array.from(dailyEventEntriesMap.entries()).map(([key, data]) => {
        const startTimes = data.sessionDates.filter((_, i) => i % 2 === 0);
        const endTimes = data.sessionDates.filter((_, i) => i % 2 !== 0);
        const earliestStartTime = min(startTimes);
        const latestEndTime = max(endTimes);
        return {
            uniqueId: key,
            event_id: data.event.id,
            event_title: data.event.title,
            event_type: data.event.event_type,
            event_location: data.event.location || 'N/A',
            day_date: normalizeDate(earliestStartTime),
            day_start_time_iso: earliestStartTime.toISOString(),
            day_end_time_iso: latestEndTime.toISOString(),
        };
    });

    // 3. Filter daily entries based on selected date or upcoming status
    let filteredDailyEntries = allDailyEventEntries;
    if (date) {
        const selectedDateNormalized = normalizeDate(date);
        filteredDailyEntries = allDailyEventEntries.filter(entry => isSameDay(entry.day_date, selectedDateNormalized));
    } else {
        filteredDailyEntries = allDailyEventEntries.filter(entry => !isBefore(entry.day_date, todayNormalized))
            .sort((a, b) => a.day_date.getTime() - b.day_date.getTime() || parseISO(a.day_start_time_iso).getTime() - parseISO(b.day_start_time_iso).getTime());
    }

    filteredDailyEntries.forEach(entry => {
        const groupKey = isSameDay(entry.day_date, todayNormalized) ? "Today" : formatEventGroupDate(entry.day_date);
        if (!groups[groupKey]) groups[groupKey] = [];
        const styleInfo = eventTypeStyles[entry.event_type] || eventTypeStyles.Default;
        groups[groupKey].push({ entry, IconComponent: styleInfo.icon, iconBg: styleInfo.bg, iconColor: styleInfo.color });
    });
    
    Object.values(groups).forEach(group => group.sort((a, b) => parseISO(a.entry.day_start_time_iso).getTime() - parseISO(b.entry.day_start_time_iso).getTime()));
    
    return groups;
  }, [userEvents, date]);

  if (authLoading || loading) {
    // A simple skeleton for loading state
    return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    // Use light background for the page container if needed, or keep it white/gray-50
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden lg:block w-72 bg-white border-r border-gray-200 p-4 rounded-lg shadow-sm m-4 mt-16 self-start"> {/* Rounded, margin */}
         <div className="sticky top-4"> {/* Adjust top offset if header exists */}
            <SidebarNav />
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-8 lg:py-16 lg:px-10 flex gap-8">

        {/* Progress Section */}
        <section className='flex-1 flex-col bg-white p-10 rounded-xl shadow-md'>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Progress</h2>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-6 mb-6">
            {/* Card for Hours Spent */}
            <Card className="text-center rounded-lg">
              <CardContent className="py-4 md:py-6 space-y-2">
                <p className="text-3xl font-bold text-gray-900">{progressStats.hoursSpent}</p>
                <p className="text-sm font-semibold text-grey-3 mt-1">Hours Spent</p>
              </CardContent>
            </Card>
             {/* Card for Completed */}
             <Card className="text-center rounded-lg">
              <CardContent className="py-4 md:py-6 space-y-2">
                <p className="text-3xl font-bold text-gray-900">{progressStats.completed}</p>
                <p className="text-sm font-semibold text-grey-3 mt-1">Completed</p>
              </CardContent>
            </Card>
             {/* Card for In Progress */}
             <Card className="text-center rounded-lg">
              <CardContent className="py-4 md:py-6 space-y-2">
                <p className="text-3xl font-bold text-gray-900">{progressStats.inProgress}%</p>
                <p className="text-sm font-semibold text-grey-3 mt-1">In Progress</p>
              </CardContent>
            </Card>
          </div>

          {/* Filter Tabs (NEW) */}
          <div className="flex space-x-6 border-b border-gray-200 mb-6">
              {(['All', 'On Progress', 'Completed'] as const).map((filter) => (
                  <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={cn(
                          "pb-2 px-1 text-sm font-medium transition-colors",
                          activeFilter === filter
                              ? "text-black font-bold border-b-2 border-pink"
                              : "text-grey-3 hover:text-grey-3/80"
                      )}
                  >
                      {filter}
                  </button>
              ))}
          </div>

          {/* Event Progress List (NEW) */}
          <div className="space-y-4">
             {filteredEventProgressList.length > 0 ? (
                filteredEventProgressList.map((event) => {
                    const isExpanded = expandedEvents.has(event.id);
                    const isCompleted = event.status === 'Completed';
                    const isOnProgress = event.status === 'On Progress';
                    const isUpcoming = event.status === 'Upcoming';
                    const hasSkills = event.tags && event.tags.length > 0;

                    const canExpand = hasSkills && !isUpcoming;

                    return (
                        <Card key={event.id} className="border-grey-1 border shadow-sm rounded-lg overflow-hidden">
                            <CardContent className="p-4">
                                {/* Top Row: Title, Badge, Arrow */}
                                <div className="flex justify-between items-center mb-3">
                                    <div className='flex items-center gap-3'>
                                        <span className="text-sm font-semibold text-gray-800">{event.title}</span>
                                        {isOnProgress && (
                                            <span className="text-xs font-semibold px-4 py-0.5 rounded-full bg-pink text-white">
                                                On Progress
                                            </span>
                                        )}
                                        {isCompleted && (
                                            <span className="text-xs font-semibold px-4 py-0.5 rounded-full bg-blueSky text-white">
                                                Completed
                                            </span>
                                        )}
                                         {/* Upcoming badge could be added here if needed in 'All' view */}
                                         {isUpcoming && ( <span className="text-xs font-semibold px-4 py-0.5 rounded-full bg-purple-2/60 text-white">Not Yet Started</span> )}
                                    </div>
                                    {canExpand ? (
                                        <div onClick={() => toggleEventExpansion(event.id)} className="cursor-pointer p-1 rounded-full hover:bg-gray-100">
                                            {isExpanded
                                                ? <ChevronUp className="h-4 w-4 text-gray-400" />
                                                : <ChevronDown className="h-4 w-4 text-gray-400" />}
                                        </div>
                                    ) : (
                                        // Optional: Add a placeholder or empty div if you need consistent alignment
                                        <div className="h-4 w-4 p-1"></div> // Placeholder to maintain layout
                                    )}
                                </div>

                                {/* Progress Bar and Percentage */}
                                {/* {!isUpcoming && ( */}
                                  <div className="flex items-center gap-3">
                                      <div className="h-1.5 flex-grow bg-gray-200 rounded-full overflow-hidden">
                                          <div
                                              className={cn(
                                                  "h-full rounded-full",
                                                  // Use pink for On Progress, blue for Completed
                                                  isOnProgress ? 'bg-pink' : 'bg-blueSky'
                                              )}
                                              style={{ width: `${event.progressValue}%` }}
                                          ></div>
                                      </div>
                                      <span className="text-sm font-medium text-gray-500 w-10 text-right">
                                          {event.progressValue}%
                                      </span>
                                  </div>
                                {/* )} */}

                                {/* Collapsible Content Area (Placeholder for future) */}
                                <div
                                    className={cn(
                                        "overflow-hidden duration-500 ease-in-out", // Base transition classes
                                        isExpanded && canExpand ? "max-h-96 opacity-100" : "max-h-0 opacity-0" // Conditional classes for expanded/collapsed
                                    )}
                                >
                                    {/* Only render the skills content if it should be visible (avoids rendering empty space) */}
                                    {isExpanded && canExpand && (
                                        <div className="text-sm space-y-2 pt-4 mt-4 border-t border-gray-100"> {/* Inner div for content padding/spacing if needed */}
                                            {event.tags.map((skill, index) => (
                                                <p key={index} className='text-grey-3'>{skill}</p>
                                            ))}
                                        </div>
                                    )}
                                </div>

                            </CardContent>
                        </Card>
                    );
                })
             ) : (
                 <p className="text-sm text-gray-500 text-center py-4">
                     No events match the filter "{activeFilter}".
                 </p>
             )}
          </div>
        </section>

        {/* Calendar & Schedule Section */}
        <section className="flex flex-col bg-white flex-1 gap-4 items-start p-6 rounded-xl shadow-md"> {/* Adjust grid columns */}

          {/* Calendar Column */}
          <Card className="border-none w-full flex flex-col">
            {/* Removed padding from CardContent to allow Calendar to manage its spacing */}
            <CardContent className="pt-4 md:pt-6 flex items-center justify-center flex-grow px-2">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="p-0 w-full h-full bg-white" 
                modifiers={{
                  hasEvents: eventDates, // Pass the array of dates with events
                }}
                modifiersClassNames={{
                    hasEvents: "relative after:content-[''] after:block after:absolute after:bottom-2.5 after:left-1/2 after:-translate-x-1/2 after:h-1.5 after:w-1.5 after:rounded-full after:bg-purple-1",
                }}
                classNames={{
                    root: "flex flex-col h-full",
                    month: "space-y-4 flex flex-col flex-grow",
                    caption: "flex justify-between px-1 mb-4 items-center",
                    caption_label: "text-xl font-bold", // Adjusted size
                    nav: "space-x-1 flex items-center",
                    nav_button: cn(
                        "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                    ),
                    nav_button_previous: "hover:bg-white rounded-full mr-6",
                    nav_button_next: "hover:bg-white rounded-full",
                    table: "w-full border-separate border-spacing-0.5 flex-grow",
                    head_row: "flex", // Use flex for day names
                    head_cell: "text-black font-semibold text-[0.8rem] text-center flex-1 p-1 mb-3 capitalize", // Adjusted size/weight
                    tbody: "flex-grow", // Allow table body to grow
                    row: "flex w-full",
                    cell: cn(
                      "flex-1 aspect-square text-center text-sm p-0 relative focus-within:relative focus-within:z-20", // Base cell size, padding, centering
                      // Add borders to create grid lines
                      // "[&:has([aria-selected])]:bg-transparent", // Ensure selected doesn't show cell bg
                      "border border-gray-100" // Light gray border for grid
                    ),
                    day: cn(
                      "h-full w-full p-0 font-normal flex items-center justify-center", // Match cell size
                      "hover:bg-gray-100 rounded-none", // Hover state, NO rounding
                      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" // Focus state
                    ),
                    day_selected: "bg-purple-1 text-white hover:bg-purple-1/90 hover:text-white focus:bg-purple-1 focus:text-white rounded-none", // Example selected color
                    day_today: "border border-gray-400 rounded-none",
                    day_outside: "text-grey-3 opacity-50 bg-grey-1 rounded-none",
                    day_disabled: "text-gray-400 bg-[#A8A8A8] opacity-50 rounded-none",
                    day_hidden: "invisible",
                }}
                 components={{
                    IconLeft: ({ ...props }) => <ChevronLeft className="h-5 w-5" />,
                    IconRight: ({ ...props }) => <ChevronRight className="h-5 w-5" />,
                }}
              />
            </CardContent>
          </Card>

          {/* Schedule List Column */}
          

          <div className="space-y-6 order-last w-full"> 
            {Object.entries(displayedScheduleEvents).map(([dateKey, entriesOnDate]) => (
              console.log(displayedScheduleEvents.length),
              <div key={dateKey}>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 px-2">{dateKey}</h3>
                <div className="space-y-3">
                  {entriesOnDate.map(({ entry, IconComponent, iconBg, iconColor }) => (
                    <Card key={entry.uniqueId} className="border-none">
                      <CardContent className="py-3 flex items-center justify-between gap-3 px-0">
                        {/* Left Side */}
                        <div className="flex items-center gap-3 flex-1 overflow-hidden">
                          <span className="text-xs text-gray-500 w-16 text-right flex-shrink-0">{formatEventDateTime(entry.day_start_time_iso, entry.day_end_time_iso).startTime}</span>
                          <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0", iconBg)}>
                            <IconComponent className={cn("h-5 w-5", iconColor)} />
                          </span>
                          <div className="flex-1 overflow-hidden space-y-1">
                            <p className="text-sm font-semibold text-gray-800 truncate">{entry.event_title}</p>
                            <p className="text-xs text-gray-500 truncate">{entry.event_location}</p>
                          </div>
                        </div>
                        {/* Right Side - Duration Only */}
                        <div className="text-right flex-shrink-0 space-y-0.5">
                          <p className="text-[0.8rem] font-semibold text-gray-700">{entry.event_type}</p>
                          {/* Calculate duration if needed, or use a placeholder/fixed value */}
                          <p className="text-[0.75rem] text-gray-500">{calculateDuration(entry.day_end_time_iso, entry.day_end_time_iso)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
            {Object.keys(displayedScheduleEvents).length === 0 && (
              console.log("No events found for the selected date."),
                <p className="text-sm text-gray-500 px-2">
                   {date ? `No events scheduled for ${isSameDay(date, new Date()) ? 'today' : formatEventGroupDate(date)}.` : 'No upcoming events scheduled.'}
                </p>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}