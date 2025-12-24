
import React, { useState, useEffect } from 'react';
import { useNotifications, NotificationContainer } from '../components/Notifications';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export const AdminPanel: React.FC = () => {
  const { notifications, notify } = useNotifications();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'create' | 'database' | 'logs'>('create');
  const [rawDb, setRawDb] = useState<any>(null);

  const [newTopic, setNewTopic] = useState({ 
    title: '', 
    level: 'B1', 
    description: '', 
    category: 'Grammar',
    icon: '📚',
    videoUrl: ''
  });

  useEffect(() => {
    setRawDb(api.db.getRaw());
  }, [tab]);

  const handleAdd = async () => {
    if (!newTopic.title) {
      notify("El título es obligatorio", "error");
      return;
    }

    try {
      await api.lessons.create(newTopic);
      notify(`¡Lección "${newTopic.title}" guardada en el backend!`, "success");
      setTimeout(() => navigate('/classroom'), 1500);
    } catch (e) {
      notify("Error al guardar", "error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <NotificationContainer notifications={notifications} />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-[900] text-slate-900 mb-2 tracking-tight">Backend Control 🛠️</h1>
          <p className="text-slate-500 text-lg">Gestiona la persistencia y logs de LinguistAI.</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
          <button 
            onClick={() => setTab('create')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${tab === 'create' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            Nueva Lección
          </button>
          <button 
            onClick={() => setTab('database')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${tab === 'database' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            DB Explorer
          </button>
          <button 
            onClick={() => setTab('logs')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${tab === 'logs' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            Activity Logs
          </button>
        </div>
      </div>

      {tab === 'create' ? (
        <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-2xl space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Título</label>
                <input 
                  type="text" 
                  value={newTopic.title}
                  onChange={(e) => setNewTopic({...newTopic, title: e.target.value})}
                  className="w-full p-5 bg-slate-50 rounded-[1.5rem] outline-none focus:bg-white border-2 border-transparent focus:border-indigo-500 transition-all font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nivel</label>
                    <select value={newTopic.level} onChange={(e) => setNewTopic({...newTopic, level: e.target.value})} className="w-full p-5 bg-slate-50 rounded-[1.5rem] font-bold">
                      {['A1','A2','B1','B2','C1','C2'].map(l => <option key={l}>{l}</option>)}
                    </select>
                </div>
                <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Cat.</label>
                    <select value={newTopic.category} onChange={(e) => setNewTopic({...newTopic, category: e.target.value})} className="w-full p-5 bg-slate-50 rounded-[1.5rem] font-bold">
                      {['Grammar','Business','Travel','Academic'].map(c => <option key={c}>{c}</option>)}
                    </select>
                </div>
              </div>
          </div>

          <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Guía para la IA (Prompt Context)</label>
              <textarea 
                value={newTopic.description}
                onChange={(e) => setNewTopic({...newTopic, description: e.target.value})}
                className="w-full h-40 p-6 bg-slate-50 rounded-[2rem] outline-none focus:bg-white border-2 border-transparent focus:border-indigo-500 transition-all font-bold resize-none"
              />
          </div>

          <div className="flex gap-4">
              <button 
                onClick={handleAdd}
                className="flex-1 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-600 transition-all"
              >
                Ejecutar POST /api/lessons
              </button>
              <button 
                onClick={() => { api.lessons.reset(); notify("Cache limpia", "info"); }}
                className="px-8 py-6 bg-rose-50 text-rose-500 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-rose-100 transition-all"
              >
                Reset DB
              </button>
          </div>
        </div>
      ) : tab === 'database' ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="bg-slate-900 rounded-[3rem] p-10 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 text-indigo-500/20 text-8xl font-black">JSON</div>
              <h3 className="text-white text-xl font-black mb-6 flex items-center gap-3">
                <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
                Raw Backend State
              </h3>
              <pre className="text-indigo-300 font-mono text-sm leading-relaxed overflow-x-auto bg-black/30 p-8 rounded-2xl border border-white/5">
                {JSON.stringify(rawDb, null, 2)}
              </pre>
           </div>
           
           <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                 <h4 className="font-black text-slate-900 mb-4 uppercase text-xs tracking-widest">Tabla: Usuarios</h4>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-slate-50">
                       <span className="text-sm font-bold text-slate-400">Nombre</span>
                       <span className="text-sm font-black text-slate-700">{rawDb?.user?.name}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-slate-50">
                       <span className="text-sm font-bold text-slate-400">Puntos XP</span>
                       <span className="text-sm font-black text-indigo-600">{rawDb?.user?.xp}</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                       <span className="text-sm font-bold text-slate-400">Nivel IA</span>
                       <span className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-black">{rawDb?.user?.level}</span>
                    </div>
                 </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                 <h4 className="font-black text-slate-900 mb-4 uppercase text-xs tracking-widest">Estado del Almacenamiento</h4>
                 <div className="text-2xl font-black text-indigo-600">{rawDb?.storageUsage}</div>
                 <p className="text-xs font-bold text-slate-400 uppercase mt-2">Uso actual de LocalStorage</p>
              </div>
           </div>
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden animate-in fade-in duration-500">
           <div className="p-8 border-b border-slate-50 bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-900">Activity Ledger</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Registros de interacción del servidor</p>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actividad</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">XP Ganada</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {rawDb?.user?.logs?.map((log: any) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-5">
                         <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                           log.type === 'quiz' ? 'bg-indigo-50 text-indigo-600' :
                           log.type === 'voice' ? 'bg-amber-50 text-amber-600' :
                           log.type === 'culture' ? 'bg-emerald-50 text-emerald-600' :
                           'bg-rose-50 text-rose-600'
                         }`}>
                           {log.type}
                         </span>
                      </td>
                      <td className="px-8 py-5 text-sm font-bold text-slate-700">{log.title}</td>
                      <td className="px-8 py-5 text-sm font-black text-indigo-600">+{log.xpEarned}</td>
                      <td className="px-8 py-5 text-[10px] font-bold text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!rawDb?.user?.logs?.length && (
                <div className="p-20 text-center opacity-20 flex flex-col items-center gap-4">
                   <div className="text-6xl">📁</div>
                   <p className="font-black uppercase tracking-[0.3em] text-xs">Sin registros de actividad</p>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};
