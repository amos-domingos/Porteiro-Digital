
import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  MapPin, 
  Calendar, 
  User, 
  CheckCircle,
  Truck,
  ArrowRight,
  Filter,
  Plus
} from 'lucide-react';
import { Delivery } from '../types';

const INITIAL_DELIVERIES: Delivery[] = [
  { id: '1', recipient: 'Alice Vance', unit: '1401', carrier: 'FedEx', arrivedAt: '09:15', status: 'pending', trackingNumber: 'FX-889012' },
  { id: '2', recipient: 'Bob Smith', unit: '0505', carrier: 'Correios', arrivedAt: '10:45', status: 'collected', trackingNumber: 'BR-77211' },
  { id: '3', recipient: 'Clara Oswald', unit: '2004', carrier: 'Amazon', arrivedAt: '11:20', status: 'pending', trackingNumber: 'AMZ-10293' },
  { id: '4', recipient: 'Danny Pink', unit: '0210', carrier: 'Loggi', arrivedAt: '11:45', status: 'pending', trackingNumber: 'LG-4455' },
];

const Deliveries: React.FC = () => {
  const [deliveries] = useState<Delivery[]>(INITIAL_DELIVERIES);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Gestão de Logística</h2>
          <p className="text-slate-500">Única tarefa humana ativa: Triagem de volumes</p>
        </div>
        <div className="flex gap-3">
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-600">
             <Filter className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-[24px] font-black text-xs uppercase shadow-2xl shadow-emerald-500/30 hover:bg-emerald-700 transition-all">
            <Plus className="w-5 h-5" /> Registrar Recebimento
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {deliveries.map((delivery) => (
          <div key={delivery.id} className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 hover:shadow-2xl hover:-translate-y-1 transition-all group relative overflow-hidden">
            <div className="flex items-start justify-between mb-8">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                <Package className="w-7 h-7" />
              </div>
              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                delivery.status === 'pending' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'
              }`}>
                {delivery.status === 'pending' ? 'Pendente' : 'Retirado'}
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-black text-slate-900 leading-tight mb-1">{delivery.recipient}</h4>
                <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-tighter">
                   <MapPin className="w-3.5 h-3.5" /> Apto {delivery.unit}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transporte</p>
                  <p className="text-sm font-bold text-slate-700">{delivery.carrier}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chegada</p>
                  <p className="text-sm font-bold text-slate-700">{delivery.arrivedAt}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Protocolo</p>
                <code className="text-[10px] font-mono bg-slate-50 p-2 rounded-xl text-slate-500 block border border-slate-100">
                  {delivery.trackingNumber}
                </code>
              </div>
            </div>

            <div className="mt-8">
              {delivery.status === 'pending' ? (
                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                  Notificar Morador <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-xs uppercase">
                  <CheckCircle className="w-4 h-4" /> Entregue
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Deliveries;
