'use client';

import { useState, useEffect, useRef } from 'react';
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
  User, // Fallback icon,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FaCalendar } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import apiService from '@/lib/apiService';
import { Skeleton } from '@/components/ui/skeleton';
import { DialogContent } from '@radix-ui/react-dialog';
import { SaveConfirmationModal } from '@/components/save-confirmation-modal';

// --- Sidebar Component (Reuse or adapt) ---
const SidebarNav = () => {
    const activePath = '/app/settings'; // Set active path for this page
    const { logout } = useAuth();

    const navItems = [
        { href: '/app/dashboard', label: 'Dashboard', icon: LayoutGrid },
        { href: '/app/my-activity', label: 'My Activities', icon: ListChecks },
        { href: '/app/portfolio', label: 'Portfolio', icon: Briefcase },
        { href: '/app/settings', label: 'Settings', icon: SettingsIcon }, // Use aliased icon
    ];

    const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        logout(); // Call the logout function from context
    };

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
            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className={cn(
                    "flex items-center gap-4 rounded-lg text-red-500 transition-colors hover:bg-red-100/50 hover:text-red-700 px-6 py-3 w-full text-left"
                )}
            >
                <LogOut className="h-5 w-5" />
                <span className='font-semibold text-lg'>Log Out</span>
            </button>
        </nav>
    );
};

// --- Main Settings Page Component ---
export default function SettingsPage() {
  const { user: authUser, loading: authLoading, revalidateUser } = useAuth();
    
  // Form state
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [aboutMe, setAboutMe] = useState<string>("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [gender, setGender] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [occupation, setOccupation] = useState<string>("");
  const [cvLink, setCvLink] = useState<string>("");
  const [linkedin, setLinkedin] = useState<string>("");
  
  const [isSaving, setIsSaving] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
        if (authUser) {
            setName(authUser.name || "");
            setEmail(authUser.email || "");
            setAboutMe(authUser.about_me || "");
            setBirthDate(authUser.birth_date ? new Date(authUser.birth_date) : null);
            setGender(authUser.gender || "");
            setPhone(authUser.phone || "");
            setOccupation(authUser.occupation || "");
            setCvLink(authUser.cv_link || "");
            setLinkedin(authUser.linkedin || "");
            setPreviewUrl(authUser.profile_picture || null);
        }
    }, [authUser]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          setProfilePicFile(file);
          setPreviewUrl(URL.createObjectURL(file));
      }
  };

   const handleSaveChanges = async () => {
        // event.preventDefault();
        setIsSaving(true);
        const toastId = toast.loading("Saving changes...");

        const formData = new FormData();
        // Append data with snake_case keys to match backend
        formData.append('name', name);
        formData.append('about_me', aboutMe);
        if (birthDate) formData.append('birth_date', birthDate.toISOString().split('T')[0]);
        formData.append('gender', gender);
        formData.append('phone', phone);
        formData.append('occupation', occupation);
        formData.append('cv_link', cvLink);
        formData.append('linkedin', linkedin);
        if (profilePicFile) {
            formData.append('picture', profilePicFile);
        }

        try {
            await apiService.put('/users/me', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success("Profile updated successfully!", { id: toastId });
            revalidateUser(); // Refresh user context
            setIsSaveModalOpen(false);
        } catch (error) {
            console.error("Failed to update profile:", error);
            toast.error("Failed to save changes. Please try again.", { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };

    const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent the default form submission
        setIsSaveModalOpen(true); // Open the confirmation modal instead
    };

    if (authLoading || !authUser) {
        return <SettingsSkeleton />; // Show skeleton while loading
    }

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
          <form onSubmit={onFormSubmit} className="">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Profile Settings</h1>
            {/* Profile Picture Section */}
            <div className="flex flex-col items-start space-y-4">
              <Avatar className="h-24 w-24 border-2 border-gray-200">
                  <AvatarImage src={previewUrl || undefined} alt="Profile Picture" />
                  <AvatarFallback>
                      <User className="h-10 w-10 text-gray-400" />
                  </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-4">
                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}  className="text-sm border-none bg-grey-2/60 rounded-none hover:bg-grey-2/90">
                  Choose file
                </Button>
                {/* Hidden file input */}
                <input
                      ref={fileInputRef}
                      type="file"
                      // id="profilePicInput"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                  />
                <span className="text-sm text-black">{profilePicFile?.name || "No file chosen"}</span>
              </div>
              <p className="text-sm text-gray-500">Format file jpg, jpeg, png</p>
            </div>

            

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mt-4">
              {/* Full Name */}
              <div className='md:col-span-2'>
                <label htmlFor="name" className="block text-md font-semibold text-black mb-2">
                  Full Name
                </label>
                <Input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name here"
                  className="text-black border-[#bfbfbf] rounded-lg placeholder:text-[#bfbfbf] py-5 px-3 focus:ring-1 focus:ring-blueSky focus:ring-offset-1"
                  required
                />
              </div>

              {/* Empty cell for alignment or next field */}
              {/* Email */}
              <div className='md:col-span-2'>
                <label htmlFor="email" className="block text-md font-semibold text-black mb-2">
                  Email
                </label>
                <Input
                  type="text"
                  id="email"
                  value={email}
                  disabled
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-black border-[#bfbfbf] rounded-lg placeholder:text-[#bfbfbf] py-5 px-3 focus:ring-1 focus:ring-blueSky focus:ring-offset-1"
                />
              </div>

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
                  className="text-black border-[#bfbfbf] rounded-lg placeholder:text-[#bfbfbf] py-3 px-3 min-h-[120px] focus:ring-1 focus:ring-blueSky focus:ring-offset-1"
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
                <Button type="submit" variant="outline" className="text-blueSky border-blueSky hover:bg-blueSky hover:text-white rounded-xl font-semibold text-sm px-6 py-5">
                  Save Changes
                </Button>
              </div>
            </div>
          </form>

          {/* Action Buttons */}
          <div className='space-y-2'>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Account Security</h1>
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

      <Dialog open={isSaveModalOpen} onOpenChange={setIsSaveModalOpen}>
          <DialogContent>
              <SaveConfirmationModal
                  isSaving={isSaving}
                  onConfirm={handleSaveChanges} // The "Yes" button in modal calls the real save function
                  onClose={() => setIsSaveModalOpen(false)}
              />
          </DialogContent>
      </Dialog>
    </div>
  );
}

const SettingsSkeleton = () => (
    <div className="p-10">
        <Skeleton className="h-10 w-1/3 mb-8" />
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-4 w-40" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
                <Skeleton className="h-12 w-full col-span-2" />
                <Skeleton className="h-24 w-full col-span-2" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
    </div>
);