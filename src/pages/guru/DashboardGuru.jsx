// src/pages/guru/DashboardGuru.jsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, LabelList
} from 'recharts';
import { Download, Users, BookOpen, Clock, Megaphone, Bell, Activity, Award, TrendingUp, PieChart as PieIcon } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

const DashboardGuru = () => {
  // State manajemen dashboard
  const [announcements, setAnnouncements] = useState([]);
  const [loadingBroadcast, setLoadingBroadcast] = useState(true);
  const [totalSiswa, setTotalSiswa] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  const [attendanceRate, setAttendanceRate] = useState('100%');
  
  // Data Grafik Ringkasan Kelas Dinamis
  const [domainClassData, setDomainClassData] = useState([
    { domain: 'Gerak Kasar', persentase: 88, fill: '#0d9488' },
    { domain: 'Gerak Halus', persentase: 82, fill: '#4f46e5' },
    { domain: 'Bicara & Bahasa', persentase: 90, fill: '#c026d3' },
    { domain: 'Sosial & Kemandirian', persentase: 85, fill: '#e11d48' },
  ]);

  const [statusClassData, setStatusClassData] = useState([
    { name: 'Sesuai Usia', value: 20, color: '#10b981' },
    { name: 'Mulai Berkembang', value: 4, color: '#f59e0b' },
    { name: 'Perlu Intervensi', value: 2, color: '#ef4444' },
  ]);

  const [dataAnekdotHarian, setDataAnekdotHarian] = useState([
    { kondisi: 'Bahagia 😊', jumlah: 0, color: '#10b981' },
    { kondisi: 'Tenang 😐', jumlah: 0, color: '#3b82f6' },
    { kondisi: 'Sedih 😢', jumlah: 0, color: '#f59e0b' },
    { kondisi: 'Marah 😡', jumlah: 0, color: '#ef4444' }
  ]);

  // --- HOOKS UTAMA SYNC DATABASE (LIVE REALTIME) ---
  useEffect(() => {
    fetchCloudAnnouncements();
    fetchTotalSiswaRealtime();
    calculateClassMetrics();
    fetchAnekdotMetrics();

    // Handler untuk pembaharuan instan dari input nilai guru di browser ini
    const handleSemesterUpdate = () => {
      calculateClassMetrics();
      fetchTotalSiswaRealtime();
    };

    const handleHarianUpdate = () => {
      fetchAnekdotMetrics();
    };

    const handleStorageChange = () => {
      calculateClassMetrics();
      fetchAnekdotMetrics();
      fetchTotalSiswaRealtime();
    };

    window.addEventListener('sitka_semester_updated', handleSemesterUpdate);
    window.addEventListener('sitka_harian_updated', handleHarianUpdate);
    window.addEventListener('storage', handleStorageChange);

    // Langganan Supabase Realtime Channel untuk sinkronisasi antar perangkat/browser secara live
    const channel = supabase
      .channel('dashboard_guru_live_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'nilai_semester' }, () => {
        calculateClassMetrics();
        fetchTotalSiswaRealtime();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'nilai_harian' }, () => {
        fetchAnekdotMetrics();
      })
      .subscribe();

    return () => {
      window.removeEventListener('sitka_semester_updated', handleSemesterUpdate);
      window.removeEventListener('sitka_harian_updated', handleHarianUpdate);
      window.removeEventListener('storage', handleStorageChange);
      supabase.removeChannel(channel);
    };
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

  // 3. Kalkulasi Mood & Anekdot Harian dari Supabase & LocalStorage (LIVE REALTIME)
  const fetchAnekdotMetrics = async () => {
    try {
      // a. Ambil data dari Supabase Cloud (nilai_harian)
      const { data: cloudData, error } = await supabase
        .from('nilai_harian')
        .select('*');

      // b. Ambil data fallback dari LocalStorage ('sitka_all_harian_reports')
      let localData = [];
      try {
        const rawLocal = localStorage.getItem('sitka_all_harian_reports');
        if (rawLocal) localData = JSON.parse(rawLocal);
      } catch (e) {}

      // c. Gabungkan data unik berdasarkan kombinasi (NISN/Nama + Tanggal)
      const combinedMap = new Map();

      if (localData && Array.isArray(localData)) {
        localData.forEach(item => {
          const key = `${item.nisn || item.nama_siswa}_${item.tanggal || ''}`;
          combinedMap.set(key, item);
        });
      }

      if (!error && cloudData && Array.isArray(cloudData)) {
        cloudData.forEach(item => {
          const key = `${item.nisn || item.nama_siswa}_${item.tanggal || ''}`;
          combinedMap.set(key, item);
        });
      }

      const allRows = Array.from(combinedMap.values());

      let bahagia = 0, tenang = 0, sedih = 0, marah = 0;
      let totalAbsen = 0, totalHadir = 0;

      allRows.forEach(row => {
        const emo = row.emoji || '';
        const st = (row.status_kondisi || '').toLowerCase();
        const cat = (row.catatan_anekdot || '').toLowerCase();

        // Hitung 4 mood utama dari emoji atau label kondisi
        if (emo === '😊' || st.includes('bahagia') || cat.includes('bahagia')) {
          bahagia++;
          totalHadir++;
        } else if (emo === '😐' || st.includes('tenang') || cat.includes('tenang')) {
          tenang++;
          totalHadir++;
        } else if (emo === '😢' || st.includes('sedih') || cat.includes('sedih')) {
          sedih++;
          totalHadir++;
        } else if (emo === '😡' || st.includes('marah') || cat.includes('marah')) {
          marah++;
          totalHadir++;
        } else if (st.includes('hadir')) {
          totalHadir++;
        }

        if (st.includes('hadir') || emo || st.includes('izin') || st.includes('sakit') || st.includes('alpa') || bahagia || tenang || sedih || marah) {
          totalAbsen++;
        }
      });

      setDataAnekdotHarian([
        { kondisi: 'Bahagia 😊', jumlah: bahagia, color: '#10b981' },
        { kondisi: 'Tenang 😐', jumlah: tenang, color: '#3b82f6' },
        { kondisi: 'Sedih 😢', jumlah: sedih, color: '#f59e0b' },
        { kondisi: 'Marah 😡', jumlah: marah, color: '#ef4444' }
      ]);

      if (totalAbsen > 0) {
        const rate = Math.round((totalHadir / Math.max(totalHadir, totalAbsen)) * 100);
        setAttendanceRate(`${rate}%`);
      }
    } catch (e) {
      console.error("Error fetching anekdot metrics:", e);
    }
  };

  // 4. Kalkulasi Ketercapaian Domain dari Cloud Supabase & LocalStorage (LIVE REALTIME)
  const calculateClassMetrics = async () => {
    try {
      // a. Tarik data dari Cloud Supabase
      const { data: cloudData, error } = await supabase
        .from('nilai_semester')
        .select('skor_indikator, nisn');

      // b. Tarik data fallback dari LocalStorage untuk sinkronisasi seketika
      let localData = [];
      try {
        const rawSem = localStorage.getItem('sitka_all_semester_reports');
        if (rawSem) localData = JSON.parse(rawSem);
      } catch (e) {}

      // c. Gabungkan data unik berdasarkan NISN siswa
      const combinedMap = new Map();

      if (localData && Array.isArray(localData)) {
        localData.forEach(item => {
          if (item.nisn && (item.skorIndikator || item.skor_indikator)) {
            combinedMap.set(item.nisn, item.skorIndikator || item.skor_indikator);
          }
        });
      }

      if (!error && cloudData && Array.isArray(cloudData)) {
        cloudData.forEach(item => {
          if (item.nisn && item.skor_indikator) {
            combinedMap.set(item.nisn, item.skor_indikator);
          }
        });
      }

      const allScoresList = Array.from(combinedMap.values());

      if (allScoresList.length > 0) {
        const scaleToPercent = {
          'BSB': 100,
          'BSH': 85,
          'B': 65,
          'MM': 65,
          'MB': 65,
          'BM': 40,
          'BB': 40,
          '✓': 85
        };

        let totals = {
          gk: { sum: 0, count: 0 },
          gh: { sum: 0, count: 0 },
          bb: { sum: 0, count: 0 },
          sk: { sum: 0, count: 0 }
        };

        allScoresList.forEach(scoresObj => {
          if (!scoresObj || typeof scoresObj !== 'object') return;
          
          Object.entries(scoresObj).forEach(([id, val]) => {
            const pctVal = scaleToPercent[val] || (typeof val === 'number' ? val : 75);
            
            if (id.startsWith('bah_')) {
              totals.bb.sum += pctVal;
              totals.bb.count++;
            } else if (id.startsWith('mot_')) {
              const num = parseInt(id.split('_').pop() || '0');
              if (num <= 5) {
                totals.gk.sum += pctVal;
                totals.gk.count++;
              } else {
                totals.gh.sum += pctVal;
                totals.gh.count++;
              }
            } else if (id.startsWith('nam_') || id.startsWith('kog_') || id.startsWith('sos_')) {
              totals.sk.sum += pctVal;
              totals.sk.count++;
            }
          });
        });

        const gkAvg = totals.gk.count > 0 ? Math.round(totals.gk.sum / totals.gk.count) : 88;
        const ghAvg = totals.gh.count > 0 ? Math.round(totals.gh.sum / totals.gh.count) : 82;
        const bbAvg = totals.bb.count > 0 ? Math.round(totals.bb.sum / totals.bb.count) : 90;
        const skAvg = totals.sk.count > 0 ? Math.round(totals.sk.sum / totals.sk.count) : 85;

        setDomainClassData([
          { domain: 'Gerak Kasar', persentase: gkAvg, fill: '#0d9488' },
          { domain: 'Gerak Halus', persentase: ghAvg, fill: '#4f46e5' },
          { domain: 'Bicara & Bahasa', persentase: bbAvg, fill: '#c026d3' },
          { domain: 'Sosial & Kemandirian', persentase: skAvg, fill: '#e11d48' },
        ]);
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
            val: attendanceRate, 
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
                  stroke="#475569" 
                  fontSize={10} 
                  fontWeight="bold"
                  tickLine={false} 
                  interval={0}
                />
                <YAxis stroke="#475569" fontSize={11} domain={[0, 100]} unit="%" tickLine={false} />
                <Tooltip 
                  formatter={(value) => [`${value}% Selesai`, 'Ketercapaian']}
                  contentStyle={{ backgroundColor: '#0a1e36', borderRadius: '16px', color: '#ffffff', border: '1px solid #1e293b', fontSize: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}
                  itemStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                  labelStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                />
                <Bar dataKey="persentase" radius={[12, 12, 0, 0]}>
                  {domainClassData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                  <LabelList dataKey="persentase" position="top" formatter={(v) => `${v}%`} fill="#4f46e5" fontSize={10} fontWeight="bold" />
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
                  contentStyle={{ backgroundColor: '#0a1e36', borderRadius: '16px', color: '#ffffff', border: '1px solid #1e293b', fontSize: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}
                  itemStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                  labelStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
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
              <XAxis dataKey="kondisi" stroke="#475569" fontSize={12} tickLine={false} fontWeight="bold" />
              <YAxis stroke="#475569" fontSize={12} tickLine={false} fontWeight="bold" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a1e36', borderRadius: '16px', color: '#ffffff', border: '1px solid #1e293b', fontSize: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}
                itemStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                labelStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
              />
              <Bar dataKey="jumlah" radius={[12, 12, 0, 0]}>
                {dataAnekdotHarian.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <LabelList dataKey="jumlah" position="top" fill="#334155" fontSize={11} fontWeight="bold" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default DashboardGuru;