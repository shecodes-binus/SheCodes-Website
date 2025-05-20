'use client'; // Needed for Swiper component and hooks

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import { Alumni } from '@/types/alumnis'; // Adjust path
import AlumniCard from '@/components/alumni/alumni-card'; // Adjust path

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface AlumniShowcaseProps {
  alumnis: Alumni[];
}

const AlumniShowcase: React.FC<AlumniShowcaseProps> = ({ alumnis }) => {
  return (
    <section className="relative space-y-16 "> 
       <h3 className="text-xl font-bold sm:text-3xl xl:text-4xl/none text-pink text-center">
            About Our Alumni
          </h3>
       <div className="mx-auto text-center py-10">
         <Swiper
            modules={[Navigation, Pagination, A11y]}
            spaceBetween={8} // Space between slides
            slidesPerView={1} // Default for mobile
            // navigation // Enable navigation arrows
            pagination={{ clickable: true }} // Enable clickable pagination dots
            breakpoints={{
              // when window width is >= 640px
              640: {
                slidesPerView: 2,
                spaceBetween: 16,
              },
              // when window width is >= 1024px
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
            className="pb-28" // Add padding-bottom for pagination dots
         >
           {alumnis.map((alumni) => (
             <SwiperSlide key={alumni.id}>
               <AlumniCard alumni={alumni} />
             </SwiperSlide>
           ))}
         </Swiper>
       </div>

       {/* Style Swiper Navigation Arrows (Example) - Place in global CSS or here with scoped styles if needed */}
       <style jsx global>{`
        .swiper-button-prev,
        .swiper-button-next {
          color: #ec4899; /* Pink color for arrows */
          --swiper-navigation-size: 28px; /* Adjust arrow size */
          background-color: rgba(255, 255, 255, 0.7); /* Optional semi-transparent background */
          border-radius: 50%;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .swiper-button-prev:after,
        .swiper-button-next:after {
            font-size: 1rem; /* Adjust icon size within arrow */
            font-weight: bold;
        }
        swiper-pagination {
            /* Ensure pagination is relative to swiper container */
            position: absolute;
            bottom: 10px !important; /* Adjust vertical position from bottom */
            left: 0;
            width: 100%;
            padding-top: 10px; /* Add space above dots */
        }
        .swiper-pagination-bullet-active {
          
          background-color: #ec4899 !important; /* Pink color for active dot */
        }
        .swiper-pagination-bullet {
             background-color: #fbcfe8; /* Lighter pink for inactive dots */
             opacity: 1;
             width: 10px;
             height: 10px;
        }
       `}</style>
    </section>
  );
};

export default AlumniShowcase;