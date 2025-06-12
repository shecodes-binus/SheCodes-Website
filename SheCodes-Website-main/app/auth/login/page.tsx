// src/app/signup/page.tsx (or your preferred route)
"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import apiService from '@/lib/apiService'; // Use the new apiService
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth(); 
  
  // const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate inputs
    if (!email || !password) {
      toast.error('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Use URLSearchParams for OAuth2PasswordRequestForm
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    try {
      const response = await apiService.post('/auth/token', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      
      // Call the context login function, which handles storing the token
      // and redirecting based on role.
      login(response.data.access_token);
      toast.success('Login successful!');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response?.status === 401) {
        toast.error('Invalid password. Please try again.');
      } else if (err.response?.status === 403) {
        toast.error('Your account is not activated. Please check your email to verify.', { duration: 5000 });
      } else if (err.response?.status === 404) {
        toast.error('Email not found. Please register.', { duration: 5000 });
      } else {
        toast.error(err.response?.data?.detail || "An unexpected error occurred during login.");
      }
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
          <Image
            src="/blobs/blobs1.svg"
            alt="Abstract Shape"
            fill
            className='object-contain'
          />
        </div>
        <div className="absolute top-10 -right-20 w-[550px] h-[550px] transform z-10">
          <Image
            src="/blobs/blobs2.svg" 
            alt="Abstract Shape"
            fill
            className='object-contain'
          />
        </div>
        <div className="absolute top-20 -left-5 w-[600px] h-[600px] transform z-0">
          <Image
            src="/blobs/blobs3.svg" 
            alt="Abstract Shape"
            fill
            className='object-contain'
          />
        </div>
        {/* <div className="absolute w-80 h-80 bg-blueSky rounded-full -bottom-24 right-0 opacity-70 mix-blend-multiply filter blur-xl"></div>
        <div className="absolute w-72 h-72 bg-purple-2 rounded-full top-1/4 left-1/4 opacity-60 mix-blend-multiply filter blur-2xl"></div> */}

        {/* Content */}
        <div className="relative z-30 flex flex-col items-center justify-center w-full h-full">
            {/* Logo */}
            <div className="w-[400px] h-[400px] mb-6"> {/* Adjust size */}
                <Image
                src="/logos/shecodeslogohorizontal.svg" // Make sure this path is correct in /public
                alt="SheCodes Society Logo"
                width={600} // Match container width
                height={600} // Match container height
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
              Log In
            </h2>
          </div>

          {/* Login Form */}
          <form className="space-y-4" onSubmit={handleLogin}>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-md font-semibold text-pink mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="block w-full appearance-none rounded-xl border border-[#bfbfbf] bg-white px-4 py-3 placeholder-[#bfbfbf] focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-1"
                placeholder="Enter your email here"
              />
            </div>

            {/* Password Input */}
            <div className='relative'>
              <label htmlFor="password" className="block text-md font-semibold text-pink mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'} 
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="block w-full appearance-none rounded-xl border border-[#bfbfbf] bg-white px-4 py-3 placeholder-[#bfbfbf] focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-1"
                placeholder="Enter your password here"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-7 flex items-center px-4 text-gray-600">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className='text-right'>
              <Link href="/auth/forgot-password" className="font-semibold text-sm text-purple-2 hover:underline">
                Forgot Password
              </Link>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex w-full justify-center rounded-xl bg-[#7E52C5] px-4 py-3 text-base font-semibold text-white shadow-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </div>
          </form>

          {/* <div className='w-4/5 mx-auto space-y-6'> */}
            {/* Login Link */}
            <p className="text-center text-sm text-grey-3">
              Don't have an account?{' '}
              <Link href="/auth/register" className="font-semibold text-purple-2 hover:underline">
                Create Account
              </Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;