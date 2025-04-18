import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

export default function MentorshipPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="space-y-12">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-800">
            Partnership & Mentorship
          </h1>
          <p className="text-gray-600 md:text-xl">Connect with industry experts and organizations</p>
        </div>

        {/* Mentorship Program */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl text-purple-800">Mentorship Program</h2>
            <p className="text-gray-600">Guidance and support from experienced professionals</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <p className="text-gray-600">
                Our mentorship program connects SheCodes members with experienced professionals in the tech industry.
                Mentors provide guidance, career advice, and technical support to help mentees achieve their goals.
              </p>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-purple-800">Program Benefits</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>One-on-one guidance from industry professionals</li>
                  <li>Personalized career development plans</li>
                  <li>Technical skill development</li>
                  <li>Networking opportunities</li>
                  <li>Resume and interview preparation</li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/mentorship/apply">
                  <Button className="bg-purple-600 hover:bg-purple-700">Apply as Mentee</Button>
                </Link>
                <Link href="/mentorship/become-mentor">
                  <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                    Become a Mentor
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Mentorship Program"
                width={600}
                height={400}
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </section>

        {/* Featured Mentors */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl text-purple-800">Meet Our Mentors</h2>
            <p className="text-gray-600">Industry experts dedicated to supporting the next generation</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={`/placeholder.svg?height=96&width=96`} alt={`Mentor ${i}`} />
                    <AvatarFallback>M{i}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-bold">Mentor Name</h3>
                    <p className="text-sm text-gray-600">Senior Developer at Tech Company</p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="outline" className="bg-purple-50 text-purple-800 hover:bg-purple-100">
                      Web Development
                    </Badge>
                    <Badge variant="outline" className="bg-teal-50 text-teal-800 hover:bg-teal-100">
                      UX Design
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm">
                    "I'm passionate about helping women navigate the tech industry and develop their skills."
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Link href="/mentorship/mentors">
              <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                View All Mentors
              </Button>
            </Link>
          </div>
        </section>

        {/* Partnership */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl text-purple-800">Partner With Us</h2>
            <p className="text-gray-600">Collaborate with SheCodes to support women in tech</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <p className="text-gray-600">
                We partner with companies and organizations that share our mission of empowering women in tech. Our
                partners provide resources, mentorship, and opportunities for our community.
              </p>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-purple-800">Partnership Opportunities</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Sponsor workshops and events</li>
                  <li>Provide mentors for our mentorship program</li>
                  <li>Host site visits and company tours</li>
                  <li>Offer internships and job opportunities</li>
                  <li>Provide technical resources and tools</li>
                </ul>
              </div>
              <Link href="/partnership/apply">
                <Button className="bg-purple-600 hover:bg-purple-700 mt-4">Become a Partner</Button>
              </Link>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Partnership"
                width={600}
                height={400}
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </section>

        {/* Partner Companies */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl text-purple-800">Our Partners</h2>
            <p className="text-gray-600">Organizations that support our mission</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex items-center justify-center p-6 bg-white rounded-lg shadow-sm border">
                <Image
                  src={`/placeholder.svg?height=80&width=160`}
                  alt={`Partner Company ${i}`}
                  width={160}
                  height={80}
                  className="max-h-16 w-auto"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
