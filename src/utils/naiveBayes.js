// src/utils/naiveBayes.js

/**
 * 1. KNOWLEDGE BASE / DATA TRAINING PAUD (Sesuai Aspek Dokumen Resmi Sekolah)
 * Berisi narasi rekap rapot per aspek berdasarkan hasil klasifikasi teorema Naive Bayes.
 */
const knowledgeBasePAUD = {
  "MORAL DAN NILAI-NILAI AGAMA": [
    { skala: 'BSB', teks: "Ananda berkembang sangat baik dan mandiri dalam pembiasaan nilai moral, perilaku baik, serta kegiatan keagamaan." },
    { skala: 'BSH', teks: "Ananda berkembang sesuai harapan dalam meniru gerakan ibadah/doa pendek dan mulai terbiasa berperilaku baik sesuai usianya." },
    { skala: 'MM',  teks: "Ananda mulai menunjukkan kemajuan pada aspek moral dan keagamaan, namun masih memerlukan bimbingan serta pembiasaan berkala." },
    { skala: 'BM',  teks: "Ananda sedang dalam tahap awal pengenalan nilai agama serta moral, dan membutuhkan stimulasi lebih dekat." },
    { skala: 'BB',  teks: "Ananda memerlukan pendampingan intensif dari guru dan orang tua untuk menstimulasi fondasi nilai moral dan agama dasar." }
  ],
  "MOTORIK": [
    { skala: 'BSB', teks: "Sangat matang dan seimbang pada fisik motorik kasar serta sangat terampil mengontrol koordinasi jemari dalam motorik halus." },
    { skala: 'BSH', teks: "Kemampuan motorik kasar (keseimbangan tubuh) dan motorik halus (koordinasi jari tangan) berkembang sesuai harapan usianya." },
    { skala: 'MM',  teks: "Menunjukkan kemajuan pada kekuatan fisik motorik kasar, namun keluwesan jemari pada motorik halus masih perlu terus dilatih." },
    { skala: 'BM',  teks: "Kemampuan fisik motorik anak masih memerlukan latihan terarah guna merangsang kekuatan otot dan koordinasi gerak." },
    { skala: 'BB',  teks: "Membutuhkan latihan fisik adaptif dan stimulasi motorik berkala yang lebih intensif agar tidak tertinggal." }
  ],
  "KOGNITIF": [
    { skala: 'BSB', teks: "Sangat cerdas dalam pengenalan pengetahuan umum serta sangat kritis dalam memecahkan konsep ukuran, bentuk geometri, dan pola." },
    { skala: 'BSH', teks: "Perkembangan kognitif berjalan sesuai harapan; mampu mengidentifikasi pengetahuan umum, membedakan ukuran, bentuk, dan mengikuti pola." },
    { skala: 'MM',  teks: "Mulai mampu memahami konsep pengetahuan umum dasar, namun pemilahan konsep ukuran dan bentuk visual masih perlu dibimbing." },
    { skala: 'BM',  teks: "Memerlukan pendekatan konkrit melalui media bermain yang lebih variatif untuk merangsang daya pikir dan kognisinya." },
    { skala: 'BB',  teks: "Membutuhkan stimulasi kognitif yang intensif di sekolah dan di rumah agar kemampuan pemahaman dasarnya meningkat." }
  ],
  "BAHASA": [
    { skala: 'BSB', teks: "Sangat luar biasa dan komunikatif dalam menerima informasi bahasa serta sangat fasih mengekspresikan atau mengungkapkan bahasa lisan." },
    { skala: 'BSH', teks: "Kemampuan menerima pesan bahasa (menyimak/memahami) serta mengungkapkan keinginan lewat bahasa sederhana berkembang sesuai harapan." },
    { skala: 'MM',  teks: "Sudah mulai memahami perintah verbal, namun keberanian untuk mengekspresikan/mengungkapkan bahasa lisan masih perlu didorong." },
    { skala: 'BM',  teks: "Memerlukan interaksi komunikasi verbal yang lebih intensif untuk memancing anak merespons cerita dan memberikan umpan balik." },
    { skala: 'BB',  teks: "Membutuhkan perhatian khusus serta stimulasi wicara secara berkelompok agar kemampuan berbahasanya berkembang optimal." }
  ],
  "SOSIAL EMOSIONAL": [
    { skala: 'BSB', teks: "Kemandirian sosial emosionalnya luar biasa; menunjukkan sikap tertib, toleran, sabar mengantre, dan sangat menghargai orang lain." },
    { skala: 'BSH', teks: "Sikap sosial emosional berkembang sesuai harapan; mampu mengelola emosi, sabar menunggu giliran, mau berbagi, dan dapat bekerja sama." },
    { skala: 'MM',  teks: "Mulai mau berinteraksi dengan lingkungan kelas, namun kesabaran dalam mengantre dan kemandirian perilaku masih memerlukan arahan." },
    { skala: 'BM',  teks: "Pengelolaan emosi diri serta adaptasi sosial anak dengan teman sebaya masih membutuhkan bimbingan dan pendekatan khusus." },
    { skala: 'BB',  teks: "Membutuhkan pendekatan emosional yang intensif, lembut, dan sabar agar anak merasa aman serta percaya diri dalam bersosialisasi." }
  ]
};

/**
 * 2. FUNGSI UTAMA: CLASSIFIER NAIVE BAYES PER ASPEK
 * Menghitung probabilitas skala nilai dominan per rumpun aspek indikator sekolah.
 */
export const dapatkanRekomendasiAI = (nilaiSemesterObj) => {
  const daftarEntri = Object.entries(nilaiSemesterObj || {});
  if (daftarEntri.length === 0) return "";

  // Helper pencocokan awalan ID indikator ke rumpun Aspek Resmi Sekolah (Support Semua Rentang Usia)
  const dapatkanAspekDariId = (id) => {
    if (id.startsWith('nam_')) return "MORAL DAN NILAI-NILAI AGAMA";
    if (id.startsWith('mot_')) return "MOTORIK";
    if (id.startsWith('kog_')) return "KOGNITIF";
    if (id.startsWith('bah_')) return "BAHASA";
    if (id.startsWith('se_')) return "SOSIAL EMOSIONAL";
    return null;
  };

  // Mengelompokkan input nilai guru berdasarkan aspek masing-masing
  const nilaiPerAspek = {
    "MORAL DAN NILAI-NILAI AGAMA": [],
    "MOTORIK": [],
    "KOGNITIF": [],
    "BAHASA": [],
    "SOSIAL EMOSIONAL": []
  };

  daftarEntri.forEach(([id, nilai]) => {
    const aspek = dapatkanAspekDariId(id);
    if (aspek) nilaiPerAspek[aspek].push(nilai);
  });

  const daftarSkala = ['BB', 'BM', 'MM', 'BSH', 'BSB'];
  const narasiHasilAkhir = [];

  // Hitung Teorema Naive Bayes secara terpisah untuk setiap aspek perkembangan
  Object.keys(nilaiPerAspek).forEach((namaAspek) => {
    const dataNilaiInput = nilaiPerAspek[namaAspek];
    if (dataNilaiInput.length === 0) return; // Lewati jika aspek belum diisi guru sama sekali

    // Hitung kemunculan nyata (frekuensi) skala nilai pada aspek ini
    const hitungSkalaInput = { BB: 0, BM: 0, MM: 0, BSH: 0, BSB: 0 };
    dataNilaiInput.forEach(v => { 
      if (hitungSkalaInput[v] !== undefined) hitungSkalaInput[v]++; 
    });

    let skorTertinggi = -1;
    let skalaPemenang = 'BSH'; // Default fallback

    daftarSkala.forEach((skala) => {
      // 1. Prior Probability dengan Laplace Smoothing
      const jmlKategoriTraining = knowledgeBasePAUD[namaAspek].filter(d => d.skala === skala).length;
      const pKategori = (jmlKategoriTraining + 1) / (knowledgeBasePAUD[namaAspek].length + daftarSkala.length);

      // 2. Likelihood Feature dengan Laplace Smoothing
      const frekuensiMuncul = hitungSkalaInput[skala];
      const pFiturKategori = (frekuensiMuncul + 1) / (dataNilaiInput.length + daftarSkala.length);

      // 3. Posterior Probability Score
      const totalSkor = pKategori * pFiturKategori;

      if (totalSkor > skorTertinggi) {
        skorTertinggi = totalSkor;
        skalaPemenang = skala;
      }
    });

    // Ambil kalimat narasi hasil keputusan Naive Bayes aspek tersebut
    const cocok = knowledgeBasePAUD[namaAspek].find(d => d.skala === skalaPemenang);
    if (cocok) {
      narasiHasilAkhir.push(`Pada aspek ${namaAspek}, ${cocok.teks}`);
    }
  });

  // Gabungkan hasil analisis kelima aspek menjadi satu paragraf rekomendasi utuh
  return narasiHasilAkhir.join(" ");
};