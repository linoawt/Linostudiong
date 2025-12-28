
import React from 'react';

interface HeroProps {
  onStartProject: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartProject }) => {
  return (
    <section id="home" className="pt-32 pb-20 px-6 min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="max-w-5xl mx-auto text-center z-10">
        <div className="inline-block px-4 py-1.5 mb-8 clay-card-inset text-indigo-600 font-semibold text-sm uppercase tracking-widest animate-bounce">
          Design • Code • Strategy
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black text-gray-900 leading-[1.1] mb-8">
          Design That <span className="text-indigo-600">Speaks</span>.<br />
          Code That <span className="text-indigo-600">Works</span>.
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
          I help brands stand out visually and function flawlessly online through modern graphic design and high-performance web development.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a href="#portfolio" className="clay-button-primary px-10 py-5 text-lg font-bold w-full sm:w-auto transform hover:scale-105 transition-transform">
            View My Work
          </a>
          <button 
            onClick={onStartProject}
            className="clay-button px-10 py-5 text-lg font-bold w-full sm:w-auto hover:text-indigo-600 transition-all"
          >
            Start a Project
          </button>
        </div>

        {/* Floating Mockup Illustration Area */}
        <div className="mt-20 relative flex justify-center">
            <div className="w-full max-w-3xl clay-card aspect-video flex items-center justify-center p-8">
                 <div className="w-full h-full clay-card-inset overflow-hidden flex items-center justify-center bg-white/50">
                    <img 
                        src="https://picsum.photos/1200/800?grayscale" 
                        alt="Featured Project" 
                        className="object-cover w-full h-full opacity-80"
                    />
                 </div>
            </div>
            
            {/* Small floating accents */}
            <div className="absolute -top-10 -right-10 w-24 h-24 clay-card flex items-center justify-center animate-bounce duration-[3s]">
                <span className="text-3xl">🖌</span>
            </div>
            <div className="absolute -bottom-5 -left-10 w-24 h-24 clay-card flex items-center justify-center animate-bounce duration-[4s]">
                <span className="text-3xl">💻</span>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
