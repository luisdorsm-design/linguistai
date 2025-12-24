import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export const Dashboard: React.FC = () => {
  const [user, setUser] = useState(api.auth.me());
  
  useEffect(() => {
    const interval = setInterval(() => setUser(api.auth.me()), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 page-transition">
      {/* Hero Welcome Section */}
      <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/30 rounded-full blur-[120px] -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/20 rounded-full blur-[100px] -ml-20 -mb-20"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="w-40 h-40 bg-white/10 backdrop-blur-2xl rounded-[2.5rem] flex items-center justify-center text-7xl shadow-2xl border border-white/20 animate-float-slow">
            ⚡
          </div>
          <div className="flex-1 space-y-4">
            <h1 className="text-6xl font-black tracking-tight leading-none italic">
              ¡Hola, <span className="text-indigo-400">{user.name.split(' ')[0]}!</span>
            </h1>
            <p className="text-slate-400 text-xl font-medium max-w-xl">
              Tu nivel actual es <span className="text-white font-bold bg-white/10 px-3 py-1 rounded-lg border border-white/10">{user.level}</span>. Has ganado <span className="text-indigo-400 font-black">{user.xp} XP</span> esta semana.
            </p>
            <div className="flex gap-4 pt-4">
               <div className="px-6 py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">
                 🔥 12 Días de Racha
               </div>
               <div className="px-6 py-3 bg-indigo-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20">
                 Miembro Pro
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { to: '/live', icon: '🎙️', title: 'AI Voice Lab', desc: 'Habla con Kore', color: 'bg-indigo-600' },
          { to: '/classroom', icon: '🎓', title: 'Academia', desc: 'Lecciones con IA', color: 'bg-slate-900' },
          { to: '/grammar', icon: '🔍', title: 'Grammar Coach', desc: 'Mejora tu escritura', color: 'bg-violet-600' },
          { to: '/vocab', icon: '🎨', title: 'Visual Vocab', desc: 'Tarjetas con Arte', color: 'bg-emerald-500' }
        ].map((item, i) => (
          <Link key={i} to={item.to} className="group bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center">
            <div className={`w-20 h-20 ${item.color} rounded-3xl flex items-center justify-center text-4xl mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
              {item.icon}
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">{item.title}</h3>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{item.desc}</p>
          </Link>
        ))}
      </div>

      {/* Progress Section */}
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-12">
             <h3 className="text-3xl font-black text-slate-900">Tu Progreso Semanal</h3>
             <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">Rendimiento</span>
          </div>
          <div className="flex items-end justify-between h-56 gap-6">
            {[40, 60, 90, 50, 100, 80, 95].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4">
                 <div 
                   className={`w-full rounded-2xl transition-all duration-1000 ${i === 4 ? 'bg-indigo-600 shadow-2xl shadow-indigo-200' : 'bg-slate-50 border border-slate-100'}`} 
                   style={{ height: `${h}%` }}
                 ></div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{['Lun','Mar','Mie','Jue','Vie','Sab','Dom'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl border border-white/5 flex flex-col">
           <div className="mb-10">
              <h3 className="text-2xl font-black mb-1">Ranking Global</h3>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Top estudiantes del mes</p>
           </div>
           <div className="space-y-6 flex-1">
             {[
               { n: 'Juan Pérez', xp: '4.5k', i: '🥇' },
               { n: 'Elena Musk', xp: '3.2k', i: '🥈' },
               { n: 'Tú', xp: user.xp, i: '🥉' }
             ].map((u, i) => (
               <div key={i} className={`flex items-center justify-between p-5 rounded-3xl border ${u.n === 'Tú' ? 'bg-white/10 border-indigo-500/50 shadow-lg' : 'border-white/5 hover:bg-white/5 transition-colors'}`}>
                 <div className="flex items-center gap-4">
                   <span className="text-2xl">{u.i}</span>
                   <span className="font-bold text-sm tracking-tight">{u.n}</span>
                 </div>
                 <span className="font-black text-[10px] uppercase text-indigo-400">{u.xp} XP</span>
               </div>
             ))}
           </div>
           <button className="mt-8 w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all">
             Ver Tabla Completa
           </button>
        </div>
      </div>
    </div>
  );
};
