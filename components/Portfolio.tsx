
import React, { useState } from 'react';
import { Project } from '../types';

const projects: Project[] = [
  { id: '1', title: 'NeoBank App', category: 'Web Development', thumbnail: 'https://picsum.photos/600/400?random=1', description: 'Financial tech platform.' },
  { id: '2', title: 'Urban Bloom Branding', category: 'Graphic Design', thumbnail: 'https://picsum.photos/600/400?random=2', description: 'Visual identity for floral boutique.' },
  { id: '3', title: 'Fitness Tracker', category: 'Web Development', thumbnail: 'https://picsum.photos/600/400?random=3', description: 'Health monitoring dashboard.' },
  { id: '4', title: 'E-Commerce Visuals', category: 'Graphic Design', thumbnail: 'https://picsum.photos/600/400?random=4', description: 'Product marketing assets.' },
  { id: '5', title: 'Crypto Dashboard', category: 'Web Development', thumbnail: 'https://picsum.photos/600/400?random=5', description: 'Live crypto trading UI.' },
  { id: '6', title: 'Organic Juice Packaging', category: 'Graphic Design', thumbnail: 'https://picsum.photos/600/400?random=6', description: 'Sustainable packaging design.' },
];

const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Graphic Design' | 'Web Development'>('All');

  const filteredProjects = projects.filter(p => filter === 'All' || p.category === filter);

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProjects.map((project) => (
            <div key={project.id} className="clay-card overflow-hidden group">
              <div className="relative aspect-[4/3] overflow-hidden m-4 rounded-[1.5rem] shadow-inner">
                <img 
                  src={project.thumbnail} 
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
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
