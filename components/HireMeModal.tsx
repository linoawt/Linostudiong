
import React, { useState } from 'react';

interface HireMeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HireMeModal: React.FC<HireMeModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    budget: 'Standard',
    message: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = `New Project Inquiry from ${formData.name}`;
    const body = `Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0ABudget: ${formData.budget}%0D%0AMessage: ${formData.message}`;
    
    // 1. "Post to mail" simulation via mailto
    const mailtoUrl = `mailto:linostudiong@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    
    // 2. WhatsApp redirect with pre-filled info
    const whatsappMsg = `Hello Lino Studio! I am ${formData.name}. I'm interested in a project with a budget of ${formData.budget}. Details: ${formData.message}`;
    const whatsappUrl = `https://wa.me/234XXXXXXXXXX?text=${encodeURIComponent(whatsappMsg)}`;

    // Execute actions
    window.location.href = mailtoUrl;
    
    // Small delay to let the mail client trigger before switching/opening WhatsApp
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-y-auto bg-indigo-900/20 backdrop-blur-sm animate-fadeIn">
      <div className="clay-card w-full max-w-lg p-8 md:p-12 relative animate-scaleIn">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 clay-button flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-black mb-2">Let's <span className="text-indigo-600">Collaborate</span></h2>
          <p className="text-gray-500">Fill in the vital info to start your journey with us.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-2">Your Full Name</label>
            <input 
              required
              type="text" 
              placeholder="Enter your name"
              className="w-full clay-card-inset px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all border-none bg-transparent"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-2">Email Address</label>
            <input 
              required
              type="email" 
              placeholder="example@mail.com"
              className="w-full clay-card-inset px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all border-none bg-transparent"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-2">Project Budget Range</label>
            <select 
              className="w-full clay-card-inset px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all border-none bg-transparent appearance-none"
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
            >
              <option value="Starter">Starter ($299 - $500)</option>
              <option value="Professional">Professional ($500 - $1,200)</option>
              <option value="Premium">Premium ($1,200+)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-2">Project Description</label>
            <textarea 
              required
              rows={4} 
              placeholder="Briefly describe what you need..."
              className="w-full clay-card-inset px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all border-none bg-transparent resize-none"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
            ></textarea>
          </div>

          <button 
            type="submit"
            className="clay-button-primary w-full py-5 font-black text-lg flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Confirm & Send</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
          
          <p className="text-[10px] text-center text-gray-400 mt-4 px-4 uppercase tracking-tighter">
            This will open your email client and then redirect you to WhatsApp for instant chat.
          </p>
        </form>
      </div>
    </div>
  );
};

export default HireMeModal;
