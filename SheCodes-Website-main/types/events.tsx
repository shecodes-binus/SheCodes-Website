// types/event.ts (Optional: Keep types separate)
export interface Mentor {
    id: number;
    name: string;
    occupation: string;
    description: string;
    image_src: string;
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
    id: number; // Unique ID for the session
    start: string | null;     // ISO 8601 string for session start
    end: string | null;       // ISO 8601 string for session end
    topic?: string;     // Optional: Specific topic for this session
    description?: string; // Optional: Description of the session
    location?: string;  // Optional: Override main event location
  }

  export interface CombinedEventData {
  id: number; // Unique ID for each event
  status: 'upcoming' | 'past' | 'ongoing';
  type: string; // Workshop, Seminar, Mentorship
  image_src: string; // Main image for the event
  image_alt: string;
  title: string;
  description: string; // Short description
  start_date: string; // Single date for list view
  end_date: string;
  created_at: string;
  location: string;
  // --- Fields primarily for Detail View ---
  tags: string[];
  sessions: Session[];
  long_description?: string; // Optional longer description
  date_range?: string; // For multi-day events
  register_link: string; // Link for registration
  tools: { name: string; logo_src: string }[];
  key_points: string[];
  mentors: Mentor[];
  skills_needed: Skill[];
  benefits: Benefit[];
  group_link: string;
}