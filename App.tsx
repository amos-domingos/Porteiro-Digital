
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
  X,
  AlertCircle,
  Wallet,
  UserCircle,
  ChevronDown
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
import Financial from './components/Financial';
import { View, UserRole } from './types';
import { NativeBridge } from './services/nativeBridge';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [emergencyAlert, setEmergencyAlert] = useState<string | null>(null);

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

  const requestWakeLock = useCallback(async () => {
    await NativeBridge.wakeDevice();
    if ('wakeLock' in navigator) {
      try {
        const lock = await (navigator as any).wakeLock.request('screen');
        setWakeLockActive(true);
        lock.addEventListener('release', () => setWakeLockActive(false));
      } catch (err: any) {}
    }
  }, []);

  useEffect(() => {
    requestWakeLock();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') requestWakeLock();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
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

  const triggerEmergency = (msg: string) => {
    setEmergencyAlert(msg);
    NativeBridge.wakeDevice();
    NativeBridge.sendCriticalAlert("ALERTA NEXUS", msg);
    new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play().catch(() => {});
  };

  const menuItems = [
    { id: 'dashboard', label: 'Painel Geral', icon: LayoutDashboard, roles: ['admin', 'resident', 'concierge_desk'] },
    { id: 'cameras', label: 'Câmeras IA', icon: Video, roles: ['admin', 'concierge_desk'] },
    { id: 'financial', label: 'Financeiro', icon: Wallet, roles: ['admin', 'resident'] },
    { id: 'visitors', label: 'Visitantes', icon: Users, roles: ['admin', 'concierge_desk', 'resident'] },
    { id: 'deliveries', label: 'Encomendas', icon: Package, roles: ['admin', 'concierge_desk', 'resident'] },
    { id: 'admin', label: 'Inteligência', icon: BarChart3, roles: ['admin'] },
    { id: 'notices', label: 'Mural & Docs', icon: Megaphone, roles: ['admin', 'resident'] },
    { id: 'reservations', label: 'Reservas', icon: CalendarDays, roles: ['admin', 'resident'] },
    { id: 'occurrences', label: 'Ocorrências', icon: ClipboardList, roles: ['admin', 'resident'] },
    { id: 'concierge', label: 'Nexus IA', icon: MessageSquare, roles: ['admin', 'resident'] },
    { id: 'audit', label: 'Logs Nexus', icon: History, roles: ['admin'] },
    { id: 'settings', label: 'Hardware', icon: SettingsIcon, roles: ['admin'] },
  ];

  const viewTitles: Record<View, string> = {
    dashboard: 'Nexus Security Hub',
    cameras: 'Monitoramento IA',
    visitors: 'Acessos e Convites',
    deliveries: 'Central Logística',
    concierge: 'Concierge Virtual',
    occurrences: 'Incidentes',
    reservations: 'Espaços Comuns',
    settings: 'Hardware & Sync',
    admin: 'Gestão Estratégica',
    notices: 'Comunicados Oficiais',
    audit: 'Auditoria de Sistema',
    financial: 'Portal de Finanças'
  };

  const filteredMenu = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden relative font-sans text-slate-900">
      
      {emergencyAlert && (
        <div className="fixed inset-0 z-[1000] bg-rose-600 flex flex-col items-center justify-center p-10 text-white animate-in fade-in duration-300">
           <AlertCircle className="w-32 h-32 mb-8 animate-bounce" />
           <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter text-center">Alerta Crítico</h2>
           <p className="text-xl font-bold mb-12 text-center max-w-md">{emergencyAlert}</p>
           <button onClick={() => setEmergencyAlert(null)} className="px-12 py-5 bg-white text-rose-600 rounded-[32px] font-black text-xl uppercase shadow-2xl active:scale-95 transition-all">Desativar Alerta</button>
        </div>
      )}

      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-40" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-500 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col shadow-2xl`}>
        <div className="p-8 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20"><ShieldCheck className="w-6 h-6" /></div>
             <span className="font-black text-xl uppercase tracking-tighter">Nexus</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-500"><X /></button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
           <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Menu Principal</p>
           {filteredMenu.map(item => (
             <button
               key={item.id}
               onClick={() => { setActiveView(item.id as View); setIsSidebarOpen(false); }}
               className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${activeView === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
             >
               <item.icon className="w-4 h-4 shrink-0" />
               <span className="font-bold text-xs">{item.label}</span>
             </button>
           ))}
        </nav>

        <div className="p-6 border-t border-slate-800 space-y-4">
           {userRole === 'admin' && (
             <button onClick={() => triggerEmergency("Botão de Pânico Ativado")} className="w-full flex items-center gap-3 p-4 bg-rose-500/10 text-rose-500 rounded-2xl font-black text-[10px] uppercase hover:bg-rose-500 hover:text-white transition-all"><PhoneCall className="w-4 h-4" /> Pânico</button>
           )}
           <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-black text-[10px]">US</div>
              <div className="min-w-0">
                 <p className="text-[10px] font-black truncate">Usuário Teste</p>
                 <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">{userRole}</p>
              </div>
           </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 sm:h-24 bg-white border-b border-slate-200 px-6 sm:px-10 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(true)} className="p-3 bg-slate-900 rounded-2xl text-white shadow-xl active:scale-95 transition-all"><Menu className="w-5 h-5" /></button>
            <div className="min-w-0">
               <h1 className="text-xl font-black text-slate-900 tracking-tight truncate">{viewTitles[activeView]}</h1>
               <div className="flex items-center gap-2 mt-0.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'} shrink-0`} />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{isOnline ? 'Nexus Live' : 'Offline'} • Apto 1204</span>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* ROLE SWITCHER */}
            <div className="hidden sm:flex relative group">
               <button className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 hover:bg-white transition-all">
                  <UserCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-[10px] font-black uppercase text-slate-600">{userRole}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
               </button>
               <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100] p-2">
                  {(['admin', 'resident', 'concierge_desk'] as UserRole[]).map(role => (
                    <button key={role} onClick={() => { setUserRole(role); setActiveView('dashboard'); }} className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-slate-50 ${userRole === role ? 'text-blue-600' : 'text-slate-400'}`}>{role}</button>
                  ))}
               </div>
            </div>

            <div className="h-14 w-32 bg-slate-900 rounded-2xl flex flex-col items-center justify-center shadow-lg">
               <span className="text-xl font-black text-white tracking-tighter leading-none">{currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-0.5">{currentTime.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-10 bg-slate-50/50 custom-scrollbar">
           <div className="max-w-[1400px] mx-auto">
              {activeView === 'dashboard' && <Dashboard userRole={userRole} />}
              {activeView === 'visitors' && <Visitors userRole={userRole} />}
              {activeView === 'deliveries' && <Deliveries />}
              {activeView === 'concierge' && <Concierge />}
              {activeView === 'cameras' && <Cameras />}
              {activeView === 'occurrences' && <Occurrences />}
              {activeView === 'reservations' && <Reservations />}
              {activeView === 'settings' && <Settings />}
              {activeView === 'admin' && <AdminDashboard />}
              {activeView === 'notices' && <Notices />}
              {activeView === 'audit' && <AuditLog />}
              {activeView === 'financial' && <Financial />}
           </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
