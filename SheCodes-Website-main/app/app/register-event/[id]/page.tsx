"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast"; // <-- Import toast for notifications

import type { CombinedEventData } from '@/types/events'; 
import { formatEventDateTime, formatStartDate } from '@/lib/eventUtils';
import apiService from "@/lib/apiService";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollUpButton } from "@/components/scroll-up-button";
import { 
  PiNumberCircleOneLight,
  PiNumberCircleTwoLight,
  PiNumberCircleThreeLight,
  PiNumberCircleFourLight
} from "react-icons/pi";


export default function RegisterEventPage( { params }: { params: { id: string } }) {
    const router = useRouter();
    const { user, isAuthenticated, loading: authLoading, revalidateUser } = useAuth(); // <-- Get auth status and user data

    const [eventData, setEventData] = useState<CombinedEventData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // State for registration flow
    const [isRegistering, setIsRegistering] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    const numberIcons = [PiNumberCircleOneLight, PiNumberCircleTwoLight, PiNumberCircleThreeLight, PiNumberCircleFourLight];

    useEffect(() => {
        if (!params.id) return;

        const fetchEventData = async () => {
            setLoading(true);
            try {
                const response = await apiService.get(`/events/${params.id}`);
                const event: CombinedEventData = response.data;
                setEventData(event);
            } catch (err) {
                console.error("Failed to fetch event data:", err);
                setError("Could not load event details. It might not exist.");
            } finally {
                setLoading(false);
            }
        };

        fetchEventData();
    }, [params.id]);

    // Separate useEffect to check registration status after user and event data are loaded
    useEffect(() => {
        if (user && eventData) {
            const alreadyRegistered = user.participations.some(p => p.event_id === eventData.id);
            setIsRegistered(alreadyRegistered);
        }
    }, [user, eventData]);

     const handleRegister = async () => {
        if (!isAuthenticated) {
            toast.error("Please log in to register for an event.");
            router.push(`/auth/login?redirect=/app/register-event/${params.id}`);
            return;
        }

        if (!user || !eventData) {
            toast.error("User or event data is missing.");
            return;
        }

        setIsRegistering(true);
        const toastId = toast.loading('Registering...');

        try {
            const payload = {
                event_id: eventData.id,
                member_id: user.id // user.id is a string, which is correct
            };
            // CORRECTED: Removed trailing slash to exactly match backend router prefix
            await apiService.post('/participants', payload); 
            
            toast.success('Successfully registered for the event!', { id: toastId });
            setIsRegistered(true);

            await revalidateUser();

            setTimeout(() => {
              router.push('/app/my-activity');
            }, 1000);

        } catch (err: any) {
            console.error("Registration failed:", err);
            let errorMessage = "Registration failed. Please try again later.";
            if (err.response?.status === 409) {
                errorMessage = "You are already registered for this event.";
                toast.error(errorMessage, { id: toastId });
                setIsRegistered(true); // Sync UI if backend says we're already registered
            } else if (err.response?.data?.detail) {
                errorMessage = err.response.data.detail;
            }
            toast.error(errorMessage, { id: toastId });
        } finally {
            setIsRegistering(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen text-center p-16">Loading event details...</div>
    }

    if (error || !eventData) {
        return (
            <div className="container mx-auto px-4 py-16 text-center min-h-screen">
                <h1 className="text-2xl font-bold text-red-600">Event Not Found</h1>
                <p className="text-gray-600 mt-4">
                    {error || "Sorry, we couldn't find the event you were looking for."}
                </p>
                <Link href="/app/events" className="mt-6 inline-block">
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
          <h1 className="text-5xl md:text-5xl lg:text-6xl font-bold text-blueSky leading-relaxed ">
            {eventData.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            {eventData.tags?.map((tag) => (
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
                <span>{formatEventDateTime(eventData.start_date, eventData.end_date).dateRange}</span>
              </div>
              <div className="flex items-center text-black font-normal">
                <Clock className="mr-3 shrink-0 h-5 w-5 text-blueSky" />
                <span>{formatEventDateTime(eventData.start_date, eventData.end_date).timeRange}</span>
              </div>
              <div className="flex items-start text-black font-normal">
                <MapPin className="mr-3 shrink-0 h-5 w-5 text-blueSky flex-shrink-0" />
                <span>{eventData.location}</span>
              </div>
            </div>
            {/* --- MODIFIED REGISTRATION BUTTON --- */}
            <Button 
                size="lg" 
                className={`w-full text-white text-base rounded-full transition-colors duration-300 ${
                  (isRegistering || isRegistered) ? '' : 'hover:bg-blueSky/90'
                }`}
                onClick={handleRegister}
                disabled={isRegistering || isRegistered}
                style={{
                    backgroundColor: isRegistered ? '#28a745' : (isRegistering ? '#a1c4fd' : '#72A1E0'), // Green for success
                    cursor: (isRegistering || isRegistered) ? 'not-allowed' : 'pointer'
                }}
            >
                {isRegistering ? 'Registering...' : (isRegistered ? 'Successfully Registered!' : 'Register Now')}
            </Button>
            {isRegistered && (
                <div className="text-center mt-2 space-y-2">
                      <Link href="/app/my-activity">
                        <Button variant="link" className="text-blueSky">View in My Activities</Button>
                    </Link>
                </div>
            )}
          </div>
        </div>

        {/* Image Content */}
        <div className="relative aspect-video lg:aspect-square rounded-lg overflow-hidden shadow-lg">
          <Image
            src={eventData.image_src || '/photo2.png'} 
            alt={eventData.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <Badge className={`absolute top-6 right-6 text-white px-5 py-3 rounded-full text-sm ${
              eventData.event_type === "Workshop" ? "bg-blueSky" : "bg-pink" // Example conditional color
            }`}
          >
            {eventData.event_type}
          </Badge>
        </div>
      </section>

      {/* --- Tools Section --- */}
      {eventData.tools && eventData.tools.length > 0 && (
        <section className="text-center space-y-10">
            <h2 className="text-4xl font-bold text-pink">Tools</h2>
            <div className="flex justify-center items-center gap-8 md:gap-16 flex-wrap">
            {eventData.tools.map((tool) => (
                <div key={tool.name} className="flex flex-col items-center gap-2">
                <Image
                    src={tool.logo_src}
                    alt={`${tool.name} logo`}
                    width={220}
                    height={220}
                    className="object-contain"
                />
                </div>
            ))}
            </div>
        </section>
      )}

      {/* --- Key Points Section --- */}
      <section className="space-y-12">
        <h2 className="text-4xl font-bold text-pink text-center">Key Points</h2>
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-4 mx-auto">
          {eventData.key_points?.map((point, index) => (
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
                        src={mentor.image_src || "/photo.png"}
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
          {eventData.skills.map((skill, index) => {
            const IconComponent = numberIcons[index];

            return (
              <div key={skill.id} className="flex flex-col items-center text-center space-y-10 p-6 max-w-xs">
                <div className="h-32 w-32 flex items-center justify-center text-blueSky">
                  {IconComponent ? (
                    <IconComponent size={120} /> 
                  ) : (
                    <span className="text-8xl font-bold">{index + 1}</span>
                  )}
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-gray-800">{skill.title}</h3>
                  <p className="text-lg text-gray-600">{skill.description}</p>
                </div>
              </div>
            );
          })}
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
                <p className="font-semibold text-black text-base ">{session.topic}</p>
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