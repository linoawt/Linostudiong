
import React, { useState, useEffect } from 'react';
import { SiteConfig, Lead, Project, Service } from '../types';

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

  useEffect(() => {
    if (isOpen) {
      setLeads(JSON.parse(localStorage.getItem('lino_leads') || '[]').reverse());
      setLocalConfig(config);
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'LinoAdmin2025') setIsAuthenticated(true);
    else alert('Incorrect credentials');
  };

  const handleSave = () => {
    onUpdateConfig(localConfig);
    alert('Site Database Synchronized Successfully!');
  };

  const addItem = (type: 'projects' | 'services') => {
    if (type === 'projects') {
      const newProj: Project = { id: Date.now().toString(), title: 'New Project', category: 'Graphic Design', thumbnail: 'https://picsum.photos/600/400', description: 'Project Description' };
      setLocalConfig({...localConfig, projects: [...localConfig.projects, newProj]});
    } else {
      const newServ: Service = { id: Date.now().toString(), title: 'New Service', icon: '✨', description: 'Description', items: ['Feature 1'] };
      setLocalConfig({...localConfig, services: [...localConfig.services, newServ]});
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[150] flex items-center justify-center bg-[#1a1a2e]/90 backdrop-blur-xl p-4">
        <div className="clay-card w-full max-w-md p-10 text-center animate-scaleIn">
          <div className="w-20 h-20 clay-card-inset mx-auto flex items-center justify-center mb-6 text-4xl">🔐</div>
          <h2 className="text-2xl font-black mb-6">Studio Authentication</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" placeholder="Admin Key" className="w-full clay-card-inset px-6 py-4 outline-none text-center tracking-widest font-black" value={password} onChange={e => setPassword(e.target.value)} />
            <button className="clay-button-primary w-full py-4 font-black">Open Dashboard</button>
            <button onClick={onClose} type="button" className="text-gray-400 text-sm">Return to Site</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-indigo-950/40 backdrop-blur-md animate-fadeIn">
      <div className="clay-card w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden animate-scaleIn bg-[#F0F4F8]">
        {/* Header */}
        <div className="p-8 border-b border-indigo-100 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-gray-900">Lino <span className="text-indigo-600">Control Panel</span></h2>
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mt-1">Live Studio Database v2.5</p>
          </div>
          <div className="flex gap-4">
            <button onClick={handleSave} className="clay-button-primary px-8 py-3 font-black shadow-indigo-200">Sync Database</button>
            <button onClick={onClose} className="clay-button p-3 text-red-500"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
        </div>

        <div className="flex flex-grow overflow-hidden">
          {/* Nav */}
          <div className="w-64 p-6 space-y-2 border-r border-indigo-50">
            {['stats', 'site', 'portfolio', 'services', 'leads'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab as any)} className={`w-full text-left px-5 py-4 rounded-2xl font-black uppercase text-xs tracking-tighter transition-all ${activeTab === tab ? 'clay-button-primary text-white' : 'hover:bg-white/50 text-gray-500'}`}>
                {tab}
              </button>
            ))}
            <div className="mt-10 pt-6 border-t border-indigo-100">
               <div className="flex items-center justify-between px-2">
                 <span className="text-xs font-bold text-gray-400">Dark Mode</span>
                 <button onClick={() => setLocalConfig({...localConfig, theme: localConfig.theme === 'light' ? 'dark' : 'light'})} className={`w-12 h-6 rounded-full relative transition-all ${localConfig.theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${localConfig.theme === 'dark' ? 'left-7' : 'left-1'}`}></div>
                 </button>
               </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-grow p-10 overflow-y-auto custom-scrollbar">
            {activeTab === 'stats' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="clay-card-inset p-8 text-center"><p className="text-4xl font-black text-indigo-600 mb-2">{leads.length}</p><p className="text-xs font-bold text-gray-400 uppercase">Total Leads</p></div>
                <div className="clay-card-inset p-8 text-center"><p className="text-4xl font-black text-indigo-600 mb-2">{localConfig.projects.length}</p><p className="text-xs font-bold text-gray-400 uppercase">Projects Live</p></div>
                <div className="clay-card-inset p-8 text-center"><p className="text-4xl font-black text-indigo-600 mb-2">{localConfig.services.length}</p><p className="text-xs font-bold text-gray-400 uppercase">Services Offered</p></div>
              </div>
            )}

            {activeTab === 'site' && (
              <div className="space-y-8 max-w-3xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2"><label className="text-xs font-bold text-gray-400 ml-2">Studio Name</label><input className="w-full clay-card-inset px-5 py-4 outline-none border-none" value={localConfig.siteName} onChange={e => setLocalConfig({...localConfig, siteName: e.target.value})} /></div>
                  <div className="space-y-2"><label className="text-xs font-bold text-gray-400 ml-2">Tagline</label><input className="w-full clay-card-inset px-5 py-4 outline-none border-none" value={localConfig.tagline} onChange={e => setLocalConfig({...localConfig, tagline: e.target.value})} /></div>
                </div>
                <div className="space-y-2"><label className="text-xs font-bold text-gray-400 ml-2">Hero Headline</label><input className="w-full clay-card-inset px-5 py-4 outline-none border-none" value={localConfig.heroHeadline} onChange={e => setLocalConfig({...localConfig, heroHeadline: e.target.value})} /></div>
                <div className="space-y-2"><label className="text-xs font-bold text-gray-400 ml-2">Hero Subtext</label><textarea rows={3} className="w-full clay-card-inset px-5 py-4 outline-none border-none" value={localConfig.heroSubtext} onChange={e => setLocalConfig({...localConfig, heroSubtext: e.target.value})} /></div>
                <div className="p-6 clay-card-inset bg-indigo-50/50">
                  <h4 className="text-xs font-black text-indigo-400 uppercase mb-4">SEO Configuration</h4>
                  <div className="space-y-4">
                    <input placeholder="Meta Title" className="w-full bg-white/50 px-4 py-3 rounded-xl outline-none" value={localConfig.seo.metaTitle} onChange={e => setLocalConfig({...localConfig, seo: {...localConfig.seo, metaTitle: e.target.value}})} />
                    <textarea placeholder="Meta Description" className="w-full bg-white/50 px-4 py-3 rounded-xl outline-none" value={localConfig.seo.metaDescription} onChange={e => setLocalConfig({...localConfig, seo: {...localConfig.seo, metaDescription: e.target.value}})} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                <button onClick={() => addItem('projects')} className="clay-button px-6 py-2 text-xs font-bold text-indigo-600">+ Add New Project</button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {localConfig.projects.map((proj, idx) => (
                    <div key={proj.id} className="clay-card-inset p-6 bg-white/30 relative group">
                      <button onClick={() => setLocalConfig({...localConfig, projects: localConfig.projects.filter(p => p.id !== proj.id)})} className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100">Delete</button>
                      <input className="font-bold text-lg bg-transparent border-none outline-none w-full" value={proj.title} onChange={e => {
                        const next = [...localConfig.projects];
                        next[idx].title = e.target.value;
                        setLocalConfig({...localConfig, projects: next});
                      }} />
                      <select className="text-xs text-indigo-600 bg-transparent border-none outline-none block mt-2" value={proj.category} onChange={e => {
                        const next = [...localConfig.projects];
                        next[idx].category = e.target.value as any;
                        setLocalConfig({...localConfig, projects: next});
                      }}>
                        <option>Graphic Design</option>
                        <option>Web Development</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'leads' && (
              <div className="space-y-4">
                {leads.map(lead => (
                  <div key={lead.id} className="clay-card-inset p-6 bg-white/40">
                    <div className="flex justify-between items-start">
                      <div><p className="text-lg font-black">{lead.name}</p><p className="text-xs text-indigo-600">{lead.email}</p></div>
                      <p className="text-xl font-black text-indigo-600 tracking-tighter">{lead.referenceCode}</p>
                    </div>
                    <div className="mt-4 text-sm text-gray-700 italic border-l-4 border-indigo-200 pl-4">"{lead.message}"</div>
                    <p className="mt-2 text-[10px] text-gray-400 text-right">{new Date(lead.timestamp).toLocaleString()}</p>
                  </div>
                ))}
                {leads.length === 0 && <div className="text-center py-20 text-gray-400 font-bold">Inbox Empty</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
