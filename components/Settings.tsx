
import React, { useState } from 'react';
import { 
  Cloud, 
  Database, 
  ShieldCheck, 
  Smartphone, 
  HardDrive, 
  RefreshCcw, 
  CloudUpload,
  Lock,
  Eye,
  Bell
} from 'lucide-react';

const Settings: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState("Há 2 horas");
  const [keepScreenOn, setKeepScreenOn] = useState(true);

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
            <h2 className="text-2xl font-black text-slate-900">Configurações do Nexus</h2>
            <p className="text-slate-500">Gerencie dados, segurança e hardware do terminal.</p>
         </div>
         <div className="flex gap-3">
            <button 
              onClick={handleSync}
              disabled={isSyncing}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSyncing ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <CloudUpload className="w-5 h-5" />}
              Sincronizar Nuvem
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cloud & Data Section */}
        <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm">
           <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                 <Cloud className="w-6 h-6" />
              </div>
              <div>
                 <h3 className="font-black text-slate-800">Dados e Nuvem</h3>
                 <p className="text-xs text-slate-500">Status da redundância externa</p>
              </div>
           </div>

           <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                 <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-slate-400" />
                    <div>
                       <p className="text-sm font-bold text-slate-700">Backup em Nuvem</p>
                       <p className="text-xs text-slate-400 font-medium">Sincronização Automática Ativa</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-600">ATIVO</span>
                    <div className="w-10 h-6 bg-blue-600 rounded-full relative">
                       <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 border border-slate-100 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Último Backup</p>
                    <p className="text-lg font-black text-slate-800">{lastSync}</p>
                 </div>
                 <div className="p-4 border border-slate-100 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Espaço Utilizado</p>
                    <p className="text-lg font-black text-slate-800">124 MB</p>
                 </div>
              </div>

              <button className="w-full py-4 border-2 border-dashed border-slate-200 text-slate-500 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                 <HardDrive className="w-5 h-5" /> Baixar Cópia Local (JSON)
              </button>
           </div>
        </div>

        {/* System & PWA Section */}
        <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm">
           <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                 <Smartphone className="w-6 h-6" />
              </div>
              <div>
                 <h3 className="font-black text-slate-800">Hardware e Sistema</h3>
                 <p className="text-xs text-slate-500">Controle do dispositivo físico</p>
              </div>
           </div>

           <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                 <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-slate-400" />
                    <div>
                       <p className="text-sm font-bold text-slate-700">Manter Tela Ligada</p>
                       <p className="text-xs text-slate-400 font-medium">Previne bloqueio automático</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => setKeepScreenOn(!keepScreenOn)}
                   className={`w-12 h-7 rounded-full transition-colors relative ${keepScreenOn ? 'bg-indigo-600' : 'bg-slate-300'}`}
                 >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${keepScreenOn ? 'right-1' : 'left-1'}`} />
                 </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                 <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-slate-400" />
                    <div>
                       <p className="text-sm font-bold text-slate-700">Sobrepor Outros Apps</p>
                       <p className="text-xs text-slate-400 font-medium">Alarmes em primeiro plano</p>
                    </div>
                 </div>
                 <span className="text-[10px] font-black bg-indigo-100 text-indigo-700 px-2 py-1 rounded">RECURSO APK</span>
              </div>

              <div className="p-6 bg-slate-900 rounded-2xl text-white">
                 <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                    <p className="font-bold text-sm">Nexus PWA v2.4.0</p>
                 </div>
                 <p className="text-xs text-slate-400 leading-relaxed">
                    Este aplicativo está operando em modo isolado. Todas as funções de monitoramento offline estão ativas e sincronizando com o servidor Nexus Cloud.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
