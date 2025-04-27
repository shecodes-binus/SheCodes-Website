// src/app/faq-contact/page.tsx

import Image from "next/image";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Import Data and Types
import type { FAQItem, ContactCardInfo } from '@/types/faqContact'; // Adjust path
import { faqData, contactCardData } from '@/data/dummyFAQContact'; // Adjust path

export default function FAQContactPage() {

  // Array defining the repeating color sequence
  const faqColorSequence: FAQItem['colorVariant'][] = ['pink', 'blue', 'purple'];

  // Helper to get conditional accordion styling (adjust colors as needed)
  const getAccordionColors = (variant: FAQItem['colorVariant']) => {
    switch (variant) {
      case 'pink':
        return {
          triggerBg: 'bg-pink hover:bg-pink/90',
          triggerText: 'text-white',
          contentBg: 'bg-pink-100',
        };
      case 'blue':
        return {
          triggerBg: 'bg-blueSky hover:bg-blueSky/90',
          triggerText: 'text-white',
          contentBg: 'bg-sky-100',
        };
      case 'purple':
        return {
          triggerBg: 'bg-purple-2/50 hover:bg-purple-2/45',
          triggerText: 'text-white',
          contentBg: 'bg-purple-100',
        };
      default:
        return {
          triggerBg: 'bg-gray-200',
          triggerText: 'text-gray-800',
          contentBg: 'bg-gray-50',
        };
    }
  };

    const getButtonColor = (variant: ContactCardInfo['colorVariant']) => {
        return variant === 'pink' ? 'bg-pink hover:bg-pink/90' : 'bg-blueSky hover:bg-blueSky/90';
    }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">

        {/* --- FAQ Section --- */}
        <section className="mx-auto px-12 md:px-24 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text & Accordion Column */}
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl/[60px] lg:text-6xl/[70px] font-bold text-blueSky tracking-normal">
                Frequently Asked Questions
              </h1>
              <Accordion type="single" collapsible className="w-full space-y-4">
                 {/* --- MODIFIED MAPPING --- */}
                {faqData.map((item, index) => { // Added index parameter
                  // Determine color based on index using modulo
                  const currentVariant = faqColorSequence[index % faqColorSequence.length];
                  const colors = getAccordionColors(currentVariant); // Get colors for the calculated variant

                  return (
                    <AccordionItem key={item.id} value={item.id} className="border-none rounded-lg overflow-hidden shadow-lg">
                      <AccordionTrigger className={`px-6 py-4 text-left font-semibold text-lg rounded-lg ${colors.triggerBg} ${colors.triggerText}`}>
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className={`p-6 text-base leading-relaxed ${colors.contentBg}`}>
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
                {/* --- END OF MODIFIED MAPPING --- */}
              </Accordion>
            </div>

            {/* Image Column */}
            <div className="flex items-center justify-center hidden md:flex">
               {/* ... (FAQ Image remains the same) ... */}
               <Image
                src="/faq.png"
                alt="Frequently Asked Questions Graphic"
                width={700}
                height={600}
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* --- Get in Touch Section --- */}
        <section className="bg-blueSky py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6 space-y-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center">
              GET IN TOUCH WITH US
            </h2>
            {/* Flexbox for cards - No changes needed here, map handles new data */}
            <div className="flex flex-wrap justify-center items-stretch gap-8 md:gap-12">
              {contactCardData.map((card: ContactCardInfo) => (
                <Card key={card.id} className="w-full max-w-sm rounded-xl overflow-hidden flex flex-col bg-white shadow-lg">
                  <CardContent className="p-8 flex flex-col items-center text-center flex-grow space-y-5">
                    <div className="relative h-24 w-32 mb-4">
                        <Image
                          src={card.logoSrc}
                          alt={`${card.platformName} Logo`}
                          fill
                          className="object-contain"
                          sizes="128px"
                        />
                    </div>
                    <h3 className={`text-2xl font-bold ${card.colorVariant === 'pink' ? 'text-pink' : 'text-purple-3'}`}>
                      {card.platformName}
                    </h3>
                    <p className="text-gray-600 text-sm flex-grow">{card.description}</p>
                    <a
                        href={card.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full mt-auto pt-4"
                    >
                        <Button className={`w-full rounded-full px-8 py-3 text-lg font-semibold text-white ${getButtonColor(card.colorVariant)}`}>
                            Open
                        </Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

      </main>
      {/* --- Footer Section --- */}
      {/* <Footer /> */}
    </div>
  );
}