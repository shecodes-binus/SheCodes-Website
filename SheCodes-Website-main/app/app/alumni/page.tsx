import { useEffect, useState } from "react";
import axios from "axios";
import AlumniHeroSection from '@/components/alumni/alumni-hero-section'; // Adjust path
import AlumniShowcase from '@/components/alumni/alumni-showcase'; // Adjust path
import DiscussionSection from '@/components/alumni/discussion-section'; // Adjust path
import { SuccessStoriesCarousel } from '@/components/success-story-carousel';
import { dummyAlumnis } from '@/data/dummyAlumnis'; // Adjust path

type Alumni = {
  id: number;
  name: string;
  batch: number;
  imageSrc: string;
  story: string;
  email?: string;
  instagram?: string;
  linkedin?: string;
  phone?: string;
  university?: string;
};

export default function AlumniHubPage() {
  const [alumnis, setAlumnis] = useState<Alumni[]>([]);

  useEffect(() => {
  axios.get("api/alumni")
    .then((res) => {
      const cleanedAlumnis = res.data.map((item: any) => ({
        ...item,
        email: item.email || "",
        instagram: item.instagram || "",
        linkedin: item.linkedin || "",
        phone: item.phone || "",
        university: item.university || "",
      }));
      setAlumnis(cleanedAlumnis);
    })
    .catch((err) => console.error("Error fetching alumni:", err));
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