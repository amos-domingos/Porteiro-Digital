
import React, { useState } from 'react';
import { 
  Megaphone, 
  Plus, 
  ShieldAlert, 
  Wrench, 
  Calendar, 
  Info, 
  FileText, 
  BarChart, 
  CheckCircle2, 
  Search,
  BookOpen
} from 'lucide-react';
import { Notice } from '../types';

const INITIAL_NOTICES: Notice[] = [
  { id: '1', title: 'Manutenção Preventiva de Elevadores', content: 'Os elevadores do Bloco A passarão por manutenção amanhã das 09h às 12h.', author: 'Administração', date: 'Hoje, 10:00', category: 'maintenance' },
  { id: '2', title: 'Festa Junina do Nexus', content: 'Participe do nosso arraial no próximo sábado no Rooftop! Traga sua família.', author: 'Social', date: 'Ontem, 16:30', category: 'event' },
  { id: '3', title: 'Novo Protocolo de Segurança', content: 'Agora é obrigatório o uso de biometria facial para todos os moradores.', author: 'Segurança', date: '15 Mai', category: 'security' },
];

const Notices: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'avisos' | 'enquetes' | 'docs'>('avisos');

  const icons = {
    maintenance: { icon: Wrench, color: 'bg-orange-50 text-orange-600' },
    event: { icon: Calendar, color: 'bg-emerald-50 text-emerald-600' },
    security: { icon: ShieldAlert, color: 'bg-rose-50 text-rose-600' },
    general: { icon: Info, color: 'bg-blue-50 text-blue-600' },
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
         <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Comunidade Nexus</h2>
            <p className="text-slate-500">Transparência e engajamento condominial</p>
         </div>
         <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            {(['avisos', 'enquetes', 'docs'] as const).map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab}
              </button>
            ))}
         </div>
      </div>

      {activeTab === 'avisos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
          {INITIAL_NOTICES.map(notice => (
            <div key={notice.id} className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
               <div className="flex items-start justify-between mb-6">
                  <div className={`p-4 rounded-2xl ${icons[notice.category].color}`}>
                     <icons[notice.category].icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{notice.date}</span>
               </div>
               
               <h4 className="text-xl font-black text-slate-800 leading-tight mb-4">{notice.title}</h4>
               <p className="text-sm text-slate-500 leading-relaxed mb-8">{notice.content}</p>
               
               <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-400 text-xs">{notice.author[0]}</div>
                     <span className="text-xs font-bold text-slate-400">{notice.author}</span>
                  </div>
                  <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Ver Detalhes</button>
               </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'enquetes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-right-4 duration-300">
           <div className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><BarChart /></div>
                 <div>
                    <h4 className="text-xl font-black text-slate-900">Reforma do Rooftop</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Expira em 3 dias</p>
                 </div>
              </div>
              <p className="text-sm text-slate-500 mb-10">Qual o foco principal da nova área de lazer no topo do edifício?</p>
              
              <div className="space-y-4">
                 {[
                   { opt: 'Área Gourmet / Churrasqueiras', votes: 65 },
                   { opt: 'Coworking / Home Office', votes: 25 },
                   { opt: 'Espaço Kids / Brinquedoteca', votes: 10 }
                 ].map((o, idx) => (
                   <button key={idx} className="w-full text-left p-6 bg-slate-50 hover:bg-blue-50 rounded-3xl border border-transparent hover:border-blue-200 transition-all relative overflow-hidden group">
                      <div className="flex justify-between relative z-10 mb-2">
                         <span className="text-sm font-bold text-slate-700">{o.opt}</span>
                         <span className="text-xs font-black text-blue-600">{o.votes}%</span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                         <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${o.votes}%` }} />
                      </div>
                   </button>
                 ))}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'docs' && (
        <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in">
           <div className="p-8 border-b border-slate-100 flex items-center gap-4">
              <div className="relative flex-1">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                 <input type="text" placeholder="Buscar em atas, regimento ou manuais..." className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 p-8 gap-4">
              {[
                { name: 'Regimento Interno Nexus 2024.pdf', size: '2.4MB', cat: 'Jurídico' },
                { name: 'Ata Assembléia - Março.pdf', size: '1.1MB', cat: 'Gestão' },
                { name: 'Manual de Obras e Reformas.pdf', size: '4.8MB', cat: 'Técnico' },
                { name: 'Prestação de Contas 2023.pdf', size: '15MB', cat: 'Financeiro' }
              ].map((doc, idx) => (
                <div key={idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-lg transition-all">
                   <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-400 group-hover:text-blue-600 transition-colors"><FileText /></div>
                      <div>
                         <p className="text-sm font-black text-slate-800">{doc.name}</p>
                         <p className="text-[10px] font-black text-slate-400 uppercase">{doc.cat} • {doc.size}</p>
                      </div>
                   </div>
                   <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><BookOpen className="w-4 h-4" /></button>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default Notices;
