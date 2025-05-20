import type { FAQItem, ContactCardInfo } from '@/types/faqContact'; 

export const faqData: Omit<FAQItem, 'colorVariant'>[] = [ 
  {
    id: "item-1",
    question: "How can I join SheCodes Society?",
    answer: "You can join SheCodes Society by registering for our events or workshops. Follow us on social media to stay updated on upcoming opportunities to get involved.",
  },
  {
    id: "item-2",
    question: "Do I need prior coding experience to join?",
    answer: "No, we welcome members of all skill levels! Many of our workshops are designed for beginners, while others cater to more experienced coders."
  },
  {
    id: "item-3",
    question: "How can my company partner with SheCodes?",
    answer: "We offer various partnership opportunities for companies that share our mission. Please visit our Partnership page or contact us directly to discuss collaboration options."
  },
  {
    id: "item-4",
    question: "Are your events only for Binus students?",
    answer: "While we are based at Binus University, many of our events are open to the wider community. Check the specific event details to confirm eligibility.",
  },
   {
    id: "item-5",
    question: "How can I become a mentor?",
    answer: "If you're an industry professional interested in mentoring, please visit our Mentorship page and fill out the application form. We're always looking for passionate mentors!",
   },
];

export const contactCardData: ContactCardInfo[] = [
  {
    id: 1,
    platformName: "Instagram",
    logoSrc: "/logos/instagramlogo.webp", 
    description: "Follow us for event updates, community highlights, and daily tech inspiration.",
    linkUrl: "https://www.instagram.com/shecodes.binus/", 
    colorVariant: 'pink',
  },
  {
    id: 2,
    platformName: "LinkedIn",
    logoSrc: "/logos/linkedinlogo.png", 
    description: "Connect with our professional network, find job postings, and learn about industry trends.",
    linkUrl: "https://www.linkedin.com/company/shecodes-binus/", 
    colorVariant: 'pink', 
  },
  {
    id: 3,
    platformName: "WhatsApp",
    logoSrc: "/logos/whatsapplogo.webp", 
    description: "Chat with us directly for quick inquiries or questions about joining.",
    linkUrl: "https://wa.me/6281234567890",
    colorVariant: 'pink',
  },
   {
    id: 4,
    platformName: "Email",
    logoSrc: "/logos/emaillogo.webp",
    description: "Send us your detailed questions, partnership proposals, or feedback.",
    linkUrl: "mailto:shecodes.binus@gmail.com",
    colorVariant: 'pink', 
  },
];

export type { FAQItem, ContactCardInfo };