
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Skills from './components/Skills';
import Process from './components/Process';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import Contact from './components/Contact';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import HireMeModal from './components/HireMeModal';
import AdminDashboard from './components/AdminDashboard';
import { SiteConfig } from './types';

const INITIAL_STATE: SiteConfig = {
  siteName: "Lino Studio NG",
  tagline: "Designing Visual Identity. Building Digital Experiences.",
  heroHeadline: "Design That Speaks. Code That Works.",
  heroSubtext: "I help brands stand out visually and function flawlessly online through modern graphic design and high-performance web development.",
  contactEmail: "linostudiong@gmail.com",
  contactPhone: "+234 907 096 2800",
  location: "Yenagoa, Bayelsa State, Nigeria",
  theme: 'light',
  couponPrefix: "LINO-",
  seo: {
    metaTitle: "Lino Studio NG | Premium Design & Development",
    metaDescription: "Professional graphic design and web development studio based in Nigeria.",
    keywords: "design, development, nigeria, branding, web app"
  },
  projects: [],
  services: [],
  skills: [],
  faqs: [],
  plans: []
};

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [config, setConfig] = useState<SiteConfig>(INITIAL_STATE);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Sync with real Node.js Backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/config');
        if (response.ok) {
          const data = await response.json();
          setConfig(prev => ({ ...prev, ...data }));
          setIsBackendConnected(true);
        } else {
          // Fallback to local storage if server is down during development
          const saved = localStorage.getItem('lino_studio_db');
          if (saved) setConfig(JSON.parse(saved));
        }
      } catch (err) {
        console.warn("Backend not detected, running in standalone mode.");
        const saved = localStorage.getItem('lino_studio_db');
        if (saved) setConfig(JSON.parse(saved));
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    document.title = config.seo.metaTitle;
    if (config.theme === 'dark') document.documentElement.classList.add('dark-mode');
    else document.documentElement.classList.remove('dark-mode');
  }, [config]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUpdateConfig = async (newConfig: SiteConfig) => {
    setConfig(newConfig);
    // Persist to Backend
    try {
      await fetch('/api/config/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig)
      });
    } catch (err) {
      localStorage.setItem('lino_studio_db', JSON.stringify(newConfig));
    }
  };

  return (
    <div className={`transition-colors duration-500 ${config.theme === 'dark' ? 'bg-[#1a1a2e] text-white' : 'bg-[#F0F4F8] text-gray-900'}`}>
      {/* Backend Connectivity Status (Admin only or Debug) */}
      {!isBackendConnected && (
        <div className="fixed bottom-4 left-4 z-[200] px-3 py-1 bg-yellow-400 text-black text-[10px] font-black rounded-full shadow-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-600 rounded-full animate-pulse"></div>
          STANDALONE MODE (NO DB)
        </div>
      )}

      <Header isScrolled={isScrolled} config={config} onHireMeClick={() => setIsHireModalOpen(true)} />
      
      <main>
        <Hero config={config} onStartProject={() => setIsHireModalOpen(true)} />
        <Services items={config.services.length > 0 ? config.services : INITIAL_STATE.services} />
        <Portfolio items={config.projects.length > 0 ? config.projects : INITIAL_STATE.projects} />
        <Skills items={config.skills.length > 0 ? config.skills : INITIAL_STATE.skills} />
        <div id="about"><Process /></div>
        <Testimonials />
        <Pricing plans={config.plans.length > 0 ? config.plans : INITIAL_STATE.plans} />
        <FAQ items={config.faqs.length > 0 ? config.faqs : INITIAL_STATE.faqs} />
        <Contact config={config} />
      </main>

      <Footer config={config} onAdminClick={() => setIsAdminOpen(true)} />

      <HireMeModal isOpen={isHireModalOpen} onClose={() => setIsHireModalOpen(false)} config={config} />
      <AdminDashboard isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} config={config} onUpdateConfig={handleUpdateConfig} />
    </div>
  );
};

export default App;
