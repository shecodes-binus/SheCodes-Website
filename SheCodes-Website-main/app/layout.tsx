// src/app/layout.tsx (Modified - Minimal Root Layout)
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
// Removed Header and Footer imports

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        {/* ThemeProvider wraps everything */}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
           {/* No Header/Footer wrapper here, just render children */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}