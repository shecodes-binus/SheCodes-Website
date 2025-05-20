// types/event.ts (Optional: Keep types separate)
export interface Mentor {
    id: number;
    name: string;
    occupation: string;
    description: string;
    imageSrc: string;
    story: string;
    instagram: string;
    linkedin: string;
    status: 'active' | 'inactive'; 
  }
  
  export interface TimelineItem {
    id: number;
    date: string;
    topic: string;
    description: string;
  }

  export interface Skill {
    id: number;
    title: string;
    description: string;
  }

  export interface Benefit {
    id: number;
    title: string;
    text: string;
  }

  export interface Session {
    id: string; // Unique ID for the session
    start: string | null;     // ISO 8601 string for session start
    end: string | null;       // ISO 8601 string for session end
    topic?: string;     // Optional: Specific topic for this session
    description?: string; // Optional: Description of the session
    location?: string;  // Optional: Override main event location
  }

  export interface CombinedEventData {
    id: number; // Unique ID for each event
    status: 'upcoming' | 'past' | 'ongoing'; // Renamed from 'tab'
    type: string; // Workshop, Seminar, Mentorship
    imageSrc: string; // Main image for the event (used in both list and detail)
    image_alt: string;
    title: string;
    description: string; // Short description for list, could be longer for detail
    startDate: string; // Single date for list view
    endDate: string;
    location: string;
    // --- Fields primarily for Detail View ---
    tags: string[];
    sessions: Session[];
    longDescription?: string; // Optional longer description for detail page
    dateRange?: string; // For multi-day events shown on detail page
    registerLink: string; // Link for registration or detail page
    tools: { name: string; logoSrc: string }[];
    keyPoints: string[];
    mentors: Mentor[];
    skillsNeeded: Skill[];
    benefits: Benefit[];
    // timeline: { id: number; date: string; topic: string; description: string }[];
    groupLink: string;
  }