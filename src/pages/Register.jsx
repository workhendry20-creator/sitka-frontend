// src/pages/Register.jsx
import React, { useState } from 'react';
// Impor icon yang dibutuhkan sesuai referensi
import { User, Fingerprint, KeyRound, Hash, Lock, ChevronLeft } from 'lucide-react';
// Impor Link untuk navigasi tanpa reload
import { Link } from 'react-router-dom';

// Komponen Input Reusable dipindah ke luar agar tidak kehilangan fokus saat mengetik
const InputField = ({ icon: Icon, placeholder, name, type = "text", value, onChange }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
      {/* Gunakan warna abu-abu samar sesuai referensi */}
      <Icon className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
    </div>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      // Style input disamakan dengan Login: Rounded besar, border samar
      className="w-full pl-16 pr-6 py-4 border border-gray-100 bg-slate-50 rounded-2xl text-lg placeholder:text-slate-400 focus:border-[#306896] focus:ring-1 focus:ring-[#306896] outline-none transition"
      required
    />
  </div>
);

const Register = () => {
  // State untuk melacak role yang dipilih (default: GURU sesuai referensi image 1)
  const [selectedRole, setSelectedRole] = useState('GURU');
  
  // State untuk data form
  const [formData, setFormData] = useState({
    namaLengkap: '',
    nip: '',
    token: '',
    nisn: '',
    password: '',
  });

  // Handler untuk perubahan input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // Logika integrasi backend registrasi di sini
    console.log(`Mendaftar sebagai ${selectedRole}:`, formData);
  };

  return (
    // Container utama: Web Centering, Background Light
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      
      {/* Card Register: Lebar max-w-2xl untuk tampilan Web agar tidak terlalu sempit */}
      <div className="bg-white p-8 md:p-14 rounded-[3rem] shadow-xl w-full max-w-2xl border border-gray-100 relative overflow-hidden">
        
        {/* Tombol Kembali ke Login - Atas Kiri */}
        <Link 
          to="/" 
          className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-[#306896] transition font-bold text-xs tracking-widest uppercase"
        >
          <ChevronLeft className="h-4 w-4" />
          KEMBALI KE LOGIN
        </Link>

        {/* Header Bagian: Jarak disesuaikan karena ada tombol kembali */}
        <div className="text-center mt-12 mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0a1e36] tracking-tight mb-3">
            Daftar Akun
          </h1>
          <p className="text-sm font-bold text-slate-400 tracking-widest uppercase">
            SILAKAN LENGKAPI DATA AUTENTIKASI
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-8">
          
          {/* Bagian Pilih Peran - Desain Tabbed seperti referensi */}
          <div className="bg-slate-50 p-2 rounded-full border border-gray-100 grid grid-cols-2 gap-2 shadow-inner">
            {/* Tombol Sebagai Guru */}
            <button
              type="button"
              onClick={() => setSelectedRole('GURU')}
              className={`py-3 px-5 rounded-full text-sm font-bold tracking-wider transition-all duration-300 flex items-center justify-center gap-2
                ${selectedRole === 'GURU' 
                  ? 'bg-white text-[#306896] shadow-md' // Aktif: Putih menonjol
                  : 'text-slate-400 hover:text-gray-800' // Tidak Aktif
                }
              `}
            >
              <Fingerprint className={`h-4 w-4 ${selectedRole === 'GURU' ? 'opacity-100' : 'opacity-50'}`} />
              SEBAGAI GURU
            </button>
            
            {/* Tombol Sebagai Orang Tua */}
            <button
              type="button"
              onClick={() => setSelectedRole('ORTU')}
              className={`py-3 px-5 rounded-full text-sm font-bold tracking-wider transition-all duration-300 flex items-center justify-center gap-2
                ${selectedRole === 'ORTU' 
                  ? 'bg-white text-[#306896] shadow-md' 
                  : 'text-slate-400 hover:text-gray-800'
                }
              `}
            >
              <User className={`h-4 w-4 ${selectedRole === 'ORTU' ? 'opacity-100' : 'opacity-50'}`} />
              SEBAGAI ORANG TUA
            </button>
          </div>

          {/* Bagian Input Form - Dinamis berdasarkan Peran */}
          <div className="space-y-6">
            {/* Input Umum: Nama Lengkap */}
            <InputField 
              icon={User} 
              name="namaLengkap"
              value={formData.namaLengkap}
              onChange={handleInputChange}
              placeholder="Nama Lengkap" 
            />

            {/* LOGIKA DINAMIS: Cek Role */}
            {selectedRole === 'GURU' ? (
              // Tampilan khusus Guru
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
              // Tampilan khusus Orang Tua
              <>
                <InputField 
                  icon={Hash} 
                  name="nisn"
                  value={formData.nisn}
                  onChange={handleInputChange}
                  placeholder="NISN Siswa" 
                />
                <InputField 
                  icon={Lock} 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  type="password"
                  placeholder="Password" 
                />
              </>
            )}
          </div>

          {/* Tombol Daftar - Biru Solid seperti Login */}
          <button
            type="submit"
            className="w-full bg-[#306896] hover:bg-[#25547a] text-white font-bold py-4 px-6 rounded-2xl text-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] transform"
          >
            Daftar Sekarang
          </button>
        </form>

      </div>
    </div>
  );
};

export default Register;