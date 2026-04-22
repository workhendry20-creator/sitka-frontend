// src/pages/admin/Kurikulum.jsx
import React, { useState } from 'react';
import { 
  Database, Download, Search, Filter, 
  Users, Calendar, BarChart3, FileSpreadsheet,
  TrendingUp, ClipboardCheck, ArrowUpRight,
  UserCheck, BookOpen, Layers
} from 'lucide-react';
import Swal from 'sweetalert2';

const Kurikulum = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // --- BIG DATA DUMMY (Gabungan Progress Ortu, Absensi Guru, & Nilai) ---
  const [bigData] = useState([
    { 
      id: 1, 
      nama: "Aditya Pratama", 
      kelas: "TK-A", 
      ortuProgress: "85%", 
      kehadiran: "98%", 
      harian: "Terisi", 
      semester: "Selesai", 
      kesehatan: "Baik",
      update: "2024-03-22" 
    },
    { 
      id: 2, 
      nama: "Siti Aminah", 
      kelas: "TK-B", 
      ortuProgress: "40%", 
      kehadiran: "90%", 
      harian: "Terisi", 
      semester: "Proses", 
      kesehatan: "Flu",
      update: "2024-03-21" 
    },
    { 
      id: 3, 
      nama: "Budi Santoso", 
      kelas: "TK-A", 
      ortuProgress: "100%", 
      kehadiran: "100%", 
      harian: "Belum", 
      semester: "Belum", 
      kesehatan: "Baik",
      update: "2024-03-19" 
    },
    { 
      id: 4, 
      nama: "Rara Anindya", 
      kelas: "TK-B", 
      ortuProgress: "75%", 
      kehadiran: "85%", 
      harian: "Terisi", 
      semester: "Selesai", 
      kesehatan: "Baik",
      update: "2024-03-22" 
    },
  ]);

  // --- FUNGSI EXPORT CSV (Agar Data Bisa Diolah di Excel) ---
  const exportToCSV = () => {
    const headers = ["Nama Siswa,Kelas,Progress Ortu,Kehadiran,Status Harian,Status Semester,Kesehatan,Update Terakhir\n"];
    const rows = bigData.map(d => 
      `${d.nama},${d.kelas},${d.ortuProgress},${d.kehadiran},${d.harian},${d.semester},${d.kesehatan},${d.update}`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `SITKA_REKAP_DATA_${new Date().toISOString().slice(0,10)}.csv`);
    link.click();

    Swal.fire({
      icon: 'success',
      title: 'Data Diexport!',
      text: 'File CSV berhasil diunduh untuk pengolahan Big Data.',
      confirmButtonColor: '#0a1e36'
    });
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* HEADER: BIG DATA DASHBOARD */}
      <div className="bg-[#0a1e36] p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <Database className="text-indigo-400" size={32} />
              <h2 className="text-3xl font-black italic tracking-tight">Pusat Manajemen Data</h2>
            </div>
            <p className="text-indigo-200 text-sm font-medium opacity-80">Sinkronisasi Real-time antara Guru, Orang Tua, dan Administrasi.</p>
          </div>
          
          <button 
            onClick={exportToCSV}
            className="group flex items-center gap-3 px-8 py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/30 active:scale-95"
          >
            <FileSpreadsheet size={20} className="group-hover:rotate-12 transition-transform" />
            Export to CSV / Excel
          </button>
        </div>
        
        {/* Background Decoration */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* STAT CARDS: OVERVIEW SELURUH SEKOLAH */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Keaktifan Ortu", val: "78.4%", icon: UserCheck, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Presensi Siswa", val: "94.2%", icon: Calendar, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Input Harian", val: "156/180", icon: BookOpen, color: "text-orange-500", bg: "bg-orange-50" },
          { label: "Ketuntasan Nilai", val: "88%", icon: BarChart3, color: "text-purple-500", bg: "bg-purple-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <h4 className="text-2xl font-black text-[#0a1e36]">{stat.val}</h4>
          </div>
        ))}
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="font-black text-[#0a1e36] text-xl">Database Terpadu Siswa</h3>
            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-tighter italic">*Data otomatis terupdate berdasarkan input aplikasi</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari siswa, kelas, atau status..."
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                <th className="px-8 py-6">Informasi Siswa</th>
                <th className="px-6 py-6 text-center">Progress Ortu</th>
                <th className="px-6 py-6 text-center">Presensi</th>
                <th className="px-6 py-6 text-center">Harian (Guru)</th>
                <th className="px-6 py-6 text-center">Kesehatan</th>
                <th className="px-8 py-6 text-right">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {bigData.filter(d => d.nama.toLowerCase().includes(searchTerm.toLowerCase())).map((row) => (
                <tr key={row.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-black text-[#0a1e36] group-hover:text-indigo-600 transition-colors">{row.nama}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{row.kelas}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col items-center gap-2">
                       <span className={`text-xs font-black ${parseInt(row.ortuProgress) > 50 ? 'text-emerald-600' : 'text-rose-500'}`}>
                         {row.ortuProgress}
                       </span>
                       <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${parseInt(row.ortuProgress) > 50 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: row.ortuProgress }}></div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className="text-xs font-black text-[#0a1e36] bg-slate-100 px-3 py-1.5 rounded-lg">{row.kehadiran}</span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border ${
                      row.harian === 'Terisi' ? 'border-blue-100 text-blue-600 bg-blue-50' : 'border-rose-100 text-rose-600 bg-rose-50'
                    }`}>
                      {row.harian}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${row.kesehatan === 'Baik' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                       <span className="text-xs font-bold text-slate-600">{row.kesehatan}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="text-[10px] font-bold text-slate-400 font-mono">{row.update}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* FOOTER TABLE */}
        <div className="p-6 bg-slate-50/50 text-center border-t border-slate-50">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
             Menampilkan {bigData.length} Data Siswa Aktif - SITKA Management System 2026
           </p>
        </div>
      </div>

    </div>
  );
};

export default Kurikulum;