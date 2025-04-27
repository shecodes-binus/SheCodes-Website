// src/types/blog.ts
export type ArticleCategory = 'Tech Trends' | 'Career Growth' | 'Community' | 'Events' | 'Success Stories' | 'Other';

export interface BlogArticle {
  id: string; // Unique identifier, can be slug or number
  title: string;
  description: string;
  category: ArticleCategory;
  date: string; // e.g., "April 10, 2025"
  authorName: string;
  authorInitials: string; // For Avatar Fallback
  imageSrc: string; // Path to image
  link: string; // Path to the full article page
}