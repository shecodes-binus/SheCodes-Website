// src/app/(app)/portfolio/page.tsx (Updates)

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  LayoutGrid,
  ListChecks,
  Briefcase,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Import the new components
import { DisplayProjects } from '@/components/portfolio/display-projects';
import { PublishProjectForm } from '@/components/portfolio/publish-project-form';
import { EditProjectForm } from '@/components/portfolio/edit-project-form'; // Import Edit Form

// Import dummy data and type
import { dummyProjects } from '@/data/dummyPortfolio';
import type { PortfolioProject } from '@/types/portfolio';

// --- Sidebar Component (Keep as is) ---
const SidebarNav = () => {
  // In a real app, determine active path from router/usePathname
  const activePath = '/app/portfolio'; // Example for this page

  const navItems = [
      { href: '/app/dashboard', label: 'Dashboard', icon: LayoutGrid },
      { href: '/app/my-activity', label: 'My Activities', icon: ListChecks },
      { href: '/app/portfolio', label: 'Portfolio', icon: Briefcase },
      { href: '/app/settings', label: 'Settings', icon: Settings },
  ];

  return (
      <nav className="flex flex-col space-y-1"> {/* Reduced space */}
        {navItems.map((item) => {
            const isActive = item.href === activePath;
            const Icon = item.icon;
            return (
                <Link
                    key={item.label}
                    href={item.href}
                    // Use light blue bg for active, gray text otherwise
                    className={cn(
                        "flex items-center gap-4 rounded-lg text-gray-500 transition-colors hover:bg-blue-100/50 hover:text-gray-900 px-6 py-3", // Adjusted padding/rounding
                        isActive && "bg-blue-200/60 text-gray-900 font-semibold hover:bg-blue-200/60 hover:text-gray-900"
                    )}
                >
                    <Icon className="h-5 w-5" />
                    <span className='font-semibold text-lg'>{item.label}</span> {/* Adjusted size/weight */}
                </Link>
            );
        })}
    </nav>
  );
};


// --- Main Page Component ---
export default function MyPortfolioPage() {
    // Add 'edit' to view mode state
    const [viewMode, setViewMode] = React.useState<'display' | 'publish' | 'edit'>('display');
    // Add state to hold the project being edited
    const [editingProject, setEditingProject] = React.useState<PortfolioProject | null>(null);

    // Fetch user's projects in a real app
    const [userProjects, setUserProjects] = React.useState<PortfolioProject[]>(dummyProjects); // Use state for projects if they can be updated

    const handlePublishClick = () => {
        setEditingProject(null); // Ensure no project is selected for edit
        setViewMode('publish');
    };

    const handleCancel = () => {
        setEditingProject(null); // Clear editing project
        setViewMode('display'); // Go back to display mode
    };

     // --- Handler for clicking edit on a project card ---
    const handleEditClick = (projectToEdit: PortfolioProject) => {
        setEditingProject(projectToEdit); // Set the project to edit
        setViewMode('edit');             // Switch to edit mode
    };

    // --- Handler for saving edited project (placeholder) ---
    const handleSaveEdit = async (updatedProject: PortfolioProject) => {
        console.log('Saving updated project:', updatedProject);
        // TODO: Implement API call to update the project in the backend
        // --- Example frontend update (replace with actual logic) ---
        setUserProjects(currentProjects =>
             currentProjects.map(p => p.id === updatedProject.id ? updatedProject : p)
        );
        // --- End Example ---
        handleCancel(); // Go back to display view after saving
    };

    // Handle actual publish submission later
    const handlePublishSubmit = async (/* formData */) => {
        console.log('Publishing new project...');
        // TODO: Implement API call to create new project
        // TODO: Update userProjects state with the new project
        handleCancel(); // Go back to display view
    };


  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden lg:block w-72 bg-white border-r border-gray-200 p-4 rounded-lg shadow-sm m-4 mt-16 self-start"> {/* Rounded, margin */}
         <div className="sticky top-4"> 
            <SidebarNav />
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 lg:py-16 lg:px-10 space-y-10">
        {/* Conditional Rendering based on viewMode */}
        {viewMode === 'display' && (
            <DisplayProjects
                projects={userProjects}
                onPublishClick={handlePublishClick}
                onEditClick={handleEditClick} // Pass edit handler down
            />
        )}
        {viewMode === 'publish' && (
            <PublishProjectForm
                onCancel={handleCancel}
                // onSubmit={handlePublishSubmit} // Pass submit handler later
             />
        )}
         {/* Add rendering for edit mode */}
         {viewMode === 'edit' && editingProject && ( // Render only if editingProject is set
            <EditProjectForm
                project={editingProject} // Pass the project to edit
                onCancel={handleCancel}
                onSave={handleSaveEdit} // Pass save handler
            />
         )}
      </main>
    </div>
  );
}