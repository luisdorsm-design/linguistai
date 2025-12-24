import React, { useState } from 'react';
import { generateVocabularyLesson, generateWordImage } from '../services/gemini';
import { VocabularyItem } from '../types';

export const VocabVisualizer: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [items, setItems] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState<string | null>(null);

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

  return (
    <div className="max-w-7xl mx-auto pb-32 animate-in fade-in duration-700">
      <div className="mb-16">
        <h1 className="text-7xl font-black text-slate-900 tracking-tighter italic mb-4">Visual Lab 🎨</h1>
        <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
          Usa el poder de la IA para visualizar conceptos. Memoriza un <span className="text-indigo-600 font-bold">40% más rápido</span> asociando palabras con arte único generado al instante.
        </p>
      </div>

      <div className="bg-white p-8 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 mb-20 flex flex-col md:flex-row items-center gap-8 group">
        <div className="flex-1 w-full relative">
          <input 
            type="text"
            value={topic}
            onKeyDown={(e) => e.key === 'Enter' && fetchLesson()}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Introduce un tema (ej: Space Exploration, Jungle Animals...)"
            className="w-full bg-slate-50 border-2 border-slate-50 outline-none px-10 py-6 rounded-3xl text-slate-700 font-bold text-xl focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
          />
          <span className="absolute right-8 top-1/2 -translate-y-1/2 text-3xl opacity-20 group-hover:opacity-100 transition-opacity">🖼️</span>
        </div>
        <button 
          onClick={fetchLesson}
          disabled={loading || !topic}
          className="w-full md:w-auto bg-slate-900 text-white px-16 py-6 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-indigo-600 transition-all disabled:opacity-50 shadow-2xl active:scale-95 flex items-center justify-center gap-3"
        >
          {loading ? (
            <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : 'Generar Vocabulario 🚀'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {items.map((item, i) => (
          <div key={i} className="bg-white rounded-[4rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col transition-all hover:shadow-2xl hover:-translate-y-2 group h-full">
            <div className="aspect-square bg-slate-50 flex items-center justify-center relative overflow-hidden">
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.word} 
                  className="w-full h-full object-cover animate-in zoom-in duration-1000" 
                />
              ) : (
                <div className="flex flex-col items-center p-12 text-center space-y-8">
                   <div className={`w-32 h-32 rounded-[2rem] bg-white shadow-xl flex items-center justify-center text-6xl transition-all duration-700 ${imageLoading === item.word ? 'animate-spin scale-110 shadow-indigo-100' : 'group-hover:rotate-6'}`}>
                     {imageLoading === item.word ? '⚙️' : '🖼️'}
                   </div>
                   <button 
                      onClick={() => loadGraphic(item.word, i)}
                      disabled={!!imageLoading}
                      className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-10 py-4 rounded-2xl hover:bg-slate-900 transition-all disabled:opacity-50 shadow-xl shadow-indigo-100"
                    >
                      {imageLoading === item.word ? 'Creando arte...' : 'Generar Imagen con IA'}
                    </button>
                </div>
              )}
              <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-sm border border-white">
                IA GENERATED
              </div>
            </div>
            
            <div className="p-12 space-y-6 flex-1">
              <h3 className="text-4xl font-black text-slate-900 capitalize tracking-tighter group-hover:text-indigo-600 transition-colors">
                {item.word}
              </h3>
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 italic font-medium text-slate-600 leading-relaxed relative">
                <span className="absolute -top-3 left-6 px-3 py-1 bg-white border border-slate-100 rounded-full text-[8px] font-black text-slate-400">EJEMPLO</span>
                "{item.example}"
              </div>
              <p className="text-slate-400 font-bold text-sm leading-relaxed">
                {item.definition}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
