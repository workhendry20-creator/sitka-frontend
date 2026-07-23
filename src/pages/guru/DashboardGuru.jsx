// src/pages/guru/DashboardGuru.jsx
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Users, BookOpen, Clock, Megaphone, Bell } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

const data = [
  { name: 'Minggu 1', nilai: 70 },
  { name: 'Minggu 2', nilai: 82 },
  { name: 'Minggu 3', nilai: 75 },
  { name: 'Minggu 4', nilai: 90 },
];

const dataAnekdotHarian = [
  { kondisi: 'Bahagia 😊', jumlah: 18, color: '#6366f1' },
  { kondisi: 'Tenang 😐', jumlah: 5, color: '#3b82f6' },
  { kondisi: 'Sedih 😢', jumlah: 1, color: '#f43f5e' },
  { kondisi: 'Istimewa 🌟', jumlah: 2, color: '#f59e0b' }
];

const DashboardGuru = () => {
  // State manajemen dashboard
  const [announcements, setAnnouncements] = useState([]);
  const [loadingBroadcast, setLoadingBroadcast] = useState(true);
  const [totalSiswa, setTotalSiswa] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  // --- HOOKS UTAMA SYNC DATABASE ---
  useEffect(() => {
    fetchCloudAnnouncements();
    fetchTotalSiswaRealtime();
  }, []);

  // 1. Ambil Data Pengumuman Realtime
  const fetchCloudAnnouncements = async () => {
    setLoadingBroadcast(true);
    try {
      const { data: cloudData, error } = await supabase
        .from('pengumuman')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(cloudData || []);
    } catch (err) {
      console.error("Gagal sinkronisasi pengumuman di dashboard guru:", err.message);
    } finally {
      setLoadingBroadcast(false);
    }
  };

  // 2. Ambil Hitungan Total Siswa dari Table 'siswa' (Bukan Users)
  const fetchTotalSiswaRealtime = async () => {
    setLoadingStats(true);
    try {
      const { count, error } = await supabase
        .from('siswa')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      setTotalSiswa(count || 0);
    } catch (err) {
      console.error("Gagal mengambil total Big Data siswa:", err.message);
    } finally {
      setLoadingStats(false);
    }
  };

  // Helper pemformatan tanggal lokalisasi Indonesia
  const formatIndoDate = (isoString) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Kalkulasi sederhana penyesuaian dummy tugas terkumpul berdasarkan total siswa dinamis
  const dummyTugasCount = totalSiswa > 0 ? Math.floor(totalSiswa * 0.85) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-left">
      
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-[#306896] to-[#4682b4] p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-2 tracking-tight">Selamat Datang di SITKA Dashboard</h2>
          <p className="opacity-80 font-medium italic">Manajemen kelas jadi lebih mudah dan terintegrasi hari ini.</p>
        </div>
        <BookOpen className="absolute right-[-20px] bottom-[-20px] w-64 h-64 opacity-10 rotate-12" />
      </div>

      {/* --- INFO BROADCAST DARI ADMIN (REALTIME CLOUD) --- */}
      {!loadingBroadcast && announcements.length > 0 && (
        <div className="bg-white p-2 rounded-[2.5rem] border-2 border-orange-500 shadow-xl shadow-orange-100 overflow-hidden">
          <div className="bg-orange-500 p-6 rounded-[2.2rem] text-white flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl shrink-0">
                <Megaphone size={28} className="animate-bounce" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Informasi Kedinasan / Sekolah</p>
                <h3 className="text-xl font-black italic">{announcements[0].title}</h3>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/20 w-full md:max-w-md">
              <p className="text-sm font-bold italic leading-relaxed">"{announcements[0].content}"</p>
              <p className="text-[9px] font-black mt-2 text-right opacity-60 uppercase">
                {formatIndoDate(announcements[0].created_at)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards - Terintegrasi dengan Big Data 'siswa' */}
      {/* --- GRID TOP STATS CARD (HANYA 2 KOTAK) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { 
            label: 'Total Siswa', 
            val: loadingStats ? '...' : `${totalSiswa}`, 
            icon: Users, 
            color: 'text-blue-600', 
            bg: 'bg-blue-50' 
          },
          { 
            label: 'Kehadiran Hari Ini', 
            val: '98%', 
            icon: Clock, 
            color: 'text-green-600', 
            bg: 'bg-green-50' 
          },
          // ✂️ Objek 'Tugas Terkumpul' sudah dibuang dari array ini
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
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-xl font-black text-[#0a1e36]">Ringkasan Anekdot & Kondisi Siswa</h3>

      <p className="text-xs font-bold text-slate-400">Statistik Mood / Catatan Harian Hari Ini</p>

    </div>
  </div>

  {/* Container Grafik Anekdot */}
  <div className="h-64 w-full pt-4">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={dataAnekdotHarian}>
        <XAxis dataKey="kondisi" stroke="#94a3b8" fontSize={12} tickLine={false} />
        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#0a1e36', borderRadius: '16px', color: '#fff', border: 'none' }}
          cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
        />
        <Bar dataKey="jumlah" radius={[12, 12, 0, 0]}>
          {dataAnekdotHarian.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

        {/* Status Kehadiran Ringkasan */}
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-[#0a1e36] mb-8">Status Kehadiran Hari Ini</h3>
            <div className="space-y-6">
              {[
                { status: 'Hadir', count: totalSiswa > 0 ? totalSiswa - 1 : 0, color: 'bg-green-500', percent: '95%' },
                { status: 'Izin', count: totalSiswa > 0 ? 1 : 0, color: 'bg-blue-500', percent: '5%' },
                { status: 'Alpha', count: 0, color: 'bg-red-500', percent: '0%' },
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                    <span className="text-slate-400">{item.status}</span>
                    <span className="text-[#0a1e36]">{item.count} Siswa</span>
                  </div>
                  <div className="w-full h-4 bg-slate-50 rounded-full overflow-hidden p-1 border border-slate-100">
                    <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{width: totalSiswa > 0 ? item.percent : '0%'}}></div>
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
               ⚠️ Informasi Realtime: Total {totalSiswa} siswa aktif terdaftar di database SITKA.
             </p>
          </div>
        </div>
    </div>
  );
};

export default DashboardGuru;