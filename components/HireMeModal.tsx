
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { SiteConfig } from '../types';

interface HireMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SiteConfig;
}

const HireMeModal: React.FC<HireMeModalProps> = ({ isOpen, onClose, config }) => {
  const [formData, setFormData] = useState({ name: '', email: '', budget: 'Professional', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [resultData, setResultData] = useState<{ referenceCode: string } | null>(null);

  if (!isOpen) return null;

  const saveLead = (lead: any) => {
    const existing = JSON.parse(localStorage.getItem('lino_leads') || '[]');
    localStorage.setItem('lino_leads', JSON.stringify([...existing, { ...lead, id: Date.now().toString(), timestamp: new Date().toISOString(), type: 'HIRE_ME' }]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      // Fix: Use direct named parameter for API key and ensure it comes directly from process.env.API_KEY
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Lead Controller for ${config.siteName}. Inquiry: ${formData.name}, Budget: ${formData.budget}. Message: ${formData.message}. Generate a formal record and an 8-char ref code starting with ${config.couponPrefix}. Return JSON {success, emailFormatted, referenceCode}.`;

      // Fix: Use ai.models.generateContent directly as per guidelines
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

      // Fix: Extract text output using the .text property (not a method)
      const data = JSON.parse(response.text || '{}');
      if (data.success) {
        saveLead({ ...formData, emailFormatted: data.emailFormatted, referenceCode: data.referenceCode });
        setResultData({ referenceCode: data.referenceCode });
        setStatus('success');
      } else throw new Error("Processing failed");
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const handleWhatsAppRedirect = () => {
    if (!resultData) return;
    const msg = `Hello! Ref: ${resultData.referenceCode}. Interested in ${formData.budget} plan. Msg: ${formData.message}`;
    const cleanPhone = config.contactPhone.replace(/\s/g, '').replace('+', '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-y-auto bg-indigo-900/20 backdrop-blur-sm animate-fadeIn">
      <div className="clay-card w-full max-w-lg p-8 md:p-12 relative animate-scaleIn">
        <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 clay-button flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        {status !== 'success' ? (
          <>
            <div className="text-center mb-8"><h2 className="text-3xl font-black mb-2">Hire <span className="text-indigo-600">The Studio</span></h2><p className="text-gray-500 text-sm">Submit details for verification and instant access.</p></div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2"><label className="text-sm font-bold text-gray-700 ml-2">Full Name</label><input required type="text" className="w-full clay-card-inset px-6 py-4 outline-none border-none bg-transparent" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
              <div className="space-y-2"><label className="text-sm font-bold text-gray-700 ml-2">Email</label><input required type="email" className="w-full clay-card-inset px-6 py-4 outline-none border-none bg-transparent" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
              <div className="space-y-2"><label className="text-sm font-bold text-gray-700 ml-2">Budget</label><select className="w-full clay-card-inset px-6 py-4 outline-none border-none bg-transparent appearance-none" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})}><option>Starter</option><option>Professional</option><option>Premium</option></select></div>
              <div className="space-y-2"><label className="text-sm font-bold text-gray-700 ml-2">Vital Info</label><textarea required rows={4} className="w-full clay-card-inset px-6 py-4 outline-none border-none bg-transparent resize-none" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea></div>
              <button type="submit" disabled={status === 'submitting'} className="clay-button-primary w-full py-5 font-black text-lg flex items-center justify-center gap-3 transform hover:scale-[1.02] transition-all">{status === 'submitting' ? "Processing..." : "Submit & Start"}</button>
            </form>
          </>
        ) : (
          <div className="text-center py-10 animate-scaleIn">
            <div className="w-24 h-24 clay-card-inset mx-auto flex items-center justify-center text-5xl mb-8 text-green-500">✓</div>
            <h2 className="text-3xl font-black mb-4">Lead Authenticated</h2>
            <p className="text-gray-600 mb-8">Ref: <span className="text-indigo-600 font-black">{resultData?.referenceCode}</span>. Present this on WhatsApp.</p>
            <button onClick={handleWhatsAppRedirect} className="clay-button-primary w-full py-5 font-black text-lg flex items-center justify-center gap-3">Continue to WhatsApp</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HireMeModal;
