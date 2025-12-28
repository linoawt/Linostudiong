
import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { supabase } from '../supabase';

const MOCK_PROJECTS: Project[] = [
  {
    id: 'mock-1',
    title: 'EcoBrand Identity',
    category: 'Graphic Design',
    thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563cc4c?auto=format&fit=crop&q=80&w=800',
    description: 'A sustainable brand identity system for a renewable energy startup.',
    projectUrl: 'https://behance.net'
  },
  {
    id: 'mock-2',
    title: 'Fintech Dashboard',
    category: 'Web Development',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bbbda546697c?auto=format&fit=crop&q=80&w=800',
    description: 'A high-performance React dashboard for real-time financial tracking.',
    projectUrl: 'https://github.com'
  }
];

const Portfolio: React.FC = () => {
  const [items, setItems] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'Graphic Design' | 'Web Development'>('All');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn("Supabase Fetch Error (Projects):", error.message || error);
          setItems(MOCK_PROJECTS);
        } else if (!data || data.length === 0) {
          setItems(MOCK_PROJECTS);
        } else {
          setItems(data);
        }
      } catch (err: any) {
        console.error("Critical error fetching projects:", err);
        setItems(MOCK_PROJECTS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = items.filter(p => filter === 'All' || p.category === filter);

  return (
    <section id="portfolio" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Portfolio Highlights</h2>
            <p className="text-gray-600 max-w-xl">A selection of projects where creativity meets purpose.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            {['All', 'Graphic Design', 'Web Development'].map((cat) => (
              <button 
                key={cat} 
                onClick={() => setFilter(cat as any)} 
                className={`px-6 py-2 rounded-full font-bold transition-all ${filter === cat ? 'clay-button-primary' : 'clay-button hover:text-indigo-600'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProjects.map((project) => {
            const link = project.project_url || project.projectUrl || '#contact';
            const isExternal = link.startsWith('http');
            const thumbUrl = project.thumbnail && project.thumbnail.trim() !== '' 
              ? project.thumbnail 
              : `https://placehold.co/800x600?text=${encodeURIComponent(project.title)}+Preview`;
            
            return (
              <div key={project.id} className="clay-card overflow-hidden group hover:-translate-y-2 transition-all duration-500">
                <div className="relative aspect-[4/3] overflow-hidden m-4 rounded-[1.5rem] shadow-inner bg-gray-100">
                  <img 
                    src={thumbUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                    loading="lazy"
                    onError={(e) => { 
                      const target = e.target as HTMLImageElement;
                      if (target.src !== 'https://placehold.co/800x600?text=Image+Unavailable') {
                        target.src = 'https://placehold.co/800x600?text=Image+Unavailable';
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-indigo-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[3px]">
                    <a 
                      href={link} 
                      target={isExternal ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className="clay-button-primary px-8 py-3 font-black text-sm transform translate-y-6 group-hover:translate-y-0 transition-all duration-500 flex items-center gap-2"
                    >
                      {isExternal ? 'Visit Site' : 'Inquire Now'}
                      {isExternal && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>}
                    </a>
                  </div>
                </div>
                <div className="px-8 pb-8 pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-indigo-600 text-[10px] font-black uppercase tracking-widest">{project.category}</span>
                    {isExternal && <span className="bg-green-100 text-green-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Live</span>}
                  </div>
                  <h3 className="text-2xl font-black mt-1 group-hover:text-indigo-600 transition-colors">{project.title}</h3>
                  <p className="text-gray-500 text-sm mt-3 leading-relaxed">{project.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
