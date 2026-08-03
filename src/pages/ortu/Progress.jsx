// src/pages/ortu/Progress.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Save, Sparkles, Upload, X, Baby, Calendar, 
  Image as ImageIcon, CheckCircle2, Circle, Clock, ChevronDown, 
  ChevronUp, Activity, Palette, MessageSquare, HeartHandshake,
  Camera, Check, AlertCircle
} from 'lucide-react';
import Swal from 'sweetalert2';

// --- DATASET INDIKATOR PERKEMBANGAN PAUD (BUKU KIA / PERKEMBANGAN.PDF) ---
const PERKEMBANGAN_DATA = {
  "24_36_bulan": {
    label: "Perkembangan 24-36 Bulan (2-3 Tahun)",
    gerakKasar: {
      total: 5,
      label: "Gerak Kasar",
      icon: Activity,
      items: [
        { id: "gk_1", title: "Lanjutkan stimulasi usia sebelumnya", status: "belum_pernah" },
        { id: "gk_2", title: "Aktifitas fisik", status: "belum_pernah" },
        { id: "gk_3", title: "Latihan menghadapi rintangan", status: "belum_pernah" },
        { id: "gk_4", title: "Melompat jauh dengan kedua kaki bersamaan", status: "belum_pernah" },
        { id: "gk_5", title: "Melempar dan menangkap", status: "belum_pernah" }
      ]
    },
    gerakHalus: {
      total: 7,
      label: "Gerak Halus",
      icon: Palette,
      items: [
        { id: "gh_1", title: "Lanjutkan stimulasi usia sebelumnya", status: "belum_pernah" },
        { id: "gh_2", title: "Mencoret-coret kertas", status: "belum_pernah" },
        { id: "gh_3", title: "Membuat gambar tempelan", status: "belum_pernah" },
        { id: "gh_4", title: "Memilih dan mengelompokkan benda-benda menurut jenisnya", status: "belum_pernah" },
        { id: "gh_5", title: "Mencocokkan gambar dan benda", status: "belum_pernah" },
        { id: "gh_6", title: "Konsep jumlah", status: "belum_pernah" },
        { id: "gh_7", title: "Bermain/menyusun balok-balok", status: "belum_pernah" }
      ]
    },
    bicaraBahasa: {
      total: 10,
      label: "Bicara & Bahasa",
      icon: MessageSquare,
      items: [
        { id: "bb_1", title: "Lanjutkan stimulasi usia sebelumnya", status: "belum_pernah" },
        { id: "bb_2", title: "Ajak bicara", status: "belum_pernah" },
        { id: "bb_3", title: "Bacakan buku cerita anak", status: "belum_pernah" },
        { id: "bb_4", title: "Dengarkan cerita anak", status: "belum_pernah" },
        { id: "bb_5", title: "Batasi waktu menonton maksimal 1 jam sehari", status: "belum_pernah" },
        { id: "bb_6", title: "Menyebut nama lengkap anak", status: "belum_pernah" },
        { id: "bb_7", title: "Bercerita tentang diri anak", status: "belum_pernah" },
        { id: "bb_8", title: "Melihat gambar dan dapat menyebut dengan benar nama 2 benda atau lebih", status: "belum_pernah" },
        { id: "bb_9", title: "Menyebut jenis pakaian", status: "belum_pernah" },
        { id: "bb_10", title: "Menyatakan keadaan suatu benda", status: "belum_pernah" }
      ]
    },
    sosialKemandirian: {
      total: 7,
      label: "Sosial & Kemandirian",
      icon: HeartHandshake,
      items: [
        { id: "sk_1", title: "Belajar makan sendiri tanpa banyak tumpah", status: "belum_pernah" },
        { id: "sk_2", title: "Melepas pakaian sendiri", status: "belum_pernah" },
        { id: "sk_3", title: "Melatih buang air kecil dan buang air besar di kamar mandi/WC", status: "belum_pernah" },
        { id: "sk_4", title: "Berpakaian", status: "belum_pernah" },
        { id: "sk_5", title: "Bujuk dan tenangkan ketika anak kecewa dengan cara memeluk dan berbicara kepadanya", status: "belum_pernah" },
        { id: "sk_6", title: "Berdandan", status: "belum_pernah" },
        { id: "sk_7", title: "Menekankan Konsep", status: "belum_pernah" }
      ]
    }
  },
  "36_48_bulan": {
    label: "Perkembangan 36-48 Bulan (3-4 Tahun)",
    gerakKasar: {
      total: 5,
      label: "Gerak Kasar",
      icon: Activity,
      items: [
        { id: "gk_36_1", title: "Mengayuh sepeda roda tiga", status: "belum_pernah" },
        { id: "gk_36_2", title: "Berdiri di atas satu kaki tanpa berpegangan", status: "belum_pernah" },
        { id: "gk_36_3", title: "Melompat-lompat dengan kedua kaki bersamaan", status: "belum_pernah" },
        { id: "gk_36_4", title: "Naik dan turun tangga mandiri", status: "belum_pernah" },
        { id: "gk_36_5", title: "Menendang bola besar ke depan", status: "belum_pernah" }
      ]
    },
    gerakHalus: {
      total: 5,
      label: "Gerak Halus",
      icon: Palette,
      items: [
        { id: "gh_36_1", title: "Menggambar garis lurus dan lingkaran", status: "belum_pernah" },
        { id: "gh_36_2", title: "Menumpuk 4-6 balok kayu", status: "belum_pernah" },
        { id: "gh_36_3", title: "Memegang pensil dengan posisi jari", status: "belum_pernah" },
        { id: "gh_36_4", title: "Membuka halaman buku satu per satu", status: "belum_pernah" },
        { id: "gh_36_5", title: "Menggunting kertas mengikuti garis", status: "belum_pernah" }
      ]
    },
    bicaraBahasa: {
      total: 6,
      label: "Bicara & Bahasa",
      icon: MessageSquare,
      items: [
        { id: "bb_36_1", title: "Bicara dengan baik menggunakan 2-3 kata", status: "belum_pernah" },
        { id: "bb_36_2", title: "Mengenal 2-4 warna dasar", status: "belum_pernah" },
        { id: "bb_36_3", title: "Menyebut nama, umur, dan tempat tinggal", status: "belum_pernah" },
        { id: "bb_36_4", title: "Menjawab pertanyaan sederhana 'apa' dan 'siapa'", status: "belum_pernah" },
        { id: "bb_36_5", title: "Memahami kata depan (di atas, di bawah, di dalam)", status: "belum_pernah" },
        { id: "bb_36_6", title: "Menyanyikan lagu anak-anak sederhana", status: "belum_pernah" }
      ]
    },
    sosialKemandirian: {
      total: 5,
      label: "Sosial & Kemandirian",
      icon: HeartHandshake,
      items: [
        { id: "sk_36_1", title: "Bermain bersama teman secara kooperatif", status: "belum_pernah" },
        { id: "sk_36_2", title: "Melepas & mengenakan pakaian sendiri", status: "belum_pernah" },
        { id: "sk_36_3", title: "Mencuci & mengeringkan tangan sendiri", status: "belum_pernah" },
        { id: "sk_36_4", title: "Mengenal konsep berbagi dan bergantian", status: "belum_pernah" },
        { id: "sk_36_5", title: "Mengikuti instruksi sederhana tanpa menangis", status: "belum_pernah" }
      ]
    }
  },
  "48_60_bulan": {
    label: "Perkembangan 48-60 Bulan (4-5 Tahun)",
    gerakKasar: {
      total: 5,
      label: "Gerak Kasar",
      icon: Activity,
      items: [
        { id: "gk_48_1", title: "Melompat-lompat 1 kaki, menari & berjalan lurus", status: "belum_pernah" },
        { id: "gk_48_2", title: "Menangkap bola kecil dengan kedua tangan", status: "belum_pernah" },
        { id: "gk_48_3", title: "Berdiri 1 kaki selama 5 detik", status: "belum_pernah" },
        { id: "gk_48_4", title: "Berlari kencang dan berhenti tanpa terjatuh", status: "belum_pernah" },
        { id: "gk_48_5", title: "Melompat ke depan sejauh 30-50 cm", status: "belum_pernah" }
      ]
    },
    gerakHalus: {
      total: 5,
      label: "Gerak Halus",
      icon: Palette,
      items: [
        { id: "gh_48_1", title: "Menggambar orang 3 bagian (kepala, badan, kaki)", status: "belum_pernah" },
        { id: "gh_48_2", title: "Menggambar tanda silang dan lingkaran sempurna", status: "belum_pernah" },
        { id: "gh_48_3", title: "Menggunting bentuk sederhana", status: "belum_pernah" },
        { id: "gh_48_4", title: "Menulis beberapa huruf atau angka", status: "belum_pernah" },
        { id: "gh_48_5", title: "Menyusun puzzle 8-12 keping", status: "belum_pernah" }
      ]
    },
    bicaraBahasa: {
      total: 5,
      label: "Bicara & Bahasa",
      icon: MessageSquare,
      items: [
        { id: "bb_48_1", title: "Menjawab pertanyaan dengan kata-kata yang benar", status: "belum_pernah" },
        { id: "bb_48_2", title: "Menyebut angka & menghitung 1-10", status: "belum_pernah" },
        { id: "bb_48_3", title: "Bicaranya mudah dimengerti orang lain", status: "belum_pernah" },
        { id: "bb_48_4", title: "Bercerita singkat tentang kegiatan sekolah/bermain", status: "belum_pernah" },
        { id: "bb_48_5", title: "Memahami urutan peristiwa (sebelum & sesudah)", status: "belum_pernah" }
      ]
    },
    sosialKemandirian: {
      total: 5,
      label: "Sosial & Kemandirian",
      icon: HeartHandshake,
      items: [
        { id: "sk_48_1", title: "Berpakaian sendiri tanpa dibantu", status: "belum_pernah" },
        { id: "sk_48_2", title: "Mengancing baju atau pakaian boneka", status: "belum_pernah" },
        { id: "sk_48_3", title: "Menggosok gigi sendiri tanpa bantuan", status: "belum_pernah" },
        { id: "sk_48_4", title: "Pergi ke toilet sendiri dan membersihkan diri", status: "belum_pernah" },
        { id: "sk_48_5", title: "Menunjukkan rasa empati saat teman bersedih", status: "belum_pernah" }
      ]
    }
  },
  "60_72_bulan": {
    label: "Perkembangan 60-72 Bulan (5-6 Tahun)",
    gerakKasar: {
      total: 5,
      label: "Gerak Kasar",
      icon: Activity,
      items: [
        { id: "gk_60_1", title: "Berjalan lurus & berdiri 1 kaki selama 11 detik", status: "belum_pernah" },
        { id: "gk_60_2", title: "Melompat dengan satu kaki secara bergantian", status: "belum_pernah" },
        { id: "gk_60_3", title: "Naik sepeda roda dua dengan roda bantu", status: "belum_pernah" },
        { id: "gk_60_4", title: "Bermain lompat tali atau permainan fisik beregu", status: "belum_pernah" },
        { id: "gk_60_5", title: "Menangkap bola yang memantul dari lantai", status: "belum_pernah" }
      ]
    },
    gerakHalus: {
      total: 5,
      label: "Gerak Halus",
      icon: Palette,
      items: [
        { id: "gh_60_1", title: "Menggambar 6 bagian tubuh lengkap", status: "belum_pernah" },
        { id: "gh_60_2", title: "Menggambar segi empat & segitiga", status: "belum_pernah" },
        { id: "gh_60_3", title: "Menulis nama sendiri dengan huruf cetak", status: "belum_pernah" },
        { id: "gh_60_4", title: "Mewarnai gambar tidak keluar garis", status: "belum_pernah" },
        { id: "gh_60_5", title: "Mengikat tali sepatu atau membuat simpul sederhana", status: "belum_pernah" }
      ]
    },
    bicaraBahasa: {
      total: 5,
      label: "Bicara & Bahasa",
      icon: MessageSquare,
      items: [
        { id: "bb_60_1", title: "Mengerti arti lawan kata (besar-kecil, tinggi-pendek)", status: "belum_pernah" },
        { id: "bb_60_2", title: "Mengenal angka & menghitung 1-20", status: "belum_pernah" },
        { id: "bb_60_3", title: "Mengeja kata-kata sederhana", status: "belum_pernah" },
        { id: "bb_60_4", title: "Mengenal huruf alfabet secara lengkap", status: "belum_pernah" },
        { id: "bb_60_5", title: "Mampu menceritakan kembali cerita yang dibacakan", status: "belum_pernah" }
      ]
    },
    sosialKemandirian: {
      total: 5,
      label: "Sosial & Kemandirian",
      icon: HeartHandshake,
      items: [
        { id: "sk_60_1", title: "Mengenal warna & mengikuti aturan permainan", status: "belum_pernah" },
        { id: "sk_60_2", title: "Berpakaian & memakai sepatu sendiri", status: "belum_pernah" },
        { id: "sk_60_3", title: "Merapikan mainan dan peralatan sendiri", status: "belum_pernah" },
        { id: "sk_60_4", title: "Memahami aturan keselamatan dasar (jalan raya, barang panas)", status: "belum_pernah" },
        { id: "sk_60_5", title: "Bekerjasama dalam tugas kelompok kecil", status: "belum_pernah" }
      ]
    }
  }
};

const TAB_CATEGORIES = [
  { key: "gerakKasar", label: "Gerak Kasar", icon: Activity, color: "emerald" },
  { key: "gerakHalus", label: "Gerak Halus", icon: Palette, color: "blue" },
  { key: "bicaraBahasa", label: "Bicara & Bahasa", icon: MessageSquare, color: "purple" },
  { key: "sosialKemandirian", label: "Sosial & Kemandirian", icon: HeartHandshake, color: "rose" },
];

const ProgressOrtu = () => {
  const navigate = useNavigate();
  const [parentSession, setParentSession] = useState(null);
  const [selectedAgeKey, setSelectedAgeKey] = useState("24_36_bulan");
  const [activeTab, setActiveTab] = useState("gerakKasar");
  
  // Storage State: { [itemId]: "belum_pernah" | "terkadang" | "sering" }
  const [itemStatuses, setItemStatuses] = useState({});
  const [expandedAccordion, setExpandedAccordion] = useState(null);
  
  // Media & Note State
  const [ceritaMomen, setCeritaMomen] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'image' | 'video'

  // --- IDENTIFIKASI CHILD & LOAD LOCAL STORAGE ---
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

        // Kalkulasi Kelompok Usia dari tanggal lahir / profile
        const tglLahir = user?.tanggal_lahir_anak || user?.tgl_lahir_anak || user?.tgl_lahir;
        if (tglLahir) {
          const birthDate = new Date(tglLahir);
          if (!isNaN(birthDate.getTime())) {
            const ageDifMs = Date.now() - birthDate.getTime();
            const ageDate = new Date(ageDifMs);
            const calcAge = Math.abs(ageDate.getUTCFullYear() - 1970);
            
            if (calcAge <= 2) setSelectedAgeKey("24_36_bulan");
            else if (calcAge <= 4) setSelectedAgeKey("36_48_bulan");
            else if (calcAge === 5) setSelectedAgeKey("48_60_bulan");
            else setSelectedAgeKey("60_72_bulan");
          }
        } else if (user?.usia) {
          const parsedAge = parseInt(user.usia, 10);
          if (!isNaN(parsedAge)) {
            if (parsedAge <= 2) setSelectedAgeKey("24_36_bulan");
            else if (parsedAge <= 4) setSelectedAgeKey("36_48_bulan");
            else if (parsedAge === 5) setSelectedAgeKey("48_60_bulan");
            else setSelectedAgeKey("60_72_bulan");
          }
        }
      }
    } catch (err) {
      console.error("Error reading user_session:", err);
    }

    // Load Rekap Status Perkembangan Anak
    try {
      const savedData = localStorage.getItem(`sitka_perkembangan_statuses_${childKey}`);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed && typeof parsed === 'object') {
          setItemStatuses(parsed);
        }
      }
    } catch (err) {
      console.error("Error reading saved statuses:", err);
    }
  }, []);

  // DATASET USIA AKTIF
  const ageDataset = useMemo(() => {
    return PERKEMBANGAN_DATA[selectedAgeKey] || PERKEMBANGAN_DATA["24_36_bulan"];
  }, [selectedAgeKey]);

  // CATEGORY ACTIVE ITEMS & METRICS
  const activeCategoryObject = useMemo(() => {
    return ageDataset[activeTab] || { label: "Kategori", items: [] };
  }, [ageDataset, activeTab]);

  const activeItems = useMemo(() => {
    return activeCategoryObject.items || [];
  }, [activeCategoryObject]);

  const totalItemsCount = activeItems.length;

  const seringCount = useMemo(() => {
    return activeItems.filter(item => (itemStatuses[item.id] || item.status) === 'sering').length;
  }, [activeItems, itemStatuses]);

  const progressPercent = useMemo(() => {
    return totalItemsCount > 0 ? Math.round((seringCount / totalItemsCount) * 100) : 0;
  }, [seringCount, totalItemsCount]);

  // HANDLER ACCORDION TOGGLE
  const toggleAccordion = (itemId) => {
    setExpandedAccordion(prev => (prev === itemId ? null : itemId));
  };

  // HANDLER PENILAIAN FREKUENSI STATUS ("belum_pernah" | "terkadang" | "sering")
  const handleSelectStatus = (itemId, newStatus) => {
    const updated = {
      ...itemStatuses,
      [itemId]: newStatus
    };
    setItemStatuses(updated);

    // Auto UX: Jika 'sering' dipilih, berikan animasi penutupan accordion halus setelah 350ms
    if (newStatus === 'sering') {
      setTimeout(() => {
        setExpandedAccordion(prev => (prev === itemId ? null : prev));
      }, 350);
    }

    // Simpan otomatis ke storage
    try {
      const childKey = parentSession?.nisn || parentSession?.nama_anak || parentSession?.namaAnak || 'default_child';
      localStorage.setItem(`sitka_perkembangan_statuses_${childKey}`, JSON.stringify(updated));
    } catch (e) {
      console.error("Gagal simpan status ke storage:", e);
    }
  };

  // MEDIA FILE HANDLER
  const handleMediaUpload = (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      return Swal.fire({
        icon: 'error',
        title: 'Ukuran File Terlalu Besar',
        text: 'Bunda, batas maksimal ukuran foto/video adalah 10MB.',
        confirmButtonColor: '#306896',
        customClass: { popup: 'rounded-[2.5rem]' }
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

  // HANDLER SIMPAN & KIRIM LAPORAN KE GURU
  const handleSaveReport = () => {
    const childKey = parentSession?.nisn || parentSession?.nama_anak || parentSession?.namaAnak || 'default_child';
    const childName = parentSession?.nama_anak || parentSession?.namaAnak || "Si Kecil";

    // Hitung total kemandirian dari seluruh item di 4 kategori
    const allCategories = ageDataset;
    let grandTotalSering = 0;
    let grandTotalItems = 0;
    const reportFormattedItems = [];

    Object.keys(allCategories).forEach(catKey => {
      if (typeof allCategories[catKey] === 'object' && allCategories[catKey].items) {
        allCategories[catKey].items.forEach(item => {
          grandTotalItems++;
          const currentStat = itemStatuses[item.id] || item.status;
          if (currentStat === 'sering') grandTotalSering++;

          const scoreVal = currentStat === 'sering' ? 3 : currentStat === 'terkadang' ? 2 : 1;
          const scoreLbl = currentStat === 'sering' ? 'Sudah Mandiri' : currentStat === 'terkadang' ? 'Perlu Bantuan' : 'Belum Terlihat';

          reportFormattedItems.push({
            id: item.id,
            category: allCategories[catKey].label || catKey,
            task: item.title,
            score: scoreVal,
            scoreLabel: scoreLbl,
            status: currentStat
          });
        });
      }
    });

    const totalScorePercentage = grandTotalItems > 0 ? Math.round((grandTotalSering / grandTotalItems) * 100) : 0;

    const reportData = {
      id: `rep_${Date.now()}`,
      namaSiswa: childName,
      namaOrtu: parentSession?.nama || `Orang Tua dari ${childName}`,
      usiaTahun: selectedAgeKey === '24_36_bulan' ? 3 : selectedAgeKey === '36_48_bulan' ? 4 : selectedAgeKey === '48_60_bulan' ? 5 : 6,
      usiaLabel: ageDataset.label,
      totalSkor: totalScorePercentage,
      tanggal: new Date().toLocaleDateString('id-ID', { 
        day: 'numeric', month: 'long', year: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
      }),
      ceritaMomen: ceritaMomen,
      mediaUrl: mediaPreview,
      mediaType: mediaType,
      items: reportFormattedItems
    };

    try {
      // 1. Simpan spesifik anak
      localStorage.setItem(`sitka_progress_data_${childKey}`, JSON.stringify(reportData));
      
      // 2. Simpan registry global untuk dibaca Report Guru
      let allReports = {};
      try {
        const rawAll = localStorage.getItem('sitka_all_ortu_reports');
        if (rawAll) allReports = JSON.parse(rawAll);
      } catch (e) {}
      
      const cleanChildName = (childName || "").toLowerCase().trim();
      allReports[cleanChildName] = reportData;
      allReports[childKey] = reportData;
      localStorage.setItem('sitka_all_ortu_reports', JSON.stringify(allReports));

      Swal.fire({
        icon: 'success',
        title: 'Laporan Perkembangan Terkirim! 🎉',
        html: `<p class="text-xs text-slate-600">Terima kasih Bunda/Ayah. Catatan perkembangan <b>${childName}</b> telah tersinkronisasi langsung ke modul Wali Kelas.</p>`,
        confirmButtonColor: '#306896',
        customClass: { popup: 'rounded-[2.5rem]' }
      });

    } catch (e) {
      console.error("Gagal simpan laporan:", e);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menyimpan',
        text: 'Terjadi masalah saat menyimpan laporan. Silakan coba kembali.',
        confirmButtonColor: '#f43f5e'
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-left pb-28 animate-in fade-in duration-500">
      
      {/* TOP BAR / HEADER */}
      <div className="bg-[#0a1e36] text-white pt-8 pb-10 px-6 rounded-b-[3rem] shadow-xl relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/ortu/dashboard')}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10 flex items-center gap-2 text-xs font-bold"
            >
              <ChevronLeft size={18} /> Kembali
            </button>

            {/* AGE BRACKET SELECTOR */}
            <div className="relative">
              <select
                value={selectedAgeKey}
                onChange={(e) => setSelectedAgeKey(e.target.value)}
                className="pl-4 pr-8 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-black appearance-none cursor-pointer outline-none text-amber-300"
              >
                <option value="24_36_bulan" className="text-[#0a1e36]">24-36 Bulan (2-3 Thn)</option>
                <option value="36_48_bulan" className="text-[#0a1e36]">36-48 Bulan (3-4 Thn)</option>
                <option value="48_60_bulan" className="text-[#0a1e36]">48-60 Bulan (4-5 Thn)</option>
                <option value="60_72_bulan" className="text-[#0a1e36]">60-72 Bulan (5-6 Thn)</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/60"/>
            </div>
          </div>

          <div className="pt-2 space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 border border-amber-400/30 rounded-full text-amber-300 text-[10px] font-black uppercase tracking-widest">
              <Baby size={12} /> {ageDataset.label}
            </div>
            <h1 className="text-2xl md:text-3xl font-black italic tracking-tight">
              Kuesioner Perkembangan Si Kecil
            </h1>
            <p className="text-xs text-indigo-200 opacity-90 max-w-lg leading-relaxed">
              Pantau stimulasi & pencapaian kemandirian ananda berbasis referensi Buku KIA secara mudah dan edukatif.
            </p>
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-amber-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 -mt-6 space-y-6">
        
        {/* SUB-HEADER & DYNAMIC PROGRESS COUNTER */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-4">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Kelompok Usia</span>
              <h3 className="text-base font-black text-[#0a1e36] flex items-center gap-2">
                {ageDataset.label}
              </h3>
            </div>
            
            <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-2xl text-left md:text-right">
              <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider block">Progres Kemandirian (Sering)</span>
              <p className="text-sm font-black text-emerald-800">
                Tahapan {activeCategoryObject.label}: <span className="text-emerald-600 text-base">{seringCount}</span> dari {totalItemsCount}
              </p>
            </div>
          </div>

          {/* DYNAMIC PROGRESS BAR */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-wider">
              <span>Capaian {activeCategoryObject.label}</span>
              <span className="text-emerald-600">{progressPercent}% Mandiri</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION (HORIZONTAL SCROLLABLE BAR) */}
        <div className="bg-white p-2 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            {TAB_CATEGORIES.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.key;
              const catItems = ageDataset[tab.key]?.items || [];
              const catSering = catItems.filter(i => (itemStatuses[i.id] || i.status) === 'sering').length;

              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setExpandedAccordion(null);
                  }}
                  className={`px-5 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2.5 shrink-0 ${
                    isActive 
                    ? 'bg-[#0a1e36] text-amber-400 shadow-md shadow-blue-950/20' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <TabIcon size={16} className={isActive ? 'text-amber-400' : 'text-slate-400'} />
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {catSering}/{catItems.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ACCORDION CARDS LIST FOR ACTIVE CATEGORY */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-2">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Daftar Indikator ({activeCategoryObject.label}):
            </h4>
            <span className="text-[10px] font-bold text-slate-400">Klik kartu untuk memilih frekuensi</span>
          </div>

          {activeItems.map((item, index) => {
            const currentStatus = itemStatuses[item.id] || item.status || "belum_pernah";
            const isExpanded = expandedAccordion === item.id;

            // LOGIKA IKON SISI KIRI CARD:
            // - sering: Ceklis Hijau (CheckCircle2)
            // - terkadang: Oranye/Kuning (Clock)
            // - belum_pernah: Lingkaran Abu-abu Netral (Circle)
            const renderStatusIcon = () => {
              if (currentStatus === 'sering') {
                return (
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
                    <CheckCircle2 size={20} className="fill-emerald-600 text-white" />
                  </div>
                );
              }
              if (currentStatus === 'terkadang') {
                return (
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
                    <Clock size={18} />
                  </div>
                );
              }
              return (
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                  <Circle size={18} className="text-slate-400" />
                </div>
              );
            };

            return (
              <div 
                key={item.id}
                className={`bg-white rounded-[2rem] border transition-all overflow-hidden ${
                  isExpanded 
                  ? 'border-indigo-300 shadow-md ring-2 ring-indigo-500/10' 
                  : currentStatus === 'sering'
                  ? 'border-emerald-100 hover:border-emerald-200'
                  : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                {/* TOP LEVEL CARD HEADER */}
                <div 
                  onClick={() => toggleAccordion(item.id)}
                  className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-3.5">
                    {renderStatusIcon()}
                    <div className="text-left">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">
                        Indikator #{index + 1}
                      </span>
                      <h5 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-indigo-600 transition-colors">
                        {item.title}
                      </h5>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-xl hidden sm:inline-block ${
                      currentStatus === 'sering'
                      ? 'bg-emerald-100 text-emerald-700'
                      : currentStatus === 'terkadang'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-100 text-slate-500'
                    }`}>
                      {currentStatus === 'sering' ? 'Sering' : currentStatus === 'terkadang' ? 'Terkadang' : 'Belum Pernah'}
                    </span>
                    
                    <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>
                </div>

                {/* EXPANDED CONTENT (DROPDOWN RADIO PILL BUTTONS) */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 bg-slate-50/70 border-t border-slate-100 space-y-3 text-left animate-in slide-in-from-top-2 duration-300">
                    <p className="text-xs font-bold text-slate-600">
                      Seberapa sering anak melakukan hal ini?
                    </p>

                    <div className="grid grid-cols-3 gap-2.5">
                      {/* OPSI 1: BELUM PERNAH */}
                      <button
                        type="button"
                        onClick={() => handleSelectStatus(item.id, "belum_pernah")}
                        className={`p-3 rounded-2xl font-black text-xs flex flex-col items-center gap-1.5 border transition-all ${
                          currentStatus === 'belum_pernah'
                          ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Circle size={16} />
                        <span>Belum Pernah</span>
                      </button>

                      {/* OPSI 2: TERKADANG */}
                      <button
                        type="button"
                        onClick={() => handleSelectStatus(item.id, "terkadang")}
                        className={`p-3 rounded-2xl font-black text-xs flex flex-col items-center gap-1.5 border transition-all ${
                          currentStatus === 'terkadang'
                          ? 'bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-200'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-amber-50 hover:text-amber-700'
                        }`}
                      >
                        <Clock size={16} />
                        <span>Terkadang</span>
                      </button>

                      {/* OPSI 3: SERING */}
                      <button
                        type="button"
                        onClick={() => handleSelectStatus(item.id, "sering")}
                        className={`p-3 rounded-2xl font-black text-xs flex flex-col items-center gap-1.5 border transition-all ${
                          currentStatus === 'sering'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-200'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
                        }`}
                      >
                        <CheckCircle2 size={16} />
                        <span>Sering</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* BAGIAN UPLOAD MEDIA DOKUMENTASI & CERITA MOMEN UNIK (OPSIONAL) */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4 text-left">
          <div>
            <h4 className="font-black text-[#0a1e36] text-base">Cerita Momen Unik Si Kecil Minggu Ini (Opsional)</h4>
            <p className="text-xs text-slate-400 font-medium">Bunda dapat membagikan cerita singkat atau mengunggah dokumentasi foto/video untuk Wali Kelas.</p>
          </div>

          <textarea 
            rows={3}
            value={ceritaMomen}
            onChange={(e) => setCeritaMomen(e.target.value)}
            placeholder="Contoh: Ananda minggu ini sudah mau makan sendiri menggunakan sendok tanpa tumpah..."
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 outline-none"
          />

          {/* UPLOAD FOTO/VIDEO */}
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Dokumentasi Foto / Video Kegiatan (Opsional)</p>
            {mediaPreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-black/5 max-h-56">
                <button
                  type="button"
                  onClick={handleRemoveMedia}
                  className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-all z-10"
                >
                  <X size={16} />
                </button>
                {mediaType === 'video' ? (
                  <video src={mediaPreview} controls className="w-full max-h-56 object-contain"></video>
                ) : (
                  <img src={mediaPreview} alt="Preview" className="w-full max-h-56 object-cover" />
                )}
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-6 bg-slate-50 hover:bg-slate-100/80 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer transition-all">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
                  <Camera size={24} />
                </div>
                <span className="text-xs font-bold text-slate-700">Unggah Foto atau Video Singkat</span>
                <span className="text-[10px] text-slate-400">Maksimal ukuran file 10MB</span>
                <input type="file" accept="image/*,video/*" onChange={handleMediaUpload} className="hidden" />
              </label>
            )}
          </div>

          {/* TOMBOL SIMPAN & KIRIM LAPORAN */}
          <button
            type="button"
            onClick={handleSaveReport}
            className="w-full py-4 bg-[#0a1e36] text-amber-400 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg hover:bg-slate-900 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Save size={18} /> Simpan & Kirim Laporan Perkembangan
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProgressOrtu;