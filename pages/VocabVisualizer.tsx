
import React, { useState } from 'react';
import { generateVocabularyLesson, generateWordImage } from '../services/gemini';
import { VocabularyItem } from '../types';

export const VocabVisualizer: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [items, setItems] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState<string | null>(null);
  const [isBatchLoading, setIsBatchLoading] = useState(false);

  const fetchLesson = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setItems([]);
    try {
      const vocabList = await generateVocabularyLesson(topic);
      setItems(vocabList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadGraphic = async (word: string, index: number) => {
    setImageLoading(word);
    try {
      const url = await generateWordImage(word);
      if (url) {
        setItems(prev => {
          const next = [...prev];
          next[index] = { ...next[index], imageUrl: url };
          return next;
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setImageLoading(null);
    }
  };

  const generateAllGraphics = async () => {
    setIsBatchLoading(true);
    for (let i = 0; i < items.length; i++) {
      if (!items[i].imageUrl) {
        await loadGraphic(items[i].word, i);
      }
    }
    setIsBatchLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto pb-32 animate-in fade-in duration-700">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-2">Vocab Visualizer 🧩</h1>
          <p className="text-slate-500 font-medium text-lg">Aprende nuevas palabras con tarjetas visuales generadas por IA.</p>
        </div>
        {items.length > 0 && !isBatchLoading && (
          <button 
            onClick={generateAllGraphics}
            className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:-translate-y-1 transition-all flex items-center gap-3"
          >
            <span>Auto-generar Visuales 🎨</span>
          </button>
        )}
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 mb-16 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 w-full relative">
          <input 
            type="text"
            value={topic}
            onKeyDown={(e) => e.key === 'Enter' && fetchLesson()}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="¿Qué quieres aprender hoy? (ej. Space, Cooking, Business...)"
            className="w-full bg-slate-50 border-2 border-slate-50 outline-none px-8 py-5 rounded-2xl text-slate-700 font-bold text-lg focus:border-indigo-500 focus:bg-white transition-all"
          />
          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none text-2xl">✨</span>
        </div>
        <button 
          onClick={fetchLesson}
          disabled={loading || !topic}
          className="w-full md:w-auto bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-600 transition-all disabled:opacity-50 shadow-xl active:scale-95"
        >
          {loading ? 'Consultando IA...' : 'Generar Lista 🚀'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {items.map((item, i) => (
          <div key={i} className="bg-white rounded-[3rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col transition-all hover:shadow-2xl hover:-translate-y-2 group">
            <div className="aspect-square bg-slate-50 flex items-center justify-center relative overflow-hidden">
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.word} 
                  className="w-full h-full object-cover animate-in zoom-in duration-700" 
                />
              ) : (
                <div className="flex flex-col items-center p-10 text-center space-y-6">
                   <div className={`w-24 h-24 rounded-3xl bg-white shadow-inner flex items-center justify-center text-5xl transition-transform duration-500 ${imageLoading === item.word ? 'animate-spin' : 'group-hover:rotate-12'}`}>
                     {imageLoading === item.word ? '⚙️' : '🖼️'}
                   </div>
                   <div className="space-y-2">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sin imagen cargada</p>
                     <button 
                        onClick={() => loadGraphic(item.word, i)}
                        disabled={!!imageLoading}
                        className="text-indigo-600 text-xs font-black bg-indigo-50 px-6 py-3 rounded-xl hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50 border border-indigo-100"
                      >
                        {imageLoading === item.word ? 'Generando...' : 'Crear Visual IA'}
                      </button>
                   </div>
                </div>
              )}
              <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 shadow-sm">
                Flashcard #{i + 1}
              </div>
            </div>
            
            <div className="p-10 space-y-4">
              <h3 className="text-3xl font-black text-slate-900 capitalize tracking-tight group-hover:text-indigo-600 transition-colors">{item.word}</h3>
              <div className="p-4 bg-indigo-50/50 rounded-2xl border-l-4 border-indigo-500">
                <p className="text-sm text-indigo-700 font-bold italic leading-relaxed">
                  "{item.example}"
                </p>
              </div>
              <p className="text-slate-500 font-medium leading-relaxed">
                {item.definition}
              </p>
            </div>
          </div>
        ))}

        {loading && Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-slate-50 rounded-[3rem] aspect-[3/4] animate-pulse border-2 border-dashed border-slate-200 flex items-center justify-center">
             <span className="text-slate-300 font-black uppercase tracking-widest text-xs">Cargando datos...</span>
          </div>
        ))}

        {!loading && items.length === 0 && (
          <div className="md:col-span-3 py-32 text-center space-y-6">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-5xl mx-auto opacity-30">📚</div>
             <div className="space-y-2">
               <p className="text-2xl font-black text-slate-300 uppercase tracking-widest">Esperando tema</p>
               <p className="text-slate-400 font-medium italic">Prueba con "Modern Architecture" o "Healthy Habits"</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
