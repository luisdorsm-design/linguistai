
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export const Classroom: React.FC = () => {
  const [user, setUser] = useState(api.auth.me());
  const [selectedCat, setSelectedCat] = useState('All');
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await api.lessons.getAll();
      setCourses(data);
      setLoading(false);
    };
    load();
  }, []);

  const CATEGORIES = ['All', 'Grammar', 'Business', 'Travel', 'Academic'];
  const filteredCourses = selectedCat === 'All' 
    ? courses 
    : courses.filter(c => c.category === selectedCat);

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-[900] text-slate-900 tracking-tight">Academia Virtual 🎓</h1>
          <p className="text-slate-500 font-medium text-lg mt-2">Acceso directo al backend de LinguistAI.</p>
        </div>
        <div className="bg-white px-8 py-4 rounded-[2rem] border border-slate-100 shadow-xl shadow-indigo-50/50 flex items-center space-x-6">
          <div className="text-center">
            <span className="block text-indigo-600 font-black text-2xl">⚡ {user.xp || 0}</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">XP Total</span>
          </div>
          <div className="h-10 w-px bg-slate-100"></div>
          <div className="text-center">
            <span className="block text-slate-900 font-black text-2xl">{user.completed?.length || 0}</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lecciones</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
              selectedCat === cat ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.map((topic) => (
          <div key={topic.id} className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden flex flex-col h-full">
            <div className="flex justify-between items-start mb-8">
              <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                {topic.icon}
              </div>
              <div className="flex flex-col items-end gap-2">
                 <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {topic.level}
                 </span>
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{topic.category}</span>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-[900] text-slate-900 mb-4 leading-tight group-hover:text-indigo-600 transition-colors">{topic.title}</h3>
              <p className="text-slate-400 text-sm font-medium mb-8">
                {topic.description || "Módulo educativo sincronizado con la base de datos central."}
              </p>
            </div>
            
            <div className="mt-auto space-y-4">
               {user.completed?.includes(topic.id) ? (
                 <div className="w-full py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center">
                    Completado ✅
                 </div>
               ) : (
                 <Link 
                   to={`/lesson/${topic.id}/${topic.level}`}
                   className="block w-full py-5 bg-slate-900 text-white text-center rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg"
                 >
                   Iniciar Módulo →
                 </Link>
               )}
            </div>
          </div>
        ))}
        
        <Link to="/admin" className="bg-slate-50 rounded-[3.5rem] p-10 border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-center hover:bg-indigo-50 hover:border-indigo-200 transition-all group">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-4xl mb-6 shadow-sm">➕</div>
          <h3 className="font-black text-slate-500 uppercase tracking-widest group-hover:text-indigo-600">Nueva Lección</h3>
          <p className="text-xs font-bold text-slate-400 mt-2">Simular POST Request</p>
        </Link>
      </div>
    </div>
  );
};
