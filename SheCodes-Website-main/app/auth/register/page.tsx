// src/app/signup/page.tsx (or your preferred route)
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc'; // Google Icon
import { FaGithub } from 'react-icons/fa'; // GitHub Icon

const SignupPage: React.FC = () => {
  const [form, setForm] = useState({
      name: '',
      email: '',
      password: '',
      role: 'member',
      profile_picture: null,
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('api/users/', form);
      router.push('/auth/login');
    } catch (error) {
      console.error(error);
      alert("Signup failed: " + (error as any).response?.data?.detail || "Unknown error");
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
            layout="fill"
            objectFit="contain"
          />
        </div>
        <div className="absolute top-10 -right-20 w-[550px] h-[550px] transform z-10">
          <Image
            src="/blobs/blobs2.svg" 
            alt="Abstract Shape"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <div className="absolute top-20 -left-5 w-[600px] h-[600px] transform z-0">
          <Image
            src="/blobs/blobs3.svg" 
            alt="Abstract Shape"
            layout="fill"
            objectFit="contain"
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
              className="" // No absolute needed if centered in flex container
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
          <form className="space-y-4" action="#" onSubmit={handleSubmit}>
            {/* Full Name Input */}
            <div>
              <label htmlFor="full-name" className="block text-md font-semibold text-pink mb-2">
                Full Name
              </label>
              <input
                id="full-name"
                name="full-name"
                type="text"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                required
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
                onChange={handleChange}
                autoComplete="email"
                required
                className="block w-full appearance-none rounded-xl border border-[#bfbfbf] bg-white px-4 py-3  placeholder-[#bfbfbf] focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-1"
                placeholder="Enter your email here"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-md font-semibold text-pink mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
                className="block w-full appearance-none rounded-xl border border-[#bfbfbf] bg-white px-4 py-3 placeholder-[#bfbfbf] focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-1"
                placeholder="Enter your password here"
              />
            </div>

            {/* hidden default role (or make dropdown if needed) */}
            <input type="hidden" name="role" value="member" />

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="mt-6 flex w-full justify-center rounded-xl bg-[#7E52C5] px-4 py-3 text-base font-semibold text-white shadow-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 transition-colors"
              >
                Create Account
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