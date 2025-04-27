'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Use Shadcn Input
import { Textarea } from '@/components/ui/textarea'; // Use Shadcn Textarea
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Use Shadcn Select
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Use Shadcn Avatar for display
import { CustomDateInput } from "@/components/custom-date-picker"; 
import { ChangeEmailModal } from '@/components/change-email-modal';
import { ChangePasswordModal } from '@/components/change-password-modal';
import {
  Dialog,
  DialogTrigger,
  // DialogContent, DialogHeader etc. are NOT needed here anymore for these modals
} from "@/components/ui/dialog";
import {
  LayoutGrid,
  ListChecks,
  Briefcase,
  Settings as SettingsIcon, // Alias Settings icon
  UploadCloud, // Icon for upload area
  User, // Fallback icon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FaCalendar } from 'react-icons/fa';
import DatePicker from 'react-datepicker';

// --- Sidebar Component (Reuse or adapt) ---
const SidebarNav = () => {
    const activePath = '/app/settings'; // Set active path for this page

    const navItems = [
        { href: '/app/dashboard', label: 'Dashboard', icon: LayoutGrid },
        { href: '/app/my-activity', label: 'My Activities', icon: ListChecks },
        { href: '/app/portfolio', label: 'Portfolio', icon: Briefcase },
        { href: '/app/settings', label: 'Settings', icon: SettingsIcon }, // Use aliased icon
    ];

    return (
        <nav className="flex flex-col space-y-1"> {/* Reduced space */}
            {navItems.map((item) => {
                const isActive = item.href === activePath;
                const Icon = item.icon;
                return (
                    <Link
                        key={item.label}
                        href={item.href}
                         // Use light blue bg for active, gray text otherwise
                        className={cn(
                            "flex items-center gap-4 rounded-lg text-gray-500 transition-colors hover:bg-blue-100/50 hover:text-gray-900 px-6 py-3", // Adjusted padding/rounding
                            isActive && "bg-blue-200/60 text-gray-900 font-semibold hover:bg-blue-200/60 hover:text-gray-900"
                        )}
                    >
                        <Icon className="h-5 w-5" />
                        <span className='font-semibold text-lg'>{item.label}</span> {/* Adjusted size/weight */}
                    </Link>
                );
            })}
        </nav>
    );
};

// --- Main Settings Page Component ---
export default function SettingsPage() {
  // --- State for form fields ---
  // Initialize with actual user data fetched from API in a real app
  const [profilePic, setProfilePic] = React.useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = React.useState<string | null>(null); // For preview
  const [fileName, setFileName] = React.useState<string>("No file chosen");
  const [fullName, setFullName] = React.useState<string>(""); // Placeholder
  const [aboutMe, setAboutMe] = React.useState<string>(""); // Placeholder
  const [birthDate, setBirthDate] = React.useState<Date | null>(null); // Use Date type for compatibility with DatePicker
  const [gender, setGender] = React.useState<string>("");
  const [phone, setPhone] = React.useState<string>("");
  const [occupation, setOccupation] = React.useState<string>("");
  const [cvLink, setCvLink] = React.useState<string>("");
  const [linkedin, setLinkedin] = React.useState<string>("");

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
      setProfilePicPreview(null); // Clear preview
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
      aboutMe,
      birthDate,
      gender,
      phone,
      occupation,
      cvLink,
      linkedin,
    });
    // Add API call logic here
    alert("Settings Saved (Placeholder)");
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50"> {/* Light background */}
      {/* Sidebar */}
      <aside className="hidden lg:block w-72 bg-white border-r border-gray-200 p-4 rounded-lg shadow-sm m-4 mt-16 self-start"> {/* Rounded, margin */}
         <div className="sticky top-4"> 
            <SidebarNav />
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 lg:py-16 lg:px-10 space-y-10">
        {/* Optional Title */}
        
        <div className='bg-white rounded-lg space-y-8 p-10 rounded-xl shadow-md'>
          {/* Settings Form Container */}
          <form onSubmit={handleSaveChanges} className="">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Profile Settings</h1>
            {/* Profile Picture Section */}
            <div className="flex flex-col items-start space-y-4">
              <Avatar className="h-24 w-24 border-2 border-gray-200">
                  <AvatarImage src={profilePicPreview || "/placeholder-avatar.jpg"} alt="Profile Picture" /> {/* Show preview or placeholder */}
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
                  className="text-black border-[#bfbfbf] rounded-lg placeholder:text-[#bfbfbf] py-5 px-3"
                  required
                />
              </div>

              {/* Empty cell for alignment or next field */}
              {/* Or span Full Name across 2 columns on mobile if needed */}

              {/* About Me (Spans 2 cols) */}
              <div className="md:col-span-2">
                <label htmlFor="aboutMe" className="block text-md font-semibold text-black mb-2">
                  About Me
                </label>
                <Textarea
                  id="aboutMe"
                  value={aboutMe}
                  onChange={(e) => setAboutMe(e.target.value)}
                  placeholder="Tell us about yourself here"
                  className="text-black border-[#bfbfbf] rounded-lg placeholder:text-[#bfbfbf] py-3 px-3 min-h-[120px]"
                  rows={4}
                />
              </div>

              {/* Birth Date */}
              <div>
                <div className="relative">
                  <label htmlFor="birthDate" className="block text-md font-semibold text-black mb-2">
                    Birth Date
                  </label>
                  {/* Use the DatePicker component */}
                  <DatePicker
                    id="birthDate" // Link label htmlFor
                    selected={birthDate} // Pass the current date state
                    onChange={(date) => setBirthDate(date)} // Update state; 'date' is a JS Date object or null
                    placeholderText="Select your birth date here"
                    customInput={ // Provide the custom styled input component
                      <CustomDateInput />
                    }
                    // --- Common Optional Props ---
                    dateFormat="MM/dd/yyyy" // How the date is displayed in the input
                    maxDate={new Date()}    // Prevent selecting future dates
                    showYearDropdown        // Show a dropdown for faster year selection
                    scrollableYearDropdown  // Make the year dropdown scrollable
                    yearDropdownItemNumber={80} // Number of years to show in dropdown
                    wrapperClassName="w-full" 
                  />
                </div>
              </div>



              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block text-md font-semibold text-black mb-2">
                  Gender
                </label>
                <div className="flex items-center space-x-8 mt-[20px]"> 
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="female"
                      name="gender" 
                      value="female"
                      checked={gender === 'female'} 
                      onChange={(e) => setGender(e.target.value)} 
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer" 
                    />
                    <label htmlFor="female" className="ml-4 block text-sm text-black cursor-pointer">
                      Female
                    </label>
                  </div>

                  {/* Male Radio */}
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="male"
                      name="gender" // Use the same name for the group
                      value="male"
                      checked={gender === 'male'} // Control checked state
                      onChange={(e) => setGender(e.target.value)} // Update state on change
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer"
                    />
                    <label htmlFor="male" className="ml-4 block text-sm text-black cursor-pointer">
                      Male
                    </label>
                  </div>
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-md font-semibold text-black mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="border-[#bfbfbf] rounded-lg placeholder:text-[#bfbfbf] py-5 px-3"
                />
              </div>

              {/* Occupation */}
              <div>
                <label htmlFor="occupation" className="block text-md font-semibold text-black mb-2">
                  Occupation
                </label>
                {/* <Input
                  type="text"
                  id="occupation"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="Enter your occupation here"
                  className="border-[#bfbfbf] rounded-lg placeholder:text-[#bfbfbf] py-5 px-3"
                /> */}

                <Select value={occupation} onValueChange={setOccupation}>
                  <SelectTrigger className="w-full border-[#bfbfbf] rounded-lg placeholder:text-[#bfbfbf] py-5 px-3 text-black">
                    <SelectValue placeholder="Choose your occupation here" />
                  </SelectTrigger>
                  <SelectContent className='bg-white border-grey-2/70 rounded-lg'> 
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="freshgraduate">Fresh Graduate</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* CV Link */}
              <div className="md:col-span-2">
                <label htmlFor="cvLink" className="block text-md font-semibold text-black mb-2">
                  CV Link
                </label>
                <Input
                  type="url"
                  id="cvLink"
                  value={cvLink}
                  onChange={(e) => setCvLink(e.target.value)}
                  placeholder="Enter your CV link here (e.g., Google Drive, Dropbox)"
                  className="border-[#bfbfbf] rounded-lg placeholder:text-[#bfbfbf] py-5 px-3"
                />
              </div>

              {/* LinkedIn Profile */}
              <div className="md:col-span-2">
                <label htmlFor="linkedin" className="block text-md font-semibold text-black mb-2">
                  LinkedIn Profile
                </label>
                <Input
                  type="url"
                  id="linkedin"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="Enter your LinkedIn profile URL here"
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