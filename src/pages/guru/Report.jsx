// src/pages/guru/Report.jsx
import React, { useState } from 'react';
import { 
  Calendar, User, BarChart3, Save, Download,
  Brain, MessageSquare, Heart, Palette, Ruler, CheckCircle2, History
} from 'lucide-react';
import Swal from 'sweetalert2';

const Report = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStudent, setSelectedStudent] = useState('Aditya Pratama');

  // State untuk form input
  const [progress, setProgress] = useState({
    fisik: 80, kognitif: 80, bahasa: 80, sosial: 80, seni: 80, catatan: ''
  });

  // State untuk menampung daftar report yang sudah tersimpan
  const [savedReports, setSavedReports] = useState([]);

  const students = ['Aditya Pratama', 'Budi Santoso', 'Citra Lestari', 'Dewi Anugrah', 'Eko Wijaya'];

  const handleInputChange = (aspek, value) => {
    setProgress(prev => ({ ...prev, [aspek]: value }));
  };

  const handleSaveReport = (e) => {
    e.preventDefault();
    
    // Validasi catatan tidak boleh kosong
    if(!progress.catatan.trim()) {
        Swal.fire('Catatan Kosong', 'Harap isi catatan perkembangan siswa', 'warning');
        return;
    }

    const newReport = {
      id: Date.now(),
      nama: selectedStudent,
      tanggal: selectedDate,
      data: { ...progress }
    };

    // Tambahkan ke daftar report di bawah
    setSavedReports([newReport, ...savedReports]);

    Swal.fire({
      icon: 'success',
      title: 'Report Terkirim!',
      text: `Laporan perkembangan ${selectedStudent} telah disimpan.`,
      confirmButtonColor: '#306896',
      customClass: { popup: 'rounded-[2rem]' }
    });

    // Reset Form untuk input siswa berikutnya
    setProgress({ fisik: 80, kognitif: 80, bahasa: 80, sosial: 80, seni: 80, catatan: '' });
  };

  const exportSingleCSV = (report) => {
    const header = "Aspek,Nilai,Catatan\n";
    const data = report.data;
    const rows = [
      `Fisik Motorik,${data.fisik}`,
      `Kognitif,${data.kognitif}`,
      `Bahasa,${data.bahasa}`,
      `Sosial Emosional,${data.sosial}`,
      `Seni,${data.seni}`,
      `Keterangan,"${data.catatan}"`
    ].join("\n");

    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Report_${report.nama}_${report.tanggal}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* SECTION 1: HEADER & SELECTOR */}
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col lg:flex-row justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-2xl text-[#306896]">
            <BarChart3 size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#0a1e36]">Input Progress Siswa</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Jurnal Evaluasi Harian</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <select 
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="pl-11 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-[#0a1e36] outline-none appearance-none focus:ring-4 focus:ring-blue-50 transition-all cursor-pointer"
            >
              {students.map(name => <option key={name} value={name}>{name}</option>)}
            </select>
          </div>
          <div className="relative group">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-[#0a1e36] outline-none" />
          </div>
        </div>
      </div>

      {/* SECTION 2: FORM INPUT */}
      <form onSubmit={handleSaveReport} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Skoring Perkembangan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            {[
              { key: 'fisik', label: 'Fisik Motorik', icon: Ruler, color: 'text-blue-600', bg: 'bg-blue-50' },
              { key: 'kognitif', label: 'Kognitif', icon: Brain, color: 'text-purple-600', bg: 'bg-purple-50' },
              { key: 'bahasa', label: 'Bahasa', icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-50' },
              { key: 'sosial', label: 'Sosial Emosional', icon: Heart, color: 'text-red-600', bg: 'bg-red-50' },
              { key: 'seni', label: 'Seni & Kreativitas', icon: Palette, color: 'text-orange-600', bg: 'bg-orange-50' },
            ].map((item) => (
              <div key={item.key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">{item.label}</span>
                  <span className={`text-sm font-black ${item.color}`}>{progress[item.key]}%</span>
                </div>
                <input type="range" min="0" max="100" value={progress[item.key]} onChange={(e) => handleInputChange(item.key, e.target.value)} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#306896]" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0a1e36] p-8 rounded-[2rem] text-white flex flex-col shadow-xl">
          <h3 className="text-sm font-black text-white/40 uppercase tracking-widest mb-4">Catatan Guru</h3>
          <textarea 
            placeholder={`Ceritakan perkembangan ${selectedStudent} hari ini...`}
            value={progress.catatan}
            onChange={(e) => handleInputChange('catatan', e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-5 text-sm outline-none focus:border-white/30 transition-all resize-none mb-6"
          />
          <button type="submit" className="w-full py-4 bg-white text-[#0a1e36] rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-50 transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2">
            <Save size={18} /> Simpan & Kirim
          </button>
        </div>
      </form>

      {/* SECTION 3: REKAPAN / PREVIEW REPORT (HASIL INPUT) */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-4">
          <History className="text-[#306896]" size={20} />
          <h3 className="text-lg font-bold text-[#0a1e36]">Daftar Report Baru Saja Dibuat</h3>
        </div>

        {savedReports.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center text-slate-400 font-medium">
            Belum ada report yang disimpan. Silakan isi form di atas.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedReports.map((report) => (
              <div key={report.id} className="bg-white p-7 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[5rem] -mr-10 -mt-10 group-hover:bg-blue-50 transition-colors" />
                
                <div className="relative z-10 space-y-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-black text-[#0a1e36]">{report.nama}</h4>
                      <p className="text-xs font-bold text-slate-400">{report.tanggal}</p>
                    </div>
                    <button onClick={() => exportSingleCSV(report)} className="p-3 bg-[#306896] text-white rounded-2xl hover:bg-[#25547a] transition-all shadow-lg">
                      <Download size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {Object.entries(report.data).map(([key, val]) => (
                      key !== 'catatan' && (
                        <div key={key} className="text-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <p className="text-[8px] font-black text-slate-400 uppercase">{key}</p>
                          <p className="text-xs font-black text-[#306896]">{val}%</p>
                        </div>
                      )
                    ))}
                  </div>

                  <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                    <p className="text-[10px] font-black text-[#306896] uppercase mb-1">Catatan Guru:</p>
                    <p className="text-xs text-slate-600 italic leading-relaxed">"{report.data.catatan}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Report;