import AlumniHeroSection from '@/components/alumni/alumni-hero-section'; // Adjust path
import AlumniShowcase from '@/components/alumni/alumni-showcase'; // Adjust path
import DiscussionSection from '@/components/alumni/discussion-section'; // Adjust path
import { SuccessStoriesCarousel } from '@/components/success-story-carousel';
import { dummyAlumnis } from '@/data/dummyAlumnis'; // Adjust path

export default function AlumniHubPage() {
  return (
    <div className="flex flex-col min-h-screen">
        <main className="flex-grow space-y-16">
            <AlumniHeroSection />
            <AlumniShowcase alumnis={dummyAlumnis} />

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