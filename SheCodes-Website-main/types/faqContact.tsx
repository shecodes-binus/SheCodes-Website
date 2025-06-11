export interface FAQItem {
    id: number; // Use string for Accordion value
    question: string;
    answer: string;
    color_variant: 'pink' | 'blue' | 'purple';
  }
  
  export interface ContactCardInfo {
    id: number;
    platform_name: string;
    logo_src: string;
    description: string;
    link_url: string; // External URL
    color_variant: 'pink' | 'blue'; // For button color
  }