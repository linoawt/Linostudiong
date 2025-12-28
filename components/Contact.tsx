
import React, { useState } from 'react';
import { SiteConfig } from '../types.ts';
import { supabase } from '../supabase.ts';

interface ContactProps {
  config: SiteConfig;
}

const Contact: React.FC<ContactProps> = ({ config }) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [referenceCode, setReferenceCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    const generatedCode = `WEB-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    setReferenceCode(generatedCode);

    try {
      const { error } = await supabase
        .from('leads')
        .insert([{ 
          name: formData.name, 
          email: formData.email, 
          type: 'CONTACT_FORM', 
          message: formData.message, 
          reference_code: generatedCode,
          budget: 'Contact Form' 
        }]);

      if (error) throw error;

      try {
        await fetch('/api/hire/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            budget: 'General Inquiry',
            message: formData.message,
            referenceCode: generatedCode,
            summary: `A general contact form submission from ${formData.name}.`
          })
        });
      } catch (notifyErr) {
        console.warn("Notification engine skipped:", notifyErr);
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
      
      setTimeout(() => {
        handleWhatsAppRedirect(generatedCode);
      }, 2500);
      
    } catch (err: any) {
      console.error("Submission error:", err);
      setStatus('error');
    }
  };

  const handleWhatsAppRedirect = (code: string) => {
    const msg = `Hello Lino Studio! Ref: ${code}. I sent an inquiry via your site. Message: ${formData.message || 'Following up on my form.'}`;
    const cleanPhone = config.contactPhone.replace(/\D/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="clay-card p-10 md:p-20 overflow-hidden relative">
          <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10">
            <div>
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Let’s Build Something <span className="text-indigo-600">Great</span></h2>
              <p className="text-lg text-gray-600 mb-12 max-w-md">Ready to bring your idea to life? Our studio is currently accepting new projects.</p>
              <div className="space-y-8">
                <div className="flex items-center gap-6"><div className="w-14 h-14 clay-card-inset flex items-center justify-center text-2xl">📍</div><div><h4 className="font-bold text-gray-900">Location</h4><p className="text-gray-600">{config.location}</p></div></div>
                <div className="flex items-center gap-6"><div className="w-14 h-14 clay-card-inset flex items-center justify-center text-2xl">📧</div><div><h4 className="font-bold text-gray-900">Email</h4><p className="text-gray-600 underline">{config.contactEmail}</p></div></div>
                <div className="flex items-center gap-6"><div className="w-14 h-14 clay-card-inset flex items-center justify-center text-2xl">📞</div><div><h4 className="font-bold text-gray-900">Phone</h4><p className="text-gray-600">{config.contactPhone}</p></div></div>
              </div>
            </div>
            <div className="clay-card-inset p-8 md:p-12">
              {status === 'success' ? (
                <div className="h-full flex flex-col items-center justify-center text-center animate-fadeIn">
                  <div className="w-24 h-24 clay-card flex items-center justify-center text-5xl mb-6 text-green-500 bg-white/50">✨</div>
                  <h3 className="text-2xl font-black mb-2">Message Synced!</h3>
                  <div className="clay-card-inset p-4 bg-white/40 mb-6 w-full">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Ref Token</p>
                    <p className="text-2xl font-black text-indigo-600 tracking-tight">{referenceCode}</p>
                  </div>
                  <p className="text-gray-500 mb-8 text-sm">Redirecting to WhatsApp...</p>
                  <button 
                    onClick={() => handleWhatsAppRedirect(referenceCode)}
                    className="clay-button-primary w-full py-4 font-black flex items-center justify-center gap-2"
                  >
                    Finish on WhatsApp
                  </button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-2">Name</label>
                      <input required type="text" className="w-full clay-card px-6 py-4 outline-none border-none bg-white/50 focus:bg-white transition-colors" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} disabled={status === 'submitting'} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-2">Email</label>
                      <input required type="email" className="w-full clay-card px-6 py-4 outline-none border-none bg-white/50 focus:bg-white transition-colors" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} disabled={status === 'submitting'} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-2">Message</label>
                    <textarea required rows={5} className="w-full clay-card px-6 py-4 outline-none resize-none border-none bg-white/50 focus:bg-white transition-colors" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} disabled={status === 'submitting'}></textarea>
                  </div>
                  
                  {status === 'error' && (
                    <div className="p-4 clay-card-inset bg-red-50 text-red-500 text-xs font-bold rounded-2xl text-center">
                      Error syncing to cloud. Please try again.
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={status === 'submitting'}
                    className={`clay-button-primary w-full py-5 font-black text-lg transform transition-all flex items-center justify-center gap-3 ${status === 'submitting' ? 'opacity-70 scale-95' : 'hover:scale-[1.02]'}`}
                  >
                    {status === 'submitting' ? "Syncing..." : "Send to Dashboard"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
