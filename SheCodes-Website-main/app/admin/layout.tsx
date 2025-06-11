'use client';

import React, { useEffect } from "react"
// import type { Metadata } from "next"
import { usePathname } from 'next/navigation';
import { Inter } from "next/font/google"
import "../globals.css"
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ThemeProvider } from "@/components/theme-provider"
import Sidebar from "@/components/admin/sidebar"
import Header from "@/components/admin/header"

const inter = Inter({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "SheCodes Society Binus",
//   description: "Empowering girls in tech to lead with innovation, inspiration, and impact",
//     generator: 'v0.dev'
// }

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // <-- Get the current pathname

  const showHeader = pathname !== '/admin/settings';

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login'); // Not logged in, redirect to login
    } else if (!loading && !isAdmin) {
      router.push('/app/dashboard'); // Logged in but NOT an admin, redirect to user dashboard
    }
  }, [isAuthenticated, isAdmin, loading, router]);

  // Show a loading screen while auth state is being determined
  if (loading || !isAdmin) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div>Loading and verifying access...</div>
      </div>
    );
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col ">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-64 bg-grey-1 py-6">
              {showHeader && (
                <Header />
              )}
                <main className="flex-1 overflow-y-auto">
                {children}
                </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}


import '../globals.css'