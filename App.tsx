
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

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative overflow-x-hidden min-h-screen">
      {/* Background Blobs */}
      <div className="blob top-[-100px] left-[-100px] animate-pulse"></div>
      <div className="blob bottom-[-100px] right-[-100px] bg-blue-400 opacity-10 animate-bounce" style={{ animationDuration: '8s' }}></div>
      <div className="blob top-[50%] right-[10%] bg-indigo-500 opacity-5"></div>

      <Header isScrolled={isScrolled} />
      
      <main>
        <Hero />
        <Services />
        <Portfolio />
        <Skills />
        <Process />
        <Testimonials />
        <Pricing />
        <FAQ />
        <Contact />
      </main>

      <Footer />
    </div>
  );
};

export default App;
