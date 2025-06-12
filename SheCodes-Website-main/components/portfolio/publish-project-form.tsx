'use client'; // Needs to be a client component if handling form state/submission

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react'; // Icon for cancel/close
import toast from 'react-hot-toast';
import apiService from '@/lib/apiService';

interface PublishProjectFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export const PublishProjectForm: React.FC<PublishProjectFormProps> = ({ onCancel, onSuccess }) => {
  const [name, setName] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!imageFile) {
        toast.error("Please upload a project image.");
        return;
    }
    
    setIsPublishing(true);
    const toastId = toast.loading("Publishing project...");

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('image', imageFile);
    if (projectUrl) {
        formData.append('projectUrl', projectUrl); // Use correct key for backend
    }

    try {
        await apiService.post('/portfolio/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success("Project published successfully!", { id: toastId });
        onSuccess(); // Call success handler from parent
    } catch (error) {
        console.error("Failed to publish project:", error);
        toast.error("Failed to publish project. Please try again.", { id: toastId });
    } finally {
        setIsPublishing(false);
    }
  };

  return (
    <div className='flex flex-col p-10 rounded-xl shadow-md bg-white'>
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Publish Your Project</h1>
            <Button onClick={onCancel} variant="ghost" size="icon" className="text-gray-500 hover:text-gray-800">
                <X className="h-5 w-5" />
                <span className='sr-only'>Cancel Publish</span>
            </Button>
        </div>

        <form onSubmit={handleSubmit}>
        <div className='flex mb-8 gap-16'>
          <div className='flex min-w-[350px] items-top justify-start max-h-[400px] border-[1.5px] border-blueSky rounded-2xl p-10'>
            <div className='bg-blueSky/25 rounded-2xl w-full h-full flex flex-col items-center justify-center text-center space-y-4 p-6'>
              <label className="relative w-full h-full hover:opacity-80 transition-opacity cursor-pointer flex flex-col items-center justify-center">
                {previewUrl ? (
                    <Image src={previewUrl} alt="Project Preview" fill className="object-cover rounded-xl"/>
                ) : (
                    <Image src="/uploadimage.svg" alt="Upload placeholder" width={100} height={100} className="object-contain"/>
                )}
                <input type="file" id="projectImage" accept="image/png, image/jpeg, image/gif" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} required/>
              </label>
              <h3 className="text-base font-semibold text-gray-800 mt-4">{previewUrl ? 'Change Image' : 'Upload Image'}</h3>
            </div>
          </div>
          <div className="flex-1 rounded-3xl flex items-start justify-center">
            <div className="w-full flex flex-col space-y-4 md:space-y-6">
              <div>
                <label htmlFor="projectName" className="block text-base font-semibold text-black mb-2">Project Name</label>
                <input type="text" id="projectName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter the name of your project" required className="w-full px-4 py-2.5 rounded-xl border border-[#BFBFBF] focus:outline-none focus:ring-1 focus:ring-pink placeholder-grey-2 bg-white"/>
              </div>
              <div>
                <label htmlFor="projectUrl" className="block text-base font-semibold text-black mb-2">Project URL</label>
                <input type="text" id="projectUrl" value={projectUrl} onChange={(e) => setProjectUrl(e.target.value)} placeholder="https://github.com/your-repo" className="w-full px-4 py-2.5 rounded-xl border border-[#BFBFBF] focus:outline-none focus:ring-1 focus:ring-pink placeholder-grey-2 bg-white"/>
              </div>
              <div className="flex flex-col flex-grow">
                <label htmlFor="projectDescription" className="block text-base font-semibold text-black mb-2">Project Description</label>
                <textarea id="projectDescription" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter your project description" required className="w-full px-4 py-2.5 rounded-xl border border-[#BFBFBF] focus:outline-none focus:ring-1 focus:ring-pink placeholder-grey-2 bg-white" rows={10}/>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <Button type="submit" className="bg-blueSky text-white px-12 py-6 rounded-xl hover:bg-blueSky/80 text-base" disabled={isPublishing}>
            {isPublishing ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </form>
    </div>
  );
};