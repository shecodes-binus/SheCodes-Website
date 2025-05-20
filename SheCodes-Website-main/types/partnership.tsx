export interface Mentor {
    id: number;
    name: string;
    occupation: string;
    description: string;
    imageSrc: string;
    story: string;
    instagram: string;
    linkedin: string;
    status: 'active' | 'inactive';
  }
  
  export interface Partner {
    id: number;
    name: string;
    logoSrc: string;
  }