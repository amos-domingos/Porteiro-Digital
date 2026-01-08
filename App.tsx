
import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  MessageSquare, 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Video, 
  ClipboardList, 
  CalendarDays, 
  PhoneCall, 
  BarChart3,
  Megaphone,
  History,
  Menu,
  X
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Visitors from './components/Visitors';
import Deliveries from './components/Deliveries';
import Concierge from './components/Concierge';
import Cameras from './components/Cameras';
import Occurrences from './components/Occurrences';
import Reservations from './components/Reservations';
import Settings from './components/Settings';
import AdminDashboard from './components/AdminDashboard';
import Notices from './components/Notices';
import AuditLog from './components/AuditLog';
import { View } from './types';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wakeLockActive, setWakeLockActive] = useState(false);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // Função robusta para solicitar Wake Lock
  const requestWakeLock = useCallback(async () => {
    if (!('wakeLock' in navigator)) return;
    
    try {
      const lock = await (navigator as any).wakeLock.request('screen');
      setWakeLockActive(true);
      console.debug('Nexus: Tela bloqueada (Always On)');
      
      lock.addEventListener('release', () => {
        setWakeLockActive(false);
        console.debug('Nexus: Wake Lock liberado');
      });
    } catch (err: any) {
      // Silencia erros de política de permissão que ocorrem em alguns ambientes de preview
      if (err.name !== 'NotAllowedError') {
        console.error('Nexus WakeLock Error:', err.name, err.message);
      }
    }
  }, []);

  // Tenta ativar o wake lock no início e sempre que o app voltar a ficar visível
  useEffect(() => {
    requestWakeLock();
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    // Adiciona um listener global para capturar o primeiro toque e garantir o wake lock
    window.addEventListener('click', requestWakeLock, { once: true });

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('click', requestWakeLock);
    };
  }, [requestWakeLock]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Painel Geral', icon: LayoutDashboard, group: 'Operacional' },
    { id: 'cameras', label: 'Câmeras CFTV', icon: Video, group: 'Operacional' },
    { id: 'visitors', label: 'Visitantes', icon: Users, group: 'Operacional' },
    { id: 'deliveries', label: 'Encomendas', icon: Package, group: 'Operacional' },
    
    { id: 'admin', label: 'Gestão & Dados', icon: BarChart3, group: 'Administrativo' },
    { id: 'notices', label: 'Mural de Avisos', icon: Megaphone, group: 'Administrativo' },
    { id: 'reservations', label: 'Reservas', icon: CalendarDays, group: 'Administrativo' },
    { id: 'occurrences', label: 'Ocorrências', icon: ClipboardList, group: 'Administrativo' },
    
    { id: 'audit', label: 'Segurança & Log', icon: History, group: 'Sistemas' },
    { id: 'concierge', label: 'Nexus IA', icon: MessageSquare, group: 'Sistemas' },
    { id: 'settings', label: 'Configurações', icon: SettingsIcon, group: 'Sistemas' },
  ];

  const viewTitles: Record<View, string> = {
    dashboard: 'Nexus Security Hub',
    cameras: 'Monitoramento em Tempo Real',
    visitors: 'Controle de Acessos',
    deliveries: 'Central de Encomendas',
    concierge: 'Concierge Virtual IA',
    occurrences: 'Gestão de Incidentes',
    reservations: 'Agenda Condominial',
    settings: 'Painel de Hardware',
    admin: 'Inteligência de Negócio',
    notices: 'Mural da Comunidade',
    audit: 'Trilha de Auditoria'
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden relative font-sans">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-40 transition-opacity" onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col shadow-2xl`}>
        <div className="p-8 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
             </div>
             <span className="font-black text-xl uppercase tracking-tighter">Nexus</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-500"><X /></button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto custom-scrollbar">
           {['Operacional', 'Administrativo', 'Sistemas'].map(group => (
             <div key={group}>
               <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">{group}</p>
               <div className="space-y-1">
                 {menuItems.filter(i => i.group === group).map(item => (
                   <button
                     key={item.id}
                     onClick={() => { setActiveView(item.id as View); setIsSidebarOpen(false); }}
                     className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeView === item.id ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                   >
                     <item.icon className="w-4 h-4 shrink-0" />
                     <span className="font-bold text-xs">{item.label}</span>
                   </button>
                 ))}
               </div>
             </div>
           ))}
        </nav>

        <div className="p-6 border-t border-slate-800">
           <button className="w-full flex items-center gap-3 p-3 bg-emerald-500/10 text-emerald-500 rounded-xl font-bold text-[10px] uppercase">
              <PhoneCall className="w-4 h-4" /> Chamada de Emergência
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 sm:h-24 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => setIsSidebarOpen(true)} className="p-3 bg-slate-900 rounded-2xl text-white shadow-xl hover:scale-105 transition-transform active:scale-95">
               <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
               <h1 className="text-sm sm:text-xl font-black text-slate-900 tracking-tight truncate">{viewTitles[activeView]}</h1>
               <div className="flex items-center gap-2 mt-0.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse shrink-0`} />
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">
                    {isOnline ? 'Sincronizado' : 'Offline Mode'} 
                    {wakeLockActive && ' • Tela Ativa'}
                  </span>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-12 w-28 sm:h-14 sm:w-36 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center shadow-inner shrink-0">
               <span className="text-base sm:text-xl font-black text-slate-900 tracking-tighter leading-none">
                  {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
               </span>
               <span className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                  {currentTime.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
               </span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-10 bg-slate-50/50 custom-scrollbar pb-12 sm:pb-10">
           <div className="max-w-[1400px] mx-auto">
              {activeView === 'dashboard' && <Dashboard />}
              {activeView === 'visitors' && <Visitors />}
              {activeView === 'deliveries' && <Deliveries />}
              {activeView === 'concierge' && <Concierge />}
              {activeView === 'cameras' && <Cameras />}
              {activeView === 'occurrences' && <Occurrences />}
              {activeView === 'reservations' && <Reservations />}
              {activeView === 'settings' && <Settings />}
              {activeView === 'admin' && <AdminDashboard />}
              {activeView === 'notices' && <Notices />}
              {activeView === 'audit' && <AuditLog />}
           </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
