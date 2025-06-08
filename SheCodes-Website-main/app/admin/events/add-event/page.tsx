"use client";

import * as React from 'react';
import { useState, useRef, useCallback } from 'react'; 
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DatePicker from 'react-datepicker';
import { UploadCloud, Clock, Trash2, PlusCircle } from 'lucide-react'; // Added Trash2, PlusCircle
import "react-datepicker/dist/react-datepicker.css";
import { CustomDateInput } from '@/components/custom-date-picker';
import { CustomTimeInput } from '@/components/custom-time-picker';
import { Mentor, Skill, Benefit, Session } from '@/types/events'; // Adjusted import path
import { dummyMentors } from '@/data/dummyPartnershipData';

const EventFormPage: React.FC = () => {
    const router = useRouter();
    const [eventPhoto, setEventPhoto] = useState<File | null>(null);
    const [eventPhotoPreview, setEventPhotoPreview] = useState<string | null>(null);
    const [eventTitle, setEventTitle] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);   
    const [location, setLocation] = useState('');
    const [whatsappLink, setWhatsappLink] = useState('');
    const [tools, setTools] = useState('');
    const [keyPoints, setKeyPoints] = useState('');
    
    const [selectedMentors, setSelectedMentors] = useState<Mentor[]>([]); 
    const [skills, setSkills] = useState<Skill[]>([]);
    const [benefits, setBenefits] = useState<Benefit[]>([]);
    const [sessions, setSessions] = useState<Session[]>([]);

    // State for potentially adding a new mentor (simple example)
    const availableMentors = dummyMentors; 
    const [showAddMentorForm, setShowAddMentorForm] = useState(false);
    const [newMentorName, setNewMentorName] = useState('');

    // Ref for hidden file input
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Handlers ---
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setEventPhoto(file);
            // Generate preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setEventPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setEventPhoto(null);
            setEventPhotoPreview(null); // Clear preview
        }
    };

    // Trigger hidden file input click when the upload area is clicked
    const handleUploadAreaClick = () => {
        fileInputRef.current?.click();
    };

    // Mentors
    const handleMentorSelect = (mentorId: string) => {
        const id = parseInt(mentorId, 10); // Assuming IDs from select are numbers
        const mentor = availableMentors.find(m => m.id === id);
        if (mentor && !selectedMentors.some(m => m.id === id)) {
            setSelectedMentors([...selectedMentors, mentor]);
        }
    };
    const removeMentor = (mentorId: number | string) => {
        setSelectedMentors(selectedMentors.filter(m => m.id !== mentorId));
    };

    // Skills
    const addSkill = () => {
        setSkills([...skills, { id: Date.now(), title: '', description: '' }]);
    };
    const updateSkill = (index: number, field: keyof Skill, value: string) => {
        const updatedSkills = [...skills];
        // Ensure the field exists and is assignable before updating
        if (field === 'title' || field === 'description') {
            updatedSkills[index] = { ...updatedSkills[index], [field]: value };
            setSkills(updatedSkills);
        }
    };
    const removeSkill = (id: string) => {
        setSkills(skills.filter(s => s.id !== Number(id)));
    };

    // Benefits
    const addBenefit = () => {
        setBenefits([...benefits, { id: Date.now(), title: '', text: '' }]);
    };
    const updateBenefit = (index: number, field: keyof Benefit, value: string) => {
         const updatedBenefits = [...benefits];
         if (field === 'title' || field === 'text') {
             updatedBenefits[index] = { ...updatedBenefits[index], [field]: value };
             setBenefits(updatedBenefits);
         }
    };
    const removeBenefit = (id: string) => {
        setBenefits(benefits.filter(b => b.id !== Number(id)));
    };

    // Sessions (Timeline)
    const addSession = () => {
        setSessions([...sessions, { id: `session_${Date.now()}`, topic: '', description: '', start: null, end: null }]);
    };
    const updateSession = (index: number, field: keyof Session, value: string | Date | null) => {
        const updatedSessions = [...sessions];
        // Type check needed for Date | null
        if (field === 'start' || field === 'end') {
            updatedSessions[index] = { ...updatedSessions[index], [field]: value instanceof Date ? value : null };
        } else if (field === 'topic' || field === 'description') {
            updatedSessions[index] = { ...updatedSessions[index], [field]: value as string };
        }
        setSessions(updatedSessions);
    };
    const removeSession = (id: string) => {
        setSessions(sessions.filter(s => s.id !== id));
    };

    // Save Event
    const handleSaveEvent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!startDate || !endDate || !startTime || !endTime) {
            alert("Please select valid start/end date and time.");
            return;
        }

        const combinedStart = new Date(startDate);
        combinedStart.setHours(startTime.getHours(), startTime.getMinutes());

        const combinedEnd = new Date(endDate);
        combinedEnd.setHours(endTime.getHours(), endTime.getMinutes());

        const payload = {
            title: eventTitle,
            description,
            event_type: category.charAt(0).toUpperCase() + category.slice(1), // match backend enum
            location,
            start_date: combinedStart.toISOString(),
            end_date: combinedEnd.toISOString(),
            tools,
            key_points: keyPoints,
            mentors: selectedMentors.map((m) => m.id),
            skills: skills.map((s) => ({ title: s.title, description: s.description })),
            benefits: benefits.map((b) => ({ title: b.title, text: b.text })),
            sessions: sessions.map((s) => ({
                topic: s.topic,
                description: s.description,
                start: s.start ? new Date(s.start).toISOString() : null,
                end: s.end ? new Date(s.end).toISOString() : null
            }))
        };

        try {
            const res = await fetch("http://localhost:8000/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Failed to create event");
            }

            const data = await res.json();
            console.log("Event created successfully:", data);
            alert("Event created successfully!");
            router.push("/admin/events"); // Or wherever you'd like to redirect

        } catch (error: any) {
            console.error("Event creation failed:", error);
            alert("Error: " + error.message);
        }
    };

    // Basic Input styling matching the image (adjust border color, placeholder color, padding)
    const inputStyles = "text-black border-[#bfbfbf] rounded-lg placeholder:text-[#bfbfbf] py-5 px-3 focus:ring-2 focus:ring-blueSky focus:ring-offset-1";
    const labelStyles = "block text-md font-semibold text-black mb-2";
    const buttonStyles = "bg-white hover:bg-blueSky border-[2px] border-blueSky text-blueSky font-semibold hover:text-white py-2 px-4 rounded-lg text-sm inline-flex items-center gap-1";
    const removeButtonStyles = "bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 rounded-md text-xs inline-flex items-center gap-1";

    return (
        <main className="flex-1 px-10 py-6"> {/* Added background color */}
            <div className='bg-white rounded-xl shadow-md space-y-6 p-6 md:p-8'> {/* Adjusted padding and rounded */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Add a New Event</h1>
                    <Button variant="outline" onClick={() => router.back()} className="text-sm">
                        Back
                    </Button>
                </div>

                <form onSubmit={handleSaveEvent} className="space-y-6"> {/* Adjusted spacing */}

                    {/* Photo Upload Section */}
                    <div>
                        <label className={`${labelStyles}`}>
                            Photo<span className="text-red-500">*</span>
                        </label>
                        <div
                            className="mt-1 flex justify-center items-center flex-col px-6 py-10 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer min-h-[400px] bg-blue-50/60 hover:bg-blue-100 transition-colors" // Style like the image
                            onClick={handleUploadAreaClick}
                            role="button" // Accessibility
                            tabIndex={0} // Accessibility
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleUploadAreaClick(); }} // Accessibility
                        >
                            {eventPhotoPreview ? (
                                <Image src={eventPhotoPreview} alt="Event Preview" width={350} height={300} className=" object-contain rounded-md" />
                            ) : (
                                // Placeholder Icon and Text from the image
                                <div className="text-center">
                                     {/* Simple placeholder representation from image */}
                                    <div className="mx-auto h-20 w-20 mb-2 relative flex items-center justify-center">
                                        <div className="relative aspect-[4/3] min-h-[100px] w-full rounded-xl mb-4 overflow-hidden">
                                            <Image
                                                src="/uploadimage.svg"
                                                alt="Upload project image placeholder"
                                                fill
                                                className="object-contain bg-transparent"
                                            />
                                        </div>
                                    </div>
                                    <span className="mt-2 block text-sm font-semibold text-gray-700">Upload Image</span>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                id="eventPhotoInput" // Added ID
                                name="eventPhotoInput" // Added name
                                accept="image/jpeg, image/png, image/gif" // Accept common image formats
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Supported formats: JPG, PNG, GIF. Max size: 5MB.</p> {/* Added helper text */}
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
                        <Select value={category} onValueChange={setCategory} name="category" required>
                            <SelectTrigger className={`${inputStyles} text-left`}>
                                <SelectValue placeholder="Enter category here" />
                            </SelectTrigger>
                            <SelectContent className='bg-white border-gray-300 rounded-md shadow-lg'>
                                {/* Add actual categories here */}
                                <SelectItem value="workshop">Workshop</SelectItem>
                                <SelectItem value="webinar">Webinar</SelectItem>
                                <SelectItem value="bootcamp">Seminar</SelectItem>
                                <SelectItem value="meetup">Mentorship</SelectItem>
                                <SelectItem value="conference">Conference</SelectItem>
                                <SelectItem value="hackathon">Hackathon</SelectItem>
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
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter description here"
                            className={`${inputStyles} min-h-[100px]`} // Adjusted styling
                            rows={4}
                            // Add maxLength or word count validation logic if needed
                            required
                        />
                        <p className="mt-1 text-xs text-gray-500">Max 30 words</p>
                    </div>

                    {/* Date/Time Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                        {/* Start Date */}
                        <div className=''>
                            <label htmlFor="startDate" className={`${labelStyles}`}>
                                Start Date<span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <DatePicker
                                    id="startDate"
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    placeholderText="Select start date here"
                                    className={`${inputStyles} pr-10`} 
                                    customInput={ 
                                        <CustomDateInput />
                                    }
                                    dateFormat="MM/dd/yyyy"
                                    autoComplete="off"
                                    required
                                    showYearDropdown
                                    wrapperClassName="w-full" 
                                />
                                {/* <FaCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none h-4 w-4" /> */}
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
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    placeholderText="Select end date here"
                                    className={`${inputStyles} pr-10`}
                                    dateFormat="MM/dd/yyyy"
                                    minDate={startDate || undefined} // End date cannot be before start date
                                    autoComplete="off"
                                    required
                                    customInput={ 
                                        <CustomDateInput />
                                    }
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
                                    selected={startTime}
                                    onChange={(date) => setStartTime(date)}
                                    placeholderText="Select start time here"
                                    showTimeSelect
                                    showTimeSelectOnly // Only show time picker
                                    timeIntervals={15} // Time intervals in minutes
                                    timeCaption="Time"
                                    dateFormat="h:mm aa" // Format for time display
                                    customInput={<CustomTimeInput placeholder="Select start time here" />} // Use the new custom time input
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
                                    selected={endTime}
                                    onChange={(date) => setEndTime(date)}
                                    placeholderText="Select end time here"
                                    showTimeSelect
                                    showTimeSelectOnly // Only show time picker
                                    timeIntervals={15} // Time intervals in minutes
                                    timeCaption="Time"
                                    dateFormat="h:mm aa" // Format for time display
                                    customInput={<CustomTimeInput placeholder="Select end time here" />} // Use the new custom time input
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
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Enter name here" // Placeholder from image, consider "Enter event location or URL"
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
                            value={whatsappLink}
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
                            value={tools}
                            onChange={(e) => setTools(e.target.value)}
                            placeholder="Enter tools here (e.g., Zoom, Figma, VS Code)"
                            className={inputStyles}
                            required
                        />
                    </div>

                    {/* Key Points */}
                    <div>
                        <label htmlFor="keyPoints" className={`${labelStyles}`}>
                            Key Points<span className="text-red-500">*</span>
                        </label>
                        <Input // Using Input, consider Textarea if points can be long
                            type="text"
                            id="keyPoints"
                            name="keyPoints"
                            value={keyPoints}
                            onChange={(e) => setKeyPoints(e.target.value)}
                            placeholder="Enter key points here (comma-separated)"
                            className={inputStyles}
                            required
                        />
                    </div>

                    {/* Mentors */}
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <label className={`${labelStyles} mb-0`}>Mentors<span className="text-red-500">*</span></label>
                            <Button type="button" onClick={() => router.push('/admin/mentors/add-mentor')} size="sm" className={`${buttonStyles}`}>
                                <PlusCircle size={16} /> Add Mentor
                            </Button>
                         </div>
                        {/* Display Selected Mentors */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {selectedMentors.map(mentor => (
                                <div key={mentor.id} className="flex items-center gap-1 bg-blueSky text-white text-sm font-medium px-2 py-1 rounded-full">
                                    
                                    <button type="button" onClick={() => removeMentor(mentor.id)} className="flex items-center gap-x-1.5 text-skyBlue hover:text-skyBue/80">
                                        {mentor.name}
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                            {selectedMentors.length === 0 && <p className='text-sm text-gray-500'>No mentors selected yet.</p>}
                        </div>

                        {/* Select Existing Mentor */}
                        <Select onValueChange={handleMentorSelect} value=""> {/* Reset value after selection */}
                             <SelectTrigger className={`${inputStyles} text-left [&>span]:line-clamp-1`}>
                                <SelectValue placeholder="Select an existing mentor..." />
                            </SelectTrigger>
                            <SelectContent className='bg-white border-gray-300 rounded-md shadow-lg'>
                                {availableMentors
                                    .filter(availMentor => !selectedMentors.some(selMentor => selMentor.id === availMentor.id)) // Filter out already selected
                                    .map(mentor => (
                                        <SelectItem key={mentor.id} value={String(mentor.id)}>
                                            {mentor.name}
                                        </SelectItem>
                                ))}
                                {availableMentors.filter(availMentor => !selectedMentors.some(selMentor => selMentor.id === availMentor.id)).length === 0 && (
                                     <div className="px-4 py-2 text-sm text-gray-500">No more available mentors</div>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Skills */}
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <label className={`${labelStyles} mb-0`}>Skills Needed<span className="text-red-500">*</span></label>
                            <Button type="button" onClick={addSkill} size="sm" className={`${buttonStyles}`}>
                                <PlusCircle size={16} /> Add Skill
                            </Button>
                        </div>
                         {skills.length === 0 && <p className='text-sm text-gray-500'>No skills added yet.</p>}
                         {skills.map((skill, index) => (
                            <div key={skill.id} className="space-y-3 relative p-4 rounded-lg border border-gray-200 bg-grey-1/40 shadow-sm">
                                {skills.length > 1 && ( 
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeSkill(String(skill.id))}
                                        className={`${removeButtonStyles} h-7 w-7 p-1 absolute top-2 right-2`}
                                        aria-label="Remove skill"
                                    >
                                        <Trash2 size={12} />
                                    </Button>
                                )}
                                <Input
                                    type="text"
                                    value={skill.title}
                                    onChange={(e) => updateSkill(index, 'title', e.target.value)}
                                    placeholder="Skill Title (e.g., Problem Solving)"
                                    className={`${inputStyles} text-sm`}
                                    required
                                />
                                <Textarea
                                    value={skill.description}
                                    onChange={(e) => updateSkill(index, 'description', e.target.value)}
                                    placeholder="Skill Description (e.g., Debugging simple code issues)"
                                    className={`${inputStyles} min-h-[60px] text-sm`}
                                    rows={2}
                                    required
                                />
                            </div>
                        ))}
                    </div>

                    {/* Benefits */}
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                         <div className="flex justify-between items-center">
                            <label className={`${labelStyles} mb-0`}>Benefits<span className="text-red-500">*</span></label>
                            <Button type="button" onClick={addBenefit} size="sm" className={`${buttonStyles}`}>
                                <PlusCircle size={16} /> Add Benefit
                            </Button>
                         </div>
                         {benefits.length === 0 && <p className='text-sm text-gray-500'>No benefits added yet.</p>}
                         {benefits.map((benefit, index) => (
                             <div key={benefit.id} className="space-y-3 relative p-4 rounded-lg border border-gray-200 bg-grey-1/40 shadow-sm">
                                {benefits.length > 1 && ( 
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeBenefit(String(benefit.id))}
                                        className={`${removeButtonStyles} h-7 w-7 p-1 absolute top-2 right-2`}
                                        aria-label="Remove benefit"
                                    >
                                        <Trash2 size={12} />
                                    </Button>
                                )}
                                <Input
                                    type="text"
                                    value={benefit.title}
                                    onChange={(e) => updateBenefit(index, 'title', e.target.value)}
                                    placeholder="Benefit Title (e.g., Build Your First Website)"
                                    className={`${inputStyles} text-sm`}
                                    required
                                />
                                <Textarea
                                    value={benefit.text}
                                    onChange={(e) => updateBenefit(index, 'text', e.target.value)}
                                    placeholder="Benefit Text (e.g., Gain practical experience...)"
                                    className={`${inputStyles} min-h-[60px] text-sm`}
                                    rows={2}
                                    required
                                />
                            </div>
                        ))}
                    </div>
                    
                    {/* Sessions */}
                    {/* --- Timeline (Sessions) Section (Updated) --- */}
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                             <label className={`${labelStyles} mb-0`}>Timeline / Sessions<span className="text-red-500">*</span></label>
                             <Button type="button" onClick={addSession} size="sm" className={`${buttonStyles}`}>
                                <PlusCircle size={16} /> Add Session
                             </Button>
                         </div>
                         {sessions.length === 0 && <p className='text-sm text-gray-500'>No sessions added yet.</p>}
                         {sessions.map((session, index) => (
                            <div key={session.id} className="space-y-3 relative p-4 rounded-lg border border-gray-200 bg-grey-1/40 shadow-sm">
                                {sessions.length > 1 && ( 
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeSession(session.id)}
                                        className={`${removeButtonStyles} h-7 w-7 p-1 absolute top-2 right-2`}
                                        aria-label="Remove session"
                                    >
                                        <Trash2 size={12} />
                                    </Button>
                                )}
                                <Input
                                    type="text"
                                    value={session.topic}
                                    onChange={(e) => updateSession(index, 'topic', e.target.value)}
                                    placeholder="Session Topic (e.g., HTML Basics)"
                                    className={`${inputStyles} text-sm`}
                                    required
                                />
                                 <Textarea
                                    value={session.description}
                                    onChange={(e) => updateSession(index, 'description', e.target.value)}
                                    placeholder="Session Description (e.g., Learn the structure...)"
                                    className={`${inputStyles} min-h-[60px] text-sm`}
                                    rows={2}
                                    required
                                />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                         <label className="block text-xs font-medium text-gray-600 mb-1">Start Date and Time</label>
                                         <DatePicker
                                            selected={session.start ? new Date(session.start) : null}
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
                                            selected={session.end ? new Date(session.end) : null}
                                            onChange={(date) => updateSession(index, 'end', date)}
                                            placeholderText="Select end date and time"
                                            showTimeSelect
                                            timeIntervals={15}
                                            timeCaption="End"
                                            dateFormat="MMMM d, yyyy h:mm aa"
                                            minTime={session.start ? new Date(session.start) : undefined} // Basic validation
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

                    {/* Save Button */}
                    <div className="flex justify-start pt-3">
                        <Button
                            type="submit"
                            className="bg-blueSky hover:bg-blueSky/90 text-white font-semibold py-2.5 px-8 rounded-md cursor-pointer transition-colors" // Darker save button
                        >
                            Add Event
                        </Button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default EventFormPage;