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

interface CertificateUploadModalProps {
  eventId: number; // To associate the certificate with an event
  currentCertificateUrl?: string | null; // To show existing certificate if editing
  onUpload: (eventId: number, file: File) => Promise<void>; // Function to call when upload is confirmed
  onClose: () => void; // Function to call when modal closes
}

export const CertificateUploadModal: React.FC<CertificateUploadModalProps> = ({
  eventId,
  currentCertificateUrl,
  onUpload,
  onClose,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentCertificateUrl || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (file) {
      // Basic validation (example: image type and size)
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        setError('Please select an image or PDF file.');
        setSelectedFile(null); // Clear invalid file
        setPreviewUrl(currentCertificateUrl || null); // Revert preview
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size should not exceed 5MB.');
        setSelectedFile(null); // Clear invalid file
        setPreviewUrl(currentCertificateUrl || null);
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setPreviewUrl(currentCertificateUrl || null); // Revert to current if selection is cleared
    }
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveClick = async () => {
    if (!selectedFile && !currentCertificateUrl) { // If no new file AND no existing cert, show error
        setError("Please select a file to upload or ensure an existing certificate is present if 'Save' implies updating metadata without changing the file.");
        return;
    }
    if (!selectedFile && currentCertificateUrl) {
        // If there's a current certificate and no new file selected,
        // "Save" might mean saving other metadata (if any) or simply confirming.
        // For now, we'll assume if no new file, no action, or you can make it save.
        // Or, disable save button if !selectedFile. Let's assume save is for new uploads primarily.
        onClose(); // Just close if no new file.
        return;
    }
    if (!selectedFile) return; // Should be caught by above, but for safety.


    setIsLoading(true);
    setError(null);
    try {
      await onUpload(eventId, selectedFile);
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(err.message || "An error occurred during upload.");
    } finally {
      setIsLoading(false);
    }
  };

  const isPdf = (urlOrFile: string | File | null): boolean => {
    if (!urlOrFile) return false;
    if (typeof urlOrFile === 'string') {
        return urlOrFile.toLowerCase().endsWith('.pdf') || urlOrFile.startsWith('blob:http') && selectedFile?.type === 'application/pdf';
    }
    return urlOrFile.type === 'application/pdf';
  };

  const getFileName = (): string | undefined => {
    if (selectedFile) return selectedFile.name;
    if (currentCertificateUrl) {
        try {
            const url = new URL(currentCertificateUrl);
            const pathSegments = url.pathname.split('/');
            return pathSegments.pop() || "certificate.pdf"; // Fallback name
        } catch (e) {
            // If currentCertificateUrl is not a valid URL (e.g., just a filename)
            return currentCertificateUrl.split('/').pop();
        }
    }
    return undefined;
  }

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
              <div className="relative w-full max-h-80 overflow-hidden rounded-md">
                {!isPdf(previewUrl) && (selectedFile ? !isPdf(selectedFile) : true) ? (
                     <Image
                        src={previewUrl}
                        alt="Certificate Preview"
                        width={400} // Provide appropriate width
                        height={300} // Provide appropriate height
                        style={{ objectFit: 'contain', width: '100%', height: 'auto', maxHeight: '320px' }}
                        className="rounded-md cursor-pointer"
                        onClick={handleUploadAreaClick}
                    />
                ) : (
                    <div className="text-center p-4 bg-gray-100 rounded-md">
                        <p className="text-sm text-gray-700">File Selected: {getFileName()}</p>
                        <a
                            href={previewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()} 
                        >
                            View File
                        </a>
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering parent's click if it had one
                                handleUploadAreaClick(); // Trigger file input to change the PDF
                            }}
                            className="block mx-auto mt-2 text-xs text-blue-500 hover:text-blue-700 underline"
                        >
                            Change File
                        </button>
                    </div>
                )}

              </div>
            ) : (
              <div className="space-y-2 text-center cursor-pointer" onClick={handleUploadAreaClick}>
                <div className="mx-auto mb-2">
                   <div className="mx-auto h-20 w-20 mb-2 relative flex items-center justify-center">
                        <div className="relative aspect-[4/3] min-h-[100px] w-full rounded-xl mb-4 overflow-hidden">
                            <Image
                                src="/uploadimage.svg" // Default upload placeholder
                                alt="Upload project image placeholder"
                                fill
                                className="object-contain bg-transparent"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex text-sm text-gray-600">
                  <p className="pl-1">Upload Image</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB. PDF also accepted.</p>
              </div>
            )}
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      </div>

      {/* Footer with Save Button */}
      <DialogFooter className="px-12 pb-12 pt-4 sm:justify-start">
        <Button
          type="button"
          onClick={handleSaveClick}
          disabled={isLoading || (!selectedFile && !currentCertificateUrl)} // Disable if no new file and no existing one for "save"
          className="bg-blueSky hover:bg-blueSky/90 text-white rounded-lg px-8 py-2.5 text-sm font-semibold w-full sm:w-auto"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};