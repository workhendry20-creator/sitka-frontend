// src/pages/admin/DashboardAdmin.jsx
import React from 'react';
import { Users, UserCheck, BookOpen, Activity, ArrowUpRight } from 'lucide-react';

const DashboardAdmin = () => {
  const stats = [
    { label: 'Total Guru', value: '42', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Siswa', value: '380', icon: UserCheck, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Mata Pelajaran', value: '18', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Login Hari Ini', value: '124', icon: Activity, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-[#0a1e36] p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-indigo-900/20">
        <div className="relative z-10">
          <h2 className="text-4xl font-black mb-2 tracking-tight">System Overview</h2>
          <p className="text-indigo-200 font-medium">Selamat datang di Pusat Kontrol SITKA. Kelola seluruh ekosistem digital sekolah di sini.</p>
        </div>
        <div className="absolute right-[-30px] top-[-30px] w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-4 ${item.bg} ${item.color} rounded-2xl group-hover:scale-110 transition-transform`}>
                <item.icon size={24} />
              </div>
              <ArrowUpRight size={20} className="text-slate-300" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
            <p className="text-3xl font-black text-[#0a1e36] mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-[#0a1e36] mb-6">Aktivitas Sistem Terbaru</h3>
          <div className="space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex gap-4 items-start pb-6 border-b border-gray-50 last:border-0">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <Activity size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0a1e36]">Input Nilai Berhasil</p>
                  <p className="text-xs text-slate-500">Guru Ani menginput nilai Matematika kelas A1.</p>
                  <p className="text-[9px] font-black text-indigo-500 mt-2 uppercase">2 MENIT YANG LALU</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-indigo-600 p-8 rounded-[3rem] text-white flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-black mb-2">Pencadangan Data</h3>
            <p className="text-indigo-100 text-sm">Backup sistem terakhir dilakukan 4 jam yang lalu. Status: Aman.</p>
          </div>
          <button className="bg-white text-indigo-600 font-black text-xs uppercase tracking-widest py-4 px-6 rounded-2xl mt-8 hover:bg-indigo-50 transition-colors">
            Cadangkan Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;