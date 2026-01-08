
import React, { useState } from 'react';
import { 
  Cloud, 
  Smartphone, 
  RefreshCcw, 
  CloudUpload,
  Cpu,
  MonitorCheck,
  QrCode,
  Info,
  ExternalLink,
  ChevronRight,
  HardDrive,
  Bell
} from 'lucide-react';
import { NativeBridge } from '../services/nativeBridge';

const Settings: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState("Há 2 horas");

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync("Agora");
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
         <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Nexus Config</h2>
            <p className="text-slate-500 text-sm">Controle de hardware e integração de sistema.</p>
         </div>
         <div className="flex gap-3">
            <button 
              onClick={handleSync}
              disabled={isSyncing}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSyncing ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <CloudUpload className="w-5 h-5" />}
              Sincronizar Cloud
            </button>
         </div>
      </div>

      {/* GUIA DE EMULAÇÃO NO CELULAR */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[40px] p-8 sm:p-10 text-white shadow-2xl shadow-blue-500/30 overflow-hidden relative">
         <div className="absolute top-0 right-0 p-10 opacity-10">
            <Smartphone className="w-48 h-48 rotate-12" />
         </div>
         
         <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
               <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                  <QrCode className="w-8 h-8 text-white" />
               </div>
               <div>
                  <h3 className="text-xl font-black uppercase tracking-tighter">Guia de Emulação no Celular</h3>
                  <p className="text-blue-100 text-xs font-bold uppercase tracking-widest">Teste sensores e Wake Lock em tempo real</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 hover:bg-white/15 transition-all">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-black mb-4">1</div>
                  <h4 className="font-black text-sm mb-2 uppercase">Acesso via IP</h4>
                  <p className="text-xs text-blue-100 leading-relaxed">Abra o navegador no celular e digite o IP local do seu computador na porta do servidor (ex: 192.168.1.15:5173).</p>
               </div>
               
               <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 hover:bg-white/15 transition-all">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-black mb-4">2</div>
                  <h4 className="font-black text-sm mb-2 uppercase">Instale o PWA</h4>
                  <p className="text-xs text-blue-100 leading-relaxed">Clique em "Adicionar à Tela de Início" no menu do navegador para remover barras e rodar em tela cheia.</p>
               </div>

               <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 hover:bg-white/15 transition-all">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-black mb-4">3</div>
                  <h4 className="font-black text-sm mb-2 uppercase">Câmera IA</h4>
                  <p className="text-xs text-blue-100 leading-relaxed">Para usar a IA no celular via IP local, use o Chrome e habilite "Insecure origins treated as secure" em chrome://flags.</p>
               </div>
            </div>
            
            <div className="mt-8 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest opacity-60">
               <Info className="w-4 h-4" /> Recomendamos o uso de túneis HTTPS (ngrok) para testes completos de produção.
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* APK / NATIVE INTEGRATION */}
        <div className="bg-slate-900 rounded-[40px] p-10 border border-slate-800 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <Cpu className="w-32 h-32 text-white" />
           </div>

           <div className="flex items-center gap-4 mb-10 relative z-10">
              <div className="w-14 h-14 bg-blue-600/20 text-blue-500 rounded-2xl flex items-center justify-center">
                 <Smartphone className="w-8 h-8" />
              </div>
              <div>
                 <h3 className="text-white font-black text-lg">Integração Nativa APK</h3>
                 <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Recursos de Baixo Nível</p>
              </div>
           </div>

           <div className="space-y-4 relative z-10">
              <div className="p-6 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-between">
                 <div>
                    <p className="text-white font-bold text-sm">Ambiente Nativo</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Status do Wrapper Capacitor</p>
                 </div>
                 <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase ${NativeBridge.isNative() ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-800 text-slate-500'}`}>
                    {NativeBridge.isNative() ? 'Conectado' : 'Web/PWA'}
                 </span>
              </div>

              <div className="p-6 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-between">
                 <div>
                    <p className="text-white font-bold text-sm">Deep Wake Lock</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Impede Deep Sleep do Android</p>
                 </div>
                 <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                 </div>
              </div>

              <div className="mt-8 p-6 bg-blue-600/10 rounded-3xl border border-blue-500/20">
                 <h4 className="text-blue-500 font-black text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2">
                   <MonitorCheck className="w-3 h-3" /> Modo Kiosk Ativo
                 </h4>
                 <p className="text-slate-400 text-xs leading-relaxed">
                    Para o recurso "Ligar a Tela" funcionar, certifique-se que o APK possui as flags 
                    <code className="text-blue-400 mx-1">FLAG_TURN_SCREEN_ON</code> habilitadas no MainActivity.
                 </p>
              </div>
           </div>
        </div>

        {/* Cloud & Data Section */}
        <div className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-sm flex flex-col">
           <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                 <Cloud className="w-8 h-8" />
              </div>
              <div>
                 <h3 className="font-black text-slate-800 text-lg">Nexus Sync Core</h3>
                 <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Sincronização Bidirecional</p>
              </div>
           </div>

           <div className="space-y-6 flex-1">
              <div className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl">
                 <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-xl shadow-sm"><Bell className="w-5 h-5 text-slate-400" /></div>
                    <div>
                       <p className="text-sm font-bold text-slate-700">Notificações Críticas</p>
                       <p className="text-[10px] text-slate-400 font-black uppercase">Alarmes Visuais e Sonoros</p>
                    </div>
                 </div>
                 <div className="w-12 h-6 bg-slate-200 rounded-full relative">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 border border-slate-100 rounded-3xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Backup Cloud</p>
                    <p className="text-xl font-black text-slate-800">{lastSync}</p>
                 </div>
                 <div className="p-6 border border-slate-100 rounded-3xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Latência IA</p>
                    <p className="text-xl font-black text-emerald-500">24ms</p>
                 </div>
              </div>

              <button className="w-full mt-auto py-5 border-2 border-dashed border-slate-200 text-slate-500 rounded-3xl font-black text-xs uppercase hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                 <HardDrive className="w-5 h-5" /> Exportar Dados de Auditoria
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
