
import React from 'react';
import { Skill } from '../types';

interface SkillsProps {
  items: Skill[];
}

const Skills: React.FC<SkillsProps> = ({ items }) => {
  const designSkills = items.filter(s => s.category === 'Design');
  const devSkills = items.filter(s => s.category === 'Development');

  return (
    <section id="skills" className="py-24 px-6 bg-indigo-50/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">Skills Dashboard</h2>
          <p className="text-gray-600">Technical proficiency and creative arsenal.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="clay-card p-10">
            <h3 className="text-2xl font-black mb-8 flex items-center gap-3">🎨 Design</h3>
            <div className="space-y-8">
              {designSkills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between items-end mb-2"><span className="font-bold text-gray-800">{skill.name}</span><span className="text-indigo-600 font-black text-sm">{skill.level}%</span></div>
                  <div className="h-4 w-full clay-progress-bg p-1 overflow-hidden"><div className="h-full bg-indigo-600 rounded-full" style={{ width: `${skill.level}%` }}></div></div>
                </div>
              ))}
            </div>
          </div>
          <div className="clay-card p-10">
            <h3 className="text-2xl font-black mb-8 flex items-center gap-3">⚙️ Development</h3>
            <div className="space-y-8">
              {devSkills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between items-end mb-2"><span className="font-bold text-gray-800">{skill.name}</span><span className="text-indigo-600 font-black text-sm">{skill.level}%</span></div>
                  <div className="h-4 w-full clay-progress-bg p-1 overflow-hidden"><div className="h-full bg-indigo-400 rounded-full" style={{ width: `${skill.level}%` }}></div></div>
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
