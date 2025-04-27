import Link from "next/link"
import Image from 'next/image';
import { Instagram, Linkedin, Github, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full pt-12 pb-8">
      <div className="mx-auto py-4">
        <div className="flex justify-around items-center md:items-center flex-col md:flex-row gap-y-8 md:gap-y-0 lg:px-36 md:px-20 px-12">
          <div className="space-y-4 text-center md:text-left flex-1">
            <Link href="/" className="inline-block mr-3">
              <Image src="/logos/shecodeslogo.svg" alt="SheCodes Logo" width={150} height={150} />
            </Link>
            <Link href="/" className="inline-block">
              <Image src="/logos/binuslogo.svg" alt="Binus Logo" width={100} height={100} />
            </Link>
            <p className="text-sm text-grey-3">
              Empowering girls in tech to lead <br/>with innovation, inspiration, and impact.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <Link href="https://www.instagram.com/shecodes.binus/" target="_blank" rel="noopener noreferrer">
                <div className="rounded-full border border-grey-3 hover:bg-grey-1 transition-colors duration-200 p-2">
                  <Instagram className="h-5 w-5 text-grey-3" />
                  <span className="sr-only">Instagram</span>
                </div>
              </Link>
              <Link href="https://www.youtube.com/@binus_csbi" target="_blank" rel="noopener noreferrer">
                <div className="rounded-full border border-grey-3 hover:bg-grey-1 transition-colors duration-200 p-2">
                  <Youtube className="h-5 w-5 text-grey-3" />
                  <span className="sr-only">Youtube</span>
                </div>
              </Link>
              <Link href="https://www.linkedin.com/company/shecodes-binus/" target="_blank" rel="noopener noreferrer">
                <div className="rounded-full border border-grey-3 hover:bg-grey-1 transition-colors duration-200 p-2">
                  <Linkedin className="h-5 w-5 text-grey-3" />
                  <span className="sr-only">LinkedIn</span>
                </div>
              </Link>
            </div>
          </div>
          <div className="flex md:flex-row flex-col gap-y-10 justify-between text-center md:text-left bg-white flex-1">
            <div className="space-y-4">
              <h3 className="text-base font-bold uppercase tracking-wider text-gray-900">Quick Links</h3>
              <ul className="space-y-2 text-sm text-grey-3">
                <li>
                  <Link href="/app/" className="hover:text-purple-2 transition-all duration-200">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/app/events" className="hover:text-purple-2 transition-all duration-200">
                    Events
                  </Link>
                </li>
                <li>
                  <Link href="/app/mentorship" className=" hover:text-purple-2 transition-all duration-200">
                    Partnership and Mentorship
                  </Link>
                </li>
                <li>
                  <Link href="/app/alumni" className=" hover:text-purple-2 transition-all duration-200">
                    Alumni Hub
                  </Link>
                </li>
                <li>
                  <Link href="/app/blog" className=" hover:text-purple-2 transition-all duration-200">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/app/contact" className=" hover:text-purple-2 transition-all duration-200">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            {/* <div className="space-y-4">
              <h3 className="text-base font-bold uppercase tracking-wider text-gray-900">Programs</h3>
              <ul className="space-y-2 text-sm text-grey-3">
                <li>
                  <Link href="/app/workshops" className="hover:text-purple-2 transition-all duration-200">
                    Workshops
                  </Link>
                </li>
                <li>
                  <Link href="/app/hackathons" className="hover:text-purple-2 transition-all duration-200">
                    Hackathons
                  </Link>
                </li>
                <li>
                  <Link href="/app/courses" className="hover:text-purple-2 transition-all duration-200">
                    Courses
                  </Link>
                </li>
                <li>
                  <Link href="/app/mentorship" className="hover:text-purple-2 transition-all duration-200">
                    Mentorship Program
                  </Link>
                </li>
              </ul>
            </div> */}
            <div className="space-y-4">
              <h3 className="text-base font-bold uppercase tracking-wider">Contact</h3>
              <ul className="space-y-2 text-sm text-grey-3 ">
                <li className="hover:text-purple-2 transition-all duration-200">
                  Binus University International,
                  <br />
                  JWC Campus & Fx Sudirman Campus
                  <br />
                  Jakarta, Indonesia
                </li>
                <li>
                  <Link href="mailto:shecodes.binus@gmail.com" className="hover:text-purple-2 transition-all duration-200">
                    shecodes.binus@gmail.com
                  </Link>
                </li>
                <li>
                  <Link href="tel:+6212345678" className="hover:text-purple-2 transition-all duration-200">
                    +62 123 4567 890
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} SheCodes Society Binus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
