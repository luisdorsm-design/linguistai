
import React, { useState } from 'react';
import { generateScenarioExercise, speakText } from '../services/gemini';
import { api } from '../services/api';
import { useNotifications, NotificationContainer } from '../components/Notifications';

const SCENARIOS = [
  { id: 'airport', icon: '✈️', name: 'Aeropuerto & Aduanas', culture: 'USA' },
  { id: 'cafe', icon: '☕', name: 'Restaurante & Social', culture: 'Francia' },
  { id: 'office', icon: '🏢', name: 'Reunión Corporativa', culture: 'Japón' },
  { id: 'market', icon: '🛍️', name: 'Mercado Local', culture: 'México' },
  { id: 'hospital', icon: '🏥', name: 'Ayuda Médica', culture: 'Reino Unido' },
  { id: 'hotel', icon: '🏨', name: 'Checking In', culture: 'Emiratos Árabes' },
  { id: 'bank', icon: '🏦', name: 'Finanzas & Banca', culture: 'Suiza' },
  { id: 'street', icon: '🚕', name: 'Direcciones', culture: 'India' },
  { id: 'home', icon: '🏠', name: 'Visita Familiar', culture: 'Italia' },
  { id: 'school', icon: '🎓', name: 'Vida Académica', culture: 'Canadá' },
  { id: 'tech', icon: '💻', name: 'Soporte Técnico', culture: 'Corea del Sur' },
  { id: 'legal', icon: '⚖️', name: 'Derechos & Leyes', culture: 'Alemania' },
  { id: 'sports', icon: '⚽', name: 'Charla de Equipo', culture: 'Brasil' },
  { id: 'events', icon: '🎉', name: 'Celebraciones', culture: 'Nigeria' },
  { id: 'nature', icon: '🌲', name: 'Eco-Turismo', culture: 'Australia' },
  { id: 'art', icon: '🎨', name: 'Tours de Museos', culture: 'Egipto' }
];

export const CultureBook: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<any>(null);
  const [exercise, setExercise] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const { notifications, notify } = useNotifications();

  const startExercise = async (scenario: any) => {
    setSelectedScenario(scenario);
    setLoading(true);
    setExercise(null);
    setFeedback(null);
    try {
      const ex = await generateScenarioExercise('B1', scenario.name, scenario.culture);
      setExercise(ex);
    } catch (err) {
      notify("Error al generar escenario", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (idx: number) => {
    if (idx === exercise.correctAnswer) {
      setFeedback('¡Correcto! XP +50 ⚡');
      speakText(exercise.question + " " + exercise.options[idx]);
      
      // GUARDAR EN BACKEND
      try {
        await api.progress.saveActivity('culture', `Cultura: ${selectedScenario.name}`, 5);
        notify("Progreso cultural guardado", "success");
      } catch (e) {
        console.error("Backend error");
      }
    } else {
      setFeedback(`No exactamente. ${exercise.explanation}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-32 animate-in fade-in duration-700">
      <NotificationContainer notifications={notifications} />
      <div className="mb-16">
        <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">Explorador Cultural 🌍</h1>
        <p className="text-xl text-slate-500 max-w-2xl font-medium">Aprende inglés adaptado al contexto real de cada país. Tus decisiones afectan tu XP.</p>
      </div>

      {!selectedScenario ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => startExercise(s)}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-indigo-600 transition-all hover:shadow-2xl group text-left relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:bg-indigo-50 transition-colors"></div>
              <span className="text-4xl mb-6 block group-hover:scale-125 transition-transform duration-500">{s.icon}</span>
              <h3 className="text-xl font-black text-slate-800 mb-1">{s.name}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.culture}</p>
              <div className="mt-6 flex items-center text-indigo-600 text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Iniciar Lab →
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <button 
            onClick={() => setSelectedScenario(null)}
            className="text-slate-400 hover:text-indigo-600 font-bold flex items-center gap-2 uppercase text-xs tracking-[0.2em]"
          >
            ← Volver a la biblioteca
          </button>

          <div className="bg-white rounded-[3rem] p-12 border border-slate-200 shadow-2xl shadow-indigo-50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
               <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-4xl shadow-inner">
                    {selectedScenario.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900">{selectedScenario.name}</h2>
                    <p className="text-indigo-600 font-bold uppercase text-xs tracking-widest">Ubicación: {selectedScenario.culture} • Nivel B1</p>
                  </div>
               </div>
               {loading && (
                 <div className="flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                    <div className="w-5 h-5 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-bold text-slate-600 text-sm">Sincronizando con IA...</span>
                 </div>
               )}
            </div>

            {exercise && (
              <div className="space-y-10">
                <div className="p-10 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 relative">
                  <button 
                    onClick={() => speakText(exercise.question)}
                    className="absolute top-6 right-6 w-12 h-12 bg-white rounded-2xl shadow-sm hover:text-indigo-600 transition-colors flex items-center justify-center text-xl"
                  >
                    🔊
                  </button>
                  <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-4 text-center">Contexto de Conversación</p>
                  <h4 className="text-2xl font-bold text-slate-800 text-center leading-relaxed italic max-w-3xl mx-auto">
                    "{exercise.question}"
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {exercise.options.map((opt: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className="group p-6 bg-white border-2 border-slate-100 rounded-2xl text-left transition-all hover:border-indigo-600 hover:shadow-xl hover:-translate-y-1 active:scale-95"
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">{String.fromCharCode(65 + idx)}</span>
                        <span className="font-bold text-slate-700 text-lg">{opt}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {feedback && (
                  <div className={`p-8 rounded-[2rem] border-2 animate-in fade-in slide-in-from-top-4 duration-300 ${feedback.startsWith('¡Correcto') ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'}`}>
                    <div className="flex items-start gap-4">
                      <span className="text-2xl">{feedback.startsWith('¡Correcto') ? '✅' : '❌'}</span>
                      <div>
                        <p className="font-black text-lg mb-1 uppercase tracking-tight">{feedback.split('.')[0]}</p>
                        <p className="font-medium opacity-80">{exercise.explanation}</p>
                        {exercise.culturalInsight && (
                          <div className="mt-4 pt-4 border-t border-current/10 text-xs font-bold uppercase tracking-widest opacity-60">
                            💡 Tip Cultural: {exercise.culturalInsight}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
