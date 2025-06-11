import type { FAQItem, ContactCardInfo } from '@/types/faqContact'; 

export const faqData: Omit<FAQItem, 'color_variant'>[] = [ 
  {
    id: 1,
    question: "How can I join SheCodes Society?",
    answer: "You can join SheCodes Society by registering for our events or workshops. Follow us on social media to stay updated on upcoming opportunities to get involved."
  },
  {
    id: 2,
    question: "Do I need prior coding experience to join?",
    answer: "No, we welcome members of all skill levels! Many of our workshops are designed for beginners, while others cater to more experienced coders.",
  },
  {
    id: 3,
    question: "How can my company partner with SheCodes?",
    answer: "We offer various partnership opportunities for companies that share our mission. Please visit our Partnership page or contact us directly to discuss collaboration options.",
  },
  {
    id: 4, 
    question: "Are your events only for Binus students?",
    answer: "While we are based at Binus University, many of our events are open to the wider community. Check the specific event details to confirm eligibility."
  },
   {
    id: 5, 
    question: "How can I become a mentor?",
    answer: "If you're an industry professional interested in mentoring, please visit our Mentorship page and fill out the application form. We're always looking for passionate mentors!",
   },
];

export const contactCardData: ContactCardInfo[] = [
  {
    id: 1,
    platform_name: "Instagram",
    logo_src: "/logos/instagramlogo.webp", 
    description: "Follow us for event updates, community highlights, and daily tech inspiration.",
    link_url: "https://www.instagram.com/shecodes.binus/", 
    color_variant: 'pink',
  },
  {
    id: 2,
    platform_name: "LinkedIn",
    logo_src: "/logos/linkedinlogo.png", 
    description: "Connect with our professional network, find job postings, and learn about industry trends.",
    link_url: "https://www.linkedin.com/company/shecodes-binus/", 
    color_variant: 'pink', 
  },
  {
    id: 3,
    platform_name: "WhatsApp",
    logo_src: "/logos/whatsapplogo.webp", 
    description: "Chat with us directly for quick inquiries or questions about joining.",
    link_url: "https://wa.me/6281234567890",
    color_variant: 'pink',
  },
   {
    id: 4,
    platform_name: "Email",
    logo_src: "/logos/emaillogo.webp",
    description: "Send us your detailed questions, partnership proposals, or feedback.",
    link_url: "mailto:shecodes.binus@gmail.com",
    color_variant: 'pink', 
  },
];

export type { FAQItem, ContactCardInfo };