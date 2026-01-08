
import { GoogleGenAI, Type, Modality } from "@google/genai";

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const generateSpeech = async (text: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return;

    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const audioBuffer = await decodeAudioData(decode(base64Audio), audioCtx, 24000, 1);
    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start();
  } catch (e) {
    console.error("Erro TTS:", e);
  }
};

export const virtualDoormanAnalysis = async (imageBase64: string, history: string, vehicleHistory: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, '').trim();

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: cleanBase64, mimeType: 'image/jpeg' } },
        { text: `SISTEMA DE PORTARIA AUTÔNOMA NEXUS.
        Analise a imagem em busca de 3 modais de segurança:
        1. ROSTOS: Compare com o histórico de moradores: ${history}.
        2. PLACAS DE VEÍCULOS: Compare com a lista de veículos autorizados: ${vehicleHistory}.
        3. QR CODES: Identifique se há um QR Code visível.
        
        Para cada item detectado:
        - Classifique o tipo (FACE, PLATE, QR).
        - Determine se é AUTORIZADO ou DESCONHECIDO.
        - Se for Morador (Face ou Placa), gere uma saudação proativa confirmando a abertura.
        - Se for Entregador/Visitante, peça identificação ou remoção de capacete.
        
        Prioridade Total: MORADORES têm abertura imediata e saudação personalizada.
        Retorne um JSON estruturado com uma lista de 'detections' e 'decisions'.` }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          detections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, description: 'face, plate, qr' },
                id: { type: Type.STRING, description: 'Nome, Número da Placa ou Conteúdo do QR' },
                isAuthorized: { type: Type.BOOLEAN },
                persona: { type: Type.STRING },
                greeting: { type: Type.STRING },
                action: { type: Type.STRING, description: 'open_pedestrian, open_garage, request_id, alert_security' }
              },
              required: ["type", "id", "isAuthorized", "greeting", "action"]
            }
          },
          summary: { type: Type.STRING }
        },
        required: ["detections"]
      }
    }
  });

  return JSON.parse(response.text || '{"detections": []}');
};

export const parseIDCard = async (imageBase64: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, '').trim();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: cleanBase64, mimeType: 'image/jpeg' } },
        { text: "Extraia o nome completo deste documento de identificação." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: { name: { type: Type.STRING } },
        required: ["name"]
      }
    }
  });
  return JSON.parse(response.text || '{"name": "Desconhecido"}');
};

export const chatWithConcierge = async (prompt: string, history: any[], imageBase64?: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const contents = history.map(h => ({ role: h.role, parts: h.parts }));
  const currentParts: any[] = [{ text: prompt }];
  if (imageBase64) {
    const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, '').trim();
    currentParts.push({ inlineData: { data: cleanBase64, mimeType: 'image/jpeg' } });
  }
  contents.push({ role: 'user', parts: currentParts });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: contents,
    config: {
      systemInstruction: "Você é o Nexus, o cérebro de uma portaria 100% autônoma.",
    }
  });
  return response.text || "Desculpe, não consegui entender.";
};
