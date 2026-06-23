// src/pages/guru/Absensi.jsx
import React, { useState, useEffect } from 'react';
import { 
  UserCheck, Users, Calendar, 
  Search, CheckCircle, XCircle, 
  Clock, AlertCircle, Save, Download,
  BarChart3, History
} from 'lucide-react';
import Swal from 'sweetalert2';
import { supabase } from '../../utils/supabaseClient';

const Absensi = () => {
  const [kelompok, setKelompok] = useState('Kelompok A');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  // State dinamis menampung siswa dari Cloud Supabase
  const [daftarSiswa, setDaftarSiswa] = useState([]);
  
  // State untuk Rekapan (History)
  const [rekapMingguan, setRekapMingguan] = useState([
    { tanggal: '2026-05-18', kelompok: 'Kelompok A', hadir: 3, izin: 0, sakit: 0, alpa: 0 },
    { tanggal: '2026-05-19', kelompok: 'Kelompok A', hadir: 3, izin: 0, sakit: 0, alpa: 0 },
  ]);

  // --- AMBIL DATA SISWA SECARA REALTIME DARI CLOUD ---
  useEffect(() => {
    fetchSiswaByKelompok();
  }, [kelompok]);

  const fetchSiswaByKelompok = async () => {
    setLoading(true);
    try {
      // 1. Ubah string UI "Kelompok A" -> "A" agar sinkron dengan isi data cloud kita
      const dbRombel = kelompok === 'Kelompok A' ? 'A' : 'B';

      // 2. Alihkan target query dari tabel 'users' ke tabel 'siswa'
      const { data, error } = await supabase
        .from('siswa')
        .select('id, nama')
        .eq('rombel', dbRombel)
        .order('nama', { ascending: true });

      if (error) throw error;

      // 3. Map data dari DB menggunakan properti 'nama' (bukan 'nama_anak' lagi)
      const formattedSiswa = (data || []).map(siswa => ({
        id: siswa.id,
        nama: siswa.nama, // 👈 Ubah dari siswa.nama_anak menjadi siswa.nama
        status: 'Hadir'
      }));

      setDaftarSiswa(formattedSiswa);
    } catch (err) {
      console.error("Gagal menarik data siswa untuk absensi:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGantiKelompok = (klp) => {
    setKelompok(klp);
  };

  const updateStatus = (id, statusBaru) => {
    setDaftarSiswa(prev => prev.map(s => s.id === id ? { ...s, status: statusBaru } : s));
  };

  const handleSimpan = () => {
    if (daftarSiswa.length === 0) {
      return Swal.fire('Oops!', 'Tidak ada data siswa untuk disimpan.', 'warning');
    }

    const stats = calculateStats();
    const dataBaru = {
      tanggal,
      kelompok,
      ...stats
    };
    
    setRekapMingguan([dataBaru, ...rekapMingguan]);
    
    Swal.fire({
      icon: 'success',
      title: 'Absensi Disimpan',
      text: `Rekap harian ${kelompok} otomatis diperbarui di riwayat bawah.`,
      confirmButtonColor: '#10b981',
      customClass: { popup: 'rounded-[2rem]' }
    });
  };

  const calculateStats = () => ({
    hadir: daftarSiswa.filter(s => s.status === 'Hadir').length,
    izin: daftarSiswa.filter(s => s.status === 'Izin').length,
    sakit: daftarSiswa.filter(s => s.status === 'Sakit').length,
    alpa: daftarSiswa.filter(s => s.status === 'Alpa').length,
  });

  const currentStats = calculateStats();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 text-left">
      
      {/* --- HEADER --- */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600">
            <UserCheck size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#0a1e36]">Absensi Siswa</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Input & Rekapitulasi</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <select 
            value={kelompok} 
            onChange={(e) => handleGantiKelompok(e.target.value)}
            className="px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-[#0a1e36] outline-none cursor-pointer"
          >
            <option value="Kelompok A">Kelompok A</option>
            <option value="Kelompok B">Kelompok B</option>
          </select>
          <input 
            type="date" 
            value={tanggal} 
            onChange={(e) => setTanggal(e.target.value)}
            className="px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-[#0a1e36] outline-none"
          />
          <button 
            onClick={handleSimpan} 
            disabled={loading || daftarSiswa.length === 0}
            className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-lg active:scale-95 transition-all disabled:bg-slate-300"
          >
            Simpan Absen
          </button>
        </div>
      </div>

      {/* --- REKAP HARIAN (REAL-TIME STATS) --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Hadir', val: currentStats.hadir, borderColor: 'border-emerald-500', textColor: 'text-emerald-600' },
          { label: 'Izin', val: currentStats.izin, borderColor: 'border-blue-500', textColor: 'text-blue-600' },
          { label: 'Sakit', val: currentStats.sakit, borderColor: 'border-amber-500', textColor: 'text-amber-600' },
          { label: 'Alpa', val: currentStats.alpa, borderColor: 'border-rose-500', textColor: 'text-rose-600' },
        ].map((item) => (
          <div key={item.label} className={`bg-white p-6 rounded-[2rem] border-b-4 ${item.borderColor} shadow-sm text-left`}>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{item.label} Hari Ini</p>
            <p className={`text-3xl font-black ${item.textColor}`}>{item.val}</p>
          </div>
        ))}
      </div>

      {/* --- MAIN INPUT TABLE --- */}
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-16 font-bold text-emerald-600 animate-pulse">
            Sinkronisasi data kehadiran kelompok siswa...
          </div>
        ) : daftarSiswa.length === 0 ? (
          <div className="text-center py-16 text-slate-400 font-medium border border-dashed border-slate-200 rounded-[3rem] m-4">
            Tidak ada data anak didik yang terdaftar di {kelompok} pada database Cloud.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-8 py-6">Nama Siswa</th>
                  <th className="px-8 py-6 text-center">Kehadiran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {daftarSiswa.map((siswa) => (
                  <tr key={siswa.id} className="hover:bg-slate-50/50 transition-all">
                    <td className="px-8 py-5 font-bold text-[#0a1e36]">{siswa.nama}</td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center gap-3">
                        {['Hadir', 'Izin', 'Sakit', 'Alpa'].map((st) => (
                          <button
                            key={st}
                            onClick={() => updateStatus(siswa.id, st)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                              siswa.status === st 
                              ? 'bg-[#0a1e36] text-white shadow-md scale-105' 
                              : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- REKAP MINGGUAN (HISTORY) --- */}
      <div className="bg-[#0a1e36] p-8 md:p-10 rounded-[3rem] text-white shadow-2xl overflow-hidden text-left">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
              <History size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black italic">History Absensi Mingguan</h3>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Laporan 7 Hari Terakhir</p>
            </div>
          </div>
          <button className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
            <Download size={20} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <th className="px-6 pb-2">Tanggal</th>
                <th className="px-6 pb-2">Kelompok</th>
                <th className="px-6 pb-2 text-center">H</th>
                <th className="px-6 pb-2 text-center">I</th>
                <th className="px-6 pb-2 text-center">S</th>
                <th className="px-6 pb-2 text-center">A</th>
              </tr>
            </thead>
            <tbody>
              {rekapMingguan.map((rekap, idx) => (
                <tr key={idx} className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden">
                  <td className="px-6 py-4 text-sm font-bold">{rekap.tanggal}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-black uppercase">
                      {rekap.kelompok}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-emerald-400">{rekap.hadir}</td>
                  <td className="px-6 py-4 text-center font-bold text-blue-400">{rekap.izin}</td>
                  <td className="px-6 py-4 text-center font-bold text-amber-400">{rekap.sakit}</td>
                  <td className="px-6 py-4 text-center font-bold text-rose-400">{rekap.alpa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Absensi;