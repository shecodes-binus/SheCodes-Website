export type ArticleCategory = 
  'Tech & Innovation' | 
  'Career Growth' | 
  'Community' | 
  'Event' | 
  'Success Stories' | 
  'Others';

export interface BlogArticle {
  id: number;
  title: string;
  slug: string; // URL-friendly identifier
  excerpt: string; // Short summary
  sections: string[];
  featured_image_url: string;
  category: ArticleCategory;
  author_name: string;
  author_avatar_url: string;
  published_at: string;
  view_count: number;
  like_count: number;
  created_at: string;
  updated_at: string;
}