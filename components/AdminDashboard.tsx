
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  PieChart, Pie, Cell 
} from 'recharts';
import { Users, TrendingUp, Package, Building2 } from 'lucide-react';

const DATA_FLUXO = [
  { hora: '08:00', visitantes: 12, entregas: 5 },
  { hora: '10:00', visitantes: 25, entregas: 15 },
  { hora: '12:00', visitantes: 38, entregas: 22 },
  { hora: '14:00', visitantes: 30, entregas: 18 },
  { hora: '16:00', visitantes: 45, entregas: 25 },
  { hora: '18:00', visitantes: 55, entregas: 12 },
  { hora: '20:00', visitantes: 20, entregas: 8 },
];

const DATA_AREAS = [
  { name: 'Piscina', value: 45 },
  { name: 'Academia', value: 25 },
  { name: 'Salão', value: 20 },
  { name: 'Churrasqueira', value: 10 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1'];

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {[
          { label: 'Ocupação Média', value: '78%', icon: Building2, color: 'text-blue-600' },
          { label: 'Fluxo/Dia', value: '342', icon: Users, color: 'text-emerald-600' },
          { label: 'Pacotes/Mês', value: '1,240', icon: Package, color: 'text-orange-600' },
          { label: 'Crescimento', value: '+12%', icon: TrendingUp, color: 'text-indigo-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
             <div className="flex items-center gap-4 mb-4">
                <s.icon className={`w-5 h-5 ${s.color}`} />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</span>
             </div>
             <p className="text-4xl font-black text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
           <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter mb-8">Fluxo de Acessos vs Entregas</h3>
           <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={DATA_FLUXO}>
                    <defs>
                       <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="hora" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="visitantes" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVis)" strokeWidth={3} />
                    <Area type="monotone" dataKey="entregas" stroke="#10b981" fillOpacity={0} strokeWidth={3} strokeDasharray="5 5" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
           <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter mb-8">Uso das Áreas Comuns</h3>
           <div className="h-[400px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie data={DATA_AREAS} cx="50%" cy="50%" innerRadius={100} outerRadius={140} paddingAngle={8} dataKey="value">
                       {DATA_AREAS.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                    </Pie>
                    <Tooltip />
                 </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase">Popularidade</p>
                 <p className="text-2xl font-black text-slate-800">100%</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
