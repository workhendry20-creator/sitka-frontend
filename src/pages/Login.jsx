// src/pages/Login.jsx
import React, { useState } from 'react';
import { Mail, Lock, GraduationCap, Monitor, Users, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
// Impor koneksi Supabase Cloud kita
import { supabase } from '../utils/supabaseClient';

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  
  // State management
  const [selectedRole, setSelectedRole] = useState('ADMIN');
  const [idPengguna, setIdPengguna] = useState('');
  const [kataSandi, setKataSandi] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const roles = ['ADMIN', 'GURU', 'ORTU'];

  // --- LOGIKA VERIFIKASI LOGIN SUPABASE ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const lowerRole = selectedRole.toLowerCase();

      // 1. PENANGANAN LOGIN KHUSUS ADMIN (Bypass Sementara jika data admin belum di DB)
      if (selectedRole === 'ADMIN') {
        if (idPengguna === 'admin' && kataSandi === 'admin123') {
          const adminSession = { nama: 'Administrator SITKA', role: 'admin' };
          localStorage.setItem('user_session', JSON.stringify(adminSession));
          onLoginSuccess(adminSession);
          navigate('/admin/dashboard');
          return;
        } else {
          // Coba cari di database jika ada tabel admin khusus nantinya
          const { data: adminData, error: adminErr } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'admin')
            .eq('nama', idPengguna)
            .eq('password', kataSandi)
            .single();

          if (adminErr || !adminData) throw new Error('Kredensial Admin tidak valid, Senior!');
          
          localStorage.setItem('user_session', JSON.stringify(adminData));
          onLoginSuccess(adminData);
          navigate('/admin/dashboard');
          return;
        }
      }

      // 2. LOGIKA VALIDASI UNTUK GURU & ORANG TUA
      let query = supabase.from('users').select('*').eq('role', lowerRole);

      if (selectedRole === 'GURU') {
        // Cari baris data berdasarkan NIP dan Password
        query = query.eq('nip', idPengguna).eq('password', kataSandi);
      } else if (selectedRole === 'ORTU') {
        // Cari baris data berdasarkan NISN dan Password
        query = query.eq('nisn', idPengguna).eq('password', kataSandi);
      }

      const { data: userData, error } = await query.maybeSingle();

      if (error) throw error;

      // 3. JIKA AKUN TIDAK DITEMUKAN
      if (!userData) {
        throw new Error(`${selectedRole} dengan ID atau Kata Sandi tersebut tidak ditemukan di Cloud!`);
      }

      // 4. JIKA SUKSES TEMBUS LOGIN
      // Simpan session lengkap di storage lokal browser biar kalau direfresh ga logout otomatis
      localStorage.setItem('user_session', JSON.stringify(userData));
      
      // Kirim data user ke state pusat di App.jsx
      onLoginSuccess(userData);

      // Lempar user ke Dashboard masing-masing sesuai role
      alert(`✨ Selamat Datang, ${userData.nama}!`);
      
      // Mengarahkan ke route yang sesuai dengan arsitektur web Senior
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
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-[#306896] relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-white max-w-md">
          <div className="mb-8 p-4 bg-white/10 backdrop-blur-md rounded-2xl inline-block">
            <GraduationCap size={64} className="text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Pantau Pembelajaran Jadi Lebih Mudah dengan SITKA.
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Monitor size={20} />
              </div>
              <p className="text-blue-100 italic">Monitoring Real-time Progress Siswa.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Users size={20} />
              </div>
              <p className="text-blue-100 italic">Kolaborasi antara Guru dan Orang Tua.</p>
            </div>
          </div>
        </div>
      </div>

      {/* SISI KANAN: FORM LOGIN */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20 bg-slate-50 md:bg-white">
        <div className="w-full max-w-[440px]">
          
          <div className="text-center md:text-left mb-10">
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
                placeholder={selectedRole === 'GURU' ? "Nomor Induk Pegawai (NIP)" : selectedRole === 'ORTU' ? "NISN Siswa" : "ID Pengguna Admin"}
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