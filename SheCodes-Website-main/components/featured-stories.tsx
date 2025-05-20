import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function FeaturedStories() {
  const stories = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Software Engineer at Tech Company",
      quote:
        "SheCodes gave me the confidence and skills to pursue a career in tech. The supportive community and hands-on workshops were exactly what I needed to break into the industry.",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      id: 2,
      name: "Maya Chen",
      role: "Tech Startup Founder",
      quote:
        "Through SheCodes, I found mentors who guided me in launching my own tech startup. The network I built has been invaluable for finding co-founders and early investors.",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      id: 3,
      name: "Priya Patel",
      role: "Data Scientist",
      quote:
        "After working in marketing for years, I wanted to transition to data science. SheCodes' specialized workshops made this career change possible. Now I'm thriving in my new role!",
      image: "/placeholder.svg?height=400&width=400",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-3 w-full">
      {stories.map((story) => (
        <Card key={story.id} className="overflow-hidden h-full">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={story.image || "/placeholder.svg"} alt={story.name} />
              <AvatarFallback>{story.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-bold">{story.name}</h3>
              <p className="text-sm text-gray-600">{story.role}</p>
            </div>
            <p className="text-gray-600 italic">"{story.quote}"</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
