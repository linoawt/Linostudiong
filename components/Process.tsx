
import React from 'react';

const steps = [
  { icon: '🔍', title: 'Discovery & Research', description: 'We dive deep into your brand, audience, and goals to build a solid foundation.' },
  { icon: '✏️', title: 'Design & Wireframing', description: 'Visualizing the concept through sketches, layouts, and interactive prototypes.' },
  { icon: '🧑‍💻', title: 'Development & Testing', description: 'Bringing designs to life with clean code and rigorous quality assurance.' },
  { icon: '🚀', title: 'Launch & Support', description: 'Deploying your project to the world and providing ongoing optimization.' }
];

const Process: React.FC = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">My Creative Process</h2>
          <p className="text-gray-600 max-w-xl mx-auto">Every project follows a clear, collaborative process to ensure quality and clarity.</p>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-indigo-100 -translate-y-1/2 -z-10"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="clay-card p-10 text-center flex flex-col items-center">
                <div className="w-20 h-20 clay-card-inset flex items-center justify-center text-4xl mb-6 relative">
                  {step.icon}
                  <div className="absolute -top-3 -right-3 w-8 h-8 clay-button-primary rounded-full flex items-center justify-center text-sm font-black">
                    {idx + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
