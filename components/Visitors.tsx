
import React, { useState } from 'react';
import { 
  Plus, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  QrCode,
  Filter,
  ShieldCheck,
  Search,
  UserPlus
} from 'lucide-react';
import { Visitor, UserRole } from '../types';
import { parseIDCard } from '../services/gemini';

interface VisitorsProps {
  userRole?: UserRole;
}

const INITIAL_VISITORS: Visitor[] = [
  { id: '1', name: 'James Wilson', unit: '1204', checkIn: '10:30', status: 'authorized', type: 'guest' },
  { id: '2', name: 'Maria Rodriguez', unit: '0402', checkIn: '11:15', status: 'pending', type: 'service' },
  { id: '3', name: 'David Chen', unit: '2201', checkIn: '11:45', status: 'authorized', type: 'guest' },
];

const Visitors: React.FC<VisitorsProps> = ({ userRole = 'admin' }) => {
  const [visitors, setVisitors] = useState<Visitor[]>(INITIAL_VISITORS);
  const [isScanning, setIsScanning] = useState(false);
  const [showQR, setShowQR] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsScanning(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const data = await parseIDCard(base64);
        const newVisitor: Visitor = {
          id: Math.random().toString(36).substr(2, 5),
          name: data.name || 'Desconhecido',
          unit: '1204',
          checkIn: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          status: 'pending',
          type: 'guest'
        };
        setVisitors([newVisitor, ...visitors]);
      } catch (error) { console.error(error); } finally { setIsScanning(false); }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Gestão de Acessos</h2>
          <p className="text-slate-500">{userRole === 'resident' ? 'Pré-autorize seus convidados' : 'Controle total da portaria'}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowQR('NEXUS-INVITE-' + Math.floor(Math.random() * 9000))} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase shadow-xl hover:bg-slate-800 transition-all">
            <QrCode className="w-4 h-4" /> Gerar QR Invite
          </button>
          {userRole !== 'resident' && (
            <div className="relative">
              <input type="file" className="hidden" id="id-scanner" accept="image/*" onChange={handleFileUpload} />
              <label htmlFor="id-scanner" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-blue-500/20 cursor-pointer hover:bg-blue-700 transition-all">
                <UserPlus className="w-4 h-4" /> Registrar Manual
              </label>
            </div>
          )}
        </div>
      </div>

      {showQR && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md">
           <div className="bg-white rounded-[40px] p-10 max-w-sm w-full text-center shadow-2xl relative animate-in zoom-in-95">
              <button onClick={() => setShowQR(null)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full"><XCircle className="w-6 h-6 text-slate-300" /></button>
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6"><ShieldCheck className="w-8 h-8" /></div>
              <h3 className="text-xl font-black text-slate-800 mb-2">Convite Digital</h3>
              <p className="text-sm text-slate-500 mb-8">Envie este QR para liberar o portão automaticamente.</p>
              <div className="aspect-square bg-slate-50 rounded-3xl p-8 border-2 border-dashed border-slate-200 mb-8 flex items-center justify-center">
                 <QrCode className="w-full h-full text-slate-900" />
              </div>
              <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-blue-500/30">Compartilhar WhatsApp</button>
           </div>
        </div>
      )}

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
           <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Buscar visitante..." className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs outline-none" />
           </div>
           <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{visitors.length} Registros ativos</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Visitante</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Apto</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Entrada</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {visitors.map((visitor) => (
                <tr key={visitor.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-sm">{visitor.name[0]}</div>
                      <div>
                        <p className="text-sm font-black text-slate-800">{visitor.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">ID: {visitor.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6"><span className="text-sm font-bold text-slate-600">Apto {visitor.unit}</span></td>
                  <td className="px-8 py-6 text-xs text-slate-400 font-bold">{visitor.checkIn}</td>
                  <td className="px-8 py-6">
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                      visitor.status === 'authorized' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                    }`}>{visitor.status}</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Visitors;
