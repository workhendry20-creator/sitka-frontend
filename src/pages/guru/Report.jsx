// src/pages/guru/Report.jsx
import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, Search, User, ArrowUpRight, 
  CheckCircle2, Clock, AlertCircle, Layers, ChevronDown 
} from 'lucide-react';
import Swal from 'sweetalert2';

const ReportGuru = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKelompok, setSelectedKelompok] = useState("A"); // Default Kelompok A
  const [reports, setReports] = useState([]);

  // --- DATA MASTER SISWA PER KELOMPOK ---
  const dataSiswa = {
    A: [
      { id: 101, namaSiswa: "Aditya Pratama", namaOrtu: "Mama Aditya" },
      { id: 102, namaSiswa: "Budi Santoso", namaOrtu: "Ayah Budi" },
      { id: 103, namaSiswa: "Rara Anindya", namaOrtu: "Bunda Rara" },
    ],
    B: [
      { id: 201, namaSiswa: "Siti Aminah", namaOrtu: "Bunda Siti" },
      { id: 202, namaSiswa: "Farhan Malik", namaOrtu: "Papa Farhan" },
      { id: 203, namaSiswa: "Dina Lestari", namaOrtu: "Mama Dina" },
    ]
  };

  useEffect(() => {
    const rawData = localStorage.getItem('sitka_progress_data');
    const currentSiswa = dataSiswa[selectedKelompok];

    if (rawData) {
      const parsedData = JSON.parse(rawData);
      
      const updatedReports = currentSiswa.map(siswa => {
        // Simulasi: Kita hubungkan data localStorage ke Aditya (Kelompok A) atau Siti (Kelompok B) 
        // untuk testing real-time
        if (siswa.namaSiswa === "Aditya Pratama" || (selectedKelompok === 'B' && siswa.namaSiswa === "Siti Aminah")) {
          return {
            ...siswa,
            status: "Sudah Mengisi",
            totalSkor: `${parsedData.totalSkor}%`,
            tanggal: parsedData.tanggal,
            catatan: parsedData.catatan,
            detailProgress: parsedData.items
          };
        }
        return { ...siswa, status: "Belum Mengisi", totalSkor: "-", tanggal: "-", detailProgress: [], catatan: "-" };
      });
      setReports(updatedReports);
    } else {
      setReports(currentSiswa.map(s => ({ ...s, status: "Belum Mengisi", totalSkor: "-", tanggal: "-", detailProgress: [], catatan: "-" })));
    }
  }, [selectedKelompok]); // Reload data saat dropdown kelompok berubah

  const showDetailModal = (siswa) => {
    if (siswa.status === "Belum Mengisi") {
      return Swal.fire({
        title: 'Data Belum Tersedia',
        text: `Orang tua ${siswa.namaSiswa} belum mengirimkan laporan.`,
        icon: 'info',
        confirmButtonColor: '#0a1e36'
      });
    }

    const progressHTML = siswa.detailProgress.map(p => `
      <div class="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 mb-2 text-left shadow-sm">
        <div class="pr-2">
          <p class="text-[9px] font-black uppercase text-indigo-500 tracking-widest">${p.category}</p>
          <p class="text-xs font-bold text-slate-700">${p.task}</p>
        </div>
        <div class="flex items-center gap-1 shrink-0">
          ${[1, 2, 3].map(num => `
            <div class="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black ${
              p.score === num 
              ? (num === 1 ? 'bg-rose-500 text-white' : num === 2 ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white')
              : 'bg-slate-100 text-slate-300'
            }">${num}</div>
          `).join('')}
        </div>
      </div>
    `).join('');

    Swal.fire({
      title: `<div class="text-left"><p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Rincian Progress Kelompok ${selectedKelompok}</p><h3 class="text-xl font-black text-[#0a1e36]">${siswa.namaSiswa}</h3></div>`,
      html: `<div class="max-h-[60vh] overflow-y-auto pr-2 text-left">
        <div class="bg-indigo-50 p-4 rounded-2xl mb-4 border border-indigo-100">
          <p class="text-[10px] font-black text-indigo-400 uppercase mb-1">Catatan Orang Tua</p>
          <p class="text-sm font-medium text-indigo-900 italic">"${siswa.catatan || 'Tidak ada catatan.'}"</p>
        </div>
        <div class="space-y-1">${progressHTML}</div>
      </div>`,
      confirmButtonText: 'Tutup',
      confirmButtonColor: '#0a1e36',
      width: '500px'
    });
  };

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER */}
      <div className="bg-[#0a1e36] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-4 mb-3">
               <ClipboardCheck className="text-emerald-400" size={32} />
               <h2 className="text-3xl font-black italic tracking-tight">Monitoring Progress</h2>
            </div>
            <p className="text-indigo-200 text-sm font-medium opacity-80 max-w-lg leading-relaxed">
              Pantau perkembangan siswa berdasarkan kelompok belajar masing-masing.
            </p>
          </div>

          {/* DROPDOWN KELOMPOK */}
          <div className="relative w-full md:w-48 group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none">
              <Layers size={18} />
            </div>
            <select 
              value={selectedKelompok}
              onChange={(e) => setSelectedKelompok(e.target.value)}
              className="w-full pl-12 pr-10 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-sm font-black appearance-none cursor-pointer transition-all focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="A" className="text-[#0a1e36]">Kelompok A</option>
              <option value="B" className="text-[#0a1e36]">Kelompok B</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none">
              <ChevronDown size={18} />
            </div>
          </div>
        </div>
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]"></div>
      </div>

      {/* SEARCH */}
      <div className="px-2">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={`Cari siswa di Kelompok ${selectedKelompok}...`}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold shadow-sm focus:ring-2 focus:ring-indigo-600 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* CARDS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.filter(d => d.namaSiswa.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
          <div 
            key={item.id}
            onClick={() => showDetailModal(item)}
            className={`p-6 rounded-[2.5rem] border transition-all cursor-pointer group flex items-center justify-between ${
              item.status === 'Sudah Mengisi' 
              ? 'bg-white border-slate-100 hover:border-emerald-400 hover:shadow-xl' 
              : 'bg-slate-50 border-dashed border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${
                item.status === 'Sudah Mengisi' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-400'
              }`}>
                {item.status === 'Sudah Mengisi' ? <CheckCircle2 size={28} /> : <User size={28} />}
              </div>
              <div>
                <h4 className="font-black text-[#0a1e36] text-lg group-hover:text-emerald-600 transition-colors">{item.namaSiswa}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.namaOrtu}</span>
                  <div className={`px-2 py-0.5 rounded-md text-[8px] font-black bg-slate-100 text-slate-400`}>KELOMPOK {selectedKelompok}</div>
                </div>
              </div>
            </div>

            <div className="text-right">
              {item.status === 'Sudah Mengisi' ? (
                <div className="flex flex-col items-end gap-1">
                   <div className="text-emerald-600 font-black text-2xl italic flex items-center gap-1">
                      {item.totalSkor} <ArrowUpRight size={16}/>
                   </div>
                   <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{item.tanggal}</span>
                </div>
              ) : (
                <div className="flex flex-col items-end opacity-30">
                  <Clock size={20} className="text-slate-400" />
                  <span className="text-[8px] font-black uppercase mt-1 text-slate-400">Menunggu</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportGuru;