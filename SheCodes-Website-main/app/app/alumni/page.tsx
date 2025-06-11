"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import AlumniHeroSection from '@/components/alumni/alumni-hero-section'; // Adjust path
import AlumniShowcase from '@/components/alumni/alumni-showcase'; // Adjust path
import DiscussionSection from '@/components/alumni/discussion-section'; // Adjust path
import { SuccessStoriesCarousel } from '@/components/success-story-carousel';
import { dummyAlumnis } from '@/data/dummyAlumnis'; // Adjust path
import { Alumni } from "@/types/alumnis";
import apiService from "@/lib/apiService";

export default function AlumniHubPage() {
  const [alumnis, setAlumnis] = useState<Alumni[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alumniResponse] = await Promise.all([
          apiService.get('/alumni'),      // Corresponds to @router.get("/") in alumni router
        ]);
        
        setAlumnis(alumniResponse.data);

      } catch (error) {
        console.error("Failed to fetch page data:", error);
      }
    };

    fetchData();
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen">
        <main className="flex-grow space-y-16">
            <AlumniHeroSection />
            <AlumniShowcase alumnis={alumnis} />

            {/* <SuccessStoriesCarousel
                item="alumni"
                mentors={[]}
                alumnis={dummyAlumnis}
                title="Success Stories" // You can customize title/subtitle here
                subtitle="Real stories of resilience, innovation, and achievement from our amazing alumni."
              /> */}
            <DiscussionSection />
        </main>
    </div>
  );
}