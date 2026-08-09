import React, { useState } from 'react';
import { User, Fingerprint, KeyRound, Hash, Lock, ChevronLeft, Baby, School, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

// Komponen Input Reusable (dengan Dukungan Hide/Unhide Password)
const InputField = ({ icon: Icon, placeholder, name, type = "text", value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
      </div>
      <input
        type={inputType}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-16 ${isPassword ? 'pr-14' : 'pr-6'} py-4 border border-gray-100 bg-slate-50 rounded-2xl text-lg placeholder:text-slate-400 focus:border-[#306896] focus:ring-1 focus:ring-[#306896] outline-none transition`}
        required
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-6 flex items-center text-slate-400 hover:text-[#306896] transition-colors focus:outline-none cursor-pointer"
          title={showPassword ? "Sembunyikan Password" : "Tampilkan Password"}
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      )}
    </div>
  );
};

const Register = () => {
  const [selectedRole, setSelectedRole] = useState('GURU');
  const [loading, setLoading] = useState(false);

  // State manajemen form terpusat
  const [formData, setFormData] = useState({
    namaLengkap: '',
    nip: '',
    token: '',
    nisn: '',
    namaAnak: '',
    kelompok: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Konfirmasi Kata Sandi tidak cocok dengan Password Baru!');
      }

      // 1. Siapkan payload data dasar
      let payload = {
        nama: formData.namaLengkap,
        password: formData.password,
        role: selectedRole.toLowerCase() 
      };

      // 2. Pemilahan Input Berdasarkan Kategori Akun
      if (selectedRole === 'GURU') {
        if (!formData.nip) throw new Error('NIP wajib diisi, Senior!');
        if (!formData.token) throw new Error('Aktivasi Token wajib diisi, Senior!');
        
        payload.nip = formData.nip;
        payload.token = formData.token;
        payload.nisn = null; 
        payload.nama_anak = null;
        payload.kelompok = null;
      } else {
        if (!formData.nisn) throw new Error('NISN wajib diisi!');
        if (!formData.namaAnak) throw new Error('Nama Anak wajib diisi!');
        if (!formData.kelompok) throw new Error('Kelompok Belajar wajib diisi!');
        
        payload.nisn = formData.nisn;
        payload.nama_anak = formData.namaAnak;
        payload.kelompok = formData.kelompok;
        payload.nip = null;   
        payload.token = null; 
      }

      // 3. Tembak data langsung ke tabel 'users' di Cloud Supabase
      const { data, error } = await supabase
        .from('users')
        .insert([payload]);

      if (error) throw error;

      // 4. Notifikasi Berhasil Premium
      alert(`✨ Barakallah, Registrasi Berhasil!\n\nAkun ${selectedRole === 'GURU' ? 'Guru' : 'Orang Tua'} atas nama "${formData.namaLengkap}" kini telah aktif dan terdaftar dengan aman di dalam sistem SITKA Cloud. Silakan kembali ke halaman login untuk masuk ke dashboard, Senior! 🫡🚀`);
      
      // Reset isian formulir
      setFormData({
        namaLengkap: '',
        nip: '',
        token: '',
        nisn: '',
        namaAnak: '',
        kelompok: '',
        password: '',
        confirmPassword: '',
      });

    } catch (error) {
      alert(`🔴 INTEGRASI GAGAL: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-14 rounded-[3rem] shadow-xl w-full max-w-2xl border border-gray-100 relative overflow-hidden">
        
        {/* Tombol Kembali */}
        <Link 
          to="/" 
          className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-[#306896] transition font-bold text-xs tracking-widest uppercase"
        >
          <ChevronLeft className="h-4 w-4" />
          KEMBALI KE LOGIN
        </Link>

        {/* Header Title */}
        <div className="text-center mt-12 mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0a1e36] tracking-tight mb-3">
            Daftar Akun
          </h1>
          <p className="text-sm font-bold text-slate-400 tracking-widest uppercase">
            SILAKAN LENGKAPI DATA AUTENTIKASI
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-8">
          
          {/* Tab Selector Peran */}
          <div className="bg-slate-50 p-2 rounded-full border border-gray-100 grid grid-cols-2 gap-2 shadow-inner">
            <button
              type="button"
              onClick={() => setSelectedRole('GURU')}
              className={`py-3 px-5 rounded-full text-sm font-bold tracking-wider transition-all duration-300 flex items-center justify-center gap-2
                ${selectedRole === 'GURU' ? 'bg-white text-[#306896] shadow-md' : 'text-slate-400 hover:text-gray-800'}
              `}
            >
              <Fingerprint className={`h-4 w-4 ${selectedRole === 'GURU' ? 'opacity-100' : 'opacity-50'}`} />
              SEBAGAI GURU
            </button>
            
            <button
              type="button"
              onClick={() => setSelectedRole('ORTU')}
              className={`py-3 px-5 rounded-full text-sm font-bold tracking-wider transition-all duration-300 flex items-center justify-center gap-2
                ${selectedRole === 'ORTU' ? 'bg-white text-[#306896] shadow-md' : 'text-slate-400 hover:text-gray-800'}
              `}
            >
              <User className={`h-4 w-4 ${selectedRole === 'ORTU' ? 'opacity-100' : 'opacity-50'}`} />
              SEBAGAI ORANG TUA
            </button>
          </div>

          {/* Kolom Form Input */}
          <div className="space-y-6">
            <InputField 
              icon={User} 
              name="namaLengkap"
              value={formData.namaLengkap}
              onChange={handleInputChange}
              placeholder={selectedRole === 'GURU' ? "Nama Lengkap Guru" : "Nama Lengkap Wali / Orang Tua"} 
            />

            {selectedRole === 'GURU' ? (
              <>
                <InputField 
                  icon={Fingerprint} 
                  name="nip"
                  value={formData.nip}
                  onChange={handleInputChange}
                  placeholder="Nomor Induk Pegawai (NIP)" 
                />
                <InputField 
                  icon={KeyRound} 
                  name="token"
                  value={formData.token}
                  onChange={handleInputChange}
                  placeholder="Aktivasi Token (Secure)" 
                />
              </>
            ) : (
              <>
                <InputField 
                  icon={Hash} 
                  name="nisn"
                  value={formData.nisn}
                  onChange={handleInputChange}
                  placeholder="NISN Siswa" 
                />
                
                {/* INPUT KHUSUS ORTU: NAMA ANAK */}
                <InputField 
                  icon={Baby} 
                  name="namaAnak"
                  value={formData.namaAnak}
                  onChange={handleInputChange}
                  placeholder="Nama Lengkap Anak" 
                />
                
                {/* INPUT DROPDOWN KHUSUS ORTU: HANYA DUA PILIHAN (A & B) */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <School className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
                  </div>
                  <select
                    name="kelompok"
                    value={formData.kelompok}
                    onChange={handleInputChange}
                    className="w-full pl-16 pr-12 py-4 border border-gray-100 bg-slate-50 rounded-2xl text-lg text-slate-700 outline-none focus:border-[#306896] focus:ring-1 focus:ring-[#306896] transition appearance-none cursor-pointer font-medium"
                    required
                  >
                    <option value="" disabled className="text-slate-400">Pilih Kelompok Belajar Anak</option>
                    <option value="Kelompok A">Kelompok A</option>
                    <option value="Kelompok B">Kelompok B</option>
                  </select>
                  {/* Panah Custom Estetik */}
                  <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none text-slate-400 text-xs">
                    ▼
                  </div>
                </div>
              </>
            )}

            <InputField 
              icon={Lock} 
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              type="password"
              placeholder="Password Baru" 
            />

            <InputField 
              icon={Lock} 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              type="password"
              placeholder="Konfirmasi Password Baru" 
            />
          </div>

          {/* Tombol Eksekusi */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#306896] hover:bg-[#25547a] text-white font-bold py-4 px-6 rounded-2xl text-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] transform disabled:opacity-50"
          >
            {loading ? 'Menyimpan ke Cloud...' : 'Daftar Sekarang'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Register;