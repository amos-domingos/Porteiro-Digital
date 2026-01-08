
import React from 'react';
import { Megaphone, Plus, ShieldAlert, Wrench, Calendar, Info } from 'lucide-react';
import { Notice } from '../types';

const INITIAL_NOTICES: Notice[] = [
  { id: '1', title: 'Manutenção Preventiva de Elevadores', content: 'Os elevadores do Bloco A passarão por manutenção amanhã das 09h às 12h.', author: 'Administração', date: 'Hoje, 10:00', category: 'maintenance' },
  { id: '2', title: 'Festa Junina do Nexus', content: 'Participe do nosso arraial no próximo sábado no Rooftop! Traga sua família.', author: 'Social', date: 'Ontem, 16:30', category: 'event' },
  { id: '3', title: 'Novo Protocolo de Segurança', content: 'Agora é obrigatório o uso de biometria facial para todos os moradores.', author: 'Segurança', date: '15 Mai', category: 'security' },
];

const Notices: React.FC = () => {
  const icons = {
    maintenance: { icon: Wrench, color: 'bg-orange-50 text-orange-600' },
    event: { icon: Calendar, color: 'bg-emerald-50 text-emerald-600' },
    security: { icon: ShieldAlert, color: 'bg-rose-50 text-rose-600' },
    general: { icon: Info, color: 'bg-blue-50 text-blue-600' },
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between">
         <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Mural de Avisos</h2>
            <p className="text-slate-500">Comunicados oficiais e eventos sociais</p>
         </div>
         <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
            <Plus className="w-5 h-5" /> Postar Aviso
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                   <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-400 text-xs">
                      {notice.author[0]}
                   </div>
                   <span className="text-xs font-bold text-slate-400">{notice.author}</span>
                </div>
                <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Ver Detalhes</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notices;
