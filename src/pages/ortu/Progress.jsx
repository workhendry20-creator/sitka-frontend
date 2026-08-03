// src/pages/ortu/Progress.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Save, Star, Heart, 
  BrainCircuit, ShieldCheck, MessageCircle,
  CheckCircle2, ArrowRight, Sparkles, Upload, 
  X, Trophy, Baby, Calendar, Image as ImageIcon,
  Check, RefreshCw, AlertCircle, Camera
} from 'lucide-react';
import Swal from 'sweetalert2';

// --- DATASET INDIKATOR PERKEMBANGAN PAUD BERBASIS BUKU KIA (SDIDTK) ---
const DATASET_KIA = {
  2: [
    { id: 201, category: "Motorik Kasar", task: "Naik tangga & berlari-lari" },
    { id: 202, category: "Motorik Halus", task: "Mencoret-coret pensil pada kertas" },
    { id: 203, category: "Kognitif", task: "Menunjuk 1 atau lebih bagian tubuhnya" },
    { id: 204, category: "Bahasa", task: "Menyebut 3-6 kata bermakna (contoh: bola, piring)" },
    { id: 205, category: "Kemandirian", task: "Memegang cangkir sendiri" },
    { id: 206, category: "Kemandirian", task: "Belajar makan & minum sendiri" },
  ],
  3: [
    { id: 301, category: "Motorik Kasar", task: "Mengayuh sepeda roda tiga" },
    { id: 302, category: "Motorik Kasar", task: "Berdiri di atas satu kaki tanpa berpegangan" },
    { id: 303, category: "Bahasa", task: "Bicara dengan baik menggunakan 2 kata" },
    { id: 304, category: "Kognitif", task: "Mengenal 2-4 warna" },
    { id: 305, category: "Kognitif", task: "Menyebut nama, umur, dan tempat" },
    { id: 306, category: "Motorik Halus", task: "Menggambar garis lurus" },
    { id: 307, category: "Sosial-Emosional", task: "Bermain dengan teman" },
    { id: 308, category: "Kemandirian", task: "Melepas & mengenakan pakaian sendiri" },
  ],
  5: [
    { id: 501, category: "Motorik Kasar", task: "Melompat-lompat 1 kaki, menari, & berjalan lurus" },
    { id: 502, category: "Motorik Halus", task: "Menggambar orang 3 bagian (kepala, badan, tangan/kaki)" },
    { id: 503, category: "Motorik Halus", task: "Menggambar tanda silang & lingkaran" },
    { id: 504, category: "Motorik Kasar", task: "Menangkap bola kecil dengan kedua tangan" },
    { id: 505, category: "Bahasa", task: "Menjawab pertanyaan dengan kata-kata yang benar" },
    { id: 506, category: "Kognitif", task: "Menyebut angka & menghitung jari" },
    { id: 507, category: "Bahasa", task: "Bicaranya mudah dimengerti" },
    { id: 508, category: "Kemandirian", task: "Berpakaian sendiri tanpa dibantu" },
    { id: 509, category: "Kemandirian", task: "Mengancing baju atau pakaian boneka" },
    { id: 510, category: "Kemandirian", task: "Menggosok gigi tanpa bantuan" },
  ],
  6: [
    { id: 601, category: "Motorik Kasar", task: "Berjalan lurus & berdiri 1 kaki selama 11 detik" },
    { id: 602, category: "Motorik Halus", task: "Menggambar 6 bagian tubuh lengkap" },
    { id: 603, category: "Motorik Halus", task: "Menggambar segi empat" },
    { id: 604, category: "Bahasa", task: "Mengerti arti lawan kata" },
    { id: 605, category: "Kognitif", task: "Mengenal angka & menghitung 5-10" },
    { id: 606, category: "Sosial-Emosional", task: "Mengenal warna & mengikuti aturan permainan" },
    { id: 607, category: "Kemandirian", task: "Berpakaian sendiri tanpa dibantu" },
  ]
};

// OPSI PENILAIAN DENGAN BAHASA UX BARU
const RATING_OPTIONS = [
  { value: 1, label: "Belum Terlihat", activeClass: "bg-slate-700 text-white shadow-md", badgeClass: "bg-slate-100 text-slate-600" },
  { value: 2, label: "Perlu Bantuan", activeClass: "bg-amber-500 text-white shadow-md shadow-amber-200", badgeClass: "bg-amber-100 text-amber-700" },
  { value: 3, label: "Sudah Mandiri", activeClass: "bg-emerald-600 text-white shadow-md shadow-emerald-200", badgeClass: "bg-emerald-100 text-emerald-700" },
];

const ProgressOrtu = () => {
  const navigate = useNavigate();
  const [parentSession, setParentSession] = useState(null);
  const [selectedAge, setSelectedAge] = useState(3); // Default kelompok usia 3 tahun
  const [scores, setScores] = useState({}); // { [indicatorId]: number }
  const [ceritaMomen, setCeritaMomen] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'image' | 'video'
  const [milestones, setMilestones] = useState({}); // { [indicatorId]: { consecutiveCount: number, isPassed: boolean } }
  const [lastSaved, setLastSaved] = useState(null);
  const [historyList, setHistoryList] = useState([]);

  // Identifikasi user dan hitung umur dari tanggal_lahir_anak
  useEffect(() => {
    let childKey = 'default_child';

    try {
      const saved = localStorage.getItem('user_session');
      if (saved) {
        const user = JSON.parse(saved);
        setParentSession(user);
        if (user?.nisn || user?.nama_anak || user?.namaAnak) {
          childKey = user.nisn || user.nama_anak || user.namaAnak;
        }

        // Deteksi tanggal lahir anak atau umur anak dari session/profile
        const tglLahir = user?.tanggal_lahir_anak || user?.tgl_lahir_anak || user?.tgl_lahir;
        if (tglLahir) {
          const birthDate = new Date(tglLahir);
          if (!isNaN(birthDate.getTime())) {
            const ageDifMs = Date.now() - birthDate.getTime();
            const ageDate = new Date(ageDifMs);
            const calcAge = Math.abs(ageDate.getUTCFullYear() - 1970);
            
            if (calcAge <= 2) setSelectedAge(2);
            else if (calcAge <= 4) setSelectedAge(3);
            else if (calcAge === 5) setSelectedAge(5);
            else setSelectedAge(6);
          }
        } else if (user?.usia) {
          const parsedAge = parseInt(user.usia, 10);
          if (!isNaN(parsedAge)) {
            if (parsedAge <= 2) setSelectedAge(2);
            else if (parsedAge <= 4) setSelectedAge(3);
            else if (parsedAge === 5) setSelectedAge(5);
            else setSelectedAge(6);
          }
        }
      }
    } catch (err) {
      console.error("Error reading user_session:", err);
    }

    // Load Rekap Terakhir (Cek key spesifik dan key generik lama)
    try {
      const savedProgressRaw = localStorage.getItem(`sitka_progress_data_${childKey}`) || localStorage.getItem('sitka_progress_data');
      if (savedProgressRaw) {
        const parsed = JSON.parse(savedProgressRaw);
        if (parsed && typeof parsed === 'object') {
          setLastSaved(parsed);
        }
      }
    } catch (err) {
      console.error("Error reading saved progress:", err);
    }

    // Load History Laporan
    try {
      const savedHistoryRaw = localStorage.getItem(`sitka_progress_history_${childKey}`);
      if (savedHistoryRaw) {
        const parsed = JSON.parse(savedHistoryRaw);
        if (Array.isArray(parsed)) {
          setHistoryList(parsed);
        }
      }
    } catch (err) {
      console.error("Error reading history list:", err);
    }

    // Load Milestone Tracking State
    try {
      const savedMilestonesRaw = localStorage.getItem(`sitka_milestones_${childKey}`);
      if (savedMilestonesRaw) {
        const parsed = JSON.parse(savedMilestonesRaw);
        if (parsed && typeof parsed === 'object') {
          setMilestones(parsed);
        }
      }
    } catch (err) {
      console.error("Error reading milestones:", err);
    }
  }, []);

  // Filter daftar indikator untuk usia terpilih
  const currentAgeDataset = useMemo(() => {
    const ageNum = Number(selectedAge);
    return DATASET_KIA[ageNum] || DATASET_KIA[3] || [];
  }, [selectedAge]);

  // Ambil daftar indikator yang SUDAH LULUS / PASSED
  const passedIndicators = useMemo(() => {
    if (!Array.isArray(currentAgeDataset)) return [];
    return currentAgeDataset.filter(item => item && milestones && milestones[item.id]?.isPassed);
  }, [currentAgeDataset, milestones]);

  // Ambil daftar indikator yang BELUM LULUS (Active for rotation)
  const unpassedIndicators = useMemo(() => {
    if (!Array.isArray(currentAgeDataset)) return [];
    return currentAgeDataset.filter(item => item && (!milestones || !milestones[item.id]?.isPassed));
  }, [currentAgeDataset, milestones]);

  // SYSTEM ROTASI MINGGUAN: Ambil maksimal 3 - 4 indikator yang belum lulus saja per minggu!
  const ROTATION_LIMIT = 4;
  const activeWeeklyIndicators = useMemo(() => {
    if (!Array.isArray(unpassedIndicators)) return [];
    return unpassedIndicators.slice(0, ROTATION_LIMIT);
  }, [unpassedIndicators]);

  // Handle Score Input
  const handleScoreChange = (id, value) => {
    setScores(prev => ({ ...prev, [id]: value }));
  };

  // Handle Media File Upload
  const handleMediaUpload = (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      return Swal.fire({
        icon: 'error',
        title: 'Ukuran File Terlalu Besar',
        text: 'Bunda, batas maksimal ukuran foto/video adalah 10MB.',
        confirmButtonColor: '#306896'
      });
    }

    setMediaFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result);
      if (file.type && file.type.startsWith('video/')) {
        setMediaType('video');
      } else {
        setMediaType('image');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
  };

  // LOGIKA SIMPAN & CEK AUTO-HIDE MILESTONE (2x MANDIRI BERTURUT-TURUT = LULUS)
  const handleSave = () => {
    // Validasi apakah seluruh 3-4 indikator aktif minggu ini sudah dinilai
    const missing = activeWeeklyIndicators.filter(item => !scores[item.id]);
    if (missing.length > 0) {
      return Swal.fire({
        icon: 'warning',
        title: 'Belum Lengkap!',
        text: `Bunda, masih ada ${missing.length} poin indikator minggu ini yang belum diisi.`,
        confirmButtonColor: '#306896',
        customClass: { popup: 'rounded-[2.5rem]' }
      });
    }

    const childKey = parentSession?.nisn || parentSession?.nama_anak || parentSession?.namaAnak || 'default_child';
    const updatedMilestones = { ...milestones };
    const newlyPassedTasks = [];

    // Evaluasi status Mandiri berturut-turut untuk indikator aktif
    activeWeeklyIndicators.forEach(item => {
      const currentScore = scores[item.id];
      const prevTracker = updatedMilestones[item.id] || { consecutiveCount: 0, isPassed: false };

      if (currentScore === 3) {
        const newCount = (prevTracker.consecutiveCount || 0) + 1;
        const isPassedNow = newCount >= 2;
        updatedMilestones[item.id] = {
          consecutiveCount: newCount,
          isPassed: isPassedNow,
          passedAt: isPassedNow ? new Date().toISOString() : prevTracker.passedAt
        };
        if (isPassedNow && !prevTracker.isPassed) {
          newlyPassedTasks.push(item.task);
        }
      } else {
        // Reset hitungan jika nilainya bukan "Sudah Mandiri" (1 atau 2)
        updatedMilestones[item.id] = {
          consecutiveCount: 0,
          isPassed: false,
          passedAt: null
        };
      }
    });

    // Hitung ringkasan Poin & Persentase Kemandirian
    const totalPoin = activeWeeklyIndicators.reduce((acc, curr) => acc + (scores[curr.id] || 0), 0);
    const maxPoin = activeWeeklyIndicators.length * 3;
    const persentase = maxPoin > 0 ? Math.round((totalPoin / maxPoin) * 100) : 0;

    const formattedItems = activeWeeklyIndicators.map(item => {
      const val = scores[item.id];
      const option = RATING_OPTIONS.find(o => o.value === val);
      return {
        id: item.id,
        category: item.category,
        task: item.task,
        score: val,
        scoreLabel: option ? option.label : "Belum Terlihat"
      };
    });

    const progressData = {
      id: `rep_${Date.now()}`,
      namaSiswa: parentSession?.nama_anak || parentSession?.namaAnak || "Aditya Pratama",
      usiaTahun: selectedAge,
      totalSkor: persentase,
      tanggal: new Date().toLocaleDateString('id-ID', { 
        day: 'numeric', month: 'long', year: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
      }),
      ceritaMomen: ceritaMomen,
      mediaUrl: mediaPreview,
      mediaType: mediaType,
      items: formattedItems
    };

    // Simpan ke storage lokal (spesifik anak & registry global untuk Guru)
    try {
      const cleanChildName = (progressData.namaSiswa || "").toLowerCase().trim();
      localStorage.setItem(`sitka_progress_data_${childKey}`, JSON.stringify(progressData));
      if (cleanChildName) {
        localStorage.setItem(`sitka_progress_data_${cleanChildName}`, JSON.stringify(progressData));
      }
      localStorage.setItem('sitka_progress_data', JSON.stringify(progressData));
      localStorage.setItem(`sitka_milestones_${childKey}`, JSON.stringify(updatedMilestones));
      
      // Update history list
      const updatedHistory = [progressData, ...historyList.filter(h => h && h.id !== progressData.id)];
      localStorage.setItem(`sitka_progress_history_${childKey}`, JSON.stringify(updatedHistory));

      // Update registry global ortu reports untuk role Guru
      const allReportsRaw = localStorage.getItem('sitka_all_ortu_reports');
      const allReports = allReportsRaw ? JSON.parse(allReportsRaw) : {};
      allReports[childKey] = progressData;
      if (cleanChildName) {
        allReports[cleanChildName] = progressData;
      }
      localStorage.setItem('sitka_all_ortu_reports', JSON.stringify(allReports));

      setLastSaved(progressData);
      setMilestones(updatedMilestones);
      setHistoryList(updatedHistory);
      setScores({});
      setCeritaMomen("");
      handleRemoveMedia();
    } catch (err) {
      console.error("Error saving progress to localStorage:", err);
    }

    // Notifikasi Swal
    if (newlyPassedTasks.length > 0) {
      Swal.fire({
        icon: 'success',
        title: '🎉 Milestone Unlocked!',
        html: `<p class="text-sm font-medium text-slate-600 mb-2">Hebat! Si kecil telah mencapai status <b>Sudah Mandiri</b> 2 minggu berturut-turut pada:</p><ul class="text-xs text-emerald-700 font-bold bg-emerald-50 p-3 rounded-xl space-y-1">${newlyPassedTasks.map(t => `<li>✨ ${t}</li>`).join('')}</ul><p class="text-[11px] text-slate-400 mt-2">Indikator ini otomatis <b>LULUS</b> & disembunyikan dari form mingguan berikutnya!</p>`,
        confirmButtonColor: '#059669',
        customClass: { popup: 'rounded-[2.5rem]' }
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Laporan Berhasil Disimpan! 💖',
        text: 'Terima kasih Bunda, cerita & catatan perkembangan minggu ini sudah diterima Guru.',
        confirmButtonColor: '#306896',
        timer: 2500,
        customClass: { popup: 'rounded-[2.5rem]' }
      });
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Motorik Kasar": return <Trophy size={20} />;
      case "Motorik Halus": return <Sparkles size={20} />;
      case "Kognitif": return <BrainCircuit size={20} />;
      case "Bahasa": return <MessageCircle size={20} />;
      case "Sosial-Emosional": return <Heart size={20} />;
      default: return <ShieldCheck size={20} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32 animate-in fade-in duration-700 text-left">
      
      {/* HEADER NAVBAR */}
      <div className="flex items-center justify-between px-2">
        <button 
          onClick={() => navigate('/ortu/dashboard')}
          className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-500 hover:text-rose-500 hover:bg-rose-50 transition-all shadow-sm flex items-center gap-2 font-bold text-xs"
        >
          <ChevronLeft size={20} /> Kembali
        </button>
        <div className="text-center">
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest block">SDIDTK / Buku KIA</span>
          <h2 className="text-xl font-black text-[#0a1e36] italic uppercase tracking-wider">Laporan Mingguan Ortu</h2>
        </div>
        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
          <Star size={22} className="fill-indigo-600" />
        </div>
      </div>

      {/* BANNER UTAMA */}
      <div className="bg-gradient-to-br from-[#0a1e36] via-[#1e3a8a] to-[#306896] p-8 md:p-10 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black text-amber-300 border border-white/10">
            <Sparkles size={14} /> Bebas Survey Fatigue • Maksimal 4 Indikator/Minggu
          </div>
          <h3 className="text-2xl md:text-3xl font-black tracking-tight">Pantau Si Kecil Minggu Ini 📝</h3>
          <p className="text-blue-100 text-xs md:text-sm font-medium opacity-90 leading-relaxed max-w-2xl">
            Panduan indikator tumbuh kembang diambil resmi dari <span className="text-amber-300 font-bold">Buku KIA (SDIDTK)</span>. Indikator dirotasi secara otomatis agar pengisian tetap cepat, menyenangkan, & edukatif!
          </p>

          {/* AGE SELECTOR TABS */}
          <div className="pt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-blue-200 mr-2 flex items-center gap-1">
              <Baby size={16} className="text-amber-400" /> Target Usia:
            </span>
            {[2, 3, 5, 6].map((age) => (
              <button
                key={age}
                onClick={() => setSelectedAge(age)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  selectedAge === age 
                  ? 'bg-amber-400 text-slate-950 shadow-lg scale-105' 
                  : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                {age} Tahun
              </button>
            ))}
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-[-20px] bottom-[-20px] w-56 h-56 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* MILESTONE UNLOCKED BANNER / BADGE */}
      {passedIndicators && passedIndicators.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-100 p-6 rounded-[2.5rem] space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                <Trophy size={20} />
              </div>
              <div>
                <h4 className="font-black text-emerald-950 text-sm uppercase tracking-wider">Milestone Unlocked! 🎉</h4>
                <p className="text-[11px] font-medium text-emerald-700">
                  {passedIndicators.length} dari {currentAgeDataset.length} Indikator Usia {selectedAge} Tahun telah LULUS (2x Mandiri berturut-turut).
                </p>
              </div>
            </div>
            <span className="text-xs font-black bg-emerald-200 text-emerald-800 px-3 py-1.5 rounded-full">
              {currentAgeDataset.length > 0 ? Math.round((passedIndicators.length / currentAgeDataset.length) * 100) : 0}% Tuntas
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {passedIndicators.map((item) => (
              <div key={item.id} className="bg-white px-3 py-1.5 rounded-xl border border-emerald-200 text-[11px] font-bold text-emerald-800 flex items-center gap-1.5 shadow-sm">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>{item.task}</span>
                <span className="bg-emerald-100 text-emerald-700 text-[9px] px-1.5 py-0.5 rounded font-black uppercase">PASSED</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FORM ROTASI MINGGUAN (MAX 3-4 INDIKATOR) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div>
            <h3 className="font-black text-[#0a1e36] text-lg flex items-center gap-2">
              <RefreshCw size={18} className="text-indigo-600" />
              Rotasi Minggu Ini ({activeWeeklyIndicators.length} Poin Utama)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Beri penilaian progres perkembangan si kecil dengan memilih salah satu opsi di bawah:
            </p>
          </div>
          <span className="text-[11px] font-bold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl border border-indigo-100">
            Usia {selectedAge} Tahun
          </span>
        </div>

        {activeWeeklyIndicators.length === 0 ? (
          <div className="bg-emerald-500 text-white p-8 rounded-[2.5rem] text-center space-y-3 shadow-xl">
            <Trophy size={48} className="mx-auto text-amber-300 animate-bounce" />
            <h4 className="text-xl font-black">Luar Biasa! Semua Milestone Usia {selectedAge} Tahun Tercapai! 🌟</h4>
            <p className="text-xs text-emerald-100 max-w-md mx-auto leading-relaxed font-medium">
              Bunda telah menandai seluruh indikator perkembangan usia {selectedAge} tahun sebagai **Sudah Mandiri**. Pilih target usia selanjutnya di bagian atas untuk memantau tahapan baru!
            </p>
          </div>
        ) : (
          activeWeeklyIndicators.map((item, idx) => (
            <div key={item.id} className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:border-indigo-200 hover:shadow-md">
              <div className="flex items-start md:items-center gap-4 text-left">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                  {getCategoryIcon(item.category)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50/80 px-2.5 py-0.5 rounded-md">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">Poin #{idx + 1}</span>
                  </div>
                  <h4 className="font-bold text-[#0a1e36] text-base leading-snug">{item.task}</h4>
                </div>
              </div>

              {/* OPSI RATING (UX LANGUAGE BARU) */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100 shrink-0">
                {RATING_OPTIONS.map((opt) => {
                  const isSelected = scores[item.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleScoreChange(item.id, opt.value)}
                      className={`px-3 py-3 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center text-center gap-1 ${
                        isSelected 
                        ? opt.activeClass 
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-100 shadow-sm'
                      }`}
                    >
                      <span className="text-[11px] leading-tight">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* INPUT MEDIA UPLOAD (OPSIONAL) */}
      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-4 text-left">
        <label className="flex items-center gap-2 font-black text-[#0a1e36] uppercase text-xs tracking-wider">
          <Camera size={18} className="text-indigo-600" />
          Foto / Video Singkat Kegiatan Si Kecil Minggu Ini <span className="text-slate-400 text-[10px] font-bold lowercase">(opsional)</span>
        </label>
        
        {mediaPreview ? (
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-black/5 max-h-72 flex items-center justify-center">
            {mediaType === 'video' ? (
              <video src={mediaPreview} controls className="max-h-72 w-full object-contain rounded-3xl" />
            ) : (
              <img src={mediaPreview} alt="Preview Kegiatan" className="max-h-72 w-full object-cover rounded-3xl" />
            )}
            <button
              onClick={handleRemoveMedia}
              className="absolute top-4 right-4 p-2 bg-rose-600 text-white rounded-full hover:bg-rose-700 shadow-lg transition-all"
              title="Hapus Media"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <label className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/30 p-8 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer transition-all gap-2 text-center group">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 shadow-sm transition-colors">
              <Upload size={22} />
            </div>
            <p className="text-xs font-bold text-slate-700 group-hover:text-indigo-600">Klik untuk memilih foto atau video kegiatan</p>
            <p className="text-[10px] text-slate-400 font-medium">Format PNG, JPG, MP4 (Maksimal 10MB)</p>
            <input 
              type="file" 
              accept="image/*,video/*" 
              className="hidden" 
              onChange={handleMediaUpload} 
            />
          </label>
        )}
      </div>

      {/* INPUT CERITA MOMEN UNIK */}
      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-4 text-left">
        <label className="flex items-center gap-2 font-black text-[#0a1e36] uppercase text-xs tracking-wider">
          <Sparkles size={18} className="text-amber-500" />
          Cerita Momen Unik Si Kecil Minggu Ini <span className="text-slate-400 text-[10px] font-bold lowercase">(opsional)</span>
        </label>
        <textarea 
          placeholder="Contoh: Aditya minggu ini lucu banget, pas diajak mengayuh sepeda dia cerita kalau mau jadi pembalap hebat..."
          rows={3}
          className="w-full p-6 bg-slate-50 rounded-[2rem] border border-slate-100 focus:ring-2 focus:ring-indigo-500 text-sm font-medium italic text-slate-700 outline-none transition-all placeholder:text-slate-400"
          value={ceritaMomen}
          onChange={(e) => setCeritaMomen(e.target.value)}
        ></textarea>
      </div>

      {/* TOMBOL SIMPAN */}
      {activeWeeklyIndicators.length > 0 && (
        <button 
          onClick={handleSave}
          className="w-full py-6 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.25em] shadow-xl shadow-indigo-200 hover:from-indigo-700 hover:to-blue-700 active:scale-98 transition-all flex items-center justify-center gap-3"
        >
          <Save size={18} /> Simpan & Kirim Laporan Mingguan
        </button>
      )}

      {/* REKAPITULASI TERAKHIR (DENGAN SAFE GUARD ARRAY CHECK) */}
      {lastSaved && (
        <div className="mt-12 bg-emerald-50/70 border-2 border-emerald-100 p-8 rounded-[3rem] space-y-6 animate-in slide-in-from-top-4 duration-500 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 className="font-black text-emerald-950 uppercase text-xs tracking-wider">Laporan Terakhir</h3>
                <p className="text-[11px] font-bold text-emerald-700 italic">Tanggal: {lastSaved.tanggal || '-'}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-emerald-600 italic">{lastSaved.totalSkor ?? 0}%</span>
              <p className="text-[9px] font-black text-emerald-500 uppercase tracking-wider">Skor Kemandirian</p>
            </div>
          </div>

          {Array.isArray(lastSaved.items) && lastSaved.items.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lastSaved.items.map((it, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-emerald-100 flex justify-between items-center shadow-sm">
                  <div className="pr-2">
                    <span className="text-[9px] font-black text-emerald-600 uppercase block">{it.category || 'Kemandirian'}</span>
                    <span className="text-xs font-bold text-slate-700">{it.task || '-'}</span>
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg shrink-0 ${
                    it.score === 3 ? 'bg-emerald-100 text-emerald-700' : it.score === 2 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {it.scoreLabel || (it.score === 3 ? 'Sudah Mandiri' : it.score === 2 ? 'Perlu Bantuan' : 'Belum Terlihat')}
                  </span>
                </div>
              ))}
            </div>
          )}

          {lastSaved.mediaUrl && (
            <div className="bg-white p-4 rounded-2xl border border-emerald-100 space-y-2">
              <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Lampiran Dokumentasi:</p>
              {lastSaved.mediaType === 'video' ? (
                <video src={lastSaved.mediaUrl} controls className="max-h-48 rounded-xl w-full object-contain bg-black/5" />
              ) : (
                <img src={lastSaved.mediaUrl} alt="Dokumentasi Ortu" className="max-h-48 rounded-xl object-cover" />
              )}
            </div>
          )}

          {(lastSaved.ceritaMomen || lastSaved.catatan) && (
            <div className="bg-white/80 p-4 rounded-2xl border border-dashed border-emerald-200 space-y-1">
              <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Cerita Momen Unik Bunda:</p>
              <p className="text-xs italic text-slate-700 leading-relaxed">"{lastSaved.ceritaMomen || lastSaved.catatan}"</p>
            </div>
          )}

          <div className="text-center pt-2">
            <button 
              onClick={() => navigate('/ortu/dashboard')}
              className="text-xs font-black text-emerald-700 uppercase flex items-center justify-center gap-2 w-full hover:gap-4 transition-all"
            >
              Kembali ke Dashboard <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProgressOrtu;