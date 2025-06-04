"use client"
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { useState } from 'react';

// Import data and types
import type { BlogArticle, ArticleCategory } from "@/types/blog"; // Adjust path if needed
import { dummyArticles } from "@/data/dummyBlogs"; // Adjust path if needed
import { dummyDocumentation } from '@/data/dummyDocumentation'; 

const categories: (ArticleCategory | "All")[] = ["All", "Event", "Success Stories", "Tech & Innovation", "Career Growth", "Community", "Others"];

export default function BlogPage() {
   const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | "All">("All"); 
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
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/articles`);
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        console.error("Failed to load articles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const filteredArticles = selectedCategory === "All"
  ? articles
  : articles.filter(article => article.category === selectedCategory);

  return (
    <div className="mx-auto space-y-16 mb-20 min-h-screen">
      {/* --- Blog and News Section --- */}
      <section className="space-y-12 md:space-y-16 px-12 sm:px-8 md:px-12 lg:px-32 py-16"> 
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8 md:mb-12">
          <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-normal sm:text-4xl md:text-5xl text-pink">
                Blog & News
              </h2>
          </div>
        </div>

        {/* --- Category Filter --- */}
        <div className="flex justify-center items-center space-x-4 sm:space-x-6 md:space-x-8 mb-12 flex-wrap gap-y-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-2 py-1 text-sm sm:text-base font-medium transition-colors duration-200 ease-in-out focus:outline-none
                ${selectedCategory === category
                  ? 'text-pink border-b-2 border-pink font-semibold' // Active style
                  : 'text-grey-3 hover:text-gray-800' // Inactive style
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
            <p className="text-center text-gray-500">Loading articles...</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article: BlogArticle) => {
                const styles = getCategoryStyles(article.category);
                const date = new Date(article.publishedAt).toLocaleDateString();
                const time = new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                    <Card key={article.id} className="bg-white shadow flex flex-col"> 
                    <CardHeader className="p-0">
                        <div className="relative h-64 w-full">
                        <Image
                            src={article.featuredImageUrl || "/placeholder.svg?text=Image"} 
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
                        <Link href={`/app/article/${article.slug}`} passHref legacyBehavior={false}>
                        <p className="text-sm text-purple-1 font-semibold  group-hover:underline">
                            Read more
                          </p>
                        </Link>
                    </CardFooter>
                    </Card>
                );
              })}
            </div>
        )}
      </section>
    </div>
  )
}
