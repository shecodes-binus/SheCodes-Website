import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar, Users, BookOpen, Sparkles } from "lucide-react"
import UpcomingEvents from "@/components/upcoming-events"
import FeaturedStories from "@/components/featured-stories"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-purple-50 to-teal-50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-purple-800">
                  Empowering Girls in Tech
                </h1>
                <p className="max-w-[600px] text-gray-600 md:text-xl">
                  SheCodes Society Binus is dedicated to inspiring and equipping women with the skills needed to thrive
                  in technology.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/about">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/events">
                  <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                    Upcoming Events
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="/placeholder.svg?height=500&width=500"
                alt="SheCodes Society Binus"
                width={500}
                height={500}
                className="rounded-lg object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-800">
                Our Mission
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                To inspire and equip girls with the skills needed to thrive in technology through education, mentorship,
                and community.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mt-8">
              <div className="flex flex-col items-center space-y-2 border border-purple-100 p-6 rounded-lg bg-white shadow-sm">
                <div className="p-3 rounded-full bg-purple-100">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-purple-800">Innovation</h3>
                <p className="text-gray-600 text-center">
                  Fostering creative problem-solving and cutting-edge tech skills
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-teal-100 p-6 rounded-lg bg-white shadow-sm">
                <div className="p-3 rounded-full bg-teal-100">
                  <BookOpen className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-teal-800">Inspiration</h3>
                <p className="text-gray-600 text-center">Connecting with role models and success stories in tech</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-rose-100 p-6 rounded-lg bg-white shadow-sm">
                <div className="p-3 rounded-full bg-rose-100">
                  <Users className="h-6 w-6 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-rose-800">Impact</h3>
                <p className="text-gray-600 text-center">Creating meaningful change in the tech industry and beyond</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Preview */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-purple-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-800">
                Upcoming Events
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join us for workshops, talks, and networking opportunities
              </p>
            </div>
            <UpcomingEvents />
            <Link href="/events">
              <Button variant="outline" className="mt-8 border-purple-200 text-purple-600 hover:bg-purple-50">
                View All Events
                <Calendar className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-800">
                Success Stories
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Hear from our alumni and how SheCodes has impacted their journey
              </p>
            </div>
            <FeaturedStories />
            <Link href="/about#success-stories">
              <Button variant="outline" className="mt-8 border-purple-200 text-purple-600 hover:bg-purple-50">
                Read More Stories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-600 to-teal-600 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Join Our Community</h2>
              <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Be part of a supportive network of women in tech and access exclusive resources
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/contact">
                <Button className="bg-white text-purple-600 hover:bg-gray-100">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/mentorship">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Become a Mentor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
