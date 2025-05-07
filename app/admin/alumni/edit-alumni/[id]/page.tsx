// app/admin/mentors/edit/[id]/page.tsx
"use client";

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Alumni } from '@/types/alumnis'; // Adjust path to your Alumni type
import { dummyAlumnis } from '@/data/dummyAlumnis'; // Adjust path to your dummy mentors data
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EditAlumniPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const alumniId = params.id ? parseInt(params.id as string, 10) : null;

    const [alumniData, setAlumniData] = useState<Alumni | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Form State ---
    const [alumniPhoto, setAlumniPhoto] = useState<File | null>(null);
    const [alumniPhotoPreview, setAlumniPhotoPreview] = useState<string | null>(null);
    const [existingImageSrc, setExistingImageSrc] = useState<string | null>(null);
    const [alumniName, setAlumniName] = useState('');
    const [alumniUniversity, setAlumniUniversity] = useState('');
    const [alumniStory, setAlumniStory] = useState('');
    const [instagramLink, setInstagramLink] = useState('');
    const [linkedinLink, setLinkedinLink] = useState('');
    const [alumniBatch, setAlumniBatch] = useState<1 | 2>(1); // Default to batch 1

    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Fetch and Pre-fill Data ---
    useEffect(() => {
        if (alumniId === null) {
            setError("Invalid Alumni ID.");
            setLoading(false);
            return;
        }

        const foundAlumni = dummyAlumnis.find(alumni => alumni.id === alumniId);

        if (foundAlumni) {
            setAlumniData(foundAlumni);
            setAlumniName(foundAlumni.name);
            setAlumniUniversity(foundAlumni.university);
            setAlumniStory(foundAlumni.story);
            setInstagramLink(foundAlumni.instagram || '');
            setLinkedinLink(foundAlumni.linkedin || '');
            setAlumniBatch(foundAlumni.batch as 1 | 2);

            if (foundAlumni.imageSrc) {
                setExistingImageSrc(foundAlumni.imageSrc);
                setAlumniPhotoPreview(foundAlumni.imageSrc);
            }
            setLoading(false);
        } else {
            setError(`Alumni with ID ${alumniId} not found.`);
            setLoading(false);
        }
    }, [alumniId]);

    // --- Handlers ---
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setAlumniPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAlumniPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setExistingImageSrc(null); // Clear existing image if new one is chosen
        } else if (existingImageSrc) { // Revert to existing if selection is cancelled
            setAlumniPhoto(null);
            setAlumniPhotoPreview(existingImageSrc);
        } else {
            setAlumniPhoto(null);
            setAlumniPhotoPreview(null);
        }
    };

    // Trigger hidden file input click when the "Choose file" button is clicked
    const handleChooseFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleUpdateAlumni = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Updating Alumni Data (ID:", alumniId, "):", {
            id: alumniId,
            alumniPhoto, // New File object or null
            existingImageSrc, // Original image URL if photo not changed
            alumniName,
            alumniUniversity,
            instagramLink,
            linkedinLink,
            // Preserve other fields not in the form from original mentorData
            alumniBatch,
            story: alumniData?.story,
        });
        alert("Alumni Updated (Placeholder - Check Console)");
        // router.push('/admin/mentors'); // Optionally navigate back
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

    if (!alumniData) {
        return <main className="flex-1 p-6 lg:p-10 bg-gray-50"><p>Alumni data could not be loaded.</p></main>;
    }

    return (
        <main className="flex-1 p-6 lg:p-10">
            <div className='bg-white rounded-xl shadow-md space-y-6 p-6 md:p-8'>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Edit Alumni </h1>
                    <Button variant="outline" onClick={() => router.back()} className="text-sm">
                        Back
                    </Button>
                </div>

                <form onSubmit={handleUpdateAlumni} className="space-y-6">
                    {/* Photo Upload Section */}
                    <div>
                        <label className={`${labelStyles}`}>
                            Photo<span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1 flex flex-col items-start">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-3 flex items-center justify-center">
                                {alumniPhotoPreview ? (
                                    <Image src={alumniPhotoPreview} alt="Alumni Preview" width={128} height={128} className="object-cover w-full h-full" />
                                ) : (
                                    <span className="text-gray-400 text-sm">Preview</span>
                                )}
                            </div>
                            <div className="flex items-center space-x-3">
                                <Button
                                    type="button"
                                    onClick={handleChooseFileClick}
                                    variant="outline"
                                    className="px-4 py-2 text-sm border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                    Choose file
                                </Button>
                                <span className="text-sm text-gray-600">
                                    {alumniPhoto ? alumniPhoto.name : (existingImageSrc ? "Current image" : "No file chosen")}
                                </span>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                id="alumniPhotoInput"
                                name="alumniPhotoInput"
                                accept="image/jpeg, image/png, image/jpg"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <p className={helperTextStyles}>Format file jpg, jpeg, png</p>
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label htmlFor="alumniName" className={`${labelStyles}`}>
                            Name<span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="text"
                            id="alumniName"
                            name="alumniName"
                            value={alumniName}
                            onChange={(e) => setAlumniName(e.target.value)}
                            placeholder="Enter name here"
                            className={inputStyles}
                            required
                        />
                    </div>

                    {/* University */}
                    <div>
                        <label htmlFor="alumniUniversity" className={`${labelStyles}`}>
                            University<span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="text"
                            id="alumniUniversity"
                            name="alumniUniversity"
                            value={alumniUniversity}
                            onChange={(e) => setAlumniUniversity(e.target.value)}
                            placeholder="Enter university here"
                            className={inputStyles}
                            required
                        />
                    </div>

                    {/* Batch */}
                    <div>
                        <label htmlFor="alumniBatch" className={`${labelStyles}`}>
                            Batch<span className="text-red-500">*</span>
                        </label>
                        <Select
                            value={alumniBatch.toString()}
                            onValueChange={(value) => setAlumniBatch(parseInt(value, 10) as 1 | 2)}
                            name="alumniBatch"
                            required
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
                        <label htmlFor="alumniStory" className={`${labelStyles}`}>
                            Story<span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            id="alumniStory"
                            name="alumniStory"
                            value={alumniStory}
                            onChange={(e) => setAlumniStory(e.target.value)}
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
                            className="bg-blueSky hover:bg-blueSky/90 text-white font-semibold py-2.5 px-8 rounded-md cursor-pointer transition-colors"
                        >
                            Save
                        </Button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default EditAlumniPage;