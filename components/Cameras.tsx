
import React, { useState, useRef, useEffect } from 'react';
import { 
  Maximize2, 
  RefreshCw, 
  Grid, 
  Scan, 
  Activity, 
  X, 
  ShieldCheck, 
  Cpu, 
  UserCheck, 
  Car, 
  Search,
  Zap,
  Loader2
} from 'lucide-react';
import { virtualDoormanAnalysis, generateSpeech } from '../services/gemini';

interface Camera {
  id: number;
  name: string;
  type: string;
  image: string;
  aiActive: boolean;
}

const Cameras: React.FC = () => {
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detections, setDetections] = useState<any[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cameraFeeds: Camera[] = [
    { id: 1, name: 'Portão Pedestre 01', type: 'IA: Face ID', image: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&q=80&w=400', aiActive: true },
    { id: 2, name: 'Entrada Veículos (LPR)', type: 'IA: Placas', image: 'https://images.unsplash.com/photo-1541888941255-0816962f2a58?auto=format&fit=crop&q=80&w=400', aiActive: true },
    { id: 3, name: 'Elevador Bloco A', type: 'Interna', image: 'https://images.unsplash.com/photo-1558021211-6d1403321394?auto=format&fit=crop&q=80&w=400', aiActive: false },
    { id: 4, name: 'Piscina / Lazer', type: 'Área Comum', image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=400', aiActive: false },
    { id: 5, name: 'Academia', type: 'Interna', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400', aiActive: false },
    { id: 6, name: 'Garagem Subsolo 1', type: 'IA: Ocupação', image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=400', aiActive: true },
  ];

  const startLiveMonitor = async (camera: Camera) => {
    if (!camera.aiActive) return;
    setSelectedCamera(camera);
    setDetections([]);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 1280, height: 720 } 
      });
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 100);
    } catch (err) {
      console.error("Erro ao acessar câmera:", err);
    }
  };

  const closeMonitor = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    setSelectedCamera(null);
    setDetections([]);
  };

  const runAnalysis = async () => {
    if (!videoRef.current || !canvasRef.current || isAnalyzing) return;
    setIsAnalyzing(true);

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    const frame = canvas.toDataURL('image/jpeg', 0.7);

    try {
      const result = await virtualDoormanAnalysis(
        frame, 
        "James Wilson (Morador Apto 1204), Maria (Moradora 402)", 
        "ABC-1234 (Morador 1204)"
      );
      
      setDetections(result.detections);
      
      if (result.detections.length > 0) {
        const primary = result.detections[0];
        await generateSpeech(primary.greeting);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-20">
      <div className="flex items-center justify-between">
         <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Célula de Monitoramento</h2>
            <p className="text-slate-500">Sincronização neural com os portões</p>
         </div>
         <div className="flex gap-3">
            <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50"><RefreshCw className="w-5 h-5" /></button>
            <button className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest"><Grid className="w-4 h-4" /> Layout Grade</button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cameraFeeds.map((cam) => (
          <div 
            key={cam.id} 
            onClick={() => startLiveMonitor(cam)}
            className={`bg-slate-900 rounded-[40px] overflow-hidden border transition-all duration-500 group shadow-2xl relative cursor-pointer ${cam.aiActive ? 'border-blue-500/30 hover:border-blue-500' : 'border-slate-800'}`}
          >
             <div className="relative aspect-video">
                <img src={cam.image} className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" alt={cam.name} />
                
                {cam.aiActive && (
                  <div className="absolute inset-0 pointer-events-none">
                     <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border border-blue-500/20 rounded-lg animate-pulse" />
                     <div className="absolute bottom-4 left-4 bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Scan className="w-2.5 h-2.5" /> IA ATIVA
                     </div>
                  </div>
                )}

                <div className="absolute top-4 left-4 flex items-center gap-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black text-white uppercase border border-white/10">
                   <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${cam.aiActive ? 'bg-blue-500' : 'bg-red-500'}`} />
                   CAM-{cam.id.toString().padStart(3, '0')}
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                   <div className="p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                      <Maximize2 className="w-6 h-6 text-white" />
                   </div>
                </div>
             </div>
             
             <div className="p-6 flex items-center justify-between bg-slate-900/80 backdrop-blur-xl">
                <div>
                   <h4 className="text-white font-black text-sm uppercase tracking-tight">{cam.name}</h4>
                   <p className="text-slate-500 text-[9px] uppercase font-black tracking-[0.2em] mt-1">{cam.type}</p>
                </div>
                <div className="flex items-center gap-4">
                   <Activity className={`w-4 h-4 ${cam.aiActive ? 'text-blue-500' : 'text-slate-700'}`} />
                   <div className={`w-2.5 h-2.5 rounded-full ${cam.aiActive ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-slate-700'}`} />
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* MODAL DE MONITORAMENTO EM TEMPO REAL COM IA */}
      {selectedCamera && (
        <div className="fixed inset-0 z-[400] bg-slate-950/95 backdrop-blur-2xl flex flex-col p-4 sm:p-10 animate-in fade-in duration-300">
           <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col gap-6">
              
              <div className="flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20">
                       <Cpu className="w-8 h-8 text-white animate-pulse" />
                    </div>
                    <div>
                       <h3 className="text-white font-black text-2xl uppercase tracking-tighter">{selectedCamera.name}</h3>
                       <p className="text-blue-500 font-bold text-[10px] uppercase tracking-widest">Protocolo de Inspeção IA Nível 4</p>
                    </div>
                 </div>
                 <button onClick={closeMonitor} className="p-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all">
                    <X className="w-6 h-6" />
                 </button>
              </div>

              <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
                 {/* FEED DE VÍDEO COM OVERLAY DE IA */}
                 <div className="flex-[2] bg-black rounded-[48px] overflow-hidden relative border border-white/10 shadow-inner group">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1] opacity-70" />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Elementos Visuais do Scanner */}
                    <div className="absolute inset-0 pointer-events-none">
                       <div className={`absolute inset-0 border-[20px] border-blue-500/5 transition-all duration-1000 ${isAnalyzing ? 'border-blue-500/20' : ''}`} />
                       
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-blue-500/20 rounded-full animate-spin-slow" />
                       
                       <div className={`absolute top-0 left-0 right-0 h-1 bg-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.8)] transition-all duration-[3000ms] ease-in-out ${isAnalyzing ? 'top-full' : 'top-0 opacity-0'}`} />

                       {/* Overlay de Deteções na tela */}
                       {detections.map((det, i) => (
                         <div key={i} className="absolute top-1/3 left-1/2 -translate-x-1/2 bg-blue-600/90 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/20 animate-in zoom-in-50">
                            <div className="flex items-center gap-3">
                               {det.type === 'face' ? <UserCheck className="w-5 h-5 text-white" /> : <Car className="w-5 h-5 text-white" />}
                               <div>
                                  <p className="text-[10px] font-black text-blue-200 uppercase">{det.type}</p>
                                  <p className="text-white font-black">{det.id}</p>
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>

                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-sm px-6">
                       <button 
                          onClick={runAnalysis}
                          disabled={isAnalyzing}
                          className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-[32px] font-black text-xl shadow-2xl shadow-blue-500/40 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                       >
                          {isAnalyzing ? (
                            <> <Loader2 className="w-6 h-6 animate-spin" /> ANALISANDO... </>
                          ) : (
                            <> <Search className="w-6 h-6" /> ESCANEAR AMBIENTE </>
                          )}
                       </button>
                    </div>
                 </div>

                 {/* PAINEL DE RESULTADOS */}
                 <div className="flex-1 bg-white/5 rounded-[48px] border border-white/10 p-8 flex flex-col overflow-hidden">
                    <h4 className="text-white/40 font-black text-xs uppercase tracking-widest mb-8 flex items-center gap-2">
                       <ShieldCheck className="w-4 h-4 text-blue-500" /> Relatório de Inspeção
                    </h4>

                    <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
                       {detections.length === 0 ? (
                         <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                            <Zap className="w-12 h-12 text-white mb-4" />
                            <p className="text-white text-sm font-bold">Aguardando Captura de Metadados...</p>
                         </div>
                       ) : (
                         detections.map((det, i) => (
                           <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-3xl animate-in slide-in-from-right-4">
                              <div className="flex items-center gap-4 mb-4">
                                 <div className={`p-3 rounded-xl ${det.isAuthorized ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'}`}>
                                    {det.type === 'face' ? <UserCheck /> : <Car />}
                                 </div>
                                 <div className="min-w-0">
                                    <p className="text-white font-black truncate">{det.id}</p>
                                    <p className="text-[10px] font-black uppercase text-white/30">{det.persona || 'Anônimo'}</p>
                                 </div>
                              </div>
                              <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter mb-4 ${det.isAuthorized ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                 Ação Recomendada: {det.action}
                              </div>
                              <p className="text-xs text-white/60 italic leading-relaxed">"{det.greeting}"</p>
                           </div>
                         ))
                       )}
                    </div>
                    
                    <div className="mt-8 p-6 bg-blue-600/10 border border-blue-500/20 rounded-3xl">
                       <p className="text-[10px] font-black text-blue-400 uppercase mb-1">Status do Feed</p>
                       <div className="flex items-center justify-between">
                          <p className="text-white font-bold text-sm">ENCRIPTADO AES-256</p>
                          <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
                       </div>
                    </div>
                 </div>
              </div>

           </div>
        </div>
      )}

      <style>{`
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Cameras;
