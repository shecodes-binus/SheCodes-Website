"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Mentor } from '@/types/partnership';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import apiService from '@/lib/apiService';
import toast from 'react-hot-toast';

const EditMentorPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const mentorId = params.id ? parseInt(params.id as string, 10) : null;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [mentorPhoto, setMentorPhoto] = useState<File | null>(null);
    const [mentorPhotoPreview, setMentorPhotoPreview] = useState<string | null>(null);
    const [mentorName, setMentorName] = useState('');
    const [mentorOccupation, setMentorOccupation] = useState('');
    const [mentorDescription, setMentorDescription] = useState('');
    const [mentorStory, setMentorStory] = useState('');
    const [instagramLink, setInstagramLink] = useState('');
    const [linkedinLink, setLinkedinLink] = useState('');
    const [mentorStatus, setMentorStatus] = useState<'active' | 'inactive'>('active');

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!mentorId) return;
        const fetchMentorData = async () => {
            setLoading(true);
            try {
                const response = await apiService.get<Mentor>(`/mentors/${mentorId}`);
                const data = response.data;
                setMentorName(data.name);
                setMentorOccupation(data.occupation);
                setMentorDescription(data.description);
                setMentorStory(data.story);
                setInstagramLink(data.instagram || '');
                setLinkedinLink(data.linkedin || '');
                setMentorStatus(data.status || 'active');
                setMentorPhotoPreview(data.image_src);
            } catch (err) {
                setError("Failed to fetch mentor data.");
            } finally {
                setLoading(false);
            }
        };
        fetchMentorData();
    }, [mentorId]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setMentorPhoto(file);
            setMentorPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleChooseFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleUpdateMentor = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!mentorId) return;

        setIsSubmitting(true);
        const toastId = toast.loading("Updating mentor...");

        const formData = new FormData();
        formData.append('name', mentorName);
        formData.append('occupation', mentorOccupation);
        formData.append('description', mentorDescription);
        formData.append('story', mentorStory);
        formData.append('status', mentorStatus);
        if (instagramLink) formData.append('instagram', instagramLink);
        if (linkedinLink) formData.append('linkedin', linkedinLink);
        if (mentorPhoto) {
            formData.append('image', mentorPhoto);
        }

        try {
            await apiService.put(`/mentors/update/${mentorId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success("Mentor updated successfully!", { id: toastId });
            router.push('/admin/mentors');
        } catch (err) {
            toast.error("Failed to update mentor.", { id: toastId });
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
        return <main className="flex-1 p-6 lg:p-10 bg-gray-50"><p>Loading mentor data...</p></main>;
    }

    if (error) {
        return <main className="flex-1 p-6 lg:p-10 bg-gray-50"><p className="text-red-600">{error}</p></main>;
    }

    return (
        <main className="flex-1 px-10 py-6">
            <div className='bg-white rounded-xl shadow-md space-y-6 p-6 md:p-8'>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Edit Mentor </h1>
                    <Button variant="outline" onClick={() => router.back()} className="text-sm">
                        Back
                    </Button>
                </div>

                <form onSubmit={handleUpdateMentor} className="space-y-6">
                    {/* Photo Upload Section */}
                    <div>
                        <label className={`${labelStyles}`}>
                            Photo<span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2 flex flex-col items-start">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4 flex items-center justify-center">
                                {mentorPhotoPreview ? (
                                    <Image src={mentorPhotoPreview} alt="Mentor Preview" width={128} height={128} className="object-cover w-full h-full" />
                                ) : (
                                    <span className="text-gray-400 text-sm">Preview</span>
                                )}
                            </div>
                            <div className="flex items-center space-x-3 mb-1">
                                <Button type="button" onClick={handleChooseFileClick} variant="outline" className="px-4 py-2 text-sm bg-grey-2/50 text-gray-700 hover:bg-grey-2/40 border-none rounded-none">
                                    Choose file
                                </Button>
                                <span className="text-sm text-gray-600">{mentorPhoto ? mentorPhoto.name : "No new file chosen"}</span>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                id="mentorPhotoInput"
                                name="mentorPhotoInput"
                                accept="image/jpeg, image/png, image/jpg"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <p className={helperTextStyles}>Format file jpg, jpeg, png</p>
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label htmlFor="mentorName" className={`${labelStyles}`}>
                            Name<span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="text"
                            id="mentorName"
                            name="mentorName"
                            value={mentorName}
                            onChange={(e) => setMentorName(e.target.value)}
                            placeholder="Enter name here"
                            className={inputStyles}
                            required
                        />
                    </div>

                    {/* Occupation */}
                    <div>
                        <label htmlFor="mentorOccupation" className={`${labelStyles}`}>
                            Occupation<span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="text"
                            id="mentorOccupation"
                            name="mentorOccupation"
                            value={mentorOccupation}
                            onChange={(e) => setMentorOccupation(e.target.value)}
                            placeholder="Enter occupation here"
                            className={inputStyles}
                            required
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label htmlFor="mentorStatus" className={`${labelStyles}`}>
                            Status<span className="text-red-500">*</span>
                        </label>
                        <Select
                            value={mentorStatus}
                            onValueChange={(value) => setMentorStatus(value as 'active' | 'inactive')}
                            name="mentorStatus"
                            required
                        >
                            <SelectTrigger className={selectTriggerStyles}>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent className='bg-white border-gray-300 rounded-md shadow-lg'>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="mentorDescription" className={`${labelStyles}`}>
                            Description<span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            id="mentorDescription"
                            name="mentorDescription"
                            value={mentorDescription}
                            onChange={(e) => setMentorDescription(e.target.value)}
                            placeholder="Enter description here"
                            className={`${inputStyles} min-h-[100px]`}
                            rows={4}
                            required
                        />
                        <p className={helperTextStyles}>Max 30 words</p>
                    </div>

                    {/* Story */}
                    <div>
                        <label htmlFor="mentorStory" className={`${labelStyles}`}>
                            Story<span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            id="mentorStory"
                            name="mentorStory"
                            value={mentorStory}
                            onChange={(e) => setMentorStory(e.target.value)}
                            placeholder="Enter story here"
                            className={`${inputStyles} min-h-[200px]`}
                            rows={4}
                            required
                        />
                        {/* <p className={helperTextStyles}></p> */}
                    </div>

                    {/* Instagram Link */}
                    <div>
                        <label htmlFor="instagramLink" className={`${labelStyles}`}>
                            Instagram Link<span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="url"
                            id="instagramLink"
                            name="instagramLink"
                            value={instagramLink}
                            onChange={(e) => setInstagramLink(e.target.value)}
                            placeholder="Enter Instagram link here"
                            className={inputStyles}
                            required
                        />
                    </div>

                    {/* LinkedIn Link */}
                    <div>
                        <label htmlFor="linkedinLink" className={`${labelStyles}`}>
                            LinkedIn Link<span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="url"
                            id="linkedinLink"
                            name="linkedinLink"
                            value={linkedinLink}
                            onChange={(e) => setLinkedinLink(e.target.value)}
                            placeholder="Enter LinkedIn link here"
                            className={inputStyles}
                            required
                        />
                    </div>

                    {/* Save Button */}
                    <div className="pt-4 flex"> {/* Removed justify-start to let button take natural width or be styled further */}
                        <Button
                            type="submit"
                            // Style to match the light gray button in the image
                            className="bg-blueSky hover:bg-blueSky/90 text-white font-semibold py-3 px-8 rounded-md cursor-pointer transition-colors"
                        >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default EditMentorPage;