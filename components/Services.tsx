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
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

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
            items.map((service) => {
              const isExpanded = expandedId === service.id;
              return (
                <div key={service.id} className={`clay-card p-10 group transition-all duration-500 overflow-hidden flex flex-col ${isExpanded ? 'ring-4 ring-indigo-100 bg-white/60' : 'hover:-translate-y-2'}`}>
                  <div className="w-16 h-16 clay-card-inset flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6 text-sm flex-grow">{service.description}</p>
                  
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-96 opacity-100 mb-8' : 'max-h-0 opacity-0'}`}>
                    <div className="clay-card-inset p-6 bg-indigo-50/30">
                      <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">What's Included</h4>
                      <ul className="space-y-3">
                        {service.items && Array.isArray(service.items) && service.items.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-gray-700 font-bold text-xs">
                            <span className="w-2 h-2 bg-indigo-600 rounded-full shadow-[0_0_8px_rgba(79,70,229,0.5)]"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button 
                    onClick={() => toggleExpand(service.id)}
                    className={`clay-button w-full py-3 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${isExpanded ? 'text-indigo-600 bg-white' : 'text-gray-400 hover:text-indigo-500'}`}
                  >
                    {isExpanded ? 'Show Less' : 'View Details'}
                    <svg className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default Services;