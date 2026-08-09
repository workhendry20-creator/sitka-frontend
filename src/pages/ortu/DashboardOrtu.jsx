// src/pages/ortu/DashboardOrtu.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LabelList
} from 'recharts';
import {
  Star, Calendar, BookOpen, Megaphone, School, Baby,
  TrendingUp, BarChart3, Smile, Award, Lock, Sparkles, AlertCircle, ArrowRight, FileText
} from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

const DashboardOrtu = () => {
  const navigate = useNavigate();
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

    // Cloud fetch dari Supabase
    try {
      const { data, error } = await supabase
        .from('nilai_harian')
        .select('*')
        .order('tanggal', { ascending: false });

      if (!error && data) {
        combinedHarian = data.filter(d => {
          if (!d.nama_siswa) return false;
          const sName = d.nama_siswa.toLowerCase().trim();
          return sName === cleanChild || sName.includes(cleanChild) || cleanChild.includes(sName);
        });
      }
    } catch (err) {
      console.warn("Gagal menarik cloud harian ortu:", err);
    }

    // Local storage fetch (sitka_all_harian_reports)
    try {
      const rawLocal = localStorage.getItem('sitka_all_harian_reports');
      if (rawLocal) {
        const parsed = JSON.parse(rawLocal);
        if (Array.isArray(parsed)) {
          parsed.forEach(p => {
            const pName = (p.nama_siswa || p.namaSiswa || '').toLowerCase().trim();
            if (pName && (pName === cleanChild || pName.includes(cleanChild) || cleanChild.includes(pName))) {
              const exists = combinedHarian.some(c => (c.tanggal === p.tanggal && (c.nama_siswa || '').toLowerCase().trim() === pName));
              if (!exists) combinedHarian.push(p);
            }
          });
        }
      }
    } catch (e) { }

    // Local storage fetch (sitka_rekap_data fallback)
    try {
      const rawRekap = localStorage.getItem('sitka_rekap_data');
      if (rawRekap) {
        const parsedRekap = JSON.parse(rawRekap);
        if (Array.isArray(parsedRekap)) {
          parsedRekap.forEach(r => {
            const rName = (r.nama || r.nama_siswa || '').toLowerCase().trim();
            if (rName && (rName === cleanChild || rName.includes(cleanChild) || cleanChild.includes(rName)) && (!r.label || !r.label.includes('Semester'))) {
              const exists = combinedHarian.some(c => c.tanggal === r.tanggal);
              if (!exists) {
                combinedHarian.push({
                  tanggal: r.tanggal || 'Hari Ini',
                  nama_siswa: r.nama,
                  status_kondisi: r.label || 'Bahagia',
                  emoji: r.emoji || '😊',
                  catatan_anekdot: r.catatan || '',
                  input_oleh_guru: `Wali Kelas ${r.kelompok || ''}`
                });
              }
            }
          });
        }
      }
    } catch (e) { }

    setCatatanHarian(combinedHarian);
  };

  // KALKULASI DUAL DIMENSI HITUNGAN 4 EMOJI UNTUK GRAFIK BATANG HARIAN
  // Grafik perlahan naik secara akurat sesuai presisi input anekdot Guru (Bahagia, Tenang, Sedih, Marah)
  const emojiChartData = useMemo(() => {
    let bahagiaCount = 0;
    let tenangCount = 0;
    let sedihCount = 0;
    let marahCount = 0;

    if (catatanHarian.length > 0) {
      catatanHarian.forEach(rec => {
        const cond = (rec.status_kondisi || rec.label || '').toLowerCase();
        const em = rec.emoji || '';

        if (cond.includes('bahagia') || cond.includes('senang') || em === '😊') {
          bahagiaCount++;
        } else if (cond.includes('tenang') || cond.includes('fokus') || cond.includes('baik') || em === '😐') {
          tenangCount++;
        } else if (cond.includes('sedih') || cond.includes('menangis') || em === '😢') {
          sedihCount++;
        } else if (cond.includes('marah') || cond.includes('istimewa') || cond.includes('aktif') || cond.includes('kreatif') || cond.includes('ceria') || em === '😡' || em === '🌟' || em === '⚡') {
          marahCount++;
        } else {
          bahagiaCount++;
        }
      });
    }

    return [
      { category: 'Bahagia 😊', jumlah: bahagiaCount, fill: '#6366f1' },
      { category: 'Tenang 😐', jumlah: tenangCount, fill: '#3b82f6' },
      { category: 'Sedih 😢', jumlah: sedihCount, fill: '#f43f5e' },
      { category: 'Marah 😡', jumlah: marahCount, fill: '#ef4444' },
    ];
  }, [catatanHarian]);

  // 2. CEK EVALUASI SEMESTER (KOSONGKAN JIKA GURU BELUM INPUT, HITUNG SKOR RIIL JIKA SUDAH)
  const checkSemesterData = async (namaAnak) => {
    if (!namaAnak) return;
    const cleanChild = namaAnak.toLowerCase().trim();
    let semesterRecord = null;

    // Cloud fetch Supabase
    try {
      const { data, error } = await supabase
        .from('nilai_semester')
        .select('*');
      if (!error && data) {
        semesterRecord = data.find(s => {
          if (!s.nama_siswa) return false;
          const sName = s.nama_siswa.toLowerCase().trim();
          return sName === cleanChild || sName.includes(cleanChild) || cleanChild.includes(sName);
        });
      }
    } catch (e) { }

    // Local storage fallback
    if (!semesterRecord) {
      try {
        const rawSemester = localStorage.getItem('sitka_all_semester_reports');
        if (rawSemester) {
          const parsed = JSON.parse(rawSemester);
          if (Array.isArray(parsed)) {
            semesterRecord = parsed.find(s => {
              const sName = (s.nama_siswa || s.namaSiswa || '').toLowerCase().trim();
              return sName && (sName === cleanChild || sName.includes(cleanChild) || cleanChild.includes(sName));
            });
          }
        }
      } catch (e) { }
    }

    if (semesterRecord) {
      setHasSemesterEvaluation(true);

      // Hitung skor riil per domain dari skor_indikator input Guru
      const skorInd = semesterRecord.skor_indikator || {};
      const calculateDomainScore = (prefix) => {
        const entries = Object.entries(skorInd).filter(([key]) => key.startsWith(prefix));
        if (entries.length === 0) return 100;
        const total = entries.reduce((acc, [, val]) => {
          if (val === 'BSB') return acc + 100;
          if (val === 'BSH') return acc + 75;
          if (val === 'MM') return acc + 50;
          if (val === 'BM') return acc + 25;
          return acc;
        }, 0);
        return Math.round(total / entries.length);
      };

      const agamaScore = calculateDomainScore('nam_');
      const motorikScore = calculateDomainScore('mot_');
      const kognitifScore = calculateDomainScore('kog_');
      const bahasaScore = Math.round((calculateDomainScore('bah_') + calculateDomainScore('se_')) / 2);

      setSemesterChartData([
        { domain: '🌟 Agama & Moral', nilai: agamaScore, label: `${agamaScore}% Capaian` },
        { domain: '🏃 Motorik & Fisik', nilai: motorikScore, label: `${motorikScore}% Capaian` },
        { domain: '🧠 Kognitif', nilai: kognitifScore, label: `${kognitifScore}% Capaian` },
        { domain: '🗣️ Bahasa & Sosial', nilai: bahasaScore, label: `${bahasaScore}% Capaian` },
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

  // KALKULASI KEHADIRAN BULANAN REAL DARI ENTRI HARIAN GURU (TANPA DUMMY DATA)
  const realAttendanceData = useMemo(() => {
    if (!catatanHarian || catatanHarian.length === 0) {
      return {
        hasData: false,
        totalHari: 0,
        data: [
          { name: 'Belum Ada Data', value: 1, color: '#cbd5e1' }
        ]
      };
    }

    let hadirCount = 0;
    let izinCount = 0;
    let alpaCount = 0;

    catatanHarian.forEach(rec => {
      const cond = (rec.status_kondisi || rec.label || '').toLowerCase();
      const cat = (rec.catatan_anekdot || rec.catatan || '').toLowerCase();

      if (cond.includes('izin') || cond.includes('sakit') || cat.includes('izin') || cat.includes('sakit')) {
        izinCount++;
      } else if (cond.includes('alpa') || cond.includes('tanpa keterangan') || cat.includes('alpa')) {
        alpaCount++;
      } else {
        // Setiap kali guru menginput catatan/kondisi harian anak di sekolah = Anak HADIR
        hadirCount++;
      }
    });

    const list = [];
    if (hadirCount > 0) list.push({ name: 'Hadir', value: hadirCount, color: '#0d9488' });
    if (izinCount > 0) list.push({ name: 'Izin / Sakit', value: izinCount, color: '#f59e0b' });
    if (alpaCount > 0) list.push({ name: 'Alpa', value: alpaCount, color: '#ef4444' });

    return {
      hasData: true,
      totalHari: catatanHarian.length,
      hadirCount,
      izinCount,
      alpaCount,
      data: list
    };
  }, [catatanHarian]);

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
          <div className="h-64 w-full pt-2 min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={emojiChartData} margin={{ top: 20, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="category" stroke="#475569" fontSize={11} fontWeight="bold" tickLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  formatter={(val, name, item) => [`${val} Catatan Anekdot`, item.payload.category]}
                  contentStyle={{ backgroundColor: '#0a1e36', borderRadius: '16px', color: '#ffffff', border: '1px solid #1e293b', fontSize: '11px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}
                  itemStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                  labelStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                />
                <Bar dataKey="jumlah" radius={[12, 12, 0, 0]}>
                  {emojiChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                  <LabelList dataKey="jumlah" position="top" fill="#334155" fontSize={11} fontWeight="bold" />
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
                ✨ Rapor Terbit
              </span>
            ) : (
              <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1">
                <Lock size={12} /> Belum Ada Nilai
              </span>
            )}
          </div>

          {/* BAR CHART GRAFIK SEMESTER */}
          <div className="h-64 w-full pt-2 relative min-w-0">
            {!hasSemesterEvaluation && (
              <div className="absolute inset-0 z-10 bg-white/75 backdrop-blur-[1px] rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-2 border border-dashed border-slate-200">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Lock size={24} />
                </div>
                <h4 className="font-black text-slate-800 text-sm">Grafik Semester Masih Kosong</h4>
                <p className="text-[11px] text-slate-400 max-w-xs">
                  Wali Kelas belum menginput nilai evaluasi semester. Grafik akan otomatis tampil saat nilai diterbitkan.
                </p>
              </div>
            )}

            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={semesterChartData} margin={{ top: 20, right: 10, left: -25, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="domain" stroke="#475569" fontSize={9} fontWeight="bold" tickLine={false} interval={0} />
                <YAxis stroke="#475569" fontSize={11} domain={[0, 100]} unit="%" tickLine={false} />
                <Tooltip
                  formatter={(val, name, item) => [item.payload.label, 'Capaian']}
                  contentStyle={{ backgroundColor: '#0a1e36', borderRadius: '16px', color: '#ffffff', border: '1px solid #1e293b', fontSize: '11px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}
                  itemStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                  labelStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                />
                <Bar dataKey="nilai" fill={hasSemesterEvaluation ? '#8b5cf6' : '#cbd5e1'} radius={[12, 12, 0, 0]}>
                  <LabelList dataKey="nilai" position="top" formatter={(v) => `${v}%`} fill="#6d28d9" fontSize={10} fontWeight="bold" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* KEHADIRAN BULANAN & JURNAL HARIAN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* GRAFIK LINGKARAN KEHADIRAN (MURNI DATA RIIL) */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center justify-between text-center relative space-y-3">
          <div className="w-full flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-[#0a1e36] flex items-center gap-2">
              <Calendar className="text-teal-600" size={18} /> Kehadiran Bulanan
            </h3>
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
              realAttendanceData.hasData 
              ? 'bg-teal-50 text-teal-700 border border-teal-200' 
              : 'bg-slate-100 text-slate-500 border border-slate-200'
            }`}>
              {realAttendanceData.hasData ? `✨ ${realAttendanceData.totalHari} Hari Terkalkulasi` : '🔒 Belum Ada Data'}
            </span>
          </div>

          <div className="h-52 w-full min-w-0 relative flex items-center justify-center">
            {!realAttendanceData.hasData && (
              <div className="absolute inset-0 z-10 bg-white/85 backdrop-blur-[1px] rounded-2xl flex flex-col items-center justify-center p-4 text-center space-y-1.5 border border-dashed border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Lock size={20} />
                </div>
                <h4 className="font-black text-slate-800 text-xs">Belum Ada Data Presensi</h4>
                <p className="text-[10px] text-slate-400 max-w-[180px] leading-tight">
                  Presensi akan terkalkulasi otomatis secara real-time dari entri harian Wali Kelas.
                </p>
              </div>
            )}

            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart>
                <Pie 
                  data={realAttendanceData.data} 
                  innerRadius={50} 
                  outerRadius={70} 
                  paddingAngle={realAttendanceData.hasData ? 5 : 0} 
                  dataKey="value"
                >
                  {realAttendanceData.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                {realAttendanceData.hasData && (
                  <Tooltip 
                    formatter={(val, name) => [`${val} Hari`, name]}
                    contentStyle={{ backgroundColor: '#0a1e36', borderRadius: '16px', color: '#ffffff', border: '1px solid #1e293b', fontSize: '11px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}
                    itemStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                    labelStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                  />
                )}
              </PieChart>
            </ResponsiveContainer>
          </div>

          {realAttendanceData.hasData ? (
            <div className="flex flex-wrap justify-center gap-2 text-xs font-bold pt-1">
              {realAttendanceData.data.map((d, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></div>
                  <span className="text-slate-600">{d.name}: <b className="text-slate-900">{d.value} Hari</b></span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[10px] text-slate-400 font-medium italic pt-1">
              💡 Grafik donut kehadiran akan otomatis terisi saat Guru mencatat aktivitas harian.
            </p>
          )}
        </div>

        {/* CATATAN HARIAN TERBARU (BUKU PENGHUBUNG) - MAX 3 ENTRI DENGAN NAVIGASI LAPORAN */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-[#0a1e36] flex items-center gap-2">
              <BookOpen className="text-indigo-600" size={18} /> Jurnal Cerdas & Catatan Anekdot Harian
            </h3>
          </div>

          {catatanHarian.length > 0 ? (
            <div className="space-y-4">
              {catatanHarian.slice(0, 3).map((catatan, i) => (
                <div key={i} className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-white hover:shadow-md transition-all">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2.5 mb-2">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-xl uppercase tracking-widest ${['Bahagia', 'Senang', 'Ceria'].includes(catatan.status_kondisi) ? 'bg-indigo-100 text-indigo-700' :
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

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/ortu/laporan')}
                  className="w-full py-3.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 border border-indigo-100 shadow-2xs hover:scale-[1.01] active:scale-[0.99]"
                >
                  <FileText size={14} /> Lihat Catatan Lengkap Lainnya <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-10 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-2xs">
                <BookOpen size={28} />
              </div>
              <h4 className="font-black text-[#0a1e36] text-base">Belum Ada Catatan Anekdot Harian</h4>
              <p className="text-xs text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
                Wali Kelas belum menginput catatan harian untuk <span className="font-bold text-slate-600">{parentData?.nama_anak || parentData?.namaAnak || 'ananda'}</span>. Jurnal ini akan otomatis terupdate secara real-time setiap kali Guru menginput anekdot harian baru.
              </p>
              <button
                type="button"
                onClick={() => navigate('/ortu/laporan')}
                className="mt-2 px-5 py-2.5 bg-white text-indigo-600 border border-slate-200 hover:border-indigo-300 rounded-full font-black text-xs uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
              >
                <FileText size={14} /> Buka Fitur Laporan <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default DashboardOrtu;