
import React, { useState, useEffect } from 'react';
import { SiteConfig, Lead, Project, Service } from '../types';
import { supabase } from '../supabase';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  config: SiteConfig;
  onUpdateConfig: (config: SiteConfig) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose, config, onUpdateConfig }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'stats' | 'site' | 'portfolio' | 'services' | 'leads'>('stats');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [localConfig, setLocalConfig] = useState<SiteConfig>(config);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLocalConfig(config);
      if (isAuthenticated) fetchLeads();
    }
  }, [isOpen, isAuthenticated, config]);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error("Failed to fetch leads from Supabase", err);
    }
  };

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple authentication logic for the demo environment
    if (password === 'LinoAdmin2025') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid Access Key');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('settings')
        .update({
          site_name: localConfig.siteName,
          tagline: localConfig.tagline,
          hero_headline: localConfig.heroHeadline,
          hero_subtext: localConfig.heroSubtext,
          theme: localConfig.theme,
          seo: localConfig.seo,
          contact_email: localConfig.contactEmail,
          contact_phone: localConfig.contactPhone,
          location: localConfig.location,
          coupon_prefix: localConfig.couponPrefix,
          skills: localConfig.skills,
          faqs: localConfig.faqs,
          plans: localConfig.plans
        })
        .eq('id', 1);
      
      if (error) throw error;

      onUpdateConfig(localConfig);
      alert('Supabase Settings Synchronized');
    } catch (err) {
      console.error("Save error:", err);
      alert('Failed to sync with Supabase. Check console for details.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[150] flex items-center justify-center bg-[#1a1a2e]/95 backdrop-blur-xl p-4">
        <div className="clay-card w-full max-w-md p-10 text-center animate-scaleIn">
          <div className="w-20 h-20 clay-card-inset mx-auto flex items-center justify-center mb-6 text-4xl shadow-inner bg-indigo-50/50">🔐</div>
          <h2 className="text-2xl font-black mb-6">Studio Authentication</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Admin Key" 
              autoFocus
              className="w-full clay-card-inset px-6 py-4 outline-none text-center tracking-widest font-black bg-white/40" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
            <button className="clay-button-primary w-full py-4 font-black shadow-lg">Open Dashboard</button>
            <button onClick={onClose} type="button" className="text-gray-400 text-xs font-bold uppercase tracking-wider mt-4">Return to Public Site</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-indigo-950/40 backdrop-blur-md animate-fadeIn">
      <div className="clay-card w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden animate-scaleIn bg-[#F0F4F8]">
        {/* Admin Header */}
        <div className="p-8 border-b border-indigo-100 flex items-center justify-between bg-white/20">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">L</div>
             <div>
               <h2 className="text-2xl font-black text-gray-900 leading-none">Studio Control</h2>
               <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">Status: Supabase Connected</p>
             </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className={`clay-button-primary px-8 py-3 font-black transition-all ${isSaving ? 'opacity-50' : 'hover:scale-105'}`}
            >
              {isSaving ? 'Syncing...' : 'Save Changes'}
            </button>
            <button onClick={onClose} className="clay-button p-3 text-red-500 hover:bg-red-50">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div className="flex flex-grow overflow-hidden">
          {/* Admin Sidebar */}
          <div className="w-64 p-6 space-y-2 border-r border-indigo-50 bg-white/10">
            {[
              { id: 'stats', label: 'Overview', icon: '📊' },
              { id: 'site', label: 'Settings', icon: '⚙️' },
              { id: 'portfolio', label: 'Portfolio', icon: '🎨' },
              { id: 'leads', label: 'Inquiries', icon: '📩' }
            ].map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id as any)} 
                className={`w-full text-left px-5 py-4 rounded-2xl font-bold text-sm flex items-center gap-3 transition-all ${activeTab === tab.id ? 'clay-button-primary text-white' : 'hover:bg-white/60 text-gray-500'}`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
            
            <div className="mt-10 pt-6 border-t border-indigo-100">
               <div className="flex items-center justify-between px-2">
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dark Mode</span>
                 <button 
                    onClick={() => setLocalConfig({...localConfig, theme: localConfig.theme === 'light' ? 'dark' : 'light'})} 
                    className={`w-12 h-6 rounded-full relative transition-all shadow-inner ${localConfig.theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-200'}`}
                 >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-md ${localConfig.theme === 'dark' ? 'left-7' : 'left-1'}`}></div>
                 </button>
               </div>
            </div>
          </div>

          {/* Admin Content Area */}
          <div className="flex-grow p-10 overflow-y-auto custom-scrollbar bg-white/5 text-gray-900">
            {activeTab === 'stats' && (
              <div className="space-y-10">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="clay-card-inset p-8 text-center bg-white/40">
                    <p className="text-5xl font-black text-indigo-600 mb-2">{leads.length}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Leads</p>
                  </div>
                  <div className="clay-card-inset p-8 text-center bg-white/40">
                    <p className="text-5xl font-black text-indigo-600 mb-2">{localConfig.projects.length}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Projects</p>
                  </div>
                  <div className="clay-card-inset p-8 text-center bg-white/40">
                    <p className="text-5xl font-black text-indigo-600 mb-2">Supabase</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Backend Provider</p>
                  </div>
                </div>
                <div className="clay-card p-10 bg-indigo-600 text-white shadow-xl shadow-indigo-200">
                   <h3 className="text-2xl font-black mb-2">Welcome Back, Admin</h3>
                   <p className="opacity-80">Connected to live cloud instance. You have {leads.length} total inquiries synced.</p>
                </div>
              </div>
            )}

            {activeTab === 'site' && (
              <div className="space-y-8 max-w-3xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Studio Brand Name</label>
                    <input className="w-full clay-card-inset px-6 py-4 outline-none font-bold bg-white/40" value={localConfig.siteName} onChange={e => setLocalConfig({...localConfig, siteName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Tagline</label>
                    <input className="w-full clay-card-inset px-6 py-4 outline-none font-bold bg-white/40" value={localConfig.tagline} onChange={e => setLocalConfig({...localConfig, tagline: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Hero Headline</label>
                  <input className="w-full clay-card-inset px-6 py-4 outline-none font-black text-xl bg-white/40" value={localConfig.heroHeadline} onChange={e => setLocalConfig({...localConfig, heroHeadline: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Hero Description</label>
                  <textarea rows={4} className="w-full clay-card-inset px-6 py-4 outline-none font-medium bg-white/40 resize-none" value={localConfig.heroSubtext} onChange={e => setLocalConfig({...localConfig, heroSubtext: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Contact Email</label>
                    <input className="w-full clay-card-inset px-6 py-4 outline-none font-bold bg-white/40" value={localConfig.contactEmail} onChange={e => setLocalConfig({...localConfig, contactEmail: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Ref Prefix</label>
                    <input className="w-full clay-card-inset px-6 py-4 outline-none font-bold bg-white/40 text-indigo-600 uppercase" value={localConfig.couponPrefix} onChange={e => setLocalConfig({...localConfig, couponPrefix: e.target.value.toUpperCase()})} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <h3 className="text-2xl font-black">Project Management</h3>
                   <button className="clay-button px-6 py-2 font-black text-indigo-600 text-xs hover:bg-indigo-50">+ Add to Supabase</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {localConfig.projects.map((proj) => (
                    <div key={proj.id} className="clay-card-inset p-6 bg-white/40 group relative overflow-hidden">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden shrink-0 shadow-inner">
                          <img src={proj.thumbnail} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-grow">
                           <p className="font-bold text-lg">{proj.title}</p>
                           <p className="text-xs font-bold text-indigo-400 uppercase">{proj.category}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button className="text-[10px] font-black text-gray-400 uppercase hover:text-indigo-600">Edit</button>
                        <span className="text-gray-300">|</span>
                        <button className="text-[10px] font-black text-red-400 uppercase hover:text-red-600">Remove</button>
                      </div>
                    </div>
                  ))}
                  {localConfig.projects.length === 0 && <div className="col-span-2 py-20 text-center opacity-30 font-black italic">No Projects in Cloud DB</div>}
                </div>
              </div>
            )}

            {activeTab === 'leads' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-black mb-6">Cloud Inquiries</h3>
                {leads.map(lead => (
                  <div key={lead.id} className="clay-card p-6 bg-white/50 border border-white/40 hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 clay-card-inset flex items-center justify-center font-black text-indigo-600 bg-white">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 leading-none">{lead.name}</p>
                          <p className="text-xs text-indigo-600 font-medium">{lead.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-indigo-600 tracking-tighter">{lead.reference_code || lead.referenceCode || 'NO-REF'}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">{new Date(lead.created_at || lead.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="p-4 clay-card-inset bg-white/40 rounded-xl">
                       <p className="text-sm text-gray-700 leading-relaxed italic">"{lead.message}"</p>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                       <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${lead.type === 'HIRE_ME' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                         {lead.type.replace('_', ' ')}
                       </span>
                       <button className="text-[10px] font-black text-indigo-600 uppercase hover:underline">Contact Client</button>
                    </div>
                  </div>
                ))}
                {leads.length === 0 && (
                  <div className="text-center py-32">
                    <div className="text-6xl mb-4">📭</div>
                    <p className="font-black text-gray-300 uppercase tracking-widest">Cloud Inbox Empty</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
