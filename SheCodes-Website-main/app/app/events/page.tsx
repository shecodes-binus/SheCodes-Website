"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { CombinedEventData } from '@/types/events'; 
import { allEventsData } from '@/data/dummyEvent'; 
import { getEventStatus, formatEventDateTime, formatStartDate } from '@/lib/eventUtils'; // Adjust path

export default function EventsPage() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

  const now = new Date();
  const status = new Date(event.date) > now ? "upcoming" : "past";
  
  useEffect(() => {
    fetch("http://localhost:8000/events")
      .then(res => res.json())
      .then(data => {
        const now = new Date();
        const upcoming = data.filter((event: any) => new Date(event.date) > now);
        const past = data.filter((event: any) => new Date(event.date) <= now);
        setUpcomingEvents(upcoming);
        setPastEvents(past);
      });
  }, []);

  return (
    <div className="container px-4 py-12 md:py-16">
      <div className="space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-pink text-center">
            Events & Workshops
          </h1>
          <p className="text-black md:text-lg text-center">Join us for learning, networking, and inspiration</p>
        </div>

        {/* Events Tabs */}
        <Tabs defaultValue="upcoming" className=" mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-[#FFD4E3] text-pink">
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>

          {/* Upcoming Events */}
          <TabsContent value="upcoming" className="space-y-16">
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event, index) => (
                <Card key={index}>
                  <CardHeader className="p-0">
                    <div className="relative h-72 w-full">
                      <Image
                        src={event.imageSrc}
                        alt={event.image_alt}
                        fill
                        className="object-cover rounded-xl shadow-lg"
                      />
                      <Badge className={`absolute top-4 right-4 text-white ${
                        event.type === "Workshop" ? "bg-blueSky" :
                        event.type === "Seminar" ? "bg-pink" :
                        event.type === "Mentorship" ? "bg-purple-2" : "bg-gray-600"
                      }`}>{event.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="py-6 px-4">
                    <CardTitle className="text-pink mb-4">{event.title}</CardTitle>
                    <CardDescription className="leading-relaxed mb-4">{event.description}</CardDescription>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="mr-2 shrink-0 h-4 w-4" />
                        <span className="text-grey-3">{formatStartDate(event.startDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 shrink-0 h-4 w-4" />
                        <span className="text-grey-3">{formatEventDateTime(event.startDate, event.endDate).timeRange}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-2 shrink-0 h-4 w-4" />
                        <span className="text-grey-3">{event.location}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="px-4 py-2">
                    <Link href={`/app/register-event/${event.id}`} passHref legacyBehavior={false} className="w-full">
                    <Button className="w-full bg-blueSky text-white font-semibold hover:shadow-lg transition-all duration-200 hover:bg-blueSky">Register Now</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
            {upcomingEvents.length > 6 ? (
              <div className="text-center">
                  <Button variant="outline" className="border-blueSky rounded-xl font-semibold text-blueSky hover:bg-blueSky hover:text-white ">
                    View All Upcoming Events
                  </Button>
              </div>) : 
              null
            }
          </TabsContent>

          {/* Past Events */}
          <TabsContent value="past" className="space-y-8">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map((event, index) => (
                <Card key={index} className="p-0">
                  <CardHeader className="p-0">
                    <div className="relative h-72 w-full">
                      <Image
                        src={event.imageSrc}
                        alt={event.image_alt}
                        fill
                        className="object-cover rounded-xl"
                      />
                      <Badge className={`absolute top-4 right-4 text-white ${
                        event.type === "Workshop" ? "bg-blueSky" :
                        event.type === "Seminar" ? "bg-pink" :
                        event.type === "Mentorship" ? "bg-purple-2" : "bg-gray-600"
                      }`}>{event.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="py-6 px-4">
                    <CardTitle className="text-pink mb-4">{event.title}</CardTitle>
                    <CardDescription className="leading-relaxed mb-4">{event.description}</CardDescription>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="mr-2 shrink-0 h-4 w-4" />
                        <span className="text-grey-3">{formatStartDate(event.startDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 shrink-0 h-4 w-4" />
                        <span className="text-grey-3">{formatEventDateTime(event.startDate, event.endDate).timeRange}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-2 shrink-0 h-4 w-4" />
                        <span className="text-grey-3">{event.location}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="px-4 py-2">
                    <Button className="w-full bg-[#BFBFBF] text-white font-semibold" disabled>Event Finished</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            {pastEvents.length > 6 ? (
              <div className="text-center">
                <Button variant="outline" className="border-blueSky rounded-xl font-semibold text-blueSky hover:bg-blueSky hover:text-white ">
                  View All Past Events
                </Button>
              </div>) : 
            null
            }
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
