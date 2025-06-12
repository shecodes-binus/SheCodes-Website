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
  LogOut,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Import the new components
import { DisplayProjects } from '@/components/portfolio/display-projects';
import { PublishProjectForm } from '@/components/portfolio/publish-project-form';
import { EditProjectForm } from '@/components/portfolio/edit-project-form'; // Import Edit Form

// Import dummy data and type
import { dummyProjects } from '@/data/dummyPortfolio';
import type { PortfolioProject } from '@/types/portfolio';
import { useAuth } from '@/contexts/AuthContext';
import apiService from '@/lib/apiService';
import toast from 'react-hot-toast';
import { Dialog } from '@/components/ui/dialog';
import { DeleteConfirmationModal } from '@/components/delete-confirmation-modal';

// --- Sidebar Component (Reuse or adapt) ---
const SidebarNav = () => {
    const activePath = '/app/portfolio'; // Set active path for this page
    const { logout } = useAuth();

    const navItems = [
        { href: '/app/dashboard', label: 'Dashboard', icon: LayoutGrid },
        { href: '/app/my-activity', label: 'My Activities', icon: ListChecks },
        { href: '/app/portfolio', label: 'Portfolio', icon: Briefcase },
        { href: '/app/settings', label: 'Settings', icon: Settings }, // Use aliased icon
    ];

    const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        logout(); // Call the logout function from context
    };

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
            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className={cn(
                    "flex items-center gap-4 rounded-lg text-red-500 transition-colors hover:bg-red-100/50 hover:text-red-700 px-6 py-3 w-full text-left"
                )}
            >
                <LogOut className="h-5 w-5" />
                <span className='font-semibold text-lg'>Log Out</span>
            </button>
        </nav>
    );
};


// --- Main Page Component ---
export default function MyPortfolioPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();

    // State for view management
    const [viewMode, setViewMode] = React.useState<'display' | 'publish' | 'edit'>('display');
    const [editingProject, setEditingProject] = React.useState<PortfolioProject | null>(null);

    // State for data and loading
    const [userProjects, setUserProjects] = React.useState<PortfolioProject[]>([]);
    const [loading, setLoading] = React.useState(true);
    
    // State for delete confirmation
    const [isDeleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const [deletingProject, setDeletingProject] = React.useState<PortfolioProject | null>(null);

    const fetchProjects = async () => {
        if (!loading) setLoading(true); // Show loader when re-fetching
        try {
            const response = await apiService.get<PortfolioProject[]>('/portfolio/me');
            setUserProjects(response.data);
        } catch (error) {
            console.error("Failed to fetch projects:", error);
            toast.error("Could not load your portfolio projects.");
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (isAuthenticated) {
            fetchProjects();
        }
    }, [isAuthenticated]);

    const handleSuccess = () => {
        fetchProjects(); // Refresh the project list
        setViewMode('display'); // Go back to the main display
        setEditingProject(null); // Clear any selected project
    };

    const handleCancel = () => {
        setViewMode('display');
        setEditingProject(null);
    };

    const handlePublishClick = () => {
        setEditingProject(null);
        setViewMode('publish');
    };

    const handleEditClick = (projectToEdit: PortfolioProject) => {
        setEditingProject(projectToEdit);
        setViewMode('edit');
    };
    
    const handleDeleteClick = (projectToDelete: PortfolioProject) => {
        setDeletingProject(projectToDelete);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingProject) return;
        const toastId = toast.loading("Deleting project...");
        try {
            await apiService.delete(`/portfolio/${deletingProject.id}`);
            toast.success("Project deleted successfully.", { id: toastId });
            setDeleteModalOpen(false);
            setDeletingProject(null);
            fetchProjects(); // Re-fetch projects to update the list
        } catch (error) {
            console.error("Failed to delete project:", error);
            toast.error("Failed to delete project.", { id: toastId });
        }
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
        {loading ? (
                <div className="flex items-center justify-center pt-20">
                    <Loader2 className="h-10 w-10 animate-spin text-blueSky" />
                </div>
            ) : (
                <>
                    {viewMode === 'display' && (
                        <DisplayProjects
                            projects={userProjects}
                            onPublishClick={handlePublishClick}
                            onEditClick={handleEditClick}
                            onDeleteClick={handleDeleteClick} // Pass delete handler
                        />
                    )}
                    {viewMode === 'publish' && (
                        <PublishProjectForm
                            onCancel={handleCancel}
                            onSuccess={handleSuccess} // Pass success handler
                        />
                    )}
                    {viewMode === 'edit' && editingProject && (
                        <EditProjectForm
                            project={editingProject}
                            onCancel={handleCancel}
                            onSuccess={handleSuccess} // Pass success handler
                        />
                    )}
                </>
            )}
      </main>

      <Dialog open={isDeleteModalOpen} onOpenChange={setDeleteModalOpen}>
            <DeleteConfirmationModal
                itemCount={1}
                itemName="project"
                onConfirm={confirmDelete}
                onClose={() => setDeleteModalOpen(false)}
            />
        </Dialog>
    </div>
  );
}