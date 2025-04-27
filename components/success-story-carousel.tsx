// src/components/SuccessStoriesCarousel.tsx (or your correct path)

'use client';

import * as React from 'react'; // Import React
import Image from 'next/image';
import Link from 'next/link';
import { type CarouselApi } from '@/components/ui/carousel'; // Keep type import
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  // Remove useCarousel import - we will use setApi prop instead
} from '@/components/ui/carousel';
import { Alumni } from '@/types/alumnis';
import { Mentor } from '@/types/partnership';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SuccessStoriesCarouselProps {
    item: "alumni" | "mentor";
  alumnis: Alumni[];
  mentors: Mentor[];
  title?: string;
  subtitle?: string;
}

export function SuccessStoriesCarousel({
    item, 
  alumnis,
  mentors,
  title = "Success Stories",
  subtitle = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
}: SuccessStoriesCarouselProps) {
  // 1. Use useState to store the API instance
  const [api, setApi] = React.useState<CarouselApi>(); // State for the API

  const [currentSnap, setCurrentSnap] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  // 2. useEffect now depends on the 'api' state variable
  React.useEffect(() => {
    if (!api) {
      return; // Exit if api is not yet initialized
    }

    setScrollSnaps(api.scrollSnapList());
    setCurrentSnap(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrentSnap(api.selectedScrollSnap()); // No need for optional chaining here as api is guaranteed
    };

    const onReInit = () => {
        setScrollSnaps(api.scrollSnapList());
        setCurrentSnap(api.selectedScrollSnap());
    }

    api.on('select', onSelect);
    api.on('reInit', onReInit);


    // Cleanup listeners
    return () => {
      api.off('select', onSelect);
      api.off('reInit', onReInit);
    };
  }, [api]); // Depend on the api state

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-blueSky overflow-hidden relative">
      <div className="container mx-auto px-4">
        {/* Title and Subtitle */}
        <div className="flex flex-col items-center justify-center space-y-3 text-center mb-10 md:mb-14">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white">
            {title}
          </h2>
          <p className="max-w-[800px] text-white/80 md:text-lg lg:text-base xl:text-lg">
            {subtitle}
          </p>
        </div>

        {/* 3. Pass the setApi state setter to the Carousel component */}
        <Carousel
          setApi={setApi} // Pass the setter function here
          opts={{
            align: 'center',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {item === 'alumni' ?
                alumnis.map((alumni, index) => {
                    const isSelected = index === currentSnap;
                    return (
                      <CarouselItem
                        key={alumni.id || index}
                        className="pl-4 basis-4/5 sm:basis-1/2 md:basis-1/2 lg:basis-1/3"
                      >
                        <div className="p-1">
                          <Link href={`/app/success-story-alumni/${alumni.id}`} passHref legacyBehavior={false}> {/* Adjusted link path */}
                           <div
                              className={`flex flex-col items-center text-center overflow-hidden rounded-xl bg-white/10 p-4 shadow-lg transition-all duration-300 ease-out ${
                                isSelected ? 'scale-120 opacity-100' : 'scale-90 opacity-70'
                              }`}
                            >
                              <div className="w-full mb-4 aspect-square overflow-hidden rounded-lg">
                                <Image
                                  src={alumni.imageSrc}
                                  alt={`Success story from ${alumni.name}`}
                                  width={300}
                                  height={300}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <div className="text-white">
                                <h3 className="text-xl font-semibold mb-1">{alumni.name}</h3>
                                <p className="text-sm opacity-80">Batch {alumni.batch} - {alumni.university}</p>
                                {isSelected && alumni.story && (
                                  <p className="text-sm opacity-90 mt-3 line-clamp-3">
                                    {alumni.story}
                                  </p>
                                )}
                              </div>
                            </div>
                          </Link>
                        </div>
                      </CarouselItem>
                    );
                  })
                : 
                mentors.map((mentor, index) => {
                    const isSelected = index === currentSnap;
                    return (
                      <CarouselItem
                        key={mentor.id || index}
                        className="pl-4 basis-4/5 sm:basis-1/2 md:basis-1/2 lg:basis-1/3"
                      >
                        <div className="p-1">
                          <Link href={`/app/success-story-mentor/${mentor.id}`} passHref legacyBehavior={false}> {/* Adjusted link path */}
                           <div
                              className={`flex flex-col items-center text-center overflow-hidden rounded-xl bg-white/10 p-4 shadow-lg transition-all duration-300 ease-out ${
                                isSelected ? 'scale-120 opacity-100' : 'scale-90 opacity-70'
                              }`}
                            >
                              <div className="w-full mb-4 aspect-square overflow-hidden rounded-lg">
                                <Image
                                  src={mentor.imageSrc}
                                  alt={`Success story from ${mentor.name}`}
                                  width={300}
                                  height={300}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <div className="text-white">
                                <h3 className="text-xl font-semibold mb-1">{mentor.name}</h3>
                                <p className="text-sm opacity-80">{mentor.occupation}</p>
                                {isSelected && mentor.story && (
                                  <p className="text-sm opacity-90 mt-3 line-clamp-3">
                                    {mentor.story}
                                  </p>
                                )}
                              </div>
                            </div>
                          </Link>
                        </div>
                      </CarouselItem>
                    );
                  })
            })
            
          </CarouselContent>

          {/* Gradient Overlays */}
          <div aria-hidden="true" className="absolute inset-y-0 left-0 w-16 sm:w-24 md:w-32 bg-gradient-to-r from-blueSky to-transparent z-10 pointer-events-none"></div>
          <div aria-hidden="true" className="absolute inset-y-0 right-0 w-16 sm:w-24 md:w-32 bg-gradient-to-l from-blueSky to-transparent z-10 pointer-events-none"></div>

          {/* Navigation Buttons */}
          <CarouselPrevious
             className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center bg-white/80 hover:bg-white text-blueSky rounded-full h-9 w-9 sm:h-10 sm:w-10 border-none shadow-md"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </CarouselPrevious>
          <CarouselNext
             className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center bg-white/80 hover:bg-white text-blueSky rounded-full h-9 w-9 sm:h-10 sm:w-10 border-none shadow-md"
          >
             <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </CarouselNext>

        </Carousel>
      </div>
    </section>
  );
}