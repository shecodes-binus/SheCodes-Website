export interface PortfolioProject {
    id: number | string;
    name: string;
    description: string;
    imageUrl: string; // Path to project image in /public
    projectUrl?: string; // Optional link to live project or repo
  }