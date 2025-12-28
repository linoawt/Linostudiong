
export interface Project {
  id: string;
  title: string;
  category: 'Graphic Design' | 'Web Development';
  thumbnail: string;
  description: string;
  projectUrl?: string;
  project_url?: string; // Supabase field mapping
}

export interface Service {
  id: string;
  title: string;
  icon: string;
  description: string;
  items: string[];
}

export interface Skill {
  name: string;
  level: number;
  category: 'Design' | 'Development';
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
}

export interface PricePlan {
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SEOConfig {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}

export interface SiteConfig {
  siteName: string;
  tagline: string;
  heroHeadline: string;
  heroSubtext: string;
  contactEmail: string;
  contactPhone: string;
  location: string;
  instagramUrl: string;
  linkedInUrl: string;
  theme: 'light' | 'dark';
  couponPrefix: string;
  seo: SEOConfig;
  projects: Project[];
  services: Service[];
  skills: Skill[];
  faqs: FAQItem[];
  plans: PricePlan[];
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  type: 'HIRE_ME' | 'CONTACT_FORM';
  budget?: string;
  message: string;
  referenceCode?: string;
  timestamp?: string;
  created_at?: string;
  emailFormatted?: string;
  reference_code?: string;
  email_formatted?: string;
}
