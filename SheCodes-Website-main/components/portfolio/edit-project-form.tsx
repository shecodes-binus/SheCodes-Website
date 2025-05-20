'use client'; // Needs to be a client component for form state

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react'; // Icon for cancel/close
import type { PortfolioProject } from '@/types/portfolio'; // Adjust path

interface EditProjectFormProps {
  project: PortfolioProject; // Project data to edit
  onCancel: () => void;      // Function to switch back to display view
  onSave: (updatedProject: PortfolioProject) => Promise<void>; // Function to handle saving changes
}

export const EditProjectForm: React.FC<EditProjectFormProps> = ({ project, onCancel, onSave }) => {
  // State for editable fields, initialized with project data
  const [projectName, setProjectName] = useState(project.name);
  const [projectUrl, setProjectUrl] = useState(project.projectUrl);
  const [projectDescription, setProjectDescription] = useState(project.description);
  // Add state for image file if implementing upload later
  // const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Update state if the project prop changes (e.g., user edits another project)
  useEffect(() => {
    setProjectName(project.name);
    setProjectDescription(project.description);
    setProjectUrl(project.projectUrl);
  }, [project]);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    console.log("Saving project changes...");

    const updatedProjectData: PortfolioProject = {
      ...project, // Keep original id and other fields
      name: projectName,
      description: projectDescription,
      // Include updated imageUrl if implementing upload
    };

    try {
      await onSave(updatedProjectData);
      // onSave should handle navigation/state change back to display view on success
    } catch (error) {
      console.error("Failed to save project:", error);
      // Handle error display if needed
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='flex flex-col  p-10 rounded-xl shadow-md bg-white'>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Edit Your Project</h1>
        <Button onClick={onCancel} variant="ghost" size="icon" className="text-gray-500 hover:text-gray-800" disabled={isSaving}>
          <X className="h-5 w-5" />
          <span className='sr-only'>Cancel Edit</span>
        </Button>
      </div>

      {/* Use grid for layout matching the image */}
      <form onSubmit={handleSave} className="flex mb-8 gap-16">
        <div className='flex min-w-[350px] items-top justify-start max-h-[400px] border-[1.5px] border-blueSky rounded-2xl p-10'>
          <div className='bg-blueSky/25 rounded-2xl  w-full h-full  flex flex-col items-center justify-center text-center space-y-4 p-6'>
             {/* Display current image or placeholder */}
             <div className="relative aspect-[4/3] w-4/5 bg-white/50 rounded-xl mb-4 overflow-hidden">
                <Image
                  src={project.imageUrl || "/projects/proj-default.png"}
                  alt={project.name}
                  fill
                  className="object-cover"
                />
              </div>
              <label htmlFor="uploadImage" className="cursor-pointer inline-block">
                <span className="text-sm font-medium text-blue-600 hover:text-blue-800 underline">
                  Upload Image
                </span>
                <input
                  type="file"
                  id="uploadImage"
                  accept="image/png, image/jpeg, image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      console.log("Uploaded file:", file);
                      // Handle preview or upload logic here
                    }
                  }}
                />
              </label>
             <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
             {/* Hidden file input needed for actual upload */}
           </div>
        </div>

        {/* Right: Form Fields */}
        <div className="flex-1 rounded-3xl flex items-start justify-center">
          <div className='w-full flex flex-col space-y-4 md:space-y-6'>
            <div>
              <label htmlFor="projectName" className="block text-base font-semibold text-black mb-2">
                Project Name
              </label>
              <input
                type="text"
                id="editProjectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Project name"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#BFBFBF] focus:outline-none focus:ring-1 focus:ring-pink placeholder-grey-2 bg-white"
              />
            </div>

            <div>
              <label htmlFor="editProjectURL" className="block text-base font-semibold text-black mb-2">
                Project URL
              </label>
              <input
                type="text"
                id="editProjectURL"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                placeholder="Project Url"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#BFBFBF] focus:outline-none focus:ring-1 focus:ring-pink placeholder-grey-2 bg-white"
              />
            </div>
            

            {/* Make textarea expand */}
            <div className="flex flex-col flex-grow">
              <label htmlFor="editProjectDescription" className="block text-base font-semibold text-black mb-2">
                Project Description
              </label>
              <textarea
                id="editProjectDescription"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Project description"
                required
                rows={10}
                className="w-full px-4 py-2.5 rounded-xl border border-[#BFBFBF] focus:outline-none focus:ring-1 focus:ring-pink placeholder-grey-2 bg-white"
              ></textarea>
            </div>
          </div>

          {/* Save Button moved here */}
           
        </div>
      </form>
      <div className="flex justify-center pt-2">
          <Button type="submit" disabled={isSaving} className="bg-blueSky text-white px-12 py-6 rounded-xl hover:bg-blueSky/80  text-base">
              {isSaving ? 'Saving...' : 'Save'}
          </Button>
      </div>
    </div>
  );
};