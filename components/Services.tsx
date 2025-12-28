
import React, { useState, useEffect } from 'react';
import { Service } from '../types';
import { supabase } from '../supabase';

const MOCK_SERVICES: Service[] = [
  {
    id: 'mock-s1',
    title: 'Graphic Design',
    icon: '🖌',
    description: 'Creating visual languages that define brands and capture attention.',
    items: ['Branding & Identity', 'Logo Design', 'Social Media Graphics', 'Print Designs']
  },
  {
    id: 'mock-s2',
    title: 'Web Development',
    icon: '💻',
    description: 'Building high-performance, responsive websites with modern stacks.',
    items: ['React & Next.js', 'Node.js Backend', 'E-commerce Solutions', 'Custom Web Apps']
  },
  {
    id: 'mock-s3',
    title: 'UI/UX Strategy',
    icon: '🎨',
    description: 'Designing intuitive user experiences focused on conversion and flow.',
    items: ['Interactive Wireframes', 'Visual Prototyping', 'User Journey Mapping', 'Design Systems']
  },
  {
    id: 'mock-s4',
    title: 'Brand Growth',
    icon: '🚀',
    description: 'Strategic consultation to scale your digital presence effectively.',
    items: ['SEO Optimization', 'Digital Audit', 'Marketing Strategy', 'Launch Support']
  }
];

const Services: React.FC = () => {
  const [items, setItems] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          console.warn("Supabase Fetch Error (Services):", error.message || error);
          setItems(MOCK_SERVICES);
        } else if (!data || data.length === 0) {
          setItems(MOCK_SERVICES);
        } else {
          setItems(data);
        }
      } catch (err: any) {
        console.error("Critical error fetching services:", err.message || err);
        setItems(MOCK_SERVICES);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section id="services" className="py-24 px-6 bg-white/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">Core Services</h2>
          <p className="text-gray-600 max-w-xl mx-auto">Clean visuals. Functional code. Results that last.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="clay-card p-10 animate-pulse">
                <div className="w-16 h-16 clay-card-inset mb-6 bg-gray-200"></div>
                <div className="h-6 w-3/4 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 w-full bg-gray-100 rounded mb-6"></div>
                <div className="space-y-2">
                  <div className="h-3 w-2/3 bg-gray-100 rounded"></div>
                  <div className="h-3 w-1/2 bg-gray-100 rounded"></div>
                </div>
              </div>
            ))
          ) : (
            items.map((service) => (
              <div key={service.id} className="clay-card p-10 group hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 clay-card-inset flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6 text-sm">{service.description}</p>
                <ul className="space-y-2">
                  {service.items && Array.isArray(service.items) && service.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                      <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Services;
