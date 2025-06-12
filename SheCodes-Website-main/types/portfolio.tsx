export interface PortfolioProject {
  id: number;
  user_id: string; // Add this line
  name: string;
  description: string;
  image_url: string;
  project_url?: string;
}