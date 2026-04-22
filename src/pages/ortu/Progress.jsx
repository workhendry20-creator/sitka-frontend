// src/pages/ortu/Progress.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Save, Star, Heart, 
  BrainCircuit, ShieldCheck, MessageCircle,
  History, CheckCircle2, ArrowRight
} from 'lucide-react';
import Swal from 'sweetalert2';

const ProgressOrtu = () => {
  const navigate = useNavigate();
  const [catatan, setCatatan] = useState("");
  const [lastSaved, setLastSaved] = useState(null); // State untuk rekap
  
  const [tasks, setTasks] = useState([
    { id: 1, category: "Kemandirian", task: "Memakai baju sendiri", score: 0 },
    { id: 2, category: "Kemandirian", task: "Makan tanpa disuapi", score: 0 },
    { id: 3, category: "Sosial", task: "Berbagi mainan", score: 0 },
    { id: 4, category: "Sosial", task: "Merapikan mainan", score: 0 },
    { id: 5, category: "Kognitif", task: "Menghafal doa pendek", score: 0 },
  ]);

  // Cek apakah ada data tersimpan saat pertama kali load
  useEffect(() => {
    const saved = localStorage.getItem('sitka_progress_data');
    if (saved) setLastSaved(JSON.parse(saved));
  }, []);

  const handleScore = (id, score) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, score } : t));
  };

  const handleSave = () => {
    const belumIsi = tasks.some(t => t.score === 0);
    if (belumIsi) {
      return Swal.fire({
        icon: 'error',
        title: 'Belum Lengkap!',
        text: 'Bunda, masih ada poin yang belum dinilai nih.',
        confirmButtonColor: '#306896'
      });
    }

    const totalPoin = tasks.reduce((acc, curr) => acc + curr.score, 0);
    const maxPoin = tasks.length * 3;
    const persentase = Math.round((totalPoin / maxPoin) * 100);

    const progressData = {
      namaSiswa: "Aditya Pratama",
      totalSkor: persentase,
      tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      catatan: catatan,
      items: tasks
    };

    localStorage.setItem('sitka_progress_data', JSON.stringify(progressData));
    setLastSaved(progressData); // Update rekap di bawah secara instan

    Swal.fire({
      icon: 'success',
      title: 'Berhasil Dikirim!',
      text: 'Laporan perkembangan Aditya sudah diterima Guru.',
      confirmButtonColor: '#306896',
      timer: 2000
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32 animate-in fade-in duration-700">
      
      {/* HEADER */}
      <div className="flex items-center justify-between px-2">
        <button 
          onClick={() => navigate('/ortu/dashboard')}
          className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-500 hover:text-rose-500 hover:bg-rose-50 transition-all shadow-sm"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-black text-[#0a1e36] italic uppercase tracking-widest">Penilaian Anak</h2>
        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
          <Star size={20} className="fill-indigo-600" />
        </div>
      </div>

      {/* INSTRUCTION */}
      <div className="bg-[#0a1e36] p-10 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl font-black mb-2 tracking-tight">Laporan Mingguan 📝</h3>
          <p className="text-blue-100 text-sm opacity-80 leading-relaxed font-medium">
            Yuk Bun, isi perkembangan kemandirian si kecil minggu ini. Guru akan memantau dari sekolah ya!
          </p>
        </div>
        <div className="absolute right-[-30px] bottom-[-30px] w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* TASK LIST */}
      <div className="space-y-4">
        {tasks.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-indigo-100 hover:shadow-md">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                {item.category === "Kemandirian" && <ShieldCheck size={24} />}
                {item.category === "Sosial" && <Heart size={24} />}
                {item.category === "Kognitif" && <BrainCircuit size={24} />}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{item.category}</p>
                <h4 className="font-bold text-[#0a1e36] text-sm md:text-base">{item.task}</h4>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-100/50 p-2 rounded-2xl border border-slate-50 self-end md:self-center">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => handleScore(item.id, num)}
                  className={`w-12 h-10 rounded-xl font-black text-xs transition-all ${
                    item.score === num 
                    ? (num === 1 ? 'bg-rose-500 text-white shadow-lg' : num === 2 ? 'bg-amber-500 text-white shadow-lg' : 'bg-emerald-500 text-white shadow-lg')
                    : 'bg-white text-slate-400'
                  }`}
                >
                  {num === 1 ? 'Kurang' : num === 2 ? 'Cukup' : 'Baik'}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* INPUT CATATAN */}
      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-4">
        <label className="flex items-center gap-2 font-black text-[#0a1e36] uppercase text-[10px] tracking-widest">
          <MessageCircle size={16} className="text-indigo-600" /> Catatan untuk Bunda & Guru
        </label>
        <textarea 
          placeholder="Contoh: Aditya sudah mau berbagi mainan sama adiknya..."
          className="w-full p-6 bg-slate-50 rounded-[2rem] border-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium italic"
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
        ></textarea>
      </div>

      <button 
        onClick={handleSave}
        className="w-full py-6 bg-indigo-600 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-3"
      >
        <Save size={18} /> Simpan Laporan
      </button>

      {/* --- REKAPITULASI TERAKHIR (DIPERBAIKI) --- */}
      {lastSaved && (
        <div className="mt-12 bg-emerald-50 border-2 border-emerald-100 p-8 rounded-[3rem] space-y-6 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h3 className="font-black text-emerald-900 uppercase text-xs tracking-widest">Laporan Terakhir</h3>
                <p className="text-[10px] font-bold text-emerald-600 italic">Terkirim: {lastSaved.tanggal}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-emerald-600 italic">{lastSaved.totalSkor}%</span>
              <p className="text-[8px] font-black text-emerald-400 uppercase">Tingkat Kemandirian</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {lastSaved.items.map((it, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-emerald-100 flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500 truncate mr-2">{it.task}</span>
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${
                  it.score === 3 ? 'bg-emerald-100 text-emerald-600' : it.score === 2 ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                }`}>
                  {it.score}
                </span>
              </div>
            ))}
          </div>

          {lastSaved.catatan && (
            <div className="bg-white/50 p-4 rounded-2xl border border-dashed border-emerald-200">
              <p className="text-[9px] font-black text-emerald-400 uppercase mb-1">Catatan Bunda:</p>
              <p className="text-xs italic text-slate-600">"{lastSaved.catatan}"</p>
            </div>
          )}

          <div className="text-center pt-2">
            <button 
              onClick={() => navigate('/ortu/dashboard')}
              className="text-[10px] font-black text-emerald-600 uppercase flex items-center justify-center gap-2 w-full hover:gap-4 transition-all"
            >
              Kembali ke Dashboard <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressOrtu;