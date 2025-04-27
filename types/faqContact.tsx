export interface FAQItem {
    id: string; // Use string for Accordion value
    question: string;
    answer: string;
    colorVariant: 'pink' | 'blue' | 'purple';
  }
  
  export interface ContactCardInfo {
    id: number;
    platformName: string;
    logoSrc: string;
    description: string;
    linkUrl: string; // External URL
    colorVariant: 'pink' | 'blue'; // For button color
  }