
import React from 'react';
import { CalendarDays, Plus, MapPin, Clock, User } from 'lucide-react';
import { Reservation } from '../types';

const INITIAL_RESERVATIONS: Reservation[] = [
  { id: '1', area: 'Salão de Festas A', date: '20/05/2024', timeSlot: '14:00 - 22:00', unit: '1202', status: 'confirmed' },
  { id: '2', area: 'Churrasqueira 02', date: '15/05/2024', timeSlot: '10:00 - 18:00', unit: '404', status: 'pending' },
  { id: '3', area: 'Academia (Agendado)', date: 'Hoje', timeSlot: '18:00 - 19:30', unit: '701', status: 'confirmed' },
];

const Reservations: React.FC = () => {
  return (
    <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
      <div className="flex items-center justify-between">
         <div>
            <h2 className="text-2xl font-black text-slate-900">Reservas e Áreas Comuns</h2>
            <p className="text-slate-500">Agendamento de espaços de lazer</p>
         </div>
         <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
            <Plus className="w-5 h-5" /> Nova Reserva
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INITIAL_RESERVATIONS.map((res) => (
          <div key={res.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all relative group overflow-hidden">
             <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                   <CalendarDays className="w-7 h-7" />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                  res.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                }`}>
                  {res.status === 'confirmed' ? 'Confirmado' : 'Aguardando'}
                </span>
             </div>

             <div className="space-y-4">
                <h4 className="text-xl font-black text-slate-800">{res.area}</h4>
                
                <div className="space-y-2">
                   <div className="flex items-center gap-3 text-slate-500">
                      <MapPin className="w-4 h-4 text-slate-300" />
                      <span className="text-sm font-semibold">Apto {res.unit}</span>
                   </div>
                   <div className="flex items-center gap-3 text-slate-500">
                      <Clock className="w-4 h-4 text-slate-300" />
                      <span className="text-sm font-semibold">{res.date} • {res.timeSlot}</span>
                   </div>
                </div>
             </div>

             <div className="mt-8 pt-6 border-t border-slate-100 flex gap-2">
                <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all">Detalhes</button>
                <button className="px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                   <User className="w-4 h-4 text-slate-400" />
                </button>
             </div>
             
             {/* Gradient Accent */}
             <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reservations;
