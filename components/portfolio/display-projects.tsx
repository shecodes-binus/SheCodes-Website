// src/components/portfolio/DisplayProjects.tsx (Updates)

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// Removed MoreHorizontal, Added Edit icon
import { PlusCircle, Edit } from 'lucide-react';
import type { PortfolioProject } from '@/types/portfolio';
import { cn } from '@/lib/utils'; // Import cn

interface DisplayProjectsProps {
  projects: PortfolioProject[];
  onPublishClick: () => void;
  onEditClick: (project: PortfolioProject) => void; // Add prop for edit click
}

// Updated ProjectCard
const ProjectCard: React.FC<{ project: PortfolioProject; onEditClick: (project: PortfolioProject) => void }> = ({ project, onEditClick }) => {
  return (
    <Card className="bg-[#DCEFFF] border-none rounded-2xl shadow-sm overflow-hidden h-full flex flex-col group"> {/* Added group for hover effect */}
      <CardContent className="p-5 flex flex-col flex-grow relative"> {/* Added relative */}
        {/* Edit button - appears on hover */}
        <Button
            onClick={() => onEditClick(project)}
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 h-7 w-7 rounded-full bg-white/70 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-blue-600" // Style the edit button
        >
            <Edit size={16} />
            <span className="sr-only">Edit Project</span>
        </Button>

        {/* Image Area */}
        <div className="relative aspect-[4/3] w-full bg-white/50 rounded-xl mb-4 overflow-hidden">
           <Image
             src={project.imageUrl || "/projects/proj-default.png"}
             alt={project.name}
             fill
             className="object-cover"
           />
        </div>
        {/* Text Content */}
        <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.name}</h3>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{project.description}</p>
        </div>
        {/* Optional View Button */}
        {project.projectUrl && (
            <div className="mt-4">
                <Link href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="text-xs border-gray-400 text-gray-600 hover:bg-gray-200">View Project</Button>
                </Link>
            </div>
        )}
      </CardContent>
    </Card>
  );
};

// Update DisplayProjects to accept and pass onEditClick
export const DisplayProjects: React.FC<DisplayProjectsProps> = ({ projects, onPublishClick, onEditClick }) => {
  return (
    <div className='h-full flex flex-col p-10 rounded-xl shadow-md bg-white'>
       <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Your Projects</h1>
            <Button onClick={onPublishClick} className="bg-pink text-white hover:bg-pink/90 rounded-lg font-medium">
                <PlusCircle className="mr-2 h-4 w-4" /> Publish New Project
            </Button>
       </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 flex-grow">
          {projects.map((project) => (
             // Pass onEditClick down to each card
            <ProjectCard key={project.id} project={project} onEditClick={onEditClick} />
          ))}
        </div>
      ) : (
         // ... no projects message ...
         <div className="flex-grow flex items-center justify-center text-center text-gray-500">
            <p>You haven't published any projects yet. <br/> Click "Publish New Project" to add one!</p>
        </div>
      )}
    </div>
  );
};