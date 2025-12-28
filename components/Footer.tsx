
import React from 'react';
import { SiteConfig } from '../types.ts';

interface FooterProps {
  onAdminClick: () => void;
  config: SiteConfig;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick, config }) => {
  const siteName = config.siteName || "Lino Studio NG";
  const [nameMain, ...nameRest] = siteName.split(' ');
  
  return (
    <footer className="pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="space-y-6">
            <div className="text-2xl font-black flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-lg shadow-lg">{nameMain[0]}</div>
              <span>{nameMain} <span className="text-indigo-600">{nameRest.join(' ')}</span></span>
            </div>
            <p className="text-gray-600 max-w-xs leading-relaxed">{config.tagline}</p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-black text-gray-900 uppercase tracking-widest text-sm">Links</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#home" className="hover:text-indigo-600 transition-colors">Home</a></li>
                <li><a href="#services" className="hover:text-indigo-600 transition-colors">Services</a></li>
                <li><a href="#contact" className="hover:text-indigo-600 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-black text-gray-900 uppercase tracking-widest text-sm">Connect</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href={config.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">Instagram</a></li>
                <li><a href={config.linkedInUrl} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="font-black text-gray-900 uppercase tracking-widest text-sm">Studio Access</h4>
            <button onClick={onAdminClick} className="clay-button w-full py-4 font-bold text-indigo-600 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Admin Dashboard
            </button>
            <p className="text-[10px] text-gray-400 text-center italic">Restricted to administrator only.</p>
          </div>
        </div>
        <div className="pt-8 border-t border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500 font-medium">
          <p>© 2025 {siteName}. All rights reserved.</p>
          <div className="flex gap-6"><a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a><a href="#" className="hover:text-indigo-600 transition-colors">Terms</a></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
