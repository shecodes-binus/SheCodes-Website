"use client"

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Although not explicitly used for navigation in this example, good practice
import { Badge } from '@/components/ui/badge'; // Assuming you have a Badge component (shadcn/ui or similar)
import { dummyArticles } from '@/data/dummyBlogs'; // Adjust path if needed
import type { BlogArticle, ArticleCategory } from '@/types/blog'; // Adjust path if needed
import { notFound } from 'next/navigation'; // If using Next.js App Router

// --- Icons ---
import { Eye, Heart } from 'lucide-react';
import {
  FaFacebookSquare,
  FaTelegramPlane,
  FaEnvelope,
  FaWhatsappSquare,
  FaLinkedin
} from 'react-icons/fa';
import apiService from '@/lib/apiService';

// --- Helper Function for Category Styles (Optional, but can be useful) ---
// You can adapt the one from the previous example if desired,
// here we'll just use a simpler mapping for the badge color.
const getCategoryBadgeColor = (category: ArticleCategory): string => {
  switch (category) {
    case "Event": return "bg-[#A07EE3]"; // Purple
    case "Success Stories": return "bg-[#F491B8]"; // Pink
    case "Tech & Innovation": return "bg-[#72A1E0]"; // Blue
    case "Career Growth": return "bg-[#EE7373]"; // Red
    case "Community": return "bg-[#FAC57A]"; // Yellow
    case "Others": return "bg-[#48CFE7]"; // Cyan
    default: return "bg-gray-500";
  }
};

// --- Helper Function for Date Formatting ---
const formatDate = (dateInput: string | Date): string => {
  const date = new Date(dateInput);
  const datePart = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timePart = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  return `${datePart} | ${timePart}`;
};


// --- Reusable Recommendation Card Component ---
const RecommendationCard = ({ article }: { article: BlogArticle }) => {
    const categoryColor = getCategoryBadgeColor(article.category);
    return (
        <Link href={`/app/article/${article.slug}`} className="flex space-x-3 group hover:bg-gray-50 p-2 rounded-md transition-colors duration-150">
            <div className="flex-shrink-0 w-24 h-16 relative rounded overflow-hidden">
                <Image
                    src={article.featured_image_url || "/placeholder.svg?text=IMG"}
                    alt={article.title}
                    fill
                    sizes="100px"
                    className="object-cover"
                />
                {/* Optional: Add category badge on small card too */}
                {/* <Badge className={`absolute top-1 right-1 text-white text-[10px] px-1.5 py-0.5 rounded ${categoryColor}`}>
                    {article.category}
                </Badge> */}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 group-hover:text-purple-600 line-clamp-2 leading-tight">
                    {article.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    {formatDate(article.published_at).split('|')[0].trim()} {/* Just show date */}
                </p>
            </div>
        </Link>
    );
};


// --- Main Page Component ---
// Assuming you get the 'slug' from the URL params in Next.js App Router
export default function SingleBlogClientPage({ slug }: { slug: string }) {
    const [article, setArticle] = useState<BlogArticle | null>(null);
    const [recommendations, setRecommendations] = useState<BlogArticle[]>([]);
    const [updates, setUpdates] = useState<BlogArticle[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true); 

    // useEffect(() => {
    //     const fetchArticle = async () => {
    //     try {
    //         const res = await fetch(`api/blogs/${params.slug}`);
    //         if (!res.ok) throw new Error('Article not found');
    //         const data: BlogArticle = await res.json();
    //         setArticle(data);

    //         // Fetch recommendations and updates
    //         fetch(`api/blogs?category=${data.category}&exclude=${data.id}&limit=3`)
    //         .then(res => res.json())
    //         .then(setRecommendations);

    //         fetch(`api/blogs?exclude=${data.id}&limit=3`)
    //         .then(res => res.json())
    //         .then(setUpdates);
    //     } catch (err) {
    //         setError('Article not found');
    //         console.error(err);
    //     }
    //     };

    //     fetchArticle();
    // }, [params.slug]);

    useEffect(() => {
        if (!slug) return;

        const fetchData = async () => {
            setLoading(true); // Start loading
            try {
                const response = await apiService.get(`/blogs/by-slug/${slug}`);
                const data: BlogArticle = response.data;
                setArticle(data);
                
                // Fetch recommendations and updates in parallel
                const [recResponse, updResponse] = await Promise.all([
                    apiService.get(`/blogs?category=${data.category}&exclude=${data.id}&limit=3`),
                    apiService.get(`/blogs?exclude=${data.id}&limit=3`)
                ]);

                setRecommendations(recResponse.data);
                setUpdates(updResponse.data);

            } catch (err) {
                console.error("Failed to fetch page data:", err);
                setError("Failed to load article."); // Set an error message
            } finally {
                setLoading(false); // <-- Stop loading in finally block
            }
        };

        fetchData();
    }, [slug]);

    if (loading) {
        return <div className="text-center py-20">Loading...</div>; 
    }

    if (error || !article) {
        notFound(); 
    }

    // Filter recommendations (e.g., same category, excluding current article)
    // const recommendations = dummyArticles.filter(
    //     a => a.category === article.category && a.id !== article.id
    // ).slice(0, 3); // Limit to 3 recommendations

    // Filter "updates" (could be latest articles, excluding current one)
    // const updates = dummyArticles.filter(a => a.id !== article.id).slice(0, 3); // Simple example: latest 3 other articles

    const categoryBadgeColor = getCategoryBadgeColor(article.category);

    return (
        <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16 font-sans"> {/* Main container */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

                {/* --- Column 1 & 2: Main Article Content --- */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Category Badge */}
                    <Badge className={`text-white ${categoryBadgeColor} px-3 py-1 rounded-full text-sm font-medium w-fit`}>
                        {article.category}
                    </Badge>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                        {article.title}
                    </h1>

                    {/* Excerpt */}
                    {article.excerpt && (
                        <p className="text-lg text-grey-3 mt-2 italic">
                            {article.excerpt}
                        </p>
                    )}

                    {/* Author Meta */}
                    <div className="flex items-center space-x-3 text-sm text-gray-500 pt-2">
                        <Image
                            src={article.author_avatar_url || "/default-avatar.png"}
                            alt={article.author_name}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                        />
                        <div className='flex flex-col sm:flex-row sm:items-center sm:space-x-2'>
                           <span className="font-semibold text-gray-800">{article.author_name}</span>
                           <span className="hidden sm:inline">•</span>
                           <span className='text-grey-3'>{formatDate(article.published_at)}</span>
                        </div>
                    </div>

                    {/* Featured Image */}
                    {article.featured_image_url && (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-md my-6">
                             <Image
                                src={article.featured_image_url}
                                alt={article.title}
                                fill
                                priority // Prioritize loading the main image
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 66vw, 800px" // Example sizes
                                className="object-cover"
                            />
                        </div>
                    )}

                    {/* Social Icons & Engagement */}
                    <div className="flex flex-wrap justify-between items-center border-t border-b border-gray-200 py-4 gap-4">
                       {/* Social Share */}
                       <div className="flex items-center space-x-3 text-gray-600">
                            <span className='text-sm font-medium mr-1'>Share:</span>
                            <a href="#" title="Share on Facebook" className="hover:text-blue-600"><FaFacebookSquare size={22} /></a>
                            <a href="#" title="Share on Telegram" className="hover:text-sky-500"><FaTelegramPlane size={22} /></a>
                            <a href="#" title="Share via Email" className="hover:text-red-500"><FaEnvelope size={22} /></a>
                            <a href="#" title="Share on WhatsApp" className="hover:text-green-500"><FaWhatsappSquare size={22} /></a>
                            <a href="#" title="Share on LinkedIn" className="hover:text-blue-700"><FaLinkedin size={22} /></a>
                       </div>
                       {/* Engagement */}
                       <div className="flex items-center space-x-4 text-gray-600">
                            <div className="flex items-center space-x-1">
                                <Eye size={18} />
                                <span className="text-sm">{article.view_count}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Heart size={18} />
                                <span className="text-sm">{article.like_count}</span>
                            </div>
                       </div>
                    </div>

                    {/* Article Body Content */}
                    <div className="prose prose-lg max-w-none text-gray-700 mt-10 space-y-4">
                        {article.sections.map((paragraph: string, pIndex: number) => (
                            paragraph.trim() !== '' && ( 
                                <p key={pIndex} className="!mb-4">
                                    {paragraph}
                                </p>
                            )
                        ))}
                    </div>
                </div> {/* End Main Article Column */}


                {/* --- Column 3: Sidebar --- */}
                <aside className="space-y-10 lg:sticky lg:top-24 h-fit"> {/* Sticky sidebar */}
                    {/* Recommendations Section */}
                    {recommendations.length > 0 && (
                        <section>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                                Article Recommendation
                            </h3>
                            <div className="space-y-4">
                                {recommendations.map(rec => (
                                    <RecommendationCard key={`rec-${rec.id}`} article={rec} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Updates Section */}
                     {updates.length > 0 && (
                        <section>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                                SheCodes Current Update {/* Title from image */}
                            </h3>
                            <div className="space-y-4">
                                {updates.map(update => (
                                    <RecommendationCard key={`upd-${update.id}`} article={update} />
                                ))}
                            </div>
                        </section>
                    )}
                </aside> {/* End Sidebar Column */}

            </div> {/* End Grid */}
        </div> // End Main Container
    );
}