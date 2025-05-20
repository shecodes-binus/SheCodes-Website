// app/admin/members/view/[id]/page.tsx
"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Added useRouter for back button
import Image from 'next/image';
import { Button } from '@/components/ui/button'; // For a potential "Back" button
import type { Member } from '@/types/members';   // Your Member type
import { dummyMembers } from '@/data/dummyMembers'; // Your dummy members data
import { FaCalendarAlt } from 'react-icons/fa'; // For calendar icon if needed (optional)
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // For Occupation dropdown display

// Helper to format date string (e.g., ISO to DD/MM/YY)
const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2); // Last two digits of year
        return `${day}/${month}/${year}`;
    } catch (error) {
        return 'Invalid Date';
    }
};

const ViewMemberPage: React.FC = () => {
    const params = useParams();
    const router = useRouter(); // For back navigation
    const memberId = params.id ? parseInt(params.id as string, 10) : null;

    const [memberData, setMemberData] = useState<Member | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (memberId === null) {
            setError("Invalid Member ID.");
            setLoading(false);
            return;
        }

        const foundMember = dummyMembers.find(member => member.id === memberId);

        if (foundMember) {
            setMemberData(foundMember);
            setLoading(false);
        } else {
            setError(`Member with ID ${memberId} not found.`);
            setLoading(false);
        }
    }, [memberId]);

    // --- Styles for displaying data (read-only) ---
    const labelStyles = "block text-md font-semibold text-black mb-1.5"; // Adjusted for image style
    
    // Value display style to mimic input fields but read-only
    const valueDisplayStyles = "px-3 py-2.5 text-grey-3 bg-grey-2/30 rounded-lg shadow-sm min-h-[40px] flex items-center";
    const textAreaValueDisplayStyles = `${valueDisplayStyles} min-h-[100px] whitespace-pre-wrap break-words items-start`; // For multi-line text
    const imageContainerStyles = "w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-2 flex items-center justify-center";

    if (loading) {
        return <main className="flex-1 p-6 lg:p-10 bg-gray-50 flex justify-center items-center min-h-screen"><p>Loading member data...</p></main>;
    }
    if (error) {
        return <main className="flex-1 p-6 lg:p-10 bg-gray-50 flex justify-center items-center min-h-screen"><p className="text-red-600">{error}</p></main>;
    }
    if (!memberData) {
        return <main className="flex-1 p-6 lg:p-10 bg-gray-50 flex justify-center items-center min-h-screen"><p>Member data could not be loaded.</p></main>;
    }

    return (
        <main className="flex-1 px-10 py-6">
            <div className='bg-white rounded-xl shadow-md space-y-6 p-6 md:p-8'>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Member Profile</h1>
                    <Button variant="outline" onClick={() => router.back()} className="text-sm">
                        Back
                    </Button>
                </div>

                <div className="space-y-5">
                    {/* Profile Picture */}
                    <div className="flex flex-col items-start">
                        <div className={imageContainerStyles}>
                            {memberData.profilePicUrl ? (
                                <Image
                                    src={memberData.profilePicUrl}
                                    alt={`${memberData.fullName}'s profile`}
                                    width={128}
                                    height={128}
                                    className="object-cover w-full h-full"
                                    onError={(e) => (e.currentTarget.src = '/default-avatar.png')} // Fallback
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                                    No Image
                                </div>
                            )}
                        </div>
                        {/* File name and format text are less relevant for viewing, but can be added if desired */}
                        {/* <p className="text-sm text-gray-600">Profile.jpg</p> */}
                        {/* <p className={imageFormatTextStyles}>Format file jpg, jpeg, png</p> */}
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className={labelStyles}>Full Name</label>
                        <div className={valueDisplayStyles}>{memberData.fullName}</div>
                    </div>

                    {/* About Me */}
                    <div>
                        <label className={labelStyles}>About Me</label>
                        <div className={textAreaValueDisplayStyles}>{memberData.aboutMe}</div>
                    </div>

                    {/* Birth Date & Gender (Side-by-side) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <div>
                            <label className={labelStyles}>Birth Date</label>
                            <div className={`${valueDisplayStyles} relative`}>
                                {formatDate(memberData.birthDate)}
                                {/* Optional: Calendar icon (if you want to keep visual cue) */}
                                {/* <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" /> */}
                            </div>
                        </div>
                        <div>
                            <label className={labelStyles}>Gender</label>
                            <div className={valueDisplayStyles}>{memberData.gender}</div>
                            {/* For radio button style display (non-interactive): */}
                            {/* <div className="flex items-center space-x-4 mt-1">
                                <div className="flex items-center">
                                    <div className={`w-4 h-4 rounded-full border-2 ${memberData.gender === 'Female' ? 'border-blue-600 bg-blue-600' : 'border-gray-400'}`}>
                                        {memberData.gender === 'Female' && <div className="w-1.5 h-1.5 bg-white rounded-full m-auto"></div>}
                                    </div>
                                    <span className="ml-2 text-sm text-gray-700">Female</span>
                                </div>
                                <div className="flex items-center">
                                    <div className={`w-4 h-4 rounded-full border-2 ${memberData.gender === 'Male' ? 'border-blue-600 bg-blue-600' : 'border-gray-400'}`}>
                                         {memberData.gender === 'Male' && <div className="w-1.5 h-1.5 bg-white rounded-full m-auto"></div>}
                                    </div>
                                    <span className="ml-2 text-sm text-gray-700">Male</span>
                                </div>
                            </div> */}
                        </div>
                    </div>

                    {/* Phone Number & Occupation (Side-by-side) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <div>
                            <label className={labelStyles}>Phone Number</label>
                            <div className={valueDisplayStyles}>{memberData.phone}</div>
                        </div>
                        <div>
                            <label className={labelStyles}>Occupation</label>
                            <div className={valueDisplayStyles}>{memberData.occupation}</div>
                            {/* If you want to display it like a disabled select: */}
                            {/* <div className="relative">
                                <Select value={memberData.occupation} disabled>
                                    <SelectTrigger className={`${valueDisplayStyles} pointer-events-none`}>
                                        <SelectValue placeholder="Select occupation" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Fresh Graduate">Fresh Graduate</SelectItem>
                                        <SelectItem value="Student">Student</SelectItem>
                                        <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                                        <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
                                        <SelectItem value="Data Analyst">Data Analyst</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div> */}
                        </div>
                    </div>

                    {/* CV Link */}
                    <div>
                        <label className={labelStyles}>CV Link</label>
                        <div className={`${valueDisplayStyles} text-blue-600 hover:underline`}>
                            {memberData.cvLink ? (
                                <a href={memberData.cvLink} target="_blank" rel="noopener noreferrer">
                                    {memberData.cvLink}
                                </a>
                            ) : (
                                'N/A'
                            )}
                        </div>
                    </div>

                    {/* LinkedIn Profile */}
                    <div>
                        <label className={labelStyles}>LinkedIn Profile</label>
                         <div className={`${valueDisplayStyles} text-blue-600 hover:underline`}>
                            {memberData.linkedin ? (
                                <a href={memberData.linkedin} target="_blank" rel="noopener noreferrer">
                                    {memberData.linkedin}
                                </a>
                            ) : (
                                'N/A'
                            )}
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className={labelStyles}>Email</label>
                        <div className={valueDisplayStyles}>{memberData.gmail}</div>
                    </div>

                </div>
            </div>
        </main>
    );
};

export default ViewMemberPage;