
import React, { useState, useRef } from 'react';
import { getGeminiClient, encode, decode, decodeAudioData } from '../services/gemini';
import { Modality, LiveServerMessage } from '@google/genai';

export const LiveLab: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcript, setTranscript] = useState<{ role: string, text: string }[]>([]);
  const [status, setStatus] = useState<string>('Esperando micrófono...');
  const [isTutorSpeaking, setIsTutorSpeaking] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

  const initAudio = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    }
    if (!outputAudioContextRef.current) {
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    
    // Resume contexts to bypass browser autoplay restrictions
    if (audioContextRef.current.state === 'suspended') await audioContextRef.current.resume();
    if (outputAudioContextRef.current.state === 'suspended') await outputAudioContextRef.current.resume();
  };

  const startConversation = async () => {
    try {
      setStatus('Sincronizando con Kore...');
      await initAudio();
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const ai = getGeminiClient();
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: 'You are Kore, a brilliant and empathetic English tutor. You help the user gain fluency by having natural, engaging conversations. Correct their grammar only when necessary and provide 1-2 advanced synonyms for basic words they use. Keep responses concise.',
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setStatus('Conexión En Vivo');
            
            const inputCtx = audioContextRef.current!;
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              if (!isActive) return;
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              
              sessionPromise.then(s => {
                if (s) s.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.serverContent?.outputTranscription) {
              const text = msg.serverContent.outputTranscription.text;
              setTranscript(prev => [...prev, { role: 'Kore', text }]);
            } else if (msg.serverContent?.inputTranscription) {
              const text = msg.serverContent.inputTranscription.text;
              setTranscript(prev => [...prev, { role: 'Tú', text }]);
            }

            const base64Audio = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
              setIsTutorSpeaking(true);
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsTutorSpeaking(false);
              });

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }
          },
          onerror: (e) => {
            setStatus('Error de conexión');
            setIsActive(false);
          },
          onclose: () => {
            setIsActive(false);
            setStatus('Sesión terminada');
          }
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('Error al iniciar');
    }
  };

  const stopConversation = () => {
    if (sessionRef.current) sessionRef.current.close();
    if (micStreamRef.current) micStreamRef.current.getTracks().forEach(t => t.stop());
    setIsActive(false);
    setStatus('Sesión finalizada');
    setIsTutorSpeaking(false);
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between">
         <h1 className="text-4xl font-black text-slate-900 tracking-tight">AI Voice Lab 🎙️</h1>
         <div className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-indigo-100">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Real-time Native Voice
         </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 flex-1 min-h-[600px]">
        {/* Avatar & Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-2xl flex flex-col items-center text-center relative overflow-hidden h-full justify-center">
            <div className={`absolute inset-0 flyer-gradient opacity-0 transition-opacity duration-1000 ${isActive ? 'opacity-5' : ''}`}></div>
            
            <div className="relative z-10 space-y-10 w-full">
              <div className={`relative mx-auto w-56 h-56 transition-all duration-1000 ${isActive ? 'scale-110' : ''}`}>
                 {isActive && <div className="absolute inset-0 bg-indigo-400 rounded-full animate-ping opacity-10"></div>}
                 {isActive && <div className="absolute inset-0 bg-indigo-400 rounded-full animate-ping opacity-5" style={{animationDelay: '1s'}}></div>}
                 <div className={`w-full h-full rounded-full flex items-center justify-center text-8xl shadow-2xl transition-all duration-700 relative z-20 ${isActive ? 'bg-indigo-600 ring-[12px] ring-indigo-50 shadow-indigo-200 rotate-0' : 'bg-slate-50 rotate-[-5deg]'}`}>
                   {isActive ? '🧑‍🏫' : '💤'}
                 </div>
              </div>
              
              <div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">Tutor Kore</h2>
                <div className="flex items-center justify-center">
                  <span className={`w-3 h-3 rounded-full mr-3 ${isActive ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 'bg-slate-300'}`}></span>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{status}</span>
                </div>
              </div>

              {isActive && (
                <div className="flex items-center justify-center gap-1.5 h-16">
                  {[...Array(15)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1.5 rounded-full transition-all duration-150 ${isTutorSpeaking ? 'bg-indigo-600 animate-bounce' : 'bg-slate-200 h-2'}`}
                      style={{ 
                        height: isTutorSpeaking ? `${20 + Math.random() * 80}%` : '8px',
                        animationDelay: `${i * 0.1}s` 
                      }}
                    ></div>
                  ))}
                </div>
              )}

              <button 
                onClick={isActive ? stopConversation : startConversation}
                className={`w-full py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 ${isActive ? 'bg-rose-500 text-white shadow-rose-100 hover:bg-rose-600' : 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700'}`}
              >
                {isActive ? 'Finalizar Sesión' : 'Iniciar Conversación'}
              </button>
            </div>
          </div>
        </div>

        {/* Transcript Area */}
        <div className="lg:col-span-7 bg-white rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col">
          <div className="px-10 py-8 border-b border-slate-50 bg-slate-50/40 flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chat Contextual</span>
            <div className="flex space-x-1">
               <div className="w-1.5 h-1.5 rounded-full bg-indigo-300"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-indigo-200"></div>
            </div>
          </div>
          
          <div className="flex-1 p-10 overflow-y-auto space-y-8 max-h-[600px] scroll-smooth">
            {transcript.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-6">
                <span className="text-9xl">💬</span>
                <p className="text-sm font-black uppercase tracking-[0.3em]">Habla para comenzar</p>
              </div>
            ) : (
              transcript.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'Tú' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4`}>
                  <div className={`max-w-[80%] px-8 py-5 rounded-[2.5rem] shadow-sm ${m.role === 'Tú' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'}`}>
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${m.role === 'Tú' ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {m.role}
                    </p>
                    <p className="text-md font-bold leading-relaxed">{m.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
