import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function BlogPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="space-y-12">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-800">Blog & News</h1>
          <p className="text-gray-600 md:text-xl">Insights, stories, and updates from the SheCodes community</p>
        </div>

        {/* Featured Post */}
        <section>
          <Card className="overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="relative h-64 md:h-auto">
                <Image src="/placeholder.svg?height=600&width=800" alt="Featured Post" fill className="object-cover" />
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Featured</Badge>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="mr-1 h-3 w-3" />
                      <span>April 15, 2025</span>
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-purple-800">
                    The Future of Women in Tech: Breaking Barriers and Building Bridges
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Exploring the evolving landscape of technology and how women are shaping its future through
                    innovation and leadership.
                  </CardDescription>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Author" />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <p className="font-medium">Sarah Chen</p>
                      <p className="text-gray-600">SheCodes President</p>
                    </div>
                  </div>
                  <Link href="/blog/future-of-women-in-tech">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      Read Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Latest Articles */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl text-purple-800">Latest Articles</h2>
            <p className="text-gray-600">Stay updated with our newest content</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Article 1 */}
            <Card>
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src="/placeholder.svg?height=200&width=400"
                    alt="Article 1"
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200">Tech Trends</Badge>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="mr-1 h-3 w-3" />
                    <span>April 10, 2025</span>
                  </div>
                </div>
                <CardTitle className="text-xl text-teal-800">
                  The Rise of AI in Healthcare: Opportunities for Women in Tech
                </CardTitle>
                <CardDescription>
                  How artificial intelligence is transforming healthcare and creating new career paths for women in
                  technology.
                </CardDescription>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder.svg?height=24&width=24" alt="Author" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-medium">Jane Doe</p>
                </div>
                <Link href="/blog/ai-in-healthcare">
                  <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700 hover:bg-teal-50">
                    Read More
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Article 2 */}
            <Card>
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src="/placeholder.svg?height=200&width=400"
                    alt="Article 2"
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-200">Career Growth</Badge>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="mr-1 h-3 w-3" />
                    <span>April 5, 2025</span>
                  </div>
                </div>
                <CardTitle className="text-xl text-rose-800">Navigating Tech Interviews: A Guide for Women</CardTitle>
                <CardDescription>
                  Practical tips and strategies for women to confidently tackle technical interviews and showcase their
                  skills.
                </CardDescription>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder.svg?height=24&width=24" alt="Author" />
                    <AvatarFallback>MP</AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-medium">Maria Patel</p>
                </div>
                <Link href="/blog/tech-interviews-guide">
                  <Button variant="ghost" size="sm" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50">
                    Read More
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Article 3 */}
            <Card>
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src="/placeholder.svg?height=200&width=400"
                    alt="Article 3"
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Community</Badge>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="mr-1 h-3 w-3" />
                    <span>March 28, 2025</span>
                  </div>
                </div>
                <CardTitle className="text-xl text-purple-800">
                  Building a Supportive Tech Community: Lessons from SheCodes
                </CardTitle>
                <CardDescription>
                  How SheCodes has created a thriving community for women in tech and the impact it's making.
                </CardDescription>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder.svg?height=24&width=24" alt="Author" />
                    <AvatarFallback>AL</AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-medium">Aisha Lee</p>
                </div>
                <Link href="/blog/building-tech-community">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  >
                    Read More
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
          <div className="text-center">
            <Link href="/blog/all">
              <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                View All Articles
              </Button>
            </Link>
          </div>
        </section>

        {/* Categories */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl text-purple-800">Explore by Category</h2>
            <p className="text-gray-600">Find content that interests you</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/blog/category/tech-trends">
              <div className="p-6 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors">
                <h3 className="font-bold text-purple-800">Tech Trends</h3>
                <p className="text-sm text-gray-600">12 articles</p>
              </div>
            </Link>
            <Link href="/blog/category/career-growth">
              <div className="p-6 bg-teal-50 rounded-lg text-center hover:bg-teal-100 transition-colors">
                <h3 className="font-bold text-teal-800">Career Growth</h3>
                <p className="text-sm text-gray-600">8 articles</p>
              </div>
            </Link>
            <Link href="/blog/category/coding-tutorials">
              <div className="p-6 bg-rose-50 rounded-lg text-center hover:bg-rose-100 transition-colors">
                <h3 className="font-bold text-rose-800">Coding Tutorials</h3>
                <p className="text-sm text-gray-600">15 articles</p>
              </div>
            </Link>
            <Link href="/blog/category/success-stories">
              <div className="p-6 bg-amber-50 rounded-lg text-center hover:bg-amber-100 transition-colors">
                <h3 className="font-bold text-amber-800">Success Stories</h3>
                <p className="text-sm text-gray-600">10 articles</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
