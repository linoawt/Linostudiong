
import React from 'react';
import { Testimonial } from '../types';

const testimonials: Testimonial[] = [
  {
    id: '1',
    quote: "Lino Studio NG delivered beyond expectations. Clean design, fast delivery, and excellent communication throughout the process.",
    author: "Samuel Peterson",
    role: "CEO, TechFlow Nigeria"
  },
  {
    id: '2',
    quote: "Professional, creative, and reliable. They understood our brand vision perfectly and translated it into a stunning digital presence.",
    author: "Adaobi Okafor",
    role: "Marketing Lead, Urban Bloom"
  },
  {
    id: '3',
    quote: "The web application they built for us is not only visually beautiful but performs flawlessly. Truly a top-tier studio.",
    author: "Johnathan Smith",
    role: "Founder, Zenith Hub"
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-white/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">Client Trust Stories</h2>
          <p className="text-gray-600">Don't just take my word for it—hear from the brands I've helped.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.id} className="clay-card p-10 relative flex flex-col justify-between">
              <div className="absolute top-8 left-8 text-6xl text-indigo-200 opacity-50 font-serif">“</div>
              <p className="text-gray-700 italic mb-8 relative z-10 text-lg leading-relaxed pt-8">
                {t.quote}
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 clay-card-inset flex items-center justify-center font-black text-indigo-600">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{t.author}</h4>
                  <p className="text-indigo-600 text-sm">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
