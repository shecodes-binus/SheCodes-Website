import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Download, Award, CheckCircle } from "lucide-react"
import Image from "next/image"
import jwt_decode from "jwt-decode"

type User = {
  id: string
  name: string
  role: string
  email: string
  profile_picture?: string
  is_verified: boolean
  created_at: string
}

export default function DashboardPage() {
  const token = localStorage.getItem("access_token")
  if (token) {
    const decoded: any = jwt_decode(token)
    const userId = decoded.sub
  }
  
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const userId = "REPLACE-WITH-REAL-USER-ID"

    fetch(`http://localhost:8000/users/${userId}`)
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.detail || "Failed to fetch user")
        }
        return res.json()
      })
      .then((data) => {
        setUser(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!user) return <div>No user data found</div>

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="space-y-12">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-800">
            Member Dashboard
          </h1>
          <p className="text-gray-600 md:text-xl">Track your progress and manage your SheCodes experience</p>
        </div>

        {/* User Profile */}
        <section className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <Avatar className="h-24 w-24 border-2 border-purple-200">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt="User Profile" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <div className="space-y-4 text-center md:text-left flex-1">
                  <div>
                    <h2 className="text-2xl font-bold">Jane Doe</h2>
                    <p className="text-gray-600">Web Development Track</p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge className="bg-purple-100 text-purple-800">HTML & CSS</Badge>
                    <Badge className="bg-teal-100 text-teal-800">JavaScript</Badge>
                    <Badge className="bg-rose-100 text-rose-800">React</Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                      Edit Profile
                    </Button>
                    <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                      View Certificates
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Dashboard Tabs */}
        <section>
          <Tabs defaultValue="progress" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="progress">Learning Progress</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
              <TabsTrigger value="events">My Events</TabsTrigger>
            </TabsList>

            {/* Progress Tab */}
            <TabsContent value="progress" className="space-y-6">
              <h2 className="text-2xl font-bold text-purple-800">Your Learning Journey</h2>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Course 1 */}
                <Card>
                  <CardHeader className="p-0">
                    <div className="relative h-40 w-full">
                      <Image
                        src="/placeholder.svg?height=160&width=320"
                        alt="Web Development Fundamentals"
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <CardTitle className="text-xl text-purple-800">Web Development Fundamentals</CardTitle>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                      <span>3 of 4 modules completed</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">Continue Learning</Button>
                  </CardFooter>
                </Card>

                {/* Course 2 */}
                <Card>
                  <CardHeader className="p-0">
                    <div className="relative h-40 w-full">
                      <Image
                        src="/placeholder.svg?height=160&width=320"
                        alt="JavaScript Essentials"
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <CardTitle className="text-xl text-teal-800">JavaScript Essentials</CardTitle>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">40%</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                      <span>2 of 5 modules completed</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-teal-600 hover:bg-teal-700">Continue Learning</Button>
                  </CardFooter>
                </Card>

                {/* Course 3 */}
                <Card>
                  <CardHeader className="p-0">
                    <div className="relative h-40 w-full">
                      <Image
                        src="/placeholder.svg?height=160&width=320"
                        alt="React Fundamentals"
                        fill
                        className="object-cover rounded-t-lg opacity-60"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Badge className="bg-gray-200 text-gray-800">Coming Soon</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <CardTitle className="text-xl text-gray-800">React Fundamentals</CardTitle>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">0%</span>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>Unlocks after JavaScript Essentials</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" disabled>
                      Start Learning
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            {/* Certificates Tab */}
            <TabsContent value="certificates" className="space-y-6">
              <h2 className="text-2xl font-bold text-purple-800">Your Certificates</h2>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Certificate 1 */}
                <Card>
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                    <div className="h-40 w-40 flex items-center justify-center bg-purple-50 rounded-full">
                      <Award className="h-20 w-20 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-purple-800">HTML & CSS Fundamentals</h3>
                      <p className="text-sm text-gray-600">Completed on March 15, 2025</p>
                    </div>
                    <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                      <Download className="mr-2 h-4 w-4" />
                      Download Certificate
                    </Button>
                  </CardContent>
                </Card>

                {/* Certificate 2 */}
                <Card>
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                    <div className="h-40 w-40 flex items-center justify-center bg-teal-50 rounded-full">
                      <Award className="h-20 w-20 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-teal-800">Responsive Web Design</h3>
                      <p className="text-sm text-gray-600">Completed on February 20, 2025</p>
                    </div>
                    <Button variant="outline" className="border-teal-200 text-teal-600 hover:bg-teal-50">
                      <Download className="mr-2 h-4 w-4" />
                      Download Certificate
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-6">
              <h2 className="text-2xl font-bold text-purple-800">Your Events</h2>

              <div className="space-y-4">
                {/* Registered Event */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="md:w-1/4">
                        <Image
                          src="/placeholder.svg?height=120&width=200"
                          alt="Web Development Workshop"
                          width={200}
                          height={120}
                          className="rounded-lg object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold text-purple-800">Intro to Web Development</h3>
                          <Badge className="bg-green-100 text-green-800">Registered</Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>May 15, 2025</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4" />
                            <span>10:00 AM - 2:00 PM</span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 pt-2">
                          <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                            View Details
                          </Button>
                          <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                            Cancel Registration
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Attended Event */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="md:w-1/4">
                        <Image
                          src="/placeholder.svg?height=120&width=200"
                          alt="Data Science Workshop"
                          width={200}
                          height={120}
                          className="rounded-lg object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold text-gray-800">Data Science Fundamentals</h3>
                          <Badge className="bg-gray-100 text-gray-800">Attended</Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>March 20, 2025</span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 pt-2">
                          <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50">
                            View Resources
                          </Button>
                          <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50">
                            View Certificate
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  )
}
