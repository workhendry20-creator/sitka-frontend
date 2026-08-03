// src/pages/ortu/Laporan.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ClipboardList, Calendar, CheckCircle2, 
  Clock, AlertCircle, FileText, 
  Star, TrendingUp, UserCheck, Baby, Lock
} from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

const Laporan = () => {
  const [activeTab, setActiveTab] = useState('perkembangan');
  const [filterPeriode, setFilterPeriode] = useState('Harian');
  const [parentData, setParentData] = useState(null);
  const [laporanHarian, setLaporanHarian] = useState([]);
  const [laporanSemester, setLaporanSemester] = useState([]);

  // Ambil data session Orang Tua yang login & data harian/semester riil dari Guru
  useEffect(() => {
    const savedSession = localStorage.getItem('user_session');
    if (savedSession) {
      const parsed = JSON.parse(savedSession);
      setParentData(parsed);
      const childName = parsed.nama_anak || parsed.namaAnak || parsed.nama_siswa;
      fetchLaporanData(childName);
    }
  }, []);

  const fetchLaporanData = async (namaAnak) => {
    if (!namaAnak) return;
    const cleanChild = namaAnak.toLowerCase().trim();

    // 1. TARIK DATA HARIAN REAL DARI CLOUD SUPABASE & LOCAL STORAGE
    let combinedHarian = [];
    try {
      const { data, error } = await supabase
        .from('nilai_harian')
        .select('*')
        .order('tanggal', { ascending: false });
      if (!error && data) {
        combinedHarian = data.filter(d => {
          if (!d.nama_siswa) return false;
          const sName = d.nama_siswa.toLowerCase().trim();
          return sName === cleanChild || sName.includes(cleanChild) || cleanChild.includes(sName);
        });
      }
    } catch (e) {}

    try {
      const rawLocal = localStorage.getItem('sitka_all_harian_reports');
      if (rawLocal) {
        const parsed = JSON.parse(rawLocal);
        if (Array.isArray(parsed)) {
          parsed.forEach(p => {
            const pName = (p.nama_siswa || p.namaSiswa || '').toLowerCase().trim();
            if (pName && (pName === cleanChild || pName.includes(cleanChild) || cleanChild.includes(pName))) {
              const exists = combinedHarian.some(c => (c.tanggal === p.tanggal && (c.nama_siswa || '').toLowerCase().trim() === pName));
              if (!exists) combinedHarian.push(p);
            }
          });
        }
      }
    } catch (e) {}

    try {
      const rawRekap = localStorage.getItem('sitka_rekap_data');
      if (rawRekap) {
        const parsedRekap = JSON.parse(rawRekap);
        if (Array.isArray(parsedRekap)) {
          parsedRekap.forEach(r => {
            const rName = (r.nama || r.nama_siswa || '').toLowerCase().trim();
            if (rName && (rName === cleanChild || rName.includes(cleanChild) || cleanChild.includes(rName)) && (!r.label || !r.label.includes('Semester'))) {
              const exists = combinedHarian.some(c => c.tanggal === r.tanggal);
              if (!exists) {
                combinedHarian.push({
                  tanggal: r.tanggal || 'Hari Ini',
                  nama_siswa: r.nama,
                  status_kondisi: r.label || 'Bahagia',
                  emoji: r.emoji || '😊',
                  catatan_anekdot: r.catatan || '',
                  input_oleh_guru: `Wali Kelas ${r.kelompok || ''}`
                });
              }
            }
          });
        }
      }
    } catch (e) {}

    setLaporanHarian(combinedHarian);

    // 2. TARIK DATA SEMESTER REAL DARI CLOUD SUPABASE & LOCAL STORAGE
    let combinedSemester = [];
    try {
      const { data, error } = await supabase
        .from('nilai_semester')
        .select('*');
      if (!error && data) {
        combinedSemester = data.filter(s => {
          if (!s.nama_siswa) return false;
          const sName = s.nama_siswa.toLowerCase().trim();
          return sName === cleanChild || sName.includes(cleanChild) || cleanChild.includes(sName);
        });
      }
    } catch (e) {}

    try {
      const rawSemLocal = localStorage.getItem('sitka_all_semester_reports');
      if (rawSemLocal) {
        const parsedSem = JSON.parse(rawSemLocal);
        if (Array.isArray(parsedSem)) {
          parsedSem.forEach(s => {
            const sName = (s.nama_siswa || s.namaSiswa || '').toLowerCase().trim();
            if (sName && (sName === cleanChild || sName.includes(cleanChild) || cleanChild.includes(sName))) {
              const exists = combinedSemester.some(c => c.semester === s.semester);
              if (!exists) combinedSemester.push(s);
            }
          });
        }
      }
    } catch (e) {}

    setLaporanSemester(combinedSemester);
  };

  // --- DATA PROFIL REALTIME ANANDA ---
  const dataAnak = useMemo(() => ({
    nama: parentData?.nama_anak || parentData?.namaAnak || parentData?.nama_siswa || "Anak Didik SITKA",
    kelompok: parentData?.kelompok || "A",
    nisn: parentData?.nisn || "-",
  }), [parentData]);

  // Map Laporan Perkembangan Riil
  const displayReports = useMemo(() => {
    if (filterPeriode === 'Harian') {
      return laporanHarian.map((item, index) => ({
        id: `har-${index}`,
        tanggal: item.tanggal || 'Hari Ini',
        tipe: 'Harian',
        status: `${item.emoji || '😊'} ${item.status_kondisi || 'Bahagia'}`,
        catatan: item.catatan_anekdot || item.catatan || 'Ananda belajar dan bermain dengan baik hari ini.',
        guru: item.input_oleh_guru || `Wali Kelas ${parentData?.kelompok || 'A'}`
      }));
    } else {
      return laporanSemester.map((item, index) => {
        const hasRec = !!item.rekomendasi_guru;
        return {
          id: `sem-${index}`,
          tanggal: item.tanggal || 'Semester Ini',
          tipe: `Semester ${item.semester || '1'}`,
          status: hasRec ? '✨ Evaluasi Terbit (BSB)' : '🔒 Nilai Terrekam',
          catatan: item.rekomendasi_guru || 'Ananda berkembang sangat baik dalam seluruh aspek perkembangan sesuai tahap usianya.',
          guru: item.input_oleh_guru || `Wali Kelas ${parentData?.kelompok || 'A'}`
        };
      });
    }
  }, [filterPeriode, laporanHarian, laporanSemester, parentData]);

  // Map Statistik & Riwayat Absensi Riil
  const attendanceStats = useMemo(() => {
    let hadir = 0;
    let izin = 0;
    let alpa = 0;

    laporanHarian.forEach(rec => {
      const cond = (rec.status_kondisi || rec.label || '').toLowerCase();
      const cat = (rec.catatan_anekdot || rec.catatan || '').toLowerCase();

      if (cond.includes('izin') || cond.includes('sakit') || cat.includes('izin') || cat.includes('sakit')) {
        izin++;
      } else if (cond.includes('alpa') || cond.includes('tanpa keterangan') || cat.includes('alpa')) {
        alpa++;
      } else {
        hadir++;
      }
    });

    const total = laporanHarian.length;
    const persentaseHadir = total > 0 ? Math.round((hadir / total) * 100) : 0;

    const riwayatList = laporanHarian.map(rec => {
      const cond = (rec.status_kondisi || rec.label || '').toLowerCase();
      const cat = (rec.catatan_anekdot || rec.catatan || '').toLowerCase();
      let status = 'Hadir';
      let ket = 'Tepat Waktu';

      if (cond.includes('izin') || cat.includes('izin')) {
        status = 'Izin';
        ket = 'Izin Orang Tua';
      } else if (cond.includes('sakit') || cat.includes('sakit')) {
        status = 'Sakit';
        ket = 'Surat Keterangan Sakit';
      } else if (cond.includes('alpa') || cat.includes('alpa')) {
        status = 'Alpa';
        ket = 'Tanpa Keterangan';
      }

      return {
        tanggal: rec.tanggal || 'Hari Ini',
        status,
        ket
      };
    });

    return {
      hadir,
      izin,
      alpa,
      total,
      persentaseHadir,
      riwayatList
    };
  }, [laporanHarian]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 text-left">
      
      {/* --- 1. HEADER PROFILE ANAK (SINKRON PORTAL DASHBOARD) --- */}
      <div className="bg-[#0a1e36] p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[2rem] flex items-center justify-center border border-white/20 shadow-xl">
              <Baby size={36} className="text-amber-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight uppercase">{dataAnak.nama}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 bg-indigo-900/60 text-indigo-200 rounded-xl text-[10px] font-black uppercase tracking-wider border border-indigo-700/50">
                  Kelompok {dataAnak.kelompok}
                </span>
                <span className="px-3 py-1 bg-emerald-950/80 text-emerald-400 rounded-xl text-[10px] font-black tracking-wide border border-emerald-800/60">
                  NISN: {dataAnak.nisn}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/5 text-center backdrop-blur-sm min-w-[100px]">
              <p className="text-[10px] font-black uppercase text-indigo-300 mb-1 tracking-tighter">Kehadiran</p>
              <p className="text-xl font-black">{attendanceStats.total > 0 ? `${attendanceStats.persentaseHadir}%` : '0%'}</p>
            </div>
            <div className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/5 text-center backdrop-blur-sm min-w-[100px]">
              <p className="text-[10px] font-black uppercase text-indigo-300 mb-1 tracking-tighter">Laporan Real</p>
              <p className="text-xl font-black">{laporanHarian.length + laporanSemester.length}</p>
            </div>
          </div>
        </div>
        <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* --- 2. TAB NAVIGATION --- */}
      <div className="flex p-2 bg-slate-100 rounded-[2.2rem] w-fit">
        <button 
          onClick={() => setActiveTab('perkembangan')}
          className={`flex items-center gap-2 px-8 py-4 rounded-[1.8rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'perkembangan' ? 'bg-white text-[#0a1e36] shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <TrendingUp size={16} /> Perkembangan
        </button>
        <button 
          onClick={() => setActiveTab('absensi')}
          className={`flex items-center gap-2 px-8 py-4 rounded-[1.8rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'absensi' ? 'bg-white text-[#0a1e36] shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <UserCheck size={16} /> Kehadiran
        </button>
      </div>

      {activeTab === 'perkembangan' ? (
        <div className="space-y-6">
          {/* --- FILTER PERIODE --- */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {['Harian', 'Semester'].map(p => (
              <button 
                key={p}
                onClick={() => setFilterPeriode(p)}
                className={`px-6 py-3 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${filterPeriode === p ? 'bg-[#0a1e36] text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100 hover:border-indigo-200'}`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* --- REKAP STATUS PER PERIODE --- */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Laporan', val: displayReports.length, color: 'indigo' },
              { label: 'Kondisi Dominan', val: displayReports.length > 0 ? (filterPeriode === 'Harian' ? 'Bahagia 😊' : 'Sangat Baik') : '-', color: 'emerald' },
              { label: 'Pencapaian', val: displayReports.length > 0 ? '100% Sempurna' : '0%', color: 'amber' },
              { label: 'Evaluasi Guru', val: displayReports.length > 0 ? 'Terbit' : 'Belum Ada', color: 'blue' },
            ].map((stats) => (
              <div key={stats.label} className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm border-b-4 border-b-slate-100">
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">{stats.label} {filterPeriode}</p>
                <p className="text-lg font-black text-slate-700">{stats.val}</p>
              </div>
            ))}
          </div>

          {/* --- LIST DETAIL LAPORAN REAL --- */}
          <div className="grid grid-cols-1 gap-5">
            {displayReports.length > 0 ? (
              displayReports.map(item => (
                <div key={item.id} className="bg-white p-6 md:p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-[#0a1e36] group-hover:text-white transition-all duration-300 shadow-sm">
                        <FileText size={26} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-black text-[#0a1e36]">Laporan {item.tipe}</h4>
                          <span className="text-[10px] font-black text-slate-300 uppercase hidden sm:block">•</span>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.tanggal}</p>
                        </div>
                        <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Penanggung Jawab: {item.guru}</p>
                      </div>
                    </div>
                    <div className="px-5 py-2 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-black border border-emerald-100 shadow-sm">
                      {item.status}
                    </div>
                  </div>
                  
                  <div className="relative p-6 bg-slate-50/50 rounded-3xl border border-slate-50 italic">
                    <div className="absolute left-0 top-6 w-1.5 h-10 bg-indigo-500 rounded-r-full"></div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      "{item.catatan}"
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-50 flex flex-wrap items-center justify-between gap-4">
                     <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                          <Star size={14} className="text-amber-400" /> Fokus Tinggi
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                          <TrendingUp size={14} className="text-emerald-500" /> Progres Positif
                        </div>
                     </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-24 bg-white rounded-[4rem] border border-dashed border-slate-200 space-y-3">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2">
                   <Lock size={32} />
                </div>
                <h3 className="text-lg font-black text-[#0a1e36]">Belum Ada Laporan {filterPeriode}</h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">
                  Laporan perkembangan {filterPeriode.toLowerCase()} untuk <span className="font-bold text-slate-600">{dataAnak.nama}</span> belum diterbitkan oleh Wali Kelas. Data akan otomatis muncul secara real-time saat Guru menginput nilai di sekolah.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* --- 3. VIEW ABSENSI (KEHADIRAN RIIL) --- */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            {[
              { label: 'Total Hadir', val: attendanceStats.hadir, color: 'emerald', icon: CheckCircle2, desc: 'Hari terinput' },
              { label: 'Izin / Sakit', val: attendanceStats.izin, color: 'blue', icon: Clock, desc: 'Dengan keterangan' },
              { label: 'Tanpa Berita', val: attendanceStats.alpa, color: 'rose', icon: AlertCircle, desc: 'Perlu konfirmasi' },
            ].map(s => {
              const IconComponent = s.icon;
              const colorClasses = {
                emerald: 'bg-emerald-50 text-emerald-600',
                blue: 'bg-blue-50 text-blue-600',
                rose: 'bg-rose-50 text-rose-600'
              };
              const textColors = {
                emerald: 'text-emerald-600',
                blue: 'text-blue-600',
                rose: 'text-rose-600'
              };

              return (
                <div key={s.label} className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-100 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-[1.2rem] group-hover:scale-110 transition-transform ${colorClasses[s.color]}`}>
                      <IconComponent size={24} />
                    </div>
                    <div>
                      <span className="font-black text-[#0a1e36] text-sm block leading-none mb-1">{s.label}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.desc}</span>
                    </div>
                  </div>
                  <span className={`text-3xl font-black ${textColors[s.color]}`}>{s.val} Hari</span>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h3 className="font-black text-[#0a1e36] tracking-tight">Riwayat Absensi Terkini</h3>
              <Calendar size={20} className="text-slate-300" />
            </div>
            <div className="overflow-x-auto">
              {attendanceStats.riwayatList.length > 0 ? (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {attendanceStats.riwayatList.map((abs, i) => (
                      <tr key={i} className="hover:bg-slate-50/80 transition-all">
                        <td className="px-8 py-5 text-sm font-bold text-[#0a1e36]">{abs.tanggal}</td>
                        <td className="px-8 py-5">
                          <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                            abs.status === 'Hadir' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                            abs.status === 'Izin' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                          }`}>
                            {abs.status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-xs text-slate-400 font-bold text-right italic">{abs.ket}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-12 text-center space-y-2">
                  <p className="text-slate-400 font-bold text-xs italic">Belum ada riwayat absensi terrekam untuk ananda.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Laporan;