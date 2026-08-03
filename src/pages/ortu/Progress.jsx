// src/pages/ortu/Progress.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, Save, Sparkles, Upload, X, Baby, Calendar, 
  Image as ImageIcon, CheckCircle2, Circle, Clock, ChevronDown, 
  ChevronUp, Activity, Palette, MessageSquare, HeartHandshake,
  Camera, Check, AlertCircle, Shirt, BookOpen, Layers, Lock, Unlock
} from 'lucide-react';
import Swal from 'sweetalert2';

// --- DATASET INDIKATOR PER KELOMPOK USIA (SDIDTK / BUKU KIA / PERKEMBANGAN.PDF) ---
const PERKEMBANGAN_DATA = {
  "24_36_bulan": {
    label: "24 - 36 Bulan",
    gerakKasar: {
      label: "Gerak Kasar",
      items: [
        { id: "gk_2_1", title: "Lanjutkan stimulasi usia sebelumnya", status: "belum_pernah" },
        { id: "gk_2_2", title: "Aktivitas fisik", status: "belum_pernah" },
        { id: "gk_2_3", title: "Latihan menghadapi rintangan", status: "belum_pernah" },
        { id: "gk_2_4", title: "Melompat jauh dengan kedua kaki bersamaan", status: "belum_pernah" },
        { id: "gk_2_5", title: "Melempar dan menangkap", status: "belum_pernah" }
      ]
    },
    gerakHalus: {
      label: "Gerak Halus",
      items: [
        { id: "gh_2_1", title: "Lanjutkan stimulasi usia sebelumnya", status: "belum_pernah" },
        { id: "gh_2_2", title: "Mencoret-coret kertas", status: "belum_pernah" },
        { id: "gh_2_3", title: "Membuat gambar tempelan", status: "belum_pernah" },
        { id: "gh_2_4", title: "Memilih dan mengelompokkan benda-benda menurut jenisnya", status: "belum_pernah" },
        { id: "gh_2_5", title: "Mencocokkan gambar dan benda", status: "belum_pernah" },
        { id: "gh_2_6", title: "Konsep jumlah", status: "belum_pernah" },
        { id: "gh_2_7", title: "Bermain/menyusun balok-balok", status: "belum_pernah" }
      ]
    },
    bicaraBahasa: {
      label: "Bicara & Bahasa",
      items: [
        { id: "bb_2_1", title: "Lanjutkan stimulasi usia sebelumnya", status: "belum_pernah" },
        { id: "bb_2_2", title: "Ajak bicara", status: "belum_pernah" },
        { id: "bb_2_3", title: "Bacakan buku cerita anak", status: "belum_pernah" },
        { id: "bb_2_4", title: "Dengarkan cerita anak", status: "belum_pernah" },
        { id: "bb_2_5", title: "Batasi waktu menonton maksimal 1 jam sehari", status: "belum_pernah" },
        { id: "bb_2_6", title: "Menyebut nama lengkap anak", status: "belum_pernah" },
        { id: "bb_2_7", title: "Bercerita tentang diri anak", status: "belum_pernah" },
        { id: "bb_2_8", title: "Melihat gambar dan dapat menyebut dengan benar nama 2 benda atau lebih", status: "belum_pernah" },
        { id: "bb_2_9", title: "Menyebut jenis pakaian", status: "belum_pernah" },
        { id: "bb_2_10", title: "Menyatakan keadaan suatu benda", status: "belum_pernah" }
      ]
    },
    sosialKemandirian: {
      label: "Sosial & Kemandirian",
      items: [
        { id: "sk_2_1", title: "Belajar makan sendiri tanpa banyak tumpah", status: "belum_pernah" },
        { id: "sk_2_2", title: "Melepas pakaian sendiri", status: "belum_pernah" },
        { id: "sk_2_3", title: "Melatih buang air kecil dan buang air besar di kamar mandi/WC", status: "belum_pernah" },
        { id: "sk_2_4", title: "Berpakaian", status: "belum_pernah" },
        { id: "sk_2_5", title: "Bujuk dan tenangkan ketika anak kecewa dengan cara memeluk dan berbicara kepadanya", status: "belum_pernah" },
        { id: "sk_2_6", title: "Berdandan", status: "belum_pernah" },
        { id: "sk_2_7", title: "Menekankan konsep aturan dan empati", status: "belum_pernah" }
      ]
    }
  },
  "36_48_bulan": {
    label: "36 - 48 Bulan",
    gerakKasar: {
      label: "Gerak Kasar",
      items: [
        { id: "gk_3_1", title: "Mengayuh sepeda roda tiga", status: "belum_pernah" },
        { id: "gk_3_2", title: "Berdiri di atas satu kaki tanpa berpegangan", status: "belum_pernah" },
        { id: "gk_3_3", title: "Melompat dengan satu kaki", status: "belum_pernah" },
        { id: "gk_3_4", title: "Berjalan mengikuti garis lurus", status: "belum_pernah" }
      ]
    },
    gerakHalus: {
      label: "Gerak Halus",
      items: [
        { id: "gh_3_1", title: "Menggambar garis lurus dan lingkaran", status: "belum_pernah" },
        { id: "gh_3_2", title: "Bermain/menyusun balok-balok tinggi", status: "belum_pernah" },
        { id: "gh_3_3", title: "Mencocokkan gambar dan benda sederhana", status: "belum_pernah" },
        { id: "gh_3_4", title: "Menggunting kertas mengikuti garis", status: "belum_pernah" }
      ]
    },
    bicaraBahasa: {
      label: "Bicara & Bahasa",
      items: [
        { id: "bb_3_1", title: "Bicara dengan baik menggunakan 2-3 kata", status: "belum_pernah" },
        { id: "bb_3_2", title: "Mengenal 2-4 warna utama", status: "belum_pernah" },
        { id: "bb_3_3", title: "Menyebut nama, umur, dan tempat tinggal", status: "belum_pernah" },
        { id: "bb_3_4", title: "Bertanya menggunakan kata apa, siapa, dimana", status: "belum_pernah" }
      ]
    },
    sosialKemandirian: {
      label: "Sosial & Kemandirian",
      items: [
        { id: "sk_3_1", title: "Bermain interaktif bersama teman sebaya", status: "belum_pernah" },
        { id: "sk_3_2", title: "Mengenakan baju dan celana sendiri", status: "belum_pernah" },
        { id: "sk_3_3", title: "Mencuci tangan dengan sabun sendiri", status: "belum_pernah" },
        { id: "sk_3_4", title: "Mengikuti aturan sederhana dalam permainan", status: "belum_pernah" }
      ]
    }
  },
  "48_60_bulan": {
    label: "48 - 60 Bulan",
    gerakKasar: {
      label: "Gerak Kasar",
      items: [
        { id: "gk_4_1", title: "Melompat-lompat dengan 1 kaki", status: "belum_pernah" },
        { id: "gk_4_2", title: "Menangkap bola kecil dengan kedua tangan", status: "belum_pernah" },
        { id: "gk_4_3", title: "Menari atau bergerak mengikuti irama musik", status: "belum_pernah" },
        { id: "gk_4_4", title: "Berjalan jinjit beberapa langkah", status: "belum_pernah" }
      ]
    },
    gerakHalus: {
      label: "Gerak Halus",
      items: [
        { id: "gh_4_1", title: "Menggambar orang 3 bagian (kepala, badan, tangan/kaki)", status: "belum_pernah" },
        { id: "gh_4_2", title: "Menggambar tanda silang dan lingkaran", status: "belum_pernah" },
        { id: "gh_4_3", title: "Mengancing baju atau pakaian boneka", status: "belum_pernah" },
        { id: "gh_4_4", title: "Menaikkan dan menurunkan ritsleting", status: "belum_pernah" }
      ]
    },
    bicaraBahasa: {
      label: "Bicara & Bahasa",
      items: [
        { id: "bb_4_1", title: "Menjawab pertanyaan dengan kata-kata yang benar", status: "belum_pernah" },
        { id: "bb_4_2", title: "Menyebut angka dan menghitung jari (1-5)", status: "belum_pernah" },
        { id: "bb_4_3", title: "Bicaranya mudah dimengerti oleh orang lain", status: "belum_pernah" },
        { id: "bb_4_4", title: "Menceritakan kembali cerita pendek yang didengar", status: "belum_pernah" }
      ]
    },
    sosialKemandirian: {
      label: "Sosial & Kemandirian",
      items: [
        { id: "sk_4_1", title: "Berpakaian sendiri tanpa dibantu", status: "belum_pernah" },
        { id: "sk_4_2", title: "Menggosok gigi tanpa bantuan", status: "belum_pernah" },
        { id: "sk_4_3", title: "Merapikan mainan setelah digunakan", status: "belum_pernah" },
        { id: "sk_4_4", title: "Berbagi makanan atau mainan dengan teman", status: "belum_pernah" }
      ]
    }
  },
  "60_72_bulan": {
    label: "60 - 72+ Bulan",
    gerakKasar: {
      label: "Gerak Kasar",
      items: [
        { id: "gk_5_1", title: "Berjalan lurus pada garis", status: "belum_pernah" },
        { id: "gk_5_2", title: "Berdiri 1 kaki selama 11 detik", status: "belum_pernah" },
        { id: "gk_5_3", title: "Melompati rintangan kecil dengan aman", status: "belum_pernah" }
      ]
    },
    gerakHalus: {
      label: "Gerak Halus",
      items: [
        { id: "gh_5_1", title: "Menggambar 6 bagian tubuh lengkap", status: "belum_pernah" },
        { id: "gh_5_2", title: "Menggambar bentuk segi empat dan segitiga", status: "belum_pernah" },
        { id: "gh_5_3", title: "Menulis beberapa huruf/angka sederhana", status: "belum_pernah" }
      ]
    },
    bicaraBahasa: {
      label: "Bicara & Bahasa",
      items: [
        { id: "bb_5_1", title: "Mengerti dan menyebut arti lawan kata", status: "belum_pernah" },
        { id: "bb_5_2", title: "Mengenal angka dan menghitung 5-10 benda", status: "belum_pernah" },
        { id: "bb_5_3", title: "Mengenal sedikitnya 6 warna dasar", status: "belum_pernah" },
        { id: "bb_5_4", title: "Mengikuti instruksi 3 langkah sekaligus", status: "belum_pernah" }
      ]
    },
    sosialKemandirian: {
      label: "Sosial & Kemandirian",
      items: [
        { id: "sk_5_1", title: "Mengikuti aturan dalam permainan kelompok", status: "belum_pernah" },
        { id: "sk_5_2", title: "Mampu mandiri berbusana dan merapikan diri", status: "belum_pernah" },
        { id: "sk_5_3", title: "Mengungkapkan rasa terima kasih, maaf, dan tolong", status: "belum_pernah" }
      ]
    }
  }
};

const AGE_KEYS = ["24_36_bulan", "36_48_bulan", "48_60_bulan", "60_72_bulan"];

// CONFIG KATEGORI MENU DENGAN IKON TERSPESIFIKASI
const CATEGORY_CONFIG = [
  { 
    key: "gerakKasar", 
    title: "Gerak Kasar", 
    icon: Activity, 
    bgColor: "bg-[#e6f4f1]", 
    iconColor: "text-[#0d9488]", 
    borderColor: "border-[#ccece6]",
    badgeBg: "bg-[#0d9488]/10 text-[#0d9488]"
  },
  { 
    key: "gerakHalus", 
    title: "Gerak Halus", 
    icon: Layers, 
    bgColor: "bg-[#eef2ff]", 
    iconColor: "text-[#4f46e5]", 
    borderColor: "border-[#e0e7ff]",
    badgeBg: "bg-[#4f46e5]/10 text-[#4f46e5]"
  },
  { 
    key: "bicaraBahasa", 
    title: "Bicara & Bahasa", 
    icon: BookOpen, 
    bgColor: "bg-[#fdf4ff]", 
    iconColor: "text-[#c026d3]", 
    borderColor: "border-[#fae8ff]",
    badgeBg: "bg-[#c026d3]/10 text-[#c026d3]"
  },
  { 
    key: "sosialKemandirian", 
    title: "Sosial & Kemandirian", 
    icon: Shirt, 
    bgColor: "bg-[#fff1f2]", 
    iconColor: "text-[#e11d48]", 
    borderColor: "border-[#ffe4e6]",
    badgeBg: "bg-[#e11d48]/10 text-[#e11d48]"
  },
];

const ProgressOrtu = () => {
  const navigate = useNavigate();
  const [activeChild, setActiveChild] = useState(null);
  
  // 2-View Navigation State: 'menu' | 'detail'
  const [currentView, setCurrentView] = useState('menu');
  const [selectedAgeKeyIndex, setSelectedAgeKeyIndex] = useState(0); // Index in AGE_KEYS
  const [selectedCategoryKey, setSelectedCategoryKey] = useState("gerakKasar");
  
  // Status storage per item: { [itemId]: "belum_pernah" | "terkadang" | "sering" }
  const [itemStatuses, setItemStatuses] = useState({});
  const [expandedAccordion, setExpandedAccordion] = useState(null);
  
  // Media & Note State
  const [ceritaMomen, setCeritaMomen] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null);

  // --- 1. DATABASE FETCHING & DYNAMIC AGE LOGIC ---
  useEffect(() => {
    fetchActiveChild();
  }, []);

  const fetchActiveChild = async () => {
    let childData = null;

    try {
      const res = await fetch('/api/children/active');
      if (res.ok) {
        const json = await res.json();
        childData = json.data || json;
      }
    } catch (e) {
      console.warn("API /api/children/active offline/fallback ke session lokal.");
    }

    if (!childData) {
      try {
        const saved = localStorage.getItem('user_session');
        if (saved) childData = JSON.parse(saved);
      } catch (e) {}
    }

    if (childData) {
      setActiveChild(childData);
      
      const dob = childData.date_of_birth || childData.tanggal_lahir_anak || childData.tgl_lahir_anak || childData.tgl_lahir;
      const calculatedAgeKey = getAgeCategoryKey(dob || childData.usia);
      const ageIdx = AGE_KEYS.indexOf(calculatedAgeKey);
      if (ageIdx >= 0) setSelectedAgeKeyIndex(ageIdx);

      const childKey = childData.nisn || childData.nama_anak || childData.namaAnak || 'default_child';
      try {
        const savedStatuses = localStorage.getItem(`sitka_perkembangan_statuses_${childKey}`);
        if (savedStatuses) {
          setItemStatuses(JSON.parse(savedStatuses));
        }
      } catch (e) {}
    }
  };

  const getAgeCategoryKey = (birthDateOrAge) => {
    if (!birthDateOrAge) return "24_36_bulan";

    let ageInMonths = 24;
    if (typeof birthDateOrAge === 'number') {
      ageInMonths = birthDateOrAge > 12 ? birthDateOrAge : birthDateOrAge * 12;
    } else if (typeof birthDateOrAge === 'string') {
      const parsedDate = new Date(birthDateOrAge);
      if (!isNaN(parsedDate.getTime())) {
        const diffMs = Date.now() - parsedDate.getTime();
        ageInMonths = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30.4375));
      } else {
        const parsedNum = parseInt(birthDateOrAge, 10);
        if (!isNaN(parsedNum)) {
          ageInMonths = parsedNum > 12 ? parsedNum : parsedNum * 12;
        }
      }
    }

    if (ageInMonths < 36) return "24_36_bulan";
    if (ageInMonths < 48) return "36_48_bulan";
    if (ageInMonths < 60) return "48_60_bulan";
    return "60_72_bulan";
  };

  const currentAgeKey = AGE_KEYS[selectedAgeKeyIndex];
  const currentAgeData = PERKEMBANGAN_DATA[currentAgeKey] || PERKEMBANGAN_DATA["24_36_bulan"];

  // HITUNG USIA SEBENARNYA ANAK DARI DB UNTUK FUNGSI LOCKING
  const actualChildAgeKey = useMemo(() => {
    if (!activeChild) return "24_36_bulan";
    const dob = activeChild.date_of_birth || activeChild.tanggal_lahir_anak || activeChild.tgl_lahir_anak || activeChild.tgl_lahir;
    return getAgeCategoryKey(dob || activeChild.usia);
  }, [activeChild]);

  // STATUS STATUS TERKUNCI (LOCK) JIKA PILIHAN USIA BERBEDA DENGAN USIA SEBENARNYA ANAK
  const isAgeLocked = currentAgeKey !== actualChildAgeKey;

  // NAMA & USIA SISWA DINAMIS DARI DATABASE / SESSION
  const childName = useMemo(() => {
    return activeChild?.nama_anak || activeChild?.namaAnak || activeChild?.nama_siswa || activeChild?.nama || "Si Kecil";
  }, [activeChild]);

  const childAgeInfo = useMemo(() => {
    if (!activeChild) return "3 Tahun";
    const dob = activeChild.date_of_birth || activeChild.tanggal_lahir_anak || activeChild.tgl_lahir_anak || activeChild.tgl_lahir;
    if (!dob) {
      const ageNum = parseInt(activeChild.usia, 10);
      return !isNaN(ageNum) ? `${ageNum} Tahun` : "3 Tahun";
    }
    const parsedDate = new Date(dob);
    if (!isNaN(parsedDate.getTime())) {
      const diffMs = Date.now() - parsedDate.getTime();
      const months = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30.4375));
      const years = Math.floor(months / 12);
      return `${years} Thn (${months} Bln)`;
    }
    return activeChild.usia ? `${activeChild.usia} Tahun` : "3 Tahun";
  }, [activeChild]);

  // NAVIGASI PANAH USIA [<] [>]
  const handlePrevAge = () => {
    if (selectedAgeKeyIndex > 0) {
      setSelectedAgeKeyIndex(prev => prev - 1);
    }
  };

  const handleNextAge = () => {
    if (selectedAgeKeyIndex < AGE_KEYS.length - 1) {
      setSelectedAgeKeyIndex(prev => prev + 1);
    }
  };

  // ACTIVE CATEGORY FOR DETAIL VIEW
  const activeCategoryObject = useMemo(() => {
    return currentAgeData[selectedCategoryKey] || { label: "Kategori", items: [] };
  }, [currentAgeData, selectedCategoryKey]);

  const activeCategoryItems = activeCategoryObject.items || [];
  const activeCategoryTotal = activeCategoryItems.length;
  const activeCategorySering = useMemo(() => {
    return activeCategoryItems.filter(item => (itemStatuses[item.id] || item.status) === 'sering').length;
  }, [activeCategoryItems, itemStatuses]);

  const activeCategoryPercent = activeCategoryTotal > 0 ? Math.round((activeCategorySering / activeCategoryTotal) * 100) : 0;

  // HANDLER MASUK KE LAYAR DETAIL CATEGORY
  const handleOpenDetailView = (catKey) => {
    if (isAgeLocked) {
      return Swal.fire({
        icon: 'info',
        title: 'Rentang Usia Terkunci 🔒',
        html: `<p class="text-xs text-slate-600">Rentang <b>${currentAgeData.label}</b> hanya dapat dilihat untuk riwayat. Pengisian hanya diperbolehkan pada usia aktif ananda (<b>${PERKEMBANGAN_DATA[actualChildAgeKey]?.label}</b>).</p>`,
        confirmButtonColor: '#0a1e36',
        customClass: { popup: 'rounded-[2.5rem]' }
      });
    }
    setSelectedCategoryKey(catKey);
    setExpandedAccordion(null);
    setCurrentView('detail');
  };

  // HANDLER PENILAIAN FREKUENSI STATUS ("belum_pernah" | "terkadang" | "sering")
  const handleSelectStatus = async (itemId, newStatus) => {
    if (isAgeLocked) {
      return Swal.fire({
        icon: 'warning',
        title: 'Tidak Dapat Mengisi',
        text: 'Modul ini terkunci karena belum/tidak sesuai usia aktif ananda.',
        confirmButtonColor: '#0a1e36'
      });
    }

    const updatedStatuses = {
      ...itemStatuses,
      [itemId]: newStatus
    };
    setItemStatuses(updatedStatuses);

    if (newStatus === 'sering') {
      setTimeout(() => {
        setExpandedAccordion(prev => (prev === itemId ? null : prev));
      }, 300);
    }

    const childKey = activeChild?.nisn || activeChild?.nama_anak || activeChild?.namaAnak || 'default_child';

    try {
      localStorage.setItem(`sitka_perkembangan_statuses_${childKey}`, JSON.stringify(updatedStatuses));
    } catch (e) {}

    try {
      await fetch('/api/progress/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId: childKey,
          itemId: itemId,
          status: newStatus,
          timestamp: new Date().toISOString()
        })
      });
    } catch (e) {
      console.warn("Update API offline, tersimpan di penyimpanan lokal.");
    }
  };

  // MEDIA UPLOAD
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

  // SIMPAN & SINKRONISASI LAPORAN ORTU
  const handleSaveReport = () => {
    if (isAgeLocked) {
      return Swal.fire({
        icon: 'warning',
        title: 'Tidak Dapat Mengirim',
        text: 'Laporan hanya dapat dikirim pada rentang usia aktif ananda.',
        confirmButtonColor: '#0a1e36'
      });
    }

    const childKey = activeChild?.nisn || activeChild?.nama_anak || activeChild?.namaAnak || 'default_child';
    const childName = activeChild?.nama_anak || activeChild?.namaAnak || "Si Kecil";

    let grandTotalSering = 0;
    let grandTotalItems = 0;
    const reportFormattedItems = [];

    Object.keys(currentAgeData).forEach(catKey => {
      if (typeof currentAgeData[catKey] === 'object' && currentAgeData[catKey].items) {
        currentAgeData[catKey].items.forEach(item => {
          grandTotalItems++;
          const currentStat = itemStatuses[item.id] || item.status;
          if (currentStat === 'sering') grandTotalSering++;

          const scoreVal = currentStat === 'sering' ? 3 : currentStat === 'terkadang' ? 2 : 1;
          const scoreLbl = currentStat === 'sering' ? 'Sudah Mandiri' : currentStat === 'terkadang' ? 'Perlu Bantuan' : 'Belum Terlihat';

          reportFormattedItems.push({
            id: item.id,
            category: currentAgeData[catKey].label || catKey,
            task: item.title,
            score: scoreVal,
            scoreLabel: scoreLbl,
            status: currentStat
          });
        });
      }
    });

    const totalPercent = grandTotalItems > 0 ? Math.round((grandTotalSering / grandTotalItems) * 100) : 0;

    const reportPayload = {
      id: `rep_${Date.now()}`,
      namaSiswa: childName,
      namaOrtu: activeChild?.nama || `Orang Tua dari ${childName}`,
      usiaTahun: selectedAgeKeyIndex === 0 ? 3 : selectedAgeKeyIndex === 1 ? 4 : selectedAgeKeyIndex === 2 ? 5 : 6,
      usiaLabel: currentAgeData.label,
      totalSkor: totalPercent,
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
      localStorage.setItem(`sitka_progress_data_${childKey}`, JSON.stringify(reportPayload));
      
      let allReports = {};
      try {
        const rawAll = localStorage.getItem('sitka_all_ortu_reports');
        if (rawAll) allReports = JSON.parse(rawAll);
      } catch (e) {}
      
      const cleanChildName = (childName || "").toLowerCase().trim();
      allReports[cleanChildName] = reportPayload;
      allReports[childKey] = reportPayload;
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
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-left pb-28 animate-in fade-in duration-300 font-sans">
      
      {/* ======================================================================= */}
      {/* VIEW 1: LAYAR UTAMA (CATEGORY MENU VIEW) */}
      {/* ======================================================================= */}
      {currentView === 'menu' && (
        <div className="space-y-6">
          {/* HEADER UTAMA SEMPURNA & MODERN */}
          <div className="bg-[#0a1e36] text-white p-8 rounded-[2.5rem] shadow-xl border border-white/10 relative overflow-hidden">
            <div className="max-w-3xl mx-auto relative z-10 space-y-4">
              
              {/* BAR ATAS HEADER ALIGNED RAPI */}
              <div className="flex items-center justify-between gap-3">
                <button 
                  onClick={() => navigate('/ortu/dashboard')}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10 flex items-center gap-2 text-xs font-bold text-slate-100"
                >
                  <ChevronLeft size={16} /> Dashboard
                </button>

                {/* CONTROL SLIDER AGE BRACKET NAVIGASI RAPI */}
                <div className="flex items-center gap-1.5 bg-white/10 border border-white/15 px-2.5 py-1.5 rounded-2xl backdrop-blur-md">
                  <button 
                    onClick={handlePrevAge}
                    disabled={selectedAgeKeyIndex === 0}
                    className="p-1 text-amber-300 disabled:opacity-20 hover:bg-white/10 rounded-xl transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <div className="px-2 min-w-[115px] text-center">
                    <span className="text-xs font-black tracking-wider text-amber-300 block">
                      {currentAgeData.label}
                    </span>
                  </div>

                  <button 
                    onClick={handleNextAge}
                    disabled={selectedAgeKeyIndex === AGE_KEYS.length - 1}
                    className="p-1 text-amber-300 disabled:opacity-20 hover:bg-white/10 rounded-xl transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {/* JUDUL & BADGE LOCK STATUS */}
              <div className="pt-1 space-y-1.5 text-left">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black tracking-widest uppercase bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full border border-amber-400/30 flex items-center gap-1.5 shadow-2xs">
                    <Baby size={12} /> {childName} • Usia {childAgeInfo}
                  </span>
                  
                  {isAgeLocked ? (
                    <span className="text-[10px] font-black tracking-widest uppercase bg-rose-500/20 text-rose-300 px-3 py-1 rounded-full border border-rose-500/30 flex items-center gap-1">
                      <Lock size={12} /> Terkunci (Riwayat Usia)
                    </span>
                  ) : (
                    <span className="text-[10px] font-black tracking-widest uppercase bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                      <Unlock size={12} /> Usia Aktif Ananda
                    </span>
                  )}
                </div>

                <h1 className="text-2xl md:text-3xl font-black italic tracking-tight">
                  Tahapan Perkembangan
                </h1>
                <p className="text-xs text-indigo-200 opacity-90 max-w-lg leading-relaxed">
                  Pilih domain perkembangan di bawah ini untuk mengisi pencapaian kemandirian ananda.
                </p>
              </div>

            </div>
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-amber-400/10 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-3xl mx-auto px-4 md:px-6 pt-2 space-y-6">
            
            {/* GRID 4 CATEGORY CARDS DENGAN KONDISI LOCK */}
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Domain Perkembangan (Usia {currentAgeData.label}):
                </h3>
                {isAgeLocked ? (
                  <span className="text-[10px] font-bold text-rose-500 flex items-center gap-1">
                    <Lock size={12} /> Mode Terkunci
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-teal-600">Klik kartu untuk mengisi</span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {CATEGORY_CONFIG.map((config) => {
                  const CategoryIcon = config.icon;
                  const catData = currentAgeData[config.key] || { items: [] };
                  const items = catData.items || [];
                  const total = items.length;
                  const seringCount = items.filter(i => (itemStatuses[i.id] || i.status) === 'sering').length;

                  return (
                    <div
                      key={config.key}
                      onClick={() => handleOpenDetailView(config.key)}
                      className={`bg-white p-5 rounded-2xl border shadow-sm transition-all flex items-center justify-between relative overflow-hidden ${
                        isAgeLocked 
                        ? 'border-slate-200 bg-slate-50/70 opacity-80 cursor-not-allowed' 
                        : 'border-slate-100 hover:shadow-md hover:border-teal-200 cursor-pointer group'
                      }`}
                    >
                      {/* LEFT: ICON KATEGORI LINGKARAN PASTEL */}
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl ${
                          isAgeLocked ? 'bg-slate-200 text-slate-500' : `${config.bgColor} ${config.iconColor}`
                        } flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}>
                          <CategoryIcon size={26} />
                        </div>

                        {/* CENTER: NAMA KATEGORI */}
                        <div className="text-left">
                          <h4 className={`font-bold text-base transition-colors ${
                            isAgeLocked ? 'text-slate-500' : 'text-slate-800 group-hover:text-teal-700'
                          }`}>
                            {config.title}
                          </h4>
                          <span className="text-[10px] font-medium text-slate-400">
                            {total} Poin Indikator Perkembangan
                          </span>
                        </div>
                      </div>

                      {/* RIGHT: PROGRES / LOCK BADGE */}
                      <div className="flex items-center gap-3">
                        {isAgeLocked ? (
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-200 text-slate-600 flex items-center gap-1 border border-slate-300">
                            <Lock size={12} /> Terkunci
                          </span>
                        ) : (
                          <span className={`text-xs font-black px-3.5 py-1.5 rounded-full ${
                            seringCount === total && total > 0
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-teal-50 text-teal-700 border border-teal-100'
                          }`}>
                            {seringCount}/{total} Selesai
                          </span>
                        )}
                        
                        <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-teal-50 text-slate-400 group-hover:text-teal-600 flex items-center justify-center transition-colors">
                          {isAgeLocked ? <Lock size={16} className="text-slate-400" /> : <ChevronRight size={20} />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* UPLOAD DOKUMENTASI & MOMEN UNIK (OPSIONAL) */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4 text-left">
              <div>
                <h4 className="font-black text-[#0a1e36] text-base">Cerita Momen Unik Si Kecil (Opsional)</h4>
                <p className="text-xs text-slate-400 font-medium">Bunda dapat mengunggah momen perkembangan menarik untuk Wali Kelas.</p>
              </div>

              <textarea 
                rows={3}
                disabled={isAgeLocked}
                value={ceritaMomen}
                onChange={(e) => setCeritaMomen(e.target.value)}
                placeholder={isAgeLocked ? "Pengisian terkunci untuk usia riwayat..." : "Contoh: Ananda minggu ini sudah dapat meloncat jauh dan mau bercerita..."}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-teal-600 outline-none disabled:opacity-60 disabled:cursor-not-allowed"
              />

              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Foto / Video Kegiatan (Opsional)</p>
                {mediaPreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-black/5 max-h-56">
                    {!isAgeLocked && (
                      <button
                        type="button"
                        onClick={handleRemoveMedia}
                        className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-all z-10"
                      >
                        <X size={16} />
                      </button>
                    )}
                    {mediaType === 'video' ? (
                      <video src={mediaPreview} controls className="w-full max-h-56 object-contain"></video>
                    ) : (
                      <img src={mediaPreview} alt="Preview" className="w-full max-h-56 object-cover" />
                    )}
                  </div>
                ) : (
                  <label className={`flex flex-col items-center justify-center p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl transition-all ${
                    isAgeLocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-100/80 cursor-pointer'
                  }`}>
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-2">
                      <Camera size={24} />
                    </div>
                    <span className="text-xs font-bold text-slate-700">Unggah Foto atau Video Singkat</span>
                    <span className="text-[10px] text-slate-400">Maksimal 10MB</span>
                    <input type="file" disabled={isAgeLocked} accept="image/*,video/*" onChange={handleMediaUpload} className="hidden" />
                  </label>
                )}
              </div>

              <button
                type="button"
                disabled={isAgeLocked}
                onClick={handleSaveReport}
                className="w-full py-4 bg-[#0a1e36] text-amber-400 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg hover:bg-slate-900 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAgeLocked ? <Lock size={18} /> : <Save size={18} />}
                {isAgeLocked ? 'Pengisian Terkunci Sesuai Usia' : 'Simpan & Kirim Laporan ke Guru'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* VIEW 2: LAYAR DETAIL (SECTION ACCORDION VIEW) */}
      {/* ======================================================================= */}
      {currentView === 'detail' && (
        <div className="space-y-6">
          {/* TOP BAR LAYAR DETAIL SEMPURNA */}
          <div className="bg-[#0a1e36] text-white p-8 rounded-[2.5rem] shadow-xl border border-white/10 relative overflow-hidden">
            <div className="max-w-3xl mx-auto relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setCurrentView('menu')}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10 flex items-center gap-2 text-xs font-bold text-amber-300"
                >
                  <ChevronLeft size={16} /> Kembali ke Menu
                </button>

                <span className="text-xs font-black bg-teal-500/20 text-teal-300 px-3.5 py-1 rounded-full border border-teal-500/30">
                  {currentAgeData.label}
                </span>
              </div>

              <div className="pt-1 text-left space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 block">
                  Detail Kategori Perkembangan
                </span>
                <h2 className="text-2xl md:text-3xl font-black italic tracking-tight">
                  {activeCategoryObject.label}
                </h2>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-teal-400/10 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-3xl mx-auto px-4 md:px-6 pt-2 space-y-5">
            
            {/* COUNTER HEADER LAYAR DETAIL */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  Tahapan Perkembangan {activeCategoryObject.label}:
                </span>
                <span className="text-xs font-black text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
                  {activeCategorySering} dari {activeCategoryTotal} Selesai
                </span>
              </div>

              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 shadow-inner">
                <div 
                  className="bg-teal-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${activeCategoryPercent}%` }}
                ></div>
              </div>
            </div>

            {/* LIST ACCORDION CARDS */}
            <div className="space-y-3">
              {activeCategoryItems.map((item, index) => {
                const currentStatus = itemStatuses[item.id] || item.status || "belum_pernah";
                const isExpanded = expandedAccordion === item.id;

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
                    className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                      isExpanded 
                      ? 'border-teal-300 shadow-md ring-2 ring-teal-500/10' 
                      : currentStatus === 'sering'
                      ? 'border-emerald-100 hover:border-emerald-200'
                      : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div 
                      onClick={() => setExpandedAccordion(prev => (prev === item.id ? null : item.id))}
                      className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none group"
                    >
                      <div className="flex items-center gap-3.5">
                        {renderStatusIcon()}
                        <div className="text-left">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">
                            Indikator #{index + 1}
                          </span>
                          <h5 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-teal-700 transition-colors">
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

                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 bg-slate-50/70 border-t border-slate-100 space-y-3 text-left animate-in slide-in-from-top-2 duration-300">
                        <p className="text-xs font-bold text-slate-600">
                          Seberapa sering anak melakukan hal ini?
                        </p>

                        <div className="grid grid-cols-3 gap-2.5">
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

            <div className="pt-4">
              <button
                type="button"
                onClick={() => setCurrentView('menu')}
                className="w-full py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <ChevronLeft size={16} /> Kembali ke Menu Kategori Utama
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ProgressOrtu;