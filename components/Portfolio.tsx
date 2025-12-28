
import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { supabase } from '../supabase';

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

        if (error) throw error;
        setItems(data || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
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
                className={`px-6 py-2 rounded-full font-bold transition-all ${filter === cat ? 'clay-button-primary' : 'clay-button'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="clay-card overflow-hidden animate-pulse">
                <div className="aspect-[4/3] m-4 rounded-[1.5rem] bg-gray-200 shadow-inner"></div>
                <div className="px-8 pb-8 pt-2 space-y-3">
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                  <div className="h-6 w-48 bg-gray-200 rounded"></div>
                  <div className="h-4 w-full bg-gray-100 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProjects.map((project) => (
              <div key={project.id} className="clay-card overflow-hidden group">
                <div className="relative aspect-[4/3] overflow-hidden m-4 rounded-[1.5rem] shadow-inner">
                  <img 
                    src={project.thumbnail || "https://picsum.photos/800/600?grayscale"} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="clay-button-primary px-6 py-2 font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      View Project
                    </button>
                  </div>
                </div>
                <div className="px-8 pb-8 pt-2">
                  <span className="text-indigo-600 text-xs font-bold uppercase tracking-widest">{project.category}</span>
                  <h3 className="text-2xl font-bold mt-1">{project.title}</h3>
                  <p className="text-gray-500 text-sm mt-2">{project.description}</p>
                </div>
              </div>
            ))}
            {filteredProjects.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-400 font-bold italic">No projects found in this category.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;
