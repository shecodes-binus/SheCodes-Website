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
  start: string;     // ISO 8601 string for session start
  end: string;       // ISO 8601 string for session end
  topic: string;     // Specific topic for this session
  description: string; // Description of the session
}

  export interface CombinedEventData {
  id: number;
  title: string;
  description: string; // Short description
  event_type: "Workshop" | "Seminar" | "Webinar" | "Mentorship";
  location: string;
  start_date: string; // ISO String
  end_date: string; // ISO String
  status: 'upcoming' | 'past' | 'ongoing';
  created_at: string; // ISO String
  
  // Optional detailed fields
  image_src?: string | null;
  image_alt?: string | null;
  tags?: string[] | null;
  long_description?: string | null;
  register_link?: string | null;
  tools?: { name: string; logo_src: string }[] | null;
  key_points?: string[] | null;
  group_link?: string;

  // Relationships
  mentors: Mentor[];
  skills: Skill[];
  benefits: Benefit[];
  sessions: Session[];
}