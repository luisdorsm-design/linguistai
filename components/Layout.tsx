
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

const SidebarLink: React.FC<{ to: string, icon: string, label: string, onClick?: () => void }> = ({ to, icon, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
  
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
        isActive 
          ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 scale-[1.02]' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-bold text-sm tracking-tight">{label}</span>
    </Link>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = authService.getUser();
  
  const handleLogout = () => {
    authService.logout();
    navigate('/welcome');
  };

  const menuItems = [
    { to: "/", icon: "🏠", label: "Dashboard" },
    { to: "/classroom", icon: "🎓", label: "Academia" },
    { to: "/live", icon: "🎙️", label: "AI Voice Lab" },
    { to: "/culture", icon: "🌍", label: "Cultura" },
    { to: "/career", icon: "💼", label: "Job Prep" },
    { to: "/tutors", icon: "📹", label: "Native Connect" },
  ];

  return (
    <div className="flex h-screen bg-[#fcfcfc] overflow-hidden font-sans">
      <aside className={`fixed md:relative z-[90] w-72 h-full bg-white border-r border-slate-100 flex flex-col transition-transform duration-500 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-10 h-10 flyer-gradient rounded-xl flex items-center justify-center text-white font-black">L</div>
            <h1 className="text-xl font-black text-slate-900 tracking-tighter">LinguistAI</h1>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map(item => (
              <SidebarLink 
                key={item.to} 
                to={item.to} 
                icon={item.icon} 
                label={item.label} 
                onClick={() => setIsMobileMenuOpen(false)}
              />
            ))}
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-slate-50 space-y-4">
          <div className="p-5 bg-slate-50 rounded-[2rem] flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl flyer-gradient flex items-center justify-center text-white text-[10px] font-black shadow-lg">XP</div>
            <div>
              <p className="text-xs font-black text-slate-900 uppercase">{user.name || 'Estudiante'}</p>
              <p className="text-[10px] font-black text-indigo-600">{user.xp || 0} PUNTOS</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-3 px-4 py-3 text-slate-400 hover:text-rose-500 transition-all font-black text-[10px] uppercase tracking-widest border border-transparent hover:border-rose-100 hover:bg-rose-50 rounded-2xl"
          >
            <span>🚪 Salir</span>
          </button>
        </div>
      </aside>

      {isMobileMenuOpen && (
        <div onClick={() => setIsMobileMenuOpen(false)} className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-80" />
      )}

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 shrink-0 relative z-40">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">☰</button>
          <div className="flex items-center space-x-3 hidden sm:flex">
             <div className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase border border-indigo-100">PRO v3.5 CLASSROOM</div>
          </div>
          <div className="flex items-center space-x-6">
             <div className="flex items-center px-5 py-2 bg-amber-50 rounded-2xl border border-amber-100 text-amber-700 shadow-sm">
                <span className="mr-2 text-lg">🔥</span>
                <span className="text-xs font-black">12 DÍAS</span>
             </div>
             <Link to="/admin" className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 text-sm hover:bg-indigo-600 hover:text-white transition-all shadow-sm">⚙️</Link>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-[#fcfcfc] page-transition">
          {children}
        </div>
      </main>
    </div>
  );
};
