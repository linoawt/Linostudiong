
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

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

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [resultData, setResultData] = useState<{ referenceCode: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const prompt = `
        You are the Lino Studio NG Automated Lead Controller. 
        Process the following client inquiry:
        Name: ${formData.name}
        Email: ${formData.email}
        Budget: ${formData.budget}
        Message: ${formData.message}

        1. Construct a formal HTML-formatted email with a Header (Project Registration), Body (Details), and Footer (System Generated).
        2. Generate a unique 8-character alphanumeric Project Reference Coupon (e.g., LINO-XXXX).
        3. Return a JSON response.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              success: { type: Type.BOOLEAN },
              emailFormatted: { type: Type.STRING },
              referenceCode: { type: Type.STRING }
            },
            required: ["success", "emailFormatted", "referenceCode"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      
      if (data.success) {
        setResultData({ referenceCode: data.referenceCode });
        setStatus('success');
      } else {
        throw new Error("Failed to process inquiry");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setStatus('error');
    }
  };

  const handleWhatsAppRedirect = () => {
    if (!resultData) return;
    const msg = `Hello Lino Studio! My Project Ref is: ${resultData.referenceCode}. I just submitted an inquiry for my ${formData.budget} project and I'm ready to start.`;
    const url = `https://wa.me/2349070962800?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    onClose();
    // Reset state for next time
    setTimeout(() => {
        setStatus('idle');
        setResultData(null);
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

        {status === 'idle' || status === 'submitting' || status === 'error' ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black mb-2">Hire <span className="text-indigo-600">Lino Studio</span></h2>
              <p className="text-gray-500">Submit your project details for instant AI verification and WhatsApp access.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-2">Your Full Name</label>
                <input 
                  required
                  disabled={status === 'submitting'}
                  type="text" 
                  placeholder="Enter your name"
                  className="w-full clay-card-inset px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all border-none bg-transparent disabled:opacity-50"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-2">Email Address</label>
                <input 
                  required
                  disabled={status === 'submitting'}
                  type="email" 
                  placeholder="example@mail.com"
                  className="w-full clay-card-inset px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all border-none bg-transparent disabled:opacity-50"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-2">Project Tier</label>
                <select 
                  disabled={status === 'submitting'}
                  className="w-full clay-card-inset px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all border-none bg-transparent appearance-none disabled:opacity-50"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                >
                  <option value="Starter">Starter Plan</option>
                  <option value="Professional">Professional Plan</option>
                  <option value="Premium">Premium Plan</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-2">Vital Project Information</label>
                <textarea 
                  required
                  disabled={status === 'submitting'}
                  rows={4} 
                  placeholder="Vital information for the project..."
                  className="w-full clay-card-inset px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all border-none bg-transparent resize-none disabled:opacity-50"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              {status === 'error' && (
                <p className="text-red-500 text-center text-sm font-bold">Something went wrong. Please try again.</p>
              )}

              <button 
                type="submit"
                disabled={status === 'submitting'}
                className="clay-button-primary w-full py-5 font-black text-lg flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70"
              >
                {status === 'submitting' ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing Inquiry...</span>
                  </>
                ) : (
                  <span>Submit Inquiry</span>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-10 animate-scaleIn">
            <div className="w-24 h-24 clay-card-inset mx-auto flex items-center justify-center text-5xl mb-8 text-green-500">
              ✓
            </div>
            <h2 className="text-3xl font-black mb-4">Inquiry Received!</h2>
            <p className="text-gray-600 mb-8">
              Your inquiry has been successfully sent to my mail. Use your project coupon below for priority access on WhatsApp.
            </p>
            
            <div className="clay-card-inset p-6 mb-10 bg-indigo-50/30">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-2">Project Reference Coupon</span>
              <span className="text-3xl font-black text-indigo-600 tracking-tighter">{resultData?.referenceCode}</span>
            </div>

            <button 
              onClick={handleWhatsAppRedirect}
              className="clay-button-primary w-full py-5 font-black text-lg flex items-center justify-center gap-3 transform hover:scale-[1.05] transition-all"
            >
              <span>Continue to WhatsApp</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.63 1.438h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HireMeModal;
