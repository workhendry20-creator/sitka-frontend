import React, { useState } from 'react';
import { 
  UserCheck, Users, Calendar, 
  Search, CheckCircle, XCircle, 
  Clock, AlertCircle, Save, Download,
  BarChart3, History
} from 'lucide-react';
import Swal from 'sweetalert2';

const Absensi = () => {
  const [kelompok, setKelompok] = useState('Kelompok A');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');

  // Data Master Siswa
  const initialSiswa = {
    'Kelompok A': [
      { id: 1, nama: "Aditya Pratama", status: 'Hadir' },
      { id: 2, nama: "Salsa Bella", status: 'Hadir' },
      { id: 3, nama: "Rizky Fauzan", status: 'Hadir' },
    ],
    'Kelompok B': [
      { id: 4, nama: "Budi Junior", status: 'Hadir' },
      { id: 5, nama: "Citra Lestari", status: 'Hadir' },
      { id: 6, nama: "Dedi Irawan", status: 'Hadir' },
    ]
  };

  const [daftarSiswa, setDaftarSiswa] = useState(initialSiswa['Kelompok A']);
  
  // State untuk Rekapan (History)
  const [rekapMingguan, setRekapMingguan] = useState([
    { tanggal: '2026-04-20', kelompok: 'Kelompok A', hadir: 15, izin: 1, sakit: 0, alpa: 0 },
    { tanggal: '2026-04-21', kelompok: 'Kelompok A', hadir: 14, izin: 0, sakit: 2, alpa: 0 },
  ]);

  const handleGantiKelompok = (klp) => {
    setKelompok(klp);
    setDaftarSiswa(initialSiswa[klp]);
  };

  const updateStatus = (id, statusBaru) => {
    setDaftarSiswa(prev => prev.map(s => s.id === id ? { ...s, status: statusBaru } : s));
  };

  const handleSimpan = () => {
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
      text: `Rekap harian ${kelompok} otomatis diperbarui di bawah.`,
      confirmButtonColor: '#10b981'
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
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
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
          <button onClick={handleSimpan} className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-lg active:scale-95 transition-all">
            Simpan Absen
          </button>
        </div>
      </div>

      {/* --- REKAP HARIAN (REAL-TIME STATS) --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Hadir', val: currentStats.hadir, color: 'emerald' },
          { label: 'Izin', val: currentStats.izin, color: 'blue' },
          { label: 'Sakit', val: currentStats.sakit, color: 'amber' },
          { label: 'Alpa', val: currentStats.alpa, color: 'rose' },
        ].map((item) => (
          <div key={item.label} className={`bg-white p-6 rounded-[2rem] border-b-4 border-${item.color}-500 shadow-sm`}>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{item.label} Hari Ini</p>
            <p className={`text-3xl font-black text-${item.color}-600`}>{item.val}</p>
          </div>
        ))}
      </div>

      {/* --- MAIN INPUT TABLE --- */}
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
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
      </div>

      {/* --- REKAP MINGGUAN (HISTORY) --- */}
      <div className="bg-[#0a1e36] p-8 md:p-10 rounded-[3rem] text-white shadow-2xl overflow-hidden">
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