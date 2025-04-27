import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { dummyAlumnis } from '@/data/dummyAlumnis'; // Use the same data source
import type { Alumni } from '@/types/alumnis';

import { SuccessStoriesCarousel } from "@/components/success-story-carousel";
import { FaEnvelope, FaInstagram, FaLinkedin } from 'react-icons/fa'; 
  

function getStoryDataById(id: string): Alumni | undefined {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
        return undefined;
    }
    // Find the person in the mentors list based on ID
    return dummyAlumnis.find(person => person.id === numericId);
}


export default function SuccessStory({ params }: { params: { id: string } }) {
    const alumnis = dummyAlumnis;
    const storyData = getStoryDataById(params.id);

    const iconSize = 20; 
    const iconColor = "border rounded-full cursor-pointer text-black hover:text-pink p-1"; 

    if (!storyData) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center space-y-4">
                 <h1 className="text-2xl font-bold text-red-600">Success Story Not Found</h1>
                 <p className="text-gray-600">Sorry, we couldn't find the story you were looking for.</p>
                 <Link href="/partnership-mentorship"> {/* Link back to relevant page */}
                     <Button variant="outline">Back to Homepage</Button>
                 </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen space-y-32 mb-20">
            <section className="space-y-8 relative w-4/5 mx-auto flex flex-col items-center justify-center pt-20" id="team">
                <div className="text-center space-y-4">
                    <h3 className="text-6xl font-bold sm:text-3xl xl:text-6xl/none text-pink">
                        Success Story
                    </h3>
                    <p className="text-lg sm:text-md xl:text-lg/none text-black">
                        Stories of our past participants and alumni
                    </p>
                </div>
            </section>

            <section className="relative w-full px-20">
                <div className="md:px-6">
                    <div className="grid gap-5 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_580px]">
                        <div className="flex flex-col justify-center space-y-10 leading-10">
                            <div className="xl:space-y-8 lg:space-y-6 md:space-y-6">
                                <h3 className="text-5xl font-bold sm:text-4xl xl:text-6xl/none text-black">
                                    {storyData.name}
                                </h3>
                                <h3 className="text-2xl font-bold sm:text-xl xl:text-3xl/none text-pink">
                                    Batch {storyData.batch} - {storyData.university}
                                </h3>
                                <p className="max-w-[800px] text-lg sm:text-lg xl:text-xl/none md:leading-relaxed xl:leading-relaxed text-black">
                                    {storyData.story}
                                </p>
                            </div>

                            <div className="flex space-x-4">
                                {storyData.instagram && (
                                    <a href={`mailto:${storyData.instagram}`} target="_blank" rel="noopener noreferrer" aria-label={`${storyData.name}'s Email`} className={iconColor}>
                                    <FaInstagram size={iconSize} className=''/>
                                    </a>
                                )}
                                {storyData.linkedin && (
                                    <a href={storyData.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${storyData.name}'s LinkedIn`} className={iconColor}>
                                    <FaLinkedin size={iconSize} />
                                    </a>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <Image
                            src={storyData.imageSrc}
                            alt={storyData.name}
                            width={550}
                            height={450}
                            className="rounded-lg object-cover"
                            priority
                            />
                        </div>
                    </div>
                </div>
            </section>

            <SuccessStoriesCarousel
                alumnis={alumnis}
                item="alumni"
                mentors={[]}
                title="Success Stories" // You can customize title/subtitle here
                subtitle="Real stories of resilience, innovation, and achievement from our amazing alumni."
            />
        </div>
    )

}