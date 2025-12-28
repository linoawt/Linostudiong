
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
import { supabase } from './supabase';

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
  skills: [
    { name: "Branding", level: 95, category: "Design" },
    { name: "Logo Design", level: 90, category: "Design" },
    { name: "UI/UX", level: 85, category: "Design" },
    { name: "React/TS", level: 95, category: "Development" },
    { name: "Node.js", level: 85, category: "Development" },
    { name: "Supabase", level: 90, category: "Development" }
  ],
  faqs: [
    { question: "What is your typical turnaround?", answer: "Usually 1-3 weeks depending on the complexity." },
    { question: "Do you offer maintenance?", answer: "Yes, we have monthly support packages." }
  ],
  plans: [
    { name: "Starter", price: "$499", features: ["Basic Website", "SEO Ready", "5 Pages"] },
    { name: "Professional", price: "$999", features: ["Dynamic Web App", "Custom Branding", "CMS Access"], highlighted: true },
    { name: "Premium", price: "$1999", features: ["Full Enterprise Solution", "Mobile App Support", "Priority 24/7"] }
  ]
};

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [config, setConfig] = useState<SiteConfig>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Settings
        const { data: settings, error: settingsError } = await supabase
          .from('settings')
          .select('*')
          .single();

        if (settingsError) throw settingsError;

        // 2. Map DB snake_case to camelCase types
        const mappedConfig: SiteConfig = {
          ...INITIAL_STATE,
          siteName: settings.site_name || INITIAL_STATE.siteName,
          tagline: settings.tagline || INITIAL_STATE.tagline,
          // Fixed: Changed hero_headline to heroHeadline and hero_subtext to heroSubtext to match SiteConfig type
          heroHeadline: settings.hero_headline || INITIAL_STATE.heroHeadline,
          heroSubtext: settings.hero_subtext || INITIAL_STATE.heroSubtext,
          contactEmail: settings.contact_email || INITIAL_STATE.contactEmail,
          contactPhone: settings.contact_phone || INITIAL_STATE.contactPhone,
          location: settings.location || INITIAL_STATE.location,
          theme: settings.theme || INITIAL_STATE.theme,
          couponPrefix: settings.coupon_prefix || INITIAL_STATE.couponPrefix,
          seo: settings.seo || INITIAL_STATE.seo,
          skills: settings.skills || INITIAL_STATE.skills,
          faqs: settings.faqs || INITIAL_STATE.faqs,
          plans: settings.plans || INITIAL_STATE.plans
        };
        
        // 3. Fetch Services (Portfolio now handles its own)
        const { data: servicesData } = await supabase.from('services').select('*').order('created_at', { ascending: true });
        
        if (servicesData) mappedConfig.services = servicesData;

        setConfig(mappedConfig);
      } catch (err) {
        console.warn("Supabase Fetch Error, using local defaults:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    document.title = config.seo.metaTitle;
    const isDark = config.theme === 'dark';
    document.documentElement.classList.toggle('dark-mode', isDark);
  }, [config.theme, config.seo.metaTitle]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUpdateConfig = (newConfig: SiteConfig) => {
    setConfig(newConfig);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F4F8]">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`transition-colors duration-500 min-h-screen ${config.theme === 'dark' ? 'bg-[#1a1a2e] text-white' : 'bg-[#F0F4F8] text-gray-900'}`}>
      <Header isScrolled={isScrolled} config={config} onHireMeClick={() => setIsHireModalOpen(true)} />
      
      <main className="relative">
        <div className="blob top-20 left-10 opacity-20"></div>
        <div className="blob bottom-40 right-10 opacity-10 bg-indigo-400"></div>
        
        <Hero config={config} onStartProject={() => setIsHireModalOpen(true)} />
        <Services items={config.services.length > 0 ? config.services : []} />
        <Portfolio />
        <Skills items={config.skills} />
        <div id="about"><Process /></div>
        <Testimonials />
        <Pricing plans={config.plans} />
        <FAQ items={config.faqs} />
        <Contact config={config} />
      </main>

      <Footer config={config} onAdminClick={() => setIsAdminOpen(true)} />

      <HireMeModal isOpen={isHireModalOpen} onClose={() => setIsHireModalOpen(false)} config={config} />
      <AdminDashboard isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} config={config} onUpdateConfig={handleUpdateConfig} />
    </div>
  );
};

export default App;
