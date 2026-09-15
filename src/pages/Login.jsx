// src/pages/Login.jsx
import React, { useState } from 'react';
import { Mail, Lock, GraduationCap, Monitor, Users, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
// Impor koneksi Supabase Cloud kita
import { supabase } from '../utils/supabaseClient';
import logoImg from '../assets/logo.png';

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  // State management
  const [selectedRole, setSelectedRole] = useState('ADMIN');
  const [idPengguna, setIdPengguna] = useState('');
  const [kataSandi, setKataSandi] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const roles = ['ADMIN', 'GURU', 'ORTU'];

  // --- SEED USER DATABASES FOR OFFLINE / FALLBACK LOGIN ---
  const LOCAL_SEED_USERS = [
    // ADMIN
    { id: 1, nama: 'Administrator SITKA', role: 'admin', nip: '00000000', password: 'admin123', token: 'SITKA_ADMIN' },

    // GURU
    { id: 2, nama: 'Sri Rahayu S.Pd', role: 'guru', nip: '12341234', password: '12341234', token: 'SITKA2026', kelompok: 'Kelompok A' },
    { id: 3, nama: 'Endah Rahmawati, S.Pd.', role: 'guru', nip: '12341', password: '12341', token: 'SITKA2026', kelompok: 'Kelompok A' },
    { id: 4, nama: 'Ahmad Hidayat, S.Pd.', role: 'guru', nip: '12342', password: '12342', token: 'SITKA2026', kelompok: 'Kelompok B' },

    // ORTU
    { id: 5, nama: 'GUSTI ARISANDI', role: 'ortu', nisn: '01', password: '12345', token: 'SITKA2026', nama_anak: 'ALBIYAN ABDUL AZIZ', kelompok: 'Kelompok A' },
    { id: 6, nama: 'NIA SURYANI', role: 'ortu', nisn: '3203526409', password: '12345', token: 'SITKA2026', nama_anak: 'ALFAN ELRAMDAN SUGANDI', kelompok: 'Kelompok A' },
    { id: 7, nama: 'FITRI INDRIYANI', role: 'ortu', nisn: '3217307882', password: '12345', token: 'SITKA2026', nama_anak: 'ALIFA ZAHRA FITRIANI', kelompok: 'Kelompok A' },
    { id: 8, nama: 'YUNI AGUSTINA', role: 'ortu', nisn: '3218940150', password: '12345', token: 'SITKA2026', nama_anak: 'ALUCARD ILANO KEN KOSWARA', kelompok: 'Kelompok A' },
    { id: 9, nama: 'NOVA SELIA HIDAYAT', role: 'ortu', nisn: '3209716523', password: '12345', token: 'SITKA2026', nama_anak: 'ANEESQA SYAREEFA AZZAHRA', kelompok: 'Kelompok A' },
    { id: 10, nama: 'ERINA PEGI MAULANA', role: 'ortu', nisn: '3209070782', password: '12345', token: 'SITKA2026', nama_anak: 'AQIELA NAYRA PUTRI RASIDIN', kelompok: 'Kelompok A' },
    { id: 11, nama: 'ARNI RIANI', role: 'ortu', nisn: '3209532660', password: '12345', token: 'SITKA2026', nama_anak: 'ARLAN PRABU WIJAYA', kelompok: 'Kelompok A' },
    { id: 12, nama: 'DEA NURUL OKTAVIANA', role: 'ortu', nisn: '3202406647', password: '12345', token: 'SITKA2026', nama_anak: 'ARUMI NASHARA ZETA', kelompok: 'Kelompok A' },
    { id: 13, nama: 'YUNI YULIAWATI', role: 'ortu', nisn: '3192331711', password: '12345', token: 'SITKA2026', nama_anak: 'AZZAM KHALIF PUTRA AHMAD', kelompok: 'Kelompok B' },
    { id: 14, nama: 'FERLIANTINI', role: 'ortu', nisn: '3209364636', password: '12345', token: 'SITKA2026', nama_anak: 'CHELYNE AGASSI MAUZA UMBARAN', kelompok: 'Kelompok A' },
    { id: 15, nama: 'ACI SUPRIYATI NINGSIH', role: 'ortu', nisn: '3215275264', password: '12345', token: 'SITKA2026', nama_anak: 'KAIFIYA HUMAIRAH ABIDAH', kelompok: 'Kelompok A' },
    { id: 16, nama: 'DHENNIESA RAI PUTRI DJATNIKA', role: 'ortu', nisn: '3205085517', password: '12345', token: 'SITKA2026', nama_anak: 'KHALISA SAFWANA', kelompok: 'Kelompok A' },
    { id: 17, nama: 'RINDY WARSONO', role: 'ortu', nisn: '3214032428', password: '12345', token: 'SITKA2026', nama_anak: 'LOVANDRA ALINA RACHMAN', kelompok: 'Kelompok A' },
    { id: 18, nama: 'HANI HASANAH', role: 'ortu', nisn: '3191764473', password: '12345', token: 'SITKA2026', nama_anak: 'MIRZA AL FARIDZI PRASETYO', kelompok: 'Kelompok B' },
    { id: 19, nama: 'INDAH PURNAMA SARI', role: 'ortu', nisn: '3192624309', password: '12345', token: 'SITKA2026', nama_anak: 'MOHAMMAD MAHAREKSA ADYAPUTRA', kelompok: 'Kelompok B' },
    { id: 20, nama: 'ATIM', role: 'ortu', nisn: '3203512276', password: '12345', token: 'SITKA2026', nama_anak: 'MUHAMAD RESKY AL - FATIH', kelompok: 'Kelompok A' },
    { id: 21, nama: 'NUNUR ISLAMIYAH', role: 'ortu', nisn: '3216094634', password: '12345', token: 'SITKA2026', nama_anak: 'MUHAMMAD ANDRE ALFIANSYAH', kelompok: 'Kelompok A' },
    { id: 22, nama: 'IDA ROSMIATI', role: 'ortu', nisn: '3193980747', password: '12345', token: 'SITKA2026', nama_anak: 'MUHAMMAD ARKHAN ARAFAH SIDIQ', kelompok: 'Kelompok B' },
    { id: 23, nama: 'NUNUR ISLAMIYAH', role: 'ortu', nisn: '3242455781', password: '12345', token: 'SITKA2026', nama_anak: 'MUHAMMAD ATHAR ALFIANSYAH', kelompok: 'Kelompok A' },
    { id: 24, nama: 'LIA AMELIA', role: 'ortu', nisn: '3185578761', password: '12345', token: 'SITKA2026', nama_anak: 'MUHAMMAD AZMI FADHIL', kelompok: 'Kelompok B' },
    { id: 25, nama: 'IRNA MARYANA', role: 'ortu', nisn: '3215183509', password: '12345', token: 'SITKA2026', nama_anak: 'NAFASYA KHALISA AZZAHRA', kelompok: 'Kelompok A' },
    { id: 26, nama: 'SAGI MURNI', role: 'ortu', nisn: '3228963203', password: '12345', token: 'SITKA2026', nama_anak: 'RADEN AHMAD ADZRIEL FERNANDI', kelompok: 'Kelompok A' },
    { id: 27, nama: 'CUCU SUMIATI', role: 'ortu', nisn: '3200787834', password: '12345', token: 'SITKA2026', nama_anak: 'SHAILA OKTAVIANI PUTRI', kelompok: 'Kelompok A' },
    { id: 28, nama: 'WINENGSIH', role: 'ortu', nisn: '3207048095', password: '12345', token: 'SITKA2026', nama_anak: 'SYAHIRA FAJRINA', kelompok: 'Kelompok A' },
    { id: 29, nama: 'PERNAWATI', role: 'ortu', nisn: '3214846245', password: '12345', token: 'SITKA2026', nama_anak: 'SYAKILLA HUMAIRA ARACELLI', kelompok: 'Kelompok A' },
    { id: 30, nama: 'RISTI NURIANTI', role: 'ortu', nisn: '3228524772', password: '12345', token: 'SITKA2026', nama_anak: 'UZAYR KHAIR AHMAD', kelompok: 'Kelompok A' },
  ];

  // --- LOGIKA VERIFIKASI LOGIN SUPABASE DENGAN FALLBACK OFFLINE ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const lowerRole = selectedRole.toLowerCase();
      const cleanId = idPengguna.trim();
      const cleanPass = kataSandi.trim();

      let userData = null;

      // 1. DAHULUKAN CEK CLOUD SUPABASE (JIKA NETWORK TERSEDIA)
      try {
        let query = supabase.from('users').select('*').eq('role', lowerRole);

        if (selectedRole === 'ADMIN') {
          query = query.or(`nip.eq.${cleanId},nama.eq.${cleanId}`).eq('password', cleanPass);
        } else if (selectedRole === 'GURU') {
          query = query.eq('nip', cleanId).eq('password', cleanPass);
        } else if (selectedRole === 'ORTU') {
          query = query.or(`nisn.eq.${cleanId},nama.eq.${cleanId}`).eq('password', cleanPass);
        }

        const { data: userList, error } = await query.limit(1);

        if (!error && userList && userList.length > 0) {
          userData = userList[0];
        }
      } catch (cloudErr) {
        console.warn("⚠️ Supabase Cloud unreachable/offline, switching to local seed database fallback:", cloudErr.message);
      }

      // 2. JIKA CLOUD TIDAK TERHUBUNG/UNREACHABLE ATAU USER TIDAK DITEMUKAN DI CLOUD,
      //    PERIKSA FALLBACK DATABASE LOKAL (SEED DATA)
      if (!userData) {
        const localMatch = LOCAL_SEED_USERS.find(u => {
          if (u.role !== lowerRole) return false;
          if (u.password !== cleanPass) return false;

          const searchId = cleanId.toLowerCase();
          if (lowerRole === 'admin') {
            return searchId === 'admin' || u.nip === cleanId || u.nama.toLowerCase() === searchId;
          } else if (lowerRole === 'guru') {
            return u.nip === cleanId || u.nama.toLowerCase() === searchId;
          } else if (lowerRole === 'ortu') {
            return u.nisn === cleanId || u.nama.toLowerCase() === searchId;
          }
          return false;
        });

        if (localMatch) {
          userData = localMatch;
        }
      }

      // 3. JIKA TETAP TIDAK DITEMUKAN SAMPAI AKHIR
      if (!userData) {
        throw new Error(`${selectedRole} dengan ID "${cleanId}" atau Kata Sandi tersebut tidak ditemukan!`);
      }

      // 4. JIKA SUKSES TEMBUS LOGIN
      localStorage.setItem('user_session', JSON.stringify(userData));
      onLoginSuccess(userData);

      alert(`✨ Selamat Datang, ${userData.nama}!`);
      navigate(`/${lowerRole === 'ortu' ? 'ortu' : lowerRole}/dashboard`);

    } catch (error) {
      alert(`🔴 LOGIN GAGAL: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">

      {/* SISI KIRI: BRANDING */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-gradient-to-br from-[#306896] via-[#285880] to-[#1a3d5c] relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-white max-w-md text-center md:text-left">
          <div className="mb-8 p-4 bg-white/10 backdrop-blur-md rounded-2xl inline-block shadow-lg">
            <GraduationCap size={56} className="text-white" />
          </div>

          <h2 className="text-4xl font-bold mb-6 leading-tight tracking-tight">
            Pantau Pembelajaran Jadi Lebih Mudah dengan SITKA.
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Monitor size={20} />
              </div>
              <p className="text-blue-100 italic font-medium">Monitoring Real-time Progress Siswa.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Users size={20} />
              </div>
              <p className="text-blue-100 italic font-medium">Kolaborasi antara Guru dan Orang Tua.</p>
            </div>
          </div>
        </div>
      </div>

      {/* SISI KANAN: FORM LOGIN */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20 bg-slate-50 md:bg-white">
        <div className="w-full max-w-[440px]">

          <div className="text-center md:text-left mb-10">
            {/* LOGO HEADER FORM TANPA CONTAINER BOX KAKU */}
            <div className="flex justify-center md:justify-start mb-6">
              <img 
                src={logoImg} 
                alt="Logo PAUD SITKA" 
                className="h-20 w-auto object-contain mix-blend-multiply filter drop-shadow-md transition-transform duration-300 hover:scale-105" 
              />
            </div>
            <h1 className="text-4xl font-black text-[#0a1e36] mb-2 tracking-tight">Masuk SITKA</h1>
            <p className="text-slate-400 font-medium">Selamat datang kembali! Silakan masuk ke akun Anda.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Pilihan Peran */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">
                PILIH PERAN
              </label>
              <div className="flex p-1 bg-slate-100 rounded-2xl gap-1 border border-slate-200">
                {roles.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`
                      flex-1 py-3 rounded-xl text-xs font-bold transition-all duration-300
                      ${selectedRole === role
                        ? 'bg-white text-[#306896] shadow-sm ring-1 ring-black/5 scale-[1.02]'
                        : 'text-slate-400 hover:text-[#0a1e36]'
                      }
                    `}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Input ID */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#306896] transition-colors">
                <Mail className="h-5 w-5" />
              </div>
              <input
                type="text"
                required
                value={idPengguna}
                onChange={(e) => setIdPengguna(e.target.value)}
                placeholder={selectedRole === 'GURU' ? "Nomor Induk Pegawai (NIP)" : selectedRole === 'ORTU' ? "NISN Siswa" : "ID Admin"}
                className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-md outline-none focus:border-[#306896] focus:ring-4 focus:ring-blue-50 transition-all shadow-sm"
              />
            </div>

            {/* Input Password */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#306896] transition-colors">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={kataSandi}
                onChange={(e) => setKataSandi(e.target.value)}
                placeholder="Kata Sandi"
                className="w-full pl-14 pr-14 py-4 bg-white border border-slate-200 rounded-2xl text-md outline-none focus:border-[#306896] focus:ring-4 focus:ring-blue-50 transition-all shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-[#306896] transition-colors focus:outline-none cursor-pointer"
                title={showPassword ? "Sembunyikan Password" : "Tampilkan Password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#306896] hover:bg-[#25547a] text-white font-bold py-4 rounded-2xl text-lg shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Memvalidasi Akun...' : 'Masuk Sekarang'}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-slate-400 text-xs font-bold tracking-wider uppercase">
              BELUM PUNYA AKUN?{' '}
              <Link to="/register" className="text-[#306896] hover:underline ml-1 font-black transition-all">
                DAFTAR DISINI
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;