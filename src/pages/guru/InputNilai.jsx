// src/pages/guru/InputNilai.jsx
import React, { useState, useMemo } from 'react';
import { Save, Calendar, BookOpen, Download, FileSpreadsheet, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';

const InputNilai = () => {
  // --- STATE MANAGEMENT ---
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSubject, setSelectedSubject] = useState('Matematika');
  
  const subjects = [
    'Matematika', 
    'Bahasa Indonesia', 
    'IPA', 
    'IPS', 
    'Bahasa Inggris', 
    'Pendidikan Agama'
  ];

  const [students, setStudents] = useState([
    { id: 1, nisn: '122001', nama: 'Aditya Pratama', nilai: '85' },
    { id: 2, nisn: '122002', nama: 'Budi Santoso', nilai: '78' },
    { id: 3, nisn: '122003', nama: 'Citra Lestari', nilai: '92' },
    { id: 4, nisn: '122004', nama: 'Dewi Anugrah', nilai: '88' },
    { id: 5, nisn: '122005', nama: 'Eko Wijaya', nilai: '70' },
  ]);

  // --- LOGIC FUNCTIONS ---
  const handleNilaiChange = (id, val) => {
    if (val === '' || (Number(val) >= 0 && Number(val) <= 100)) {
      setStudents(students.map(s => s.id === id ? { ...s, nilai: val } : s));
    }
  };

  const stats = useMemo(() => {
    const nilaiArray = students.map(s => Number(s.nilai)).filter(n => n > 0);
    if (nilaiArray.length === 0) return { avg: 0, max: 0, min: 0 };
    
    return {
      avg: (nilaiArray.reduce((a, b) => a + b, 0) / nilaiArray.length).toFixed(1),
      max: Math.max(...nilaiArray),
      min: Math.min(...nilaiArray)
    };
  }, [students]);

  const handleSave = () => {
    Swal.fire({
      title: 'Menyimpan Data...',
      timer: 800,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      }
    }).then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Nilai Berhasil Di Input',
        text: `Data nilai ${selectedSubject} telah tersimpan ke sistem SITKA.`,
        confirmButtonColor: '#306896',
        customClass: {
          popup: 'rounded-[2rem]',
          confirmButton: 'rounded-xl px-6 py-3 font-bold'
        }
      });
    });
  };

  const exportToCSV = () => {
    const headers = ['Nama Siswa,NISN,Nilai,Mata Pelajaran,Tanggal\n'];
    const rows = students.map(s => `${s.nama},${s.nisn},${s.nilai},${selectedSubject},${selectedDate}\n`);
    const blob = new Blob([headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `SITKA_Nilai_${selectedSubject}_${selectedDate}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER & FILTER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-2xl text-[#306896]">
            <BookOpen size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#0a1e36]">Input Nilai</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Jurnal Akademik Siswa</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Pilihan Mata Pelajaran */}
          <div className="relative group">
            <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-[#306896]" />
            <select 
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="pl-11 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-[#0a1e36] outline-none appearance-none focus:ring-4 focus:ring-blue-50 transition-all cursor-pointer"
            >
              {subjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
            </select>
          </div>

          {/* Date Selector */}
          <div className="relative group">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-[#306896]" />
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

      {/* TABEL INPUT */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 border-b border-gray-100 text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">
                <th className="px-8 py-5 text-left">Siswa</th>
                <th className="px-8 py-5 text-left">NISN</th>
                <th className="px-8 py-5 text-center">Nilai Harian</th>
                <th className="px-8 py-5 text-left">Keterangan</th>
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
                      <span className="font-bold text-[#0a1e36]">{student.nama}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-slate-400 font-mono text-sm">{student.nisn}</td>
                  <td className="px-8 py-5 flex justify-center">
                    <input 
                      type="number" 
                      value={student.nilai}
                      onChange={(e) => handleNilaiChange(student.id, e.target.value)}
                      className="w-20 px-3 py-3 text-center bg-slate-50 border border-slate-200 rounded-xl font-black text-[#306896] text-lg outline-none focus:border-[#306896] focus:ring-4 focus:ring-blue-50 transition-all"
                      placeholder="0"
                    />
                  </td>
                  <td className="px-8 py-5">
                     <div className="flex items-center gap-2 text-slate-400">
                        <span className="text-xs font-medium">Lengkap</span>
                        <ChevronRight size={14} />
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* REKAPITULASI & EXPORT */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm grid grid-cols-3 gap-8">
          <div className="text-center md:text-left">
            <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1">Rata-rata Kelas</p>
            <h4 className="text-3xl font-black text-[#306896]">{stats.avg}</h4>
          </div>
          <div className="text-center md:text-left border-x border-slate-100 px-8">
            <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1">Nilai Tertinggi</p>
            <h4 className="text-3xl font-black text-green-600">{stats.max}</h4>
          </div>
          <div className="text-center md:text-left">
            <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1">Nilai Terendah</p>
            <h4 className="text-3xl font-black text-orange-500">{stats.min}</h4>
          </div>
        </div>

        <button 
          onClick={exportToCSV}
          className="bg-[#0a1e36] hover:bg-[#1a2e46] text-white p-8 rounded-[2rem] shadow-xl flex flex-col items-center justify-center gap-3 transition-all active:scale-95 group"
        >
          <div className="p-3 bg-white/10 rounded-2xl group-hover:scale-110 transition-transform">
            <Download size={24} />
          </div>
          <span className="font-bold text-sm text-center">Export to CSV</span>
        </button>
      </div>

    </div>
  );
};

export default InputNilai;