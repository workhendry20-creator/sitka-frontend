-- =======================================================================
-- CONTOH SKRIP MEMBUAT TABEL BARU DI SUPABASE (RLS UNRESTRICTED)
-- =======================================================================
-- Salin dan jalankan seluruh isi file ini di:
-- Supabase Dashboard -> SQL Editor -> Run

-- 1. Buat Tabel Baru 'contoh_kegiatan'
CREATE TABLE IF NOT EXISTS contoh_kegiatan (
    id BIGSERIAL PRIMARY KEY,
    nama_kegiatan VARCHAR(255) NOT NULL,
    kategori VARCHAR(100) DEFAULT 'Umum',
    tanggal DATE DEFAULT CURRENT_DATE,
    keterangan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Pastikan Row Level Security (RLS) UNRESTRICTED (Akses Penuh Tanpa Batasan)
ALTER TABLE contoh_kegiatan DISABLE ROW LEVEL SECURITY;

-- Jika RLS diaktifkan di Supabase, berikan kebijakan Full Access (Select, Insert, Update, Delete):
-- ALTER TABLE contoh_kegiatan ENABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS "Public Unrestricted Access" ON contoh_kegiatan;
-- CREATE POLICY "Public Unrestricted Access" ON contoh_kegiatan FOR ALL USING (true) WITH CHECK (true);

-- 3. Sisipkan Data Fiktif Contoh
INSERT INTO contoh_kegiatan (nama_kegiatan, kategori, tanggal, keterangan)
VALUES
  ('🎨 Lomba Mewarnai Tematik', 'Seni', CURRENT_DATE, 'Kegiatan asah kreativitas anak mengecat gambar tema alam.'),
  ('🎭 Pentas Seni & Tari Daerah', 'Budaya', CURRENT_DATE + INTERVAL '3 days', 'Pertunjukan bakat dan tarian tradisional siswa PAUD.'),
  ('🏃 Praktek Senam Irama Ceria', 'Olahraga', CURRENT_DATE + INTERVAL '5 days', 'Kegiatan fisik motorik kasar outdoor pagi hari.')
ON CONFLICT DO NOTHING;

-- 4. Tampilkan Hasil Data
SELECT * FROM contoh_kegiatan;
