'use client'; // Needs to be a client component for form state

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { PortfolioProject } from '@/types/portfolio';
import apiService from '@/lib/apiService';
import toast from 'react-hot-toast';

interface EditProjectFormProps {
  project: PortfolioProject;
  onCancel: () => void;
  onSuccess: () => void;
}

export const EditProjectForm: React.FC<EditProjectFormProps> = ({ project, onCancel, onSuccess }) => {
  const [name, setName] = useState(project.name);
  const [projectUrl, setProjectUrl] = useState(project.project_url || '');
  const [description, setDescription] = useState(project.description);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(project.image_url);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setName(project.name);
    setDescription(project.description);
    setProjectUrl(project.project_url || '');
    setPreviewUrl(project.image_url);
    setImageFile(null); // Reset file on new project
  }, [project]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    const toastId = toast.loading("Saving changes...");

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (projectUrl) {
        formData.append('projectUrl', projectUrl);
    }
    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
      await apiService.put(`/portfolio/update/${project.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success("Project updated successfully!", { id: toastId });
      onSuccess();
    } catch (error) {
      console.error("Failed to save project:", error);
      toast.error("Failed to save changes.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='flex flex-col p-10 rounded-xl shadow-md bg-white'>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Edit Your Project</h1>
        <Button onClick={onCancel} variant="ghost" size="icon" className="text-gray-500 hover:text-gray-800" disabled={isSaving}>
          <X className="h-5 w-5" />
          <span className='sr-only'>Cancel Edit</span>
        </Button>
      </div>
      <form onSubmit={handleSave}>
        <div className="flex mb-8 gap-16">
          <div className='flex min-w-[350px] items-top justify-start max-h-[400px] border-[1.5px] border-blueSky rounded-2xl p-10'>
            <div className='bg-blueSky/25 rounded-2xl w-full h-full flex flex-col items-center justify-center text-center space-y-4 p-6'>
              <div className="relative aspect-[4/3] w-full bg-white/50 rounded-xl mb-4 overflow-hidden">
                <Image
                  src={previewUrl || "/project.webp"}
                  alt={project.name}
                  fill
                  className="object-cover"
                />
              </div>
              <label htmlFor="uploadImage" className="cursor-pointer inline-block">
                <span className="text-sm font-medium text-blue-600 hover:text-blue-800 underline">
                  Change Image
                </span>
                <input type="file" id="uploadImage" accept="image/png, image/jpeg, image/gif" className="hidden" onChange={handleFileChange} />
              </label>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
            </div>
          </div>
          <div className="flex-1 rounded-3xl flex items-start justify-center">
            <div className='w-full flex flex-col space-y-4 md:space-y-6'>
              <div>
                <label htmlFor="editProjectName" className="block text-base font-semibold text-black mb-2">Project Name</label>
                <input type="text" id="editProjectName" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2.5 rounded-xl border border-[#BFBFBF] focus:outline-none focus:ring-1 focus:ring-pink placeholder-grey-2 bg-white"/>
              </div>
              <div>
                <label htmlFor="editProjectURL" className="block text-base font-semibold text-black mb-2">Project URL</label>
                <input type="text" id="editProjectURL" value={projectUrl} onChange={(e) => setProjectUrl(e.target.value)} placeholder="https://github.com/your-repo" className="w-full px-4 py-2.5 rounded-xl border border-[#BFBFBF] focus:outline-none focus:ring-1 focus:ring-pink placeholder-grey-2 bg-white"/>
              </div>
              <div className="flex flex-col flex-grow">
                <label htmlFor="editProjectDescription" className="block text-base font-semibold text-black mb-2">Project Description</label>
                <textarea id="editProjectDescription" value={description} onChange={(e) => setDescription(e.target.value)} required rows={10} className="w-full px-4 py-2.5 rounded-xl border border-[#BFBFBF] focus:outline-none focus:ring-1 focus:ring-pink placeholder-grey-2 bg-white"></textarea>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center pt-2">
          <Button type="submit" disabled={isSaving} className="bg-blueSky text-white px-12 py-6 rounded-xl hover:bg-blueSky/80 text-base">
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};