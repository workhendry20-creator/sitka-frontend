// src/pages/admin/Kurikulum.jsx
import React, { useState, useEffect } from 'react';
import {
  Database, Search, Calendar, BarChart3, FileSpreadsheet,
  UserCheck, BookOpen, Fingerprint
} from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import Swal from 'sweetalert2';

const Kurikulum = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [siswaData, setSiswaData] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- INDIKATOR RINGKASAN STATISTIK (DILAKUKAN SECARA DINAMIS) ---
  const [stats, setStats] = useState({
    totalSiswa: 0,
    kelompokA: 0,
    kelompokB: 0,
    persentaseValid: "0%"
  });

  // --- AMBIL DATA REAL-TIME DARI DATABASE SUPABASE ---
  useEffect(() => {
    fetchDatabaseKurikulum();
  }, []);

  const fetchDatabaseKurikulum = async () => {
    setLoading(true);
    try {
      // Mengambil data pengguna dengan role 'ortu' karena memuat data nama_anak dan kelompok
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'ortu')
        .order('nama_anak', { ascending: true });

      if (error) throw error;

      const rawData = data || [];
      setSiswaData(rawData);

      // Hitung kalkulasi statistik dinamis berdasarkan database cloud
      const total = rawData.length;
      const tka = rawData.filter(d => String(d.kelompok).toLowerCase().includes('a')).length;
      const tkb = rawData.filter(d => String(d.kelompok).toLowerCase().includes('b')).length;
      const berToken = rawData.filter(d => d.token && d.token.trim() !== '').length;
      const persen = total > 0 ? `${Math.round((berToken / total) * 100)}%` : '0%';

      setStats({
        totalSiswa: total,
        kelompokA: tka,
        kelompokB: tkb,
        persentaseValid: persen
      });

    } catch (err) {
      console.error("Gagal sinkronisasi kurikulum:", err.message);
      Swal.fire({
        icon: 'error',
        title: 'Koneksi Cloud Gagal',
        text: 'Gagal mengambil basis data kurikulum terpadu.',
        confirmButtonColor: '#0a1e36'
      });
    } finally {
      setLoading(false);
    }
  };

  // --- FUNGSI EXPORT DATABASE ASLI KE CSV ---
  const exportToCSV = () => {
    if (siswaData.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Data Kosong',
        text: 'Tidak ada data siswa yang bisa diexport saat ini.',
        confirmButtonColor: '#0a1e36'
      });
      return;
    }

    const headers = ["ID Akun,Nama Anak Didik,Kelompok Belajar,Nama Orang Tua (Wali),Token Validasi,Sandi Akses\n"];
    const rows = siswaData.map(d =>
      `${d.id},"${d.nama_anak || '-'}","${d.kelompok || '-'}","${d.nama || '-'}","${d.token || '-'}","${d.password || '-'}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `SITKA_KURIKULUM_REALTIME_${new Date().toISOString().slice(0, 10)}.csv`);
    link.click();

    Swal.fire({
      icon: 'success',
      title: 'Database Ter-export!',
      text: 'File CSV berhasil diunduh langsung dari database cloud.',
      confirmButtonColor: '#0a1e36'
    });
  };

  // --- FILTER PENCARIAN SISWA (CLIENT-SIDE) ---
  const filteredSiswa = siswaData.filter((siswa) => {
    const namaAnak = siswa.nama_anak || '';
    const kelompok = siswa.kelompok || '';
    const namaOrtu = siswa.nama || '';

    return (
      namaAnak.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kelompok.toLowerCase().includes(searchTerm.toLowerCase()) ||
      namaOrtu.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-8 pb-20 text-left">

      {/* HEADER: BIG DATA DASHBOARD */}
      <div className="bg-[#0a1e36] p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <Database className="text-indigo-400" size={32} />
              <h2 className="text-3xl font-black italic tracking-tight">Pusat Manajemen Data</h2>
            </div>
            <p className="text-indigo-200 text-sm font-medium opacity-80">Sinkronisasi Basis Data Terpadu Anak Didik SITKA Berbasis Cloud.</p>
          </div>

          <button
            onClick={exportToCSV}
            className="group flex items-center gap-3 px-8 py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/30 active:scale-95"
          >
            <FileSpreadsheet size={20} className="group-hover:rotate-12 transition-transform" />
            Export Database to CSV
          </button>
        </div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* STAT CARDS: OVERVIEW YANG DIHITUNG OTOMATIS DARI DB */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Anak Didik", val: `${stats.totalSiswa} Siswa`, icon: UserCheck, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Siswa Kelompok A", val: `${stats.kelompokA} Anak`, icon: Calendar, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Siswa Kelompok B", val: `${stats.kelompokB} Anak`, icon: BookOpen, color: "text-orange-500", bg: "bg-orange-50" },
          { label: "Ketuntasan Token", val: stats.persentaseValid, icon: BarChart3, color: "text-purple-500", bg: "bg-purple-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <h4 className="text-2xl font-black text-[#0a1e36]">{stat.val}</h4>
          </div>
        ))}
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="font-black text-[#0a1e36] text-xl">Database Terpadu Kurikulum</h3>
            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-tighter italic">*Data asli realtime bersumber dari tabel users cloud</p>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Cari nama anak, kelompok, atau ortu..."
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-20 font-bold text-indigo-600 animate-pulse">
              Menghubungkan ke server cloud SITKA...
            </div>
          ) : filteredSiswa.length === 0 ? (
            <div className="text-center py-20 text-slate-400 font-bold italic">
              Tidak ada data kurikulum anak didik yang cocok.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                  <th className="px-8 py-6">Nama Anak Didik</th>
                  <th className="px-6 py-6 text-center">Kelompok Belajar</th>
                  <th className="px-6 py-6">Wali Murid / Orang Tua</th>
                  <th className="px-6 py-6 text-center">Akses Token</th>
                  <th className="px-8 py-6 text-right">ID Sistem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredSiswa.map((row) => (
                  <tr key={row.id} className="hover:bg-indigo-50/30 transition-colors group">
                    {/* Nama Anak */}
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-[#0a1e36] group-hover:text-indigo-600 transition-colors">
                          👦 {row.nama_anak || '-'}
                        </span>
                      </div>
                    </td>

                    {/* Kelompok Belajar */}
                    <td className="px-6 py-6 text-center">
                      <span className="text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border border-blue-100 text-blue-600 bg-blue-50">
                        {row.kelompok || '-'}
                      </span>
                    </td>

                    {/* Nama Orang Tua */}
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700">{row.nama || '-'}</span>
                        <span className="text-[9px] text-slate-400 font-mono">Pass: {row.password || '-'}</span>
                      </div>
                    </td>

                    {/* Akses Token */}
                    <td className="px-6 py-6 text-center">
                      <div className="inline-flex items-center justify-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl font-mono text-xs font-black">
                        🔑 {row.token || '-'}
                      </div>
                    </td>

                    {/* ID Akses */}
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-slate-400 font-mono text-[10px] font-bold">
                        <Fingerprint size={12} />
                        #{row.id}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* FOOTER TABLE */}
        <div className="p-6 bg-slate-50/50 text-center border-t border-slate-50">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Menampilkan {filteredSiswa.length} Data Dari Database - SITKA Kurikulum Terpadu 2026
          </p>
        </div>
      </div>

    </div>
  );
};

export default Kurikulum;