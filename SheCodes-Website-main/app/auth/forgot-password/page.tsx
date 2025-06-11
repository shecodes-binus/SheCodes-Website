"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import apiService from '@/lib/apiService'; // Use the shared apiService

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email) {
      toast.error('Please enter your email address.');
      setLoading(false);
      return;
    }

    try {
      // Corresponds to the backend endpoint: POST /auth/password-reset/request
      const response = await apiService.post('/auth/password-reset/request', { email });
      
      // The backend always returns a 202 with a generic message for security.
      // We display this message to the user.
      toast.success(response.data.msg);

    } catch (err: any) {
      // This catch block will primarily handle network/server errors, as the endpoint
      // is designed not to reveal whether an email exists or not.
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
              Forgot Password
            </h2>
            {/* <p className="mt-2 text-center text-sm text-gray-600">
              Enter your email and we'll send you a link to reset your password.
            </p> */}
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-lg font-semibold text-pink mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                // required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="block w-full appearance-none rounded-xl border border-[#bfbfbf] bg-white px-4 py-3 placeholder-[#bfbfbf] focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-1 disabled:opacity-50"
                placeholder="Enter your email here"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex w-full justify-center rounded-xl bg-[#7E52C5] px-4 py-3 text-base font-semibold text-white shadow-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Password Reset Link'}
              </button>
            </div>
            <div className="text-center">
              <Link href="/auth/login" className="font-semibold text-sm text-purple-2 hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;