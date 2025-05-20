import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function UpcomingEvents() {
  const events = [
    {
      id: 1,
      title: "Intro to Web Development",
      type: "Workshop",
      typeColor: "purple",
      date: "May 15, 2025",
      time: "10:00 AM - 2:00 PM",
      location: "Binus University, Anggrek Campus",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 2,
      title: "Women in AI: Breaking Barriers",
      type: "Panel",
      typeColor: "teal",
      date: "June 5, 2025",
      time: "4:00 PM - 6:00 PM",
      location: "Online (Zoom)",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 3,
      title: "Hackathon: Tech for Good",
      type: "Hackathon",
      typeColor: "rose",
      date: "July 10-12, 2025",
      time: "48-hour event",
      location: "Binus University, Alam Sutera Campus",
      image: "/placeholder.svg?height=200&width=400",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full">
      {events.map((event) => (
        <Link href={`/events/${event.id}`} key={event.id}>
          <Card className="overflow-hidden h-full transition-all hover:shadow-md">
            <div className="relative h-48 w-full">
              <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
              <Badge
                className={`absolute top-4 right-4 bg-${event.typeColor}-600`}
                style={{
                  backgroundColor:
                    event.typeColor === "purple"
                      ? "rgb(147, 51, 234)"
                      : event.typeColor === "teal"
                        ? "rgb(13, 148, 136)"
                        : "rgb(225, 29, 72)",
                }}
              >
                {event.type}
              </Badge>
            </div>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-bold">{event.title}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
