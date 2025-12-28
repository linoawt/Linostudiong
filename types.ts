
export interface Project {
  id: string;
  title: string;
  category: 'Graphic Design' | 'Web Development';
  thumbnail: string;
  description: string;
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
