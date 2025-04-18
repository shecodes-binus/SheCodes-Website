import Link from "next/link"
import { Instagram, Linkedin, Github } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container px-4 py-12 md:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-purple-800">SheCodes Society</h3>
            <p className="text-sm text-gray-600">
              Empowering girls in tech to lead with innovation, inspiration, and impact.
            </p>
            <div className="flex space-x-4">
              <Link href="https://www.instagram.com/shecodes.binus/" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5 text-gray-600 hover:text-purple-600" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://www.linkedin.com/company/shecodes-binus/" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5 text-gray-600 hover:text-purple-600" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5 text-gray-600 hover:text-purple-600" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-purple-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-600 hover:text-purple-600">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/mentorship" className="text-gray-600 hover:text-purple-600">
                  Mentorship
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-purple-600">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-purple-600">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Programs</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/workshops" className="text-gray-600 hover:text-purple-600">
                  Workshops
                </Link>
              </li>
              <li>
                <Link href="/hackathons" className="text-gray-600 hover:text-purple-600">
                  Hackathons
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-gray-600 hover:text-purple-600">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/mentorship" className="text-gray-600 hover:text-purple-600">
                  Mentorship Program
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-600">
                Binus University, Anggrek Campus
                <br />
                Jakarta, Indonesia
              </li>
              <li>
                <Link href="mailto:shecodes.binus@gmail.com" className="text-gray-600 hover:text-purple-600">
                  shecodes.binus@gmail.com
                </Link>
              </li>
              <li>
                <Link href="tel:+6212345678" className="text-gray-600 hover:text-purple-600">
                  +62 123 4567 890
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} SheCodes Society Binus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
