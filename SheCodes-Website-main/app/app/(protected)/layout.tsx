"use client"

import type React from "react"
import { Inter } from "next/font/google"
// import './globals.css'
import { useAuth } from "@/contexts/AuthContext";import { useRouter } from "next/navigation";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] })

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for the auth status to be determined
    if (loading) {
      return;
    }
    // If not authenticated, redirect
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return (
      // Using a simple loading indicator that fills the screen
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <p className="text-lg font-semibold text-gray-700">Verifying access...</p>
      </div>
    );
  }

  return <>{children}</>;
}


