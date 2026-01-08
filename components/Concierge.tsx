
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Image as ImageIcon, 
  Mic, 
  Bot,
  User,
  Paperclip,
  Trash2,
  XCircle,
  Volume2
} from 'lucide-react';
import { Message } from '../types';
import { chatWithConcierge, generateSpeech } from '../services/gemini';

const Concierge: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Olá! Sou o Nexus, seu concierge virtual. Como posso ajudar hoje? Você pode perguntar sobre regras do condomínio, áreas comuns ou carregar uma foto de uma etiqueta.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachment, setAttachment] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!input.trim() && !attachment) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      attachment: attachment || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setAttachment(null);
    setIsLoading(true);

    try {
      const history = messages.slice(-6).map(m => ({
        role: m.role === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: m.content }]
      }));

      const responseText = await chatWithConcierge(userMessage.content, history, userMessage.attachment?.split(',')[1]);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText || "Desculpe, não consegui processar essa solicitação.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeech = (text: string) => {
    generateSpeech(text);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAttachment(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-in zoom-in-95">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tighter uppercase">
            <Sparkles className="text-blue-500 w-7 h-7" /> Nexus IA
          </h2>
          <p className="text-slate-500 text-sm">Concierge multimodal de luxo</p>
        </div>
        <button onClick={() => setMessages([messages[0]])} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-rose-500 rounded-2xl transition-all shadow-sm">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 bg-white rounded-[40px] shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 bg-slate-50/20 custom-scrollbar">
          {messages.map((m) => (
            <div key={m.id} className={`flex items-start gap-6 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${m.role === 'assistant' ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 border border-slate-200'}`}>
                {m.role === 'assistant' ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
              </div>
              <div className={`flex flex-col max-w-[75%] ${m.role === 'user' ? 'items-end' : ''}`}>
                <div className={`p-6 rounded-[24px] text-sm leading-relaxed shadow-sm group relative ${m.role === 'assistant' ? 'bg-white border border-slate-100 text-slate-800 rounded-tl-none' : 'bg-slate-900 text-white rounded-tr-none'}`}>
                  {m.attachment && <img src={m.attachment} className="mb-4 rounded-xl max-h-64 object-cover w-full" />}
                  <p>{m.content}</p>
                  
                  {m.role === 'assistant' && (
                    <button 
                      onClick={() => handleSpeech(m.content)}
                      className="absolute -right-4 top-0 p-2 bg-blue-100 text-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 font-black mt-2 px-2 uppercase tracking-widest">
                  {m.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center animate-pulse"><Bot className="w-6 h-6" /></div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"><div className="flex gap-2"><div className="w-2 h-2 bg-blue-200 rounded-full animate-bounce" /><div className="w-2 h-2 bg-blue-200 rounded-full animate-bounce [animation-delay:-0.15s]" /><div className="w-2 h-2 bg-blue-200 rounded-full animate-bounce [animation-delay:-0.3s]" /></div></div>
            </div>
          )}
        </div>

        <div className="p-8 bg-white border-t border-slate-100">
          <form onSubmit={handleSendMessage} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <input 
                  type="text" value={input} onChange={(e) => setInput(e.target.value)}
                  placeholder="Olá Nexus, em que pode me ajudar?"
                  className="w-full pl-6 pr-14 py-5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-3xl outline-none text-sm font-medium transition-all"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                   <input type="file" id="attach" className="hidden" accept="image/*" onChange={handleFileChange} />
                   <label htmlFor="attach" className="p-2 text-slate-400 hover:text-blue-500 transition-colors cursor-pointer"><Paperclip className="w-6 h-6" /></label>
                </div>
              </div>
              <button type="submit" disabled={(!input.trim() && !attachment) || isLoading} className="bg-blue-600 text-white p-5 rounded-3xl hover:bg-blue-700 disabled:opacity-50 shadow-2xl shadow-blue-500/30 transition-all active:scale-95">
                <Send className="w-6 h-6" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Concierge;
