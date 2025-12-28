
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
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'stats' | 'site' | 'portfolio' | 'services' | 'leads'>('stats');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [localConfig, setLocalConfig] = useState<SiteConfig>(config);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  // Initialize session and listen for changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isOpen && session) {
      setLocalConfig(config);
      fetchLeads();
    }
  }, [isOpen, session, config]);

  const fetchLeads = async () => {
    try {
      setDbError(null);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (err: any) {
      const msg = err.message || JSON.stringify(err);
      console.error("Failed to fetch leads from Supabase:", msg);
      setDbError(`Inquiry Fetch Error: ${msg}`);
      setLeads([]);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    setDbError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (err: any) {
      setDbError(err.message || "Authentication Failed");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
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
    } catch (err: any) {
      const msg = err.message || JSON.stringify(err);
      console.error("Save error:", msg);
      alert(`Failed to sync with Supabase: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  if (!session) {
    return (
      <div className="fixed inset-0 z-[150] flex items-center justify-center bg-indigo-950/60 backdrop-blur-xl p-4">
        <div className="clay-card w-full max-w-md p-12 text-center animate-scaleIn">
          <div className="w-24 h-24 clay-card-inset mx-auto flex items-center justify-center mb-8 text-5xl shadow-inner bg-white/10">🔐</div>
          <h2 className="text-3xl font-black mb-8 tracking-tight">Studio Access</h2>
          
          {dbError && (
            <div className="mb-6 p-4 clay-card-inset bg-red-50 text-red-600 text-xs font-bold rounded-2xl animate-fadeIn">
              {dbError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block text-left ml-6">Admin Email</label>
               <input 
                type="email" 
                placeholder="admin@linostudio.ng" 
                required
                className="w-full clay-card-inset px-8 py-5 outline-none font-bold text-indigo-600 bg-white/40" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block text-left ml-6">Access Key</label>
               <input 
                type="password" 
                placeholder="••••••••" 
                required
                className="w-full clay-card-inset px-8 py-5 outline-none font-bold text-indigo-600 bg-white/40" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
            </div>
            <button 
              disabled={isAuthLoading}
              className={`clay-button-primary w-full py-5 font-black text-lg shadow-xl transform active:scale-95 transition-all flex items-center justify-center gap-3 ${isAuthLoading ? 'opacity-50' : ''}`}
            >
              {isAuthLoading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              {isAuthLoading ? 'Verifying...' : 'Unlock Dashboard'}
            </button>
            <button onClick={onClose} type="button" className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-6 hover:text-indigo-600 transition-colors">Return to Portfolio</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-6 bg-indigo-950/30 backdrop-blur-md animate-fadeIn">
      <div className="clay-card w-full max-w-7xl h-[85vh] flex flex-col overflow-hidden animate-scaleIn bg-[#F0F4F8]">
        {/* Admin Header */}
        <div className="px-10 py-8 border-b border-indigo-100/20 flex items-center justify-between">
          <div className="flex items-center gap-6">
             <div className="w-14 h-14 clay-card-inset flex items-center justify-center text-white bg-indigo-600 font-black text-2xl shadow-lg rounded-2xl">L</div>
             <div>
               <h2 className="text-2xl font-black text-gray-900 leading-none tracking-tight">Studio Command</h2>
               <div className="flex items-center gap-2 mt-2">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Logged in as {session.user.email}</p>
               </div>
             </div>
          </div>
          <div className="flex gap-6">
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className={`clay-button-primary px-10 py-4 font-black transition-all flex items-center gap-2 ${isSaving ? 'opacity-50' : 'hover:scale-105 active:scale-95 shadow-lg shadow-indigo-200'}`}
            >
              {isSaving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              {isSaving ? 'Synchronizing...' : 'Apply Cloud Changes'}
            </button>
            <button 
              onClick={handleLogout}
              className="clay-button px-6 py-4 text-[10px] font-black uppercase text-indigo-600 hover:text-red-500 transition-colors"
            >
              Log Out
            </button>
            <button onClick={onClose} className="clay-button p-4 text-gray-400 hover:text-indigo-600 active:scale-90 transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div className="flex flex-grow overflow-hidden">
          {/* Admin Sidebar */}
          <div className="w-72 p-8 space-y-3 border-r border-indigo-50/10">
            {[
              { id: 'stats', label: 'Overview', icon: '📊' },
              { id: 'site', label: 'Settings', icon: '⚙️' },
              { id: 'portfolio', label: 'Portfolio', icon: '🎨' },
              { id: 'services', label: 'Services', icon: '🛠️' },
              { id: 'leads', label: 'Inquiries', icon: '📩' }
            ].map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id as any)} 
                className={`w-full text-left px-6 py-5 rounded-2xl font-black text-sm flex items-center gap-4 transition-all ${activeTab === tab.id ? 'clay-button-primary shadow-lg shadow-indigo-100' : 'clay-button text-gray-500 opacity-70 hover:opacity-100'}`}
              >
                <span className="text-xl">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
            
            <div className="mt-12 pt-8 border-t border-indigo-100/20">
               <div className="clay-card-inset p-6 space-y-6">
                 <div className="flex flex-col gap-4">
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Appearance</span>
                   <div className="flex items-center justify-between">
                     <span className="text-xs font-bold text-gray-600">
                        {localConfig.theme === 'dark' ? 'Night Mode' : 'Day Mode'}
                     </span>
                     <button 
                        onClick={() => setLocalConfig({...localConfig, theme: localConfig.theme === 'light' ? 'dark' : 'light'})} 
                        className={`w-16 h-9 rounded-full relative transition-all shadow-inner clay-card-inset p-1 ${localConfig.theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-100'}`}
                     >
                        <div className={`absolute top-1 w-7 h-7 rounded-full transition-all duration-300 flex items-center justify-center clay-card ${localConfig.theme === 'dark' ? 'left-8 bg-indigo-900 text-indigo-300' : 'left-1 bg-white text-yellow-500'}`}>
                           {localConfig.theme === 'dark' ? (
                             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                           ) : (
                             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
                           )}
                        </div>
                     </button>
                   </div>
                 </div>
                 <div className="pt-4 border-t border-indigo-50/10 flex items-center justify-between text-[9px] font-black text-gray-400 uppercase tracking-widest">
                   <span>Supabase</span>
                   <span className="text-green-500">Authenticated</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Admin Content Area */}
          <div className="flex-grow p-12 overflow-y-auto custom-scrollbar">
            {dbError && (
              <div className="mb-8 p-6 clay-card border-2 border-red-100 bg-red-50/30 text-red-600 flex items-center gap-4">
                <span className="text-2xl">⚠️</span>
                <div className="text-xs font-black uppercase tracking-tight">{dbError}</div>
              </div>
            )}
            
            {activeTab === 'stats' && (
              <div className="space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="clay-card p-10 text-center flex flex-col items-center">
                    <div className="w-16 h-16 clay-card-inset flex items-center justify-center text-3xl mb-6 bg-white/50 shadow-inner">📩</div>
                    <p className="text-6xl font-black text-indigo-600 mb-2 tracking-tighter">{leads.length}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Leads</p>
                  </div>
                  <div className="clay-card p-10 text-center flex flex-col items-center">
                    <div className="w-16 h-16 clay-card-inset flex items-center justify-center text-3xl mb-6 bg-white/50 shadow-inner">🚀</div>
                    <p className="text-6xl font-black text-indigo-600 mb-2 tracking-tighter">{localConfig.projects?.length || 0}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Cases</p>
                  </div>
                  <div className="clay-card p-10 text-center flex flex-col items-center">
                    <div className="w-16 h-16 clay-card-inset flex items-center justify-center text-3xl mb-6 bg-white/50 shadow-inner">☁️</div>
                    <p className="text-4xl font-black text-indigo-600 mb-2">Cloud Auth</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verified Session</p>
                  </div>
                </div>
                
                <div className="clay-card p-12 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-2xl shadow-indigo-300 relative overflow-hidden group">
                   <div className="relative z-10">
                     <h3 className="text-3xl font-black mb-3">Welcome, Admin</h3>
                     <p className="text-indigo-100 text-lg max-w-xl font-medium">Your studio session is now verified through Supabase Auth. All administrative actions are recorded and secured.</p>
                   </div>
                   <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
                </div>
              </div>
            )}

            {activeTab === 'site' && (
              <div className="space-y-10 max-w-4xl">
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-6">Studio Brand</label>
                    <input className="w-full clay-card-inset px-8 py-5 outline-none font-black text-lg bg-white/50" value={localConfig.siteName} onChange={e => setLocalConfig({...localConfig, siteName: e.target.value})} />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-6">Primary Tagline</label>
                    <input className="w-full clay-card-inset px-8 py-5 outline-none font-bold text-gray-600 bg-white/50" value={localConfig.tagline} onChange={e => setLocalConfig({...localConfig, tagline: e.target.value})} />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-6">Contact Email</label>
                    <input className="w-full clay-card-inset px-8 py-5 outline-none font-bold bg-white/50" value={localConfig.contactEmail} onChange={e => setLocalConfig({...localConfig, contactEmail: e.target.value})} />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-6">Contact Phone</label>
                    <input className="w-full clay-card-inset px-8 py-5 outline-none font-bold bg-white/50" value={localConfig.contactPhone} onChange={e => setLocalConfig({...localConfig, contactPhone: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-6">Office Location</label>
                  <input className="w-full clay-card-inset px-8 py-5 outline-none font-bold bg-white/50" value={localConfig.location} onChange={e => setLocalConfig({...localConfig, location: e.target.value})} />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-6">Hero Main Heading</label>
                  <input className="w-full clay-card-inset px-8 py-6 outline-none font-black text-2xl text-indigo-600 bg-white/50" value={localConfig.heroHeadline} onChange={e => setLocalConfig({...localConfig, heroHeadline: e.target.value})} />
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-6">Hero Narrative</label>
                  <textarea rows={5} className="w-full clay-card-inset px-8 py-6 outline-none font-medium text-gray-600 resize-none leading-relaxed bg-white/50" value={localConfig.heroSubtext} onChange={e => setLocalConfig({...localConfig, heroSubtext: e.target.value})} />
                </div>
                
                <div className="grid grid-cols-2 gap-10">
                   <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-6">Ref Identity Prefix</label>
                    <input className="w-full clay-card-inset px-8 py-5 outline-none font-black text-indigo-600 uppercase tracking-widest bg-white/50" value={localConfig.couponPrefix} onChange={e => setLocalConfig({...localConfig, couponPrefix: e.target.value.toUpperCase()})} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center px-2">
                   <div>
                     <h3 className="text-3xl font-black tracking-tight">Cloud Assets</h3>
                     <p className="text-gray-400 text-sm font-medium">Manage your portfolio items directly on the edge.</p>
                   </div>
                   <button className="clay-button-primary px-8 py-3 font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-md shadow-indigo-100">+ New Entry</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {localConfig.projects?.map((proj) => (
                    <div key={proj.id} className="clay-card p-8 group relative overflow-hidden flex items-center gap-6 border-2 border-transparent hover:border-indigo-100 transition-all cursor-default">
                      <div className="w-24 h-24 clay-card-inset overflow-hidden shrink-0 shadow-inner rounded-3xl">
                        <img src={proj.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                      </div>
                      <div className="flex-grow">
                         <div className="flex items-center gap-2 mb-1">
                           <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 uppercase tracking-widest">{proj.category}</span>
                         </div>
                         <h4 className="font-black text-xl text-gray-900 leading-tight mb-2">{proj.title}</h4>
                         <div className="flex gap-4">
                           <button className="text-[10px] font-black text-indigo-600 uppercase hover:underline">Edit Meta</button>
                           <button className="text-[10px] font-black text-red-400 uppercase hover:underline">Delete</button>
                         </div>
                      </div>
                    </div>
                  ))}
                  {(!localConfig.projects || localConfig.projects.length === 0) && (
                    <div className="col-span-full py-24 text-center clay-card-inset bg-indigo-50/10">
                      <div className="text-5xl mb-4 opacity-20">🎨</div>
                      <p className="font-black text-gray-300 uppercase tracking-widest italic">Asset list is empty in Cloud Instance</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="space-y-8">
                <div className="px-2">
                  <h3 className="text-3xl font-black tracking-tight">Services Control</h3>
                  <p className="text-gray-400 text-sm font-medium">Manage your dynamic service offerings.</p>
                </div>
                <div className="clay-card p-12 text-center bg-white/20">
                   <p className="text-gray-400 font-bold italic">Services management is currently synchronized with Supabase schema. Direct CRUD via Dashboard is coming in next release.</p>
                </div>
              </div>
            )}

            {activeTab === 'leads' && (
              <div className="space-y-8">
                <div className="px-2">
                  <h3 className="text-3xl font-black tracking-tight">Studio Inbox</h3>
                  <p className="text-gray-400 text-sm font-medium">Real-time inquiries from potential clients.</p>
                </div>
                
                <div className="space-y-10">
                  {leads.map(lead => (
                    <div key={lead.id} className="clay-card p-10 hover:shadow-2xl transition-all border border-transparent hover:border-indigo-50">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                        <div className="flex items-center gap-8">
                          <div className="w-16 h-16 clay-card-inset flex items-center justify-center font-black text-2xl text-indigo-600 bg-white shadow-inner">
                            {lead.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-black text-2xl text-gray-900 leading-none mb-1">{lead.name}</h4>
                            <p className="text-sm text-indigo-600 font-bold opacity-80">{lead.email}</p>
                          </div>
                        </div>
                        <div className="text-left md:text-right">
                          <div className="clay-card-inset px-4 py-2 mb-2 inline-block bg-white/60">
                             <p className="text-lg font-black text-indigo-600 tracking-tighter leading-none">{lead.reference_code || lead.referenceCode || 'DEMO-REF'}</p>
                          </div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Recv: {new Date(lead.created_at || lead.timestamp || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="clay-card-inset p-8 bg-white/60 mb-8 shadow-inner">
                         <p className="text-gray-700 leading-relaxed font-medium italic">"{lead.message}"</p>
                      </div>
                      
                      <div className="flex flex-wrap items-center justify-between gap-6">
                         <div className="flex gap-3">
                           <span className={`text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-sm ${lead.type === 'HIRE_ME' ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-gray-200 text-gray-600'}`}>
                             {lead.type?.replace('_', ' ') || 'GENERAL'}
                           </span>
                           {lead.budget && (
                             <span className="text-[10px] font-black px-4 py-2 rounded-full bg-white text-indigo-600 uppercase tracking-widest shadow-sm border border-indigo-50">
                               Tier: {lead.budget}
                             </span>
                           )}
                         </div>
                         <div className="flex gap-4">
                            <button className="clay-button px-6 py-2 text-[10px] font-black text-red-400 uppercase hover:text-red-600 transition-colors">Archive</button>
                            <button className="clay-button-primary px-8 py-2 text-[10px] font-black uppercase hover:scale-105 active:scale-95 transition-all">Reply via Email</button>
                         </div>
                      </div>
                    </div>
                  ))}
                  
                  {leads.length === 0 && (
                    <div className="text-center py-40 clay-card-inset bg-indigo-50/10">
                      <div className="text-7xl mb-6 opacity-10">📬</div>
                      <p className="font-black text-gray-300 uppercase tracking-widest text-xl">Cloud Inbox Empty</p>
                      <p className="text-gray-400 mt-2 font-medium">Connect with clients to see inquiries here.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
