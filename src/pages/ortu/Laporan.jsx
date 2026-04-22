import React, { useState } from 'react';
import { 
  ClipboardList, Calendar, CheckCircle2, 
  Clock, AlertCircle, FileText, BarChart3,
  ChevronRight, Star, TrendingUp, UserCheck,
  LayoutDashboard
} from 'lucide-react';

const Laporan = () => {
  const [activeTab, setActiveTab] = useState('perkembangan');
  const [filterPeriode, setFilterPeriode] = useState('Harian');

  // --- DATA DUMMY (Connect to Teacher's Input) ---
  const dataAnak = {
    nama: "Aditya Pratama",
    kelompok: "Kelompok A",
    stats: { hadir: 18, izin: 1, sakit: 1, alpa: 0 }
  };

  const laporanPerkembangan = [
    { id: 1, tanggal: '2026-04-22', tipe: 'Harian', status: 'Bahagia 😊', catatan: 'Aditya hari ini sangat aktif membantu teman merapikan mainan.', guru: 'Ibu Ani' },
    { id: 2, tanggal: '2026-04-20', tipe: 'Harian', status: 'Istimewa 🌟', catatan: 'Berhasil menghafal doa makan dengan sangat lancar.', guru: 'Ibu Ani' },
    { id: 3, tanggal: '2026-04-14', tipe: 'Mingguan', status: 'Sangat Baik', catatan: 'Menunjukkan kemajuan besar dalam koordinasi motorik halus (mewarnai).', guru: 'Ibu Ani' },
    { id: 4, tanggal: '2026-03-30', tipe: 'Quartal', status: 'Melampaui Harapan', catatan: 'Secara keseluruhan Aditya menunjukkan kemandirian yang sangat baik di semester awal ini.', guru: 'Ibu Ani' },
  ];

  const riwayatAbsensi = [
    { tanggal: '22 Apr 2026', status: 'Hadir', jam: '07:15', ket: 'Tepat Waktu' },
    { tanggal: '21 Apr 2026', status: 'Hadir', jam: '07:20', ket: 'Tepat Waktu' },
    { tanggal: '20 Apr 2026', status: 'Izin', jam: '-', ket: 'Acara Keluarga' },
    { tanggal: '19 Apr 2026', status: 'Sakit', jam: '-', ket: 'Demam' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* --- 1. HEADER PROFILE ANAK --- */}
      <div className="bg-[#0a1e36] p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[2rem] flex items-center justify-center border border-white/20 shadow-xl">
              <span className="text-3xl font-black text-white">A</span>
            </div>
            <div>
              <h2 className="text-2xl font-black">{dataAnak.nama}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                  {dataAnak.kelompok}
                </span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                  Aktif
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/5 text-center backdrop-blur-sm">
              <p className="text-[10px] font-black uppercase text-indigo-300 mb-1 tracking-tighter">Kehadiran</p>
              <p className="text-xl font-black">{((dataAnak.stats.hadir / 20) * 100).toFixed(0)}%</p>
            </div>
            <div className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/5 text-center backdrop-blur-sm">
              <p className="text-[10px] font-black uppercase text-indigo-300 mb-1 tracking-tighter">Laporan Baru</p>
              <p className="text-xl font-black">2</p>
            </div>
          </div>
        </div>
        {/* Dekorasi Glow */}
        <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* --- 2. TAB NAVIGATION --- */}
      <div className="flex p-2 bg-slate-100 rounded-[2.2rem] w-fit">
        <button 
          onClick={() => setActiveTab('perkembangan')}
          className={`flex items-center gap-2 px-8 py-4 rounded-[1.8rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'perkembangan' ? 'bg-white text-[#0a1e36] shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <TrendingUp size={16} /> Perkembangan
        </button>
        <button 
          onClick={() => setActiveTab('absensi')}
          className={`flex items-center gap-2 px-8 py-4 rounded-[1.8rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'absensi' ? 'bg-white text-[#0a1e36] shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <UserCheck size={16} /> Kehadiran
        </button>
      </div>

      {activeTab === 'perkembangan' ? (
        <div className="space-y-6">
          {/* --- FILTER PERIODE --- */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {['Harian', 'Mingguan', 'Quartal', 'Semester'].map(p => (
              <button 
                key={p}
                onClick={() => setFilterPeriode(p)}
                className={`px-6 py-3 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${filterPeriode === p ? 'bg-[#0a1e36] text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100 hover:border-indigo-200'}`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* --- REKAP STATUS PER PERIODE --- */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Laporan', val: laporanPerkembangan.filter(l => l.tipe === filterPeriode).length, color: 'indigo' },
              { label: 'Kondisi Dominan', val: filterPeriode === 'Harian' ? 'Bahagia 😊' : 'Sangat Baik', color: 'emerald' },
              { label: 'Pencapaian', val: '85%', color: 'amber' },
              { label: 'Evaluasi', val: 'Stabil', color: 'blue' },
            ].map((stats) => (
              <div key={stats.label} className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm border-b-4 border-b-slate-100">
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">{stats.label} {filterPeriode}</p>
                <p className={`text-lg font-black text-slate-700`}>{stats.val}</p>
              </div>
            ))}
          </div>

          {/* --- LIST DETAIL LAPORAN --- */}
          <div className="grid grid-cols-1 gap-5">
            {laporanPerkembangan.filter(l => l.tipe === filterPeriode).length > 0 ? (
              laporanPerkembangan.filter(l => l.tipe === filterPeriode).map(item => (
                <div key={item.id} className="bg-white p-6 md:p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-[#0a1e36] group-hover:text-white transition-all duration-300 shadow-sm">
                        <FileText size={26} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-black text-[#0a1e36]">Laporan {item.tipe}</h4>
                          <span className="text-[10px] font-black text-slate-300 uppercase hidden sm:block">•</span>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.tanggal}</p>
                        </div>
                        <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Penanggung Jawab: {item.guru}</p>
                      </div>
                    </div>
                    <div className="px-5 py-2 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-black border border-emerald-100 shadow-sm">
                      {item.status}
                    </div>
                  </div>
                  
                  <div className="relative p-6 bg-slate-50/50 rounded-3xl border border-slate-50 italic">
                    <div className="absolute left-0 top-6 w-1.5 h-10 bg-indigo-500 rounded-r-full"></div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      "{item.catatan}"
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-50 flex flex-wrap items-center justify-between gap-4">
                     <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                          <Star size={14} className="text-amber-400" /> Fokus Tinggi
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                          <TrendingUp size={14} className="text-emerald-500" /> Progres Positif
                        </div>
                     </div>
                     <button className="text-[11px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors">
                       Lihat Raport Lengkap →
                     </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-24 bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                   <ClipboardList className="text-slate-200" size={40} />
                </div>
                <h3 className="text-lg font-bold text-[#0a1e36]">Belum Ada Data</h3>
                <p className="text-slate-400 text-xs mt-2 px-6">Laporan {filterPeriode} untuk {dataAnak.nama} belum diterbitkan oleh guru.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* --- 3. VIEW ABSENSI (KEHADIRAN) --- */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            {[
              { label: 'Total Hadir', val: dataAnak.stats.hadir, color: 'emerald', icon: CheckCircle2, desc: 'Hari efektif' },
              { label: 'Izin / Sakit', val: dataAnak.stats.izin + dataAnak.stats.sakit, color: 'blue', icon: Clock, desc: 'Dengan keterangan' },
              { label: 'Tanpa Berita', val: dataAnak.stats.alpa, color: 'rose', icon: AlertCircle, desc: 'Perlu konfirmasi' },
            ].map(s => (
              <div key={s.label} className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-100 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`p-4 bg-${s.color}-50 text-${s.color}-600 rounded-[1.2rem] group-hover:scale-110 transition-transform`}>
                    <s.icon size={24} />
                  </div>
                  <div>
                    <span className="font-black text-[#0a1e36] text-sm block leading-none mb-1">{s.label}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.desc}</span>
                  </div>
                </div>
                <span className={`text-3xl font-black text-${s.color}-600`}>{s.val}</span>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h3 className="font-black text-[#0a1e36] tracking-tight">Riwayat Absensi Terkini</h3>
              <Calendar size={20} className="text-slate-300" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {riwayatAbsensi.map((abs, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 transition-all">
                      <td className="px-8 py-5 text-sm font-bold text-[#0a1e36]">{abs.tanggal}</td>
                      <td className="px-8 py-5">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                          abs.status === 'Hadir' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                          abs.status === 'Izin' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                          {abs.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-xs text-slate-400 font-bold text-right italic">{abs.ket}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Laporan;