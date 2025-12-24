
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const StatCard: React.FC<{ label: string, value: string | number, sub: string, icon: string, color: string }> = ({ label, value, sub, icon, color }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group cursor-pointer hover:-translate-y-1">
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div className="space-y-1">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
      <p className="text-[10px] font-bold text-slate-400 italic">{sub}</p>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const [user, setUser] = useState(api.auth.me());
  const [leaderboard, setLeaderboard] = useState(api.progress.getLeaderboard());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setUser(api.auth.me());
      setLeaderboard(api.progress.getLeaderboard());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-5xl font-[900] text-slate-900 tracking-tight leading-tight">Hola,<br/> {user.name?.split(' ')[0]}! 👋</h1>
            {user.subscription !== 'starter' && (
              <span className="px-4 py-1.5 flyer-gradient text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg animate-pulse">Pro Member</span>
            )}
          </div>
          <p className="text-slate-500 font-medium text-lg">Nivel actual: <span className="text-indigo-600 font-black">{user.level || 'A1'}</span>. Estás en el Top del ranking.</p>
        </div>
        <div className="flex gap-2">
           {['A1','A2','B1','B2','C1','C2'].map(lvl => (
             <div key={lvl} className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs border-2 transition-all ${user.level === lvl ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl scale-110' : 'bg-slate-50 text-slate-300 border-slate-100'}`}>
                {lvl}
             </div>
           ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flyer-gradient rounded-[3.5rem] p-12 text-white relative overflow-hidden group shadow-2xl shadow-indigo-100">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full -mr-40 -mt-40 blur-[100px] group-hover:scale-110 transition-transform duration-1000"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="w-40 h-40 bg-white/10 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center text-7xl shadow-2xl ring-1 ring-white/30 border border-white/20 animate-float-slow">
              🚀
            </div>
            <div className="flex-1 space-y-8 text-center md:text-left">
              <div>
                <span className="px-4 py-1.5 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block backdrop-blur-md">Misión Diaria</span>
                <h2 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tight">Placement Test <br/> Automático</h2>
                <p className="text-indigo-100 mt-4 text-lg font-medium opacity-90">Tu IA evalúa tu nivel real en tiempo real.</p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <Link to="/classroom" className="px-10 py-5 bg-white text-indigo-600 font-black rounded-3xl hover:bg-slate-50 transition-all shadow-xl hover:-translate-y-1">
                  Estudiar Ahora →
                </Link>
                {user.subscription === 'starter' && (
                  <Link to="/pricing" className="px-10 py-5 bg-indigo-500/40 text-white font-black rounded-3xl hover:bg-indigo-500/60 transition-all backdrop-blur-xl border border-white/10">
                    Hacerse Pro ⭐
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <StatCard label="Puntos XP" value={user.xp || 0} sub={`Nivel ${user.level}`} icon="⚡" color="bg-amber-100 text-amber-600" />
           
           <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Ranking Global 🏆</h3>
              <div className="space-y-4">
                 {leaderboard.map((student, idx) => (
                   <div key={idx} className={`flex items-center justify-between p-3 rounded-2xl ${student.name === 'Tú' ? 'bg-indigo-50 border border-indigo-100' : ''}`}>
                      <div className="flex items-center gap-3">
                         <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">{idx + 1}</span>
                         <p className={`text-sm font-bold ${student.name === 'Tú' ? 'text-indigo-600' : 'text-slate-700'}`}>{student.name}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-xs font-black text-slate-900">{student.xp} XP</p>
                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{student.level}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { to: '/live', icon: '🗣️', label: 'Voice Lab', desc: 'Práctica IA 24/7' },
          { to: '/classroom', icon: '🎓', label: 'Academia', desc: 'Módulos IA' },
          { to: '/career', icon: '💼', label: 'Career Prep', desc: 'Entrevistas' },
          { to: '/vocab', icon: '🧩', label: 'Vocab Flash', desc: 'Visual AI' },
        ].map(card => (
          <Link key={card.to} to={card.to} className="bg-white p-8 rounded-[3rem] border border-slate-100 hover:border-indigo-600 transition-all hover:shadow-2xl hover:shadow-indigo-100 group flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-4xl mb-6 group-hover:scale-110 group-hover:bg-indigo-50 transition-all duration-500">
              {card.icon}
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-1">{card.label}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
