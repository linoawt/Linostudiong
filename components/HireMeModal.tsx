
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { SiteConfig } from '../types';
import { supabase } from '../supabase';

interface HireMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SiteConfig;
}

const HireMeModal: React.FC<HireMeModalProps> = ({ isOpen, onClose, config }) => {
  const [formData, setFormData] = useState({ name: '', email: '', budget: 'Professional', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [resultData, setResultData] = useState<{ referenceCode: string; emailFormatted: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        You are an automated lead assistant for ${config.siteName}. 
        Process this inquiry:
        Name: ${formData.name}
        Email: ${formData.email}
        Budget Tier: ${formData.budget}
        Message: ${formData.message}
        
        Generate:
        1. A unique 8-character reference code starting with "${config.couponPrefix}".
        2. A professional 2-sentence summary of the request.
        
        Return JSON format.
      `;

      // Optimized for quality and speed with gemini-3-flash-preview
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
      
      if (data.referenceCode) {
        const { error: dbError } = await supabase
          .from('leads')
          .insert([{ 
            name: formData.name, 
            email: formData.email, 
            type: 'HIRE_ME', 
            budget: formData.budget, 
            message: formData.message, 
            reference_code: data.referenceCode, 
            email_formatted: data.emailFormatted 
          }]);

        if (dbError) throw dbError;

        try {
          await fetch('/api/hire/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              budget: formData.budget,
              message: formData.message,
              referenceCode: data.referenceCode,
              summary: data.emailFormatted
            })
          });
        } catch (mailErr) {
          console.warn("Mail notification system offline:", mailErr);
        }

        setResultData({ referenceCode: data.referenceCode, emailFormatted: data.emailFormatted });
        setStatus('success');
      } else {
        throw new Error("Invalid AI Response");
      }
    } catch (error) {
      console.error("Lead Sync Failure:", error);
      setStatus('error');
    }
  };

  const handleWhatsAppRedirect = () => {
    if (!resultData) return;
    const msg = `Hello Lino Studio! Ref: ${resultData.referenceCode}. Interested in: ${formData.budget}. Summary: ${resultData.emailFormatted}`;
    const cleanPhone = config.contactPhone.replace(/\D/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-y-auto bg-indigo-900/30 backdrop-blur-md animate-fadeIn">
      <div className="clay-card w-full max-w-lg p-10 relative animate-scaleIn bg-[#F0F4F8] text-gray-900">
        <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 clay-button flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {status !== 'success' ? (
          <>
            <div className="text-center mb-10">
              <div className="w-16 h-16 clay-card-inset mx-auto flex items-center justify-center text-3xl mb-4 bg-white/50">⚡</div>
              <h2 className="text-3xl font-black mb-2 tracking-tight">Hire <span className="text-indigo-600">Studio</span></h2>
              <p className="text-gray-500 text-sm font-medium">Synced with Gemini-3 & Supabase</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Client Identity</label>
                <input required type="text" placeholder="Full Name" className="w-full clay-card-inset px-6 py-4 outline-none border-none bg-white/50 font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <input required type="email" placeholder="Email Address" className="w-full clay-card-inset px-6 py-4 outline-none border-none bg-white/50 font-bold" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              
              <div className="grid grid-cols-2 gap-4">
                <select className="w-full clay-card-inset px-6 py-4 outline-none border-none bg-white/50 font-black text-indigo-600" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})}>
                  <option>Starter</option>
                  <option>Professional</option>
                  <option>Premium</option>
                </select>
                <div className="flex items-center justify-center text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                  Auto-Summarizing...
                </div>
              </div>
              
              <textarea required rows={3} placeholder="Tell us about your project..." className="w-full clay-card-inset px-6 py-4 outline-none border-none bg-white/50 font-medium text-sm" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
              
              <button disabled={status === 'submitting'} className="clay-button-primary w-full py-5 font-black text-lg flex items-center justify-center gap-3 active:scale-95 transition-transform">
                {status === 'submitting' ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Initiate Studio Slot'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6 animate-scaleIn">
            <div className="w-24 h-24 clay-card-inset mx-auto flex items-center justify-center text-5xl mb-8 text-green-500 bg-white/50">✨</div>
            <h2 className="text-3xl font-black mb-4 tracking-tighter">Inquiry <span className="text-indigo-600">Live</span></h2>
            <div className="clay-card-inset p-6 bg-white/40 mb-8 border-2 border-green-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Reference Token</p>
              <p className="text-4xl font-black text-indigo-600 tracking-tighter">{resultData?.referenceCode}</p>
            </div>
            <button onClick={handleWhatsAppRedirect} className="clay-button-primary w-full py-5 font-black text-lg flex items-center justify-center gap-3">
              Proceed to WhatsApp
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HireMeModal;
