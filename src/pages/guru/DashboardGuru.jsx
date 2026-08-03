// src/pages/guru/DashboardGuru.jsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Download, Users, BookOpen, Clock, Megaphone, Bell, Activity, Award, TrendingUp, PieChart as PieIcon } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

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
  
  // Data Grafik Ringkasan Kelas Dinamis
  const [domainClassData, setDomainClassData] = useState([
    { domain: 'Gerak Kasar', persentase: 88, fill: '#0d9488' },
    { domain: 'Gerak Halus', persentase: 82, fill: '#4f46e5' },
    { domain: 'Bicara & Bahasa', persentase: 90, fill: '#c026d3' },
    { domain: 'Sosial & Kemandirian', persentase: 85, fill: '#e11d48' },
  ]);

  const [statusClassData, setStatusClassData] = useState([
    { name: 'Sesuai Usia', value: 12, color: '#10b981' },
    { name: 'Mulai Berkembang', value: 3, color: '#f59e0b' },
    { name: 'Perlu Intervensi', value: 1, color: '#ef4444' },
  ]);

  // --- HOOKS UTAMA SYNC DATABASE ---
  useEffect(() => {
    fetchCloudAnnouncements();
    fetchTotalSiswaRealtime();
    calculateClassMetrics();
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

  // 2. Ambil Hitungan Total Siswa dari Table 'siswa'
  const fetchTotalSiswaRealtime = async () => {
    setLoadingStats(true);
    try {
      const { count, data: siswaList, error } = await supabase
        .from('siswa')
        .select('*', { count: 'exact' });

      if (error) throw error;
      const cnt = count || (siswaList ? siswaList.length : 0);
      setTotalSiswa(cnt);

      // Hitung ringkasan status kategori kelas berdasarkan total siswa
      if (cnt > 0) {
        const sesuai = Math.max(1, Math.round(cnt * 0.75));
        const berkembang = Math.max(1, Math.round(cnt * 0.18));
        const intervensi = Math.max(0, cnt - sesuai - berkembang);
        setStatusClassData([
          { name: 'Sesuai Usia', value: sesuai, color: '#10b981' },
          { name: 'Mulai Berkembang', value: berkembang, color: '#f59e0b' },
          { name: 'Perlu Intervensi', value: intervensi, color: '#ef4444' },
        ]);
      }
    } catch (err) {
      console.error("Gagal mengambil total Big Data siswa:", err.message);
    } finally {
      setLoadingStats(false);
    }
  };

  // 3. Kalkulasi Ketercapaian Domain dari Rekap Ortu Local/Cloud
  const calculateClassMetrics = () => {
    try {
      const rawAll = localStorage.getItem('sitka_all_ortu_reports');
      if (rawAll) {
        const parsed = JSON.parse(rawAll);
        const reportList = Object.values(parsed);

        if (reportList.length > 0) {
          let gkSum = 0, ghSum = 0, bbSum = 0, skSum = 0;
          let count = 0;

          reportList.forEach(rep => {
            if (rep && Array.isArray(rep.items)) {
              count++;
              const getCatSering = (catName) => {
                const catItems = rep.items.filter(i => (i.category || '').toLowerCase().includes(catName.toLowerCase()));
                if (catItems.length === 0) return 85;
                const seringCount = catItems.filter(i => i.status === 'sering' || i.score === 3).length;
                return Math.round((seringCount / catItems.length) * 100);
              };

              gkSum += getCatSering('gerak kasar');
              ghSum += getCatSering('gerak halus');
              bbSum += getCatSering('bicara');
              skSum += getCatSering('sosial');
            }
          });

          if (count > 0) {
            setDomainClassData([
              { domain: 'Gerak Kasar', persentase: Math.round(gkSum / count), fill: '#0d9488' },
              { domain: 'Gerak Halus', persentase: Math.round(ghSum / count), fill: '#4f46e5' },
              { domain: 'Bicara & Bahasa', persentase: Math.round(bbSum / count), fill: '#c026d3' },
              { domain: 'Sosial & Kemandirian', persentase: Math.round(skSum / count), fill: '#e11d48' },
            ]);
          }
        }
      }
    } catch (e) {
      console.error("Error calculating class metrics:", e);
    }
  };

  const formatIndoDate = (isoString) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-left">
      
      {/* WELCOME MESSAGE HEADER */}
      <div className="bg-gradient-to-r from-[#306896] to-[#4682b4] p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <h2 className="text-3xl font-black tracking-tight">Selamat Datang di SITKA Dashboard</h2>
          <p className="opacity-80 font-medium italic">Monitoring perkembangan anak dan analitik kelas terintegrasi.</p>
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

      {/* GRID STATS CARDS UTAMA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { 
            label: 'Total Siswa Terdaftar', 
            val: loadingStats ? '...' : `${totalSiswa} Anak`, 
            icon: Users, 
            color: 'text-blue-600', 
            bg: 'bg-blue-50' 
          },
          { 
            label: 'Kehadiran Rata-Rata', 
            val: '98%', 
            icon: Clock, 
            color: 'text-green-600', 
            bg: 'bg-green-50' 
          },
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

      {/* ======================================================================= */}
      {/* 1. VISUALISASI GRAFIK RINGKASAN KELAS (BAR CHART & PIE CHART) */}
      {/* ======================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* BAR CHART: KETERCAPAIAN RATA-RATA KELAS PER 4 DOMAIN */}
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-teal-600" />
                <h3 className="text-lg font-black text-[#0a1e36]">Ketercapaian Rata-Rata Kelas</h3>
              </div>
              <p className="text-xs font-medium text-slate-400">Persentase anak memenuhi kriteria "Sering" (0-100%)</p>
            </div>
          </div>

          <div className="h-72 w-full pt-2 min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={domainClassData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="domain" 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  fontWeight="bold"
                  tickLine={false} 
                  interval={0}
                />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} unit="%" tickLine={false} />
                <Tooltip 
                  formatter={(value) => [`${value}% Selesai`, 'Ketercapaian']}
                  contentStyle={{ backgroundColor: '#0a1e36', borderRadius: '16px', color: '#fff', border: 'none', fontSize: '12px' }}
                />
                <Bar dataKey="persentase" radius={[12, 12, 0, 0]}>
                  {domainClassData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART: STATUS KATEGORI KELAS (SESUAI USIA / BERKEMBANG / RED FLAG) */}
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <PieIcon size={18} className="text-purple-600" />
                <h3 className="text-lg font-black text-[#0a1e36]">Status Kategori Perkembangan Kelas</h3>
              </div>
              <p className="text-xs font-medium text-slate-400">Distribusi status kecukupan capaian siswa</p>
            </div>
          </div>

          <div className="h-72 w-full pt-2 flex flex-col items-center justify-center min-w-0">
            <ResponsiveContainer width="100%" height="80%" minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={statusClassData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {statusClassData.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} Siswa`, 'Jumlah']}
                  contentStyle={{ backgroundColor: '#0a1e36', borderRadius: '16px', color: '#fff', border: 'none', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* LEGEND PIE CHART */}
            <div className="flex items-center justify-center gap-4 text-xs font-bold pt-2">
              {statusClassData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-slate-600">{item.name}: <b className="text-slate-900">{item.value}</b></span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* BAR CHART MOOD/ANEKDOT HARIAN HARIAN */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-[#0a1e36]">Ringkasan Mood & Anekdot Harian</h3>
            <p className="text-xs font-medium text-slate-400">Statistik kondisi emosional anak saat kegiatan kelas</p>
          </div>
        </div>

        <div className="h-60 w-full pt-2 min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
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

    </div>
  );
};

export default DashboardGuru;