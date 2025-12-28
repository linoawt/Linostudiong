
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="space-y-6">
            <div className="text-2xl font-black flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-lg shadow-lg">L</div>
              <span>Lino Studio <span className="text-indigo-600">NG</span></span>
            </div>
            <p className="text-gray-600 max-w-xs leading-relaxed">
              Designing Visual Identity. Building Digital Experiences. Let's create something meaningful together.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-black text-gray-900 uppercase tracking-widest text-sm">Quick Links</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#home" className="hover:text-indigo-600 transition-colors">Home</a></li>
                <li><a href="#services" className="hover:text-indigo-600 transition-colors">Services</a></li>
                <li><a href="#portfolio" className="hover:text-indigo-600 transition-colors">Portfolio</a></li>
                <li><a href="#contact" className="hover:text-indigo-600 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-black text-gray-900 uppercase tracking-widest text-sm">Connect</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-black text-gray-900 uppercase tracking-widest text-sm">Stay Updated</h4>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="clay-card-inset px-4 py-3 flex-grow outline-none focus:ring-1 focus:ring-indigo-300 transition-all text-sm"
              />
              <button className="clay-button-primary px-6 py-3 font-bold text-sm">Join</button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500 font-medium">
          <p>© 2025 Lino Studio NG. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
