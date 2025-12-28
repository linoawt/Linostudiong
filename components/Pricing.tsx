
import React from 'react';
import { PricePlan } from '../types';

const plans: PricePlan[] = [
  {
    name: "Starter",
    price: "$299",
    features: ["Basic design or landing page", "Quick turnaround (3-5 days)", "Email support", "1 Revision included"]
  },
  {
    name: "Professional",
    price: "$799",
    highlighted: true,
    features: ["Full branding or website", "Responsive modern design", "3 Revisions included", "Basic SEO optimization", "Priority support"]
  },
  {
    name: "Premium",
    price: "$1,499",
    features: ["Full brand + web solution", "E-commerce or custom dashboard", "Ongoing technical support", "Advanced SEO & performance", "Unlimited revisions"]
  }
];

const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">Service Plans</h2>
          <p className="text-gray-600">Transparent pricing tailored to your business needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`p-12 flex flex-col ${plan.highlighted ? 'clay-card border-4 border-indigo-200 scale-105 z-10 bg-indigo-50/10' : 'clay-card'}`}
            >
              <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black text-indigo-600">{plan.price}</span>
                <span className="text-gray-500 text-sm">/ project</span>
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {plan.features.map(feat => (
                  <li key={feat} className="flex items-center gap-3 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 font-black transition-all ${plan.highlighted ? 'clay-button-primary' : 'clay-button hover:text-indigo-600'}`}>
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
