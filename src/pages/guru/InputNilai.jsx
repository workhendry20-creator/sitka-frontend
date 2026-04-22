import React, { useState } from 'react';
import { 
  ClipboardCheck, Calendar, Users, 
  Save, User, Download, FileText, ChevronDown 
} from 'lucide-react';
import Swal from 'sweetalert2';

const InputNilai = () => {
  // --- STATE UTAMA ---
  const [inputType, setInputType] = useState('Harian');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [kelompok, setKelompok] = useState('Kelompok A');
  
  // Data Master Siswa (Initial State)
  const initialData = {
    'Kelompok A': [
      { id: 1, nama: "Aditya Pratama", emoji: '😊', label: 'Bahagia', catatan: "" },
      { id: 2, nama: "Salsa Bella", emoji: '😊', label: 'Bahagia', catatan: "" },
      { id: 3, nama: "Rizky Fauzan", emoji: '😊', label: 'Bahagia', catatan: "" },
    ],
    'Kelompok B': [
      { id: 4, nama: "Budi Junior", emoji: '😊', label: 'Bahagia', catatan: "" },
      { id: 5, nama: "Citra Lestari", emoji: '😊', label: 'Bahagia', catatan: "" },
      { id: 6, nama: "Dedi Irawan", emoji: '😊', label: 'Bahagia', catatan: "" },
    ]
  };

  // State untuk data yang sedang di-input di form
  const [anekdotSiswa, setAnekdotSiswa] = useState(initialData['Kelompok A']);
  
  // State untuk Rekapitulasi Global
  const [rekapData, setRekapData] = useState([]);

  // --- HANDLER FUNCTIONS ---

  const handleGantiKelompok = (klp) => {
    setKelompok(klp);
    // Cek apakah di rekap sudah ada data untuk kelompok ini di tanggal ini
    const existing = rekapData.filter(s => s.kelompok === klp && s.tanggal === tanggal);
    if (existing.length > 0) {
      setAnekdotSiswa(existing);
    } else {
      setAnekdotSiswa(initialData[klp]);
    }
  };

  const updateSiswa = (id, field, value, extra = null) => {
    setAnekdotSiswa(prev => prev.map(s => {
      if (s.id === id) {
        if (field === 'emoji') return { ...s, emoji: value, label: extra };
        return { ...s, [field]: value };
      }
      return s;
    }));
  };

  const handleSaveToRekap = () => {
    const updatedData = anekdotSiswa.map(s => ({ ...s, kelompok, tanggal }));
    
    setRekapData(prev => {
      // Hapus data lama kelompok & tanggal yang sama agar tidak duplikat di rekap
      const filtered = prev.filter(p => !(p.kelompok === kelompok && p.tanggal === tanggal));
      return [...filtered, ...updatedData];
    });

    Swal.fire({
      icon: 'success',
      title: 'Tersimpan ke Rekap!',
      text: `Data ${inputType} ${kelompok} berhasil masuk ke tabel rekap.`,
      confirmButtonColor: '#4f46e5'
    });
  };

  const downloadCSV = () => {
    if (rekapData.length === 0) {
      return Swal.fire('Oops!', 'Belum ada data rekap untuk di-export.', 'warning');
    }

    const headers = "Tanggal,Kelompok,Nama Siswa,Status,Catatan\n";
    const rows = rekapData.map(s => 
      `${s.tanggal},${s.kelompok},${s.nama},${s.label},"${s.catatan.replace(/"/g, '""')}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rekap_Nilai_SITKA_${tanggal}.csv`;
    a.click();
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* --- HEADER SECTION --- */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="flex items-center gap-5">
            <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
              <ClipboardCheck size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#0a1e36]">Input Nilai</h2>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Panel Evaluasi Guru</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Dropdown Tipe Input */}
            <div className="relative">
              <select 
                value={`Input ${inputType}`}
                onChange={(e) => setInputType(e.target.value.replace('Input ', ''))}
                className="pl-6 pr-10 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-[#0a1e36] appearance-none focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
              >
                {['Input Harian', 'Input Mingguan', 'Input Quartal', 'Input Semester'].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>

            {/* Dropdown Kelompok */}
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" size={18} />
              <select 
                value={kelompok}
                onChange={(e) => handleGantiKelompok(e.target.value)}
                className="pl-12 pr-10 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-[#0a1e36] outline-none cursor-pointer"
              >
                <option value="Kelompok A">Kelompok A</option>
                <option value="Kelompok B">Kelompok B</option>
              </select>
            </div>

            {/* Date Picker */}
            <input 
              type="date" 
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-[#0a1e36] outline-none"
            />

            <button 
              onClick={handleSaveToRekap} 
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-lg transition-all active:scale-95"
            >
              Simpan Ke Rekap
            </button>
          </div>
        </div>
      </div>

      {/* --- FORM INPUT HARIAN --- */}
      {inputType === 'Harian' ? (
        <div className="grid grid-cols-1 gap-6">
          {anekdotSiswa.map((siswa) => (
            <div key={siswa.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start group hover:border-indigo-200 transition-all">
              <div className="flex items-center gap-4 min-w-[200px]">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {siswa.nama.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-[#0a1e36]">{siswa.nama}</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{kelompok}</p>
                </div>
              </div>

              {/* Emoji Picker dengan Label */}
              <div className="flex gap-2 p-2 bg-slate-50 rounded-[1.5rem]">
                {[
                  { emo: '😊', label: 'Bahagia' },
                  { emo: '😐', label: 'Tenang' },
                  { emo: '😢', label: 'Sedih' },
                  { emo: '🌟', label: 'Istimewa' }
                ].map((item) => (
                  <button
                    key={item.emo}
                    onClick={() => updateSiswa(siswa.id, 'emoji', item.emo, item.label)}
                    className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all ${
                      siswa.emoji === item.emo 
                      ? 'bg-white shadow-md scale-105 border-b-4 border-indigo-500' 
                      : 'opacity-40 hover:opacity-100 hover:bg-white/50'
                    }`}
                  >
                    <span className="text-2xl">{item.emo}</span>
                    <span className={`text-[8px] font-black uppercase mt-1 ${siswa.emoji === item.emo ? 'text-indigo-600' : 'text-slate-500'}`}>
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>

              <textarea
                placeholder={`Tulis catatan harian untuk ${siswa.nama}...`}
                value={siswa.catatan}
                onChange={(e) => updateSiswa(siswa.id, 'catatan', e.target.value)}
                className="flex-1 w-full p-4 bg-slate-50 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 min-h-[85px] resize-none"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-20 rounded-[3rem] text-center border border-dashed border-slate-200">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={40} className="text-slate-300" />
           </div>
           <h3 className="text-xl font-bold text-[#0a1e36]">Form {inputType}</h3>
           <p className="text-slate-400 mt-2">Fitur pengisian untuk periode {inputType} sedang dalam pengembangan.</p>
        </div>
      )}

      {/* --- SECTION REKAPITULASI --- */}
      <div className="bg-[#0a1e36] p-8 md:p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h3 className="text-2xl font-black mb-1 italic">Rekapitulasi Input</h3>
            <p className="text-indigo-300 text-xs font-bold uppercase tracking-[0.2em]">Data Terkumpul (A & B)</p>
          </div>
          <button 
            onClick={downloadCSV}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95"
          >
            <Download size={18} /> Export ke CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">
                <th className="px-6 pb-2">Kelompok</th>
                <th className="px-6 pb-2">Siswa</th>
                <th className="px-6 pb-2">Kondisi</th>
                <th className="px-6 pb-2">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {rekapData.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-slate-500 font-bold italic bg-white/5 rounded-2xl">
                    Belum ada data di rekap. Klik 'Simpan Ke Rekap' untuk memindahkan data.
                  </td>
                </tr>
              ) : (
                rekapData.sort((a,b) => a.kelompok.localeCompare(b.kelompok)).map((item, idx) => (
                  <tr key={idx} className="bg-white/5 backdrop-blur-md rounded-2xl">
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-[10px] font-black uppercase">
                        {item.kelompok}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-sm">{item.nama}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{item.emoji}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase">{item.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 italic max-w-xs truncate">
                      {item.catatan || "(Kosong)"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InputNilai;