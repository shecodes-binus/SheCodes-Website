import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Mail, Phone, MapPin, Instagram, Linkedin, Github } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="space-y-12">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-800">Contact Us</h1>
          <p className="text-gray-600 md:text-xl">Get in touch with the SheCodes team</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-purple-800">Send Us a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input id="first-name" placeholder="Enter your first name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input id="last-name" placeholder="Enter your last name" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Enter the subject" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Enter your message" className="min-h-32" />
                </div>
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-purple-800">Contact Information</CardTitle>
                <CardDescription>Reach out to us through any of these channels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Mail className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-600">shecodes.binus@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-gray-600">+62 123 4567 890</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <MapPin className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Location</h3>
                    <p className="text-gray-600">
                      Binus University, Anggrek Campus
                      <br />
                      Jakarta, Indonesia
                    </p>
                  </div>
                </div>
                <div className="pt-4">
                  <h3 className="font-medium mb-2">Social Media</h3>
                  <div className="flex space-x-4">
                    <Link href="https://www.instagram.com/shecodes.binus/" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon" className="rounded-full">
                        <Instagram className="h-5 w-5 text-purple-600" />
                        <span className="sr-only">Instagram</span>
                      </Button>
                    </Link>
                    <Link
                      href="https://www.linkedin.com/company/shecodes-binus/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="icon" className="rounded-full">
                        <Linkedin className="h-5 w-5 text-purple-600" />
                        <span className="sr-only">LinkedIn</span>
                      </Button>
                    </Link>
                    <Link href="#" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon" className="rounded-full">
                        <Github className="h-5 w-5 text-purple-600" />
                        <span className="sr-only">GitHub</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-purple-800">Frequently Asked Questions</CardTitle>
                <CardDescription>Find quick answers to common questions</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How can I join SheCodes Society?</AccordionTrigger>
                    <AccordionContent>
                      You can join SheCodes Society by registering for our events or workshops. Follow us on social
                      media to stay updated on upcoming opportunities to get involved.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Do I need prior coding experience to join?</AccordionTrigger>
                    <AccordionContent>
                      No, we welcome members of all skill levels! Many of our workshops are designed for beginners,
                      while others cater to more experienced coders.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>How can my company partner with SheCodes?</AccordionTrigger>
                    <AccordionContent>
                      We offer various partnership opportunities for companies that share our mission. Please visit our
                      Partnership page or contact us directly to discuss collaboration options.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>Are your events only for Binus students?</AccordionTrigger>
                    <AccordionContent>
                      While we are based at Binus University, many of our events are open to the wider community. Check
                      the specific event details to confirm eligibility.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5">
                    <AccordionTrigger>How can I become a mentor?</AccordionTrigger>
                    <AccordionContent>
                      If you're an industry professional interested in mentoring, please visit our Mentorship page and
                      fill out the application form. We're always looking for passionate mentors!
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
