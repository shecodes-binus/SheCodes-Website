// src/types/blog.ts
export type ArticleCategory = 'Tech & Innovation' | 'Career Growth' | 'Community' | 'Event' | 'Success Stories' | 'Others';

export interface BlogArticle {
  id: number;
  title: string;
  slug: string; // URL-friendly identifier
  excerpt: string; // Short summary
  content: string; // The full article content (HTML or Markdown)
  featuredImageUrl: string;
  category: ArticleCategory;
  authorName: string;
  authorAvatarUrl: string; 
  publishedAt: string | Date; 
  viewCount: number;
  likeCount: number;
  createdAt: string | Date; 
  updatedAt: string | Date; 
}