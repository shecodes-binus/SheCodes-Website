// src/app/signup/page.tsx (or your preferred route)
"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import apiService from '@/lib/apiService';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignupPage: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      toast.error('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (form.password.length < 9) {
      toast.error('Password must be at least 9 characters long');
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await apiService.post('/auth/register', form);
      // On success, show success message and redirect to login
      toast.success('Registration successful! Please check your email to verify your account.');
      router.push('/auth/login');
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.response?.status === 400) {
        toast.error('An account with this email already exists.');
      } else {
        toast.error(err.response?.data?.detail || 'An unknown error occurred.');
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
            className="object-contain"
          />
        </div>
        <div className="absolute top-10 -right-20 w-[550px] h-[550px] transform z-10">
          <Image
            src="/blobs/blobs2.svg" 
            alt="Abstract Shape"
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute top-20 -left-5 w-[600px] h-[600px] transform z-0">
          <Image
            src="/blobs/blobs3.svg" 
            alt="Abstract Shape"
            fill
            className="object-contain"
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
        <div className="w-full px-12 space-y-10">
          {/* Title */}
          <div>
            <h2 className="text-4xl font-bold text-center text-blueSky">
              Create your Account
            </h2>
          </div>

          {/* Signup Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name Input */}
            <div>
              <label htmlFor="name" className="block text-md font-semibold text-pink mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                disabled={loading}
                onChange={handleChange}
                autoComplete="name"
                className="block w-full appearance-none rounded-xl border border-[#bfbfbf] bg-white px-4 py-3 placeholder-[#bfbfbf] focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-1"
                placeholder="Enter your full name here"
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-md font-semibold text-pink mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                disabled={loading}
                onChange={handleChange}
                autoComplete="email"
                className="block w-full appearance-none rounded-xl border border-[#bfbfbf] bg-white px-4 py-3  placeholder-[#bfbfbf] focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-1"
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
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete="new-password"
                className="block w-full appearance-none rounded-xl border border-[#bfbfbf] bg-white px-4 py-3 placeholder-[#bfbfbf] focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-1"
                placeholder="Enter your password here"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-7 flex items-center px-4 text-gray-600">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Confirm Password Input */}
            <div className='relative'>
              <label htmlFor="confirmPassword" className="block text-md font-semibold text-pink mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'} 
                value={form.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                autoComplete="new-password"
                className="block w-full appearance-none rounded-xl border border-[#bfbfbf] bg-white px-4 py-3 placeholder-[#bfbfbf] focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-1"
                placeholder="Confirm your password"
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 top-7 flex items-center px-4 text-gray-600">
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* hidden default role (or make dropdown if needed) */}
            {/* <input type="hidden" name="role" value="member" /> */}

            {/* Submit Button */}
            <div>
              <button type="submit" disabled={loading} className="mt-6 flex w-full justify-center rounded-xl bg-[#7E52C5] px-4 py-3 text-base font-semibold text-white shadow-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className='mx-auto space-y-6'> 
            {/* {/* Login Link */}
            <p className="text-center text-sm text-black/50">
              Already have a account?{' '}
              <Link href="/auth/login" className="font-semibold text-purple-2 hover:underline">
                Log in
              </Link>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default SignupPage;