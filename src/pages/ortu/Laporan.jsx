// src/pages/ortu/Laporan.jsx
import React from 'react';
import { 
  Download, FileText, CheckCircle, XCircle, Clock, 
  BookOpen, Award 
} from 'lucide-react';
import Swal from 'sweetalert2';

const Laporan = () => {
  // Data Dummy (Simulasi data yang diinput Guru sebelumnya)
  const reportData = {
    siswa: "Aditya Pratama",
    periode: "Semester Ganjil 2023/2024",
    absensi: { hadir: 45, izin: 2, alpa: 1, total: 48 },
    nilai: [
      { mapel: 'Matematika', nilai: 92, kkm: 75, status: 'Sangat Baik' },
      { mapel: 'Bahasa Indonesia', nilai: 88, kkm: 75, status: 'Baik' },
      { mapel: 'Agama Islam', nilai: 95, kkm: 75, status: 'Sangat Baik' },
      { mapel: 'Seni & Budaya', nilai: 80, kkm: 70, status: 'Cukup' },
      { mapel: 'PJOK', nilai: 85, kkm: 75, status: 'Baik' },
    ],
    perkembangan: [
      { aspek: 'Fisik Motorik', skor: 85, catatan: 'Sangat aktif dalam kegiatan luar ruangan.' },
      { aspek: 'Kognitif', skor: 90, catatan: 'Mampu memecahkan masalah logika sederhana.' },
      { aspek: 'Sosial Emosional', skor: 82, catatan: 'Mulai bisa berbagi mainan dengan teman.' }
    ]
  };

  const handleExportCSV = () => {
    const header = "Kategori,Aspek/Mapel,Nilai/Jumlah,Catatan\n";
    const rows = [
      ...reportData.nilai.map(n => `Nilai,${n.mapel},${n.nilai},${n.status}`),
      ...reportData.perkembangan.map(p => `Perkembangan,${p.aspek},${p.skor},"${p.catatan}"`),
      `Absensi,Hadir,${reportData.absensi.hadir},-`,
    ].join("\n");

    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_${reportData.siswa}.csv`;
    a.click();

    Swal.fire({
      icon: 'success',
      title: 'Export Berhasil',
      text: 'Laporan telah diunduh dalam format CSV',
      confirmButtonColor: '#306896'
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-blue-50 rounded-2xl text-[#306896]">
            <FileText size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#0a1e36]">Laporan Hasil Belajar</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{reportData.periode}</p>
          </div>
        </div>
        <button 
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-3 px-6 py-4 bg-[#306896] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#25547a] transition-all shadow-lg active:scale-95"
        >
          <Download size={18} /> Export ke CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: ABSENSI & SUMMARY */}
        <div className="space-y-8">
          {/* Card Absensi */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-[#0a1e36] mb-6 flex items-center gap-2">
              <Clock className="text-blue-500" size={20} /> Rekap Kehadiran
            </h3>
            <div className="space-y-4">
              <AbsensiItem icon={CheckCircle} label="Hadir" count={reportData.absensi.hadir} color="text-green-500" bg="bg-green-50" />
              <AbsensiItem icon={Clock} label="Izin" count={reportData.absensi.izin} color="text-yellow-500" bg="bg-yellow-50" />
              <AbsensiItem icon={XCircle} label="Alpa" count={reportData.absensi.alpa} color="text-red-500" bg="bg-red-50" />
              <div className="pt-4 border-t border-dashed">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-400">Total Hari Efektif</span>
                  <span className="font-black text-[#0a1e36]">{reportData.absensi.total} Hari</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Highlight (DIPERBAIKI: Logo bandel sudah dihapus) */}
          <div className="bg-[#0a1e36] p-10 rounded-[2.5rem] text-white overflow-hidden relative">
            <h3 className="text-sm font-black text-blue-300 uppercase tracking-[0.2em] mb-4">Pencapaian Terbaik</h3>
            <p className="text-xl font-bold leading-relaxed">
              Aditya sangat menonjol di bidang <span className="text-yellow-400 underline decoration-2 underline-offset-4">Agama Islam</span> dengan nilai sempurna!
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAIL NILAI & PERKEMBANGAN */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Tabel Nilai */}
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
            <h3 className="text-lg font-bold text-[#0a1e36] mb-6 flex items-center gap-2">
              <BookOpen className="text-[#306896]" size={20} /> Nilai Akademik
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="pb-4 pl-2">Mata Pelajaran</th>
                    <th className="pb-4">KKM</th>
                    <th className="pb-4">Nilai</th>
                    <th className="pb-4">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {reportData.nilai.map((n, i) => (
                    <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 pl-2 font-bold text-[#0a1e36]">{n.mapel}</td>
                      <td className="py-4 text-slate-500 font-medium">{n.kkm}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-black ${n.nilai >= 90 ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-[#306896]'}`}>
                          {n.nilai}
                        </span>
                      </td>
                      <td className="py-4 font-bold text-xs text-slate-400 uppercase tracking-tighter">{n.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detail Perkembangan */}
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-[#0a1e36] mb-6 flex items-center gap-2">
              <Award className="text-orange-500" size={20} /> Catatan Perkembangan Karakter
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportData.perkembangan.map((p, i) => (
                <div key={i} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-blue-200 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-black text-[#306896] uppercase tracking-widest">{p.aspek}</span>
                    <span className="text-lg font-black text-[#0a1e36]">{p.skor}%</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed italic">"{p.catatan}"</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Sub-component untuk baris absensi
const AbsensiItem = ({ icon: Icon, label, count, color, bg }) => (
  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
    <div className="flex items-center gap-3">
      <div className={`p-2 ${bg} ${color} rounded-lg`}>
        <Icon size={18} />
      </div>
      <span className="text-sm font-bold text-slate-600">{label}</span>
    </div>
    <span className={`font-black ${color}`}>{count} Hari</span>
  </div>
);

export default Laporan;