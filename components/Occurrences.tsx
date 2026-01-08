
import React from 'react';
import { ShieldAlert, Plus, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import { Occurrence } from '../types';

const INITIAL_OCCURRENCES: Occurrence[] = [
  { id: '1', title: 'Vazamento Garagem G1', description: 'Vazamento de água próximo a vaga 45.', date: '10/05/2024', status: 'open', priority: 'high', unit: 'G1-45' },
  { id: '2', title: 'Barulho Excessivo', description: 'Festa no salão além do horário permitido.', date: '09/05/2024', status: 'resolved', priority: 'medium', unit: '802' },
  { id: '3', title: 'Lâmpada Queimada', description: 'Hall do bloco B sem iluminação.', date: '08/05/2024', status: 'in-progress', priority: 'low', unit: 'Área Comum' },
];

const Occurrences: React.FC = () => {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
         <div>
            <h2 className="text-2xl font-black text-slate-900">Livro de Ocorrências</h2>
            <p className="text-slate-500">Registro digital de incidentes e solicitações</p>
         </div>
         <button className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-2xl font-bold shadow-lg shadow-orange-500/20 hover:bg-orange-700 transition-all">
            <Plus className="w-5 h-5" /> Nova Ocorrência
         </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {INITIAL_OCCURRENCES.map((occ) => (
          <div key={occ.id} className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center gap-6 group hover:shadow-xl hover:border-blue-100 transition-all">
             <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
               occ.priority === 'high' ? 'bg-rose-50 text-rose-600' : 
               occ.priority === 'medium' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
             }`}>
                <ShieldAlert className="w-8 h-8" />
             </div>
             <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                   <h4 className="text-lg font-black text-slate-800">{occ.title}</h4>
                   <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded">Apto {occ.unit}</span>
                </div>
                <p className="text-sm text-slate-500 line-clamp-2">{occ.description}</p>
                <div className="flex items-center gap-4 mt-3">
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                      <Clock className="w-3 h-3" /> {occ.date}
                   </div>
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                      <MessageSquare className="w-3 h-3" /> 2 Comentários
                   </div>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
                  occ.status === 'open' ? 'bg-rose-50 text-rose-600' :
                  occ.status === 'in-progress' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {occ.status === 'open' ? 'Aberta' : occ.status === 'in-progress' ? 'Em Andamento' : 'Resolvida'}
                </div>
                <button className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                   <CheckCircle2 className="w-5 h-5" />
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Occurrences;
