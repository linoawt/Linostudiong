
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
  const [activeTab, setActiveTab] = useState<'stats' | 'site' | 'portfolio' | 'services' | 'leads' | 'doctor'>('stats');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [localConfig, setLocalConfig] = useState<SiteConfig>(config);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  const [newProject, setNewProject] = useState({ 
    title: '', 
    category: 'Web Development', 
    thumbnail: '', 
    description: '',
    project_url: '' 
  });
  const [newService, setNewService] = useState({ title: '', icon: '⚡', description: '', items: '' });
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isOpen && session) {
      setLocalConfig(config);
      fetchData();
    }
  }, [isOpen, session, config]);

  const fetchData = async () => {
    setDbError(null);
    try {
      const [leadsRes, projectsRes, servicesRes] = await Promise.all([
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('services').select('*').order('created_at', { ascending: true })
      ]);
      if (leadsRes.error) throw leadsRes.error;
      if (projectsRes.error) throw projectsRes.error;
      if (servicesRes.error) throw servicesRes.error;

      setLeads(leadsRes.data || []);
      setProjects(projectsRes.data || []);
      setServices(servicesRes.data || []);
    } catch (err: any) {
      setDbError(err.message);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from('projects').insert([newProject]).select();
      if (error) throw error;
      setProjects([data[0], ...projects]);
      setNewProject({ title: '', category: 'Web Development', thumbnail: '', description: '', project_url: '' });
      setPreviewError(false);
    } catch (err: any) { alert(err.message); }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Delete project?')) return;
    try {
      await supabase.from('projects').delete().eq('id', id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err: any) { alert(err.message); }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err: any) { setDbError(err.message); }
    finally { setIsAuthLoading(false); }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); setSession(null); };

  if (!isOpen) return null;

  if (!session) {
    return (
      <div className="fixed inset-0 z-[150] flex items-center justify-center bg-indigo-950/60 backdrop-blur-xl p-4">
        <div className="clay-card w-full max-w-md p-10 text-center bg-[#F0F4F8]">
          <h2 className="text-2xl font-black mb-8">Studio Access</h2>
          {dbError && <div className="mb-6 p-4 clay-card-inset bg-red-50 text-red-500 text-xs font-bold">{dbError}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" placeholder="Email" className="w-full clay-card-inset px-6 py-4 font-bold" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" className="w-full clay-card-inset px-6 py-4 font-bold" value={password} onChange={e => setPassword(e.target.value)} />
            <button className="clay-button-primary w-full py-4 font-black">Unlock</button>
            <button onClick={onClose} type="button" className="text-gray-400 text-xs font-bold mt-4">Close</button>
          </form>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'stats', label: 'Stats', icon: '📊' },
    { id: 'portfolio', label: 'Work', icon: '🎨' },
    { id: 'leads', label: 'Leads', icon: '📩' },
    { id: 'site', label: 'Site', icon: '⚙️' }
  ];

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-0 md:p-6 bg-indigo-950/30 backdrop-blur-md animate-fadeIn">
      <div className="clay-card w-full max-w-7xl h-full md:h-[90vh] flex flex-col overflow-hidden bg-[#F0F4F8] rounded-none md:rounded-[3rem] relative">
        
        {isSidebarOpen && <div className="md:hidden fixed inset-0 bg-indigo-950/40 z-[145]" onClick={() => setIsSidebarOpen(false)} />}

        <div className="px-6 py-5 border-b flex items-center justify-between bg-white/30 z-[146]">
          <div className="flex items-center gap-4">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="clay-button p-2 text-indigo-600">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" /></svg>
             </button>
             <h2 className="font-black text-xl hidden sm:block">Studio Command</h2>
          </div>
          <button onClick={onClose} className="clay-button p-2 text-gray-400 hover:text-red-500">✕</button>
        </div>

        <div className="flex flex-grow overflow-hidden relative">
          <div className={`fixed md:relative inset-y-0 left-0 w-64 p-8 space-y-4 bg-white md:bg-white/20 z-[147] transition-all transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} flex flex-col`}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id as any); setIsSidebarOpen(false); }} className={`w-full text-left px-6 py-4 rounded-[2rem] font-black flex items-center gap-4 ${activeTab === tab.id ? 'clay-card text-indigo-600 bg-white' : 'clay-card-inset opacity-50'}`}>
                <span>{tab.icon}</span> <span>{tab.label}</span>
              </button>
            ))}
            <div className="mt-auto pt-6 border-t"><button onClick={handleLogout} className="w-full clay-button-primary bg-red-500 py-4 font-black">Sign Out</button></div>
          </div>

          <div className="flex-grow p-6 md:p-12 overflow-y-auto bg-white/5 w-full">
            {activeTab === 'portfolio' && (
              <div className="space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                  <form onSubmit={handleAddProject} className="lg:col-span-3 clay-card p-6 md:p-10 space-y-6 bg-white/40">
                    <h3 className="font-black text-indigo-600 uppercase tracking-widest">Add New Project</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <input required className="clay-card-inset px-6 py-4 font-bold outline-none" placeholder="Title" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} />
                      <select className="clay-card-inset px-6 py-4 font-black outline-none" value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value as any})}>
                        <option>Web Development</option>
                        <option>Graphic Design</option>
                      </select>
                    </div>
                    <input required className="w-full clay-card-inset px-6 py-4 font-bold outline-none" placeholder="Thumbnail Image URL" value={newProject.thumbnail} onChange={e => {
                      setNewProject({...newProject, thumbnail: e.target.value});
                      setPreviewError(false);
                    }} />
                    <input className="w-full clay-card-inset px-6 py-4 font-bold outline-none" placeholder="Project Link" value={newProject.project_url} onChange={e => setNewProject({...newProject, project_url: e.target.value})} />
                    <textarea required className="w-full clay-card-inset px-6 py-4 font-medium outline-none" rows={3} placeholder="Description" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} />
                    <button type="submit" className="clay-button-primary w-full py-4 font-black">Publish Project</button>
                  </form>
                  <div className="lg:col-span-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-2">Live Thumbnail Preview</p>
                    <div className="clay-card p-2 aspect-video flex items-center justify-center overflow-hidden bg-white/60 relative">
                      {newProject.thumbnail && !previewError ? (
                        <img 
                          key={newProject.thumbnail}
                          src={newProject.thumbnail} 
                          className="w-full h-full object-cover rounded-2xl clay-card-inset" 
                          onError={() => setPreviewError(true)} 
                          alt="Preview" 
                        />
                      ) : (
                        <div className="text-center px-4">
                          <span className="text-gray-400 italic text-sm">
                            {previewError ? "⚠️ Invalid Image URL" : "Enter a thumbnail URL to see preview..."}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map(p => (
                    <div key={p.id} className="clay-card p-4 flex flex-col gap-3 group">
                      <div className="aspect-video overflow-hidden rounded-xl clay-card-inset">
                        <img 
                          src={p.thumbnail || "https://placehold.co/600x400?text=No+Thumbnail"} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                          alt="" 
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Image+Missing'; }}
                        />
                      </div>
                      <div className="flex justify-between items-start">
                        <div className="overflow-hidden">
                          <h4 className="font-black text-sm truncate">{p.title}</h4>
                          <p className="text-[10px] text-indigo-500 font-bold uppercase">{p.category}</p>
                        </div>
                        <button onClick={() => handleDeleteProject(p.id)} className="text-red-400 font-black p-1 hover:text-red-600 transition-colors">✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'stats' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                <div className="clay-card p-10 text-center"><p className="text-5xl font-black text-indigo-600 mb-2">{leads.length}</p><p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Leads</p></div>
                <div className="clay-card p-10 text-center"><p className="text-5xl font-black text-indigo-400 mb-2">{projects.length}</p><p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Work Items</p></div>
                <div className="clay-card p-10 text-center"><p className="text-5xl font-black text-green-500 mb-2">Healthy</p><p className="text-[10px) font-black uppercase tracking-widest text-gray-400">System Status</p></div>
              </div>
            )}
            {activeTab === 'leads' && (
              <div className="space-y-6">
                {leads.map(l => (
                  <div key={l.id} className="clay-card p-8 flex justify-between bg-white/60">
                    <div className="flex-grow pr-4">
                      <h4 className="font-black text-xl">{l.name}</h4>
                      <p className="text-indigo-600 text-sm font-bold mb-4">{l.email}</p>
                      <div className="clay-card-inset p-4 bg-white/40 italic text-xs leading-relaxed">"{l.message}"</div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[9px] font-black bg-indigo-50 px-3 py-1 rounded-full uppercase text-indigo-600">{l.reference_code}</span>
                      <p className="text-[10px] text-gray-400 mt-2">{new Date(l.created_at || '').toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
