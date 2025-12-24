
import React from 'react';
import { Link } from 'react-router-dom';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#fafafa]">
      {/* Elementos Decorativos de Fondo */}
      <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-indigo-100/40 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-violet-100/40 rounded-full blur-[120px]"></div>

      {/* Navbar Minimalista */}
      <nav className="relative z-50 flex items-center justify-between px-10 py-10 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 flyer-gradient rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200">
            <span className="text-white font-black text-2xl tracking-tighter">L</span>
          </div>
          <span className="text-2xl font-[900] tracking-tight text-slate-900">Linguist<span className="text-indigo-600">AI</span></span>
        </div>
        <div className="hidden md:flex items-center space-x-12 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
          <a href="#metodo" className="hover:text-indigo-600 transition-colors">Método AI</a>
          <a href="#tutors" className="hover:text-indigo-600 transition-colors">Native Connect</a>
          <a href="#pricing" className="hover:text-indigo-600 transition-colors">Membresías</a>
        </div>
        <Link to="/login" className="btn-shine px-8 py-3.5 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-[0.15em] shadow-2xl hover:bg-indigo-600 transition-all active:scale-95">
          Acceso Alumnos
        </Link>
      </nav>

      {/* Hero "Flyer" Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-10 pt-20 pb-40 grid lg:grid-cols-2 gap-24 items-center">
        <div className="space-y-12 animate-in fade-in slide-in-from-left-12 duration-1000">
          <div className="inline-flex items-center px-5 py-2 rounded-full glass-card border-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em]">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-3 animate-pulse"></span>
            Reinventando el aprendizaje Bilingüe
          </div>

          <h1 className="text-7xl md:text-9xl font-[900] leading-[0.85] tracking-[-0.04em] text-slate-900">
            DOMINA EL <br/>
            <span className="text-transparent bg-clip-text flyer-gradient">INGLÉS</span> <br/>
            COMO NATIVO.
          </h1>

          <p className="text-xl text-slate-500 max-w-lg font-medium leading-relaxed">
            Un ecosistema inteligente que fusiona la potencia de <span className="text-indigo-600 font-bold">Gemini 3.0</span> con inmersión cultural profunda. Aprende inglés para el mundo real, no para los libros.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 pt-4">
            <Link to="/login" className="btn-shine px-12 py-6 bg-indigo-600 text-white rounded-3xl font-black text-sm uppercase tracking-widest shadow-[0_20px_40px_rgba(79,70,229,0.3)] hover:-translate-y-1 transition-all text-center">
              Empezar Misión Gratis ⚡
            </Link>
            <button className="px-12 py-6 bg-white text-slate-900 border-2 border-slate-100 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all text-center">
              Ver Demo Live
            </button>
          </div>

          <div className="flex items-center space-x-8 pt-10 border-t border-slate-100">
            <div>
              <p className="text-3xl font-black text-slate-900">A1 → C2</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Niveles Cubiertos</p>
            </div>
            <div className="h-10 w-px bg-slate-200"></div>
            <div>
              <p className="text-3xl font-black text-slate-900">64+</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contextos Culturales</p>
            </div>
          </div>
        </div>

        {/* Lado Derecho: El "Flyer" Visual */}
        <div className="relative perspective-1000 hidden lg:block">
          {/* Main App Preview Card */}
          <div className="relative z-20 animate-float-slow">
            <div className="w-[480px] h-[640px] bg-white rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.12)] border border-white p-6 relative overflow-hidden group">
              <div className="absolute inset-0 flyer-gradient opacity-5 group-hover:opacity-10 transition-opacity"></div>
              
              <div className="relative h-full flex flex-col justify-between">
                <div className="flex justify-between items-center px-4 pt-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase">LVL B2 Advanced</div>
                </div>

                <div className="space-y-8 px-4">
                   <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center text-5xl shadow-inner mx-auto">🇺🇸</div>
                   <div className="text-center space-y-2">
                     <h3 className="text-2xl font-black text-slate-900">Misión: Silicon Valley</h3>
                     <p className="text-sm text-slate-400 font-medium">Pitching your startup idea</p>
                   </div>
                   <div className="space-y-3">
                     <div className="h-12 w-full bg-slate-50 rounded-2xl flex items-center px-4 border border-slate-100">
                        <div className="w-4 h-4 rounded-full bg-indigo-500 mr-3"></div>
                        <div className="h-2 w-32 bg-slate-200 rounded"></div>
                     </div>
                     <div className="h-12 w-full bg-slate-50 rounded-2xl flex items-center px-4 border border-slate-100">
                        <div className="w-4 h-4 rounded-full border-2 border-slate-200 mr-3"></div>
                        <div className="h-2 w-48 bg-slate-100 rounded"></div>
                     </div>
                   </div>
                </div>

                <div className="p-4 bg-indigo-600 rounded-[2.5rem] flex items-center justify-between shadow-2xl shadow-indigo-200">
                   <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">🎙️</div>
                      <span className="text-white text-xs font-black uppercase tracking-widest">Kore AI Is Listening</span>
                   </div>
                   <div className="flex space-x-1">
                      {[1,2,3,4].map(i => <div key={i} className="w-1 h-4 bg-white/40 rounded-full animate-pulse" style={{animationDelay: `${i*0.2}s`}}></div>)}
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Badges */}
          <div className="absolute top-20 -right-12 z-30 bg-white p-6 rounded-[2rem] shadow-2xl border border-slate-100 animate-bounce duration-[4000ms]">
            <div className="flex items-center space-x-4">
               <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl">🔥</div>
               <div>
                  <p className="text-xl font-black text-slate-900">12 Días</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Racha de estudio</p>
               </div>
            </div>
          </div>

          <div className="absolute bottom-40 -left-16 z-30 bg-slate-900 p-6 rounded-[2rem] shadow-2xl animate-pulse">
            <div className="flex items-center space-x-4 text-white">
               <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">⚡</div>
               <div>
                  <p className="text-xl font-black">2.4k XP</p>
                  <p className="text-[10px] font-bold opacity-60 uppercase">Puntos ganados</p>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
