// src/pages/ortu/DashboardOrtu.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';
import { 
  Star, Calendar, BookOpen, Megaphone, School, Baby, 
  TrendingUp, BarChart3, Smile, Award, Lock, Sparkles, AlertCircle 
} from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

const DashboardOrtu = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loadingBroadcast, setLoadingBroadcast] = useState(true);
  const [parentData, setParentData] = useState(null);
  const [catatanHarian, setCatatanHarian] = useState([]);
  const [hasSemesterEvaluation, setHasSemesterEvaluation] = useState(false);
  const [semesterChartData, setSemesterChartData] = useState([
    { domain: '🌟 Agama & Moral', nilai: 0, label: '0% (Belum Diisi)' },
    { domain: '🏃 Motorik & Fisik', nilai: 0, label: '0% (Belum Diisi)' },
    { domain: '🧠 Kognitif', nilai: 0, label: '0% (Belum Diisi)' },
    { domain: '🗣️ Bahasa & Sosial', nilai: 0, label: '0% (Belum Diisi)' },
  ]);

  useEffect(() => {
    fetchCloudAnnouncements();

    const savedSession = localStorage.getItem('user_session');
    if (savedSession) {
      const parsedData = JSON.parse(savedSession);
      setParentData(parsedData);
      const childName = parsedData.nama_anak || parsedData.namaAnak || parsedData.nama_siswa;
      fetchCatatanAnekdot(childName);
      checkSemesterData(childName);
    }

    const handleHarianLiveUpdate = (e) => {
      const session = localStorage.getItem('user_session');
      if (session) {
        const u = JSON.parse(session);
        const childName = u.nama_anak || u.namaAnak || u.nama_siswa;
        fetchCatatanAnekdot(childName);
      }
    };

    const handleSemesterLiveUpdate = (e) => {
      const session = localStorage.getItem('user_session');
      if (session) {
        const u = JSON.parse(session);
        const childName = u.nama_anak || u.namaAnak || u.nama_siswa;
        checkSemesterData(childName);
      }
    };

    window.addEventListener('sitka_harian_updated', handleHarianLiveUpdate);
    window.addEventListener('sitka_semester_updated', handleSemesterLiveUpdate);

    return () => {
      window.removeEventListener('sitka_harian_updated', handleHarianLiveUpdate);
      window.removeEventListener('sitka_semester_updated', handleSemesterLiveUpdate);
    };
  }, []);

  // 1. TERIKAT REALTIME DENGAN INPUT HARIAN GURU (SUPABASE + LOCALSTORAGE)
  const fetchCatatanAnekdot = async (namaAnak) => {
    if (!namaAnak) return;
    const cleanChild = namaAnak.toLowerCase().trim();

    let combinedHarian = [];

    // Cloud fetch
    try {
      const { data, error } = await supabase
        .from('nilai_harian')
        .select('*')
        .order('tanggal', { ascending: false });

      if (!error && data) {
        combinedHarian = data.filter(d => d.nama_siswa && d.nama_siswa.toLowerCase().trim() === cleanChild);
      }
    } catch (err) {
      console.warn("Gagal menarik cloud harian ortu:", err);
    }

    // Local storage fetch
    try {
      const rawLocal = localStorage.getItem('sitka_all_harian_reports');
      if (rawLocal) {
        const parsed = JSON.parse(rawLocal);
        if (Array.isArray(parsed)) {
          parsed.forEach(p => {
            const pName = (p.nama_siswa || p.namaSiswa || '').toLowerCase().trim();
            if (pName === cleanChild) {
              const exists = combinedHarian.some(c => c.tanggal === p.tanggal);
              if (!exists) combinedHarian.push(p);
            }
          });
        }
      }
    } catch (e) {}

    setCatatanHarian(combinedHarian);
  };

  // KALKULASI DUAL DIMENSI HITUNGAN 4 EMOJI UNTUK GRAFIK BATANG HARIAN
  // Grafik perlahan naik sesuai skala banyaknya input anekdot siswa tersebut
  const emojiChartData = useMemo(() => {
    let bahagiaCount = 0;
    let aktifCount = 0;
    let fokusCount = 0;
    let istimewaCount = 0;

    if (catatanHarian.length > 0) {
      catatanHarian.forEach(rec => {
        const cond = (rec.status_kondisi || '').toLowerCase();
        const em = rec.emoji || '';

        if (cond.includes('bahagia') || cond.includes('senang') || em === '😊') {
          bahagiaCount++;
        } else if (cond.includes('aktif') || cond.includes('kreatif') || em === '⚡' || em === '🎨') {
          aktifCount++;
        } else if (cond.includes('fokus') || cond.includes('konsentrasi') || em === '🎯') {
          fokusCount++;
        } else {
          istimewaCount++;
        }
      });
    } else {
      // Fallback visualisasi awal 0 entri
      bahagiaCount = 1;
      aktifCount = 1;
      fokusCount = 0;
      istimewaCount = 0;
    }

    return [
      { category: 'Bahagia 😊', jumlah: bahagiaCount, fill: '#6366f1' },
      { category: 'Aktif ⚡', jumlah: aktifCount, fill: '#f59e0b' },
      { category: 'Fokus 🎯', jumlah: fokusCount, fill: '#3b82f6' },
      { category: 'Ceria 🌟', jumlah: istimewaCount, fill: '#10b981' },
    ];
  }, [catatanHarian]);

  // 2. CEK EVALUASI SEMESTER (KOSONGKAN JIKA GURU BELUM INPUT)
  const checkSemesterData = async (namaAnak) => {
    if (!namaAnak) return;
    const cleanChild = namaAnak.toLowerCase().trim();
    let semesterRecord = null;

    try {
      const rawSemester = localStorage.getItem('sitka_all_semester_reports');
      if (rawSemester) {
        const parsed = JSON.parse(rawSemester);
        if (Array.isArray(parsed)) {
          semesterRecord = parsed.find(s => (s.nama_siswa || s.namaSiswa || '').toLowerCase().trim() === cleanChild);
        }
      }
    } catch (e) {}

    if (semesterRecord) {
      setHasSemesterEvaluation(true);
      setSemesterChartData([
        { domain: '🌟 Agama & Moral', nilai: 100, label: '100% Sempurna (BSB)' },
        { domain: '🏃 Motorik & Fisik', nilai: 100, label: '100% Sempurna (BSB)' },
        { domain: '🧠 Kognitif', nilai: 100, label: '100% Sempurna (BSB)' },
        { domain: '🗣️ Bahasa & Sosial', nilai: 100, label: '100% Sempurna (BSB)' },
      ]);
    } else {
      setHasSemesterEvaluation(false);
      setSemesterChartData([
        { domain: '🌟 Agama & Moral', nilai: 0, label: '0% (Kosong)' },
        { domain: '🏃 Motorik & Fisik', nilai: 0, label: '0% (Kosong)' },
        { domain: '🧠 Kognitif', nilai: 0, label: '0% (Kosong)' },
        { domain: '🗣️ Bahasa & Sosial', nilai: 0, label: '0% (Kosong)' },
      ]);
    }
  };

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
      console.error("Gagal sinkronisasi pengumuman di dashboard ortu:", err.message);
    } finally {
      setLoadingBroadcast(false);
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

  const attendanceData = [
    { name: 'Hadir', value: 90 }, { name: 'Izin', value: 5 }, { name: 'Alpa', value: 5 },
  ];
  const COLORS = ['#0d9488', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-left">
      
      {/* WELCOME HEADER */}
      <div className="bg-[#0a1e36] p-8 md:p-10 rounded-[3rem] text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black mb-2">Halo, {parentData?.nama || 'Bunda/Ayah'}! 👋</h2>
            <p className="text-blue-200 font-medium">
              Berikut adalah pemantauan grafik perkembangan <span className="text-amber-400 font-bold">{parentData?.nama_anak || 'Anak Anda'}</span> secara harian & semester.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
              <Baby size={20} className="text-amber-400" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Anak Didik</p>
                <p className="text-sm font-black text-white">{parentData?.nama_anak || '-'}</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
              <School size={20} className="text-blue-400" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Kelas</p>
                <p className="text-sm font-black text-white">{parentData?.kelompok || '-'}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-[-20px] top-[-20px] w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* --- INFO PENGUMUMAN DARI ADMIN --- */}
      {!loadingBroadcast && announcements.length > 0 && (
        <div className="bg-gradient-to-br from-orange-500 to-rose-500 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Megaphone size={28} className="animate-bounce" />
              <h3 className="text-xl font-black italic tracking-tight">Informasi Penting Sekolah</h3>
            </div>
            <div className="space-y-4">
              {announcements.slice(0, 1).map((info) => (
                <div key={info.id} className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/20 shadow-inner">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-2">
                    <h4 className="font-black text-2xl tracking-tight">📢 {info.title}</h4>
                    <span className="text-[10px] font-black bg-white/20 px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">
                      {formatIndoDate(info.created_at)}
                    </span>
                  </div>
                  <p className="text-orange-50 font-medium leading-relaxed italic text-lg opacity-90">
                    "{info.content}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* SECTION GRAFIK 1: GRAFIK BATANG ANEKDOT HARIAN (4 EMOJI) & GRAFIK SEMESTER */}
      {/* ======================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* GRAFIK 1: GRAFIK BATANG ANEKDOT HARIAN (4 EMOJI - PERLAHAN NAIK SESUAI SKALA INPUT) */}
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4 text-left">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Smile size={20} className="text-amber-500" />
                <h3 className="text-lg font-black text-[#0a1e36]">Grafik Frekuensi Anekdot Harian</h3>
              </div>
              <p className="text-xs font-medium text-slate-400">Skala grafik batang naik seiring banyaknya input anekdot dari Guru</p>
            </div>
            <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
              ⚡ {catatanHarian.length} Total Entri
            </span>
          </div>

          {/* BAR CHART GRAFIK HARIAN 4 EMOJI */}
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emojiChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} fontWeight="bold" tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  formatter={(val, name, item) => [`${val} Catatan Anekdot`, item.payload.category]}
                  contentStyle={{ backgroundColor: '#0a1e36', borderRadius: '16px', color: '#fff', border: 'none', fontSize: '11px' }}
                />
                <Bar dataKey="jumlah" radius={[12, 12, 0, 0]}>
                  {emojiChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-400 font-medium italic text-center">
            💡 Setiap kali Guru menginput catatan harian baru untuk si kecil, batang emoji bersangkutan akan naik secara real-time.
          </p>
        </div>

        {/* GRAFIK 2: GRAFIK CAPAIAN SEMESTER (KOSONGKAN JIKA GURU BELUM INPUT) */}
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4 text-left">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Award size={20} className="text-purple-600" />
                <h3 className="text-lg font-black text-[#0a1e36]">Grafik Capaian Semester</h3>
              </div>
              <p className="text-xs font-medium text-slate-400">Rapor evaluasi capaian semester dari Pendidik</p>
            </div>
            
            {hasSemesterEvaluation ? (
              <span className="text-[10px] font-black bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-200">
                ✨ 100% Terisi
              </span>
            ) : (
              <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1">
                <Lock size={12} /> Belum Ada Nilai
              </span>
            )}
          </div>

          {/* BAR CHART GRAFIK SEMESTER */}
          <div className="h-64 w-full pt-2 relative">
            {!hasSemesterEvaluation && (
              <div className="absolute inset-0 z-10 bg-white/75 backdrop-blur-[1px] rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-2 border border-dashed border-slate-200">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Lock size={24} />
                </div>
                <h4 className="font-black text-slate-800 text-sm">Grafik Semester Masih Kosong</h4>
                <p className="text-[11px] text-slate-400 max-w-xs">
                  Wali Kelas belum menginput nilai evaluasi semester. Grafik akan otomatis tampil sempurna 100% saat nilai diterbitkan.
                </p>
              </div>
            )}

            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={semesterChartData} margin={{ top: 10, right: 10, left: -25, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="domain" stroke="#94a3b8" fontSize={9} fontWeight="bold" tickLine={false} interval={0} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} unit="%" tickLine={false} />
                <Tooltip 
                  formatter={(val, name, item) => [item.payload.label, 'Capaian']}
                  contentStyle={{ backgroundColor: '#0a1e36', borderRadius: '16px', color: '#fff', border: 'none', fontSize: '11px' }}
                />
                <Bar dataKey="nilai" fill={hasSemesterEvaluation ? '#8b5cf6' : '#cbd5e1'} radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* KEHADIRAN BULANAN & JURNAL HARIAN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GRAFIK LINGKARAN KEHADIRAN */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center">
          <h3 className="text-base font-bold text-[#0a1e36] mb-4 flex items-center gap-2">
            <Calendar className="text-teal-600" size={18} /> Kehadiran Bulanan
          </h3>
          <div className="h-52 w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={attendanceData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                  {attendanceData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2">
            {attendanceData.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                <span className="text-xs font-bold text-slate-500">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CATATAN HARIAN TERBARU (BUKU PENGHUBUNG) */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h3 className="text-base font-bold text-[#0a1e36] mb-6 flex items-center gap-2">
            <BookOpen className="text-indigo-600" size={18} /> Jurnal Cerdas & Catatan Anekdot Harian
          </h3>
          
          {catatanHarian.length > 0 ? (
            <div className="space-y-4">
              {catatanHarian.map((catatan, i) => (
                <div key={i} className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-white hover:shadow-md transition-all">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2.5 mb-2">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-xl uppercase tracking-widest ${
                        ['Bahagia', 'Senang', 'Ceria'].includes(catatan.status_kondisi) ? 'bg-indigo-100 text-indigo-700' :
                        ['Tenang', 'Baik'].includes(catatan.status_kondisi) ? 'bg-emerald-100 text-emerald-700' :
                        ['Kreatif', 'Aktif'].includes(catatan.status_kondisi) ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {catatan.emoji || '😊'} {catatan.status_kondisi || 'Kondisi Baik'}
                      </span>
                      <div className="flex items-center gap-1 text-slate-400">
                        <Calendar size={12} />
                        <span className="text-[10px] font-bold font-mono">{catatan.tanggal}</span>
                      </div>
                    </div>
                    <p className="text-slate-600 font-medium text-xs leading-relaxed italic">
                      "{catatan.catatan_anekdot || 'Ananda belajar dan bermain dengan baik hari ini.'}"
                    </p>
                  </div>
                  <div className="text-left md:text-right md:border-l border-slate-200 md:pl-5">
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Pendidik</p>
                    <p className="text-xs font-black text-[#0a1e36]">{catatan.input_oleh_guru || 'Wali Kelas'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold text-xs italic">Opsi pemantauan harian akan muncul ketika Wali Kelas menerbitkan catatan untuk ananda.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default DashboardOrtu;