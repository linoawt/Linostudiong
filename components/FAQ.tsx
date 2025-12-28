
import React, { useState } from 'react';
import { FAQItem } from '../types';

interface FAQProps {
  items: FAQItem[];
}

const FAQ: React.FC<FAQProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section className="py-24 px-6 bg-indigo-50/20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-black mb-4">FAQ</h2><p className="text-gray-600">Common questions about Lino Studio NG.</p></div>
        <div className="space-y-6">
          {items.map((faq, idx) => (
            <div key={idx} className="clay-card overflow-hidden">
              <button className="w-full px-8 py-6 text-left flex items-center justify-between group" onClick={() => setOpenIndex(openIndex === idx ? null : idx)}>
                <span className="text-lg font-bold group-hover:text-indigo-600 transition-colors">{faq.question}</span>
                <div className={`w-8 h-8 clay-card-inset flex items-center justify-center transition-transform ${openIndex === idx ? 'rotate-180' : ''}`}><svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg></div>
              </button>
              {openIndex === idx && <div className="px-8 pb-8 animate-fadeIn"><div className="h-px bg-indigo-100 mb-6"></div><p className="text-gray-600 leading-relaxed">{faq.answer}</p></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
