import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://higkyyqaveqemxuqjqyk.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpZ2t5eXFhdmVxZW14dXFqcXlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxODc1MjMsImV4cCI6MjA5NDc2MzUyM30.JVX6nge7rqC3-an9WmSTKURIbct77Ms_dVI6dG2M8vM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedData() {
  console.log("🚀 Starting Supabase Seed Data Injection...");

  // 1. ENSURE ADMIN USER IN USERS TABLE
  const { data: existingAdmin } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'admin')
    .eq('nama', 'admin');

  if (!existingAdmin || existingAdmin.length === 0) {
    const { error: errAdmin } = await supabase.from('users').insert([{
      nama: 'admin',
      role: 'admin',
      password: 'admin123',
      nip: '00000000',
      token: 'SITKA_ADMIN'
    }]);
    if (errAdmin) console.error("Error inserting admin user:", errAdmin.message);
    else console.log("✅ Admin user inserted into 'users'");
  } else {
    console.log("✅ Admin user already exists");
  }

  // 2. FETCH ALL SISWA TO SYNC USERS AND PROFILES
  const { data: siswaList, error: errSiswa } = await supabase
    .from('siswa')
    .select('*');

  if (errSiswa) {
    console.error("Gagal mengambil data siswa:", errSiswa.message);
    return;
  }

  console.log(`Found ${siswaList.length} students in 'siswa' table.`);

  // 3. SEED NILAI HARIAN (DAILY ANECDOTES & ATTENDANCE) FOR ALL STUDENTS
  const dates = ['2026-08-01', '2026-08-03', '2026-08-05', '2026-08-07', '2026-08-08', '2026-08-09', '2026-08-10'];
  const moods = ['Bahagia 😊', 'Aktif ⚡', 'Fokus 🎯', 'Ceria 🌟', 'Tenang 😐', 'Istimewa 🌟'];
  const anecdotes = [
    'Ananda mengikuti kegiatan senam pagi dengan antusias dan gembira.',
    'Ananda mampu menyelesaikan tugas meronce manik-manik secara mandiri.',
    'Ananda menunjukkan sikap saling berbagi makanan ringan dengan teman sebaya.',
    'Ananda sangat aktif bertanya dan berdiskusi saat sesi mendengarkan cerita.',
    'Ananda dapat merapikan mainan balok ke tempatnya setelah waktu bermain selesai.',
    'Ananda berlatih memimpin doa sebelum makan siang dengan percaya diri.'
  ];

  const dailyPayloads = [];

  siswaList.forEach((siswa, index) => {
    const kelompokLabel = siswa.rombel === 'A' ? 'Kelompok A' : 'Kelompok B';

    // Insert 4 daily records for each student across different dates
    dates.slice(0, 4).forEach((tgl, dIdx) => {
      const mood = moods[(index + dIdx) % moods.length];
      const note = anecdotes[(index + dIdx) % anecdotes.length];
      dailyPayloads.push({
        nisn: siswa.nisn || `NISN-${siswa.id}`,
        nama_siswa: siswa.nama,
        kelompok: kelompokLabel,
        tanggal: tgl,
        status_kondisi: mood,
        catatan_anekdot: note,
        input_oleh_guru: `Wali Kelas ${kelompokLabel}`
      });
    });
  });

  console.log(`Inserting ${dailyPayloads.length} daily entries into 'nilai_harian'...`);
  const { error: errDaily } = await supabase
    .from('nilai_harian')
    .upsert(dailyPayloads, { onConflict: 'nisn,tanggal' });

  if (errDaily) console.warn("Notice on nilai_harian upsert:", errDaily.message);
  else console.log("✅ 'nilai_harian' seeded successfully!");

  // 4. SEED NILAI SEMESTER (RAPOR EVALUATION) FOR ALL STUDENTS
  const semesterPayloads = [];

  siswaList.forEach((siswa, index) => {
    const kelompokLabel = siswa.rombel === 'A' ? 'Kelompok A' : 'Kelompok B';
    const nisnVal = siswa.nisn || `NISN-${siswa.id}`;

    // Sample scores per domain
    const skorObj = {
      nam_1: index % 3 === 0 ? 'BSB' : 'BSH',
      nam_2: index % 2 === 0 ? 'BSB' : 'BSH',
      nam_3: 'BSH',
      mot_1: index % 4 === 0 ? 'BSB' : 'BSH',
      mot_2: 'BSH',
      mot_3: 'BSB',
      kog_1: 'BSH',
      kog_2: index % 2 === 0 ? 'BSB' : 'BSH',
      kog_3: 'BSH',
      bah_1: 'BSB',
      bah_2: 'BSH',
      se_1: 'BSB',
      se_2: 'BSH'
    };

    semesterPayloads.push({
      nisn: nisnVal,
      nama_siswa: siswa.nama,
      kelompok: kelompokLabel,
      tanggal: '2026-08-10',
      semester: '1 (Ganjil)',
      rekomendasi_guru: `Ananda ${siswa.nama} menunjukkan perkembangan yang sangat baik dalam seluruh domain perkembangan (Agama & Moral, Motorik, Kognitif, serta Bahasa & Sosial). Tingkatkan partisipasi aktif dan kemandirian ananda.`,
      skor_indikator: skorObj,
      input_oleh_guru: `Wali Kelas ${kelompokLabel}`
    });

    // Semester 2 (Genap) comparison record
    semesterPayloads.push({
      nisn: nisnVal,
      nama_siswa: siswa.nama,
      kelompok: kelompokLabel,
      tanggal: '2026-08-10',
      semester: '2 (Genap)',
      rekomendasi_guru: `Ananda ${siswa.nama} mengalami peningkatan pesat pada capaian Semester 2, beradaptasi baik dengan teman dan memiliki kemampuan motorik yang matang.`,
      skor_indikator: { ...skorObj, nam_1: 'BSB', mot_1: 'BSB', kog_1: 'BSB', bah_1: 'BSB' },
      input_oleh_guru: `Wali Kelas ${kelompokLabel}`
    });
  });

  console.log(`Inserting ${semesterPayloads.length} semester evaluation entries into 'nilai_semester'...`);
  const { error: errSem } = await supabase
    .from('nilai_semester')
    .upsert(semesterPayloads, { onConflict: 'nisn,semester' });

  if (errSem) console.warn("Notice on nilai_semester upsert:", errSem.message);
  else console.log("✅ 'nilai_semester' seeded successfully!");

  // 5. SEED PENGUMUMAN ACTIVE ANNOUNCEMENTS
  const announcements = [
    {
      title: 'Kegiatan Outbound & Pengenalan Alam Sekolah',
      content: 'Diberitahukan kepada seluruh Orang Tua murid bahwa kegiatan Outbound Cerita Alam akan dilaksanakan pada hari Jumat depan. Mohon mempersiapkan seragam olahraga dan perlengkapan ananda.',
      created_at: new Date().toISOString()
    },
    {
      title: 'Jadwal Pemeriksaan Kesehatan & SDIDTK Rutin',
      content: 'Pemeriksaan Tumbuh Tumbuh Kembang Anak (SDIDTK) bekerjasama dengan Puskesmas setempat akan dilaksanakan minggu ini. Mohon mengisi buku KIA ananda.',
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  for (const ann of announcements) {
    await supabase.from('pengumuman').insert([ann]);
  }
  console.log("✅ 'pengumuman' seeded successfully!");

  console.log("🎉 ALL SEED DATA SUCCESSFULLY INJECTED INTO SUPABASE!");
}

seedData();
