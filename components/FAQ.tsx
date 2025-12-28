
import React, { useState } from 'react';
import { FAQItem } from '../types';

const faqs: FAQItem[] = [
  { question: "What services do you offer?", answer: "We provide comprehensive graphic design, full brand identity development, and end-to-end web development using modern stacks like React, Node.js, and PHP." },
  { question: "Do you work with clients outside Nigeria?", answer: "Absolutely! We work with clients globally using video conferencing and collaborative tools like Slack, Figma, and GitHub." },
  { question: "How long does a project take?", answer: "Timelines depend on the project's complexity. A logo or flyer might take 3 days, while a full-scale web application can take 2-4 weeks." },
  { question: "Do you offer revisions?", answer: "Yes, revisions are a core part of our process. Each pricing plan includes a specific number of rounds to ensure you are 100% satisfied." },
  { question: "What tools do you use?", answer: "For design, we use Figma, Photoshop, and Illustrator. For development, we leverage HTML5, Tailwind CSS, JavaScript, React, and various backend technologies." },
  { question: "How can I start?", answer: "The easiest way is to use the contact form below or send us an email directly at linostudiong@gmail.com." },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-6 bg-indigo-50/20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">FAQ</h2>
          <p className="text-gray-600">Common questions about working with Lino Studio NG.</p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="clay-card overflow-hidden">
              <button 
                className="w-full px-8 py-6 text-left flex items-center justify-between group"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="text-lg font-bold group-hover:text-indigo-600 transition-colors">{faq.question}</span>
                <div className={`w-8 h-8 clay-card-inset flex items-center justify-center transition-transform ${openIndex === idx ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openIndex === idx && (
                <div className="px-8 pb-8 animate-fadeIn">
                  <div className="h-px bg-indigo-100 mb-6"></div>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
