import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Sidebar from "@/components/admin/sidebar"
import Header from "@/components/admin/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SheCodes Society Binus",
  description: "Empowering girls in tech to lead with innovation, inspiration, and impact",
    generator: 'v0.dev'
}

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col ">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-64 bg-grey-1 py-6"> {/* Adjust margin-left to match sidebar width */}
                <Header />
                <main className="flex-1 overflow-y-auto"> {/* Allow main content to scroll */}
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