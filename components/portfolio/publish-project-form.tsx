'use client'; // Needs to be a client component if handling form state/submission

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react'; // Icon for cancel/close

interface PublishProjectFormProps {
  onCancel: () => void; // Function to switch back to display view
  // Add onSubmit prop later for actual submission logic
  // onSubmit: (formData: FormData) => Promise<void>;
}

export const PublishProjectForm: React.FC<PublishProjectFormProps> = ({ onCancel }) => {

  // Add state management for form inputs here later using useState

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      console.log("Submitting project...");
      // 1. Gather form data (from state)
      // 2. Call onSubmit prop (pass data)
      // 3. Handle success/error
      // 4. Optionally call onCancel on success
  }

  return (
    <div className='h-full flex flex-col  p-10 rounded-xl shadow-md bg-white'>
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Publish Your Project</h1>
            <Button onClick={onCancel} variant="ghost" size="icon" className="text-gray-500 hover:text-gray-800">
                <X className="h-5 w-5" />
                <span className='sr-only'>Cancel Publish</span>
            </Button>
        </div>

        <div className='flex gap-5 flex-grow overflow-hidden'> {/* flex-grow + overflow needed */}
            {/* Upload Area */}
            <div className='flex-1 bg-[#7AADEB]/50 rounded-3xl flex items-center justify-center p-6'>
                <div className='bg-white/60 border border-dashed border-blue-400 rounded-3xl w-full h-full flex flex-col items-center justify-center text-center space-y-4 p-4'>
                {/* Replace button with actual file input logic later */}
                <label className="w-1/2 h-1/2 relative max-w-[150px] max-h-[150px] hover:opacity-80 transition-opacity">
                    <Image
                    src="/uploadimage.svg" // Make sure this exists in /public
                    alt="Upload project image placeholder"
                    fill
                    className="object-contain"
                    />
                    <input
                        type="file"
                        id="projectImage"
                        accept="image/png, image/jpeg, image/gif"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            console.log("Selected file:", file);
                            // You can preview or upload the file here
                        }
                        }}
                    />
                </label>
                <h3 className="text-xl font-semibold text-gray-700">Upload Image</h3>
                 <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                 {/* Hidden file input to be triggered */}
                 {/* <input type="file" id="projectImage" className="hidden" /> */}
                </div>
            </div>

            {/* Form Fields */}
            <div className="flex-1 bg-[#FFD4E3] rounded-3xl flex items-center justify-center p-6 md:p-10">
                {/* Add onSubmit to form */}
                <form onSubmit={handleSubmit} className="w-full max-w-md h-full flex flex-col space-y-4 md:space-y-6">
                    <div>
                        <label htmlFor="projectName" className="block text-base font-semibold text-[#4A0D32] mb-1.5">
                        Project Name
                        </label>
                        <input
                        type="text"
                        id="projectName"
                        placeholder="Enter the name of your project"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-pink placeholder-gray-400 bg-white"
                        />
                    </div>
                    
                    {/* Project name */}
                    <div>
                        <label htmlFor="projectName" className="block text-base font-semibold text-[#4A0D32] mb-1.5">
                        Project URL
                        </label>
                        <input
                        type="text"
                        id="projectName"
                        placeholder="Enter the url of your project"
                        // required
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-pink placeholder-gray-400 bg-white"
                        />
                    </div>

                    {/* Make textarea expand */}
                    <div className="flex flex-col flex-grow">
                        <label htmlFor="projectDescription" className="block text-base font-semibold text-[#4A0D32] mb-1.5">
                        Project Description
                        </label>
                        <textarea
                        id="projectDescription"
                        placeholder="Enter your project description"
                        required
                        className="flex-grow w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-pink placeholder-gray-400 resize-none bg-white"
                        ></textarea>
                    </div>
                     {/* Publish button moved inside form */}
                     <div className="pt-2">
                        <Button type="submit" className="w-full bg-pink text-white px-8 py-3 rounded-lg hover:bg-pink/80 font-bold text-base">
                            Publish Project
                        </Button>
                    </div>
                </form>
            </div>
        </div>

        {/* Publish button outside the flex container, but inside the main flex-col */}
        {/* Moved inside form */}
        {/* <div>
            <Button className="mt-6 bg-pink text-white px-16 py-6 rounded-lg hover:bg-pink/80 font-bold">
                Publish
            </Button>
        </div> */}
    </div>
  );
};