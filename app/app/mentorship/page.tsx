"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HiChevronLeft } from "react-icons/hi";
import { HiChevronRight } from "react-icons/hi";
import { FaEnvelope, FaInstagram, FaLinkedin } from 'react-icons/fa'; 

import type { Mentor, Partner } from '@/types/partnership'; 
import { dummyMentors, dummyPartners } from '@/data/dummyPartnershipData'; 
import { SuccessStoriesCarousel } from '@/components/success-story-carousel';

export default function PartnershipMentorshipPage() {
  const [selectedMentorIndex, setSelectedMentorIndex] = useState<number>(0);

  const mentors = dummyMentors;
  const partners = dummyPartners;

  const selectedMentor = mentors[selectedMentorIndex];

  const handleSelectMentor = (index: number) => {
    setSelectedMentorIndex(index);
  };

  const handlePrevMentor = () => {
    setSelectedMentorIndex((prevIndex) =>
      prevIndex === 0 ? mentors.length - 1 : prevIndex - 1
    );
  };

  const handleNextMentor = () => {
    setSelectedMentorIndex((prevIndex) =>
      prevIndex === mentors.length - 1 ? 0 : prevIndex + 1
    );
  };

  const iconSize = 20; 
  const iconColor = "border rounded-full cursor-pointer text-black hover:text-pink p-1"; 

  return (
    <div className="mx-auto py-12 md:py-16 space-y-12 md:space-y-12">

      {/* --- Meet Our Mentors Section --- */}
      <section className="space-y-12 md:space-y-16 px-16 sm:px-8 md:px-16 lg:px-40 "> 
        <h2 className="text-4xl md:text-5xl font-bold text-pink text-center">
          Meet Our Mentors
        </h2> 

        <div className="flex flex-col lg:flex-row gap-4 md:gap-8 items-center relative">
           <button
              className="w-12 h-12 absolute top-1/2 -translate-y-1/2 left-[-10px] sm:left-[-20px] md:left-[-60px] rounded-full border-transparent text-gray-600 z-10 hover:bg-gray-100" // Adjusted positioning
              onClick={handlePrevMentor}
              aria-label="Previous Mentor"
          >
              <HiChevronLeft className="w-full h-full" /> 
          </button>
          <button
              className="w-12 h-12 absolute top-1/2 -translate-y-1/2 right-[-10px] sm:right-[-20px] md:right-[-60px] rounded-full border-transparent text-gray-600 z-10 hover:bg-gray-100" // Adjusted positioning
              onClick={handleNextMentor}
              aria-label="Next Mentor"
          >
              <HiChevronRight className="w-full h-full" /> 
          </button>

          {/* Text Content Column */}
          <div className="w-full lg:w-1/2 space-y-10 order-2 lg:order-1 px-10 text-center lg:text-left md:ml-0">
            <div className='space-y-4 md:space-y-6'>
              <h3 className="text-5xl font-bold sm:text-4xl xl:text-6xl/[80px] text-black">
                  {selectedMentor.name}
              </h3>
              <h3 className="text-2xl font-bold sm:text-xl xl:text-2xl/[45px] text-pink">
                  {selectedMentor.occupation}
              </h3>
            </div>
           
            <div className="flex space-x-4">
                {selectedMentor.instagram && (
                  <a href={`mailto:${selectedMentor.instagram}`} target="_blank" rel="noopener noreferrer" aria-label={`${selectedMentor.name}'s Email`} className={iconColor}>
                    <FaInstagram size={iconSize} className=''/>
                  </a>
                )}
                {selectedMentor.linkedin && (
                  <a href={selectedMentor.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${selectedMentor.name}'s LinkedIn`} className={iconColor}>
                    <FaLinkedin size={iconSize} />
                  </a>
                )}
            </div>
          </div>

          {/* Image Content Column */}
          <div className="relative flex-1 aspect-[11/12] w-full max-w-md mx-auto lg:w-1/4 lg:max-w-none order-1 lg:order-2">
            <Image
              key={selectedMentor.id}
              src={selectedMentor.imageSrc} 
              alt={selectedMentor.name}
              fill
              sizes="(max-width: 768px) 80vw, (max-width: 1200px) 50vw, 400px"
              className="object-cover shadow-xl rounded-lg" 
              priority={selectedMentorIndex === 0}
            />
          </div>

          
        </div>

        {/* Mentor Thumbnails (Remains Grid) */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-6 md:gap-x-8 pt-8">
          {mentors.map((mentor: Mentor, index: number) => (
            <div
              key={mentor.id}
              className="flex flex-col items-center text-center space-y-2 cursor-pointer group w-24 md:w-32 min-h-[220px]"
              onClick={() => handleSelectMentor(index)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && handleSelectMentor(index)}
            >
              <Avatar className={`h-16 w-16 md:h-20 md:w-20 transition-transform duration-200 group-hover:scale-105 ${selectedMentorIndex === index ? 'ring-2 ring-pink ring-offset-2' : ''}`}>
                <AvatarImage src={mentor.imageSrc} alt={mentor.name} className='object-cover' />
                <AvatarFallback>{mentor.name.substring(0, 1)}</AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium text-gray-800">{mentor.name}</p>
              <p className="text-xs text-gray-500 ">{mentor.occupation}</p>
              
            </div>
          ))}
        </div>
      </section>

      {/* --- Success Stories --- */}
      <SuccessStoriesCarousel
        item="mentor"
        mentors={mentors}
        alumnis={[]}
        title="Success Stories" // You can customize title/subtitle here
        subtitle="Real stories of resilience, innovation, and achievement from our amazing mentors."
      />

      {/* --- Mitra & Sponsor / Our Partner Section (Remains Grid) --- */}
      <section className={`py-16 md:py-20 space-y-10 md:space-y-12`}> 
        <div className="mx-auto px-4 md:px-6 py-20 md:py-12 space-y-12 md:space-y-16 rounded-tl-[144px] rounded-br-[144px]">
          
          <h3 className="text-4xl md:text-5xl font-bold text-pink text-center">
            In Collaboration With
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16 lg:gap-20">
            {partners.map((partner: Partner) => (
              <div key={partner.id} className='relative w-48 h-48'> 
                <Image
                  src={partner.logoSrc}
                  alt={partner.name}
                  fill 
                  sizes="96px"
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}