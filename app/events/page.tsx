import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function EventsPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="space-y-12">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-800">
            Events & Workshops
          </h1>
          <p className="text-gray-600 md:text-xl">Join us for learning, networking, and inspiration</p>
        </div>

        {/* Events Tabs */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>

          {/* Upcoming Events */}
          <TabsContent value="upcoming" className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Event 1 */}
              <Card>
                <CardHeader className="p-0">
                  <div className="relative h-48 w-full">
                    <Image
                      src="/placeholder.svg?height=200&width=400"
                      alt="Workshop: Intro to Web Development"
                      fill
                      className="object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-4 right-4 bg-purple-600">Workshop</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <CardTitle className="text-xl text-purple-800">Intro to Web Development</CardTitle>
                  <CardDescription>
                    Learn the basics of HTML, CSS, and JavaScript in this hands-on workshop.
                  </CardDescription>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>May 15, 2025</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>10:00 AM - 2:00 PM</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      <span>Binus University, Anggrek Campus</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Register Now</Button>
                </CardFooter>
              </Card>

              {/* Event 2 */}
              <Card>
                <CardHeader className="p-0">
                  <div className="relative h-48 w-full">
                    <Image
                      src="/placeholder.svg?height=200&width=400"
                      alt="Panel Discussion: Women in AI"
                      fill
                      className="object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-4 right-4 bg-teal-600">Panel</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <CardTitle className="text-xl text-teal-800">Women in AI: Breaking Barriers</CardTitle>
                  <CardDescription>
                    Join our panel of experts discussing challenges and opportunities in AI.
                  </CardDescription>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>June 5, 2025</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>4:00 PM - 6:00 PM</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      <span>Online (Zoom)</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-teal-600 hover:bg-teal-700">Register Now</Button>
                </CardFooter>
              </Card>

              {/* Event 3 */}
              <Card>
                <CardHeader className="p-0">
                  <div className="relative h-48 w-full">
                    <Image
                      src="/placeholder.svg?height=200&width=400"
                      alt="Hackathon: Tech for Good"
                      fill
                      className="object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-4 right-4 bg-rose-600">Hackathon</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <CardTitle className="text-xl text-rose-800">Hackathon: Tech for Good</CardTitle>
                  <CardDescription>Build solutions that address social and environmental challenges.</CardDescription>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>July 10-12, 2025</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>48-hour event</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      <span>Binus University, Alam Sutera Campus</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-rose-600 hover:bg-rose-700">Register Now</Button>
                </CardFooter>
              </Card>
            </div>
            <div className="text-center">
              <Link href="/events/calendar">
                <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                  View Full Calendar
                </Button>
              </Link>
            </div>
          </TabsContent>

          {/* Past Events */}
          <TabsContent value="past" className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Past Event 1 */}
              <Card>
                <CardHeader className="p-0">
                  <div className="relative h-48 w-full">
                    <Image
                      src="/placeholder.svg?height=200&width=400"
                      alt="Workshop: Data Science Fundamentals"
                      fill
                      className="object-cover rounded-t-lg opacity-80"
                    />
                    <Badge className="absolute top-4 right-4 bg-gray-600">Past Event</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <CardTitle className="text-xl text-gray-800">Data Science Fundamentals</CardTitle>
                  <CardDescription>
                    An introduction to data analysis, visualization, and machine learning.
                  </CardDescription>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>March 20, 2025</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Recap
                  </Button>
                </CardFooter>
              </Card>

              {/* Past Event 2 */}
              <Card>
                <CardHeader className="p-0">
                  <div className="relative h-48 w-full">
                    <Image
                      src="/placeholder.svg?height=200&width=400"
                      alt="Networking: Tech Career Fair"
                      fill
                      className="object-cover rounded-t-lg opacity-80"
                    />
                    <Badge className="absolute top-4 right-4 bg-gray-600">Past Event</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <CardTitle className="text-xl text-gray-800">Tech Career Fair</CardTitle>
                  <CardDescription>Connect with top tech companies and explore career opportunities.</CardDescription>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>February 15, 2025</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Recap
                  </Button>
                </CardFooter>
              </Card>

              {/* Past Event 3 */}
              <Card>
                <CardHeader className="p-0">
                  <div className="relative h-48 w-full">
                    <Image
                      src="/placeholder.svg?height=200&width=400"
                      alt="Workshop: Mobile App Development"
                      fill
                      className="object-cover rounded-t-lg opacity-80"
                    />
                    <Badge className="absolute top-4 right-4 bg-gray-600">Past Event</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <CardTitle className="text-xl text-gray-800">Mobile App Development</CardTitle>
                  <CardDescription>Learn to build cross-platform mobile apps with React Native.</CardDescription>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>January 25, 2025</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Recap
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <div className="text-center">
              <Link href="/events/archive">
                <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                  View All Past Events
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
