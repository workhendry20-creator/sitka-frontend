import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, Calendar, Users, 
  Save, User, Download, FileText, CheckCircle2
} from 'lucide-react';
import Swal from 'sweetalert2';

const InputNilai = () => {
  const [inputType, setInputType] = useState('Harian');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [kelompok, setKelompok] = useState('Kelompok A');
  
  // Data Master Siswa
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

  // State untuk data yang sedang diedit di form
  const [anekdotSiswa, setAnekdotSiswa] = useState(initialData['Kelompok A']);
  
  // State untuk REKAP (Menyimpan permanen yang sudah diinput)
  const [rekapData, setRekapData] = useState([]);

  // Sinkronisasi data saat ganti kelompok
  const handleGantiKelompok = (klp) => {
    setKelompok(klp);
    // Logika sederhana: ambil dari rekap jika sudah ada, jika tidak ambil data awal
    const existing = rekapData.filter(s => s.kelompok === klp);
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

  const handleSave = () => {
    // Masukkan data kelompok saat ini ke dalam Rekap Global
    const updatedData = anekdotSiswa.map(s => ({ ...s, kelompok, tanggal }));
    
    setRekapData(prev => {
      const filtered = prev.filter(p => p.kelompok !== kelompok);
      return [...filtered, ...updatedData];
    });

    Swal.fire({
      icon: 'success',
      title: 'Tersimpan ke Rekap!',
      text: `Data ${kelompok} berhasil diperbarui di tabel rekap bawah.`,
      confirmButtonColor: '#4f46e5'
    });
  };

  const downloadCSV = () => {
    if (rekapData.length === 0) {
      return Swal.fire('Oops!', 'Belum ada data di rekap untuk diunduh.', 'warning');
    }

    const headers = "Tanggal,Kelompok,Nama Siswa,Status,Catatan\n";
    const rows = rekapData.map(s => 
      `${s.tanggal},${s.kelompok},${s.nama},${s.label},"${s.catatan.replace(/"/g, '""')}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rekap_Anekdot_${tanggal}.csv`;
    a.click();
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* --- HEADER & INPUT FORM --- */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
              <ClipboardCheck size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#0a1e36]">Input Nilai Harian</h2>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Kelompok {kelompok}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <select 
              value={kelompok}
              onChange={(e) => handleGantiKelompok(e.target.value)}
              className="pl-6 pr-10 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-[#0a1e36] outline-none cursor-pointer"
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

            <button onClick={handleSave} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-lg transition-all active:scale-95">
              Simpan Ke Rekap
            </button>
          </div>
        </div>

        {/* --- FORM CARDS --- */}
        <div className="grid grid-cols-1 gap-6">
          {anekdotSiswa.map((siswa) => (
            <div key={siswa.id} className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row gap-6 items-start">
              <div className="flex items-center gap-4 min-w-[180px]">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm font-bold">
                  {siswa.nama.charAt(0)}
                </div>
                <h4 className="font-bold text-[#0a1e36]">{siswa.nama}</h4>
              </div>

              <div className="flex gap-2 p-1 bg-white rounded-2xl shadow-sm">
                {[
                  { emo: '😊', label: 'Bahagia' },
                  { emo: '😐', label: 'Tenang' },
                  { emo: '😢', label: 'Sedih' },
                  { emo: '🌟', label: 'Istimewa' }
                ].map((item) => (
                  <button
                    key={item.emo}
                    onClick={() => updateSiswa(siswa.id, 'emoji', item.emo, item.label)}
                    className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all ${siswa.emoji === item.emo ? 'bg-indigo-600 text-white scale-105 shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                  >
                    <span className="text-xl">{item.emo}</span>
                    <span className="text-[7px] font-black uppercase mt-1">{item.label}</span>
                  </button>
                ))}
              </div>

              <textarea
                placeholder="Catatan perkembangan..."
                value={siswa.catatan}
                onChange={(e) => updateSiswa(siswa.id, 'catatan', e.target.value)}
                className="flex-1 w-full p-4 bg-white border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 min-h-[70px] resize-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* --- SECTION REKAPITULASI --- */}
      <div className="bg-[#0a1e36] p-8 md:p-10 rounded-[3rem] text-white shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
          <FileText size={200} />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
          <div>
            <h3 className="text-2xl font-black mb-1">Rekapitulasi Anekdot</h3>
            <p className="text-indigo-300 text-xs font-bold uppercase tracking-[0.2em]">Seluruh Kelompok Siswa</p>
          </div>
          <button 
            onClick={downloadCSV}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95"
          >
            <Download size={18} /> Export ke CSV
          </button>
        </div>

        <div className="overflow-x-auto relative z-10">
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
                  <td colSpan="4" className="text-center py-10 text-slate-500 font-bold italic">Belum ada data rekap. Silakan klik 'Simpan ke Rekap' di atas.</td>
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