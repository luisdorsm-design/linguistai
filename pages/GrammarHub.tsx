
import React, { useState } from 'react';
import { generateGrammarFeedback } from '../services/gemini';

export const GrammarHub: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCheck = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const data = await generateGrammarFeedback(input);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Grammar AI Coach</h1>
        <p className="text-slate-500">Perfect your writing with intelligent feedback and explanations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Draft your text</label>
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="E.g., I has been go to school yesterday..."
              className="w-full h-48 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none text-slate-700"
            />
            <button 
              onClick={handleCheck}
              disabled={loading || !input}
              className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Check Grammar</span>
                  <span>🔍</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm min-h-[400px]">
          {result ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Corrected Version</h3>
                <div className="p-4 bg-green-50 border border-green-100 rounded-xl text-green-800 leading-relaxed italic">
                  "{result.correctedText}"
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Why? (Explanations)</h3>
                <ul className="space-y-2">
                  {result.explanations.map((e: string, i: number) => (
                    <li key={i} className="flex items-start text-sm text-slate-600">
                      <span className="text-indigo-500 mr-2 mt-0.5">•</span>
                      {e}
                    </li>
                  ))}
                </ul>
              </div>

              {result.usageExamples?.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Usage Examples</h3>
                  <div className="space-y-2">
                    {result.usageExamples.map((ex: string, i: number) => (
                      <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-700 border-l-4 border-l-indigo-400">
                        {ex}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.suggestions?.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Style Tips</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.suggestions.map((s: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-60">
              <span className="text-6xl mb-4">🪄</span>
              <p className="text-center px-8">Analysis will appear here after you click check.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
