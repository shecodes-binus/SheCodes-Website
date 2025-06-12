// src/components/portfolio/DisplayProjects.tsx (Updates)

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// Removed MoreHorizontal, Added Edit icon
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import type { PortfolioProject } from '@/types/portfolio';
import { cn } from '@/lib/utils'; // Import cn

interface DisplayProjectsProps {
  projects: PortfolioProject[];
  onPublishClick: () => void;
  onEditClick: (project: PortfolioProject) => void;
  onDeleteClick: (project: PortfolioProject) => void; // Added delete handler
}

// Updated ProjectCard
const ProjectCard: React.FC<{
  project: PortfolioProject;
  onEditClick: (project: PortfolioProject) => void;
  onDeleteClick: (project: PortfolioProject) => void; // Added delete handler
}> = ({ project, onEditClick, onDeleteClick }) => {
  return (
    <div className="border-none px-0 pb-0 overflow-hidden h-full flex flex-col group"> {/* Added group for hover effect */}
      <div className="flex flex-col flex-grow relative"> {/* Added relative */}
        {/* Edit button - appears on hover */}
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button onClick={() => onEditClick(project)} variant="ghost" size="icon" className="h-7 w-7 rounded-full bg-white/70 text-gray-600 hover:bg-white hover:text-blue-600">
                <Edit size={16} />
                <span className="sr-only">Edit Project</span>
            </Button>
            <Button onClick={() => onDeleteClick(project)} variant="ghost" size="icon" className="h-7 w-7 rounded-full bg-white/70 text-red-500 hover:bg-white hover:text-red-700">
                <Trash2 size={16} />
                <span className="sr-only">Delete Project</span>
            </Button>
        </div>

        <div className="bg-[#DCEFFF] relative aspect-[4/3] w-full bg-white/50 rounded-xl mb-4 overflow-hidden">
           <Image
             src={project.image_url || "/project.webp"} // Corrected to image_url
             alt={project.name}
             fill
             className="object-cover"
           />
        </div>
        <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.name}</h3>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{project.description}</p>
        </div>
        {project.project_url && ( // Corrected to project_url
            <div className="mt-4">
                <Link href={project.project_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="text-xs border-gray-400 text-gray-600 hover:bg-gray-200">View Project</Button>
                </Link>
            </div>
        )}
      </div>
    </div>
  );
};

export const DisplayProjects: React.FC<DisplayProjectsProps> = ({ projects, onPublishClick, onEditClick, onDeleteClick }) => {
  return (
    <div className='h-full flex-col p-10 rounded-xl shadow-md bg-white'>
       <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Your Projects</h1>
            <button onClick={onPublishClick} className=" bg-blueSky text-white hover:bg-blueSky/90 text-md px-8 py-4 rounded-xl flex items-center gap-2">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Portfolio
            </button>
       </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onEditClick={onEditClick} onDeleteClick={onDeleteClick} />
          ))}
        </div>
      ) : (
         <div className="flex-grow flex items-center justify-center text-center text-gray-500">
            <p>You haven't published any projects yet. <br/> Click "Publish New Project" to add one!</p>
        </div>
      )}
    </div>
  );
};