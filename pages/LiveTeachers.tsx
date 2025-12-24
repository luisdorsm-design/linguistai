
import React from 'react';

const TeacherCard: React.FC<{ name: string, country: string, flag: string, specialties: string[] }> = ({ name, country, flag, specialties }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-6">
    <div className="w-20 h-20 bg-slate-200 rounded-full flex-shrink-0 overflow-hidden relative group cursor-pointer">
       <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white font-bold">📹</span>
       </div>
       <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between mb-2">
         <h4 className="text-lg font-bold text-slate-800">{name}</h4>
         <span className="text-sm">{flag} {country}</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {specialties.map(s => (
          <span key={s} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded uppercase">{s}</span>
        ))}
      </div>
      <button className="w-full py-2 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 transition-colors">Book Free Intro</button>
    </div>
  </div>
);

export const LiveTeachers: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10 flex items-center justify-between">
         <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Live Native Connect</h1>
            <p className="text-slate-500">Practice with real humans for that final 10% of fluency.</p>
         </div>
         <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold animate-pulse">
            ● 24 Tutors Online
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TeacherCard name="Sarah J." country="London, UK" flag="🇬🇧" specialties={['IELTS', 'Business', 'Phonics']} />
        <TeacherCard name="Mark T." country="New York, USA" flag="🇺🇸" specialties={['Interviews', 'Slang', 'Tech']} />
        <TeacherCard name="Elena R." country="Sydney, AU" flag="🇦🇺" specialties={['Grammar', 'Conversation']} />
        <TeacherCard name="Chloe B." country="Toronto, CA" flag="🇨🇦" specialties={['Academic', 'Writing']} />
      </div>

      <div className="mt-12 bg-indigo-900 rounded-3xl p-8 text-center text-white">
         <h3 className="text-2xl font-bold mb-4">Ready to go Live?</h3>
         <p className="text-indigo-200 mb-8 max-w-lg mx-auto">Our certified tutors are available 24/7. Book a private or group session starting from $15/hr.</p>
         <button className="px-10 py-4 bg-white text-indigo-900 font-extrabold rounded-2xl shadow-xl hover:scale-105 transition-transform">Get Premium Pass</button>
      </div>
    </div>
  );
};
