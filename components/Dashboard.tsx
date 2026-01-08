
import React, { useState, useRef, useEffect } from 'react';
import { 
  Users, 
  PackageCheck, 
  ShieldAlert, 
  DoorOpen, 
  Car, 
  PhoneCall, 
  Activity,
  Maximize2,
  ShieldCheck,
  ScanEye,
  X,
  Bot,
  UserCheck,
  Truck,
  Loader2,
  QrCode,
  Zap,
  History,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Search
} from 'lucide-react';
import { virtualDoormanAnalysis, generateSpeech } from '../services/gemini';

interface Decision {
  id: string;
  time: string;
  subject: string;
  type: 'face' | 'plate' | 'qr';
  action: string;
  status: 'success' | 'alert' | 'denied';
}

const Dashboard: React.FC = () => {
  const [opening, setOpening] = useState<string | null>(null);
  const [doormanActive, setDoormanActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [decisions, setDecisions] = useState<Decision[]>([
    { id: '1', time: '14:30:12', subject: 'ABC-1234', type: 'plate', action: 'Garagem Liberada', status: 'success' },
    { id: '2', time: '14:28:45', subject: 'James Wilson', type: 'face', action: 'Pedestre Liberado', status: 'success' },
    { id: '3', time: '14:25:00', subject: 'QR-INVITE-X', type: 'qr', action: 'Acesso Negado (Expirado)', status: 'denied' },
  ]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startDoorman = async () => {
    // Tenta reativar o Wake Lock via interação do usuário
    if ('wakeLock' in navigator) {
      try { await (navigator as any).wakeLock.request('screen'); } catch (e) {}
    }
    
    setDoormanActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720, facingMode: 'user' } 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Câmera não disponível.");
    }
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
      const faceHistory = "James Wilson (Morador Apto 1204), Maria (Moradora Apto 402)";
      const plateHistory = "ABC-1234 (Toyota Corolla - Morador 1204), XYZ-9988 (Civic - Morador 0501)";
      
      const result = await virtualDoormanAnalysis(frame, faceHistory, plateHistory);
      
      if (result.detections.length > 0) {
        const primary = result.detections[0];
        await generateSpeech(primary.greeting);

        if (primary.action === 'open_pedestrian' || primary.persona === 'resident') {
          handleOpenGate('gate1');
        } else if (primary.action === 'open_garage' || primary.type === 'plate') {
          handleOpenGate('car1');
        }

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

    } catch (err) {
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  const handleOpenGate = (gate: string) => {
    setOpening(gate);
    setTimeout(() => setOpening(null), 3000);
  };

  const stopDoorman = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    setDoormanActive(false);
  };

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
              {/* VISÃO COMPUTACIONAL */}
              <div className="flex-[1.5] bg-black rounded-[48px] overflow-hidden relative border-4 border-white/5 shadow-inner min-h-[400px]">
                 <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1] opacity-60" />
                 <canvas ref={canvasRef} className="hidden" />
                 
                 <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                    <div className={`w-[60%] h-[40%] border-2 border-blue-500/30 rounded-3xl relative transition-all duration-500 ${scanning ? 'bg-blue-500/10 scale-105' : ''}`}>
                       <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-xl" />
                       <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-xl" />
                       <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-xl" />
                       <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-xl" />
                       <div className={`absolute left-0 right-0 h-0.5 bg-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.8)] transition-all duration-[2000ms] ease-in-out ${scanning ? 'top-full' : 'top-0'}`} />
                    </div>
                    <div className="mt-8 px-6 py-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full">
                       <p className="text-white/50 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                          <Activity className="w-3 h-3 text-blue-500" /> Detecção Multimodal: Face • Placa • QR
                       </p>
                    </div>
                 </div>

                 <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-xs px-4">
                    <button 
                       onClick={processAutoPortaria}
                       disabled={scanning}
                       className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-[32px] font-black text-xl shadow-2xl shadow-blue-500/40 active:scale-95 transition-all disabled:opacity-50"
                    >
                       {scanning ? 'PROCESSANDO...' : 'INICIAR SCAN'}
                    </button>
                 </div>
              </div>

              {/* LOG DE DECISÕES DA IA */}
              <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                 <div className="bg-white/5 backdrop-blur-3xl rounded-[40px] border border-white/10 flex-1 flex flex-col p-8 overflow-hidden">
                    <div className="flex items-center justify-between mb-8 shrink-0">
                       <h3 className="text-white/40 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                          <History className="w-4 h-4" /> Registro de Decisões IA
                       </h3>
                       <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-md text-[8px] font-black uppercase">Tempo Real</span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
                       {decisions.map(decision => (
                         <div key={decision.id} className="p-5 bg-white/5 border border-white/5 rounded-3xl flex items-center gap-5 group hover:bg-white/10 transition-all">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                              decision.status === 'success' ? 'bg-emerald-500/20 text-emerald-500' :
                              decision.status === 'denied' ? 'bg-rose-500/20 text-rose-500' : 'bg-orange-500/20 text-orange-500'
                            }`}>
                               {decision.type === 'face' ? <UserCheck className="w-6 h-6" /> : 
                                decision.type === 'plate' ? <Car className="w-6 h-6" /> : <QrCode className="w-6 h-6" />}
                            </div>
                            <div className="flex-1 min-w-0">
                               <div className="flex items-center justify-between gap-2">
                                  <p className="text-white font-bold text-sm truncate">{decision.subject}</p>
                                  <span className="text-[10px] text-white/20 font-mono shrink-0">{decision.time}</span>
                               </div>
                               <p className={`text-[10px] font-black uppercase tracking-tighter truncate ${
                                 decision.status === 'success' ? 'text-emerald-400' : 'text-rose-400'
                               }`}>{decision.action}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 shrink-0">
                    <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-[32px]">
                       <p className="text-[10px] font-black text-emerald-500 uppercase mb-1">Pedestre 01</p>
                       <p className="text-white font-bold">FECHADO</p>
                    </div>
                    <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-[32px]">
                       <p className="text-[10px] font-black text-blue-500 uppercase mb-1">Garagem G1</p>
                       <p className="text-white font-bold">FECHADO</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* PAINEL DE CONTROLE ADMINISTRATIVO (HUMANO) */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
         
         {/* MONITORAMENTO CFTV COM OVERLAY IA */}
         <div className="xl:col-span-3 bg-slate-900 rounded-[48px] p-8 sm:p-10 border border-slate-800 shadow-2xl relative group overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 relative z-10 gap-6">
               <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl shrink-0">
                     <ShieldCheck className="w-7 h-7" />
                  </div>
                  <div className="min-w-0">
                     <h2 className="text-2xl font-black text-white uppercase tracking-tighter truncate">Nexus Control</h2>
                     <p className="text-slate-500 text-xs font-bold uppercase tracking-widest truncate">Monitoramento Autônomo Ativo</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="hidden md:flex flex-col items-end shrink-0">
                     <span className="text-[10px] font-black text-slate-500 uppercase">Status Global</span>
                     <span className="text-emerald-500 font-black text-xs uppercase animate-pulse">Sistema Seguro</span>
                  </div>
                  <button onClick={startDoorman} className="flex-1 sm:flex-none px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-xs uppercase transition-all flex items-center justify-center gap-3 whitespace-nowrap shrink-0 border border-white/5">
                     <Maximize2 className="w-4 h-4" /> Abrir Totem
                  </button>
               </div>
            </div>

            <div className="aspect-video bg-slate-800 rounded-[40px] overflow-hidden relative border border-slate-700">
               <img src="https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000" alt="CCTV" />
               
               <div className="absolute top-1/4 left-1/4 w-[15%] h-[25%] border-2 border-emerald-500/50 rounded-lg flex flex-col items-center">
                  <span className="bg-emerald-500 text-white text-[8px] font-black px-1 rounded -mt-2 whitespace-nowrap">FACE DETECTED</span>
               </div>
               <div className="absolute bottom-1/3 right-1/4 w-[20%] h-[8%] border-2 border-blue-500/50 rounded-lg flex flex-col items-center">
                  <span className="bg-blue-500 text-white text-[8px] font-black px-1 rounded -mt-2 whitespace-nowrap">PLATE: ABC-1234</span>
               </div>

               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 sm:p-10">
                  <div className="flex flex-wrap gap-4">
                     <div className="bg-black/60 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
                        <p className="text-[10px] text-white/40 font-black uppercase mb-1">Câmera Principal</p>
                        <p className="text-sm text-white font-bold">Portão Pedestre 01</p>
                     </div>
                     <div className="bg-black/60 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
                        <p className="text-[10px] text-white/40 font-black uppercase mb-1">Câmera Veicular</p>
                        <p className="text-sm text-white font-bold">Entrada Garagem G1</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* CONTROLES DE SEGURANÇA (BACKUP HUMANO) */}
         <div className="bg-white rounded-[48px] p-8 sm:p-10 border border-slate-100 shadow-xl flex flex-col">
            <h3 className="text-slate-900 font-black mb-10 flex items-center gap-4 uppercase tracking-tighter text-lg">
               <Lock className="w-6 h-6 text-blue-600" /> Bypass Manual
            </h3>

            <div className="space-y-4 flex-1">
               <button 
                  onClick={() => handleOpenGate('gate1')}
                  disabled={opening === 'gate1'}
                  className={`w-full p-8 rounded-[32px] border-2 transition-all flex items-center gap-6 group ${
                    opening === 'gate1' ? 'bg-emerald-50 border-emerald-500' : 'bg-slate-50 border-transparent hover:border-blue-500'
                  }`}
               >
                  <div className={`p-4 rounded-2xl shrink-0 ${opening === 'gate1' ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 shadow-sm'} group-hover:scale-110 transition-all`}>
                     <DoorOpen className="w-6 h-6" />
                  </div>
                  <div className="text-left min-w-0">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">Pedestre 01</p>
                     <p className="text-lg font-black text-slate-800 truncate">{opening === 'gate1' ? 'ABRINDO...' : 'LIBERAR'}</p>
                  </div>
               </button>

               <button 
                  onClick={() => handleOpenGate('car1')}
                  disabled={opening === 'car1'}
                  className={`w-full p-8 rounded-[32px] border-2 transition-all flex items-center gap-6 group ${
                    opening === 'car1' ? 'bg-blue-50 border-blue-500' : 'bg-slate-50 border-transparent hover:border-blue-500'
                  }`}
               >
                  <div className={`p-4 rounded-2xl shrink-0 ${opening === 'car1' ? 'bg-blue-500 text-white' : 'bg-white text-slate-400 shadow-sm'} group-hover:scale-110 transition-all`}>
                     <Car className="w-6 h-6" />
                  </div>
                  <div className="text-left min-w-0">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">Garagem G1</p>
                     <p className="text-lg font-black text-slate-800 truncate">{opening === 'car1' ? 'ABRINDO...' : 'LIBERAR'}</p>
                  </div>
               </button>
            </div>

            <button className="mt-10 py-6 bg-rose-50 text-rose-600 rounded-[32px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-rose-100 transition-all whitespace-nowrap">
               <AlertTriangle className="w-5 h-5 shrink-0" /> Acionamento Policial
            </button>
         </div>
      </div>

      {/* ESTATÍSTICAS DE AUTOMAÇÃO */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-12">
        {[
          { label: 'Acessos IA', value: '1,284', icon: Bot, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Economia', value: '82%', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Falsos Negativos', value: '0.2%', icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'Tempo Médio', value: '1.4s', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 flex items-center gap-6 hover:shadow-xl transition-all group">
             <div className={`${item.bg} ${item.color} p-5 rounded-2xl group-hover:scale-110 transition-transform`}>
                <item.icon className="w-6 h-6" />
             </div>
             <div className="min-w-0">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1 truncate">{item.label}</p>
                <p className="text-3xl font-black text-slate-900 truncate">{item.value}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
