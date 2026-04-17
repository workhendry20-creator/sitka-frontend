import React from 'react';
import { TrendingUp, Search, Filter, ArrowUpRight, Brain, Heart, Activity, Download } from 'lucide-react';
import Swal from 'sweetalert2';

const ManajemenPerkembangan = () => {
  // Data Dummy Perkembangan Siswa
  const dataPerkembangan = [
    { id: 1, nama: "Aditya Pratama", kelas: "1-A", fisik: 85, kognitif: 90, sosial: 82, update: "2 hari yang lalu" },
    { id: 2, nama: "Salsa Bella", kelas: "1-B", fisik: 78, kognitif: 88, sosial: 95, update: "Sekarang" },
    { id: 3, nama: "Rizky Fauzan", kelas: "1-A", fisik: 92, kognitif: 75, sosial: 80, update: "3 hari yang lalu" },
  ];

  // Fungsi Export CSV
  const handleExportCSV = () => {
    const header = "Nama Siswa,Kelas,Fisik Motorik (%),Kognitif (%),Sosial Emosional (%)\n";
    const rows = dataPerkembangan.map(s => 
      `${s.nama},${s.kelas},${s.fisik},${s.kognitif},${s.sosial}`
    ).join("\n");

    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_Perkembangan_Siswa_SITKA.csv`;
    a.click();

    Swal.fire({
      icon: 'success',
      title: 'Export Berhasil',
      text: 'Data perkembangan telah diunduh dalam format CSV',
      confirmButtonColor: '#10b981' // Warna emerald sesuai tema
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* HEADER SECTION */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600">
              <TrendingUp size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#0a1e36]">Manajemen Perkembangan</h2>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Monitoring Grafik Pertumbuhan Siswa</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button 
              onClick={handleExportCSV}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg active:scale-95"
            >
              <Download size={18} /> Export CSV
            </button>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari siswa..." 
                className="pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm w-full focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* STATS SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatMiniCard icon={Activity} label="Rata-rata Fisik" value="82%" color="bg-blue-500" />
        <StatMiniCard icon={Brain} label="Rata-rata Kognitif" value="85%" color="bg-purple-500" />
        <StatMiniCard icon={Heart} label="Rata-rata Sosial" value="88%" color="bg-pink-500" />
      </div>

      {/* DATA TABLE */}
      <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="pb-6">Nama Siswa / Kelas</th>
                <th className="pb-6">Fisik Motorik</th>
                <th className="pb-6">Kognitif</th>
                <th className="pb-6">Sosial Emosional</th>
                <th className="pb-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {dataPerkembangan.map((s) => (
                <tr key={s.id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="py-8">
                    <div>
                      <p className="font-bold text-[#0a1e36] text-lg">{s.nama}</p>
                      <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">Kelas {s.kelas}</p>
                    </div>
                  </td>
                  <td className="py-8"><ProgressBar value={s.fisik} color="bg-blue-500" /></td>
                  <td className="py-8"><ProgressBar value={s.kognitif} color="bg-purple-500" /></td>
                  <td className="py-8"><ProgressBar value={s.sosial} color="bg-pink-500" /></td>
                  <td className="py-8 text-right">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-[#0a1e36] rounded-xl font-bold text-xs hover:bg-[#0a1e36] hover:text-white transition-all">
                      Detail <ArrowUpRight size={14} />
                    </button>
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

// Sub-komponen (Progress Bar & Stat Card tetap sama)
const ProgressBar = ({ value, color }) => (
  <div className="w-full max-w-[120px] space-y-2">
    <div className="flex justify-between items-end">
      <span className="text-[10px] font-black text-slate-400">{value}%</span>
    </div>
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${value}%` }} />
    </div>
  </div>
);

const StatMiniCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
    <div className={`p-4 ${color} text-white rounded-2xl shadow-lg`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black text-[#0a1e36]">{value}</p>
    </div>
  </div>
);

export default ManajemenPerkembangan;