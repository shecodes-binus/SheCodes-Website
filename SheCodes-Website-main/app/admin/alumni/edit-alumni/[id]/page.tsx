// app/admin/mentors/edit/[id]/page.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Alumni } from '@/types/alumnis';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import apiService from '@/lib/apiService';
import toast from 'react-hot-toast';

const EditAlumniPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const alumniId = params.id ? parseInt(params.id as string, 10) : null;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [university, setUniversity] = useState('');
    const [story, setStory] = useState('');
    const [instagram, setInstagram] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [batch, setBatch] = useState<'1' | '2'>('1');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!alumniId) return;
        const fetchAlumniData = async () => {
            setLoading(true);
            try {
                const response = await apiService.get<Alumni>(`/alumni/${alumniId}`);
                const data = response.data;
                setName(data.name);
                setUniversity(data.university || '');
                setStory(data.story);
                setInstagram(data.instagram || '');
                setLinkedin(data.linkedin || '');
                setBatch(data.batch.toString() as '1' | '2');
                setImagePreview(data.image_src);
            } catch (err) {
                setError("Failed to fetch alumni data.");
            } finally {
                setLoading(false);
            }
        };
        fetchAlumniData();
    }, [alumniId]);

    // --- Handlers ---
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

    const handleUpdateAlumni = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!alumniId) return;

        setIsSubmitting(true);
        const toastId = toast.loading("Updating alumni...");

        const formData = new FormData();
        formData.append('name', name);
        formData.append('university', university);
        formData.append('batch', batch);
        formData.append('story', story);
        if (instagram) formData.append('instagram', instagram);
        if (linkedin) formData.append('linkedin', linkedin);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            await apiService.put(`/alumni/update/${alumniId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success("Alumni updated successfully!", { id: toastId });
            router.push('/admin/alumni');
        } catch (err) {
            toast.error("Error updating alumni.", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Styles ---
    // Consistent with the image: Bold labels, red asterisk
    const labelStyles = "block text-md font-semibold text-black mb-1.5"; // Adjusted for image style
    const inputStyles = "text-black border-[#bfbfbf] rounded-lg py-5 px-3 focus:ring-2 focus:ring-blueSky focus:ring-offset-1";
    const helperTextStyles = "mt-1 text-xs text-gray-500";
    const selectTriggerStyles = `${inputStyles} text-left`;

    if (loading) {
        return <main className="flex-1 p-6 lg:p-10 bg-gray-50"><p>Loading alumni data...</p></main>;
    }

    if (error) {
        return <main className="flex-1 p-6 lg:p-10 bg-gray-50"><p className="text-red-600">{error}</p></main>;
    }

    return (
        <main className="flex-1 px-10 py-6">
            <div className='bg-white rounded-xl shadow-md space-y-6 p-6 md:p-8'>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Edit Alumni </h1>
                    <Button variant="outline" onClick={() => router.back()} className="text-sm">
                        Back
                    </Button>
                </div>

                <form onSubmit={handleUpdateAlumni} className="space-y-6">
                    {/* Photo Upload Section */}
                    <div className=''>
                        <label className={labelStyles}>Photo<span className="text-red-500">*</span></label>
                        <div className="mt-2 flex flex-col items-start">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4 flex items-center justify-center">
                                {imagePreview ? (
                                    <Image src={imagePreview} alt="Alumni Preview" width={128} height={128} className="object-cover w-full h-full" />
                                ) : (
                                    <span className="text-gray-400 text-sm">No Image</span>
                                )}
                            </div>
                            <div className="flex items-center space-x-3 mb-1">
                                <Button type="button" onClick={handleChooseFileClick} variant="outline" className="px-4 py-2 text-sm bg-grey-2/50 text-gray-700 hover:bg-grey-2/40 border-none rounded-none">
                                    Choose file
                                </Button>
                                <span className="text-sm text-gray-600">
                                    {imageFile ? imageFile.name : "No new file chosen"}
                                </span>
                            </div>
                            <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
                            <p className={helperTextStyles}>Upload a new file to replace the current image.</p>
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label htmlFor="alumniName" className={labelStyles}>Name<span className="text-red-500">*</span></label>
                        <Input type="text" id="alumniName" value={name} onChange={(e) => setName(e.target.value)} className={inputStyles} required />
                    </div>

                    {/* University */}
                    <div>
                        <label htmlFor="alumniUniversity" className={labelStyles}>University<span className="text-red-500">*</span></label>
                        <Input type="text" id="alumniUniversity" value={university} onChange={(e) => setUniversity(e.target.value)} className={inputStyles} required />
                    </div>

                    {/* Batch */}
                    <div>
                        <label htmlFor="alumniBatch" className={labelStyles}>Batch<span className="text-red-500">*</span></label>
                        <Select value={batch} onValueChange={(value) => setBatch(value as '1' | '2')} required>
                            <SelectTrigger className={selectTriggerStyles}><SelectValue /></SelectTrigger>
                            <SelectContent className='bg-white'><SelectItem value="1">1</SelectItem><SelectItem value="2">2</SelectItem></SelectContent>
                        </Select>
                    </div>

                    {/* Story */}
                    <div>
                        <label htmlFor="alumniStory" className={labelStyles}>Story<span className="text-red-500">*</span></label>
                        <Textarea id="alumniStory" value={story} onChange={(e) => setStory(e.target.value)} className={`${inputStyles} min-h-[200px]`} rows={4} required />
                    </div>

                    {/* Instagram Link */}
                    <div>
                        <label htmlFor="instagramLink" className={labelStyles}>Instagram Link</label>
                        <Input type="url" id="instagramLink" value={instagram} onChange={(e) => setInstagram(e.target.value)} className={inputStyles} />
                    </div>

                    {/* LinkedIn Link */}
                    <div>
                        <label htmlFor="linkedinLink" className={labelStyles}>LinkedIn Link</label>
                        <Input type="url" id="linkedinLink" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className={inputStyles} />
                    </div>

                    {/* Save Button */}
                    <div className="pt-4 flex">
                        <Button type="submit" disabled={isSubmitting} className="bg-blueSky hover:bg-blueSky/90 text-white font-semibold py-3 px-8 rounded-md">
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default EditAlumniPage;