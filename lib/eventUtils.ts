// src/lib/eventUtils.ts (Example utility file)
import type { CombinedEventData } from '@/types/events'; // Adjust path
import type { Session } from '@/types/events'; // Adjust path
import { format, parseISO, isSameDay, isAfter, isBefore, isEqual } from 'date-fns';

// Helper to normalize dates (set time to 00:00:00) for accurate date-only comparison
export const normalizeDate = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

interface EventStatusInfo {
  status: 'Finished' | 'Ongoing' | 'Upcoming';
  currentLessonTopic?: string; // The topic of the current/most recent lesson
}

export const getEventStatus = (event: CombinedEventData): EventStatusInfo => {
  const now = new Date();
  const todayNormalized = normalizeDate(now);

  // Ensure dates are valid before proceeding
  const eventEndDate = event.endDate ? parseISO(event.endDate) : null;
  const eventStartDate = event.startDate ? parseISO(event.startDate) : null;

  if (!eventEndDate || !eventStartDate) {
    // Handle cases with missing dates, default to upcoming or error state
    console.warn(`Event ID ${event.id} has missing start or end date.`);
    return { status: 'Upcoming' }; // Defaulting to upcoming for safety
  }

  const endDateNormalized = normalizeDate(eventEndDate);
  const startDateNormalized = normalizeDate(eventStartDate);

  // 1. Check if Finished (End date has passed today)
  if (isBefore(todayNormalized, startDateNormalized)) {
    // Event hasn't started yet
    return { status: 'Upcoming' };
  }

   // 2. Check if Ongoing (Today is between start and end dates inclusive)
  if (isEqual(todayNormalized, startDateNormalized) || (isAfter(todayNormalized, startDateNormalized) && (isBefore(todayNormalized, endDateNormalized) || isEqual(todayNormalized, endDateNormalized)))) {
    let currentSessionTopic: string | undefined = undefined;
    let latestRelevantSession: { id: string; start: string; end: string; topic?: string; } | null = null;

    if (event.sessions && event.sessions.length > 0) {
      const sessionsSorted = event.sessions.sort((a, b) => parseISO(a.start).getTime() - parseISO(b.start).getTime());

      for (const session of sessionsSorted) {
        const sessionStartDate = parseISO(session.start);
        const sessionEndDate = parseISO(session.end);

        // Check if the session is ongoing *right now*
        if (isAfter(now, sessionStartDate) && isBefore(now, sessionEndDate)) {
             currentSessionTopic = session.topic || `Session ${session.id}`; // Use topic or a default
             latestRelevantSession = session; // This session is currently active
             break; // Found the current session, no need to check further
        }

        // If not currently ongoing, check if it's a past session from today or earlier
         if (isBefore(sessionEndDate, now)) {
            // This session has already finished
             latestRelevantSession = session; // Keep track of the latest finished session
         }
         // If the session starts after 'now', we stop looking for a 'current' session
         if (isAfter(sessionStartDate, now)) {
             break; // Future sessions
         }
      }

       // If a currently active session was found, its topic is already assigned.
       // If not, but there was a latest relevant (finished today or earlier) session, use its topic.
       // Otherwise, the event is ongoing but no specific session topic can be highlighted (e.g., starting later today)
       if (!currentSessionTopic && latestRelevantSession) {
           currentSessionTopic = latestRelevantSession.topic || `Session ${latestRelevantSession.id}`;
            // Optional: Add logic here to differentiate "Currently between sessions" or similar if needed
       }
    }

    // If event is ongoing but no session topic found (e.g., event just started, first session is later)
    return { status: 'Ongoing', currentLessonTopic: currentSessionTopic || "In Progress" };
  }


  // 3. Otherwise, it's Finished (Start date has passed today, and it wasn't caught in the ongoing check)
   // This final check handles cases where today is after the event's end date.
   if (isAfter(todayNormalized, endDateNormalized)) {
       return { status: 'Finished' };
   }


  // Fallback - Should not be reached if logic is sound, but included for completeness
  return { status: 'Upcoming' };
};

// Helper function for date formatting (optional, could use date-fns)
export const formatEventDateTime = (startDateISO: string, endDateISO: string) => {
  const startDate = parseISO(startDateISO);
  const endDate = parseISO(endDateISO);

  // Format the date range
  let dateRange;
  if (isSameDay(startDate, endDate)) {
    dateRange = format(startDate, 'MMMM d, yyyy'); // e.g., "June 15, 2025"
  } else {
    dateRange = `${format(startDate, 'MMMM d, yyyy')} - ${format(endDate, 'MMMM d, yyyy')}`; // e.g., "May 16, 2025 - June 6, 2025"
  }

  // Format the time range
  const startTime = format(startDate, 'hh:mm a'); // e.g., "10:00 AM"
  const endTime = format(endDate, 'hh:mm a'); // e.g., "04:00 PM"
  const timeRange = `${startTime} - ${endTime}`;

  return {
    dateRange,
    timeRange,
    startTime,
    endTime
  };
};

export const formatEventGroupDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
  return date.toLocaleDateString('en-US', options);
};

export const calculateDuration = (
  startStringOrSession: string | Session,
  endString?: string
): string => {
  let startDateString: string;
  let endDateString: string;

  // Determine start/end strings based on input type
  if (typeof startStringOrSession === 'string' && typeof endString === 'string') {
    startDateString = startStringOrSession;
    endDateString = endString;
  } else if (typeof startStringOrSession === 'object' && startStringOrSession !== null && 'start' in startStringOrSession && 'end' in startStringOrSession) {
    startDateString = startStringOrSession.start;
    endDateString = startStringOrSession.end;
  } else {
    console.warn("Invalid input for calculateDuration");
    return "N/A";
  }

  try {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.warn(`Invalid date format in duration: Start='${startDateString}', End='${endDateString}'`);
      return "N/A";
    }

    const differenceMillis = endDate.getTime() - startDate.getTime();

    if (differenceMillis < 0) {
      console.warn(`End date before start date in duration: Start='${startDateString}', End='${endDateString}'`);
      return "N/A";
    }
    if (differenceMillis === 0) return "0 minutes";

    const totalMinutes = Math.round(differenceMillis / (1000 * 60));
    if (totalMinutes < 1) return "Less than a minute";

    // Calculate total hours and remaining minutes
    const totalHours = Math.floor(totalMinutes / 60) % 24;
    const remainingMinutes = totalMinutes % 60;

    const parts: string[] = [];
    if (totalHours > 0) parts.push(`${totalHours} hour${totalHours > 1 ? 's' : ''}`);
    if (remainingMinutes > 0) parts.push(`${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`);

    return parts.join(" ") || "N/A"; // Return joined parts or N/A if somehow empty

  } catch (error) {
    console.error("Error calculating duration:", error);
    return "N/A";
  }
};

export const formatStartDate = (startDateISO: string): string => {
  try {
    const date = parseISO(startDateISO);

    if (isNaN(date.getTime())) {
      console.warn(`Invalid date format provided: ${startDateISO}`);
      return "Invalid Date"; // Or some other indicator for invalid input
    }

    // Format the date as "Month Day, Year"
    return format(date, 'MMMM d, yyyy');

  } catch (error) {
    console.error("Error formatting start date:", error);
    return "Error"; // Handle potential errors during parsing or formatting
  }
};