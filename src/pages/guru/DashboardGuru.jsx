// src/pages/guru/DashboardGuru.jsx
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Users, BookOpen, Clock } from 'lucide-react';

const data = [
  { name: 'Minggu 1', nilai: 70 },
  { name: 'Minggu 2', nilai: 82 },
  { name: 'Minggu 3', nilai: 75 },
  { name: 'Minggu 4', nilai: 90 },
];

const DashboardGuru = () => {
  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-[#306896] to-[#4682b4] p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Selamat Datang di SITKA Dashboard</h2>
          <p className="opacity-80 font-medium">Ini adalah ringkasan performa siswa Anda bulan ini.</p>
        </div>
        <BookOpen className="absolute right-[-20px] bottom-[-20px] w-64 h-64 opacity-10 rotate-12" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Siswa', val: '32', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Kehadiran Hari Ini', val: '98%', icon: Clock, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Tugas Terkumpul', val: '12/32', icon: BookOpen, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
            <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-3xl font-black text-[#0a1e36]">{stat.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-[#0a1e36]">Perkembangan Nilai Rata-rata</h3>
              <p className="text-slate-400 text-sm font-medium">Statistik 4 Minggu Terakhir</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#306896] rounded-xl font-bold text-sm transition-all">
              <Download size={16} />
              Export to CSV
            </button>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorNilai" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#306896" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#306896" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Area type="monotone" dataKey="nilai" stroke="#306896" strokeWidth={4} fillOpacity={1} fill="url(#colorNilai)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rekap Kehadiran (Kreativitas Tambahan) */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-[#0a1e36] mb-6">Status Kehadiran</h3>
          <div className="space-y-6">
            {[
              { status: 'Hadir', count: 30, color: 'bg-green-500', percent: '94%' },
              { status: 'Izin', count: 1, color: 'bg-blue-500', percent: '3%' },
              { status: 'Alpha', count: 1, color: 'bg-red-500', percent: '3%' },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-slate-500">{item.status}</span>
                  <span className="text-[#0a1e36]">{item.count} Siswa</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{width: item.percent}}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 p-4 bg-orange-50 rounded-2xl border border-orange-100">
             <p className="text-xs text-orange-700 font-bold leading-relaxed">
               ⚠️ Ada 1 siswa yang tidak hadir tanpa keterangan hari ini. Segera cek Chat Ortu.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardGuru;