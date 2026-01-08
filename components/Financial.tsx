
import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  FileText, 
  Download, 
  CreditCard, 
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  PieChart
} from 'lucide-react';
import { Invoice } from '../types';

const INITIAL_INVOICES: Invoice[] = [
  { id: '1', month: 'Maio 2024', dueDate: '10/05', value: 850.40, status: 'paid', type: 'condo' },
  { id: '2', month: 'Abril 2024', dueDate: '10/04', value: 850.40, status: 'paid', type: 'condo' },
  { id: '3', month: 'Abril 2024', dueDate: '25/04', value: 120.00, status: 'paid', type: 'extra' },
  { id: '4', month: 'Março 2024', dueDate: '10/03', value: 850.40, status: 'paid', type: 'condo' },
];

const Financial: React.FC = () => {
  const [invoices] = useState<Invoice[]>(INITIAL_INVOICES);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* SUMÁRIO FINANCEIRO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Seu Saldo Condo</p>
               <h2 className="text-5xl font-black tracking-tighter mb-10">R$ 0,00</h2>
               
               <div className="grid grid-cols-2 gap-8">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-2xl flex items-center justify-center"><ArrowUpRight /></div>
                     <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase">Gasto Médio</p>
                        <p className="text-xl font-black">R$ 850,40</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-blue-500/20 text-blue-500 rounded-2xl flex items-center justify-center"><TrendingDown /></div>
                     <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase">Economia IA</p>
                        <p className="text-xl font-black text-emerald-500">12.5%</p>
                     </div>
                  </div>
               </div>
            </div>
            <BarChart2 className="absolute top-0 right-0 p-10 w-64 h-64 text-white/5" />
         </div>

         <div className="bg-white rounded-[40px] border border-slate-200 p-10 flex flex-col justify-between shadow-sm">
            <div>
               <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter mb-2">Análise Nexus</h3>
               <p className="text-slate-500 text-sm mb-8 leading-relaxed">Sua unidade reduziu o consumo de água em 15% este mês comparado à média do bloco.</p>
            </div>
            <button className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black text-xs uppercase shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-3">
               <FileText className="w-4 h-4" /> Detalhar Prestação
            </button>
         </div>
      </div>

      <div className="flex items-center justify-between">
         <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Histórico de Cobranças</h3>
         <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 text-xs uppercase hover:bg-slate-50 transition-all">
            <Download className="w-4 h-4" /> Exportar Tudo
         </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {invoices.map((inv) => (
          <div key={inv.id} className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col md:flex-row md:items-center gap-6 group hover:shadow-xl transition-all">
             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
               inv.status === 'paid' ? 'bg-emerald-50 text-emerald-500' : 'bg-orange-50 text-orange-500'
             }`}>
                {inv.status === 'paid' ? <CheckCircle2 className="w-7 h-7" /> : <Clock className="w-7 h-7" />}
             </div>
             
             <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                   <h4 className="text-lg font-black text-slate-800">{inv.month}</h4>
                   <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                      {inv.type === 'condo' ? 'Condomínio' : 'Taxa Extra'}
                   </span>
                </div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Vencimento: {inv.dueDate}</p>
             </div>

             <div className="text-right shrink-0">
                <p className="text-2xl font-black text-slate-900">R$ {inv.value.toFixed(2).replace('.', ',')}</p>
                <p className={`text-[10px] font-black uppercase tracking-widest ${inv.status === 'paid' ? 'text-emerald-500' : 'text-orange-500'}`}>
                   {inv.status === 'paid' ? 'Liquidado' : 'Aguardando'}
                </p>
             </div>

             <div className="flex items-center gap-3 shrink-0">
                <button className="p-4 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"><Download className="w-5 h-5" /></button>
                <button className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 shadow-lg active:scale-95 transition-all"><CreditCard className="w-5 h-5" /></button>
             </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Financial;
