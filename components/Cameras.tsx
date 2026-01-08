
import React from 'react';
import { Maximize2, RefreshCw, Settings2, Grid, Scan, Activity, Eye } from 'lucide-react';

const Cameras: React.FC = () => {
  const cameraFeeds = [
    { id: 1, name: 'Portão Pedestre 01', type: 'IA: Face ID', image: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&q=80&w=400', aiActive: true },
    { id: 2, name: 'Entrada Veículos (LPR)', type: 'IA: Placas', image: 'https://images.unsplash.com/photo-1541888941255-0816962f2a58?auto=format&fit=crop&q=80&w=400', aiActive: true },
    { id: 3, name: 'Elevador Bloco A', type: 'Interna', image: 'https://images.unsplash.com/photo-1558021211-6d1403321394?auto=format&fit=crop&q=80&w=400', aiActive: false },
    { id: 4, name: 'Piscina / Lazer', type: 'Área Comum', image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=400', aiActive: false },
    { id: 5, name: 'Academia', type: 'Interna', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400', aiActive: false },
    { id: 6, name: 'Garagem Subsolo 1', type: 'IA: Ocupação', image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=400', aiActive: true },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
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
          <div key={cam.id} className="bg-slate-900 rounded-[40px] overflow-hidden border border-slate-800 group shadow-2xl relative">
             <div className="relative aspect-video">
                <img src={cam.image} className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" alt={cam.name} />
                
                {/* AI Scanner Effect */}
                {cam.aiActive && (
                  <div className="absolute inset-0 pointer-events-none">
                     <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border border-blue-500/30 rounded-lg animate-pulse" />
                     <div className="absolute bottom-4 left-4 bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Scan className="w-2.5 h-2.5" /> AI SCANNING...
                     </div>
                  </div>
                )}

                <div className="absolute top-4 left-4 flex items-center gap-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black text-white uppercase border border-white/10">
                   <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                   CAM-{cam.id.toString().padStart(3, '0')}
                </div>
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-md"><Maximize2 className="w-4 h-4" /></button>
                </div>
                <div className="absolute bottom-4 right-4 text-white/40 text-[9px] font-mono tracking-widest">
                   {new Date().toLocaleTimeString()} • 4K HDR
                </div>
             </div>
             <div className="p-6 flex items-center justify-between bg-slate-900/80 backdrop-blur-xl">
                <div>
                   <h4 className="text-white font-black text-sm uppercase tracking-tight">{cam.name}</h4>
                   <p className="text-slate-500 text-[9px] uppercase font-black tracking-[0.2em] mt-1">{cam.type}</p>
                </div>
                <div className="flex items-center gap-4">
                   <Activity className="w-4 h-4 text-emerald-500" />
                   <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cameras;
