// src/pages/guru/DashboardGuru.jsx
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Users, BookOpen, Clock, Megaphone, Bell } from 'lucide-react';

const data = [
  { name: 'Minggu 1', nilai: 70 },
  { name: 'Minggu 2', nilai: 82 },
  { name: 'Minggu 3', nilai: 75 },
  { name: 'Minggu 4', nilai: 90 },
];

const DashboardGuru = () => {
  // State untuk informasi realtime dari Admin
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    // Ambil data pengumuman yang dikirim Admin melalui localStorage
    const savedInfo = JSON.parse(localStorage.getItem('sitka_announcements') || '[]');
    setAnnouncements(savedInfo);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-[#306896] to-[#4682b4] p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-2 tracking-tight">Selamat Datang di SITKA Dashboard</h2>
          <p className="opacity-80 font-medium italic">Manajemen kelas jadi lebih mudah dan terintegrasi hari ini.</p>
        </div>
        <BookOpen className="absolute right-[-20px] bottom-[-20px] w-64 h-64 opacity-10 rotate-12" />
      </div>

      {/* --- INFO BROADCAST DARI ADMIN --- */}
      {announcements.length > 0 && (
        <div className="bg-white p-2 rounded-[2.5rem] border-2 border-orange-500 shadow-xl shadow-orange-100 overflow-hidden">
          <div className="bg-orange-500 p-6 rounded-[2.2rem] text-white flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl">
                <Megaphone size={28} className="animate-bounce" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Informasi Kedinasan / Sekolah</p>
                <h3 className="text-xl font-black italic">{announcements[0].title}</h3>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/20 max-w-md">
              <p className="text-sm font-bold italic leading-relaxed">"{announcements[0].content}"</p>
              <p className="text-[9px] font-black mt-2 text-right opacity-60 uppercase">{announcements[0].date}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Siswa', val: '32', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Kehadiran Hari Ini', val: '98%', icon: Clock, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Tugas Terkumpul', val: '12/32', icon: BookOpen, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6 hover:shadow-md transition-all group">
            <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
              <h3 className="text-3xl font-black text-[#0a1e36]">{stat.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-[#0a1e36]">Perkembangan Nilai Rata-rata</h3>
              <p className="text-slate-400 text-sm font-medium">Statistik 4 Minggu Terakhir</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 hover:bg-slate-100 text-[#306896] rounded-2xl font-black text-xs transition-all uppercase tracking-widest border border-slate-100">
              <Download size={16} />
              Export CSV
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
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '15px'}}
                />
                <Area type="monotone" dataKey="nilai" stroke="#306896" strokeWidth={5} fillOpacity={1} fill="url(#colorNilai)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Kehadiran */}
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-[#0a1e36] mb-8">Status Kehadiran</h3>
            <div className="space-y-6">
              {[
                { status: 'Hadir', count: 30, color: 'bg-green-500', percent: '94%' },
                { status: 'Izin', count: 1, color: 'bg-blue-500', percent: '3%' },
                { status: 'Alpha', count: 1, color: 'bg-red-500', percent: '3%' },
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                    <span className="text-slate-400">{item.status}</span>
                    <span className="text-[#0a1e36]">{item.count} Siswa</span>
                  </div>
                  <div className="w-full h-4 bg-slate-50 rounded-full overflow-hidden p-1 border border-slate-100">
                    <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{width: item.percent}}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-orange-50 rounded-[2rem] border border-orange-100 flex items-start gap-4">
             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-600 shadow-sm shrink-0">
                <Bell size={20} className="animate-pulse" />
             </div>
             <p className="text-[11px] text-orange-800 font-bold leading-relaxed">
               ⚠️ Ada 1 siswa tidak hadir hari ini. Harap konfirmasi ke orang tua melalui menu chat.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardGuru;