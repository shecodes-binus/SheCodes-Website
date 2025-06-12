import type { PortfolioProject } from '@/types/portfolio'; // Adjust path

export const dummyProjects: PortfolioProject[] = [
  {
    id: 1,
    user_id: "1", // Added
    name: "E-commerce Website",
    description: "A full-stack e-commerce platform built with Next.js and Stripe integration. Features product listings, cart, and checkout.",
    image_url: "/project.webp",
    project_url: "#"
  },
  {
    id: 2,
    user_id: "1", // Added
    name: "Data Visualization Dashboard",
    description: "Interactive dashboard displaying complex datasets using D3.js and React, providing insights through charts and graphs.",
    image_url: "/project.webp",
    project_url: "#"
  },
  {
    id: 3,
    user_id: "2", // Added
    name: "Mobile Recipe App",
    description: "A React Native application allowing users to browse, save, and share recipes, with offline access.",
    image_url: "/project.webp",
  },
   {
    id: 4,
    user_id: "2", // Added
    name: "Community Forum",
    description: "A forum built with Node.js and Express, featuring user authentication, posts, comments, and categories.",
    image_url: "/project.webp",
    project_url: "#"
  },
];