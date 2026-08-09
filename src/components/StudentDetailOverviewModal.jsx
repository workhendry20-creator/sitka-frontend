// src/components/StudentDetailOverviewModal.jsx
import React, { useState } from 'react';
import {
  X, Eye, FileText, Sparkles, Award, TrendingUp, User, Baby, CheckCircle2, Lock, ChevronDown, ArrowUpRight
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList
} from 'recharts';

const StudentDetailOverviewModal = ({
  isOpen,
  onClose,
  student,
  radarData,
  studentSemesterChartData,
  comparativeRadarData,
  comparativeSemesterBarData,
  onPreviewReport,
  onDownloadPDFReport
}) => {
  if (!isOpen || !student) return null;

  const [viewMode, setViewMode] = useState('compare'); // 'single' | 'compare'

  const namaSiswa = student.namaSiswa || student.nama_siswa || "Siswa";
  const nisn = student.nisn || "-";
  const usiaTahun = student.usiaTahun || 5;
  const kelompok = student.kelompok || "Kelompok A";
  const hasSemester = !!student.hasSemester;
  const avgSemester = student.avgSemester || 0;
  const domainScores = student.domainScores || {};

  // Fallback data radar overlay jika belum dipasok
  const radarOverlayData = comparativeRadarData || [
    { domain: 'Gerak Kasar', sem1: 65, sem2: 85 },
    { domain: 'Gerak Halus', sem1: 60, sem2: 90 },
    { domain: 'Bicara & Bahasa', sem1: 70, sem2: 95 },
    { domain: 'Sosial & Kemandirian', sem1: 75, sem2: 100 }
  ];

  // Fallback data bar komparatif jika belum dipasok
  const barComparativeData = comparativeSemesterBarData || [
    { domain: 'Agama & Moral', sem1: 70, sem2: 90, delta: 20 },
    { domain: 'Motorik & Fisik', sem1: 65, sem2: 85, delta: 20 },
    { domain: 'Kognitif', sem1: 75, sem2: 95, delta: 20 },
    { domain: 'Bahasa & Sosial', sem1: 80, sem2: 100, delta: 20 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-300 text-left">

      {/* MODAL CONTAINER DENGAN ROUNDED PRESISI */}
      <div className="bg-white border border-slate-200 w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden relative">

        {/* MODAL HEADER */}
        <div className="p-6 md:px-8 bg-[#0a1e36] text-white flex items-center justify-between shrink-0 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-400/20 text-amber-300 rounded-2xl flex items-center justify-center font-black text-xl border border-amber-400/30 shadow-inner shrink-0">
              {namaSiswa.substring(0, 1).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-black text-lg text-white leading-tight">{namaSiswa}</h3>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full ${hasSemester ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                  {hasSemester ? `✨ ${avgSemester}% Capaian` : '🔒 Nilai Terrekam'}
                </span>
              </div>
              <p className="text-xs text-indigo-200 font-bold mt-0.5">
                NISN: {nisn} • Usia {usiaTahun} Thn • {kelompok} • {student.tahunAjaran || "T.A. 2025/2026"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white rounded-2xl transition-all"
            title="Tutup Detail"
          >
            <X size={20} />
          </button>
        </div>

        {/* MODAL BODY (SCROLLABLE CONTENT) */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-slate-50/50">

          {/* 1. CONTROL BAR: TOGGLE FILTER MODAL (1 SEMESTER vs 2 SEMESTER PERBANDINGAN) */}
          <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-black text-[#0a1e36] text-xs uppercase tracking-wider">Mode Tampilan Analitik</h4>
              <p className="text-[10px] text-slate-400 font-bold">Pilih antara 1 Semester Aktif atau 2 Semester (Perbandingan)</p>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setViewMode('single')}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl font-black text-xs transition-all ${viewMode === 'single' ? 'bg-[#0a1e36] text-amber-400 shadow-md' : 'text-slate-500 hover:text-slate-800'
                  }`}
              >
                1 Semester
              </button>
              <button
                type="button"
                onClick={() => setViewMode('compare')}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl font-black text-xs transition-all ${viewMode === 'compare' ? 'bg-[#0a1e36] text-amber-400 shadow-md' : 'text-slate-500 hover:text-slate-800'
                  }`}
              >
                2 Semester (Perbandingan)
              </button>
            </div>
          </div>

          {/* 2. GRAFIK SEMESTER VISUAL UTAMA & BREAKDOWN 4 ASPEK */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-5">
            <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider">
              <span className="text-[#0a1e36] flex items-center gap-2">
                <TrendingUp size={16} className="text-purple-600" /> Ringkasan Capaian Semester
              </span>
              <span className={hasSemester ? "text-purple-700 font-bold" : "text-slate-400 font-bold"}>
                {hasSemester ? `${avgSemester}% Rata-rata` : '0% (Belum Diisi)'}
              </span>
            </div>

            {/* ANIMATED PROGRESS BAR */}
            <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-0.5 shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${hasSemester
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600'
                  : 'bg-slate-300'
                  }`}
                style={{ width: `${hasSemester ? avgSemester : 0}%` }}
              ></div>
            </div>

            {/* BREAKDOWN 4 ASPEK PERKEMBANGAN */}
            {hasSemester ? (
              <div className="space-y-2.5 pt-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Capaian Riil 4 Aspek Perkembangan:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
                  {[
                    { label: '🌟 Agama & Moral', score: domainScores?.agamaScore },
                    { label: '🏃 Motorik & Fisik', score: domainScores?.motorikScore },
                    { label: '🧠 Kognitif', score: domainScores?.kognitifScore },
                    { label: '🗣️ Bahasa & Sosial', score: domainScores?.bahasaScore },
                  ].map(({ label, score }) => {
                    const pct = score ?? 0;
                    const colorBar = pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-400';
                    const colorText = pct >= 75 ? 'text-emerald-600' : pct >= 50 ? 'text-amber-600' : 'text-rose-500';
                    return (
                      <div key={label} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1.5">
                        <div className="flex justify-between text-slate-700 font-bold">
                          <span>{label}</span>
                          <span className={colorText}>{score !== null ? `${pct}%` : '—'}</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className={`${colorBar} h-full rounded-full transition-all duration-700`} style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                <p className="text-xs font-bold text-slate-400">🔒 Input nilai semester untuk melihat capaian 4 aspek perkembangan.</p>
              </div>
            )}
          </div>

          {/* 3. SECTION CHARTS (MODE 1 SEMESTER vs MODE 2 SEMESTER PERBANDINGAN) */}
          {viewMode === 'single' ? (
            /* --- TAMPILAN SINGLE SEMESTER --- */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* RADARCHART SINGLE SEMESTER */}
              <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm space-y-3 min-w-0 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={16} className="text-purple-600" /> Radar 4 Domain (Single)
                  </span>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                    Semester Aktif
                  </span>
                </div>

                <div className="h-72 w-full flex items-center justify-center min-w-0">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="#cbd5e1" />
                      <PolarAngleAxis dataKey="domain" tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                      <Radar name={namaSiswa} dataKey="skor" stroke="#8b5cf6" fill="#c4b5fd" fillOpacity={0.6} />
                      <Tooltip
                        formatter={(val) => [`${val}%`, 'Capaian Domain']}
                        contentStyle={{ backgroundColor: '#0a1e36', borderRadius: '16px', color: '#ffffff', border: '1px solid #1e293b', fontSize: '11px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}
                        itemStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                        labelStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* BARCHART SINGLE SEMESTER */}
              <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm space-y-3 min-w-0 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Award size={16} className="text-purple-600" /> Capaian Semester (Single)
                  </span>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${hasSemester
                    ? 'text-purple-700 bg-purple-50 border border-purple-100'
                    : 'text-slate-500 bg-slate-100'
                    }`}>
                    {hasSemester ? `✨ ${avgSemester}% Capaian` : '🔒 Belum Ada Nilai'}
                  </span>
                </div>

                <div className="h-72 w-full pt-2 relative min-w-0">
                  {!hasSemester && (
                    <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-[1px] rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-2 border border-dashed border-slate-200">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                        <Lock size={20} />
                      </div>
                      <h4 className="font-black text-slate-800 text-xs">Grafik Semester Masih Kosong</h4>
                      <p className="text-[10px] text-slate-400 max-w-xs">
                        Wali Kelas belum menginput nilai evaluasi semester untuk ananda.
                      </p>
                    </div>
                  )}

                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <BarChart data={studentSemesterChartData} margin={{ top: 20, right: 10, left: -25, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="domain" stroke="#475569" fontSize={9} fontWeight="bold" tickLine={false} interval={0} />
                      <YAxis stroke="#475569" fontSize={11} domain={[0, 100]} unit="%" tickLine={false} />
                      <Tooltip
                        formatter={(val, name, item) => [item.payload.label, 'Capaian Semester']}
                        contentStyle={{ backgroundColor: '#0a1e36', borderRadius: '16px', color: '#ffffff', border: '1px solid #1e293b', fontSize: '11px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}
                        itemStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                        labelStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="nilai" fill={hasSemester ? '#8b5cf6' : '#cbd5e1'} radius={[12, 12, 0, 0]}>
                        <LabelList dataKey="nilai" position="top" formatter={(v) => `${v}%`} fill="#6d28d9" fontSize={10} fontWeight="bold" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            /* --- TAMPILAN 2 SEMESTER PERBANDINGAN --- */
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* OVERLAY RADARCHART */}
                <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm space-y-3 min-w-0 flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={16} className="text-indigo-600" /> Overlay Radar Komparasi
                    </span>
                    <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                      (S1 vs S2)
                    </span>
                  </div>

                  <div className="h-72 w-full flex items-center justify-center min-w-0">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarOverlayData}>
                        <PolarGrid stroke="#cbd5e1" />
                        <PolarAngleAxis dataKey="domain" tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                        <Radar name="Semester 1 (Ganjil)" dataKey="sem1" stroke="#6366f1" fill="#818cf8" fillOpacity={0.35} />
                        <Radar name="Semester 2 (Genap)" dataKey="sem2" stroke="#10b981" fill="#34d399" fillOpacity={0.55} />
                        <Tooltip
                          formatter={(val, name) => [`${val}%`, name]}
                          contentStyle={{ backgroundColor: '#0a1e36', borderRadius: '16px', color: '#ffffff', border: '1px solid #1e293b', fontSize: '11px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}
                          itemStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                          labelStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px', fontWeight: 'bold' }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* GROUPED BARCHART */}
                <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm space-y-3 min-w-0 flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Award size={16} className="text-emerald-600" /> Perbandingan Batang Capaian
                    </span>
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                      (S1 vs S2)
                    </span>
                  </div>

                  <div className="h-72 w-full pt-2 relative min-w-0">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <BarChart data={barComparativeData} margin={{ top: 20, right: 10, left: -25, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="domain" stroke="#475569" fontSize={9} fontWeight="bold" tickLine={false} interval={0} />
                        <YAxis stroke="#475569" fontSize={11} domain={[0, 100]} unit="%" tickLine={false} />
                        <Tooltip
                          formatter={(val, name) => [`${val}%`, name]}
                          contentStyle={{ backgroundColor: '#0a1e36', borderRadius: '16px', color: '#ffffff', border: '1px solid #1e293b', fontSize: '11px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}
                          itemStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                          labelStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                        />
                        <Bar dataKey="sem1" name="Semester 1 (Ganjil)" fill="#6366f1" radius={[8, 8, 0, 0]}>
                          <LabelList dataKey="sem1" position="top" formatter={(v) => `${v}%`} fill="#4338ca" fontSize={9} fontWeight="bold" />
                        </Bar>
                        <Bar dataKey="sem2" name="Semester 2 (Genap)" fill="#10b981" radius={[8, 8, 0, 0]}>
                          <LabelList dataKey="sem2" position="top" formatter={(v) => `${v}%`} fill="#047857" fontSize={9} fontWeight="bold" />
                        </Bar>
                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px', fontWeight: 'bold' }} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* KARTU DELTA PERTUMBUHAN SISWA ANTAR SEMESTER */}
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-[#0a1e36] text-sm">📈 Analisis Pertumbuhan Delta (%) Antar Semester</h4>
                    <p className="text-[10px] text-slate-400 font-bold">Kenaikan persentase indikator perkembangan dari Semester 1 ke Semester 2.</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-black text-xs flex items-center gap-1">
                    <ArrowUpRight size={14} /> Positif
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {barComparativeData.map((item) => {
                    const deltaVal = item.delta !== undefined ? item.delta : (item.sem2 - item.sem1);
                    return (
                      <div key={item.domain} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 block truncate">{item.domain}</span>
                        <div className="flex items-baseline justify-between">
                          <span className="text-sm font-black text-slate-700">{item.sem1}% → {item.sem2}%</span>
                          <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
                            +{deltaVal}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* 4. INFORMASI STATUS ORTU & REKOMENDASI */}
          <div className="bg-[#0a1e36] text-white p-6 rounded-[2rem] border border-white/10 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider">Status Laporan Orang Tua & Catatan Guru</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${student.statusOrtu === 'Sudah Mengisi' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                {student.statusOrtu === 'Sudah Mengisi' ? '✅ Laporan Ortu Terisi' : '⚠️ Ortu Belum Mengisi'}
              </span>
            </div>

            {student.catatanOrtu && student.catatanOrtu !== '-' && (
              <div className="p-4 bg-white/10 rounded-2xl border border-white/10 text-xs italic text-amber-200">
                <span className="font-bold not-italic text-amber-300 block mb-1">🏡 Catatan / Momen Unik dari Orang Tua:</span>
                "{student.catatanOrtu}"
              </div>
            )}

            {student.semesterRekomendasi && (
              <div className="p-4 bg-white/10 rounded-2xl border border-white/10 text-xs italic text-indigo-200">
                <span className="font-bold not-italic text-indigo-300 block mb-1">🎓 Rekomendasi Evaluasi Semester Guru:</span>
                "{student.semesterRekomendasi}"
              </div>
            )}
          </div>

        </div>

        {/* MODAL FOOTER WITH ACTIONS */}
        <div className="p-5 md:px-8 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <span className="text-xs font-bold text-slate-500 hidden sm:inline">
            📄 Komparasi Detail Semester Siswa - SPS FLAMBOYAN
          </span>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-[#0a1e36] hover:bg-indigo-900 text-amber-400 rounded-2xl font-bold text-xs transition-all cursor-pointer shadow-sm"
            >
              Tutup Detail
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDetailOverviewModal;
