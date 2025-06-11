"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel" 

// Import data and types
import type { BlogArticle, ArticleCategory } from "@/types/blog"; // Adjust path if needed
import { dummyArticles } from "@/data/dummyBlogs"; // Adjust path if needed
import type { Documentation} from '@/types/documentation'; 
import { dummyDocumentation } from '@/data/dummyDocumentation'; 
import { FaArrowAltCircleRight, FaArrowRight, FaLongArrowAltRight } from "react-icons/fa"
import apiService from "@/lib/apiService";

export default function BlogPage() {
  const getCategoryStyles = (category: ArticleCategory): { badge: string; button: string; title: string } => {
    switch (category) {
      case "Career Growth":
        return {
          badge: "bg-[#EE7373] text-white hover:bg-[#EE7373]/90",
          button: "text-red-500 hover:text-white hover:bg-red-500",
          title: "text-red-500"
        };
      case "Community":
        return {
          badge: "bg-[#FAC57A] text-white hover:bg-[#FAC57A]/90",
          button: "text-yellow-500 hover:text-white hover:bg-yellow-500",
          title: "text-yellow-500"
        };
      case "Event":
        return {
          badge: "bg-purple-2 text-white hover:bg-purple-2/90", // Assuming purple-3 exists
          button: "text-purple-2 hover:text-white hover:bg-purple-2",
          title: "text-purple-2"
        };
      case "Others":
        return {
          badge: "bg-[#48CFE7] text-white hover:bg-[#48CFE7]/80",
          button: "text-gray-600 hover:text-white hover:bg-gray-600",
          title: "text-gray-800"
        };
      case "Tech & Innovation":
        return {
          badge: "bg-blueSky text-white hover:bg-blueSky/90",
          button: "text-blueSky hover:text-white hover:bg-blueSky",
          title: "text-blueSky"
        };
      case "Success Stories":
        return {
          badge: "bg-pink text-white hover:bg-pink/90",
          button: "text-pink hover:text-white hover:bg-pink",
          title: "text-pink"
        };
      default: 
        return {
          badge: "bg-gray-600 text-white hover:bg-gray-700",
          button: "text-gray-600 hover:text-white hover:bg-gray-600",
          title: "text-gray-800"
        };
    }
  };
  
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const initialArticleCount = 6;
  const articlesToShow = articles.slice(0, initialArticleCount);

  const eventArticles = articles.filter(article => article.category === "Event");
  eventArticles.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  const recentEvents = eventArticles.slice(0, 3);

  const [documentation, setDocumentation] = useState<Documentation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articleResponse, documentationResponse] = await Promise.all([
          apiService.get('/blogs'),      
          apiService.get('/documentations'), 
        ]);
        
        setArticles(articleResponse.data);
        setDocumentation(documentationResponse.data)

      } catch (error) {
        console.error("Failed to fetch page data:", error);
      } 
    };

    fetchData();
  }, []);

  return (
    <div className="mx-auto space-y-16 mb-20 min-h-screen">

      {/* --- Recent Events Section --- */}
      <section className="space-y-16 relative w-4/5 mx-auto py-12 md:py-16" id="team">
        <div className="text-center">
          <h3 className="text-xl font-bold sm:text-3xl xl:text-4xl/none text-blueSky">
            SheCodes Current Update
          </h3>
        </div>
        {recentEvents.map((event, index) => {
        const isImageLeft = index % 2 === 0;
        const styles = getCategoryStyles(event.category);
        const date = new Date(event.published_at).toLocaleDateString();
        const time = new Date(event.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return (
          <div className="md:px-6" key={event.id}> 
            <div className="grid gap-5 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_580px]">
              <div
                className={`w-full h-96 relative rounded-lg overflow-hidden shadow-lg order-1 ${
                  isImageLeft ? 'lg:order-1' : 'lg:order-2'
                }`}
              >
                <Image
                  src={event.featured_image_url} 
                  alt={event.title}    
                  fill
                  sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 600px"
                  className="object-cover"
                  priority={index === 0} 
                />
                <Badge className={`absolute top-4 right-4 ${styles.badge} px-5 py-1.5`}>{event.category}</Badge>
              </div>

              {/* Text Content Container */}
              <div
                className={`flex flex-col justify-center space-y-4 leading-normal order-2  text-left`} 
              >
                 <Link href={`/app/article/${event.slug}`} passHref legacyBehavior={false} className="group">
                    <div className="space-y-4 lg:space-y-5">
                        <h4 className="text-xl font-bold sm:text-2xl xl:text-3xl/[40px] text-black">
                            {event.title} 
                        </h4>
                        <p className="text-black md:text-base line-clamp-3">
                            {event.excerpt}
                        </p>
                        <div className="flex">
                          <p className="text-sm text-grey-3 flex-1">
                            {new Date(date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })} | {time}        
                          </p>
                          <p className="text-sm text-purple-1 font-semibold  group-hover:underline">
                            Read more
                          </p>
                        </div>
                        
                    </div>
                 </Link>
              </div>
            </div>
          </div>
        );
      })}
      </section>

      {/* --- Blog and News Section --- */}
      <section className="space-y-12 md:space-y-16 px-12 sm:px-8 md:px-12 lg:px-32 pb-16"> 
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8 md:mb-12">
          <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-normal sm:text-4xl md:text-5xl text-pink">
                Blog & News
              </h2>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articlesToShow.map((article: BlogArticle) => {
                const styles = getCategoryStyles(article.category);
                const date = new Date(article.published_at).toLocaleDateString();
                const time = new Date(article.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                    <Card key={article.id} className="bg-white shadow flex flex-col"> 
                    <CardHeader className="p-0">
                        <div className="relative h-64 w-full">
                        <Image
                            src={article.featured_image_url || "/placeholder.svg?text=Image"} 
                            alt={article.title}
                            fill
                            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                            className="object-cover rounded-t-lg"
                        />
                        <Badge className={`absolute top-4 right-4 ${styles.badge}`}>{article.category}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4 flex-grow">
                        {/* <CardTitle className={`text-xl ${styles.title}`}> */}
                        <CardTitle className={`text-xl text-black`}>
                        {article.title}
                        </CardTitle>
                        <CardDescription className="text-black/95 text-sm/[21px] line-clamp-3">
                        {article.excerpt}
                        </CardDescription>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center ">
                        <div className="flex items-center text-sm text-grey-3">
                            {/* <Calendar className="mr-1 h-4 w-4" /> */}
                            <span>{new Date(date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })} | {time}  
                            </span>
                        </div>
                        <Link href={`/app/article/${article.slug}`} passHref legacyBehavior={false} className="group">
                        <p className="text-sm text-purple-1 font-semibold  group-hover:underline">
                            Read more
                          </p>
                        </Link>
                    </CardFooter>
                    </Card>
                );
             })}
          </div>
          {dummyArticles.length > initialArticleCount && (
            <div className="text-center pt-4"> 
                <Link href="/app/articles">
                <Button className="bg-white text-purple-1 rounded-xl px-16 py-4 font-bold text-lg hover:underline transition-all duration-300"> 
                    View More <FaArrowRight className="ml-2" />
                </Button>
                </Link>
            </div>
          )}

      </section>

      { /* --- Documentation Section --- */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-blueSky overflow-hidden">
        <div className="space-y-12 md:space-y-16"> 
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-normal sm:text-4xl md:text-5xl text-white">
                Documentation
              </h2>
              <p className="max-w-[800px] text-white/90 md:text-lg lg:text-base xl:text-lg">
                Explore key insights, progress, and milestones in our journey.
              </p>
            </div>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-96 px-12 sm:px-16 md:px-20"> 
              {documentation.map((photo, index) => (
                <CarouselItem key={index} className="pl-7 basis-full sm:basis-1/2 md:basis-1 lg:basis-1/2 xl:basis-1/3">
                  
                      <div className="p-1 cursor-pointer group">
                        <div className="flex flex-col overflow-hidden">
                          <Image
                            src={photo.image_src} 
                            alt={`Documentation ${photo.id}`}
                            width={900}
                            height={700}
                            className="aspect-[3/2] object-cover w-full shadow-md transition-transform duration-300 group-hover:scale-105 shadow-xl" // Added hover effect
                          />
                        </div>
                      </div>
                  
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Gradient Overlays - Positioned absolutely within the relative container */}
            {/* Left Gradient */}
            <div className="absolute inset-y-0 left-0 w-64  bg-gradient-to-r from-blueSky to-transparent z-10 pointer-events-none hidden sm:block opacity-75"></div>
            {/* Right Gradient */}
            <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-blueSky to-transparent z-10 pointer-events-none hidden sm:block opacity-75"></div>


            {/* Custom styled Arrows - Higher Z-index */}
            {/* Desktop Arrows - Positioned over the gradient */}
            <CarouselPrevious
              className="absolute left-16 md:left-20 top-1/2 -translate-y-1/2 z-20 hidden sm:flex items-center justify-center bg-white/90 hover:bg-white text-blueSky rounded-full h-10 w-10 border-none shadow-md"
              // Style adjusted: text-blueSky, slightly more opaque bg, added shadow
            >
              <ChevronLeft className="h-6 w-6" />
            </CarouselPrevious>
            <CarouselNext
              className="absolute right-16 md:right-20 top-1/2 -translate-y-1/2 z-20 hidden sm:flex items-center justify-center bg-white/90 hover:bg-white text-blueSky rounded-full h-10 w-10 border-none shadow-md"
              // Style adjusted: text-blueSky, slightly more opaque bg, added shadow
            >
              <ChevronRight className="h-6 w-6" />
            </CarouselNext>

            {/* Mobile Arrows - Positioned closer to edges, potentially smaller */}
            <CarouselPrevious
              className="absolute left-2 top-[40%] -translate-y-1/2 z-20 sm:hidden flex items-center justify-center bg-white/90 hover:bg-white text-blueSky rounded-full h-8 w-8 border-none p-0 shadow-md"
              // Adjusted top position slightly, text-blueSky, bg, shadow
            >
              <ChevronLeft className="h-5 w-5" />
            </CarouselPrevious>
            <CarouselNext
              className="absolute right-2 top-[40%] -translate-y-1/2 z-20 sm:hidden flex items-center justify-center bg-white/90 hover:bg-white text-blueSky rounded-full h-8 w-8 border-none p-0 shadow-md"
              // Adjusted top position slightly, text-blueSky, bg, shadow
            >
              <ChevronRight className="h-5 w-5" />
            </CarouselNext>
          </Carousel>
        </div>
      </section>

      </div>
  )
}
