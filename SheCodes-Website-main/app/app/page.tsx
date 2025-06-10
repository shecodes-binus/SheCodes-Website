import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar, Users, BookOpen, Sparkles, ChevronLeft, ChevronRight } from "lucide-react"
import UpcomingEvents from "@/components/upcoming-events"
import FeaturedStories from "@/components/featured-stories"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel" 

import type { Alumni } from '@/types/alumnis'; 
import { dummyAlumnis } from '@/data/dummyAlumnis'; 
import type { TeamMember } from '@/types/teams';
import { dummyTeam } from '@/data/dummyTeam'; 
import { SuccessStoriesCarousel } from "@/components/success-story-carousel"

export default function Home() {
  const missionData = [
    {
      iconSrc: "/icons/advocate.svg",
      title: "Advocate",
      description: "Raise awareness about the importance of gender diversity in tech and STEM fields.",
    },
    {
      iconSrc: "/icons/empower.svg",
      title: "Empower",
      description: "Provide women with the tools, skills, and confidence they need to succeed in tech careers.",
    },
    {
      iconSrc: "/icons/support.svg",
      title: "Support",
      description: "Develop a safe and inclusive community where women can grow, learn, and thrive together.",
    },
    {
      iconSrc: "/icons/innovate.svg",
      title: "Innovate",
      description: "Cultivate creative thinking and problem-solving skills through initiatives and projects",
    },
    {
      iconSrc: "/icons/collaborate.svg",
      title: "Collaborate",
      description: "Foster partnerships between students, professionals, and industry leaders",
    },
    {
      iconSrc: "/icons/inspire.svg",
      title: "Inspire",
      description: "Share stories, achievements, and role models to motivate the next generation of women in STEM",
    },
  ];

  const alumnis = dummyAlumnis;
  const teamMembers: TeamMember[] = dummyTeam;

  return (
    <div className="flex flex-col min-h-screen space-y-20">
      {/* Hero Section */}
      <section className="relative w-full pt-20 px-16 bg-white">
        <div className=" px-4 md:px-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_550px] lg:gap-16 xl:grid-cols-[1fr_750px]">
            <div className="flex flex-col justify-center space-y-4 leading-10">
              <div className="xl:space-y-8 lg:space-y-6 md:space-y-6">
                <h3 className="text-xl font-bold sm:text-3xl xl:text-4xl/none text-pink">
                  Welcome to Shecodes
                </h3>
                <h1 className="text-3xl font-bold sm:text-5xl xl:text-6xl text-black xl:leading-normal sm:leading-normal">
                  Empowering Women in Tech
                </h1>
                <p className="max-w-[600px] text-gray-600 md:text-base md:leading-tight xl:leading-relaxed">
                  SheCodes Society Binus is an initiative that was set in 2020 with the exclusive purpose of narrowing the gender divide in tech by 
                  equipping women with the skills and confidence acquired through hands-on workshops, mentorship, and networking sessions. 
                  By uniting students, professionals, and industry leaders, we aim to elevate the presence of women in STEM.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/auth/register">
                  <Button className="w-2/5 bg-blueSky text-white rounded-lg px-16 font-bold hover:bg-blueSky/80 transition-all duration-300">Join Us</Button>
                </Link>
              </div>
            </div>
            {/* <div className="flex items-center justify-center">
              <Image
                src="/photo1.png"
                alt="SheCodes Society Binus"
                width={750}
                height={600}
                className="rounded-lg object-cover"
                priority
              />
            </div> */}
            <div className="w-full relative rounded-lg overflow-hidden shadow-lg order-1 lg:order-2"> {/* Adjusted aspect ratio */}
                <Image
                    src="/documentation/documentation2.jpg"
                    alt="SheCodes Society Binus"
                    fill
                    sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 600px"
                    className="object-cover"
                    priority 
                />
            </div>
          </div>
        </div>
      </section>

      { /* Vision Section */}
      <section className="relative w-5/6 mx-auto">
        <div className="md:px-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_580px]">
            <div className="flex flex-col justify-center space-y-4 leading-10">
                <div className="xl:space-y-8 lg:space-y-6 md:space-y-6">
                  <h3 className="text-xl font-bold sm:text-3xl xl:text-4xl/none text-pink text-center">
                    Our Vision
                  </h3>
                  <p className="max-w-[600px] text-gray-600 md:text-base md:leading-relaxed xl:leading-relaxed">
                  To create a world where women have equitable opportunities and representation in STEM fields, fostering innovation and 
                  inclusive growth through diverse perspectives and talents by empowering them with cutting-edge skills and 
                  leadership capabilities.
                  </p>
                </div>
            </div>
            {/* <div className="flex items-center justify-center">
              <Image
                src="/photo1.png"
                alt="SheCodes Society Binus"
                width={550}
                height={450}
                className="rounded-lg object-cover"
                priority
              />
            </div> */}
            <div className="w-full h-96 relative rounded-lg overflow-hidden shadow-lg order-1 lg:order-2"> 
                <Image
                    src="/documentation/grandlaunchingphoto.jpg"
                    alt="SheCodes Society Binus"
                    fill
                    sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 600px"
                    className="object-cover"
                    priority 
                />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="space-y-8 relative w-4/5 mx-auto flex flex-col items-center justify-center" id="team">
        <div className="text-center">
          <h3 className="text-xl font-bold sm:text-3xl xl:text-4xl/none text-pink">
            Our Mission
          </h3>
        </div>

        <div className="flex flex-wrap -mx-3 justify-center"> 
          {missionData.map((mission, index) => (
            <div key={index} className="w-full sm:w-1/2 lg:w-1/3 px-3"> 
              <Card className="h-full"> 
                <CardContent className="p-12 flex flex-col items-center text-center space-y-8 h-full"> 
                  <Image
                    src={mission.iconSrc}
                    alt={mission.title}
                    width={96}
                    height={96}
                    className="rounded-lg object-cover"
                    priority
                  />
                  {/* <div className="flex-grow">  */}
                    <h3 className="text-3xl font-bold mb-5">{mission.title}</h3>
                    <p className="text-base text-gray-600">{mission.description}</p>
                  {/* </div> */}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="space-y-8 relative w-11/12 mx-auto flex flex-col items-center justify-center" id="team">
        <div className="text-center space-y-6">
          <h3 className="text-xl font-bold sm:text-3xl xl:text-4xl/none text-pink">
            Meet our champions
          </h3>
          <p className="text-base text-gray-600">Where ambition meets accomplishment</p>
        </div>

        <div className="flex flex-wrap -mx-3 justify-center"> 
          {teamMembers.map((team) => (
            <div key={team.id} className="w-full sm:w-1/2 lg:w-1/3 px-3"> 
              <Card className="h-full"> 
                <CardContent className="py-6 px-6 flex flex-col items-center text-center space-y-6 h-full"> 
                  <Avatar className="h-40 w-40">
                    <AvatarImage src={team.imageSrc} alt={`Team Member ${team.id}`} />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow space-y-3"> 
                    <h3 className="text-2xl font-bold">{team.name}</h3>
                    <p className="text-sm text-gray-600">{team.position}</p>
                    <p className="text-gray-600 text-base leading-relaxed">
                      {team.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      <SuccessStoriesCarousel
        item="alumni"
        mentors={[]}
        alumnis={alumnis}
        title="Success Stories" // You can customize title/subtitle here
        subtitle="Real stories of resilience, innovation, and achievement from our amazing alumni."
      />
    </div>
  )
}
