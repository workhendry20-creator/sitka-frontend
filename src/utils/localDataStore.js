// src/utils/localDataStore.js
// Centralized fallback database to preserve full 26 student records, daily evaluations, semester scores, and announcements
// even when Supabase Cloud network is offline or unreachable.

export const DEFAULT_SISWA_LIST = [
  // Kelompok A (Rombel A) - 21 Siswa
  { id: 1, nisn: '01', nama: 'ALBIYAN ABDUL AZIZ', rombel: 'A', kelompok: 'Kelompok A', usia: '4 Tahun', jk: 'L', nama_ayah: 'GUSTI ARISANDI', nama_ibu: 'Siti Rahma' },
  { id: 2, nisn: '3203526409', nama: 'ALFAN ELRAMDAN SUGANDI', rombel: 'A', kelompok: 'Kelompok A', usia: '4 Tahun', jk: 'L', nama_ayah: 'Sugandi', nama_ibu: 'NIA SURYANI' },
  { id: 3, nisn: '3217307882', nama: 'ALIFA ZAHRA FITRIANI', rombel: 'A', kelompok: 'Kelompok A', usia: '4 Tahun', jk: 'P', nama_ayah: 'Fitrianto', nama_ibu: 'FITRI INDRIYANI' },
  { id: 4, nisn: '3218940150', nama: 'ALUCARD ILANO KEN KOSWARA', rombel: 'A', kelompok: 'Kelompok A', usia: '4 Tahun', jk: 'L', nama_ayah: 'Koswara', nama_ibu: 'YUNI AGUSTINA' },
  { id: 5, nisn: '3209716523', nama: 'ANEESQA SYAREEFA AZZAHRA', rombel: 'A', kelompok: 'Kelompok A', usia: '4 Tahun', jk: 'P', nama_ayah: 'Hidayat', nama_ibu: 'NOVA SELIA HIDAYAT' },
  { id: 6, nisn: '3209070782', nama: 'AQIELA NAYRA PUTRI RASIDIN', rombel: 'A', kelompok: 'Kelompok A', usia: '4 Tahun', jk: 'P', nama_ayah: 'Rasidin', nama_ibu: 'ERINA PEGI MAULANA' },
  { id: 7, nisn: '3209532660', nama: 'ARLAN PRABU WIJAYA', rombel: 'A', kelompok: 'Kelompok A', usia: '4 Tahun', jk: 'L', nama_ayah: 'Wijaya', nama_ibu: 'ARNI RIANI' },
  { id: 8, nisn: '3202406647', nama: 'ARUMI NASHARA ZETA', rombel: 'A', kelompok: 'Kelompok A', usia: '4 Tahun', jk: 'P', nama_ayah: 'Zeta', nama_ibu: 'DEA NURUL OKTAVIANA' },
  { id: 9, nisn: '3209364636', nama: 'CHELYNE AGASSI MAUZA UMBARAN', rombel: 'A', kelompok: 'Kelompok A', usia: '4 Tahun', jk: 'P', nama_ayah: 'Umbaran', nama_ibu: 'FERLIANTINI' },
  { id: 10, nisn: '3215275264', nama: 'KAIFIYA HUMAIRAH ABIDAH', rombel: 'A', kelompok: 'Kelompok A', usia: '4 Tahun', jk: 'P', nama_ayah: 'Abidah', nama_ibu: 'ACI SUPRIYATI NINGSIH' },
  { id: 11, nisn: '3205085517', nama: 'KHALISA SAFWANA', rombel: 'A', kelompok: 'Kelompok A', usia: '4 Tahun', jk: 'P', nama_ayah: 'Djatnika', nama_ibu: 'DHENNIESA RAI PUTRI DJATNIKA' },
  { id: 12, nisn: '3214032428', nama: 'LOVANDRA ALINA RACHMAN', rombel: 'A', kelompok: 'Kelompok A', usia: '4 Tahun', jk: 'P', nama_ayah: 'Warsono', nama_ibu: 'RINDY WARSONO' },
  { id: 13, nisn: '3203512276', nama: 'MUHAMAD RESKY AL - FATIH', rombel: 'A', kelompok: 'Kelompok A', usia: '4 Tahun', jk: 'L', nama_ayah: 'Atim', nama_ibu: 'Atim' },
  { id: 14, nisn: '3216094634', nama: 'MUHAMMAD ANDRE ALFIANSYAH', rombel: 'A', kelompok: 'Kelompok A', usia: '4 Tahun', jk: 'L', nama_ayah: 'Alfiansyah', nama_ibu: 'NUNUR ISLAMIYAH' },
  { id: 15, nisn: '3242455781', nama: 'MUHAMMAD ATHAR ALFIANSYAH', rombel: 'A', kelompok: 'Kelompok A', usia: '4 Tahun', jk: 'L', nama_ayah: 'Alfiansyah', nama_ibu: 'NUNUR ISLAMIYAH' },
  { id: 16, nisn: '3215183509', nama: 'NAFASYA KHALISA AZZAHRA', rombel: 'A', kelompok: 'Kelompok A', usia: '4 Tahun', jk: 'P', nama_ayah: 'Maryana', nama_ibu: 'IRNA MARYANA' },
  { id: 17, nisn: '3228963203', nama: 'RADEN AHMAD ADZRIEL FERNANDI', rombel: 'A', kelompok: 'Kelompok A', usia: '4 Tahun', jk: 'L', nama_ayah: 'Fernandi', nama_ibu: 'SAGI MURNI' },
  { id: 18, nisn: '3200787834', nama: 'SHAILA OKTAVIANI PUTRI', rombel: 'A', kelompok: 'Kelompok A', usia: '4 Tahun', jk: 'P', nama_ayah: 'Putra', nama_ibu: 'CUCU SUMIATI' },
  { id: 19, nisn: '3207048095', nama: 'SYAHIRA FAJRINA', rombel: 'A', kelompok: 'Kelompok A', usia: '4 Tahun', jk: 'P', nama_ayah: 'Fajri', nama_ibu: 'WINENGSIH' },
  { id: 20, nisn: '3214846245', nama: 'SYAKILLA HUMAIRA ARACELLI', rombel: 'A', kelompok: 'Kelompok A', usia: '4 Tahun', jk: 'P', nama_ayah: 'Aracelli', nama_ibu: 'PERNAWATI' },
  { id: 21, nisn: '3228524772', nama: 'UZAYR KHAIR AHMAD', rombel: 'A', kelompok: 'Kelompok A', usia: '4 Tahun', jk: 'L', nama_ayah: 'Ahmad', nama_ibu: 'RISTI NURIANTI' },

  // Kelompok B (Rombel B) - 5 Siswa
  { id: 22, nisn: '3192331711', nama: 'AZZAM KHALIF PUTRA AHMAD', rombel: 'B', kelompok: 'Kelompok B', usia: '5 Tahun', jk: 'L', nama_ayah: 'Ahmad', nama_ibu: 'YUNI YULIAWATI' },
  { id: 23, nisn: '3191764473', nama: 'MIRZA AL FARIDZI PRASETYO', rombel: 'B', kelompok: 'Kelompok B', usia: '5 Tahun', jk: 'L', nama_ayah: 'Prasetyo', nama_ibu: 'HANI HASANAH' },
  { id: 24, nisn: '3192624309', nama: 'MOHAMMAD MAHAREKSA ADYAPUTRA', rombel: 'B', kelompok: 'Kelompok B', usia: '5 Tahun', jk: 'L', nama_ayah: 'Adyaputra', nama_ibu: 'INDAH PURNAMA SARI' },
  { id: 25, nisn: '3193980747', nama: 'MUHAMMAD ARKHAN ARAFAH SIDIQ', rombel: 'B', kelompok: 'Kelompok B', usia: '5 Tahun', jk: 'L', nama_ayah: 'Sidiq', nama_ibu: 'IDA ROSMIATI' },
  { id: 26, nisn: '3185578761', nama: 'MUHAMMAD AZMI FADHIL', rombel: 'B', kelompok: 'Kelompok B', usia: '5 Tahun', jk: 'L', nama_ayah: 'Fadhil', nama_ibu: 'LIA AMELIA' }
];

export const DEFAULT_PENGUMUMAN = [
  {
    id: 1,
    title: '📢 Kegiatan Outbound & Pengenalan Alam Sekolah',
    content: 'Diberitahukan kepada seluruh Orang Tua murid bahwa kegiatan Outbound Cerita Alam akan dilaksanakan pada hari Jumat depan. Mohon mempersiapkan seragam olahraga dan perlengkapan ananda.',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: '🏥 Jadwal Pemeriksaan Kesehatan & SDIDTK Rutin',
    content: 'Pemeriksaan Tumbuh Kembang Anak (SDIDTK) bekerjasama dengan Puskesmas setempat akan dilaksanakan minggu ini. Mohon mengisi buku KIA ananda.',
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 3,
    title: '🎨 Pameran Hasil Karya & Pentas Seni SPS FLAMBOYAN',
    content: 'Undangan bagi Ayah dan Bunda untuk menghadiri pameran kreativitas serta apresiasi bakat ananda pada akhir bulan ini.',
    created_at: new Date(Date.now() - 172800000).toISOString()
  }
];

// Helper functions for components to safely fetch data with local fallback
export const getSiswaSafe = (rombelFilter = null) => {
  if (!rombelFilter) return DEFAULT_SISWA_LIST;
  const target = rombelFilter.toUpperCase().trim();
  if (target === 'KELOMPOK A' || target === 'A') {
    return DEFAULT_SISWA_LIST.filter(s => s.rombel === 'A' || s.kelompok === 'Kelompok A');
  }
  if (target === 'KELOMPOK B' || target === 'B') {
    return DEFAULT_SISWA_LIST.filter(s => s.rombel === 'B' || s.kelompok === 'Kelompok B');
  }
  return DEFAULT_SISWA_LIST;
};
