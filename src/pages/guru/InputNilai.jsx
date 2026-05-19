// src/pages/guru/InputNilai.jsx
import React, { useState } from 'react';
import { 
  ClipboardCheck, Calendar, Users, 
  Save, User, Download, FileText, ChevronDown, BookOpen
} from 'lucide-react';
import Swal from 'sweetalert2';

const InputNilai = () => {
  // --- STATE UTAMA ---
  const [inputType, setInputType] = useState('Harian');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [kelompok, setKelompok] = useState('Kelompok A');
  const [selectedSemester, setSelectedSemester] = useState('1 (Ganjil)');
  const [selectedSiswaId, setSelectedSiswaId] = useState(''); 

  // Data Master Siswa (Initial State)
  const initialData = {
    'Kelompok A': [
      { id: 1, nama: "Aditya Pratama", emoji: '😊', label: 'Bahagia', catatan: "", nilaiSemester: {}, rekomendasi: "" },
      { id: 2, nama: "Salsa Bella", emoji: '😊', label: 'Bahagia', catatan: "", nilaiSemester: {}, rekomendasi: "" },
      { id: 3, nama: "Rizky Fauzan", emoji: '😊', label: 'Bahagia', catatan: "", nilaiSemester: {}, rekomendasi: "" },
    ],
    'Kelompok B': [
      { id: 4, nama: "Budi Junior", emoji: '😊', label: 'Bahagia', catatan: "", nilaiSemester: {}, rekomendasi: "" },
      { id: 5, nama: "Citra Lestari", emoji: '😊', label: 'Bahagia', catatan: "", nilaiSemester: {}, rekomendasi: "" },
      { id: 6, nama: "Dedi Irawan", emoji: '😊', label: 'Bahagia', catatan: "", nilaiSemester: {}, rekomendasi: "" },
    ]
  };

  // State untuk data yang sedang di-input di form
  const [anekdotSiswa, setAnekdotSiswa] = useState(initialData['Kelompok A']);
  
  // State untuk Rekapitulasi Global
  const [rekapData, setRekapData] = useState([]);

  // --- PARAMETER PENILAIAN AKADEMIK ASLI DARI DOKUMEN PAUD PDF ---
  const parameterAkademik = [
    {
      kategori: "I. NILAI-NILAI AGAMA DAN MORAL",
      indikator: [
        { id: "nam_1", teks: "Dapat menyebutkan paling sedikit 5 sifat-sifat asmaul husna/nama Allah" },
        { id: "nam_2", teks: "Dapat meniru gerakan ibadah/wudhu dengan benar" },
        { id: "nam_3", teks: "Dapat berdo'a sebelum dan sesudah melakukan sesuatu" },
        { id: "nam_4", teks: "Dapat membedakan perilaku baik dan buruk" },
        { id: "nam_5", teks: "Terbiasa mengucapkan salam dan membalas salam" }
      ]
    },
    {
      kategori: "II. MOTORIK",
      indikator: [
        { id: "mot_1", teks: "Motorik Kasar: Meniru gerakan binatang, pohon tertiup angin, dll" },
        { id: "mot_2", teks: "Motorik Kasar: Melompat, meloncat, dan berlari terkoordinasi" },
        { id: "mot_3", teks: "Motorik Halus: Membuat garis vertikal, horizontal, lengkung, dan lingkaran" },
        { id: "mot_4", teks: "Motorik Halus: Menjiplak bentuk dan menggunakan media kreatif" }
      ]
    },
    {
      kategori: "III. KOGNITIF",
      indikator: [
        { id: "kog_1", teks: "Pengetahuan Umum: Menyebutkan benda dan fungsinya sehari-hari" },
        { id: "kog_2", teks: "Ukuran & Warna: Mengklasifikasikan benda berdasarkan bentuk/warna" },
        { id: "kog_3", teks: "Bilangan: Membilang dan mengenal lambang bilangan 1 sampai 10" }
      ]
    },
    {
      kategori: "IV. BAHASA",
      indikator: [
        { id: "bah_1", teks: "Menerima Bahasa: Menyimak perkataan orang lain & mengerti perintah" },
        { id: "bah_2", teks: "Mengungkapkan: Menjawab pertanyaan sederhana & bercerita" },
        { id: "bah_3", teks: "Keaksaraan: Meniru huruf dan membuat coretan bermakna" }
      ]
    },
    {
      kategori: "V. SOSIAL EMOSIONAL",
      indikator: [
        { id: "se_1", teks: "Menunjukkan sikap mandiri dalam memilih kegiatan" },
        { id: "se_2", teks: "Mau berbagi, menolong, dan membantu teman" },
        { id: "se_3", teks: "Menaati peraturan yang berlaku dalam permainan" }
      ]
    }
  ];

  // --- HANDLER FUNCTIONS ---

  const handleGantiKelompok = (klp) => {
    setKelompok(klp);
    setSelectedSiswaId(''); 
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

  const updateSkorSemesterSiswa = (siswaId, indikatorId, skor) => {
    setAnekdotSiswa(prev => prev.map(s => {
      if (s.id === siswaId) {
        return {
          ...s,
          nilaiSemester: { ...s.nilaiSemester, [indikatorId]: skor }
        };
      }
      return s;
    }));
  };

  const handleSaveToRekap = () => {
    if (inputType === 'Semester' && !selectedSiswaId) {
      return Swal.fire('Form Belum Lengkap', 'Silakan pilih nama anak didik terlebih dahulu.', 'warning');
    }

    let updatedData = [];
    if (inputType === 'Semester') {
      const targetSiswa = anekdotSiswa.find(s => s.id === parseInt(selectedSiswaId));
      if (targetSiswa) {
        updatedData = [{ ...targetSiswa, kelompok, tanggal, label: `Semester ${selectedSemester}` }];
      }
    } else {
      updatedData = anekdotSiswa.map(s => ({ ...s, kelompok, tanggal }));
    }
    
    setRekapData(prev => {
      const idsToFilter = updatedData.map(u => u.id);
      const filtered = prev.filter(p => !(p.kelompok === kelompok && p.tanggal === tanggal && idsToFilter.includes(p.id) && p.label.includes(inputType === 'Semester' ? 'Semester' : 'Bahagia')));
      return [...filtered, ...updatedData];
    });

    Swal.fire({
      icon: 'success',
      title: 'Tersimpan ke Rekap!',
      text: `Data ${inputType} berhasil direkam ke tabel rekap.`,
      confirmButtonColor: '#4f46e5'
    });
  };

  const downloadCSV = () => {
    if (rekapData.length === 0) {
      return Swal.fire('Oops!', 'Belum ada data rekap untuk di-export.', 'warning');
    }

    const headers = "Tanggal,Kelompok,Nama Siswa,Periode/Status,Catatan/Rekomendasi\n";
    const rows = rekapData.map(s => {
      const catatanText = s.label.includes('Semester') ? s.rekomendasi : s.catatan;
      return `${s.tanggal},${s.kelompok},${s.nama},${s.label},"${(catatanText || '').replace(/"/g, '""')}"`;
    }).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rekap_Nilai_SITKA_${tanggal}.csv`;
    a.click();
  };

  const currentSelectedSiswa = anekdotSiswa.find(s => s.id === parseInt(selectedSiswaId));

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 text-left">
      
      {/* --- HEADER SECTION (Tombol Simpan Di Sini Sudah Dihapus) --- */}
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
                onChange={(e) => {
                  setInputType(e.target.value.replace('Input ', ''));
                  setSelectedSiswaId(''); 
                }}
                className="pl-6 pr-10 py-4 bg-indigo-50 border-none rounded-2xl text-sm font-black text-[#0a1e36] appearance-none focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
              >
                {['Input Harian', 'Input Mingguan', 'Input Quartal', 'Input Semester'].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>

            {/* Dropdown Siswa */}
            {inputType === 'Semester' && (
              <div className="relative">
                <select 
                  value={selectedSiswaId}
                  onChange={(e) => setSelectedSiswaId(e.target.value)}
                  className="pl-6 pr-10 py-4 bg-indigo-600 text-white border-none rounded-2xl text-sm font-black appearance-none outline-none cursor-pointer"
                >
                  <option value="">-- Pilih Anak Didik --</option>
                  {anekdotSiswa.map(s => (
                    <option key={s.id} value={s.id} className="text-black">{s.nama}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none" size={16} />
              </div>
            )}

            {/* Dropdown Target Semester */}
            {inputType === 'Semester' && (
              <div className="relative">
                <select 
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="pl-6 pr-10 py-4 bg-emerald-50 border-none rounded-2xl text-sm font-black text-emerald-800 appearance-none outline-none cursor-pointer"
                >
                  <option value="1 (Ganjil)">Semester 1 (Ganjil)</option>
                  <option value="2 (Genap)">Semester 2 (Genap)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none" size={16} />
              </div>
            )}

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
          </div>
        </div>
      </div>

      {/* --- FORM CONDITION 1: INPUT HARIAN --- */}
      {inputType === 'Harian' && (
        <div className="space-y-6">
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

                {/* Emoji Picker */}
                <div className="flex gap-2 p-2 bg-slate-50 rounded-[1.5rem]">
                  {[
                    { emo: '😊', label: 'Bahagia' },
                    { emo: '😐', label: 'Tenang' },
                    { emo: '😢', label: 'Sedih' },
                    { emo: '🌟', label: 'Istimewa' }
                  ].map((item) => (
                    <button
                      key={item.emo}
                      type="button"
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

          {/* BUTTON SUBMIT DI BAWAH (KHUSUS HARIAN) */}
          <button 
            onClick={handleSaveToRekap} 
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Save size={16} /> Simpan Seluruh Catatan Harian Ke Rekap
          </button>
        </div>
      )}

      {/* --- FORM CONDITION 2: INPUT SEMESTER --- */}
      {inputType === 'Semester' && (
        selectedSiswaId ? (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-md space-y-6">
              
              {/* Identitas Siswa */}
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-md shadow-indigo-100">
                  {currentSelectedSiswa?.nama.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#0a1e36]">{currentSelectedSiswa?.nama}</h3>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                    Lembar Kuesioner Rapot Capaian {selectedSemester} ({kelompok})
                  </p>
                </div>
              </div>

              {/* Render Kategori */}
              <div className="space-y-6">
                {parameterAkademik.map((kat, kIdx) => (
                  <div key={kIdx} className="border border-slate-100 rounded-2xl overflow-hidden shadow-inner">
                    <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center gap-2">
                      <BookOpen size={16} className="text-indigo-600" />
                      <span className="text-[10px] font-black text-[#0a1e36] tracking-wider uppercase">{kat.kategori}</span>
                    </div>

                    <div className="divide-y divide-slate-50">
                      {kat.indikator.map((ind) => (
                        <div key={ind.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <p className="text-xs font-bold text-slate-600 max-w-xl">{ind.teks}</p>
                          
                          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl self-end sm:self-center">
                            {[
                              { key: 'BM', name: 'Belum Muncul' },
                              { key: 'MM', name: 'Mulai Muncul' },
                              { key: 'BSH', name: 'Sesuai Harapan' },
                              { key: 'BSB', name: 'Sangat Baik' }
                            ].map((skala) => (
                              <button
                                key={skala.key}
                                type="button"
                                title={skala.name}
                                onClick={() => updateSkorSemesterSiswa(currentSelectedSiswa.id, ind.id, skala.key)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                                  currentSelectedSiswa?.nilaiSemester?.[ind.id] === skala.key
                                    ? 'bg-[#0a1e36] text-white shadow-sm'
                                    : 'bg-white text-slate-400 hover:text-slate-600'
                                }`}
                              >
                                {skala.key}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Catatan Rekomendasi */}
              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-black text-[#0a1e36] uppercase tracking-wider block">
                  Rekomendasi Pendidik / Catatan Akhir Semester untuk {currentSelectedSiswa?.nama}
                </label>
                <textarea 
                  placeholder="Alhamdulillah ananda berkembang sangat baik dalam nilai agama & moral. Ananda mulai menunjukkan kemandirian..."
                  value={currentSelectedSiswa?.rekomendasi || ""}
                  onChange={(e) => updateSiswa(currentSelectedSiswa.id, 'rekomendasi', e.target.value)}
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl text-xs font-medium italic outline-none focus:ring-2 focus:ring-indigo-500 min-h-[90px]"
                />
              </div>

            </div>

            {/* BUTTON SUBMIT DI BAWAH REKOMENDASI (Sesuai update yang Senior minta) */}
            <button 
              onClick={handleSaveToRekap} 
              className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Save size={16} /> Simpan Rapot Semester {currentSelectedSiswa?.nama} Ke Rekap
            </button>
          </div>
        ) : (
          <div className="bg-white p-16 rounded-[3rem] text-center border border-dashed border-slate-200">
             <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={28} />
             </div>
             <h4 className="text-base font-black text-[#0a1e36] uppercase tracking-wider">Lembar Evaluasi Semester</h4>
             <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto">
                Silakan klik tombol <span className="text-indigo-600 font-bold">"-- Pilih Anak Didik --"</span> di barisan menu atas untuk membuka berkas kuesioner rapot fisik PAUD.
              </p>
          </div>
        )
      )}

      {/* --- CONDITION 3: FALLBACK MINGGUAN & QUARTAL --- */}
      {inputType !== 'Harian' && inputType !== 'Semester' && (
        <div className="bg-white p-20 rounded-[3rem] text-center border border-dashed border-slate-200">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={40} className="text-slate-300" />
           </div>
           <h3 className="text-xl font-bold text-[#0a1e36]">Form {inputType}</h3>
           <p className="text-slate-400 mt-2">Fitur pengisian untuk periode {inputType} sedang dalam pengembangan.</p>
        </div>
      )}

      {/* --- SECTION REKAPITULASI GLOBAL --- */}
      <div className="bg-[#0a1e36] p-8 md:p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h3 className="text-2xl font-black mb-1 italic">Rekapitulasi Input</h3>
            <p className="text-indigo-300 text-xs font-bold uppercase tracking-[0.2em]">Data Terkumpul ({kelompok})</p>
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
                <th className="px-6 pb-2">Tipe / Periode</th>
                <th className="px-6 pb-2">Keterangan Catatan / Rekomendasi</th>
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
                      <span className="text-[10px] font-black bg-white/10 px-2 py-1 rounded-md text-slate-300">
                        {item.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-300 italic max-w-xs truncate">
                      {item.rekomendasi || item.catatan || "(Kosong)"}
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