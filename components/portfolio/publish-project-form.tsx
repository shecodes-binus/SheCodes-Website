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
    <div className='flex flex-col p-10 rounded-xl shadow-md bg-white'>
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Publish Your Project</h1>
            <Button onClick={onCancel} variant="ghost" size="icon" className="text-gray-500 hover:text-gray-800">
                <X className="h-5 w-5" />
                <span className='sr-only'>Cancel Publish</span>
            </Button>
        </div>

        <div className='flex mb-8 gap-16'>
            <div className='flex min-w-[350px] items-top justify-start max-h-[400px] border-[1.5px] border-blueSky rounded-2xl p-10'>
                <div className='bg-blueSky/25 rounded-2xl  w-full h-full  flex flex-col items-center justify-center text-center space-y-4 p-6'>
                    <label className="relative w-[100px] h-[100px] hover:opacity-80 transition-opacity cursor-pointer">
                    <Image
                        src="/uploadimage.svg"
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
                        }
                        }}
                    />
                    </label>
                    <h3 className="text-base font-semibold text-gray-800">Upload Image</h3>
                </div>
            </div>
            {/* </div> */}

            {/* Form Fields */}
            <div className="flex-1 rounded-3xl flex items-start justify-center">
                <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-4 md:space-y-6">
                    <div>
                        <label htmlFor="projectName" className="block text-base font-semibold text-black mb-2">
                        Project Name
                        </label>
                        <input
                            type="text"
                            id="projectName"
                            placeholder="Enter the name of your project"
                            required
                            className="w-full px-4 py-2.5 rounded-xl border border-[#BFBFBF] focus:outline-none focus:ring-1 focus:ring-pink placeholder-grey-2 bg-white"
                        />
                    </div>
                    
                    {/* Project name */}
                    <div>
                        <label htmlFor="projectName" className="block text-base font-semibold text-black mb-2">
                        Project URL
                        </label>
                        <input
                        type="text"
                        id="projectName"
                        placeholder="Enter the url of your project"
                        // required
                        className="w-full px-4 py-2.5 rounded-xl border border-[#BFBFBF] focus:outline-none focus:ring-1 focus:ring-pink placeholder-grey-2 bg-white"
                        />
                    </div>

                    {/* Make textarea expand */}
                    <div className="flex flex-col flex-grow">
                        <label htmlFor="projectDescription" className="block text-base font-semibold text-black mb-2">
                        Project Description
                        </label>
                        <textarea
                        id="projectDescription"
                        placeholder="Enter your project description"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-[#BFBFBF] focus:outline-none focus:ring-1 focus:ring-pink placeholder-grey-2 bg-white"
                        rows={10}
                        />
                    </div>
                </form>
            </div>
        </div>

        <div className="flex justify-center">
            <Button type="submit" className="bg-blueSky text-white px-12 py-6 rounded-xl hover:bg-blueSky/80  text-base">
                Publish
            </Button>
        </div>
    </div>
  );
};