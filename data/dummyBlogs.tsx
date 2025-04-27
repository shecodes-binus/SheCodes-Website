// src/data/dummyBlogData.ts
import type { BlogArticle } from '@/types/blog'; // Adjust path if needed

export const dummyArticles: BlogArticle[] = [
  {
    id: "ai-in-healthcare",
    title: "The Rise of AI in Healthcare: Opportunities for Women in Tech",
    description: "How artificial intelligence is transforming healthcare and creating new career paths for women in technology.",
    category: "Tech Trends",
    date: "April 10, 2025",
    authorName: "Jane Doe",
    authorInitials: "JD",
    imageSrc: "/photo1.png",
    link: "/blog/ai-in-healthcare",
  },
  {
    id: "tech-interviews-guide",
    title: "Navigating Tech Interviews: A Guide for Women",
    description: "Practical tips and strategies for women to confidently tackle technical interviews and showcase their skills.",
    category: "Career Growth",
    date: "April 5, 2025",
    authorName: "Maria Patel",
    authorInitials: "MP",
    imageSrc: "/photo1.png",
    link: "/blog/tech-interviews-guide",
  },
  {
    id: "building-tech-community",
    title: "Building a Supportive Tech Community: Lessons from SheCodes",
    description: "How SheCodes has created a thriving community for women in tech and the impact it's making.",
    category: "Community",
    date: "March 28, 2025",
    authorName: "Aisha Lee",
    authorInitials: "AL",
    imageSrc: "/photo1.png",
    link: "/blog/building-tech-community",
  },
  { // --- MODIFIED 4th Article ---
    id: "recap-annual-conference", // Changed ID
    title: "Recap: SheCodes Annual Tech Conference 2025", // Changed Title
    description: "Highlights from our biggest event of the year, featuring keynote speakers, workshops, and networking.", // Changed Description
    category: "Events", // Changed Category
    date: "March 20, 2025",
    authorName: "Chloe Kim",
    authorInitials: "CK",
    imageSrc: "/photo1.png",
    link: "/blog", // Changed Link
  },
  { // --- MODIFIED 5th Article ---
    id: "sarah-journey-to-pm", // Changed ID
    title: "From Code to Product: Sarah's Journey to Product Management", // Changed Title
    description: "Read about how Sarah leveraged her SheCodes experience to transition into a Product Manager role.", // Changed Description
    category: "Success Stories", // Changed Category
    date: "March 15, 2025",
    authorName: "Priya Sharma", // Author could be someone writing *about* Sarah
    authorInitials: "PS",
    imageSrc: "/photo1.png",
    link: "/blog/sarah-journey-to-pm", // Changed Link
  },
   { // --- MODIFIED 6th Article ---
    id: "imposter-syndrome-tech", // Changed ID
    title: "Overcoming Imposter Syndrome in the Tech Industry", // Changed Title
    description: "Common feelings and practical strategies to build confidence and recognize your achievements in tech.", // Changed Description
    category: "Other", // Changed Category
    date: "March 10, 2025",
    authorName: "Fatima Ahmed",
    authorInitials: "FA",
    imageSrc: "/photo1.png",
    link: "/blog/imposter-syndrome-tech", // Changed Link
  },
  {
    id: "mentorship-impact",
    title: "The Power of Mentorship in Tech Careers",
    description: "Real stories highlighting how mentorship programs have accelerated careers for women at SheCodes.",
    category: "Other",
    date: "March 10, 2025",
    authorName: "Fatima Ahmed",
    authorInitials: "FA",
    imageSrc: "/photo1.png",
    link: "/blog/mentorship-impact",
  },
  { 
    id: "upcoming-hackathon-may",
    title: "Announcing: SheCodes 'Innovate for Good' Hackathon!",
    description: "Join us this May for a weekend of coding, collaboration, and creating solutions for social impact. Open to all levels!",
    category: "Events",
    date: "April 15, 2025", 
    authorName: "Event Team",
    authorInitials: "ET",
    imageSrc: "/photo1.png", 
    link: "/blog",
  },
   { 
    id: "webinar-cloud-careers",
    title: "Webinar: Exploring Cloud Computing Careers for Women",
    description: "Learn about different roles in cloud computing and pathways to get started. Featuring industry experts.",
    category: "Events",
    date: "April 25, 2025", 
    authorName: "SheCodes Academy",
    authorInitials: "SA",
    imageSrc: "/photo1.png", 
    link: "/blog",
  },
];