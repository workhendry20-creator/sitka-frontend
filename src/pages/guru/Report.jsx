// src/pages/guru/Report.jsx
import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, Search, User, ArrowUpRight, 
  CheckCircle2, Clock, AlertCircle, Layers, ChevronDown 
} from 'lucide-react';
import Swal from 'sweetalert2';
import { supabase } from '../../utils/supabaseClient';

const ReportGuru = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKelompok, setSelectedKelompok] = useState("Kelompok A"); 
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- AMBIL DATA PROGRESS SISWA LANGSUNG DARI SUPABASE ---
  useEffect(() => {
    fetchProgressSiswa();
  }, [selectedKelompok]);

  const fetchProgressSiswa = async () => {
    setLoading(true);
    try {
      // Menarik data siswa (role ortu) berdasarkan filter kelompok yang dipilih guru
      const { data, error } = await supabase
        .from('users')
        .select('id, nama, nama_anak, kelompok')
        .eq('role', 'ortu')
        .eq('kelompok', selectedKelompok)
        .order('nama_anak', { ascending: true });

      if (error) throw error;

      // Map data Supabase ke state laporan. 
      // Catatan: Karena kita belum membuat integrasi tabel submisi fisik ortu, 
      // kita set status default ke 'Belum Mengisi' namun data nama anak dan ortu 100% akurat dari database.
      const mappedReports = data.map(siswa => ({
        id: siswa.id,
        namaSiswa: siswa.nama_anak,
        namaOrtu: siswa.nama, // Kolom 'nama' adalah nama akun Wali/Ortu
        status: "Belum Mengisi", // Siap dikoneksikan ke tabel progress kelak
        totalSkor: "-",
        tanggal: "-",
        catatan: "-",
        detailProgress: []
      }));

      setReports(mappedReports);
    } catch (err) {
      console.error("Gagal memuat monitoring progress siswa:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const showDetailModal = (siswa) => {
    if (siswa.status === "Belum Mengisi") {
      return Swal.fire({
        title: 'Data Belum Tersedia',
        text: `Orang tua dari ${siswa.namaSiswa} belum mengirimkan formulir laporan berkala via aplikasi.`,
        icon: 'info',
        confirmButtonColor: '#0a1e36',
        customClass: { popup: 'rounded-[2rem]' }
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
      title: `<div class="text-left"><p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Rincian Progress ${selectedKelompok}</p><h3 class="text-xl font-black text-[#0a1e36]">${siswa.namaSiswa}</h3></div>`,
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
    <div className="space-y-8 pb-20 text-left">
      {/* HEADER */}
      <div className="bg-[#0a1e36] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-4 mb-3">
               <ClipboardCheck className="text-emerald-400" size={32} />
               <h2 className="text-3xl font-black italic tracking-tight">Monitoring Progress</h2>
            </div>
            <p className="text-indigo-200 text-sm font-medium opacity-80 max-w-lg leading-relaxed">
              Pantau rekam jejak perkembangan kompetensi anak didik berdasarkan kelompok belajar masing-masing secara realtime.
            </p>
          </div>

          {/* DROPDOWN KELOMPOK */}
          <div className="relative w-full md:w-56 group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none">
              <Layers size={18} />
            </div>
            <select 
              value={selectedKelompok}
              onChange={(e) => setSelectedKelompok(e.target.value)}
              className="w-full pl-12 pr-10 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-sm font-black appearance-none cursor-pointer transition-all focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="Kelompok A" className="text-[#0a1e36]">Kelompok A</option>
              <option value="Kelompok B" className="text-[#0a1e36]">Kelompok B</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none">
              <ChevronDown size={18} />
            </div>
          </div>
        </div>
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]"></div>
      </div>

      {/* SEARCH BAR */}
      <div className="px-2">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={`Cari nama anak didik di ${selectedKelompok}...`}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold shadow-sm focus:ring-2 focus:ring-indigo-600 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* CARDS LIST MONITORING */}
      {loading ? (
        <div className="text-center py-20 font-bold text-[#0a1e36] animate-pulse">
          Sinkronisasi berkas progress murid...
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-16 text-slate-400 border border-dashed rounded-[2.5rem]">
          Belum ada anak didik terdaftar di {selectedKelompok} dalam database Cloud.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports
            .filter(d => d.namaSiswa.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((item) => (
              <div 
                key={item.id}
                onClick={() => showDetailModal(item)}
                className={`p-6 rounded-[2.5rem] border transition-all cursor-pointer group flex items-center justify-between ${
                  item.status === 'Sudah Mengisi' 
                  ? 'bg-white border-slate-100 hover:border-emerald-400 hover:shadow-xl' 
                  : 'bg-slate-50 border-dashed border-slate-200 opacity-70 hover:opacity-100 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${
                    item.status === 'Sudah Mengisi' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-400'
                  }`}>
                    {item.status === 'Sudah Mengisi' ? <CheckCircle2 size={28} /> : <User size={28} />}
                  </div>
                  <div>
                    <h4 className="font-black text-[#0a1e36] text-lg group-hover:text-indigo-600 transition-colors">
                      {item.namaSiswa}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Wali: {item.namaOrtu}
                      </span>
                      <div className="px-2 py-0.5 rounded-md text-[8px] font-black bg-slate-100 text-slate-500 uppercase">
                        {selectedKelompok}
                      </div>
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
                    <div className="flex flex-col items-end opacity-40 group-hover:opacity-100 transition-opacity">
                      <Clock size={20} className="text-amber-500" />
                      <span className="text-[8px] font-black uppercase mt-1 text-slate-400 tracking-tighter">Belum Ada</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ReportGuru;