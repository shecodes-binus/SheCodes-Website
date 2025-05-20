import type { PortfolioProject } from '@/types/portfolio'; // Adjust path

export const dummyProjects: PortfolioProject[] = [
  {
    id: 1,
    name: "E-commerce Website",
    description: "A full-stack e-commerce platform built with Next.js and Stripe integration. Features product listings, cart, and checkout.",
    imageUrl: "/project.webp", // <<< Replace with actual image paths
    projectUrl: "#"
  },
  {
    id: 2,
    name: "Data Visualization Dashboard",
    description: "Interactive dashboard displaying complex datasets using D3.js and React, providing insights through charts and graphs.",
    imageUrl: "/project.webp", // <<< Replace with actual image paths
    projectUrl: "#"
  },
  {
    id: 3,
    name: "Mobile Recipe App",
    description: "A React Native application allowing users to browse, save, and share recipes, with offline access.",
    imageUrl: "/project.webp", // <<< Replace with actual image paths
  },
   {
    id: 4,
    name: "Community Forum",
    description: "A forum built with Node.js and Express, featuring user authentication, posts, comments, and categories.",
    imageUrl: "/project.webp",
    projectUrl: "#"
  },
];