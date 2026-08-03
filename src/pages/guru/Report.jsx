// src/pages/guru/Report.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  ClipboardCheck, Search, User, ArrowUpRight, 
  CheckCircle2, Clock, AlertCircle, Layers, ChevronDown, ChevronUp, Lock,
  Database, Sparkles, BarChart3, TrendingUp, BookOpen,
  Award, Eye, Filter, Heart, Activity, FileText, Video, Calendar, UserCheck
} from 'lucide-react';
import Swal from 'sweetalert2';
import { supabase } from '../../utils/supabaseClient';
import { dapatkanRekomendasiAI } from '../../utils/naiveBayes';

const getEmojiForCondition = (statusKondisi = '', emoji = '') => {
  if (emoji && emoji.length > 0 && emoji !== '😊') return emoji;
  const s = (statusKondisi || '').toLowerCase();
  if (s.includes('bahagia') || s.includes('senang')) return '😊';
  if (s.includes('sedih') || s.includes('menangis')) return '😢';
  if (s.includes('aktif') || s.includes('semangat')) return '⚡';
  if (s.includes('fokus') || s.includes('konsentrasi')) return '🎯';
  if (s.includes('kreatif') || s.includes('seni')) return '🎨';
  if (s.includes('kooperatif') || s.includes('bersama')) return '🤝';
  return emoji || '😊';
};

const ReportGuru = () => {
  // Mode Tab: 'overview' | 'harian' | 'ortu' | 'semester'
  const [activeTab, setActiveTab] = useState('overview'); 
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKelompok, setSelectedKelompok] = useState("Kelompok A"); 
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  // Big Data Storage States
  const [harianData, setHarianData] = useState([]);
  const [semesterData, setSemesterData] = useState([]);

  // Individual Student Profile Chart State & Overview Expand State
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [showAllOverviewStudents, setShowAllOverviewStudents] = useState(false);

  // Student terpilih untuk grafik individu
  const selectedStudent = useMemo(() => {
    if (reports.length === 0) return null;
    return reports.find(r => r.id === selectedStudentId) || reports[0];
  }, [reports, selectedStudentId]);

  // Data RadarChart: Keseimbangan 4 Domain Siswa (Tanpa Data Dummy)
  const radarData = useMemo(() => {
    if (!selectedStudent) {
      return [
        { domain: 'Gerak Kasar', skor: 0 },
        { domain: 'Gerak Halus', skor: 0 },
        { domain: 'Bicara & Bahasa', skor: 0 },
        { domain: 'Sosial & Kemandirian', skor: 0 }
      ];
    }

    const items = selectedStudent.detailProgressOrtu || [];
    const getDomainScore = (domainName) => {
      const match = items.filter(i => (i.category || '').toLowerCase().includes(domainName.toLowerCase()));
      if (match.length === 0) return selectedStudent.hasSemester ? 100 : 0;
      const seringCount = match.filter(i => i.status === 'sering' || i.score === 3).length;
      return Math.round((seringCount / match.length) * 100);
    };

    return [
      { domain: 'Gerak Kasar', skor: getDomainScore('gerak kasar') },
      { domain: 'Gerak Halus', skor: getDomainScore('gerak halus') },
      { domain: 'Bicara & Bahasa', skor: getDomainScore('bicara') },
      { domain: 'Sosial & Kemandirian', skor: getDomainScore('sosial') }
    ];
  }, [selectedStudent]);

  // Data BarChart: Grafik Capaian Semester Siswa
  const studentSemesterChartData = useMemo(() => {
    if (!selectedStudent || !selectedStudent.hasSemester) {
      return [
        { domain: 'Agama & Moral', nilai: 0, label: '0% (Kosong)' },
        { domain: 'Motorik & Fisik', nilai: 0, label: '0% (Kosong)' },
        { domain: 'Kognitif', nilai: 0, label: '0% (Kosong)' },
        { domain: 'Bahasa & Sosial', nilai: 0, label: '0% (Kosong)' },
      ];
    }
    return [
      { domain: 'Agama & Moral', nilai: 100, label: '100% Sempurna (BSB)' },
      { domain: 'Motorik & Fisik', nilai: 100, label: '100% Sempurna (BSB)' },
      { domain: 'Kognitif', nilai: 100, label: '100% Sempurna (BSB)' },
      { domain: 'Bahasa & Sosial', nilai: 100, label: '100% Sempurna (BSB)' },
    ];
  }, [selectedStudent]);

  // --- AMBIL DATA PROGRESS SISWA DARI SUPABASE & LOCALSTORAGE ORTU ---
  useEffect(() => {
    fetchProgressSiswa();

    const handleHarianUpdated = () => fetchProgressSiswa();
    const handleSemesterUpdated = () => fetchProgressSiswa();

    window.addEventListener('sitka_harian_updated', handleHarianUpdated);
    window.addEventListener('sitka_semester_updated', handleSemesterUpdated);

    return () => {
      window.removeEventListener('sitka_harian_updated', handleHarianUpdated);
      window.removeEventListener('sitka_semester_updated', handleSemesterUpdated);
    };
  }, [selectedKelompok]);

  const fetchProgressSiswa = async () => {
    setLoading(true);
    try {
      const dbRombel = selectedKelompok === 'Kelompok A' ? 'A' : 'B';

      // 1. Tarik data riil dari tabel 'siswa' 
      const { data: dataSiswa, error: errSiswa } = await supabase
        .from('siswa')
        .select('id, nama, nisn, rombel')
        .eq('rombel', dbRombel)
        .order('nama', { ascending: true });

      if (errSiswa) throw errSiswa;

      // 2. Tarik Data Nilai Harian Guru (Cloud + LocalStorage Day-by-Day Sinkron)
      let combinedHarian = [];
      try {
        const { data: dataHar } = await supabase
          .from('nilai_harian')
          .select('*')
          .eq('kelompok', selectedKelompok)
          .order('tanggal', { ascending: false });
        if (dataHar && dataHar.length > 0) {
          combinedHarian = [...dataHar];
        }
      } catch (e) {
        console.warn("Belum ada tabel nilai_harian di cloud, menggunakan fallback.");
      }

      // Ambil dari sitka_all_harian_reports
      try {
        const rawLocalHar = localStorage.getItem('sitka_all_harian_reports');
        if (rawLocalHar) {
          const localHarList = JSON.parse(rawLocalHar);
          if (Array.isArray(localHarList)) {
            localHarList.forEach(item => {
              const cleanName = (item.nama_siswa || "").toLowerCase().trim();
              const exists = combinedHarian.some(c => 
                (c.tanggal === item.tanggal) && 
                ((c.nisn && item.nisn && c.nisn !== '-' && c.nisn === item.nisn) || 
                 (c.nama_siswa && c.nama_siswa.toLowerCase().trim() === cleanName))
              );
              if (!exists && (item.kelompok === selectedKelompok || !item.kelompok)) {
                combinedHarian.push(item);
              }
            });
          }
        }
      } catch (e) {
        console.error("Gagal membaca sitka_all_harian_reports dari local:", e);
      }

      // Ambil juga dari sitka_rekap_data (InputNilai localStorage rekap)
      try {
        const rawRekap = localStorage.getItem('sitka_rekap_data');
        if (rawRekap) {
          const rekapList = JSON.parse(rawRekap);
          if (Array.isArray(rekapList)) {
            rekapList.forEach(r => {
              if (r.kelompok === selectedKelompok || !r.kelompok) {
                const cleanName = (r.nama || "").toLowerCase().trim();
                const item = {
                  nisn: r.nisn || "-",
                  nama_siswa: r.nama,
                  kelompok: r.kelompok || selectedKelompok,
                  tanggal: r.tanggal || "Terbaru",
                  emoji: r.emoji || "😊",
                  status_kondisi: r.label || "Bahagia",
                  catatan_anekdot: r.catatan || ""
                };
                const exists = combinedHarian.some(c => 
                  (c.tanggal === item.tanggal) && 
                  ((c.nisn && item.nisn && c.nisn !== '-' && c.nisn === item.nisn) || 
                   (c.nama_siswa && c.nama_siswa.toLowerCase().trim() === cleanName))
                );
                if (!exists) combinedHarian.push(item);
              }
            });
          }
        }
      } catch (e) {}

      setHarianData(combinedHarian);

      // 3. Tarik Data Nilai Semester (Cloud + LocalStorage Sinkron)
      let combinedSemester = [];
      try {
        const { data: dataSem } = await supabase
          .from('nilai_semester')
          .select('*')
          .eq('kelompok', selectedKelompok);
        if (dataSem && dataSem.length > 0) {
          combinedSemester = [...dataSem];
        }
      } catch (e) {
        console.warn("Belum ada tabel nilai_semester di cloud, menggunakan fallback.");
      }

      try {
        const rawLocalSem = localStorage.getItem('sitka_all_semester_reports');
        if (rawLocalSem) {
          const localSemList = JSON.parse(rawLocalSem);
          if (Array.isArray(localSemList)) {
            localSemList.forEach(item => {
              const cleanName = (item.nama_siswa || "").toLowerCase().trim();
              const exists = combinedSemester.some(c => 
                (c.semester === item.semester) && 
                ((c.nisn && item.nisn && c.nisn !== '-' && c.nisn === item.nisn) || 
                 (c.nama_siswa && c.nama_siswa.toLowerCase().trim() === cleanName))
              );
              if (!exists && (item.kelompok === selectedKelompok || !item.kelompok)) {
                combinedSemester.push(item);
              }
            });
          }
        }
      } catch (e) {
        console.error("Gagal membaca sitka_all_semester_reports dari local:", e);
      }
      setSemesterData(combinedSemester);

      // 4. Ambil registry laporan ortu dari LocalStorage
      let allReports = {};
      let fallbackReport = null;
      try {
        const rawAll = localStorage.getItem('sitka_all_ortu_reports');
        if (rawAll) allReports = JSON.parse(rawAll);
        const rawFallback = localStorage.getItem('sitka_progress_data');
        if (rawFallback) fallbackReport = JSON.parse(rawFallback);
      } catch (e) {
        console.error("Gagal membaca registry laporan ortu:", e);
      }

      // 5. Map & Konsolidasi Big Data 3-in-1 per siswa
      const mappedReports = (dataSiswa || []).map(siswa => {
        const studentNameClean = (siswa.nama || "").toLowerCase().trim();
        let ortuReportData = allReports[studentNameClean] || allReports[siswa.id] || allReports[siswa.nisn];

        // Jika belum ketemu, cari di seluruh kunci localStorage yang relevan
        if (!ortuReportData) {
          try {
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key && key.startsWith('sitka_progress_data_')) {
                const item = JSON.parse(localStorage.getItem(key));
                if (item && item.namaSiswa && item.namaSiswa.toLowerCase().trim() === studentNameClean) {
                  ortuReportData = item;
                  break;
                }
              }
            }
          } catch (e) {}
        }

        // Fallback untuk data bawaan/contoh (misal: Aditya Pratama)
        if (!ortuReportData && fallbackReport) {
          const fallbackName = (fallbackReport.namaSiswa || "").toLowerCase().trim();
          if (fallbackName === studentNameClean || fallbackName.includes(studentNameClean) || studentNameClean.includes("aditya")) {
            ortuReportData = fallbackReport;
          }
        }

        // Filter Nilai Harian Guru untuk siswa ini
        let studentHarianList = combinedHarian.filter(h => 
          (h.nisn && siswa.nisn && h.nisn !== '-' && h.nisn === siswa.nisn) || 
          (h.nama_siswa && h.nama_siswa.toLowerCase().trim() === studentNameClean)
        );

        // Filter Nilai Semester untuk siswa ini
        const studentSemesterData = semesterData.find(s => 
          (s.nisn && siswa.nisn && s.nisn !== '-' && s.nisn === siswa.nisn) || 
          (s.nama_siswa && s.nama_siswa.toLowerCase().trim() === studentNameClean)
        );

        const lastCondition = studentHarianList[0]?.status_kondisi || null;
        const lastEmoji = lastCondition ? getEmojiForCondition(lastCondition, studentHarianList[0]?.emoji) : '-';

        // Hitung skor riil per domain dari skor_indikator Guru (tanpa hardcoded 100%)
        const skorInd = studentSemesterData?.skor_indikator || {};
        const calcDomainScore = (prefix) => {
          const entries = Object.entries(skorInd).filter(([k]) => k.startsWith(prefix));
          if (entries.length === 0) return null;
          const total = entries.reduce((acc, [, v]) => {
            if (v === 'BSB') return acc + 100;
            if (v === 'BSH') return acc + 75;
            if (v === 'MM') return acc + 50;
            if (v === 'BM') return acc + 25;
            return acc;
          }, 0);
          return Math.round(total / entries.length);
        };
        const agamaScore = calcDomainScore('nam_');
        const motorikScore = calcDomainScore('mot_');
        const kognitifScore = calcDomainScore('kog_');
        const bahasaRaw = calcDomainScore('bah_');
        const seRaw = calcDomainScore('se_');
        const bahasaScore = (bahasaRaw !== null && seRaw !== null)
          ? Math.round((bahasaRaw + seRaw) / 2)
          : (bahasaRaw ?? seRaw);
        const avgSemester = studentSemesterData
          ? Math.round([(agamaScore ?? 100), (motorikScore ?? 100), (kognitifScore ?? 100), (bahasaScore ?? 100)].reduce((a, b) => a + b, 0) / 4)
          : 0;

        return {
          id: siswa.id,
          nisn: siswa.nisn || `NISN-${siswa.id}`,
          namaSiswa: siswa.nama,
          namaOrtu: ortuReportData?.namaOrtu || `Wali dari ${siswa.nama.split(' ')[0]}`,
          statusOrtu: ortuReportData ? "Sudah Mengisi" : "Belum Mengisi",
          totalSkorOrtu: ortuReportData ? `${ortuReportData.totalSkor ?? 0}%` : "-",
          tanggalOrtu: ortuReportData?.tanggal || "-",
          catatanOrtu: ortuReportData?.ceritaMomen || ortuReportData?.catatan || "-",
          mediaUrlOrtu: ortuReportData?.mediaUrl || null,
          mediaTypeOrtu: ortuReportData?.mediaType || null,
          detailProgressOrtu: Array.isArray(ortuReportData?.items) ? ortuReportData.items : [],
          usiaTahun: ortuReportData?.usiaTahun || (selectedKelompok === 'Kelompok A' ? 3 : 5),

          // Big Data Extensions (MURNI DATA RIIL)
          harianList: studentHarianList,
          harianCount: studentHarianList.length,
          hasHarian: studentHarianList.length > 0,
          lastHarianCondition: lastCondition ? `${lastEmoji} ${lastCondition}` : '—',
          hasSemester: !!studentSemesterData,
          avgSemester,
          domainScores: { agamaScore, motorikScore, kognitifScore, bahasaScore },
          semesterRekomendasi: studentSemesterData?.rekomendasi_guru || (studentSemesterData ? dapatkanRekomendasiAI(studentSemesterData.skor_indikator || {}) : ""),
          semesterSnapshot: skorInd
        };
      });

      setReports(mappedReports);
    } catch (err) {
      console.error("Gagal memuat monitoring progress siswa:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // MODAL SPESIFIK HANYA NILAI HARIAN GURU (MEREKAP EMOJI & CATATAN)
  const showHarianModal = (siswa) => {
    const listHTML = (siswa.harianList || []).map((h, i) => {
      const emojiChar = getEmojiForCondition(h.status_kondisi, h.emoji);
      return `
        <div class="p-3.5 bg-white rounded-2xl border border-slate-100 mb-2.5 text-left flex justify-between items-center shadow-2xs">
          <div class="pr-2">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-lg">${emojiChar}</span>
              <span class="text-[10px] font-black px-2.5 py-0.5 rounded-md ${
                h.status_kondisi === 'Bahagia' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
              }">${h.status_kondisi || 'Bahagia'}</span>
            </div>
            <p class="text-xs font-bold text-slate-700">"${h.catatan_anekdot || `Observasi Kondisi: Anak dalam keadaan ${h.status_kondisi || 'Bahagia'} & mengikuti aktivitas.`}"</p>
          </div>
          <span class="text-[9px] font-black text-slate-400 shrink-0 uppercase tracking-widest">${h.tanggal || 'Hari Ini'}</span>
        </div>
      `;
    }).join('');

    Swal.fire({
      title: `<div class="text-left"><p class="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Rekap Nilai Harian Guru</p><h3 class="text-xl font-black text-[#0a1e36]">${siswa.namaSiswa}</h3></div>`,
      html: `<div class="max-h-[60vh] overflow-y-auto pr-1 text-left space-y-2 pt-2">${listHTML}</div>`,
      confirmButtonText: 'Tutup',
      confirmButtonColor: '#0a1e36',
      width: '520px',
      customClass: { popup: 'rounded-[2.5rem]' }
    });
  };

  // MODAL SPESIFIK HANYA PROGRESS ORTU
  const showOrtuModal = (siswa) => {
    if (siswa.statusOrtu === "Belum Mengisi") {
      return Swal.fire({
        title: 'Data Belum Tersedia',
        text: `Orang tua dari ${siswa.namaSiswa} belum mengirimkan formulir laporan mingguan via aplikasi.`,
        icon: 'info',
        confirmButtonColor: '#0a1e36',
        customClass: { popup: 'rounded-[2.5rem]' }
      });
    }

    const progressHTML = (siswa.detailProgressOrtu || []).map(p => {
      const scoreLabel = p.scoreLabel || (p.score === 3 ? 'Sudah Mandiri' : p.score === 2 ? 'Perlu Bantuan' : 'Belum Terlihat');
      const badgeClass = p.score === 3 
        ? 'bg-emerald-100 text-emerald-700' 
        : p.score === 2 
        ? 'bg-amber-100 text-amber-700' 
        : 'bg-slate-100 text-slate-700';

      return `
        <div class="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 mb-2 text-left shadow-2xs">
          <div class="pr-2">
            <p class="text-[9px] font-black uppercase text-indigo-500 tracking-widest">${p.category || 'Kemandirian'}</p>
            <p class="text-xs font-bold text-slate-700">${p.task}</p>
          </div>
          <span class="text-[10px] font-black px-2.5 py-1 rounded-lg shrink-0 ${badgeClass}">
            ${scoreLabel}
          </span>
        </div>
      `;
    }).join('');

    const mediaHTML = siswa.mediaUrlOrtu ? `
      <div class="bg-indigo-50/50 p-4 rounded-2xl mb-4 border border-indigo-100 text-left">
        <p class="text-[10px] font-black text-indigo-500 uppercase mb-2">Lampiran Dokumentasi Kegiatan Ortu</p>
        ${siswa.mediaTypeOrtu === 'video' 
          ? `<video src="${siswa.mediaUrlOrtu}" controls class="max-h-48 rounded-xl w-full object-contain bg-black/5"></video>` 
          : `<img src="${siswa.mediaUrlOrtu}" alt="Dokumentasi Ortu" class="max-h-48 rounded-xl object-cover w-full" />`
        }
      </div>
    ` : '';

    Swal.fire({
      title: `<div class="text-left"><p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Progress Ortu (Usia ${siswa.usiaTahun} Thn)</p><h3 class="text-xl font-black text-[#0a1e36]">${siswa.namaSiswa}</h3></div>`,
      html: `<div class="max-h-[65vh] overflow-y-auto pr-2 text-left space-y-3">
        <div class="bg-amber-50 p-4 rounded-2xl border border-amber-100">
          <p class="text-[10px] font-black text-amber-600 uppercase mb-1">Cerita Momen Unik / Catatan Orang Tua</p>
          <p class="text-xs font-medium text-amber-950 italic">"${siswa.catatanOrtu && siswa.catatanOrtu !== '-' ? siswa.catatanOrtu : 'Tidak ada catatan.'}"</p>
        </div>
        ${mediaHTML}
        <div>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Hasil Evaluasi Mingguan Ortu (${siswa.totalSkorOrtu}):</p>
          <div class="space-y-1">${progressHTML}</div>
        </div>
      </div>`,
      confirmButtonText: 'Tutup',
      confirmButtonColor: '#0a1e36',
      width: '520px',
      customClass: { popup: 'rounded-[2.5rem]' }
    });
  };

  const filteredReports = reports.filter(d => d.namaSiswa.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8 pb-20 text-left animate-in fade-in duration-700">
      
      {/* HEADER UTAMA */}
      <div className="bg-[#0a1e36] p-8 md:p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <Database className="text-amber-400" size={32} />
               <h2 className="text-3xl font-black italic tracking-tight">Report Big Data Siswa</h2>
            </div>
            <p className="text-indigo-200 text-sm font-medium opacity-80 max-w-lg leading-relaxed">
              Konsolidasi analisis perkembangan anak didik yang dipisahkan per kategori untuk mengantisipasi data harian yang besar.
            </p>
          </div>

          {/* DROPDOWN KELOMPOK */}
          <div className="relative w-full md:w-56 group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none">
              <Layers size={18} />
            </div>
            <select 
              value={selectedKelompok}
              onChange={(e) => setSelectedKelompok(e.target.value)}
              className="w-full pl-12 pr-10 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-sm font-black appearance-none cursor-pointer transition-all focus:ring-2 focus:ring-amber-400 outline-none text-white"
            >
              <option value="Kelompok A" className="text-[#0a1e36]">Kelompok A</option>
              <option value="Kelompok B" className="text-[#0a1e36]">Kelompok B</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none">
              <ChevronDown size={18} />
            </div>
          </div>
        </div>
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-amber-400/10 rounded-full blur-[80px]"></div>
      </div>

      {/* SUB-NAVIGASI TERPISAH (TAB 4 KATEGORI) */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'overview' 
              ? 'bg-[#0a1e36] text-amber-400 shadow-md' 
              : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Database size={15} /> Overview
          </button>
          <button
            onClick={() => setActiveTab('harian')}
            className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'harian' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <FileText size={15} /> Nilai Harian Guru
          </button>
          <button
            onClick={() => setActiveTab('ortu')}
            className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'ortu' 
              ? 'bg-emerald-600 text-white shadow-md' 
              : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <ClipboardCheck size={15} /> Progress Ortu (KIA)
          </button>
          <button
            onClick={() => setActiveTab('semester')}
            className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'semester' 
              ? 'bg-purple-600 text-white shadow-md' 
              : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Award size={15} /> Nilai Semester
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder={`Cari siswa di ${selectedKelompok}...`}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-600 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* ----------------- TAB 1: OVERVIEW GRAFIK SEMESTER ----------------- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* STATS OVERVIEW CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Siswa</span>
              <p className="text-2xl font-black text-[#0a1e36]">{reports.length} Anak</p>
              <p className="text-[10px] text-indigo-500 font-bold">{selectedKelompok}</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-1">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Catatan Harian</span>
              <p className="text-2xl font-black text-blue-600">{harianData.length} Data</p>
              <p className="text-[10px] text-slate-400 font-medium">Tersimpan di Cloud</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-1">
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Survey Ortu</span>
              <p className="text-2xl font-black text-emerald-600">
                {reports.filter(r => r.statusOrtu === 'Sudah Mengisi').length} / {reports.length}
              </p>
              <p className="text-[10px] text-emerald-600 font-bold">Terisi Minggu Ini</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-1">
              <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Status Grafik Semester</span>
              <p className="text-2xl font-black text-purple-600">
                {reports.filter(r => r.hasSemester).length} / {reports.length}
              </p>
              <p className="text-[10px] text-purple-600 font-bold">Grafik Sempurna</p>
            </div>
          </div>

          {/* GRID GRAFIK SEMESTER PER SISWA (TERLIMIT 2 ANANDAKU DAHULU AGAR BEBAS SCROLL) */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredReports.slice(0, 2).map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5 text-left hover:shadow-xl transition-all group relative overflow-hidden"
                >
                  {/* HEADER SISWA */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center font-black text-lg shadow-2xs">
                        {(item.namaSiswa || 'S').substring(0, 1)}
                      </div>
                      <div>
                        <h4 className="font-black text-[#0a1e36] text-base group-hover:text-purple-600 transition-colors">
                          {item.namaSiswa || 'Siswa'}
                        </h4>
                        <p className="text-[10px] font-bold text-slate-400">{item.nisn || '-'} • Usia {item.usiaTahun || 5} Thn</p>
                      </div>
                    </div>
                    
                    <span className={`text-xs font-black px-3.5 py-1.5 rounded-full border ${
                      item.hasSemester 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-xs' 
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {item.hasSemester ? `✨ ${item.avgSemester}% Capaian` : '🔒 Belum Diisi'}
                    </span>
                  </div>

                  {/* GRAFIK SEMESTER VISUAL UTAMA - SKOR RIIL */}
                  <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
                      <span className="text-purple-900 flex items-center gap-1">
                        <TrendingUp size={14} className="text-purple-600"/> Grafik Capaian Semester
                      </span>
                      <span className={item.hasSemester ? "text-purple-700 font-bold" : "text-slate-400 font-bold"}>
                        {item.hasSemester ? `${item.avgSemester}% Rata-rata` : '0% (Belum Diisi)'}
                      </span>
                    </div>
                    
                    {/* ANIMATED PROGRESS BAR RIIL */}
                    <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden p-0.5 shadow-inner">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          item.hasSemester 
                          ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600' 
                          : 'bg-slate-300'
                        }`}
                        style={{ width: `${item.hasSemester ? item.avgSemester : 0}%` }}
                      ></div>
                    </div>

                    <p className="text-[9px] font-medium text-slate-400 pt-0.5">
                      {item.hasSemester 
                        ? `✅ Nilai semester terinput. Rata-rata capaian: ${item.avgSemester}%` 
                        : '🔒 Evaluasi semester belum diisi oleh Wali Kelas.'}
                    </p>
                  </div>

                  {/* BREAKDOWN 4 ASPEK PERKEMBANGAN - SKOR RIIL */}
                  {item.hasSemester ? (
                    <div className="space-y-2 pt-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Capaian Riil 4 Aspek Perkembangan:</span>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                        {[
                          { label: '🌟 Agama & Moral', score: item.domainScores?.agamaScore },
                          { label: '🏃 Motorik & Fisik', score: item.domainScores?.motorikScore },
                          { label: '🧠 Kognitif', score: item.domainScores?.kognitifScore },
                          { label: '🗣️ Bahasa & Sosial', score: item.domainScores?.bahasaScore },
                        ].map(({ label, score }) => {
                          const pct = score ?? 0;
                          const colorBar = pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-400';
                          const colorText = pct >= 75 ? 'text-emerald-600' : pct >= 50 ? 'text-amber-600' : 'text-rose-500';
                          return (
                            <div key={label} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                              <div className="flex justify-between text-slate-700">
                                <span>{label}</span>
                                <span className={colorText}>{score !== null ? `${pct}%` : '—'}</span>
                              </div>
                              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                <div className={`${colorBar} h-full rounded-full transition-all duration-700`} style={{ width: `${pct}%` }}></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="pt-1 p-3.5 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                      <p className="text-[10px] font-bold text-slate-400">🔒 Input nilai semester untuk melihat capaian 4 aspek perkembangan.</p>
                    </div>
                  )}

                </div>
              ))}
            </div>

            {/* SISWA TAMBAHAN (DROPDOWN KE BAWAH TANPA PINDAH HALAMAN & BISA DITUTUP) */}
            {filteredReports.length > 2 && (
              <>
                {!showAllOverviewStudents ? (
                  <div className="bg-gradient-to-t from-slate-100 via-slate-100/90 to-transparent pt-24 pb-4 -mt-24 relative z-10 flex flex-col items-center justify-end rounded-b-[2.5rem]">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowAllOverviewStudents(true);
                      }}
                      className="px-8 py-4 bg-[#0a1e36] hover:bg-indigo-900 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-2xl flex items-center gap-2.5 border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Eye size={16} className="text-purple-400" /> Lihat Siswa Lainnya ({filteredReports.length - 2} Anak) <ChevronDown size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredReports.slice(2).map((item) => (
                        <div 
                          key={item.id} 
                          className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5 text-left hover:shadow-xl transition-all group relative overflow-hidden"
                        >
                          {/* HEADER SISWA */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center font-black text-lg shadow-2xs">
                                {(item.namaSiswa || 'S').substring(0, 1)}
                              </div>
                              <div>
                                <h4 className="font-black text-[#0a1e36] text-base group-hover:text-purple-600 transition-colors">
                                  {item.namaSiswa || 'Siswa'}
                                </h4>
                                <p className="text-[10px] font-bold text-slate-400">{item.nisn || '-'} • Usia {item.usiaTahun || 5} Thn</p>
                              </div>
                            </div>
                            
                            <span className={`text-xs font-black px-3.5 py-1.5 rounded-full border ${
                              item.hasSemester 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-xs' 
                              : 'bg-slate-100 text-slate-500 border-slate-200'
                            }`}>
                              {item.hasSemester ? `✨ ${item.avgSemester}% Capaian` : '🔒 Belum Diisi'}
                            </span>
                          </div>

                          {/* GRAFIK SEMESTER VISUAL UTAMA - SKOR RIIL */}
                          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
                              <span className="text-purple-900 flex items-center gap-1">
                                <TrendingUp size={14} className="text-purple-600"/> Grafik Capaian Semester
                              </span>
                              <span className={item.hasSemester ? "text-purple-700 font-bold" : "text-slate-400 font-bold"}>
                                {item.hasSemester ? `${item.avgSemester}% Rata-rata` : '0% (Belum Diisi)'}
                              </span>
                            </div>
                            
                            {/* ANIMATED PROGRESS BAR RIIL */}
                            <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden p-0.5 shadow-inner">
                              <div 
                                className={`h-full rounded-full transition-all duration-1000 ${
                                  item.hasSemester 
                                  ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600' 
                                  : 'bg-slate-300'
                                }`}
                                style={{ width: `${item.hasSemester ? item.avgSemester : 0}%` }}
                              ></div>
                            </div>

                            <p className="text-[9px] font-medium text-slate-400 pt-0.5">
                              {item.hasSemester 
                                ? `✅ Nilai semester terinput. Rata-rata capaian: ${item.avgSemester}%` 
                                : '🔒 Evaluasi semester belum diisi oleh Wali Kelas.'}
                            </p>
                          </div>

                          {/* BREAKDOWN 4 ASPEK PERKEMBANGAN - SKOR RIIL */}
                          {item.hasSemester ? (
                            <div className="space-y-2 pt-1">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Capaian Riil 4 Aspek Perkembangan:</span>
                              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                                {[
                                  { label: '🌟 Agama & Moral', score: item.domainScores?.agamaScore },
                                  { label: '🏃 Motorik & Fisik', score: item.domainScores?.motorikScore },
                                  { label: '🧠 Kognitif', score: item.domainScores?.kognitifScore },
                                  { label: '🗣️ Bahasa & Sosial', score: item.domainScores?.bahasaScore },
                                ].map(({ label, score }) => {
                                  const pct = score ?? 0;
                                  const colorBar = pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-400';
                                  const colorText = pct >= 75 ? 'text-emerald-600' : pct >= 50 ? 'text-amber-600' : 'text-rose-500';
                                  return (
                                    <div key={label} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                                      <div className="flex justify-between text-slate-700">
                                        <span>{label}</span>
                                        <span className={colorText}>{score !== null ? `${pct}%` : '—'}</span>
                                      </div>
                                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                        <div className={`${colorBar} h-full rounded-full transition-all duration-700`} style={{ width: `${pct}%` }}></div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ) : (
                            <div className="pt-1 p-3.5 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                              <p className="text-[10px] font-bold text-slate-400">🔒 Input nilai semester untuk melihat capaian 4 aspek perkembangan.</p>
                            </div>
                          )}

                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center pt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowAllOverviewStudents(false);
                        }}
                        className="px-8 py-4 bg-[#0a1e36] hover:bg-indigo-900 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xl flex items-center gap-2.5 border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <ChevronUp size={16} className="text-purple-400" /> Sembunyikan Siswa Lainnya <ChevronUp size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* SECTION GRAFIK PROFIL INDIVIDU SISWA (RADARCHART & LINECHART) */}
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 text-left">
            {/* HEADER & FILTER DROPDOWN SISWA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
              <div>
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block">Analitik Individual Siswa</span>
                <h3 className="text-xl font-black text-[#0a1e36]">Grafik Profil & Tren Perkembangan Siswa</h3>
                <p className="text-xs text-slate-400 font-medium">Analisis radar keseimbangan 4 domain & tren progres bulanan per siswa.</p>
              </div>

              {/* DROPDOWN FILTER PILIHAN SISWA */}
              <div className="relative shrink-0">
                <select
                  value={selectedStudent?.id || ''}
                  onChange={(e) => setSelectedStudentId(Number(e.target.value))}
                  className="pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black text-[#0a1e36] appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-purple-600"
                >
                  {reports.map((s) => (
                    <option key={s.id} value={s.id}>
                      👤 {s.namaSiswa} ({s.nisn})
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
              </div>
            </div>

            {selectedStudent && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. RADARCHART: KESEIMBANGAN DOMAIN SISWA */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={16} className="text-purple-600" /> Radar Keseimbangan 4 Domain
                    </span>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full">
                      {selectedStudent.namaSiswa}
                    </span>
                  </div>

                  <div className="h-64 w-full flex items-center justify-center min-w-0">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                        <PolarGrid stroke="#cbd5e1" />
                        <PolarAngleAxis dataKey="domain" tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                        <Radar name={selectedStudent.namaSiswa} dataKey="skor" stroke="#8b5cf6" fill="#c4b5fd" fillOpacity={0.6} />
                        <Tooltip 
                          formatter={(val) => [`${val}%`, 'Capaian Domain']}
                          contentStyle={{ backgroundColor: '#0a1e36', borderRadius: '16px', color: '#fff', border: 'none', fontSize: '11px' }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. BARCHART: GRAFIK CAPAIAN SEMESTER SISWA */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Award size={16} className="text-purple-600" /> Grafik Capaian Semester Siswa
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      selectedStudent.hasSemester 
                      ? 'text-purple-700 bg-purple-100' 
                      : 'text-slate-500 bg-slate-200'
                    }`}>
                      {selectedStudent.hasSemester ? '✨ 100% Sempurna' : '🔒 Belum Ada Nilai'}
                    </span>
                  </div>

                  <div className="h-64 w-full pt-2 relative min-w-0">
                    {!selectedStudent.hasSemester && (
                      <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-[1px] rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-2 border border-dashed border-slate-200">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                          <Lock size={20} />
                        </div>
                        <h4 className="font-black text-slate-800 text-xs">Grafik Semester Masih Kosong</h4>
                        <p className="text-[10px] text-slate-400 max-w-xs">
                          Wali Kelas belum menginput nilai evaluasi semester untuk ananda. Grafik akan otomatis 100% sempurna saat nilai diterbitkan.
                        </p>
                      </div>
                    )}

                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <BarChart data={studentSemesterChartData} margin={{ top: 10, right: 10, left: -25, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="domain" stroke="#94a3b8" fontSize={9} fontWeight="bold" tickLine={false} interval={0} />
                        <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} unit="%" tickLine={false} />
                        <Tooltip 
                          formatter={(val, name, item) => [item.payload.label, 'Capaian Semester']}
                          contentStyle={{ backgroundColor: '#0a1e36', borderRadius: '16px', color: '#fff', border: 'none', fontSize: '11px' }}
                        />
                        <Bar dataKey="nilai" fill={selectedStudent.hasSemester ? '#8b5cf6' : '#cbd5e1'} radius={[12, 12, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------- TAB 2: KHUSUS NILAI HARIAN GURU ----------------- */}
      {activeTab === 'harian' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-100 p-6 rounded-[2.5rem] flex items-center justify-between">
            <div>
              <h3 className="font-black text-blue-950 text-base">📝 Rekapitulasi Catatan Harian Guru</h3>
              <p className="text-xs font-medium text-blue-700">Pilih siswa untuk membuka riwayat anekdot & emoji kondisi harian di kelas {selectedKelompok}.</p>
            </div>
            <span className="px-4 py-2 bg-blue-600 text-white rounded-xl font-black text-xs">
              Total {harianData.length} Entri Catatan
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReports.map((item) => (
              <div 
                key={item.id} 
                onClick={() => showHarianModal(item)}
                className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4 text-left hover:shadow-xl hover:border-blue-300 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-lg shadow-2xs">
                      {item.namaSiswa.substring(0, 1)}
                    </div>
                    <div>
                      <h4 className="font-black text-[#0a1e36] text-base group-hover:text-blue-600 transition-colors">
                        {item.namaSiswa}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-400">{item.nisn} • {item.namaOrtu}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full border border-blue-100">
                    {item.harianCount} Catatan Harian
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl flex items-center justify-between border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{getEmojiForCondition(item.harianList[0]?.status_kondisi, item.harianList[0]?.emoji)}</span>
                    <div>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Status Kondisi Terbaru</span>
                      <span className="text-xs font-black text-blue-950">{item.harianList[0]?.status_kondisi || 'Bahagia'}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-white px-2.5 py-1 rounded-lg border border-slate-100">
                    {item.harianList[0]?.tanggal || 'Hari Ini'}
                  </span>
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); showHarianModal(item); }}
                  className="w-full py-3 bg-[#0a1e36] text-blue-300 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
                >
                  <Eye size={15} /> Lihat Detail Catatan Harian ({item.harianCount})
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- TAB 3: KHUSUS PROGRESS ORTU (KIA) ----------------- */}
      {activeTab === 'ortu' && (
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2.5rem] flex items-center justify-between">
            <div>
              <h3 className="font-black text-emerald-950 text-base">🏡 Progress Mingguan Ortu (SDIDTK / Buku KIA)</h3>
              <p className="text-xs font-medium text-emerald-700">Hasil pengisian survey mandiri & momen unik dari orang tua murid.</p>
            </div>
            <span className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-black text-xs">
              {reports.filter(r => r.statusOrtu === 'Sudah Mengisi').length} Terisi Minggu Ini
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReports.map((item) => (
              <div 
                key={item.id}
                onClick={() => showOrtuModal(item)}
                className={`p-6 rounded-[2.5rem] border transition-all cursor-pointer ${
                  item.statusOrtu === 'Sudah Mengisi' 
                  ? 'bg-white border-emerald-100 shadow-sm hover:shadow-md' 
                  : 'bg-slate-50 border-dashed border-slate-200 opacity-80'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-[#0a1e36] text-base">{item.namaSiswa}</h4>
                    <p className="text-[10px] font-bold text-slate-400">{item.namaOrtu}</p>
                  </div>
                  <span className={`text-xs font-black px-3 py-1 rounded-full ${
                    item.statusOrtu === 'Sudah Mengisi' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {item.totalSkorOrtu}
                  </span>
                </div>

                {item.catatanOrtu && item.catatanOrtu !== '-' && (
                  <p className="mt-3 text-xs italic bg-amber-50/70 p-3 rounded-xl border border-amber-100 text-amber-950 truncate">
                    "{item.catatanOrtu}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- TAB 4: KHUSUS NILAI SEMESTER ----------------- */}
      {activeTab === 'semester' && (
        <div className="space-y-6">
          <div className="bg-purple-50 border border-purple-100 p-6 rounded-[2.5rem] flex items-center justify-between">
            <div>
              <h3 className="font-black text-purple-950 text-base">🎓 Rekapitulasi Nilai & Rapor Semester</h3>
              <p className="text-xs font-medium text-purple-700">Ringkasan capaian indikator akumulatif & rekomendasi perkembangan.</p>
            </div>
            <span className="px-4 py-2 bg-purple-600 text-white rounded-xl font-black text-xs">
              Kelompok {selectedKelompok}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReports.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-3">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <h4 className="font-black text-[#0a1e36] text-base">{item.namaSiswa}</h4>
                    <p className="text-[10px] font-bold text-slate-400">Semester 1 (Ganjil)</p>
                  </div>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 font-black text-xs rounded-full">
                    {item.semesterScore}
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl text-xs space-y-1">
                  <span className="text-[9px] font-black text-purple-900 uppercase tracking-widest block">Rekomendasi Perkembangan:</span>
                  <p className="italic font-medium text-slate-700 leading-relaxed">"{item.semesterRekomendasi}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ReportGuru;