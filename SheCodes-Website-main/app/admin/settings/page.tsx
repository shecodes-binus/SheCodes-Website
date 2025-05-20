'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Use Shadcn Input
import { Textarea } from '@/components/ui/textarea'; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; 
import { ChangeEmailModal } from '@/components/change-email-modal';
import { ChangePasswordModal } from '@/components/change-password-modal';
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  User, 
} from 'lucide-react';
import { Admin } from '@/types/admin'
import { dummyAdmin } from '@/data/dummyAdmin'; 


// --- Main Settings Page Component ---
export default function SettingsPage() {
    const [admin, setAdmin] = React.useState<Admin | null>(null);
    // --- State for form fields ---
    // Initialize with actual user data fetched from API in a real app
    const [profilePic, setProfilePic] = React.useState<File | null>(null);
    const [profilePicPreview, setProfilePicPreview] = React.useState<string | null>(null);
    const [fileName, setFileName] = React.useState<string>("No file chosen");
    const [fullName, setFullName] = React.useState<string>(""); 
    const [phoneNumber, setPhoneNumber] = React.useState<string>(""); 
    const [role, setRole] = React.useState<string>("");

    React.useEffect(() => {
        const currentAdmin = dummyAdmin[0];
        if (currentAdmin) {
          setAdmin(currentAdmin);
          setFullName(currentAdmin.name);
          setPhoneNumber(currentAdmin.phone || ""); 
          setRole(currentAdmin.role);
          if (currentAdmin.imageSrc) {
            setProfilePicPreview(currentAdmin.imageSrc); 
          }
        }
      }, []);

    // --- Handlers ---
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setProfilePic(file);
            setFileName(file.name);
            // Generate preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setProfilePic(null);
            setFileName("No file chosen");
            setProfilePicPreview(admin?.imageSrc || null);
        }
    };

    // Trigger hidden file input click
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const handleChooseFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleSaveChanges = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Saving settings:", {
            profilePic, // In real app, upload this file
            fullName,
            phoneNumber,
        });
        // Add API call logic here
        alert("Settings Saved (Placeholder)");
    };

    return (
        <div className="flex min-h-screen w-full">
            {/* Main Content Area */}
            <main className="flex-1 p-6 md:p-8 lg:py-16 lg:px-10 space-y-10">
                {/* Optional Title */}
                
                <div className='bg-white rounded-lg space-y-12 p-10 rounded-xl shadow-md'>
                    {/* Settings Form Container */}
                    <form onSubmit={handleSaveChanges} className="">
                        <h1 className="text-3xl font-bold text-gray-800 mb-8">Profile Settings</h1>
                        {/* Profile Picture Section */}
                        <div className="flex flex-col items-start space-y-4">
                            <Avatar className="h-24 w-24 border-2 border-gray-200">
                                <AvatarImage src={profilePicPreview || "/placeholder-avatar.jpg"} alt={admin?.name || "User"} />
                                <AvatarFallback>
                                    <User className="h-10 w-10 text-gray-400" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex items-center gap-4">
                                <Button type="button" variant="outline" size="sm" onClick={handleChooseFileClick} className="text-sm border-none bg-grey-2/60 rounded-none hover:bg-grey-2/90">
                                    Choose file
                                </Button>
                                {/* Hidden file input */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    id="profilePicInput"
                                    accept="image/jpeg, image/png, image/jpg"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <span className="text-sm text-black">{fileName}</span>
                            </div>
                            <p className="text-sm text-gray-500">Format file jpg, jpeg, png</p>
                        </div>

                        

                        {/* Form Fields Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mt-4">
                        {/* Full Name */}
                        <div className='md:col-span-2'>
                            <label htmlFor="fullName" className="block text-md font-semibold text-black mb-2">
                            Full Name
                            </label>
                            <Input
                            type="text"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your full name here"
                            className="text-black border-[#bfbfbf] rounded-lg placeholder:text-[#bfbfbf] py-5 px-3 focus:ring-1 focus:ring-blueSky focus:ring-offset-1"
                            required
                            />
                        </div>

                        <div className='md:col-span-2'>
                            <label htmlFor="fullName" className="block text-md font-semibold text-black mb-2">
                                Role
                            </label>
                            <div
                                id="roleDisplay"
                                className="text-black border border-[#bfbfbf] rounded-lg py-2 px-3 bg-gray-100 cursor-not-allowed text-sm"
                                >
                                {role || "N/A"} {/* Display fetched role or N/A */}
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div className="md:col-span-2 mb-2">
                            <label htmlFor="phoneNumber" className="block text-md font-semibold text-black mb-2">
                            Phone Number
                            </label>
                            <Input
                                type="tel"
                                id="phoneNumber"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Enter your phone number here"
                                className="border-[#bfbfbf] rounded-lg placeholder:text-[#bfbfbf] py-5 px-3"
                            />
                        </div>

                        <div>
                            <Button type="button" variant="outline" className="text-blueSky border-blueSky hover:bg-blueSky hover:text-white rounded-xl font-semibold text-sm px-6 py-5">
                            Save Changes
                            </Button>
                        </div>
                        </div>
                    </form>

                    {/* Action Buttons */}
                    <div className='space-y-2'>
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Change Email</h1>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button type="button" variant="outline" className="text-blueSky border-blueSky hover:bg-blueSky hover:text-white rounded-xl font-semibold text-sm px-6 py-6">
                                    Change Email
                                </Button>
                            </DialogTrigger>
                            {/* Render the modal component */}
                            <ChangeEmailModal />
                        </Dialog>
                    </div>

                    <div className='space-y-2'>
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Change Password</h1>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button type="button" variant="outline" className="text-blueSky border-blueSky hover:bg-blueSky hover:text-white rounded-xl font-semibold text-sm px-6 py-6">
                                    Change Password
                                </Button>
                            </DialogTrigger>
                                {/* Render the modal component */}
                            <ChangePasswordModal />
                        </Dialog>
                    </div>
                </div>
            </main>
        </div>
    );
}