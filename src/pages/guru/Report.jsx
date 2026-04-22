// src/pages/ortu/Progress.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import navigate
import { 
  ChevronLeft, Save, Star, Heart, 
  BrainCircuit, ShieldCheck, MessageCircle 
} from 'lucide-react';
import Swal from 'sweetalert2';

const ProgressOrtu = () => {
  const navigate = useNavigate(); // Inisialisasi navigate
  const [catatan, setCatatan] = useState("");
  
  // Data list tugas yang harus diceklis
  const [tasks, setTasks] = useState([
    { id: 1, category: "Kemandirian", task: "Memakai baju sendiri", score: 0 },
    { id: 2, category: "Kemandirian", task: "Makan tanpa disuapi", score: 0 },
    { id: 3, category: "Sosial", task: "Berbagi mainan", score: 0 },
    { id: 4, category: "Sosial", task: "Merapikan mainan", score: 0 },
    { id: 5, category: "Kognitif", task: "Menghafal doa pendek", score: 0 },
  ]);

  const handleScore = (id, score) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, score } : t));
  };

  const handleSave = () => {
    // Validasi: Pastikan semua sudah diisi
    const belumIsi = tasks.some(t => t.score === 0);
    if (belumIsi) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Mohon isi semua penilaian sebelum mengirim!',
        confirmButtonColor: '#306896'
      });
    }

    // Kalkulasi skor total dalam persen
    const totalPoin = tasks.reduce((acc, curr) => acc + curr.score, 0);
    const maxPoin = tasks.length * 3;
    const persentase = Math.round((totalPoin / maxPoin) * 100);

    // BENTUK DATA YANG DISESUAIKAN UNTUK GURU
    const progressData = {
      namaSiswa: "Aditya Pratama", // Sesuai dengan dashboard ortu
      totalSkor: persentase,
      tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      catatan: catatan,
      items: tasks // Mengirim detail item (score, task, category)
    };

    // SIMPAN KE LOCALSTORAGE (Database Realtime)
    localStorage.setItem('sitka_progress_data', JSON.stringify(progressData));

    Swal.fire({
      icon: 'success',
      title: 'Laporan Terkirim!',
      text: 'Bunda berhasil mengirim perkembangan Aditya hari ini ke Guru.',
      confirmButtonColor: '#306896'
    }).then(() => {
      navigate('/ortu/dashboard'); // Otomatis balik ke dashboard setelah sukses
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER & TOMBOL KELUAR */}
      <div className="flex items-center justify-between px-2">
        <button 
          onClick={() => navigate('/ortu/dashboard')} // FUNGSI KELUAR AKTIF
          className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-500 hover:text-rose-500 hover:bg-rose-50 transition-all shadow-sm"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-black text-[#0a1e36] italic uppercase tracking-widest">Input Progress</h2>
        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
          <Star size={20} className="fill-indigo-600" />
        </div>
      </div>

      {/* INSTRUCTION CARD */}
      <div className="bg-[#0a1e36] p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl font-black mb-2">Halo, Bunda! 👋</h3>
          <p className="text-blue-100 text-sm opacity-80 leading-relaxed">
            Berikan penilaian sejujur mungkin ya Bun, agar kami bisa membantu mengoptimalkan tumbuh kembang si kecil.
          </p>
        </div>
        <Heart className="absolute right-[-20px] top-[-20px] w-48 h-48 text-rose-500/20 rotate-12" />
      </div>

      {/* TASK LIST */}
      <div className="space-y-4">
        {tasks.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-indigo-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600">
                {item.category === "Kemandirian" && <ShieldCheck size={24} />}
                {item.category === "Sosial" && <Heart size={24} />}
                {item.category === "Kognitif" && <BrainCircuit size={24} />}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.category}</p>
                <h4 className="font-bold text-[#0a1e36]">{item.task}</h4>
              </div>
            </div>

            {/* SCORING BUTTONS (1, 2, 3) */}
            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100 self-end md:self-center">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => handleScore(item.id, num)}
                  className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${
                    item.score === num 
                    ? (num === 1 ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' : num === 2 ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' : 'bg-emerald-500 text-white shadow-lg shadow-emerald-200')
                    : 'bg-white text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CATATAN TAMBAHAN */}
      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-4">
        <label className="flex items-center gap-2 font-black text-[#0a1e36] uppercase text-xs tracking-widest">
          <MessageCircle size={16} /> Catatan untuk Guru (Opsional)
        </label>
        <textarea 
          rows="4" 
          placeholder="Ceritakan kejadian menarik atau kendala si kecil di rumah..."
          className="w-full p-6 bg-slate-50 rounded-[2rem] border-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium italic"
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
        ></textarea>
      </div>

      {/* SUBMIT BUTTON */}
      <button 
        onClick={handleSave}
        className="w-full py-6 bg-indigo-600 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-3"
      >
        <Save size={18} /> Simpan & Kirim ke Guru
      </button>

    </div>
  );
};

export default ProgressOrtu;