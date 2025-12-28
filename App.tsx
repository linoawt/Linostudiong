
import React, { useState, useEffect } from 'react';
import Header from './components/Header.tsx';
import Hero from './components/Hero.tsx';
import Services from './components/Services.tsx';
import Portfolio from './components/Portfolio.tsx';
import Skills from './components/Skills.tsx';
import Process from './components/Process.tsx';
import Testimonials from './components/Testimonials.tsx';
import Pricing from './components/Pricing.tsx';
import Contact from './components/Contact.tsx';
import FAQ from './components/FAQ.tsx';
import Footer from './components/Footer.tsx';
import HireMeModal from './components/HireMeModal.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import { SiteConfig } from './types.ts';
import { supabase } from './supabase.ts';

const INITIAL_STATE: SiteConfig = {
  siteName: "Lino Studio NG",
  tagline: "Designing Visual Identity. Building Digital Experiences.",
  heroHeadline: "Design That Speaks. Code That Works.",
  heroSubtext: "I help brands stand out visually and function flawlessly online through modern graphic design and high-performance web development.",
  contactEmail: "linostudiong@gmail.com",
  contactPhone: "+234 907 096 2800",
  location: "Yenagoa, Bayelsa State, Nigeria",
  instagramUrl: "#",
  linkedInUrl: "#",
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
    { question: "Do you offer services globally?", answer: "Yes, we work with clients worldwide via remote collaboration tools." },
    { question: "What technologies do you use?", answer: "We specialize in React, Node.js, and modern design tools like Figma." }
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
  const [config, setConfig] = useState<SiteConfig>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: settings, error: settingsError } = await supabase
          .from('settings')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (settingsError) {
          console.warn("Supabase settings fetch error:", settingsError.message);
        }

        if (settings) {
          const mappedConfig: SiteConfig = {
            ...INITIAL_STATE,
            siteName: settings.site_name || INITIAL_STATE.siteName,
            tagline: settings.tagline || INITIAL_STATE.tagline,
            heroHeadline: settings.hero_headline || INITIAL_STATE.heroHeadline,
            heroSubtext: settings.hero_subtext || INITIAL_STATE.heroSubtext,
            contactEmail: settings.contact_email || INITIAL_STATE.contactEmail,
            contactPhone: settings.contact_phone || INITIAL_STATE.contactPhone,
            location: settings.location || INITIAL_STATE.location,
            instagramUrl: settings.instagram_url || INITIAL_STATE.instagramUrl,
            linkedInUrl: settings.linkedin_url || INITIAL_STATE.linkedInUrl,
            theme: settings.theme || INITIAL_STATE.theme,
            couponPrefix: settings.coupon_prefix || INITIAL_STATE.couponPrefix,
            seo: settings.seo || INITIAL_STATE.seo,
            skills: settings.skills || INITIAL_STATE.skills,
            faqs: settings.faqs || INITIAL_STATE.faqs,
            plans: settings.plans || INITIAL_STATE.plans
          };
          setConfig(mappedConfig);
        }
      } catch (err: any) {
        console.warn("Network error during Supabase fetch. Falling back to offline defaults.");
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

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F4F8]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-indigo-600 font-black text-xs uppercase tracking-widest animate-pulse">Initializing Studio...</p>
        </div>
      </div>
    );
  }

  // Admin Route Handling
  if (currentPath === '/admin') {
    return (
      <AdminDashboard 
        isOpen={true} 
        onClose={() => navigateTo('/')} 
        config={config} 
        onUpdateConfig={handleUpdateConfig} 
      />
    );
  }

  return (
    <div className={`transition-colors duration-500 min-h-screen ${config.theme === 'dark' ? 'bg-[#1a1a2e] text-white' : 'bg-[#F0F4F8] text-gray-900'}`}>
      <Header isScrolled={isScrolled} config={config} onHireMeClick={() => setIsHireModalOpen(true)} />
      
      <main className="relative">
        <div className="blob top-20 left-10 opacity-20"></div>
        <div className="blob bottom-40 right-10 opacity-10 bg-indigo-400"></div>
        
        <Hero config={config} onStartProject={() => setIsHireModalOpen(true)} />
        <Services />
        <Portfolio />
        <Skills items={config.skills} />
        <div id="about"><Process /></div>
        <Testimonials />
        <Pricing plans={config.plans} onStartProject={() => setIsHireModalOpen(true)} />
        <FAQ items={config.faqs} />
        <Contact config={config} />
      </main>

      <Footer config={config} onAdminClick={() => navigateTo('/admin')} />

      <HireMeModal isOpen={isHireModalOpen} onClose={() => setIsHireModalOpen(false)} config={config} />
    </div>
  );
};

export default App;
