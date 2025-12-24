import React, { useState, useRef } from 'react';
import { getGeminiClient, encode, decode, decodeAudioData } from '../services/gemini';
import { Modality, LiveServerMessage } from '@google/genai';

interface Message {
  role: string;
  text: string;
}

export const LiveLab: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<string>('Tutor Listo');
  const [transcript, setTranscript] = useState<Message[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sessionRef = useRef<any>(null);

  const startTutor = async () => {
    try {
      setStatus('Conectando con Kore...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      if (!audioContextRef.current) audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      if (!outputAudioContextRef.current) outputAudioContextRef.current = new AudioContext({ sampleRate: 24000 });

      const ai = getGeminiClient();
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          systemInstruction: 'You are Kore, a friendly British English tutor. Engage the user in a natural conversation.',
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setStatus('En Vivo');
            if (audioContextRef.current) {
              const source = audioContextRef.current.createMediaStreamSource(stream);
              const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
              processor.onaudioprocess = (e) => {
                const input = e.inputBuffer.getChannelData(0);
                const int16 = new Int16Array(input.length);
                for (let i = 0; i < input.length; i++) int16[i] = input[i] * 32768;
                sessionPromise.then(s => s.sendRealtimeInput({ 
                  media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } 
                }));
              };
              source.connect(processor);
              processor.connect(audioContextRef.current.destination);
            }
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.serverContent?.outputTranscription) {
               const textStr = msg.serverContent.outputTranscription.text || "";
               setTranscript(p => [...p, { role: 'Kore', text: textStr }]);
            }
            if (msg.serverContent?.inputTranscription) {
               const textStr = msg.serverContent.inputTranscription.text || "";
               setTranscript(p => [...p, { role: 'Tú', text: textStr }]);
            }

            const modelTurn = msg.serverContent?.modelTurn;
            const audioPart = modelTurn?.parts?.[0]?.inlineData?.data;
            
            if (audioPart && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(audioPart), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
            }
          }
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (e) {
      setStatus('Error de Micrófono');
    }
  };

  const stopTutor = () => {
    sessionRef.current?.close();
    setIsActive(false);
    setStatus('Sesión Terminada');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-[4rem] p-12 border border-slate-100 shadow-2xl flex flex-col items-center text-center">
         <div className={`w-40 h-40 rounded-full flex items-center justify-center text-7xl mb-8 transition-all duration-700 ${isActive ? 'bg-indigo-600 scale-110 shadow-2xl shadow-indigo-200' : 'bg-slate-100 grayscale'}`}>
            {isActive ? '🧑‍🏫' : '💤'}
         </div>
         <h2 className="text-3xl font-black text-slate-900 mb-2">Tutor Kore IA</h2>
         <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-10">{status}</p>
         
         <button 
           onClick={isActive ? stopTutor : startTutor}
           className={`w-full py-6 rounded-3xl font-black text-sm uppercase tracking-widest transition-all ${isActive ? 'bg-rose-500 text-white shadow-rose-100' : 'bg-indigo-600 text-white shadow-indigo-100 hover:scale-105'}`}
         >
           {isActive ? 'Detener Clase' : 'Hablar con el Tutor 🎙️'}
         </button>
      </div>

      <div className="bg-slate-50 rounded-[3rem] p-10 min-h-[300px] border border-slate-100 space-y-6">
        {transcript.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'Tú' ? 'justify-end' : 'justify-start'}`}>
             <div className={`max-w-[80%] p-6 rounded-3xl font-bold ${m.role === 'Tú' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none shadow-sm'}`}>
                <p className="text-[10px] opacity-60 uppercase mb-2">{m.role}</p>
                <p>{m.text}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};
