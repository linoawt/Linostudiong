
import React from 'react';
import { Skill } from '../types';

const skills: Skill[] = [
  { name: 'Branding', level: 90, category: 'Design' },
  { name: 'Logo Design', level: 95, category: 'Design' },
  { name: 'Illustration', level: 80, category: 'Design' },
  { name: 'Print Design', level: 85, category: 'Design' },
  { name: 'HTML/CSS', level: 95, category: 'Development' },
  { name: 'JavaScript', level: 85, category: 'Development' },
  { name: 'Node.js', level: 75, category: 'Development' },
  { name: 'PHP', level: 80, category: 'Development' },
  { name: 'Git/GitHub', level: 85, category: 'Development' },
];

const Skills: React.FC = () => {
  const designSkills = skills.filter(s => s.category === 'Design');
  const devSkills = skills.filter(s => s.category === 'Development');

  return (
    <section id="skills" className="py-24 px-6 bg-indigo-50/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">Skills Dashboard</h2>
          <p className="text-gray-600">Technical proficiency and creative arsenal.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Design Skills */}
          <div className="clay-card p-10">
            <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
              <span className="text-3xl">🎨</span> Design Skills
            </h3>
            <div className="space-y-8">
              {designSkills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-bold text-gray-800">{skill.name}</span>
                    <span className="text-indigo-600 font-black text-sm">{skill.level}%</span>
                  </div>
                  <div className="h-6 w-full clay-progress-bg p-1.5 overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 rounded-full shadow-lg"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Development Skills */}
          <div className="clay-card p-10">
            <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
              <span className="text-3xl">⚙️</span> Development Skills
            </h3>
            <div className="space-y-8">
              {devSkills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-bold text-gray-800">{skill.name}</span>
                    <span className="text-indigo-600 font-black text-sm">{skill.level}%</span>
                  </div>
                  <div className="h-6 w-full clay-progress-bg p-1.5 overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full shadow-lg"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
