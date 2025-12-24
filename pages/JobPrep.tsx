
import React, { useState } from 'react';
import { evaluateInterviewAnswer } from '../services/gemini';
import { useNotifications, NotificationContainer } from '../components/Notifications';
import { api } from '../services/api';

export const JobPrep: React.FC = () => {
  const [mode, setMode] = useState<'intro' | 'interview'>('intro');
  const [jobRole, setJobRole] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('Tell me about yourself and why you are interested in this role.');
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{q: string, a: string, feedback: any}[]>([]);
  const { notifications, notify } = useNotifications();

  const handleNext = async () => {
    if (!userAnswer.trim()) return;
    setLoading(true);
    try {
      const evaluation = await evaluateInterviewAnswer(jobRole, currentQuestion, userAnswer);
      setHistory([...history, { q: currentQuestion, a: userAnswer, feedback: evaluation }]);
      
      if (history.length < 4) {
        setCurrentQuestion(evaluation.nextQuestion || "Can you give me an example of a challenge you faced?");
        setUserAnswer('');
        notify("Respuesta analizada con éxito", "success");
      } else {
        const avgScore = evaluation.score; // Simplificado para el demo
        // Fix: Use saveActivity instead of save as defined in services/api.ts
        await api.progress.saveActivity('quiz', `Interview: ${jobRole}`, avgScore / 10, 'career-interview');
        setMode('intro'); // O mostrar un resumen final
        notify("Entrevista completada. XP Ganada.", "success");
      }
    } catch (err) {
      notify("Error al conectar con la IA", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-700">
      <NotificationContainer notifications={notifications} />
      
      <div className="bg-slate-900 p-12 rounded-[4rem] text-white mb-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="space-y-4">
              <h1 className="text-5xl font-[900] tracking-tight italic">Career Lab 💼</h1>
              <p className="text-indigo-200 text-lg font-medium max-w-md">Domina entrevistas técnicas y negociaciones en inglés con el simulador STAR.</p>
           </div>
           <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center">
                 <span className="block text-3xl font-black">85%</span>
                 <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Success Rate</span>
              </div>
           </div>
        </div>
      </div>

      {mode === 'intro' ? (
        <div className="grid md:grid-cols-2 gap-8">
           <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl space-y-8">
              <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-4xl">🤖</div>
              <h3 className="text-3xl font-[900] text-slate-900">AI Interviewer</h3>
              <p className="text-slate-500 font-medium">Entrena con un reclutador virtual que evalúa tu gramática, fluidez y estructura de respuesta profesional.</p>
              
              <div className="space-y-4">
                 <input 
                   type="text" 
                   placeholder="Ej: Senior Web Developer, Marketing Manager..." 
                   className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-bold transition-all"
                   value={jobRole}
                   onChange={(e) => setJobRole(e.target.value)}
                 />
                 <button 
                   onClick={() => jobRole && setMode('interview')}
                   disabled={!jobRole}
                   className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
                 >
                   Iniciar Simulacro →
                 </button>
              </div>
           </div>

           <div className="space-y-6">
              <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100">
                 <h4 className="font-black text-indigo-900 mb-2 uppercase text-xs tracking-widest">¿Qué es el Método STAR?</h4>
                 <p className="text-sm text-indigo-700/80 leading-relaxed font-medium">
                   <strong>S</strong>ituation, <strong>T</strong>ask, <strong>A</strong>ction, <strong>R</strong>esult. <br/>
                   Es el estándar de oro en entrevistas corporativas. Nuestra IA te enseñará a estructurar tus respuestas así.
                 </p>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
                 <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl">📄</div>
                 <div>
                    <p className="font-black text-slate-900 uppercase text-xs tracking-widest">Resume Polisher</p>
                    <p className="text-xs text-slate-400 font-bold">Optimiza tu CV con IA (Próximamente)</p>
                 </div>
              </div>
           </div>
        </div>
      ) : (
        <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden animate-in zoom-in duration-500">
           <div className="bg-slate-50 px-12 py-8 border-b border-slate-100 flex justify-between items-center">
              <div>
                 <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Entrevista en Progreso</span>
                 <h2 className="text-xl font-black text-slate-900">{jobRole}</h2>
              </div>
              <div className="flex gap-2">
                 {[1,2,3,4,5].map(i => (
                   <div key={i} className={`w-3 h-3 rounded-full ${history.length >= i ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
                 ))}
              </div>
           </div>

           <div className="p-12 space-y-10">
              <div className="bg-indigo-50 p-10 rounded-[3rem] border border-indigo-100 relative">
                 <span className="absolute -top-4 left-10 px-4 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase">Reclutador IA</span>
                 <p className="text-2xl font-[800] text-indigo-900 leading-tight">"{currentQuestion}"</p>
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Tu Respuesta Profesional</label>
                 <textarea 
                   className="w-full h-48 p-8 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-[2.5rem] outline-none font-bold text-lg transition-all resize-none"
                   placeholder="Escribe tu respuesta aquí..."
                   value={userAnswer}
                   onChange={(e) => setUserAnswer(e.target.value)}
                 />
              </div>

              <button 
                onClick={handleNext}
                disabled={loading || !userAnswer}
                className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? 'Evaluando STAR...' : 'Enviar Respuesta →'}
              </button>

              {history.length > 0 && (
                <div className="pt-10 border-t border-slate-100 space-y-6">
                   <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Feedback de la respuesta anterior</h4>
                   <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex gap-6">
                      <div className="text-center">
                         <span className="block text-3xl font-black text-emerald-600">{history[history.length-1].feedback.score}</span>
                         <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Score</span>
                      </div>
                      <div className="flex-1 space-y-2">
                         <p className="text-sm text-emerald-800 font-bold italic">"{history[history.length-1].feedback.feedback}"</p>
                         <div className="p-3 bg-white/50 rounded-xl text-[11px] text-emerald-600 font-medium">
                            <span className="font-black">Better version:</span> {history[history.length-1].feedback.betterVersion}
                         </div>
                      </div>
                   </div>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};
