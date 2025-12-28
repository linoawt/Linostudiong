
import React from 'react';
import { Service } from '../types';

interface ServicesProps {
  items: Service[];
}

const Services: React.FC<ServicesProps> = ({ items }) => {
  return (
    <section id="services" className="py-24 px-6 bg-white/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">Core Services</h2>
          <p className="text-gray-600 max-w-xl mx-auto">Clean visuals. Functional code. Results that last.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((service) => (
            <div key={service.id} className="clay-card p-10 group hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 clay-card-inset flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-6 text-sm">{service.description}</p>
              <ul className="space-y-2">
                {service.items.map(item => (
                  <li key={item} className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
