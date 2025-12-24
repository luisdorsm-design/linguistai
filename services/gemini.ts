
import { GoogleGenAI, Type, Modality } from "@google/genai";

// Inicializamos el cliente. Vite inyectará process.env.API_KEY si está en el .env
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Utilidades para audio y base64
export const encode = (bytes: Uint8Array) => {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
};

export const decode = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
};

export const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
};

export const getGeminiClient = () => getAI();

// Generador de lecciones profundas
export const generateFullLesson = async (topic: string, level: string, context: string = "") => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Actúa como un profesor de inglés experto. Crea una lección completa sobre "${topic}" para nivel ${level}. ${context}. Responde solo en JSON.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          theory: { type: Type.STRING },
          quiz: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.STRING },
                explanation: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

// Evaluador de entrevistas STAR
export const evaluateInterviewAnswer = async (jobRole: string, question: string, answer: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Job: ${jobRole}. Question: ${question}. Answer: ${answer}. Evalua usando STAR. JSON.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          feedback: { type: Type.STRING },
          betterVersion: { type: Type.STRING },
          nextQuestion: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

// IA de Voz (TTS)
export const speakText = async (text: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
      },
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.start();
    }
  } catch (e) { console.error("TTS Error", e); }
};

// Otras funciones necesarias para componentes
export const generateGrammarFeedback = async (text: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Correct this English text: "${text}". JSON.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          correctedText: { type: Type.STRING },
          explanations: { type: Type.ARRAY, items: { type: Type.STRING } },
          usageExamples: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const generateVocabularyLesson = async (topic: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Vocab for "${topic}". JSON array of {word, definition, example}.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            definition: { type: Type.STRING },
            example: { type: Type.STRING }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || '[]');
};

export const generateWordImage = async (word: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: `High quality educational illustration of the word: ${word}.` }] },
  });
  const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  return part ? `data:image/png;base64,${part.inlineData.data}` : null;
};

export const generateScenarioExercise = async (level: string, scenario: string, culture: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Create scenario: ${scenario} in ${culture} for ${level}. JSON.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctAnswer: { type: Type.INTEGER },
          explanation: { type: Type.STRING },
          culturalInsight: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};
