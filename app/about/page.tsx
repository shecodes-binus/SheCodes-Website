import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AboutPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="space-y-12">
        {/* About Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-800">
              About SheCodes Society
            </h1>
            <p className="text-gray-600 md:text-xl">Empowering women in STEM through education and community</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <p className="text-gray-600">
                SheCodes Society Binus was founded in 2020 with a mission to bridge the gender gap in technology fields.
                We believe that diversity in tech leads to better innovation and more inclusive products.
              </p>
              <p className="text-gray-600">
                Through workshops, mentorship programs, and networking events, we provide women with the skills,
                confidence, and connections they need to thrive in tech careers.
              </p>
              <p className="text-gray-600">
                Our community includes students, professionals, and industry leaders who are passionate about creating
                opportunities for women in STEM fields.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="SheCodes Team"
                width={600}
                height={400}
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl text-purple-800">Vision & Mission</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="p-6 space-y-2">
                <h3 className="text-xl font-bold text-purple-800">Our Vision</h3>
                <p className="text-gray-600">
                  A tech industry where women are equally represented, valued, and empowered to lead with innovation,
                  inspiration, and impact.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 space-y-2">
                <h3 className="text-xl font-bold text-purple-800">Our Mission</h3>
                <p className="text-gray-600">
                  To inspire and equip girls with the skills needed to thrive in technology through education,
                  mentorship, and community building.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Team Section */}
        <section className="space-y-6" id="team">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl text-purple-800">Meet Our Champions</h2>
            <p className="text-gray-600">The dedicated team behind SheCodes Society Binus</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={`/placeholder.svg?height=96&width=96`} alt={`Team Member ${i}`} />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-bold">Team Member {i}</h3>
                    <p className="text-sm text-gray-600">Position</p>
                  </div>
                  <p className="text-gray-600 text-sm">
                    "I'm passionate about empowering women in tech and creating opportunities for the next generation."
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Success Stories */}
        <section className="space-y-6" id="success-stories">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl text-purple-800">Success Stories</h2>
            <p className="text-gray-600">Inspiring journeys of our alumni</p>
          </div>
          <Tabs defaultValue="story1" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="story1">Story 1</TabsTrigger>
              <TabsTrigger value="story2">Story 2</TabsTrigger>
              <TabsTrigger value="story3">Story 3</TabsTrigger>
            </TabsList>
            <TabsContent value="story1" className="p-4">
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <Image
                    src="/placeholder.svg?height=400&width=400"
                    alt="Success Story 1"
                    width={400}
                    height={400}
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-purple-800">From Beginner to Tech Lead</h3>
                  <p className="text-gray-600">
                    "I joined SheCodes with zero coding experience. Through their workshops and mentorship program, I
                    gained the skills and confidence to pursue a career in tech. Today, I'm a Tech Lead at a leading
                    software company, and I continue to mentor other women in the SheCodes community."
                  </p>
                  <div>
                    <p className="font-bold">Sarah Johnson</p>
                    <p className="text-sm text-gray-600">SheCodes Alumni, 2021</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="story2" className="p-4">
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <Image
                    src="/placeholder.svg?height=400&width=400"
                    alt="Success Story 2"
                    width={400}
                    height={400}
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-purple-800">Building My Own Startup</h3>
                  <p className="text-gray-600">
                    "SheCodes gave me the technical foundation and entrepreneurial mindset to launch my own tech
                    startup. The network I built through the community has been invaluable in finding co-founders,
                    mentors, and early investors."
                  </p>
                  <div>
                    <p className="font-bold">Maya Chen</p>
                    <p className="text-sm text-gray-600">SheCodes Alumni, 2020</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="story3" className="p-4">
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <Image
                    src="/placeholder.svg?height=400&width=400"
                    alt="Success Story 3"
                    width={400}
                    height={400}
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-purple-800">Career Transition to Data Science</h3>
                  <p className="text-gray-600">
                    "After working in marketing for 5 years, I wanted to transition to data science. SheCodes'
                    specialized workshops and supportive community made this career change possible. Now I'm working as
                    a Data Scientist and loving every minute of it!"
                  </p>
                  <div>
                    <p className="font-bold">Priya Patel</p>
                    <p className="text-sm text-gray-600">SheCodes Alumni, 2022</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  )
}
