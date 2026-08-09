import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://higkyyqaveqemxuqjqyk.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpZ2t5eXFhdmVxZW14dXFqcXlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxODc1MjMsImV4cCI6MjA5NDc2MzUyM30.JVX6nge7rqC3-an9WmSTKURIbct77Ms_dVI6dG2M8vM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkNewTable() {
  console.log("Mencoba mengambil data dari tabel 'contoh_kegiatan'...");
  const { data, error } = await supabase.from('contoh_kegiatan').select('*');
  if (error) {
    console.error("❌ Tabel 'contoh_kegiatan' belum dibuat di Supabase SQL Editor atau terjadi kesalahan:", error.message);
  } else {
    console.log("✅ BERHASIL MENGAMBIL DATA DARI TABEL 'contoh_kegiatan':");
    console.log(data);
  }
}

checkNewTable();
