
import React, { useState } from 'react';
import { SiteConfig } from '../types.ts';

interface HeaderProps {
  isScrolled: boolean;
  onHireMeClick: () => void;
  config: SiteConfig;
}

const Header: React.FC<HeaderProps> = ({ isScrolled, onHireMeClick, config }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Skills', href: '#skills' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleHireClick = () => {
    setMobileMenuOpen(false);
    onHireMeClick();
  };

  const siteName = config.siteName || "Lino Studio NG";
  const [nameMain, ...nameRest] = siteName.split(' ');

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 pt-4`}>
      <nav className={`max-w-7xl mx-auto flex items-center justify-between px-8 py-4 ${isScrolled ? 'clay-nav' : ''}`}>
        <div className="text-xl font-extrabold tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm shadow-lg">{nameMain[0]}</div>
          <span>{nameMain} <span className="text-indigo-600">{nameRest.join(' ')}</span></span>
        </div>

        <ul className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <li key={item.name}>
              <a href={item.href} className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">{item.name}</a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <button onClick={onHireMeClick} className="clay-button-primary px-6 py-2.5 font-bold inline-block">Hire Me</button>
        </div>

        <button className="md:hidden clay-button p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden mt-2 clay-card p-6 flex flex-col items-center gap-4 animate-fadeIn">
          {menuItems.map((item) => (
            <a key={item.name} href={item.href} className="text-lg font-medium py-2 w-full text-center hover:text-indigo-600" onClick={() => setMobileMenuOpen(false)}>{item.name}</a>
          ))}
          <button onClick={handleHireClick} className="clay-button-primary px-8 py-3 w-full text-center font-bold">Hire Me</button>
        </div>
      )}
    </header>
  );
};

export default Header;
