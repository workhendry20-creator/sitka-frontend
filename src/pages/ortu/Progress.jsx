// src/pages/ortu/Progress.jsx
import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, Save, Award, BarChart3, 
  CheckCircle2, Star, Target
} from 'lucide-react'; 
import Swal from 'sweetalert2';

const ProgressOrtu = () => {
  const [tasks, setTasks] = useState([
    { id: 1, category: "Kemandirian", task: "Anak mampu memakai baju/celana sendiri", score: null },
    { id: 2, category: "Kemandirian", task: "Anak mampu makan sendiri tanpa disuapi", score: null },
    { id: 3, category: "Kemandirian", task: "Anak mampu menaruh sepatu pada tempatnya", score: null },
    { id: 4, category: "Kemandirian", task: "Anak berani ke toilet sendiri (Toilet Training)", score: null },
    { id: 5, category: "Sosial", task: "Anak mau berbagi mainan dengan teman/saudara", score: null },
    { id: 6, category: "Sosial", task: "Anak mampu merapikan mainan setelah digunakan", score: null },
    { id: 7, category: "Sosial", task: "Anak menunjukkan sikap sabar (mengantre/menunggu)", score: null },
    { id: 8, category: "Sosial", task: "Anak berani menyapa atau berpamitan (Salim)", score: null },
    { id: 9, category: "Kognitif", task: "Anak mampu menghafal doa pendek (Makan/Tidur)", score: null },
    { id: 10, category: "Kognitif", task: "Anak dapat menyebutkan warna/angka sederhana", score: null },
    { id: 11, category: "Kognitif", task: "Anak antusias mendengarkan cerita/dongeng", score: null },
    { id: 12, category: "Kognitif", task: "Anak mampu fokus melakukan tugas sampai selesai", score: null },
  ]);

  const handleScoreChange = (id, newScore) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, score: newScore } : t));
  };

  // --- LOGIC REKAPITULASI ---
  const stats = useMemo(() => {
    const categories = ["Kemandirian", "Sosial", "Kognitif"];
    return categories.map(cat => {
      const catTasks = tasks.filter(t => t.category === cat);
      const filledTasks = catTasks.filter(t => t.score !== null);
      const sum = filledTasks.reduce((acc, curr) => acc + curr.score, 0);
      const avg = filledTasks.length > 0 ? (sum / filledTasks.length).toFixed(1) : 0;
      const progress = filledTasks.length > 0 ? (filledTasks.length / catTasks.length) * 100 : 0;
      
      return { name: cat, avg, progress, totalFilled: filledTasks.length, total: catTasks.length };
    });
  }, [tasks]);

  const calculateTotalScore = () => {
    const filled = tasks.filter(t => t.score !== null);
    if (filled.length === 0) return 0;
    const sum = filled.reduce((acc, curr) => acc + curr.score, 0);
    return ((sum / (tasks.length * 3)) * 100).toFixed(0);
  };

  const handleSave = () => {
    const filledCount = tasks.filter(t => t.score !== null).length;
    if (filledCount < tasks.length) {
      return Swal.fire({
        title: 'Belum Lengkap',
        text: `Bunda baru mengisi ${filledCount} dari ${tasks.length} poin perkembangan.`,
        icon: 'warning',
        confirmButtonColor: '#0a1e36'
      });
    }

    Swal.fire({
      title: 'Kirim Progress?',
      text: "Data perkembangan si kecil akan langsung diteruskan ke Guru.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Kirim Sekarang',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#0a1e36',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Data telah disimpan.', confirmButtonColor: '#0a1e36' });
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-36">
      
      {/* HEADER */}
      <div className="bg-[#0a1e36] p-8 md:p-12 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div>
            <h2 className="text-3xl font-black mb-3 italic">Monitoring Bunda</h2>
            <p className="text-indigo-200 text-sm font-medium max-w-md leading-relaxed">
              Pantau perkembangan si kecil dari rumah dan hubungkan hasilnya dengan laporan guru.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 min-w-[200px]">
            <p className="text-[10px] font-black uppercase text-indigo-300 tracking-widest mb-2">Total Progress</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-5xl font-black">{calculateTotalScore()}%</span>
              <TrendingUp className="text-emerald-400" size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* CHECKLIST ITEMS */}
      <div className="grid grid-cols-1 gap-4">
        {tasks.map((item, idx) => (
          <div key={item.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6 hover:shadow-md transition-all group">
            <div className="flex items-center gap-6 w-full text-left">
               <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 font-black group-hover:bg-[#0a1e36] group-hover:text-white transition-all">
                  {idx + 1}
               </div>
               <div>
                 <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{item.category}</span>
                 <p className="font-bold text-[#0a1e36] text-base leading-tight">{item.task}</p>
               </div>
            </div>
            <div className="flex gap-4 bg-slate-50 p-2 rounded-[1.5rem] w-full lg:w-auto justify-center">
               {[1, 2, 3].map((num) => (
                 <button
                  key={num}
                  onClick={() => handleScoreChange(item.id, num)}
                  className={`w-14 h-14 rounded-2xl font-black transition-all ${
                    item.score === num 
                    ? (num === 1 ? 'bg-rose-500 text-white' : num === 2 ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white shadow-lg')
                    : 'bg-white text-slate-300'
                  }`}
                 >
                   {num}
                 </button>
               ))}
            </div>
          </div>
        ))}
      </div>

      {/* --- SECTION REKAPITULASI DI BAWAH --- */}
      <div className="bg-white p-8 md:p-10 rounded-[3.5rem] border-2 border-slate-50 shadow-sm space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
            <BarChart3 size={24} />
          </div>
          <h3 className="text-xl font-black text-[#0a1e36]">Rekapitulasi Perkembangan</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map(s => (
            <div key={s.name} className="p-6 rounded-[2.5rem] bg-slate-50 border border-slate-100 relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.name}</p>
                <div className="flex items-end gap-2 mb-4">
                  <h4 className="text-3xl font-black text-[#0a1e36]">{s.avg}</h4>
                  <span className="text-xs font-bold text-slate-400 pb-1">/ 3.0</span>
                </div>
                
                {/* Progress Bar Mini */}
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 transition-all duration-1000" 
                    style={{ width: `${(s.avg / 3) * 100}%` }}
                  ></div>
                </div>
                <p className="text-[9px] mt-2 font-bold text-slate-500 uppercase">
                  {s.totalFilled} dari {s.total} Task Terisi
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* PESAN MOTIVASI BERDASARKAN TOTAL */}
        <div className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-[2rem] border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm">
                 <Award className="text-orange-500" size={30} />
              </div>
              <div>
                <p className="font-bold text-[#0a1e36]">Analisa Tumbuh Kembang</p>
                <p className="text-xs text-slate-500 italic">"Terus dampingi si kecil dengan penuh kasih sayang, Bunda!"</p>
              </div>
           </div>
           <div className="flex gap-2">
              <div className="px-4 py-2 bg-white rounded-xl text-[10px] font-black text-indigo-600 border border-indigo-100 uppercase tracking-tighter">
                Kemandirian: {stats[0].avg >= 2.5 ? 'Sangat Baik' : 'Proses'}
              </div>
              <div className="px-4 py-2 bg-white rounded-xl text-[10px] font-black text-indigo-600 border border-indigo-100 uppercase tracking-tighter">
                Sosial: {stats[1].avg >= 2.5 ? 'Sangat Baik' : 'Proses'}
              </div>
           </div>
        </div>
      </div>

      {/* FLOATING SAVE BUTTON */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50 px-4">
        <button 
          onClick={handleSave}
          className="flex items-center gap-4 px-12 py-5 bg-[#0a1e36] text-white rounded-full font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all border-4 border-white"
        >
          <Save size={20} /> Simpan Data Ke Guru
        </button>
      </div>

    </div>
  );
};

export default ProgressOrtu;