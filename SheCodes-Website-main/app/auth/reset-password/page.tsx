"use client"

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import apiService from '@/lib/apiService'; // Use the shared apiService
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

// The main component logic is extracted to be wrapped by Suspense
const ResetPasswordComponent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!token) {
      toast.error("Invalid or missing reset link. Please request a new one.");
      setLoading(false);
      return;
    }

    if (newPassword.length < 9) {
      toast.error("Password must be at least 9 characters long.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      // Corresponds to the backend endpoint: POST /auth/password-reset/confirm
      const body = {
        token: token,
        new_password: newPassword
      };
      
      const response = await apiService.post('/auth/password-reset/confirm', body);

      toast.success(response.data.msg);
      
      // Redirect to login page after a short delay to let the user read the toast
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);

    } catch (err: any) {
      // The backend returns specific errors for this endpoint (e.g., expired token)
      toast.error(err.response?.data?.detail || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch text-gray-800 bg-[#4A287F]">
      {/* Left Decorative Column */}
      <div className="relative hidden lg:flex w-1/2 items-center justify-center bg-[#4A287F] text-white p-12 overflow-hidden">
        {/* Abstract Shapes */}
        <div className="absolute bottom-1 left-0 w-[550px] h-[550px] transform z-20">
          <Image src="/blobs/blobs1.svg" alt="Abstract Shape" fill className="object-contain" />
        </div>
        <div className="absolute top-10 -right-20 w-[550px] h-[550px] transform z-10">
          <Image src="/blobs/blobs2.svg" alt="Abstract Shape" fill className="object-contain" />
        </div>
        <div className="absolute top-20 -left-5 w-[600px] h-[600px] transform z-0">
          <Image src="/blobs/blobs3.svg" alt="Abstract Shape" fill className="object-contain" />
        </div>
        {/* Content */}
        <div className="relative z-30 flex flex-col items-center justify-center w-full h-full">
            <div className="w-[400px] h-[400px] mb-6">
                <Image
                    src="/logos/shecodeslogohorizontal.svg"
                    alt="SheCodes Society Logo"
                    width={600}
                    height={600}
                    priority
                />
            </div>
        </div>
      </div>

      {/* Right Form Column */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white p-8 md:p-12 lg:p-16 rounded-tl-3xl rounded-bl-3xl ">
        <div className="w-full px-12 space-y-8">
          {/* Title */}
          <div>
            <h2 className="text-4xl font-bold text-center text-blueSky">
              Reset Password
            </h2>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* New Password Input */}
            <div className='relative'>
              <label htmlFor="new-password" className="block text-md font-semibold text-pink mb-2">
                New Password
              </label>
              <input
                id="new-password"
                name="new-password"
                type={showNewPassword ? 'text' : 'password'} 
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                // required
                disabled={loading}
                className="block w-full appearance-none rounded-xl border border-[#bfbfbf] bg-white px-4 py-3 placeholder-[#bfbfbf] focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-1 disabled:opacity-50"
                placeholder="Enter your new password"
              />
              <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 top-7 flex items-center px-4 text-gray-600">
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Confirm Password Input */}
            <div className='relative'>
              <label htmlFor="confirm-password" className="block text-md font-semibold text-pink mb-2">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'} 
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                // required
                disabled={loading}
                className="block w-full appearance-none rounded-xl border border-[#bfbfbf] bg-white px-4 py-3 placeholder-[#bfbfbf] focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-1 disabled:opacity-50"
                placeholder="Confirm your new password"
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 top-7 flex items-center px-4 text-gray-600">
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading || !token}
                className="mt-6 flex w-full justify-center rounded-xl bg-[#7E52C5] px-4 py-3 text-base font-semibold text-white shadow-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save New Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Next.js requires using Suspense for components that use `useSearchParams`
const ResetPasswordPage: React.FC = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordComponent />
        </Suspense>
    );
}

export default ResetPasswordPage;