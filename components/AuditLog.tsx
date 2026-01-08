
import React from 'react';
import { History, ShieldCheck, ShieldAlert, Shield, Search, Download } from 'lucide-react';
import { AuditEntry } from '../types';

const AUDIT_DATA: AuditEntry[] = [
  { id: '1', action: 'Abertura de Portão', user: 'Terminal Lobby', timestamp: '14:32:01', details: 'Biometria Facial (Morador: João Silva)', status: 'success' },
  { id: '2', action: 'Registro de Visitante', user: 'Nexus IA', timestamp: '14:15:30', details: 'Visitante James Wilson (Doc: 44.555.222)', status: 'success' },
  { id: '3', action: 'Tentativa de Acesso', user: 'Portão 02', timestamp: '13:50:11', details: 'QR Code Inválido ou Expirado', status: 'alert' },
  { id: '4', action: 'Configuração Alterada', user: 'Admin: Síndico', timestamp: '12:00:00', details: 'Wake Lock ativado no tablet principal', status: 'warning' },
  { id: '5', action: 'Abertura Remota', user: 'App Morador (Apto 402)', timestamp: '11:45:22', details: 'Portão Garagem Entrada', status: 'success' },
];

const AuditLog: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Log de Segurança</h2>
           <p className="text-slate-500 text-sm">Registro histórico de todas as operações do sistema</p>
        </div>
        <div className="flex gap-2">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Filtrar por ação ou usuário..." className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-blue-100" />
           </div>
           <button className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50">
              <Download className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
               <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ação / Operação</th>
               <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Usuário/Sistema</th>
               <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Horário</th>
               <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Detalhes Técnicos</th>
               <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {AUDIT_DATA.map(entry => (
              <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                 <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       <div className={`p-2 rounded-lg ${
                         entry.status === 'success' ? 'bg-emerald-50 text-emerald-600' :
                         entry.status === 'warning' ? 'bg-orange-50 text-orange-600' : 'bg-rose-50 text-rose-600'
                       }`}>
                          <Shield className="w-4 h-4" />
                       </div>
                       <span className="text-sm font-black text-slate-800">{entry.action}</span>
                    </div>
                 </td>
                 <td className="px-8 py-6 text-xs font-bold text-slate-500 uppercase">{entry.user}</td>
                 <td className="px-8 py-6 text-xs font-mono text-slate-400">{entry.timestamp}</td>
                 <td className="px-8 py-6 text-xs font-medium text-slate-500">{entry.details}</td>
                 <td className="px-8 py-6">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                      entry.status === 'success' ? 'bg-emerald-50 text-emerald-600' :
                      entry.status === 'warning' ? 'bg-orange-50 text-orange-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                       {entry.status}
                    </span>
                 </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLog;
