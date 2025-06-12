// app/admin/mentors/edit/[id]/page.tsx
"use client";

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import apiService from '@/lib/apiService';
import toast from 'react-hot-toast';
import Image from 'next/image';

const AddAlumniPage: React.FC = () => {
  const router = useRouter();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [story, setStory] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [batch, setBatch] = useState<'1' | '2'>('1');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

  const handleChooseFileClick = () => {
        fileInputRef.current?.click();
    };

  const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile) {
            toast.error("Please select an image file.");
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading("Adding new alumni...");

        const formData = new FormData();
        formData.append('name', name);
        formData.append('university', university);
        formData.append('batch', batch);
        formData.append('story', story);
        formData.append('image', imageFile); // Use the file object
        if (instagram) formData.append('instagram', instagram);
        if (linkedin) formData.append('linkedin', linkedin);
        // The phone field from the backend model is optional, add if needed in your form

        try {
            await apiService.post('/alumni/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success("Alumni added successfully!", { id: toastId });
            router.push("/admin/alumni");
        } catch (err) {
            toast.error("Error adding alumni.", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const labelClass = "block text-md font-semibold text-black mb-2";
    const inputClass = "text-black border-[#bfbfbf] rounded-lg placeholder:text-[#bfbfbf] py-5 px-3 focus:ring-2 focus:ring-blueSky";
    const selectTriggerStyles = `${inputClass} text-left`;
    const helperTextStyles = "mt-1 text-xs text-gray-500";

  return (
    <main className="flex-1 px-10 py-6">
      <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Add Alumni</h1>
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image URL */}
          <div>
              <label className={labelClass}>Photo<span className="text-red-500">*</span></label>
              <div className="mt-2 flex flex-col items-start">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4 flex items-center justify-center">
                      {imagePreview ? (
                          <Image src={imagePreview} alt="Alumni Preview" width={128} height={128} className="object-cover w-full h-full" />
                      ) : (
                          <span className="text-gray-400 text-sm">Preview</span>
                      )}
                  </div>
                  <div className="flex items-center space-x-3 mb-1">
                      <Button type="button" onClick={handleChooseFileClick} variant="outline" className="px-4 py-2 text-sm bg-grey-2/50 text-gray-700 hover:bg-grey-2/40 border-none rounded-none">
                          Choose file
                      </Button>
                      <span className="text-sm text-gray-600">
                          {imageFile ? imageFile.name : "No file chosen"}
                      </span>
                  </div>
                  {/* The actual file input is hidden */}
                  <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" accept="image/*" required />
                  <p className={helperTextStyles}>Format file jpg, jpeg, png</p>
              </div>
          </div>

          {/* Name */}
          <div>
              <label className={labelClass}>Name<span className="text-red-500">*</span></label>
              <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name here" className={inputClass} required />
          </div>

          {/* University */}
          <div>
              <label className={labelClass}>University<span className="text-red-500">*</span></label>
              <Input type="text" value={university} onChange={(e) => setUniversity(e.target.value)} placeholder="Enter university name" className={inputClass} required />
          </div>

          {/* Batch */}
          <div>
              <label className={labelClass}>Batch<span className="text-red-500">*</span></label>
              <Select
                value={batch.toString()}
                onValueChange={(value) => setBatch(value as '1' | '2')}
              >
                <SelectTrigger className={selectTriggerStyles}>
                    <SelectValue placeholder="Select batch" />
                </SelectTrigger>
                <SelectContent className='bg-white border-gray-300 rounded-md shadow-lg'>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                </SelectContent>
              </Select>
          </div>

          {/* Story */}
          <div>
              <label className={labelClass}>Story<span className="text-red-500">*</span></label>
              <Textarea value={story} onChange={(e) => setStory(e.target.value)} placeholder="Share the alumni’s success story..." rows={5} className={`${inputClass} min-h-[150px]`} required />
          </div>

          {/* Instagram */}
          <div>
            <label className={labelClass}>Instagram Link</label>
            <Input
              type="url"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="https://instagram.com/..."
              className={inputClass}
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className={labelClass}>LinkedIn Link</label>
            <Input
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/..."
              className={inputClass}
            />
          </div>

          {/* Submit */}
          <div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blueSky hover:bg-blueSky/90 text-white font-semibold py-3 px-8 rounded-md"
            >
              {isSubmitting ? "Adding..." : "Add"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddAlumniPage;
