
import React from 'react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="clay-card p-10 md:p-20 overflow-hidden relative">
          {/* Background decoration */}
          <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10">
            <div>
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                Let’s Build Something <span className="text-indigo-600">Great</span>
              </h2>
              <p className="text-lg text-gray-600 mb-12 max-w-md">
                Ready to bring your idea to life? Whether it's a new brand identity or a complex web app, I'm here to help.
              </p>

              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 clay-card-inset flex items-center justify-center text-2xl">📍</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Location</h4>
                    <p className="text-gray-600">Yenagoa, Bayelsa State, Nigeria</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 clay-card-inset flex items-center justify-center text-2xl">📧</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Email</h4>
                    <p className="text-gray-600 underline">linostudiong@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 clay-card-inset flex items-center justify-center text-2xl">📞</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Phone</h4>
                    <p className="text-gray-600">+234 XXX XXX XXXX</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="clay-card-inset p-8 md:p-12">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-2">Your Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      className="w-full clay-card px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-2">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="john@example.com"
                      className="w-full clay-card px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-2">Subject</label>
                  <select className="w-full clay-card px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-no-repeat bg-right transition-all">
                    <option>General Inquiry</option>
                    <option>Web Development Project</option>
                    <option>Graphic Design Work</option>
                    <option>Brand Consultation</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-2">Your Message</label>
                  <textarea 
                    rows={5} 
                    placeholder="Tell me about your project..."
                    className="w-full clay-card px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                  ></textarea>
                </div>
                <button className="clay-button-primary w-full py-5 font-black text-lg transform hover:scale-[1.02] transition-transform">
                  Send a Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
