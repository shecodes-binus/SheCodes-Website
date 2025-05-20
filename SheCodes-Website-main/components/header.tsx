"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from 'next/image';
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-white px-10">
      <div className="container flex h-16 items-center justify-between ">
        <div className="flex items-center">
          <Link href="/app/" className="font-bold text-xl text-purple-800">
            <Image src="/logos/shecodeslogo.svg" alt="SheCodes Logo" width={120} height={120} />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 items-center">
          <NavigationMenu className="flex-1 justify-center">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/app/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>About Us</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/app/events" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Events</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/app/mentorship" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Partnership & Mentorship</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/app/alumni" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Alumni Hub</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/app/blog" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Blog</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/app/contact" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Contact</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <div className="flex items-center"> 
             <Link href="/auth/login">
               <Button className="bg-transparent hover:bg-purple-2 rounded-3xl px-8 text-blueSky border-blueSky border-2 hover:bg-blueSky hover:text-white">Login</Button>
             </Link>
           </div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {/* <Link href="/dashboard" className="hidden md:block">
            <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
              Member Dashboard
            </Button>
          </Link> */}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 pt-6">
                <Link href="/app/" className="font-bold text-xl text-purple-2" onClick={() => setIsOpen(false)}>
                  <Image src="/shecodeslogo.svg" alt="SheCodes Logo" width={180} height={180} />
                </Link>
                <nav className="flex flex-col gap-4">
                  <Link href="/app/" onClick={() => setIsOpen(false)}>
                    About Us
                  </Link>
                  <Link href="/app/events" onClick={() => setIsOpen(false)}>
                    Events
                  </Link>
                  <Link href="/app/mentorship" onClick={() => setIsOpen(false)}>
                    Partnership & Mentorship
                  </Link>
                  <Link href="/app/alumni" onClick={() => setIsOpen(false)}>
                    Alumni Hub
                  </Link>
                  <Link href="/app/blog" onClick={() => setIsOpen(false)}>
                    Blog
                  </Link>
                  <Link href="/app/contact" onClick={() => setIsOpen(false)}>
                    Contact
                  </Link>
                </nav>
                <div className="flex flex-col gap-2 mt-4">
                  {/* <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full border-purple-200 text-purple-600 hover:bg-purple-50">
                      Member Dashboard
                    </Button>
                  </Link> */}
                  <Link href="/app/contact" onClick={() => setIsOpen(false)}>
                    <Button className="w-2/5 bg-blueSky text-white hover:bg-blue">Join Us</Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a"> & { title: string }>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"
