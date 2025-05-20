// src/types/blog.ts
export type ArticleCategory = 'Tech & Innovation' | 'Career Growth' | 'Community' | 'Event' | 'Success Stories' | 'Others';

export interface BlogArticle {
  id: number;
  title: string;
  slug: string; // URL-friendly identifier
  excerpt: string; // Short summary
  sections: string[];
  featuredImageUrl: string;
  category: ArticleCategory;
  authorName: string;
  authorAvatarUrl: string; 
  publishedAt: string; 
  viewCount: number;
  likeCount: number;
  createdAt: string; 
  updatedAt: string; 
}