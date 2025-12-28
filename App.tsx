
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
  projects: [
    { id: '1', title: 'NeoBank App', category: 'Web Development', thumbnail: 'https://picsum.photos/600/400?random=1', description: 'Financial tech platform.' },
    { id: '2', title: 'Urban Bloom Branding', category: 'Graphic Design', thumbnail: 'https://picsum.photos/600/400?random=2', description: 'Visual identity for floral boutique.' }
  ],
  services: [
    { id: '1', title: 'Graphic Design', icon: '🖌', description: 'Visual stories for your brand.', items: ['Flyers', 'Logos', 'Branding'] },
    { id: '2', title: 'Web Development', icon: '💻', description: 'Scalable web applications.', items: ['React', 'Node.js', 'PHP'] }
  ],
  skills: [
    { name: 'Branding', level: 90, category: 'Design' },
    { name: 'JavaScript', level: 85, category: 'Development' }
  ],
  faqs: [
    { question: "What services do you offer?", answer: "We provide graphic design and full-stack web development." }
  ],
  plans: [
    { name: "Professional", price: "$799", features: ["Full Branding", "Web Design"], highlighted: true }
  ]
};

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [config, setConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem('lino_studio_db');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem('lino_studio_db', JSON.stringify(config));
    document.title = config.seo.metaTitle;
    if (config.theme === 'dark') document.documentElement.classList.add('dark-mode');
    else document.documentElement.classList.remove('dark-mode');
  }, [config]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`transition-colors duration-500 ${config.theme === 'dark' ? 'bg-[#1a1a2e] text-white' : 'bg-[#F0F4F8] text-gray-900'}`}>
      <Header isScrolled={isScrolled} config={config} onHireMeClick={() => setIsHireModalOpen(true)} />
      
      <main>
        <Hero config={config} onStartProject={() => setIsHireModalOpen(true)} />
        <Services items={config.services} />
        <Portfolio items={config.projects} />
        <Skills items={config.skills} />
        <div id="about"><Process /></div>
        <Testimonials />
        <Pricing plans={config.plans} />
        <FAQ items={config.faqs} />
        <Contact config={config} />
      </main>

      <Footer config={config} onAdminClick={() => setIsAdminOpen(true)} />

      <HireMeModal isOpen={isHireModalOpen} onClose={() => setIsHireModalOpen(false)} config={config} />
      <AdminDashboard isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} config={config} onUpdateConfig={setConfig} />
    </div>
  );
};

export default App;
