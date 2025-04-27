import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, CheckCircle2, ArrowUp } from "lucide-react";

import { allEventsData } from '@/data/dummyEvent'; 
import { ScrollUpButton } from "@/components/scroll-up-button";
import type { CombinedEventData } from '@/types/events'; 
import { normalizeDate, formatEventGroupDate, calculateDuration, formatEventDateTime, formatStartDate } from '@/lib/eventUtils';

function getEventDataById(id: string): CombinedEventData | undefined {
    // Convert id from string to number for comparison
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
        return undefined; // Handle cases where id is not a valid number
    }
    return allEventsData.find(event => event.id === numericId);
}

export default function RegisterEventPage( { params }: { params: { id: string } }) {

    const eventData = getEventDataById(params.id);

    if (!eventData) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold text-red-600">Event Not Found</h1>
                <p className="text-gray-600 mt-4">
                    Sorry, we couldn't find the event you were looking for.
                </p>
                <Link href="/events" className="mt-6 inline-block">
                    <Button variant="outline">Back to Events</Button>
                </Link>
            </div>
        );
    }

  return (
    <div className="container mx-auto py-8 md:py-16 space-y-16 md:space-y-24">

      {/* --- Hero Section --- */}
      <section className="grid lg:grid-cols-2 gap-8 lg:gap-24 items-center">
        {/* Text Content */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-5xl lg:text-6xl font-bold text-blueSky tracking-normal">
            {eventData.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            {eventData.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-gray-200 text-grey-3 hover:bg-gray-300 px-4 py-1 text-base">
                {tag}
              </Badge>
            ))}
          </div>
          <p className="text-base text-gray-600 leading-relaxed">
            {eventData.description}
          </p>
          {/* Info Box */}
          <div className="rounded-xl p-6 space-y-6 border border-gray-200 shadow-md text-base font-semibold">
            <div className="space-y-3">
              <div className="flex items-center text-black font-normal">
                <Calendar className="mr-3 shrink-0 h-5 w-5 text-blueSky" />
                <span>{formatEventDateTime(eventData.startDate, eventData.endDate).dateRange}</span>
              </div>
              <div className="flex items-center text-black font-normal">
                <Clock className="mr-3 shrink-0 h-5 w-5 text-blueSky" />
                <span>{formatEventDateTime(eventData.startDate, eventData.endDate).timeRange}</span>
              </div>
              <div className="flex items-start text-black font-normal"> {/* items-start for long text */}
                <MapPin className="mr-3 shrink-0 h-5 w-5 text-blueSky flex-shrink-0" />
                <span>{eventData.location}</span>
              </div>
            </div>
            <Link href="/auth/login" passHref legacyBehavior>
                <a className="block"> {/* Opens in new tab */}
                    <Button size="lg" className="w-full bg-blueSky hover:shadow-lg hover:bg-blueSky text-white text-base rounded-full">
                        Register Now
                    </Button>
                 </a>
            </Link>
          </div>
        </div>

        {/* Image Content */}
        <div className="relative aspect-video lg:aspect-square rounded-lg overflow-hidden shadow-lg">
          <Image
            src={eventData.imageSrc} // Make sure this image exists in /public
            alt={eventData.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <Badge className={`absolute top-6 right-6 text-white px-5 py-3 rounded-full text-sm ${
              eventData.type === "Workshop" ? "bg-blueSky" : "bg-pink" // Example conditional color
            }`}
          >
            {eventData.type}
          </Badge>
        </div>
      </section>

      {/* --- Tools Section --- */}
      <section className="text-center space-y-6">
        <h2 className="text-4xl font-bold text-pink">Tools</h2>
        <div className="flex justify-center items-center gap-8 md:gap-16 flex-wrap">
          {eventData.tools.map((tool) => (
            <div key={tool.name} className="flex flex-col items-center gap-2">
               <Image
                 src={tool.logoSrc} // Make sure logos exist in /public/logos
                 alt={`${tool.name} logo`}
                 width={220} // Adjust size as needed
                 height={220}
                 className="object-contain"
               />
               {/* <span className="text-sm text-gray-600">{tool.name}</span> */}
            </div>
          ))}
        </div>
      </section>

      {/* --- Key Points Section --- */}
      <section className="space-y-12">
        <h2 className="text-4xl font-bold text-pink text-center">Key Points</h2>
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-4 mx-auto">
          {eventData.keyPoints.map((point, index) => (
            <div key={index} className="flex items-center gap-5">
              <CheckCircle2 className="h-10 w-10 text-blueSky flex-shrink-0" />
              <p className="text-gray-700">{point}</p>
            </div>
          ))}
        </div>
      </section>

       {/* --- About Mentors Section --- */}
      <section className="bg-gradient-to-b from-blueSky to-purple-2 py-10 md:py-12 px-6 md:px-10 rounded-xl">
          <h2 className="text-3xl font-bold text-left mb-8 text-white">About Mentors</h2>
          <div className="space-y-6 mx-auto">
              {eventData.mentors.map((mentor) => (
                  <div key={mentor.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-6 border border-purple-2/30">
                      <Image
                        src="/photo.png"
                        alt="SheCodes Society Binus"
                        width={100}
                        height={100}
                        className="rounded-lg object-cover"
                        priority />
                      <div className="space-y-2">
                          <h3 className="text-xl font-semibold text-gray-900">{mentor.name}</h3>
                          <p className="text-sm font-medium text-pink">{mentor.occupation}</p>
                          <p className="text-gray-600 text-sm leading-relaxed">{mentor.description}</p>
                      </div>
                  </div>
              ))}
          </div>
      </section>

       {/* --- Why Do You Need These Skills Section --- */}
      <section className="space-y-8">
        <h2 className="text-4xl font-bold text-pink text-center">Why Do You Need These Skills?</h2>
        <div className="flex flex-wrap justify-center gap-16 md:gap-20">
          {eventData.skillsNeeded.map((skill) => (
            <div key={skill.id} className="flex flex-col items-center text-center space-y-10 p-6">
              <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                {/* Placeholder for icon - Replace with actual icons if available */}
                <span className="text-xs">ICON</span>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-gray-800">{skill.title}</h3>
                <p className="text-lg text-gray-600">{skill.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

       {/* --- Benefits Section --- */}
      <section className="space-y-8">
        <h2 className="text-4xl font-bold text-pink text-center">Benefits</h2>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Image */}
            <div className="relative aspect-[3/2] w-full rounded-lg overflow-hidden shadow-lg">
                <Image
                    src="/documentation/documentation2.jpg" // Make sure image exists
                    alt="Event benefits illustration"
                    fill
                    sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 600px"
                    className="object-cover shadow-lg"
                />
            </div>
            {/* Text Content */}
            <div className="space-y-6">
                <div className="space-y-6">
                {eventData.benefits.map((benefit) => (
                    <div key={benefit.id} className="flex items-start gap-6">
                        <CheckCircle2 className="h-12 w-12 text-blueSky mt-1 flex-shrink-0" />
                        <div className="flex flex-col gap-6">
                            <p className="text-gray-700 text-3xl font-bold">{benefit.title}</p>
                            <p className="text-gray-700 text-base">{benefit.text}</p>
                        </div>
                    </div>
                ))}
                </div>
            </div>
        </div>
      </section>

      {/* --- Workshop Timeline Section --- */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-pink text-center">Workshop Timeline</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Simple card list implementation for timeline */}
          {eventData.sessions?.map((session) => (
            <div key={session.id} className="p-6 rounded-xl border border-gray-200 bg-white shadow-md space-y-3">
              <p className="font-semibold text-2xl text-gray-800">{formatStartDate(session.start)} ({formatEventDateTime(session.start, session.end).timeRange})</p>
              <div className="space-y-5">
                <p className="font-semibold text-pink text-base ">{session.topic}</p>
                <p className="text-gray-600 text-base">{session.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Scroll Up Button --- */}
      <div className="text-center">
        <ScrollUpButton />
      </div>

    </div>
  );
}