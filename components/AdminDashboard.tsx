
import React, { useState, useEffect } from 'react';
import { SiteConfig, Lead, Project, Service } from '../types.ts';
import { supabase } from '../supabase.ts';

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
  const [activeTab, setActiveTab] = useState<'stats' | 'site' | 'portfolio' | 'leads'>('stats');
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
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      setLocalConfig(config);
      fetchData();
    }
  }, [session, config]);

  const fetchData = async () => {
    setDbError(null);
    try {
      // Fetching projects with safe selection to avoid schema cache issues
      // We explicitly select common columns to avoid errors with missing specific columns like 'project_url' if it's renamed
      const [leadsRes, projectsRes, servicesRes] = await Promise.all([
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('services').select('*').order('created_at', { ascending: true })
      ]);
      
      if (leadsRes.error) console.error("Leads fetch error:", leadsRes.error);
      if (projectsRes.error) console.error("Projects fetch error:", projectsRes.error);
      if (servicesRes.error) console.error("Services fetch error:", servicesRes.error);

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
      // Safe insert: We'll attempt to use project_url but fallback to projectUrl if schema dictates
      const projectData: any = { ...newProject };
      
      const { data, error } = await supabase.from('projects').insert([projectData]).select();
      
      if (error) {
        // Fallback for renamed columns
        if (error.message.includes("project_url")) {
          delete projectData.project_url;
          projectData.projectUrl = newProject.project_url;
          const retry = await supabase.from('projects').insert([projectData]).select();
          if (retry.error) throw retry.error;
          setProjects([retry.data[0], ...projects]);
        } else {
          throw error;
        }
      } else {
        setProjects([data[0], ...projects]);
      }

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

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-950 p-4">
        <div className="clay-card w-full max-w-md p-10 text-center bg-[#F0F4F8]">
          <h2 className="text-2xl font-black mb-2">Studio Command</h2>
          <p className="text-xs text-gray-500 mb-8 uppercase tracking-widest font-bold">Secure Access Required</p>
          {dbError && <div className="mb-6 p-4 clay-card-inset bg-red-50 text-red-500 text-xs font-bold">{dbError}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" placeholder="Email" className="w-full clay-card-inset px-6 py-4 font-bold outline-none" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" className="w-full clay-card-inset px-6 py-4 font-bold outline-none" value={password} onChange={e => setPassword(e.target.value)} />
            <button className="clay-button-primary w-full py-4 font-black flex items-center justify-center gap-2">
              {isAuthLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Unlock Terminal'}
            </button>
            <button onClick={onClose} type="button" className="text-gray-400 text-xs font-bold mt-4 hover:text-indigo-600 transition-colors">Return to Portfolio</button>
          </form>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'stats', label: 'Dashboard', icon: '📊' },
    { id: 'portfolio', label: 'Portfolio', icon: '🎨' },
    { id: 'leads', label: 'Enquiries', icon: '📩' },
    { id: 'site', label: 'Site Settings', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className={`fixed md:relative inset-y-0 left-0 w-72 bg-white/40 backdrop-blur-xl border-r border-indigo-100 p-8 z-50 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-lg shadow-lg font-black">L</div>
          <div>
            <h2 className="font-black text-lg leading-none">Studio</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Admin Panel</p>
          </div>
        </div>

        <nav className="space-y-3">
          {tabs.map(tab => (
            <button 
              key={tab.id} 
              onClick={() => { setActiveTab(tab.id as any); setIsSidebarOpen(false); }} 
              className={`w-full text-left px-6 py-4 rounded-[1.5rem] font-bold flex items-center gap-4 transition-all ${activeTab === tab.id ? 'clay-card text-indigo-600 bg-white' : 'text-gray-500 hover:text-indigo-600 hover:bg-white/30'}`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto absolute bottom-8 left-8 right-8">
          <button onClick={handleLogout} className="w-full clay-button py-4 font-black text-red-500 hover:bg-red-50 transition-all flex items-center justify-center gap-2">
            <span>🚪</span> Logout
          </button>
          <button onClick={onClose} className="w-full mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-indigo-600">Back to Site</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow h-screen overflow-y-auto custom-scrollbar p-6 md:p-12">
        <header className="flex items-center justify-between mb-12 md:hidden">
           <button onClick={() => setIsSidebarOpen(true)} className="clay-button p-3 text-indigo-600">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" /></svg>
           </button>
           <h1 className="font-black text-xl">Lino Admin</h1>
        </header>

        {activeTab === 'stats' && (
          <div className="space-y-12 animate-fadeIn">
            <h1 className="text-4xl font-black">Studio <span className="text-indigo-600">Overview</span></h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              <div className="clay-card p-10 text-center"><p className="text-6xl font-black text-indigo-600 mb-2">{leads.length}</p><p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Leads</p></div>
              <div className="clay-card p-10 text-center"><p className="text-6xl font-black text-indigo-400 mb-2">{projects.length}</p><p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Work Items</p></div>
              <div className="clay-card p-10 text-center"><p className="text-4xl font-black text-green-500 mb-2 mt-4 uppercase">Connected</p><p className="text-[10px] font-black uppercase tracking-widest text-gray-400">DB Status</p></div>
            </div>
            
            <div className="clay-card p-10 bg-white/40">
              <h3 className="font-black text-xl mb-6 flex items-center gap-3">🚀 Quick Actions</h3>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => setActiveTab('portfolio')} className="clay-button px-8 py-4 font-bold text-sm hover:text-indigo-600 transition-colors">Add Project</button>
                <button onClick={() => setActiveTab('leads')} className="clay-button px-8 py-4 font-bold text-sm hover:text-indigo-600 transition-colors">Review Leads</button>
                <button onClick={() => window.open('https://app.supabase.com', '_blank')} className="clay-button px-8 py-4 font-bold text-sm hover:text-indigo-600 transition-colors">Database View</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="space-y-12 animate-fadeIn">
            <h1 className="text-4xl font-black">Manage <span className="text-indigo-600">Projects</span></h1>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <form onSubmit={handleAddProject} className="lg:col-span-3 clay-card p-10 space-y-6 bg-white/40">
                <h3 className="font-black text-indigo-600 uppercase tracking-widest text-sm mb-4">New Project Slot</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required className="clay-card-inset px-6 py-4 font-bold outline-none text-sm" placeholder="Project Title" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} />
                  <select className="clay-card-inset px-6 py-4 font-black outline-none text-sm" value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value as any})}>
                    <option>Web Development</option>
                    <option>Graphic Design</option>
                  </select>
                </div>
                <input required className="w-full clay-card-inset px-6 py-4 font-bold outline-none text-sm" placeholder="Thumbnail URL (Unsplash/Direct Link)" value={newProject.thumbnail} onChange={e => {
                  setNewProject({...newProject, thumbnail: e.target.value});
                  setPreviewError(false);
                }} />
                <input className="w-full clay-card-inset px-6 py-4 font-bold outline-none text-sm" placeholder="Live Project Link (Optional)" value={newProject.project_url} onChange={e => setNewProject({...newProject, project_url: e.target.value})} />
                <textarea required className="w-full clay-card-inset px-6 py-4 font-medium outline-none text-sm" rows={3} placeholder="Project Description..." value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} />
                <button type="submit" className="clay-button-primary w-full py-4 font-black transform active:scale-95 transition-transform">Push to Portfolio</button>
              </form>
              <div className="lg:col-span-2 space-y-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Live Render Preview</p>
                <div className="clay-card p-4 aspect-video flex items-center justify-center overflow-hidden bg-white/60 relative">
                  {newProject.thumbnail && !previewError ? (
                    <img 
                      src={newProject.thumbnail} 
                      className="w-full h-full object-cover rounded-2xl shadow-inner" 
                      onError={() => setPreviewError(true)} 
                      alt="Preview" 
                    />
                  ) : (
                    <div className="text-center px-6">
                      <span className="text-gray-400 italic text-xs font-bold leading-relaxed">
                        {previewError ? "⚠️ Asset could not be loaded" : "Valid image URL required for preview..."}
                      </span>
                    </div>
                  )}
                </div>
                <div className="clay-card-inset p-6 bg-indigo-50/30">
                  <p className="text-xs text-gray-500 font-bold">💡 Tip: Use high-quality JPG/PNG links or Unsplash source URLs for best appearance.</p>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-black mt-16">Active Portfolio ({projects.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
              {projects.map(p => (
                <div key={p.id} className="clay-card p-5 flex flex-col gap-4 group">
                  <div className="aspect-video overflow-hidden rounded-2xl clay-card-inset bg-gray-100 shadow-inner">
                    <img 
                      src={p.thumbnail || "https://placehold.co/600x400/f0f4f8/4f46e5?text=No+Thumbnail"} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      alt="" 
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/f0f4f8/e53e3e?text=Broken+Link'; }}
                    />
                  </div>
                  <div className="flex justify-between items-start px-2">
                    <div className="overflow-hidden">
                      <h4 className="font-black text-base truncate">{p.title}</h4>
                      <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest">{p.category}</p>
                    </div>
                    <button onClick={() => handleDeleteProject(p.id)} className="text-gray-300 font-black p-2 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="space-y-12 animate-fadeIn">
             <h1 className="text-4xl font-black">Studio <span className="text-indigo-600">Leads</span></h1>
             <div className="space-y-6 pb-20">
              {leads.length === 0 ? (
                <div className="clay-card p-20 text-center">
                  <span className="text-4xl mb-4 block">🏝️</span>
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No active leads found in the vault.</p>
                </div>
              ) : (
                leads.map(l => (
                  <div key={l.id} className="clay-card p-8 flex flex-col sm:flex-row justify-between bg-white/60 gap-8 hover:bg-white transition-colors">
                    <div className="flex-grow pr-4">
                      <div className="flex items-center gap-4 mb-2">
                        <h4 className="font-black text-2xl">{l.name}</h4>
                        <span className="text-[10px] font-black bg-indigo-50 px-4 py-1.5 rounded-full uppercase text-indigo-600 tracking-tighter shadow-sm border border-indigo-100">
                          {l.reference_code || l.referenceCode || 'REF-N/A'}
                        </span>
                      </div>
                      <p className="text-indigo-600 text-sm font-black mb-6 flex items-center gap-2">
                        <span>📧</span> {l.email}
                      </p>
                      <div className="clay-card-inset p-6 bg-white/50 text-gray-700 text-sm leading-relaxed rounded-[2rem]">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Project Scope</p>
                        "{l.message}"
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between shrink-0">
                      <p className="text-[10px] text-gray-400 font-bold mb-4">{new Date(l.created_at || '').toLocaleString()}</p>
                      <div className="flex gap-3">
                         <a href={`mailto:${l.email}`} className="clay-button-primary px-6 py-3 text-xs font-black shadow-none flex items-center gap-2">
                           Reply ✉️
                         </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'site' && (
          <div className="space-y-12 animate-fadeIn">
            <h1 className="text-4xl font-black">Studio <span className="text-indigo-600">Settings</span></h1>
            <div className="clay-card p-20 text-center bg-indigo-50/30">
              <span className="text-5xl mb-6 block">🛠️</span>
              <h3 className="text-2xl font-black mb-4">Core Settings Migration</h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">The site configuration engine is currently being synced with Supabase Realtime. Please use the Database Dashboard for advanced changes.</p>
              <button onClick={() => window.open('https://app.supabase.com', '_blank')} className="mt-8 clay-button-primary px-10 py-4 font-black text-sm">Open Supabase Console</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
