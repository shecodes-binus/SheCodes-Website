// src/app/layout.tsx (Modified - Minimal Root Layout)
import type React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from 'react-hot-toast';
// Removed Header and Footer imports

const poppins = Poppins({
  subsets: ["latin"],
  // Add the weights and styles you want to use
  weight: ["300", "400", "500", "600", "700", "800"],
  // This is the key for Tailwind integration!
  variable: "--font-poppins", 
});

export const metadata: Metadata = {
  title: "SheCodes Society Binus",
  description: "Empowering girls in tech to lead with innovation, inspiration, and impact",
  generator: 'v0.dev',
  icons: {
    icon: '/logonotext.svg', 
  },
  openGraph: {
    images: [
      {
        url: '/logonotext.svg',
        width: 800,
        height: 600,
        alt: 'SheCodes Logo',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <AuthProvider>
          {/* ThemeProvider wraps everything */}
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {/* No Header/Footer wrapper here, just render children */}
            {children}
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#ffffff',
                  color: '#000',
                },
                // success: {
                //   duration: 3000,
                //   style: {
                //     background: '#10B981',
                //     color: '#fff',
                //   },
                // },
                // error: {
                //   duration: 4000,
                //   style: {
                //     background: '#EF4444',
                //     color: '#fff',
                //   },
                // },
              }}
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}