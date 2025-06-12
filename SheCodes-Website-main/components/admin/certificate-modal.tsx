// src/components/admin/certificate-upload-modal.tsx
'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { X as XIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface CertificateUploadModalProps {
  // Use participationId to uniquely identify the record to update
  participationId: number; 
  currentCertificateUrl?: string | null;
  onUpload: (participationId: number, file: File) => Promise<void>;
  onClose: () => void;
}

export const CertificateUploadModal: React.FC<CertificateUploadModalProps> = ({
  participationId,
  currentCertificateUrl,
  onUpload,
  onClose,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // Initialize preview with the existing certificate URL
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentCertificateUrl || null);
  const [isLoading, setIsLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed for certificates.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveClick = async () => {
    if (!selectedFile) {
      toast.error("Please select a new image file to upload.");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Uploading certificate...");
    
    try {
      await onUpload(participationId, selectedFile);
      toast.success("Certificate uploaded successfully!", { id: toastId });
    } catch (err) {
      toast.error("Upload failed. Please try again.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-md md:max-w-2xl bg-white rounded-2xl p-0 text-black">
      {/* Header with Title and Close Button */}
      <DialogHeader className="px-12 pt-20 pb-4">
        <DialogClose asChild className='items-end absolute top-8 right-8'>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <XIcon size={30} />
          </button>
        </DialogClose>
        <DialogTitle className="text-3xl font-bold">
          Certificate
        </DialogTitle>
        
      </DialogHeader>

      {/* Modal Body */}
      <div className="px-12 space-y-6">
        <div>
          <label htmlFor="certificate-photo" className="block text-base font-semibold mb-4">
            Photo<span className="text-red-500">*</span>
          </label>
          <div
            className={`mt-1 flex justify-center items-center px-6 pt-10 pb-10 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer
                        bg-blue-50 hover:bg-blue-100 transition-colors duration-150
                        ${previewUrl ? 'h-auto' : 'h-64'}`} // Adjust height based on preview
          >
            <input
              id="certificate-photo"
              name="certificate-photo"
              type="file"
              ref={fileInputRef}
              className="sr-only" // Hidden, triggered by div click
              onChange={handleFileChange}
              accept="image/*,.pdf" // Accept images and PDFs
            />
            {previewUrl ? (
                <div className="text-center">
                    <Image
                        src={previewUrl}
                        alt="Certificate Preview"
                        width={200}
                        height={140}
                        className="object-contain rounded-md"
                    />
                    <p className="mt-2 text-sm text-gray-600">{selectedFile ? selectedFile.name : 'Current Certificate'}</p>
                    <span className="text-xs text-blue-600 font-semibold hover:underline">Change image</span>
                </div>
            ) : (
                <div className="text-center">
                    <div className="relative mx-auto h-16 w-16 mb-2">
                        <Image src="/uploadimage2.svg" alt="Upload" fill className="object-contain" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Upload Image</span>
                </div>
            )}
          </div>
          {/* {error && <p className="mt-2 text-sm text-red-600">{error}</p>} */}
        </div>
      </div>

      {/* Footer with Save Button */}
      <DialogFooter className="px-12 pb-12 pt-4 sm:justify-start">
        <Button
          type="button"
          onClick={handleSaveClick}
          disabled={isLoading || (!selectedFile)} // Disable if no new file and no existing one for "save"
          className="bg-blueSky hover:bg-blueSky/90 text-white rounded-lg px-8 py-2.5 text-sm font-semibold w-full sm:w-auto"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};