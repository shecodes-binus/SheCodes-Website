// src/data/dummyBlogData.ts
import type { BlogArticle, ArticleCategory } from '@/types/blog'; // Adjust path if needed

export const dummyArticles: BlogArticle[] = [
  {
    id: 1, // Changed from string to number
    title: "The Rise of AI in Healthcare: Opportunities for Women in Tech",
    slug: "ai-in-healthcare", // Using original ID as slug
    excerpt: "How artificial intelligence is transforming healthcare and creating new career paths for women in technology.", // Changed from description
    content: "Full article content detailing how artificial intelligence is transforming healthcare and creating new career paths for women in technology. Discusses ethical considerations, required skills, and future trends.", // Added placeholder content
    featuredImageUrl: "/documentation/documentation1.JPG", // Changed from imageSrc
    category: "Tech & Innovation",
    authorName: "Jane Doe",
    authorAvatarUrl: "/logonotext.svg", // Added field with specific value
    publishedAt: "2025-04-10T10:00:00Z", // Changed from datetime
    viewCount: 258, // Added dummy data
    likeCount: 45, // Added dummy data
    createdAt: "2025-04-10T09:55:00Z", // Added dummy data (slightly before publish)
    updatedAt: "2025-04-10T10:00:00Z", // Added dummy data (same as publish)
  },
  {
    id: 2,
    title: "Navigating Tech Interviews: A Guide for Women",
    slug: "tech-interviews-guide",
    excerpt: "Practical tips and strategies for women to confidently tackle technical interviews and showcase their skills.",
    content: "Comprehensive guide covering resume building, common technical questions, behavioral interviews, negotiation strategies, and resources specifically for women navigating the tech interview process.",
    featuredImageUrl: "/documentation/documentation3.JPG",
    category: "Career Growth",
    authorName: "Maria Patel",
    authorAvatarUrl: "/logonotext.svg",
    publishedAt: "2025-04-05T14:00:00Z",
    viewCount: 412,
    likeCount: 88,
    createdAt: "2025-04-05T13:50:00Z",
    updatedAt: "2025-04-05T14:00:00Z",
  },
  {
    id: 3,
    title: "Building a Supportive Tech Community: Lessons from SheCodes",
    slug: "building-tech-community",
    excerpt: "How SheCodes has created a thriving community for women in tech and the impact it's making.",
    content: "An exploration of the strategies used by SheCodes to foster an inclusive and supportive environment. Includes member testimonials, discussion of online and offline events, and the role of mentorship within the community.",
    featuredImageUrl: "/documentation/documentation5.JPeG", // Corrected extension typo if needed
    category: "Community",
    authorName: "Aisha Lee",
    authorAvatarUrl: "/logonotext.svg",
    publishedAt: "2025-03-28T09:30:00Z",
    viewCount: 189,
    likeCount: 35,
    createdAt: "2025-03-28T09:25:00Z",
    updatedAt: "2025-03-28T09:30:00Z",
  },
  {
    id: 4,
    title: "Recap: SheCodes Annual Tech Conference 2025",
    slug: "recap-annual-conference", // Using original ID as slug
    excerpt: "Highlights from our biggest event of the year, featuring keynote speakers, workshops, and networking.",
    content: "Detailed summary of the SheCodes Annual Tech Conference 2025. Includes summaries of keynotes, descriptions of popular workshops, photos from the event, and feedback from attendees.",
    featuredImageUrl: "/documentation/documentation2.JPG",
    category: "Event",
    authorName: "Chloe Kim",
    authorAvatarUrl: "/logonotext.svg",
    publishedAt: "2025-03-20T11:00:00Z",
    viewCount: 530,
    likeCount: 112,
    createdAt: "2025-03-20T10:58:00Z",
    updatedAt: "2025-03-20T11:00:00Z",
  },
  {
    id: 5,
    title: "From Code to Product: Sarah's Journey to Product Management",
    slug: "sarah-journey-to-pm",
    excerpt: "Read about how Sarah leveraged her SheCodes experience to transition into a Product Manager role.",
    content: "An inspiring success story detailing Sarah's background, her experience learning with SheCodes, the challenges she faced, and the steps she took to successfully transition into product management in the tech industry.",
    featuredImageUrl: "/photo1.png",
    category: "Success Stories",
    authorName: "Priya Sharma",
    authorAvatarUrl: "/logonotext.svg",
    publishedAt: "2025-03-15T13:00:00Z",
    viewCount: 680,
    likeCount: 150,
    createdAt: "2025-03-15T12:45:00Z",
    updatedAt: "2025-03-15T13:00:00Z",
  },
  {
    id: 6,
    title: "Overcoming Imposter Syndrome in the Tech Industry",
    slug: "imposter-syndrome-tech",
    excerpt: "Common feelings and practical strategies to build confidence and recognize your achievements in tech.",
    content: "A look into the phenomenon of imposter syndrome, particularly prevalent in tech. Discusses its causes, symptoms, and provides actionable advice and techniques for building self-confidence.",
    featuredImageUrl: "/documentation/documentation3.JPG",
    category: "Others",
    authorName: "Fatima Ahmed",
    authorAvatarUrl: "/logonotext.svg",
    publishedAt: "2025-03-10T15:30:00Z",
    viewCount: 315,
    likeCount: 65,
    createdAt: "2025-03-10T15:20:00Z",
    updatedAt: "2025-03-10T15:30:00Z",
  },
  {
    id: 7,
    title: "The Power of Mentorship in Tech Careers",
    slug: "mentorship-impact",
    excerpt: "Real stories highlighting how mentorship programs have accelerated careers for women at SheCodes.",
    content: "Explores the benefits of mentorship through personal anecdotes from SheCodes members (mentor and mentee perspectives). Discusses how to find a mentor and make the most of the relationship.",
    featuredImageUrl: "/photo1.png",
    category: "Others", // Kept as Others based on original
    authorName: "Fatima Ahmed", // Same author as previous, kept for consistency
    authorAvatarUrl: "/logonotext.svg",
    publishedAt: "2025-03-10T16:00:00Z", // Slightly later than previous 'Others' post
    viewCount: 290,
    likeCount: 58,
    createdAt: "2025-03-10T15:55:00Z",
    updatedAt: "2025-03-10T16:00:00Z",
  },
  {
    id: 8,
    title: "Announcing: SheCodes 'Innovate for Good' Hackathon!",
    slug: "upcoming-hackathon-may",
    excerpt: "Join us this May for a weekend of coding, collaboration, and creating solutions for social impact. Open to all levels!",
    content: "Official announcement for the 'Innovate for Good' Hackathon. Includes details on the theme, schedule, judges, prizes, registration link, and eligibility criteria. Encourages participation from all skill levels.",
    featuredImageUrl: "/documentation/grandlaunchingphoto.JPG",
    category: "Event",
    authorName: "Event Team",
    authorAvatarUrl: "/logonotext.svg",
    publishedAt: "2025-04-15T08:00:00Z",
    viewCount: 450,
    likeCount: 95,
    createdAt: "2025-04-15T07:50:00Z",
    updatedAt: "2025-04-15T08:00:00Z",
  },
  {
    id: 9,
    title: "Webinar: Exploring Cloud Computing Careers for Women",
    slug: "webinar-cloud-careers",
    excerpt: "Learn about different roles in cloud computing and pathways to get started. Featuring industry experts.",
    content: "Details about the upcoming webinar on cloud computing careers. Covers the topics, introduces the guest speakers (industry experts), provides date/time information, and includes the registration link.",
    featuredImageUrl: "/documentation/documentation4.JPeG", // Corrected extension typo if needed
    category: "Event",
    authorName: "SheCodes Academy",
    authorAvatarUrl: "/logonotext.svg",
    publishedAt: "2025-04-25T18:00:00Z",
    viewCount: 210,
    likeCount: 40,
    createdAt: "2025-04-25T17:55:00Z",
    updatedAt: "2025-04-25T18:00:00Z",
  },
];