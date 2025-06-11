// /SheCodes-Website-main/app/auth/verify-email/page.tsx (New and Improved)
'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import apiService from '@/lib/apiService';
import { toast } from 'react-hot-toast'; // Assuming you have react-hot-toast for notifications

const VerifyEmailContent = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    if (!token) {
      setMessage('Invalid verification link. Token is missing.');
      setIsSuccess(false);
      setIsLoading(false);
      toast.error('Invalid verification link.');
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await apiService.get(`/auth/verify-email?token=${token}`);
        setMessage(response.data.msg || 'Email verified successfully!');
        setIsSuccess(true);
        toast.success('Your email has been verified!');
      } catch (error: any) {
        const errorMessage = error.response?.data?.detail || 'Verification failed. The link may be expired or invalid.';
        setMessage(errorMessage);
        setIsSuccess(false);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    // Delay the verification slightly to allow the loading spinner to be visible
    const timer = setTimeout(() => {
        verifyToken();
    }, 1000);

    return () => clearTimeout(timer); // Cleanup timer on component unmount

  }, [token]);

  // The Left Decorative Column (copied from your login page for consistency)
  const LeftColumn = () => (
    <div className="relative hidden lg:flex w-1/2 items-center justify-center bg-[#4A287F] text-white p-12 overflow-hidden">
      <div className="absolute bottom-1 left-0 w-[550px] h-[550px] transform z-20">
        <Image src="/blobs/blobs1.svg" alt="Abstract Shape" fill className="object-contain" />
      </div>
      <div className="absolute top-10 -right-20 w-[550px] h-[550px] transform z-10">
        <Image src="/blobs/blobs2.svg" alt="Abstract Shape" fill className="object-contain" />
      </div>
      <div className="absolute top-20 -left-5 w-[600px] h-[600px] transform z-0">
        <Image src="/blobs/blobs3.svg" alt="Abstract Shape" fill className="object-contain" />
      </div>
      <div className="relative z-30 flex flex-col items-center justify-center w-full h-full">
        <div className="w-[400px] h-[400px] mb-6">
          <Image src="/logos/shecodeslogohorizontal.svg" alt="SheCodes Society Logo" width={600} height={600} priority />
        </div>
      </div>
    </div>
  );

  // The Right Content Column, which changes based on state
  const RightColumn = () => (
    <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white p-8 md:p-12 lg:p-16 rounded-tl-3xl rounded-bl-3xl">
      <div className="w-full max-w-sm space-y-6 text-center">
        {isLoading && (
          <>
            <div className="w-16 h-16 mx-auto animate-spin rounded-full border-4 border-[#A56CC1] border-t-transparent"></div>
            <h2 className="text-3xl font-bold text-[#72A1E0]">Verifying...</h2>
            <p className="text-gray-600">Please wait while we confirm your email address.</p>
          </>
        )}

        {!isLoading && isSuccess && (
          <>
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-[#72A1E0]">Email Verified!</h2>
            <p className="text-gray-700">{message}</p>
            <Link href="/auth/login" className="block pt-4">
              <button className="w-full rounded-xl bg-[#7E52C5] px-6 py-3 text-base font-semibold text-white shadow-md hover:bg-[#7E52C5]/90 transition-colors">
                Proceed to Login
              </button>
            </Link>
          </>
        )}

        {!isLoading && !isSuccess && (
          <>
            <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-red-500">Verification Failed</h2>
            <p className="text-gray-700">{message}</p>
            <Link href="/auth/login" className="block pt-4">
              <button className="w-full rounded-xl bg-[#7E52C5] px-6 py-3 text-base font-semibold text-white shadow-md hover:bg-[#7E52C5]/90 transition-colors">
                Back to Login
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-stretch">
      <LeftColumn />
      <RightColumn />
    </div>
  );
};

const VerifyEmailPage = () => (
  // Suspense is necessary for useSearchParams to work in a page component
  <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center bg-[#4A287F]">
      <div className="w-16 h-16 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
    </div>
  }>
    <VerifyEmailContent />
  </Suspense>
);

export default VerifyEmailPage;