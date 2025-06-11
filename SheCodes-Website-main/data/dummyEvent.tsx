// data/dummyEvent.ts (Or define within the component)
import type { CombinedEventData } from '@/types/events'; // Adjust path if needed

const createISOString = (dateStr: string, timeStr: string): string => {
  const datePart = new Date(dateStr); // Basic parsing of "Month Day, Year"
  const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);

  if (!timeMatch || isNaN(datePart.getTime())) {
      console.warn(`Could not parse date/time: ${dateStr} ${timeStr}`);
      // Fallback to just the date part as ISO date (YYYY-MM-DD)
      const year = datePart.getFullYear();
      const month = String(datePart.getMonth() + 1).padStart(2, '0');
      const day = String(datePart.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}T00:00:00`; // Default to midnight if time fails
  }

  let hours = parseInt(timeMatch[1], 10);
  const minutes = parseInt(timeMatch[2], 10);
  const period = timeMatch[3] ? timeMatch[3].toUpperCase() : null; // AM/PM or null if 24hr format assumed

  if (period) { // Adjust for AM/PM if present
      if (hours === 12) {
          hours = period === 'AM' ? 0 : 12; // Midnight is 0, Noon is 12
      } else if (period === 'PM') {
          hours += 12;
      }
  } // Assume 24hr if no period

  datePart.setHours(hours, minutes, 0, 0);

  // Format to YYYY-MM-DDTHH:MM:SS (local time assumed)
  const year = datePart.getFullYear();
  const month = String(datePart.getMonth() + 1).padStart(2, '0');
  const day = String(datePart.getDate()).padStart(2, '0');
  const hourStr = String(datePart.getHours()).padStart(2, '0');
  const minuteStr = String(datePart.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hourStr}:${minuteStr}:00`;
};

export const allEventsData: CombinedEventData[] = [
  // Event 1 (Upcoming Workshop)
  {
    id: 1,
    status: "upcoming",
    event_type: "Workshop",
    image_src: "/photo2.png", // Assign specific placeholders
    image_alt: "Workshop Event Image",
    title: "Intro to Web Development",
    description: "Learn the fundamentals of HTML, CSS, and JavaScript in this hands-on workshop.",
    start_date: "2025-06-15T10:00:00",
    end_date: "2025-06-15T16:00:00",
    location: "Binus University International, JWC Campus",
    // --- Detail Fields ---
    tags: ["Web Development", "Beginner", "HTML", "CSS", "JavaScript"],
    long_description: "Dive deep into web development basics. This workshop covers everything you need to start building your own websites, from structuring content with HTML to styling with CSS and adding interactivity with JavaScript. No prior experience needed!",
    register_link: "/register/event-1",
    tools: [ { name: "Visual Studio Code", logo_src: "/tools/vsc.png" }, { name: "Browser DevTools", logo_src: "/tools/python.png" /* Example */ } ],
    key_points: [ "Understand HTML document structure.", "Apply CSS for styling and layout.", "Basic JavaScript for interactivity.", "Using browser developer tools." ],
    mentors: [ {
      id: 1,
      name: "Dewanti Subijantoro",
      occupation: "Corporate Representative - Rumah Atsiri Indonesia",
      description: "Passionate about building scalable web applications and mentoring aspiring developers.", // Shorter bio
      image_src: "/mentors/mentor1.jpeg",
      story: "Corporate Holding Representative and General Manager at Rumah Atsiri Indonesia with a vision to prioritize economic inclusion and Indonesian Soft Power promotion by way of aromatic wellness and regenerative tourism. With a solid foundation in strategic partnerships, business development, and international relations, she spearheads corporate branding and commercial expansion. Collaborative, results-oriented, and backed by networking, negotiating, and project management skills, she delivers effective operations and impactful partnerships. Dewanti is also devoted to technical training and capacity building, enhancing Indonesia’s international presence and promoting sustainable business and community development.",
      instagram: "https://www.instagram.com/styllagram/",
      linkedin: "https://www.linkedin.com/in/dewanti-subijantoro-49732923/",
      status: 'active',
    } ],
    skills: [ { id: 1, title: "Problem Solving", description: "Debugging simple code issues." }, { id: 2, title: "Attention to Detail", description: "Writing syntactically correct code." } ],
    benefits: [
      { id: 1, title: "Build Your First Website", text: "Gain practical experience by creating a static website from scratch during the workshop." },
      { id: 2, title: "Foundational Skills", text: "Acquire the essential HTML, CSS, and JavaScript knowledge needed for further web development learning." },
    ],
    sessions: [
      {
        id: 101,
        start: "2025-06-15T10:00:00",
        end: "2025-06-15T11:00:00",
        topic: "HTML Basics",
        description: "Learn the structure of a webpage using HTML elements and tags."
      },
      {
        id: 102,
        start: "2025-06-15T11:00:00",
        end: "2025-06-15T13:00:00",
        topic: "CSS Styling",
        description: "Understand how to style HTML content using CSS properties and layouts."
      },
      {
        id: 103,
        start: "2025-06-15T14:00:00",
        end: "2025-06-15T16:00:00",
        topic: "JS Intro",
        description: "Explore the basics of JavaScript for interactivity and DOM manipulation."
      }
    ],
    group_link: "https://www.whatsapp.com/",  //whatsapp group link
    created_at: '2025-06-01T09:00:00'
  },
  // Event 2 (Upcoming Seminar)
  {
    id: 2,
    status: "upcoming",
    event_type: "Seminar",
    image_src: "/photo2.png",
    image_alt: "Seminar Event Image",
    title: "AI in Modern Tech",
    description: "Explore the impact and applications of Artificial Intelligence across various industries.",
    start_date: "2025-06-22T14:00:00",
    end_date: "2025-06-22T16:00:00",
     // --- Location ---
    location: "Online via Zoom",
     // --- Detail Fields (Simplified examples) ---
    tags: ["AI", "Technology", "Future Trends"],
    long_description: "Join industry experts as they discuss the latest advancements in AI, ethical considerations, and future career opportunities in this rapidly evolving field.",
    register_link: "/register/event-2",
    tools: [ { name: "Zoom", logo_src: "/tools/zoom.png" } ],
    key_points: [ "Current state of AI.", "Ethical implications.", "Career paths in AI." ],
    mentors: [ {
      id: 2,
      name: "Ananta Besty",
      occupation: "Customer Success Account Manager - Microsoft Indonesia",
      description: "Bridging the gap between user needs and technical solutions.",
      image_src: "/mentors/mentor2.jpeg",
      story: "Ananta Besty is a Customer Success Account Manager with a focus on driving digital transformation, cloud adoption, and generative AI deployment in enterprise, public sector, and education clients. With over six years of tenure at Microsoft, she has technical expertise in areas such as customer success, service delivery, and technical account management. With excellent communication, negotiation, and strategic planning abilities, she fosters long-term relationships and spearheads high-impacting projects aligned with organizational objectives. Her customer focus and deep client understanding empower organizations to succeed in the digital age.",
      instagram: "https://www.instagram.com/anantabesty/",
      linkedin: "https://www.linkedin.com/in/ananta-besty-906b46104/",
      status: 'active',
    } ],
    skills: [ { id: 3, title: "Critical Thinking", description: "Analyzing AI trends." }, { id: 4, title: "Curiosity", description: "Exploring new technologies." } ],
    benefits: [
      { id: 3, title: "Industry Insights", text: "Hear directly from professionals working with AI every day." },
      { id: 4, title: "Networking", text: "Connect with peers and speakers interested in the future of technology." },
    ],
    sessions: [
      { id: 201, start: "2025-06-22T14:00:00", end: "2025-06-22T15:00:00", topic: "Keynote: AI Trends", description: "An overview of current and future AI trends." },
      { id: 202, start: "2025-06-22T15:00:00", end: "2025-06-22T16:00:00", topic: "Panel Q&A", description: "Ask your questions to our panel of experts." }
    ],  
    group_link: "https://www.whatsapp.com/",  //whatsapp group link
    created_at: '2025-06-10T09:00:00'
  },
   // Event 3 (Upcoming Mentorship) - Add similar detail fields
  {
    id: 3,
    status: "upcoming",
    event_type: "Mentorship",
    image_src: "/photo2.png",
    image_alt: "Mentorship Program",
    title: "Mentorship Program Kickoff",
    description: "Start your mentorship journey! Meet your mentors and peers.",
    start_date: createISOString("July 1, 2025", "06:00 PM"),
    end_date: createISOString("July 1, 2025", "08:00 PM"), // Adjusted end time example
    location: "Virtual Platform",
    tags: ["Mentorship", "Career Growth", "Networking"],
    register_link: "/register/event-3",
    sessions: [
      { id: 301, start: "2025-07-01T14:00:00", end: "2025-06-22T16:00:00", topic: "Kickoff & Introductions", description: "An overview of current and future AI trends." }
  ],
    // ... add other dummy detail fields
    tools: [], key_points: [], mentors: [], skills: [], benefits: [],
    group_link: "https://www.whatsapp.com/",  //whatsapp group link,
    created_at: '2025-06-20 09:00:00'
  },
  // Event 4 (Upcoming Workshop) - Add similar detail fields
  {
    id: 4,
    status: "upcoming",
    event_type: "Workshop",
    image_src: "/photo2.png",
    image_alt: "Data Analysis Workshop",
    title: "Data Analysis with Python",
    description: "Learn to analyze and visualize data using Python libraries like Pandas and Matplotlib.",
    start_date: createISOString("April 24, 2025", "09:00 AM"),
    end_date: createISOString("April 26, 2025", "01:00 PM"), // Ends on the 3rd day
    location: "Binus Anggrek Campus", // Default location
    tags: ["Data Analysis", "Python", "Pandas", "Matplotlib"],
    register_link: "/register/event-4",
    sessions: [ // Already had multiple sessions defined
      { id: 401, start: "2025-04-24T09:00:00", end: "2025-04-24T13:00:00", topic: "Day 1: Pandas Basics" , description: "An overview of current and future AI trends."},
      { id: 402, start: "2025-04-24T09:00:00", end: "2025-04-24T13:00:00", topic: "Day 2: Data Cleaning & Manipulation" , description: "An overview of current and future AI trends."},
      { id: 403, start: "2025-04-24T09:00:00", end: "2025-04-24T13:00:00", topic: "Day 3: Matplotlib Visualization" , description: "An overview of current and future AI trends."},
    ],
    // ... add other dummy detail fields
    tools: [], key_points: [], mentors: [], skills: [], benefits: [],
    group_link: "https://www.whatsapp.com/",  //whatsapp group link
    created_at: '2025-04-10 09:00:00'
  },
   // Event 5 (Upcoming Seminar) - Add similar detail fields
  {
    id: 5,
    status: "upcoming",
    event_type: "Seminar",
    image_src: "/photo2.png",
    image_alt: "Cybersecurity Seminar",
    title: "Cybersecurity Essentials",
    description: "Understand common threats and best practices for online security.",
    start_date: createISOString("July 18, 2025", "03:00 PM"),
    end_date: createISOString("July 18, 2025", "04:30 PM"),
    location: "Online",
    tags: ["Cybersecurity", "Security Awareness"],
    register_link: "/register/event-5",
    sessions: [
      { id: 501, start: "2025-07-18T15:00:00", end: "2025-07-18T16:30:00", topic: "Cybersecurity Essentials Overview", description: "An overview of current and future AI trends. "}
  ],
    // ... add other dummy detail fields
    tools: [], key_points: [], mentors: [], skills: [], benefits: [],
    group_link: "https://www.whatsapp.com/",  //whatsapp group link
    created_at: '2025-07-01 09:00:00'
  },
  // Event 6 (Past Mentorship) - Add similar detail fields
  {
    id: 6,
    status: "past",
    event_type: "Mentorship",
    image_src: "/photo2.png",
    image_alt: "Past Mentorship Session",
    title: "Past Mentorship Goal Setting",
    description: "Session focused on setting achievable goals for the mentorship period.",
    start_date: "2024-03-05T19:00:00",
    end_date: "2024-03-05T20:30:00",
    location: "Virtual Platform",
    tags: ["Mentorship", "Goal Setting"],
    register_link: "/event-recap/6", // Link might go to a recap page for past events
    sessions: [
      { id: 601, start: "2024-03-05T19:00:00", end: "2024-03-05T20:30:00", topic: "Goal Setting", description: "A session on setting SMART goals." }
    ],
    tools: [], key_points: [], mentors: [], skills: [], benefits: [],
    group_link: "https://www.whatsapp.com/",  //whatsapp group link
    created_at: '2024-02-20T09:00:00'
  },
  // Event 7 (Past Seminar) - Add similar detail fields
  {
    id: 7,
    status: "past",
    event_type: "Seminar",
    image_src: "/photo2.png",
    image_alt: "Past Tech Talk",
    title: "Tech Talk: Cloud Computing",
    description: "An overview of cloud services and their benefits.",
    start_date: createISOString("February 12, 2024", "01:00 PM"),
    end_date: createISOString("February 12, 2024", "02:00 PM"),
    location: "Online Recording Available",
    tags: ["Cloud Computing", "AWS", "Azure", "GCP"],
    sessions: [
      { id: 701, start: "2024-02-12T10:00:00", end: "2024-02-12T14:00:00", topic: "Goal Setting", description: "A session on setting SMART goals." }
   ],
    register_link: "/event-recap/7",
    // ... add other dummy detail fields
    tools: [], key_points: [], mentors: [], skills: [], benefits: [],
    group_link: "https://www.whatsapp.com/",  //whatsapp group link
    created_at: '2024-02-01 09:00:00'
  },
];