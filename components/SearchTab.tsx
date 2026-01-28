
import React, { useState, useMemo } from 'react';
import { SanghaMember, SanghaTitle, StatsSummary } from '../types';
import { Search, Download, TrendingUp, Users, Home, MapPin, Activity, PieChart, Info, UserX, UserPlus, Heart, FileText, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { ETHNIC_LANG_GROUPS } from '../constants';
import * as XLSX from 'xlsx';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, Legend } from 'recharts';

interface SearchTabProps {
  members: SanghaMember[];
  onEdit: (member: SanghaMember) => void;
  onDelete: (id: string) => void;
}

export const SearchTab: React.FC<SearchTabProps> = ({ members, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModal, setSelectedModal] = useState<'moveOut' | 'moveIn' | 'resigned' | 'dead' | null>(null);

  const filteredMembers = useMemo(() => {
    return members.filter(m => 
      m.idCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [members, searchTerm]);

  const stats = useMemo(() => {
    const total = members.length || 0;
    const current = filteredMembers.length || 0;
    
    const s = {
      totalSangha: current,
      totalMonks: filteredMembers.filter(m => m.title === SanghaTitle.MONK).length,
      totalNovices: filteredMembers.filter(m => m.title === SanghaTitle.NOVICE).length,
      
      moveOut: { monk: 0, novice: 0, total: 0 },
      moveIn: { monk: 0, novice: 0, total: 0 },
      resigned: { monk: 0, novice: 0, total: 0 },
      dead: { monk: 0, novice: 0, total: 0 },
      
      totalTemples: new Set(filteredMembers.map(m => m.currentAddress.temple).filter(Boolean)).size,
      templesWithMonks: filteredMembers.filter(m => m.hasTempleMonks === 'ມີ').length,
      templesWithoutMonks: filteredMembers.filter(m => m.noTempleMonks === 'ມີ').length,
      totalSims: filteredMembers.filter(m => m.hasSim === 'ມີ').length,
      
      laoTai: filteredMembers.filter(m => m.ethnicGroup === 'Lao-Tai').length,
      monKhmer: filteredMembers.filter(m => m.ethnicGroup === 'Mon-Khmer').length,
      tibetoBurman: filteredMembers.filter(m => m.ethnicGroup === 'Tibeto-Burman').length,
      hmongIuMien: filteredMembers.filter(m => m.ethnicGroup === 'Hmong-IuMien').length,
    };

    filteredMembers.forEach(m => {
      s.moveOut.monk += Number(m.moveOut.monk);
      s.moveOut.novice += Number(m.moveOut.novice);
      s.moveIn.monk += Number(m.moveIn.monk);
      s.moveIn.novice += Number(m.moveIn.novice);
      s.resigned.monk += Number(m.resigned.monk);
      s.resigned.novice += Number(m.resigned.novice);
      s.dead.monk += Number(m.dead.monk);
      s.dead.novice += Number(m.dead.novice);
    });

    s.moveOut.total = s.moveOut.monk + s.moveOut.novice;
    s.moveIn.total = s.moveIn.monk + s.moveIn.novice;
    s.resigned.total = s.resigned.monk + s.resigned.novice;
    s.dead.total = s.dead.monk + s.dead.novice;

    return s;
  }, [members, filteredMembers]);

  const handleDownload = () => {
    const data = filteredMembers.length > 0 ? filteredMembers : members;
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Statistics");
    XLSX.writeFile(workbook, `Sangha_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const calcPerc = (val: number, base: number) => {
    if (base === 0) return 0;
    return (val / base) * 100;
  };

  const StatCard = ({ title, value, percentage, icon: Icon, color, onClick }: any) => (
    <div 
      onClick={onClick}
      className={`bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-4 rounded-2xl ${color} bg-opacity-10 shadow-inner`}>
          <Icon className={`${color.replace('bg-', 'text-')}`} size={24} />
        </div>
        {onClick && <div className="text-[10px] font-bold text-slate-300 group-hover:text-amber-500 flex items-center gap-1">ຄລິກເບິ່ງ <ChevronRight size={14} /></div>}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-800">{value.toLocaleString()}</span>
          {percentage !== undefined && (
            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${color.replace('bg-', 'bg-opacity-5 text-').replace('text-', 'border-')}`}>
              {percentage.toFixed(1)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Search Header */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-wrap gap-6 items-center">
        <div className="flex-grow relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="ຄົ້ນຫາດ້ວຍ ລະຫັດ ຫຼື ຊື່ນາມສະກຸນ..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] pl-16 pr-6 py-4 outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-bold"
          />
        </div>
        <button 
          onClick={handleDownload}
          className="gradient-btn bg-gradient-to-r from-amber-500 to-orange-600 text-white px-10 py-4 rounded-[1.5rem] font-black flex items-center gap-3 shadow-xl"
        >
          <Download size={22} /> ດາວໂຫລດຂໍ້ມູນ
        </button>
      </div>

      {/* Analytics Dashboard Grid - All 15 points */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        <StatCard title="ພຣະສົງ-ສາມະເນນທັງໝົດ" value={stats.totalSangha} percentage={100} icon={Users} color="bg-amber-600" />
        <StatCard title="ພຣະສົງທັງໝົດ" value={stats.totalMonks} percentage={calcPerc(stats.totalMonks, stats.totalSangha)} icon={TrendingUp} color="bg-orange-600" />
        <StatCard title="ສ.ນ ທັງໝົດ" value={stats.totalNovices} percentage={calcPerc(stats.totalNovices, stats.totalSangha)} icon={Activity} color="bg-blue-600" />
        <StatCard title="ຍ້າຍອອກ" value={stats.moveOut.total} percentage={calcPerc(stats.moveOut.total, stats.totalSangha)} icon={UserX} color="bg-rose-600" onClick={() => setSelectedModal('moveOut')} />
        <StatCard title="ຍ້າຍເຂົ້າ" value={stats.moveIn.total} percentage={calcPerc(stats.moveIn.total, stats.totalSangha)} icon={UserPlus} color="bg-emerald-600" onClick={() => setSelectedModal('moveIn')} />
        <StatCard title="ລາສິກຂາ" value={stats.resigned.total} percentage={calcPerc(stats.resigned.total, stats.totalSangha)} icon={Info} color="bg-slate-600" onClick={() => setSelectedModal('resigned')} />
        <StatCard title="ວັດທັງໝົດ" value={stats.totalTemples} percentage={100} icon={Home} color="bg-indigo-600" />
        <StatCard title="ວັດທີ່ມີພຣະສົງ" value={stats.templesWithMonks} percentage={calcPerc(stats.templesWithMonks, stats.totalTemples)} icon={CheckCircle} color="bg-sky-600" />
        <StatCard title="ວັດທີ່ບໍ່ມີພຣະສົງ" value={stats.templesWithoutMonks} percentage={calcPerc(stats.templesWithoutMonks, stats.totalTemples)} icon={XCircle} color="bg-rose-600" />
        <StatCard title="ມໍລະນະພາບ" value={stats.dead.total} percentage={calcPerc(stats.dead.total, stats.totalSangha)} icon={Heart} color="bg-zinc-800" onClick={() => setSelectedModal('dead')} />
        <StatCard title="ຈໍານວນສິມ" value={stats.totalSims} percentage={calcPerc(stats.totalSims, stats.totalTemples)} icon={Info} color="bg-cyan-600" />
        <StatCard title="ໝວດພາສາລາວ-ໄຕ" value={stats.laoTai} percentage={calcPerc(stats.laoTai, stats.totalSangha)} icon={PieChart} color="bg-amber-500" />
        <StatCard title="ໝວດພາສາມອນ-ຂະແມ" value={stats.monKhmer} percentage={calcPerc(stats.monKhmer, stats.totalSangha)} icon={PieChart} color="bg-blue-500" />
        <StatCard title="ໝວດພາສາຈີນ-ຕີເບດ" value={stats.tibetoBurman} percentage={calcPerc(stats.tibetoBurman, stats.totalSangha)} icon={PieChart} color="bg-emerald-500" />
        <StatCard title="ໝວດພາສາມົ້ງ-ອິວມ້ຽນ" value={stats.hmongIuMien} percentage={calcPerc(stats.hmongIuMien, stats.totalSangha)} icon={PieChart} color="bg-rose-500" />
      </div>

      {/* List Table */}
      <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100">
         <div className="p-8 bg-slate-50/80 border-b border-slate-200 flex justify-between items-center">
           <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
             <FileText size={22} className="text-amber-600" /> ຕາຕະລາງສະຫຼຸບຂໍ້ມູນ
           </h3>
         </div>
         <div className="overflow-x-auto">
           <table className="w-full text-left">
             <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
               <tr>
                 <th className="px-8 py-5">ລະຫັດ</th>
                 <th className="px-8 py-5">ຊື່ ແລະ ນາມສະກຸນ</th>
                 <th className="px-8 py-5">ອາຍຸ</th>
                 <th className="px-8 py-5">ຊົນເຜົ່າ</th>
                 <th className="px-8 py-5">ເບີໂທ</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {filteredMembers.map(m => (
                 <tr key={m.id} className="hover:bg-amber-50/30 transition-all cursor-default">
                   <td className="px-8 py-5 font-mono text-sm text-slate-400">{m.idCode}</td>
                   <td className="px-8 py-5">
                     <div className="font-black text-slate-700">{m.fullName}</div>
                     <div className="text-[10px] text-slate-400 font-bold">{m.title}</div>
                   </td>
                   <td className="px-8 py-5 font-bold text-slate-500">{m.age} ປີ</td>
                   <td className="px-8 py-5"><span className="text-xs font-black text-slate-600 bg-slate-100 px-3 py-1 rounded-full">{m.ethnicity}</span></td>
                   <td className="px-8 py-5 text-sm font-black text-slate-700">{m.phone}</td>
                 </tr>
               ))}
               {filteredMembers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-24 text-center opacity-30 font-bold">ບໍ່ພົບຂໍ້ມູນ</td>
                  </tr>
               )}
             </tbody>
           </table>
         </div>
      </div>

      {/* Breakdown Modal */}
      {selectedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-gradient-to-r from-slate-800 to-slate-950 p-8 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight">
                  {selectedModal === 'moveOut' ? 'ສະຖິຕິຍ້າຍອອກ' : 
                   selectedModal === 'moveIn' ? 'ສະຖິຕິຍ້າຍເຂົ້າ' :
                   selectedModal === 'resigned' ? 'ສະຖິຕິລາສິກຂາ' : 'ສະຖິຕິມໍລະນະພາບ'}
                </h3>
              </div>
              <button onClick={() => setSelectedModal(null)} className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full">✕</button>
            </div>
            <div className="p-10 space-y-8">
              <div className="flex items-center justify-between p-6 bg-orange-50 rounded-[2rem] border-2 border-orange-100">
                <span className="font-black text-xl text-orange-900">ພຣະ</span>
                <span className="text-4xl font-black text-orange-600">
                  {selectedModal === 'moveOut' ? stats.moveOut.monk :
                   selectedModal === 'moveIn' ? stats.moveIn.monk :
                   selectedModal === 'resigned' ? stats.resigned.monk : stats.dead.monk}
                </span>
              </div>
              <div className="flex items-center justify-between p-6 bg-blue-50 rounded-[2rem] border-2 border-blue-100">
                <span className="font-black text-xl text-blue-900">ສາມະເນນ</span>
                <span className="text-4xl font-black text-blue-600">
                  {selectedModal === 'moveOut' ? stats.moveOut.novice :
                   selectedModal === 'moveIn' ? stats.moveIn.novice :
                   selectedModal === 'resigned' ? stats.resigned.novice : stats.dead.novice}
                </span>
              </div>
              <button onClick={() => setSelectedModal(null)} className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-lg">ປິດໜ້າຕ່າງ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
