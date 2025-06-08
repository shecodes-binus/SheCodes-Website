// app/admin/events/edit/[id]/page.tsx
"use client";

import * as React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react'; // Added useEffect
import { useRouter, useParams } from 'next/navigation'; // Added useParams
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DatePicker from 'react-datepicker';
import { UploadCloud, Clock, Trash2, PlusCircle } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";
import { CustomDateInput } from '@/components/custom-date-picker';
import { CustomTimeInput } from '@/components/custom-time-picker';
import { CombinedEventData, Mentor, Skill, Benefit, Session } from '@/types/events'; // Adjusted import path
import { allEventsData } from '@/data/dummyEvent'; // Import the source data
import { dummyMentors } from '@/data/dummyPartnershipData'; // Import available mentors

const EditEventPage: React.FC = () => {
    const router = useRouter();
    const params = useParams(); // Hook to get route parameters
    const eventId = params.id ? parseInt(params.id as string, 10) : null; // Get ID from URL

    const [eventData, setEventData] = useState<CombinedEventData | null>(null);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state

    // --- Form State (Initialize empty, will be set by useEffect) ---
    const [eventPhoto, setEventPhoto] = useState<File | null>(null);
    const [eventPhotoPreview, setEventPhotoPreview] = useState<string | null>(null);
    const [existingImageSrc, setExistingImageSrc] = useState<string | null>(null); // To store the original image URL
    const [eventTitle, setEventTitle] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [location, setLocation] = useState('');
    const [whatsappLink, setWhatsappLink] = useState('');
    const [toolsInput, setToolsInput] = useState(''); // Store raw tools string
    const [keyPointsInput, setKeyPointsInput] = useState(''); // Store raw keypoints string

    const [selectedMentors, setSelectedMentors] = useState<Mentor[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [benefits, setBenefits] = useState<Benefit[]>([]);
    const [sessions, setSessions] = useState<Session[]>([]);

    // Available mentors (can be fetched or from dummy data)
    const availableMentors = dummyMentors;

    // Ref for hidden file input
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Fetch and Pre-fill Data ---
    useEffect(() => {
        if (eventId === null) {
            setError("Invalid Event ID.");
            setLoading(false);
            return;
        }

        const foundEvent = allEventsData.find(event => event.id === eventId);

        if (foundEvent) {
            setEventData(foundEvent);
            // Pre-fill form state
            setEventTitle(foundEvent.title);
            setCategory(foundEvent.type); // Assuming category maps to event type
            setDescription(foundEvent.description); // Use short description for the main textarea

            // Safely parse dates and times from ISO strings
            const parseDateSafe = (dateString: string | undefined | null): Date | null => {
                return dateString ? new Date(dateString) : null;
            };

            const eventStartDate = parseDateSafe(foundEvent.startDate);
            const eventEndDate = parseDateSafe(foundEvent.endDate);

            setStartDate(eventStartDate);
            setEndDate(eventEndDate);
            setStartTime(eventStartDate); // Extract time from start date
            setEndTime(eventEndDate); // Extract time from end date

            setLocation(foundEvent.location);
            setWhatsappLink(foundEvent.groupLink || ''); // Use groupLink for whatsapp
            setToolsInput(foundEvent.tools?.map(t => t.name).join(', ') || ''); // Join tool names
            setKeyPointsInput(foundEvent.keyPoints?.join(', ') || ''); // Join key points
            setSelectedMentors(foundEvent.mentors || []);
            setSkills(foundEvent.skillsNeeded || []);
            setBenefits(foundEvent.benefits || []);
            // Ensure session dates are Date objects
            setSessions(foundEvent.sessions?.map(s => ({
                ...s,
                start: parseDateSafe(s.start as string)?.toISOString() || null, // Convert Date to ISO string
                end: parseDateSafe(s.end as string)?.toISOString() || null // Convert Date to ISO string
            })) || []);

            setExistingImageSrc(foundEvent.imageSrc || null); // Store existing image URL
            setEventPhotoPreview(foundEvent.imageSrc || null); // Set initial preview

            setLoading(false);
        } else {
            setError(`Event with ID ${eventId} not found.`);
            setLoading(false);
        }
    }, [eventId]); // Re-run effect if eventId changes

    // --- Handlers (Mostly identical to Add page, but operate on Edit page's state) ---

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setEventPhoto(file); // Store the new File object
            const reader = new FileReader();
            reader.onloadend = () => {
                setEventPhotoPreview(reader.result as string); // Update preview
            };
            reader.readAsDataURL(file);
            setExistingImageSrc(null); // Clear existing image source if new one is chosen
        } else {
            // If user cancels selection, revert to existing image if available
            setEventPhoto(null);
            setEventPhotoPreview(existingImageSrc);
        }
    };

    const handleUploadAreaClick = () => {
        fileInputRef.current?.click();
    };

    // Mentors
    const handleMentorSelect = (mentorIdStr: string) => {
        const mentorId = parseInt(mentorIdStr, 10);
        const mentor = availableMentors.find(m => m.id === mentorId);
        if (mentor && !selectedMentors.some(m => m.id === mentorId)) {
            setSelectedMentors([...selectedMentors, mentor]);
        }
    };
    const removeMentor = (mentorId: number | string) => {
        setSelectedMentors(selectedMentors.filter(m => m.id !== mentorId));
    };

    // Skills
    const addSkill = () => {
        setSkills([...skills, { id: Date.now(), title: '', description: '' }]); // Ensure unique numeric ID
    };
    const updateSkill = (index: number, field: keyof Omit<Skill, 'id'>, value: string) => {
        const updatedSkills = [...skills];
        updatedSkills[index] = { ...updatedSkills[index], [field]: value };
        setSkills(updatedSkills);
    };
     const removeSkill = (id: string | number) => { // Accept both string/number for ID
        setSkills(skills.filter(s => s.id !== id));
    };

    // Benefits
    const addBenefit = () => {
        setBenefits([...benefits, { id: Date.now(), title: '', text: '' }]); // Ensure unique ID
    };
    const updateBenefit = (index: number, field: keyof Omit<Benefit, 'id'>, value: string) => {
         const updatedBenefits = [...benefits];
         updatedBenefits[index] = { ...updatedBenefits[index], [field]: value };
         setBenefits(updatedBenefits);
    };
    const removeBenefit = (id: string | number) => { // Accept both string/number for ID
        setBenefits(benefits.filter(b => b.id !== id));
    };

    // Sessions (Timeline)
    const addSession = () => {
        setSessions([...sessions, { id: `session_${Date.now()}`, topic: '', description: '', start: null, end: null }]);
    };
    const updateSession = (index: number, field: keyof Session, value: string | Date | null) => {
        const updatedSessions = [...sessions];
         // Explicitly handle the fields
        if (field === 'topic' || field === 'description') {
             updatedSessions[index] = { ...updatedSessions[index], [field]: value as string };
        } else if (field === 'start' || field === 'end') {
             updatedSessions[index] = { ...updatedSessions[index], [field]: value instanceof Date ? value : null };
        }
        setSessions(updatedSessions);
    };
     const removeSession = (id: string) => { // Keep ID as string for sessions if generated that way
        setSessions(sessions.filter(s => s.id !== id));
    };

    const uploadImageIfNeeded = async (): Promise<string | null> => {
        if (!eventPhoto) return existingImageSrc;

        const formData = new FormData();
        formData.append("file", eventPhoto);

        const res = await fetch("http://localhost:8000/upload", {
            method: "POST",
            body: formData
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Image upload failed");
        }

        const data = await res.json();
        return data.url; // e.g., /static/images/abc.jpg
    };

    // --- Update Event ---
    const handleUpdateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!eventId || !startDate || !endDate || !startTime || !endTime) {
            alert("Missing required fields.");
            return;
        }
        const combinedStart = new Date(startDate);
        combinedStart.setHours(startTime.getHours(), startTime.getMinutes());
        
        const combinedEnd = new Date(endDate);
        combinedEnd.setHours(endTime.getHours(), endTime.getMinutes());
        
        const imageSrc = await uploadImageIfNeeded();
        const payload = {
            title: eventTitle,
            description,
            event_type: category.charAt(0).toUpperCase() + category.slice(1),
            location,
            imageSrc,
            start_date: combinedStart.toISOString(),
            end_date: combinedEnd.toISOString(),
            tools: toolsInput,
            key_points: keyPointsInput,
            mentors: selectedMentors.map(m => m.id),
            skills: skills.map(s => ({ title: s.title, description: s.description })),
            benefits: benefits.map(b => ({ title: b.title, text: b.text })),
            sessions: sessions.map(s => ({
                topic: s.topic,
                description: s.description,
                start: s.start ? new Date(s.start).toISOString() : null,
                end: s.end ? new Date(s.end).toISOString() : null
            }))
        };

        try {
            const res = await fetch(`http://localhost:8000/events/${eventId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.detail || "Failed to update event.");
            }

            const data = await res.json();
            console.log("Event updated successfully:", data);
            alert("Event updated successfully.");
            // router.push("/admin/events");

        } catch (err: any) {
            console.error("Error updating event:", err);
            alert("Error: " + err.message);
        }
    };

    // --- Styles (Identical to Add page) ---
    const inputStyles = "text-black border-[#bfbfbf] rounded-lg placeholder:text-[#bfbfbf] py-5 px-3 focus:ring-2 focus:ring-blueSky focus:ring-offset-1";
    const labelStyles = "block text-md font-semibold text-black mb-2";
    const buttonStyles = "bg-blueSky hover:bg-blueSky/90 text-white font-medium py-2 px-4 rounded-lg text-sm inline-flex items-center gap-1";
    const removeButtonStyles = "bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 rounded-md text-xs inline-flex items-center gap-1";

    // --- Render Logic ---
    if (loading) {
        return <main className="flex-1 p-6 lg:p-10"><p>Loading event data...</p></main>;
    }

    if (error) {
        return <main className="flex-1 p-6 lg:p-10"><p className="text-red-600">{error}</p></main>;
    }

    if (!eventData) {
        // Should be caught by error state, but as a fallback
        return <main className="flex-1 p-6 lg:p-10"><p>Event data could not be loaded.</p></main>;
    }

    return (
        <main className="flex-1 px-10 py-6">
            <div className='bg-white rounded-xl shadow-md space-y-6 p-6 md:p-8'>
                {/* Changed Title */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Edit Event</h1>
                    <Button variant="outline" onClick={() => router.back()} className="text-sm">
                        Back
                    </Button>
                </div>

                <form onSubmit={handleUpdateEvent} className="space-y-6">

                     {/* Photo Upload Section - Shows existing or new preview */}
                     <div>
                        <label className={`${labelStyles}`}>
                            Photo<span className="text-red-500">*</span>
                        </label>
                        <div
                            className="mt-1 flex justify-center items-center flex-col px-6 py-10 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer min-h-[400px] bg-blue-50/60 hover:bg-blue-100 transition-colors"
                            onClick={handleUploadAreaClick}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleUploadAreaClick(); }}
                        >
                            {eventPhotoPreview ? (
                                <Image src={eventPhotoPreview} alt="Event Preview" width={350} height={300} className=" object-contain rounded-md" />
                            ) : (
                                <div className="text-center">
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
                                     <span className="mt-2 block text-sm font-semibold text-gray-700">Upload New Image</span>
                                 </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                id="eventPhotoInput"
                                name="eventPhotoInput"
                                accept="image/jpeg, image/png, image/gif"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Supported formats: JPG, PNG, GIF. Max size: 5MB.</p>
                    </div>

                    {/* Event Title */}
                    <div>
                        <label htmlFor="eventTitle" className={`${labelStyles}`}>
                            Event Title<span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="text"
                            id="eventTitle"
                            name="eventTitle"
                            value={eventTitle}
                            onChange={(e) => setEventTitle(e.target.value)}
                            placeholder="Enter name here"
                            className={inputStyles}
                            required
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label htmlFor="category" className={`${labelStyles}`}>
                            Category<span className="text-red-500">*</span>
                        </label>
                        {/* Use the 'type' from CombinedEventData for the value */}
                        <Select value={category} onValueChange={setCategory} name="category" required>
                            <SelectTrigger className={`${inputStyles} text-left`}>
                                <SelectValue placeholder="Enter category here" />
                            </SelectTrigger>
                             <SelectContent className='bg-white border-gray-300 rounded-md shadow-lg'>
                                {/* Ensure these values match the 'type' field in your data */}
                                <SelectItem value="Workshop">Workshop</SelectItem>
                                <SelectItem value="Webinar">Webinar</SelectItem>
                                <SelectItem value="Seminar">Seminar</SelectItem>
                                <SelectItem value="Mentorship">Mentorship</SelectItem>
                                <SelectItem value="Conference">Conference</SelectItem>
                                <SelectItem value="Hackathon">Hackathon</SelectItem>
                                {/* Add other types if present in your data */}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className={`${labelStyles}`}>
                            Description<span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            id="description"
                            name="description"
                            value={description} // Use the short description here
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter description here"
                            className={`${inputStyles} min-h-[100px]`}
                            rows={4}
                            required
                        />
                         {/* You might want to edit the longDescription separately if needed */}
                        <p className="mt-1 text-xs text-gray-500">Max 30 words (Short Description)</p>
                    </div>

                    {/* Date/Time Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                       {/* Start Date */}
                        <div>
                            <label htmlFor="startDate" className={`${labelStyles}`}>
                                Start Date<span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <DatePicker
                                    id="startDate"
                                    selected={startDate} // Uses state variable
                                    onChange={(date) => setStartDate(date)}
                                    placeholderText="Select start date here"
                                    className={`${inputStyles} pr-10`}
                                    customInput={<CustomDateInput />}
                                    dateFormat="MM/dd/yyyy"
                                    autoComplete="off"
                                    required
                                    showYearDropdown
                                    wrapperClassName="w-full"
                                />
                            </div>
                        </div>

                        {/* End Date */}
                        <div>
                            <label htmlFor="endDate" className={`${labelStyles}`}>
                                End Date<span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <DatePicker
                                    id="endDate"
                                    selected={endDate} // Uses state variable
                                    onChange={(date) => setEndDate(date)}
                                    placeholderText="Select end date here"
                                    className={`${inputStyles} pr-10`}
                                    dateFormat="MM/dd/yyyy"
                                    minDate={startDate || undefined}
                                    autoComplete="off"
                                    required
                                    customInput={<CustomDateInput />}
                                    wrapperClassName="w-full"
                                    showYearDropdown
                                />
                            </div>
                        </div>

                       {/* Start Time */}
                        <div>
                            <label htmlFor="startTime" className={`${labelStyles}`}>
                                Start Time<span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <DatePicker
                                    id="startTime"
                                    selected={startTime} // Uses state variable
                                    onChange={(date) => setStartTime(date)}
                                    placeholderText="Select start time here"
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    dateFormat="h:mm aa"
                                    customInput={<CustomTimeInput placeholder="Select start time here" />}
                                    wrapperClassName="w-full"
                                    autoComplete="off"
                                    required
                                />
                            </div>
                        </div>

                        {/* End Time */}
                        <div>
                            <label htmlFor="endTime" className={`${labelStyles}`}>
                                End Time<span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <DatePicker
                                    id="endTime"
                                    selected={endTime} // Uses state variable
                                    onChange={(date) => setEndTime(date)}
                                    placeholderText="Select end time here"
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    dateFormat="h:mm aa"
                                    customInput={<CustomTimeInput placeholder="Select end time here" />}
                                    wrapperClassName="w-full"
                                    autoComplete="off"
                                    required
                                />
                            </div>
                        </div>
                    </div> {/* End Date/Time Grid */}

                    {/* Location */}
                    <div>
                        <label htmlFor="location" className={`${labelStyles}`}>
                            Location<span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="text"
                            id="location"
                            name="location"
                            value={location} // Uses state variable
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Enter event location or URL"
                            className={inputStyles}
                            required
                        />
                    </div>

                    {/* Link Group Whatsapp */}
                    <div>
                        <label htmlFor="whatsappLink" className={`${labelStyles}`}>
                            Link Group Whatsapp<span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="url"
                            id="whatsappLink"
                            name="whatsappLink"
                            value={whatsappLink} // Uses state variable
                            onChange={(e) => setWhatsappLink(e.target.value)}
                            placeholder="Enter link group Whatsapp here"
                            className={inputStyles}
                            required
                        />
                    </div>

                    {/* Tools */}
                    <div>
                        <label htmlFor="tools" className={`${labelStyles}`}>
                            Tools<span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="text"
                            id="tools"
                            name="tools"
                            value={toolsInput} // Uses combined string state
                            onChange={(e) => setToolsInput(e.target.value)}
                            placeholder="Enter tools here (comma-separated)"
                            className={inputStyles}
                            required
                        />
                    </div>

                    {/* Key Points */}
                    <div>
                        <label htmlFor="keyPoints" className={`${labelStyles}`}>
                            Key Points<span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="text"
                            id="keyPoints"
                            name="keyPoints"
                            value={keyPointsInput} // Uses combined string state
                            onChange={(e) => setKeyPointsInput(e.target.value)}
                            placeholder="Enter key points here (comma-separated)"
                            className={inputStyles}
                            required
                        />
                    </div>

                    {/* Mentors */}
                    <div className="space-y-4">
                         <div className="flex justify-between items-center">
                             <label className={`${labelStyles} mb-0`}>Mentors<span className="text-red-500">*</span></label>
                              {/* Link to manage mentors page might still be relevant */}
                             <Button type="button" onClick={() => router.push('/admin/mentors')} size="sm" className={`${buttonStyles}`}>
                                 <PlusCircle size={16} /> Manage Mentors
                             </Button>
                          </div>
                         {/* Display Selected Mentors */}
                         <div className="flex flex-wrap gap-2 mb-3">
                            {/* Map selectedMentors state */}
                            {selectedMentors.map(mentor => (
                                <div key={mentor.id} className="flex items-center gap-1 bg-blueSky text-white text-sm font-medium px-2 py-1 rounded-full">
                                    <button type="button" onClick={() => removeMentor(mentor.id)} className="flex items-center gap-x-1.5 text-skyBlue hover:text-skyBlue/80">
                                         {mentor.name}
                                         <Trash2 size={14} />
                                     </button>
                                </div>
                            ))}
                             {selectedMentors.length === 0 && <p className='text-sm text-gray-500'>No mentors selected yet.</p>}
                         </div>
                        {/* Select Existing Mentor */}
                        <Select onValueChange={handleMentorSelect} value="">
                             <SelectTrigger className={`${inputStyles} text-left [&>span]:line-clamp-1`}>
                                <SelectValue placeholder="Select an existing mentor to add..." />
                            </SelectTrigger>
                             <SelectContent className='bg-white border-gray-300 rounded-md shadow-lg'>
                                {availableMentors
                                    .filter(availMentor => !selectedMentors.some(selMentor => selMentor.id === availMentor.id))
                                    .map(mentor => (
                                        <SelectItem key={mentor.id} value={String(mentor.id)}>
                                            {mentor.name}
                                        </SelectItem>
                                ))}
                                {availableMentors.filter(availMentor => !selectedMentors.some(selMentor => selMentor.id === availMentor.id)).length === 0 && (
                                     <div className="px-4 py-2 text-sm text-gray-500">All available mentors selected</div>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                     {/* Skills */}
                     <div className="space-y-4">
                         <div className="flex justify-between items-center">
                             <label className={`${labelStyles} mb-0`}>Skills Needed<span className="text-red-500">*</span></label>
                             <Button type="button" onClick={addSkill} size="sm" className={`${buttonStyles}`}>
                                 <PlusCircle size={16} /> Add Skill
                             </Button>
                         </div>
                          {skills.length === 0 && <p className='text-sm text-gray-500'>No skills added yet.</p>}
                          {/* Map skills state */}
                          {skills.map((skill, index) => (
                             <div key={skill.id} className="space-y-3 relative p-4 rounded-lg border border-gray-200 bg-grey-1/40 shadow-sm">
                                 <button
                                     type="button"
                                     onClick={() => removeSkill(skill.id)} // Use skill.id
                                     className={`${removeButtonStyles} absolute top-2 right-2`}
                                     aria-label="Remove skill"
                                 >
                                     <Trash2 size={12} /> Remove
                                 </button>
                                 <Input
                                     type="text"
                                     value={skill.title}
                                     onChange={(e) => updateSkill(index, 'title', e.target.value)}
                                     placeholder="Skill Title"
                                     className={`${inputStyles} text-sm`}
                                     required
                                 />
                                 <Textarea
                                     value={skill.description}
                                     onChange={(e) => updateSkill(index, 'description', e.target.value)}
                                     placeholder="Skill Description"
                                     className={`${inputStyles} min-h-[60px] text-sm`}
                                     rows={2}
                                     required
                                 />
                             </div>
                         ))}
                     </div>

                     {/* Benefits */}
                     <div className="space-y-4">
                          <div className="flex justify-between items-center">
                             <label className={`${labelStyles} mb-0`}>Benefits<span className="text-red-500">*</span></label>
                             <Button type="button" onClick={addBenefit} size="sm" className={`${buttonStyles}`}>
                                 <PlusCircle size={16} /> Add Benefit
                             </Button>
                          </div>
                          {benefits.length === 0 && <p className='text-sm text-gray-500'>No benefits added yet.</p>}
                          {/* Map benefits state */}
                          {benefits.map((benefit, index) => (
                              <div key={benefit.id} className="space-y-3 relative p-4 rounded-lg border border-gray-200 bg-grey-1/40 shadow-sm">
                                 <button
                                     type="button"
                                     onClick={() => removeBenefit(benefit.id)} // Use benefit.id
                                     className={`${removeButtonStyles} absolute top-2 right-2`}
                                     aria-label="Remove benefit"
                                 >
                                    <Trash2 size={12} /> Remove
                                 </button>
                                 <Input
                                     type="text"
                                     value={benefit.title}
                                     onChange={(e) => updateBenefit(index, 'title', e.target.value)}
                                     placeholder="Benefit Title"
                                     className={`${inputStyles} text-sm`}
                                     required
                                 />
                                 <Textarea
                                     value={benefit.text}
                                     onChange={(e) => updateBenefit(index, 'text', e.target.value)}
                                     placeholder="Benefit Text"
                                     className={`${inputStyles} min-h-[60px] text-sm`}
                                     rows={2}
                                     required
                                 />
                             </div>
                         ))}
                     </div>

                     {/* Sessions */}
                     <div className="space-y-4">
                         <div className="flex justify-between items-center">
                              <label className={`${labelStyles} mb-0`}>Timeline / Sessions<span className="text-red-500">*</span></label>
                              <Button type="button" onClick={addSession} size="sm" className={`${buttonStyles}`}>
                                 <PlusCircle size={16} /> Add Session
                              </Button>
                          </div>
                          {sessions.length === 0 && <p className='text-sm text-gray-500'>No sessions added yet.</p>}
                          {/* Map sessions state */}
                          
                            {sessions.map((session, index) => (
                                <div key={session.id} className="space-y-3 relative p-4 rounded-lg border border-gray-200 bg-grey-1/40 shadow-sm">
                                    <button
                                        type="button"
                                        onClick={() => removeSession(session.id)} // Use session.id
                                        className={`${removeButtonStyles} absolute top-2 right-2`}
                                        aria-label="Remove session"
                                    >
                                        <Trash2 size={12} /> Remove
                                    </button>
                                    <Input
                                        type="text"
                                        value={session.topic}
                                        onChange={(e) => updateSession(index, 'topic', e.target.value)}
                                        placeholder="Session Topic"
                                        className={`${inputStyles} text-sm`}
                                        required
                                    />
                                    <Textarea
                                        value={session.description}
                                        onChange={(e) => updateSession(index, 'description', e.target.value)}
                                        placeholder="Session Description"
                                        className={`${inputStyles} min-h-[60px] text-sm`}
                                        rows={2}
                                        required
                                    />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Start Date and Time</label>
                                            <DatePicker
                                                selected={session.start ? new Date(session.start) : null} // Ensure it's a Date object
                                                onChange={(date) => updateSession(index, 'start', date)}
                                                placeholderText="Select start date and time"
                                                showTimeSelect
                                                timeIntervals={15}
                                                timeCaption="Start"
                                                dateFormat="MMMM d, yyyy h:mm aa"
                                                customInput={<CustomDateInput placeholder="Select start date and time" />}
                                                wrapperClassName="w-full"
                                                autoComplete="off"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">End Date and Time</label>
                                            <DatePicker
                                                selected={session.end ? new Date(session.end) : null} // Ensure it's a Date object
                                                onChange={(date) => updateSession(index, 'end', date)}
                                                placeholderText="Select end date and time"
                                                showTimeSelect
                                                timeIntervals={15}
                                                timeCaption="End"
                                                dateFormat="MMMM d, yyyy h:mm aa"
                                                // Basic validation example: end time must be after start time for the same session
                                                minDate={session.start ? new Date(session.start) : undefined}
                                                // You might need more complex validation if comparing dates across sessions
                                                customInput={<CustomDateInput placeholder="Select end date and time" />}
                                                wrapperClassName="w-full"
                                                autoComplete="off"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                          
                          
                     </div>

                    {/* Update Button */}
                    <div className="flex justify-start pt-3">
                        <Button
                            type="submit"
                            className="bg-blueSky hover:bg-blueSky/90 text-white font-semibold py-2.5 px-8 rounded-md cursor-pointer transition-colors"
                        >
                            Update Event {/* Changed button text */}
                        </Button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default EditEventPage;