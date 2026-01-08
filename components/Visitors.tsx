
import React, { useState } from 'react';
import { 
  Plus, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  QrCode,
  Filter,
  Download,
  ShieldCheck
} from 'lucide-react';
import { Visitor } from '../types';
import { parseIDCard } from '../services/gemini';

const INITIAL_VISITORS: Visitor[] = [
  { id: '1', name: 'James Wilson', unit: '1204', checkIn: '10:30', status: 'authorized', type: 'guest' },
  { id: '2', name: 'Maria Rodriguez', unit: '0402', checkIn: '11:15', status: 'pending', type: 'service' },
  { id: '3', name: 'David Chen', unit: '2201', checkIn: '11:45', status: 'authorized', type: 'guest' },
  { id: '4', name: 'Sarah Miller', unit: '0903', checkIn: '12:00', status: 'denied', type: 'delivery' },
];

const Visitors: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>(INITIAL_VISITORS);
  const [isScanning, setIsScanning] = useState(false);
  const [showQR, setShowQR] = useState<string | null>(null);

  const typeLabels: Record<string, string> = {
    guest: 'Convidado',
    service: 'Serviço',
    delivery: 'Entrega'
  };

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
          id: Math.random().toString(36).substr(2, 9),
          name: data.name || 'Desconhecido',
          unit: 'PENDENTE',
          checkIn: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          status: 'pending',
          type: 'guest'
        };
        setVisitors([newVisitor, ...visitors]);
      } catch (error) {
        console.error("Erro no scan", error);
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Registro de Visitantes</h2>
          <p className="text-slate-500">Acessos registrados nas últimas 24h</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
             onClick={() => setShowQR('NEXUS-INVITE-8891')}
             className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/10"
          >
            <QrCode className="w-4 h-4" /> Gerar Convite
          </button>
          <div className="relative">
            <input type="file" className="hidden" id="id-scanner" accept="image/*" onChange={handleFileUpload} disabled={isScanning} />
            <label htmlFor="id-scanner" className={`flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-lg shadow-blue-500/20 cursor-pointer ${isScanning ? 'opacity-50' : ''}`}>
              {isScanning ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
              {isScanning ? 'Lendo...' : 'Registrar'}
            </label>
          </div>
        </div>
      </div>

      {/* QR Code Modal Simulation */}
      {showQR && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md">
           <div className="bg-white rounded-[40px] p-10 max-w-sm w-full text-center shadow-2xl relative animate-in zoom-in-95">
              <button onClick={() => setShowQR(null)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"><XCircle className="w-6 h-6 text-slate-300" /></button>
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                 <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">Convite Digital Nexus</h3>
              <p className="text-sm text-slate-500 mb-8">Envie este QR Code para o visitante acessar o portão automaticamente.</p>
              
              <div className="aspect-square bg-slate-50 rounded-3xl p-8 border-2 border-dashed border-slate-200 mb-8 flex items-center justify-center">
                 <QrCode className="w-full h-full text-slate-800 opacity-20" />
              </div>
              
              <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/30 hover:bg-blue-700 active:scale-95 transition-all">
                 Compartilhar via WhatsApp
              </button>
           </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
           <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-2"><Filter className="w-3.5 h-3.5" /> Filtrar</button>
           </div>
           <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{visitors.length} Registros hoje</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Visitante</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Unidade</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Entrada</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {visitors.map((visitor) => (
                <tr key={visitor.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-sm">{visitor.name[0]}</div>
                      <div>
                        <p className="text-sm font-black text-slate-800 leading-none">{visitor.name}</p>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">Ref: {visitor.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="text-sm font-bold text-slate-600">Apto {visitor.unit}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                      <Clock className="w-3.5 h-3.5" /> {visitor.checkIn}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-100 text-slate-500 uppercase">{typeLabels[visitor.type]}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {visitor.status === 'authorized' ? (
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-widest"><CheckCircle2 className="w-3 h-3" /> Autorizado</span>
                      ) : visitor.status === 'pending' ? (
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full uppercase tracking-widest animate-pulse"><Clock className="w-3 h-3" /> Pendente</span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full uppercase tracking-widest"><XCircle className="w-3 h-3" /> Negado</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><MoreVertical className="w-4 h-4" /></button>
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
