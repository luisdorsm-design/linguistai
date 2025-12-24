
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateFullLesson, speakText } from '../services/gemini';
import { api } from '../services/api';
import { useNotifications, NotificationContainer } from '../components/Notifications';

export const LessonDetail: React.FC = () => {
  const { id, level } = useParams();
  const navigate = useNavigate();
  const { notifications, notify } = useNotifications();
  
  const [step, setStep] = useState<'theory' | 'quiz' | 'result'>('theory');
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const lessonData = await api.lessons.getById(id!);
        const context = lessonData?.description || "";
        
        if (lessonData?.videoUrl) {
          let embedId = "";
          if (lessonData.videoUrl.includes('v=')) {
            embedId = lessonData.videoUrl.split('v=')[1].split('&')[0];
          } else if (lessonData.videoUrl.includes('youtu.be/')) {
            embedId = lessonData.videoUrl.split('youtu.be/')[1];
          }
          if (embedId) setVideoUrl(`https://www.youtube.com/embed/${embedId}`);
        }

        const data = await generateFullLesson(id?.replace('-', ' ') || "English", level || "A1", context);
        setLesson(data);
        notify("Contenido de IA generado", "success");
      } catch (e) {
        notify("Error de red con el backend", "error");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, level]);

  const handleSubmitQuiz = async () => {
    let correctCount = 0;
    const review = lesson.quiz.map((q: any, idx: number) => {
      const isCorrect = answers[idx]?.toLowerCase().trim() === q.correctAnswer?.toLowerCase().trim();
      if (isCorrect) correctCount++;
      return { ...q, userAnsw: answers[idx], isCorrect };
    });
    
    setScore(correctCount);
    setFeedback(review);
    setStep('result');
    
    // GUARDAR EN BACKEND USANDO EL NUEVO SISTEMA DE ACTIVIDADES
    try {
      await api.progress.saveActivity('quiz', `Quiz: ${id}`, correctCount, id);
      notify(`¡Resultado sincronizado! XP y Nivel actualizados.`, "success");
    } catch (e) {
      notify("Error al sincronizar progreso", "error");
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center space-y-10 bg-white">
      <div className="relative">
         <div className="w-32 h-32 border-[12px] border-indigo-50 rounded-full"></div>
         <div className="absolute inset-0 w-32 h-32 border-[12px] border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
         <div className="absolute inset-0 flex items-center justify-center text-4xl">🧠</div>
      </div>
      <div className="text-center space-y-3">
        <p className="font-[900] text-2xl text-slate-900 tracking-tight">Consultando Backend...</p>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em] animate-pulse">LinguistAI Engine v2.0</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-40">
      <NotificationContainer notifications={notifications} />
      
      <div className="mb-12 flex items-center justify-between">
         <button onClick={() => navigate('/classroom')} className="group flex items-center gap-3 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-indigo-600 transition-colors">
            <span className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">←</span>
            Salir de clase
         </button>
         <div className="flex gap-4 items-center">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Paso {step === 'theory' ? '1' : step === 'quiz' ? '2' : '3'} de 3</span>
            <div className="flex space-x-2">
               <div className={`w-12 h-2 rounded-full transition-all duration-500 ${step === 'theory' ? 'bg-indigo-600 w-16' : 'bg-slate-200'}`}></div>
               <div className={`w-12 h-2 rounded-full transition-all duration-500 ${step === 'quiz' ? 'bg-indigo-600 w-16' : 'bg-slate-200'}`}></div>
               <div className={`w-12 h-2 rounded-full transition-all duration-500 ${step === 'result' ? 'bg-indigo-600 w-16' : 'bg-slate-200'}`}></div>
            </div>
         </div>
      </div>

      {step === 'theory' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
           {videoUrl && (
             <div className="rounded-[3rem] overflow-hidden shadow-2xl bg-black aspect-video border-8 border-white">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={videoUrl} 
                  title="Lesson Video" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
             </div>
           )}

           <div className="bg-white p-12 md:p-16 rounded-[4rem] border border-slate-100 shadow-2xl space-y-10">
              <div className="flex items-center gap-4">
                 <div className="w-16 h-1 bg-indigo-600 rounded-full"></div>
                 <h1 className="text-5xl font-[900] text-slate-900 leading-tight tracking-tight">{id?.replace('-', ' ').toUpperCase()}</h1>
              </div>
              
              <div className="prose prose-indigo max-w-none text-slate-600 leading-relaxed text-lg whitespace-pre-wrap font-medium">
                 {lesson.theory}
              </div>

              <div className="pt-10 border-t border-slate-50 flex items-center gap-6">
                 <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-3xl">💡</div>
                 <div>
                    <p className="font-black text-slate-900 uppercase text-xs tracking-widest">Consejo de Estudio</p>
                    <p className="text-slate-500 text-sm">Lee la teoría en voz alta para practicar tu pronunciación antes del quiz.</p>
                 </div>
              </div>
           </div>

           <button 
             onClick={() => {
               window.scrollTo(0,0);
               setStep('quiz');
             }}
             className="w-full py-8 bg-indigo-600 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:-translate-y-1 active:scale-95 transition-all"
           >
             Empezar Evaluación (20 Preguntas) →
           </button>
        </div>
      )}

      {step === 'quiz' && (
        <div className="space-y-12 animate-in fade-in duration-500">
           <div className="text-center space-y-2">
              <h2 className="text-4xl font-[900] text-slate-900 tracking-tight">Quiz de Dominio 📝</h2>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">Demuestra lo aprendido para ganar XP</p>
           </div>
           
           <div className="space-y-10">
              {lesson.quiz.map((q: any, idx: number) => (
                <div key={idx} className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-8 relative overflow-hidden group">
                   <div className="absolute top-0 left-0 w-2 h-full bg-slate-50 group-hover:bg-indigo-500 transition-colors"></div>
                   <div className="flex items-center space-x-6">
                      <span className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm shadow-inner">{idx + 1}</span>
                      <p className="text-2xl font-[800] text-slate-800 leading-tight">{q.question}</p>
                   </div>
                   
                   {q.options ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {q.options.map((opt: string) => (
                          <button 
                            key={opt}
                            onClick={() => setAnswers({...answers, [idx]: opt})}
                            className={`p-6 rounded-[1.5rem] border-2 text-left font-bold transition-all ${answers[idx] === opt ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl scale-[1.02]' : 'bg-slate-50 border-slate-50 text-slate-500 hover:border-indigo-100 hover:bg-white'}`}
                          >
                            <span className="mr-3 opacity-40">●</span> {opt}
                          </button>
                        ))}
                     </div>
                   ) : (
                     <div className="relative">
                        <input 
                          type="text"
                          placeholder="Escribe la respuesta correcta..."
                          className="w-full p-6 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] outline-none focus:border-indigo-500 focus:bg-white font-bold text-xl text-slate-700 transition-all"
                          onChange={(e) => setAnswers({...answers, [idx]: e.target.value})}
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300">⌨️</span>
                     </div>
                   )}
                </div>
              ))}
           </div>

           <button 
             onClick={() => {
               window.scrollTo(0,0);
               handleSubmitQuiz();
             }}
             className="w-full py-8 bg-emerald-500 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:-translate-y-1 active:scale-95 transition-all"
           >
             Finalizar y Calificar por IA →
           </button>
        </div>
      )}

      {step === 'result' && (
        <div className="space-y-12 animate-in fade-in duration-700">
           <div className="bg-white p-16 rounded-[5rem] text-center border border-slate-100 shadow-2xl space-y-8 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-2 flyer-gradient"></div>
              <div className="w-32 h-32 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center text-6xl mx-auto shadow-inner rotate-3">🏆</div>
              <div className="space-y-2">
                <h2 className="text-5xl font-[900] text-slate-900 tracking-tight">Resultado Final</h2>
                <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs">Análisis de Desempeño</p>
              </div>
              
              <div className="flex justify-center items-center space-x-12">
                 <div className="text-center">
                    <p className="text-7xl font-[900] text-indigo-600">{score}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Aciertos</p>
                 </div>
                 <div className="h-16 w-px bg-slate-100"></div>
                 <div className="text-center">
                    <p className="text-7xl font-[900] text-emerald-500">+{score * 10}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">XP Ganada</p>
                 </div>
              </div>

              <p className="text-slate-500 max-w-md mx-auto font-medium text-lg italic">
                {score > 15 ? "¡Excelente trabajo! Has dominado este módulo." : "Buen intento, revisa las explicaciones abajo para perfeccionar tu gramática."}
              </p>
           </div>

           <div className="space-y-8">
              <div className="flex items-center gap-4 px-4">
                 <span className="text-2xl">🧐</span>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Correcciones Detalladas</h3>
              </div>
              
              {feedback.map((f, i) => (
                <div key={i} className={`p-10 rounded-[3.5rem] border-2 transition-all ${f.isCorrect ? 'bg-emerald-50/30 border-emerald-100' : 'bg-rose-50/30 border-rose-100 shadow-xl shadow-rose-100/20'}`}>
                   <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                         <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${f.isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                            {i + 1}
                         </span>
                         <p className="font-black text-slate-800 uppercase text-xs tracking-widest">Pregunta {i + 1}</p>
                      </div>
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${f.isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {f.isCorrect ? 'Dominado' : 'Revisar'}
                      </span>
                   </div>

                   <p className="text-xl font-bold text-slate-700 mb-6 leading-tight">"{f.question}"</p>
                   
                   {!f.isCorrect && (
                     <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-4 bg-white rounded-2xl border border-rose-100">
                           <p className="text-[10px] font-black text-rose-400 uppercase mb-1">Tu respuesta</p>
                           <p className="font-bold text-rose-600">{f.userAnsw || "(Sin responder)"}</p>
                        </div>
                        <div className="p-4 bg-white rounded-2xl border border-emerald-100">
                           <p className="text-[10px] font-black text-emerald-400 uppercase mb-1">Correcta</p>
                           <p className="font-bold text-emerald-600">{f.correctAnswer}</p>
                        </div>
                     </div>
                   )}

                   <div className="p-6 bg-white/80 backdrop-blur-sm rounded-[1.5rem] border border-slate-100 text-sm font-medium text-slate-600 leading-relaxed">
                      <span className="text-indigo-600 font-black mr-2 uppercase text-[10px] tracking-widest">Feedback IA:</span> 
                      {f.explanation}
                   </div>
                </div>
              ))}
           </div>
           
           <button 
             onClick={() => navigate('/classroom')}
             className="w-full py-8 bg-slate-900 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-600 transition-all"
           >
             Volver a la Academia
           </button>
        </div>
      )}
    </div>
  );
};
