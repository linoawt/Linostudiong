import React from 'react';
import { PricePlan } from '../types';

interface PricingProps {
  plans: PricePlan[];
  onStartProject: () => void;
}

const Pricing: React.FC<PricingProps> = ({ plans, onStartProject }) => {
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">Service Plans</h2>
          <p className="text-gray-600">Transparent pricing tailored to your business needs.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan.name} className={`p-12 flex flex-col ${plan.highlighted ? 'clay-card border-4 border-indigo-200 scale-105 z-10' : 'clay-card'}`}>
              <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-8"><span className="text-4xl font-black text-indigo-600">{plan.price}</span><span className="text-gray-500 text-sm">/ project</span></div>
              <ul className="space-y-4 mb-10 flex-grow">
                {plan.features.map(feat => (
                  <li key={feat} className="flex items-center gap-3 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>
                    {feat}
                  </li>
                ))}
              </ul>
              <button 
                onClick={onStartProject}
                className={`w-full py-4 font-black transition-all ${plan.highlighted ? 'clay-button-primary' : 'clay-button hover:text-indigo-600'}`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;