
import React, { useState, useRef } from 'react';
import { 
  Users, 
  ShieldAlert, 
  DoorOpen, 
  Car, 
  Activity,
  Maximize2,
  ShieldCheck,
  X,
  Bot,
  UserCheck,
  Loader2,
  QrCode,
  Zap,
  History,
  Lock,
  Wallet,
  Package,
  CalendarDays,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { virtualDoormanAnalysis, generateSpeech } from '../services/gemini';
import { UserRole } from '../types';

interface Decision {
  id: string;
  time: string;
  subject: string;
  type: 'face' | 'plate' | 'qr';
  action: string;
  status: 'success' | 'alert' | 'denied';
}

interface DashboardProps {
  userRole?: UserRole;
}

const Dashboard: React.FC<DashboardProps> = ({ userRole = 'admin' }) => {
  const [opening, setOpening] = useState<string | null>(null);
  const [doormanActive, setDoormanActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [decisions, setDecisions] = useState<Decision[]>([
    { id: '1', time: '14:30:12', subject: 'ABC-1234', type: 'plate', action: 'Garagem Liberada', status: 'success' },
    { id: '2', time: '14:28:45', subject: 'James Wilson', type: 'face', action: 'Pedestre Liberado', status: 'success' },
  ]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startDoorman = async () => {
    setDoormanActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720, facingMode: 'user' } 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) { alert("Câmera não disponível."); }
  };

  const processAutoPortaria = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setScanning(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    const frame = canvas.toDataURL('image/jpeg', 0.8);

    try {
      const faceHistory = "James Wilson (Morador Apto 1204)";
      const plateHistory = "ABC-1234 (Toyota Corolla - Morador 1204)";
      const result = await virtualDoormanAnalysis(frame, faceHistory, plateHistory);
      if (result.detections.length > 0) {
        const primary = result.detections[0];
        await generateSpeech(primary.greeting);
        const newDecision: Decision = {
          id: Math.random().toString(),
          time: new Date().toLocaleTimeString(),
          subject: primary.id,
          type: primary.type as any,
          action: primary.action,
          status: primary.isAuthorized ? 'success' : 'alert'
        };
        setDecisions(prev => [newDecision, ...prev.slice(0, 9)]);
      }
    } catch (err) { console.error(err); } finally { setScanning(false); }
  };

  const stopDoorman = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    setDoormanActive(false);
  };

  if (userRole === 'resident') {
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Resumo Financeiro Rápido */}
           <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl group">
              <div className="relative z-10">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Boleto deste Mês</p>
                 <h2 className="text-4xl font-black mb-1">R$ 850,40</h2>
                 <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-10 flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3" /> Pago em 05/05
                 </p>
                 <button className="flex items-center gap-2 text-xs font-bold text-blue-400 group-hover:gap-4 transition-all">
                    Ver detalhes financeiros <ChevronRight className="w-4 h-4" />
                 </button>
              </div>
              <Wallet className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 group-hover:scale-110 transition-transform" />
           </div>

           {/* Encomendas Pendentes */}
           <div className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="relative z-10">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Encomendas na Portaria</p>
                 <h2 className="text-4xl font-black text-slate-900 mb-1">02</h2>
                 <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-10">Aguardando sua retirada</p>
                 <button className="flex items-center gap-2 text-xs font-bold text-blue-600 group-hover:gap-4 transition-all">
                    Registrar retirada <ChevronRight className="w-4 h-4" />
                 </button>
              </div>
              <Package className="absolute -bottom-6 -right-6 w-32 h-32 text-slate-50 group-hover:scale-110 transition-transform" />
           </div>

           {/* Atalhos Rápidos */}
           <div className="space-y-4">
              <button className="w-full p-6 bg-white border border-slate-200 rounded-3xl flex items-center justify-between hover:border-blue-500 transition-all group">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><QrCode className="w-5 h-5" /></div>
                    <span className="font-black text-xs uppercase text-slate-700">Convidar Visitante</span>
                 </div>
                 <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
              </button>
              <button className="w-full p-6 bg-white border border-slate-200 rounded-3xl flex items-center justify-between hover:border-blue-500 transition-all group">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CalendarDays className="w-5 h-5" /></div>
                    <span className="font-black text-xs uppercase text-slate-700">Reservar Salão</span>
                 </div>
                 <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500" />
              </button>
           </div>
        </div>

        {/* FEED DE ATIVIDADE DO MORADOR */}
        <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
           <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-lg text-slate-800 uppercase tracking-tighter">Últimas Atividades</h3>
              <button className="text-[10px] font-black text-blue-600 uppercase">Ver histórico completo</button>
           </div>
           <div className="divide-y divide-slate-50">
              {[
                { action: 'Acesso via Face ID', time: 'Hoje, 08:20', details: 'Portão Principal', icon: UserCheck },
                { action: 'Entrega Recebida', time: 'Ontem, 14:10', details: 'Amazon (Pacote Médio)', icon: Package },
                { action: 'Boleto Liquidado', time: '05 Mai', details: 'Condomínio Mensal', icon: Wallet }
              ].map((item, i) => (
                <div key={i} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-colors">
                   <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center">
                         <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="font-black text-sm text-slate-800">{item.action}</p>
                         <p className="text-xs text-slate-400 font-bold uppercase">{item.details}</p>
                      </div>
                   </div>
                   <span className="text-[10px] font-black text-slate-300 uppercase">{item.time}</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    );
  }

  // ADMIN VIEW (Original Dashboard code modified slightly)
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* MODO TOTEM AUTÔNOMO FULLSCREEN */}
      {doormanActive && (
        <div className="fixed inset-0 z-[300] bg-[#020617] flex flex-col overflow-hidden font-sans">
           <header className="p-8 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-3xl">
              <div className="flex items-center gap-6">
                 <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40">
                    <Zap className="w-8 h-8 text-white animate-pulse" />
                 </div>
                 <div className="min-w-0">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter truncate">Nexus Auto-Gate</h2>
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping shrink-0" />
                       <p className="text-emerald-500 font-bold text-[10px] uppercase tracking-widest truncate">Protocolo Autônomo v4.0 Ativo</p>
                    </div>
                 </div>
              </div>
              <button onClick={stopDoorman} className="p-4 bg-white/5 text-white/40 hover:text-white rounded-2xl transition-all shrink-0"><X /></button>
           </header>

           <div className="flex-1 flex flex-col lg:flex-row p-6 gap-6 overflow-hidden">
              <div className="flex-[1.5] bg-black rounded-[48px] overflow-hidden relative border-4 border-white/5 shadow-inner min-h-[400px]">
                 <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1] opacity-60" />
                 <canvas ref={canvasRef} className="hidden" />
                 
                 <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                    <div className={`w-[60%] h-[40%] border-2 border-blue-500/30 rounded-3xl relative transition-all duration-500 ${scanning ? 'bg-blue-500/10 scale-105' : ''}`}>
                       <div className={`absolute left-0 right-0 h-0.5 bg-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.8)] transition-all duration-[2000ms] ease-in-out ${scanning ? 'top-full' : 'top-0'}`} />
                    </div>
                 </div>

                 <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-xs px-4">
                    <button onClick={processAutoPortaria} disabled={scanning} className="w-full py-6 bg-blue-600 text-white rounded-[32px] font-black text-xl shadow-2xl shadow-blue-500/40 active:scale-95 transition-all">
                       {scanning ? 'PROCESSANDO...' : 'INICIAR SCAN'}
                    </button>
                 </div>
              </div>

              <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                 <div className="bg-white/5 backdrop-blur-3xl rounded-[40px] border border-white/10 flex-1 flex flex-col p-8 overflow-hidden">
                    <div className="flex items-center justify-between mb-8 shrink-0">
                       <h3 className="text-white/40 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                          <History className="w-4 h-4" /> Registro de Decisões IA
                       </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
                       {decisions.map(decision => (
                         <div key={decision.id} className="p-5 bg-white/5 border border-white/5 rounded-3xl flex items-center gap-5 group hover:bg-white/10 transition-all">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${decision.status === 'success' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'}`}>
                               {decision.type === 'face' ? <UserCheck className="w-6 h-6" /> : decision.type === 'plate' ? <Car className="w-6 h-6" /> : <QrCode className="w-6 h-6" />}
                            </div>
                            <div className="flex-1 min-w-0">
                               <p className="text-white font-bold text-sm truncate">{decision.subject}</p>
                               <p className={`text-[10px] font-black uppercase tracking-tighter truncate ${decision.status === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>{decision.action}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
         <div className="xl:col-span-3 bg-slate-900 rounded-[48px] p-10 border border-slate-800 shadow-2xl relative group overflow-hidden">
            <div className="flex items-center justify-between mb-8 relative z-10">
               <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl"><ShieldCheck className="w-7 h-7" /></div>
                  <div>
                     <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Nexus Control</h2>
                     <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Monitoramento Admin</p>
                  </div>
               </div>
               <button onClick={startDoorman} className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-xs uppercase transition-all flex items-center gap-3 border border-white/5">
                  <Maximize2 className="w-4 h-4" /> Abrir Totem
               </button>
            </div>
            <div className="aspect-video bg-slate-800 rounded-[40px] overflow-hidden relative border border-slate-700">
               <img src="https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000" alt="CCTV" />
            </div>
         </div>

         <div className="bg-white rounded-[48px] p-10 border border-slate-100 shadow-xl flex flex-col">
            <h3 className="text-slate-900 font-black mb-10 flex items-center gap-4 uppercase tracking-tighter text-lg"><Lock className="w-6 h-6 text-blue-600" /> Bypass Manual</h3>
            <div className="space-y-4 flex-1">
               <button onClick={() => setOpening('gate1')} className="w-full p-8 rounded-[32px] border-2 bg-slate-50 border-transparent hover:border-blue-500 transition-all flex items-center gap-6">
                  <div className="p-4 bg-white rounded-2xl shrink-0 shadow-sm"><DoorOpen className="w-6 h-6" /></div>
                  <div className="text-left"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pedestre 01</p><p className="text-lg font-black text-slate-800">LIBERAR</p></div>
               </button>
               <button onClick={() => setOpening('car1')} className="w-full p-8 rounded-[32px] border-2 bg-slate-50 border-transparent hover:border-blue-500 transition-all flex items-center gap-6">
                  <div className="p-4 bg-white rounded-2xl shrink-0 shadow-sm"><Car className="w-6 h-6" /></div>
                  <div className="text-left"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Garagem G1</p><p className="text-lg font-black text-slate-800">LIBERAR</p></div>
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
