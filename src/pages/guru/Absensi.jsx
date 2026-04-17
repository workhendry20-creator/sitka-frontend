// src/pages/guru/Absensi.jsx
import React, { useState } from 'react';
import { Save, Calendar, Users, CheckCircle, Clock, AlertCircle, XCircle, Download } from 'lucide-react';
import Swal from 'sweetalert2';

const Absensi = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Data Siswa dengan status default 'Hadir'
  const [students, setStudents] = useState([
    { id: 1, nama: 'Aditya Pratama', nisn: '122001', status: 'Hadir' },
    { id: 2, nama: 'Budi Santoso', nisn: '122002', status: 'Hadir' },
    { id: 3, nama: 'Citra Lestari', nisn: '122003', status: 'Izin' },
    { id: 4, nama: 'Dewi Anugrah', nisn: '122004', status: 'Hadir' },
    { id: 5, nama: 'Eko Wijaya', nisn: '122005', status: 'Sakit' },
  ]);

  // Handler Ganti Status
  const handleStatusChange = (id, newStatus) => {
    setStudents(students.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  // Handler Simpan
  const handleSave = () => {
    Swal.fire({
      icon: 'success',
      title: 'Absensi Tersimpan',
      text: `Data kehadiran tanggal ${selectedDate} berhasil diperbarui.`,
      confirmButtonColor: '#306896',
      customClass: { popup: 'rounded-[2rem]' }
    });
  };

  // Dummy Data Rekap Mingguan (Bulan April)
  const rekapMingguan = [
    { minggu: 'Minggu 1', hadir: 150, izin: 5, sakit: 2, alpa: 1 },
    { minggu: 'Minggu 2', hadir: 148, izin: 4, sakit: 6, alpa: 0 },
    { minggu: 'Minggu 3', hadir: 155, izin: 2, sakit: 1, alpa: 0 },
  ];

  // Fungsi Export Rekap ke CSV
  const exportRekapCSV = () => {
    const headers = ['Minggu,Hadir,Izin,Sakit,Alpa\n'];
    const rows = rekapMingguan.map(r => `${r.minggu},${r.hadir},${r.izin},${r.sakit},${r.alpa}\n`);
    const blob = new Blob([headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `Rekap_Absensi_April_2026.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER & DATE PICKER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-2xl text-[#306896]">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#0a1e36]">Absensi Siswa</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Pencatatan Kehadiran Harian</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-[#0a1e36] outline-none focus:ring-4 focus:ring-blue-50 transition-all"
            />
          </div>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-[#306896] text-white rounded-xl font-bold text-sm hover:bg-[#25547a] transition-all shadow-lg shadow-blue-900/10 active:scale-95"
          >
            <Save size={18} />
            Simpan
          </button>
        </div>
      </div>

      {/* TABEL ABSENSI UTAMA */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 border-b border-gray-100 text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">
                <th className="px-8 py-5 text-left">Siswa</th>
                <th className="px-8 py-5 text-center">Status Kehadiran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-[#306896] font-black text-sm border-2 border-white shadow-sm group-hover:bg-[#306896] group-hover:text-white transition-all">
                        {student.nama.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-[#0a1e36]">{student.nama}</p>
                        <p className="text-[10px] text-slate-400 font-mono tracking-tighter">{student.nisn}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-center gap-2">
                      {[
                        { label: 'Hadir', color: 'bg-green-500', icon: CheckCircle },
                        { label: 'Izin', color: 'bg-blue-500', icon: Clock },
                        { label: 'Sakit', color: 'bg-orange-500', icon: AlertCircle },
                        { label: 'Alpa', color: 'bg-red-500', icon: XCircle },
                      ].map((opt) => (
                        <button
                          key={opt.label}
                          onClick={() => handleStatusChange(student.id, opt.label)}
                          className={`
                            flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all
                            ${student.status === opt.label 
                              ? `${opt.color} text-white shadow-md scale-105` 
                              : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                            }
                          `}
                        >
                          <opt.icon size={14} />
                          {opt.label}
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

      {/* SECTION REKAPITULASI MINGGUAN */}
      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-[#0a1e36]">Rekapitulasi Kehadiran</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Bulan: April 2026</p>
          </div>
          {/* Tombol Export ke CSV */}
          <button 
            onClick={exportRekapCSV}
            className="flex items-center gap-2 text-[#306896] hover:text-[#25547a] font-black text-xs uppercase tracking-widest transition-all group"
          >
            <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
            Export to CSV
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rekapMingguan.map((minggu, i) => (
            <div key={i} className="bg-slate-50 rounded-3xl p-6 border border-slate-100 hover:border-blue-200 transition-colors">
              <p className="text-xs font-black text-[#306896] mb-4 border-b border-slate-200 pb-2 uppercase tracking-tighter">{minggu.minggu}</p>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Hadir</span>
                  <span className="text-sm font-black text-green-600">{minggu.hadir}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Izin</span>
                  <span className="text-sm font-black text-blue-600">{minggu.izin}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Sakit</span>
                  <span className="text-sm font-black text-orange-600">{minggu.sakit}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Alpa</span>
                  <span className="text-sm font-black text-red-600">{minggu.alpa}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Absensi;