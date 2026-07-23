// src/pages/ortu/DashboardOrtu.jsx
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Star, Calendar, BookOpen, Megaphone, School, Baby } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

const DashboardOrtu = () => {
  // State untuk menampung pengumuman asli dari Supabase cloud
  const [announcements, setAnnouncements] = useState([]);
  const [loadingBroadcast, setLoadingBroadcast] = useState(true);
  
  // State untuk menampung data user login secara realtime
  const [parentData, setParentData] = useState(null);
  const [catatanHarian, setCatatanHarian] = useState([]);

  useEffect(() => {
    // 1. Ambil info pengumuman admin dari cloud
    fetchCloudAnnouncements();

    // 2. Ambil session user login untuk baca nama, nama_anak, dan kelompok
    const savedSession = localStorage.getItem('user_session');
    if (savedSession) {
      const parsedData = JSON.parse(savedSession);
      setParentData(parsedData);
      fetchCatatanAnekdot(parsedData.nama_anak);
    }
  }, []);

  const fetchCatatanAnekdot = async (namaAnak) => {
    try {
      if(!namaAnak) return;
      const { data, error } = await supabase
        .from('nilai_harian')
        .select('*')
        .eq('nama_siswa', namaAnak)
        .order('tanggal', { ascending: false })
        .limit(3);
      if (!error && data) {
        setCatatanHarian(data);
      }
    } catch (err) {
      console.error("Gagal menarik catatan harian ortu:", err);
    }
  };

  const fetchCloudAnnouncements = async () => {
    setLoadingBroadcast(true);
    try {
      const { data: cloudData, error } = await supabase
        .from('pengumuman')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(cloudData || []);
    } catch (err) {
      console.error("Gagal sinkronisasi pengumuman di dashboard ortu:", err.message);
    } finally {
      setLoadingBroadcast(false);
    }
  };

  // Helper pemformatan tanggal lokalisasi Indonesia agar serasi dengan sistem admin & guru
  const formatIndoDate = (isoString) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };


  const attendanceData = [
    { name: 'Hadir', value: 90 }, { name: 'Izin', value: 5 }, { name: 'Alpa', value: 5 },
  ];
  const COLORS = ['#306896', '#fbbf24', '#ef4444'];

  // Mengambil nama depan anak sebagai panggilan di label grafik
  const namaPanggilanAnak = parentData?.nama_anak ? parentData.nama_anak.split(' ')[0] : 'Anak';

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-left">
      
      {/* Welcome Card - Dinamis Mengikuti Data Input Registrasi */}
      <div className="bg-[#0a1e36] p-8 md:p-10 rounded-[3rem] text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black mb-2">Halo, {parentData?.nama || 'Bunda/Ayah'}! 👋</h2>
            <p className="text-blue-200 font-medium">
              Berikut adalah rangkuman perkembangan <span className="text-amber-400 font-bold">{parentData?.nama_anak || 'Anak Anda'}</span> minggu ini.
            </p>
          </div>
          
          {/* Badge Kelompok Belajar Anak */}
          <div className="flex flex-wrap gap-3">
            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
              <Baby size={20} className="text-amber-400" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Anak Didik</p>
                <p className="text-sm font-black text-white">{parentData?.nama_anak || '-'}</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
              <School size={20} className="text-blue-400" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Kelas</p>
                <p className="text-sm font-black text-white">{parentData?.kelompok || '-'}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-[-20px] top-[-20px] w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* --- SECTION INFO DARI ADMIN (REALTIME CLOUD) --- */}
      {!loadingBroadcast && announcements.length > 0 ? (
        <div className="bg-gradient-to-br from-orange-500 to-rose-500 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Megaphone size={28} className="animate-bounce" />
              <h3 className="text-xl font-black italic tracking-tight">Informasi Penting Sekolah</h3>
            </div>
            <div className="space-y-4">
              {announcements.slice(0, 1).map((info) => (
                <div key={info.id} className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/20 shadow-inner">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-2">
                    <h4 className="font-black text-2xl tracking-tight">📢 {info.title}</h4>
                    <span className="text-[10px] font-black bg-white/20 px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">
                      {formatIndoDate(info.created_at)}
                    </span>
                  </div>
                  <p className="text-orange-50 font-medium leading-relaxed italic text-lg opacity-90">
                    "{info.content}"
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-400/20 rounded-full blur-2xl"></div>
        </div>
      ) : (
        !loadingBroadcast && (
          <div className="bg-slate-100 p-8 rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
            <p className="text-slate-400 font-bold italic">Belum ada informasi baru dari sekolah hari ini.</p>
          </div>
        )
      )}

      <div className="flex flex-col md:flex-row justify-center gap-8">
        {/* Grafik Lingkaran (Kehadiran) */}
        <div className="w-full md:w-1/2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center">
          <h3 className="text-lg font-bold text-[#0a1e36] mb-4 flex items-center gap-2">
            <Calendar className="text-blue-600" size={20} /> Kehadiran Bulanan
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={attendanceData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {attendanceData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2">
            {attendanceData.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                <span className="text-xs font-bold text-slate-500">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Catatan Harian Terbaru (Buku Penghubung) */}
      <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-[#0a1e36] mb-6 flex items-center gap-2">
          <BookOpen className="text-indigo-600" size={20} /> Jurnal Cerdas & Catatan Harian
        </h3>
        
        {catatanHarian.length > 0 ? (
          <div className="space-y-4">
            {catatanHarian.map((catatan, i) => (
              <div key={i} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row md:items-start justify-between gap-6 hover:bg-white hover:shadow-md transition-all">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className={`text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest ${
                      ['Bahagia', 'Senang', 'Ceria'].includes(catatan.status_kondisi) ? 'bg-indigo-100 text-indigo-700' :
                      ['Tenang', 'Baik'].includes(catatan.status_kondisi) ? 'bg-emerald-100 text-emerald-700' :
                      ['Kreatif', 'Aktif'].includes(catatan.status_kondisi) ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {catatan.status_kondisi || 'Kondisi Baik'}
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Calendar size={14} />
                      <span className="text-[11px] font-bold font-mono">{catatan.tanggal}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed max-w-2xl italic">
                    "{catatan.catatan_anekdot || 'Ananda belajar dan bermain dengan baik hari ini.'}"
                  </p>
                </div>
                <div className="text-left md:text-right md:border-l border-slate-200 md:pl-6">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Dievaluasi Oleh</p>
                  <p className="text-sm font-black text-[#0a1e36]">{catatan.input_oleh_guru || 'Pendamping Pendidik'}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold text-sm italic">Opsi pemantauan harian akan muncul ketika Wali Kelas menerbitkan catatan untuk ananda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardOrtu;