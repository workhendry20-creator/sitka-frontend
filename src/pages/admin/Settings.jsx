// src/pages/admin/Settings.jsx
import React, { useState, useEffect } from 'react';
import { 
  Settings, ShieldCheck, Trash2, 
  Save, Key, BellRing, Database, HardDrive, Sparkles 
} from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import Swal from 'sweetalert2';

const SettingsAdmin = () => {
  // --- STATE UTK PENGATURAN SISTEM ---
  const [systemConfig, setSystemConfig] = useState({
    namaSekolah: 'TK SI-FLAMBOYAN INTERNASIONAL',
    tahunAjaran: '2026/2027',
    semester: 'Ganjil',
    fiturChat: true,
    fiturPendaftaran: true,
  });

  // --- STATE AKUN ADMIN ---
  const [adminProfile, setAdminProfile] = useState({
    username: 'admin_sitka',
    passwordBaru: '',
    konfirmasiPassword: ''
  });

  // --- SIMPAN KONFIGURASI SEKOLAH ---
  const handleSaveConfig = (e) => {
    e.preventDefault();
    // Di sini Senior bisa kembangkan untuk simpan ke tabel 'konfigurasi' di Supabase jika diperlukan
    Swal.fire({
      icon: 'success',
      title: 'Konfigurasi Disimpan!',
      text: 'Identitas dan parameter akademik SI-FLAMBOYAN berhasil diperbarui.',
      confirmButtonColor: '#0a1e36'
    });
  };

  // --- GANTI PASSWORD ADMIN DARI JALUR DEPAN ---
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!adminProfile.passwordBaru) {
      Swal.fire({ icon: 'warning', title: 'Input Kosong', text: 'Silakan isi password baru Anda.', confirmButtonColor: '#0a1e36' });
      return;
    }
    if (adminProfile.passwordBaru !== adminProfile.konfirmasiPassword) {
      Swal.fire({ icon: 'error', title: 'Password Tidak Cocok', text: 'Konfirmasi password baru tidak sesuai.', confirmButtonColor: '#ef4444' });
      return;
    }

    try {
      // Mengubah password user utama di tabel 'users' yang rolenya 'admin'
      const { error } = await supabase
        .from('users')
        .update({ password: adminProfile.passwordBaru })
        .eq('role', 'admin'); // atau .eq('nama', 'admin') tergantung session Senior

      if (error) throw error;

      Swal.fire({
        icon: 'success',
        title: 'Sandi Admin Diperbarui!',
        text: 'Password akun Admin utama berhasil diubah di cloud database.',
        confirmButtonColor: '#0a1e36'
      });
      setAdminProfile({ ...adminProfile, passwordBaru: '', konfirmasiPassword: '' });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal Mengubah', text: err.message, confirmButtonColor: '#ef4444' });
    }
  };

  // --- FUNGSI TRUNCATE / BERSIHKAN BROADCAST PENGUMUMAN ---
  const handleClearAnnouncements = async () => {
    const result = await Swal.fire({
      title: 'Kosongkan Riwayat Broadcast?',
      text: "Semua pengumuman yang pernah dikirim Admin akan dihapus bersih dari cloud!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Bersihkan!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        // Eksekusi delete massal tanpa filter id (menghapus seluruh row tabel pengumuman)
        const { error } = await supabase
          .from('pengumuman')
          .delete()
          .neq('id', 0); // Trik bypass agar menghapus semua data jika RLS disable

        if (error) throw error;

        Swal.fire({
          icon: 'success',
          title: 'Database Dibersihkan!',
          text: 'Tabel pengumuman saat ini telah kosong melompong.',
          confirmButtonColor: '#0a1e36'
        });
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Gagal membersihkan', text: err.message, confirmButtonColor: '#ef4444' });
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 text-left">
      
      {/* HEADER SETTINGS */}
      <div className="bg-[#0a1e36] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl">
            <Settings className="text-indigo-400 animate-spin-slow" size={36} />
          </div>
          <div>
            <h2 className="text-3xl font-black italic">Konfigurasi Sistem</h2>
            <p className="text-indigo-200 text-sm opacity-80">Atur parameter global, keamanan, dan pemeliharaan database SI-FLAMBOYAN</p>
          </div>
        </div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* BAGIAN 1: IDENTITAS SEKOLAH & AKADEMIK */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-black text-[#0a1e36] text-lg flex items-center gap-2 border-b border-slate-50 pb-4">
              <Sparkles size={20} className="text-amber-500" /> Parameter Akademik & Aplikasi
            </h3>
            
            <form onSubmit={handleSaveConfig} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Nama Lembaga / Sekolah</label>
                  <input 
                    type="text" 
                    value={systemConfig.namaSekolah}
                    onChange={(e) => setSystemConfig({...systemConfig, namaSekolah: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono">Tahun Ajaran Aktif</label>
                  <select 
                    value={systemConfig.tahunAjaran}
                    onChange={(e) => setSystemConfig({...systemConfig, tahunAjaran: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-700"
                  >
                    <option value="2025/2026">2025/2026</option>
                    <option value="2026/2027">2026/2027</option>
                    <option value="2027/2028">2027/2028</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Semester Berjalan</label>
                <div className="flex gap-4">
                  {['Ganjil', 'Genap'].map((sem) => (
                    <button
                      key={sem}
                      type="button"
                      onClick={() => setSystemConfig({...systemConfig, semester: sem})}
                      className={`flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-widest border transition-all ${
                        systemConfig.semester === sem 
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm' 
                          : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      Semester {sem}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle Fitur */}
              <div className="pt-4 space-y-4 border-t border-slate-50">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Fitur Akses Pengguna</h4>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div>
                      <span className="text-sm font-bold text-[#0a1e36] block">Aktivasi Fitur Chat Global</span>
                      <span className="text-[11px] text-slate-400">Mengaktifkan/mematikan modul pesan real-time guru & ortu.</span>
                    </div>
                    <input 
                      type="checkbox" checked={systemConfig.fiturChat}
                      onChange={(e) => setSystemConfig({...systemConfig, fiturChat: e.target.checked})}
                      className="w-10 h-5 bg-slate-200 rounded-full appearance-none checked:bg-indigo-600 cursor-pointer relative before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:translate-x-5 before:transition-all transition-all"
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.15em] shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
                <Save size={16} /> Simpan Konfigurasi Aplikasi
              </button>
            </form>
          </div>
        </div>

        {/* BAGIAN 2: KEAMANAN & MAINTENANCE DATABASE */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* GANTI PASSWORD ADMIN */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-black text-[#0a1e36] text-sm uppercase tracking-widest flex items-center gap-2 border-b border-slate-50 pb-4">
              <Key size={18} className="text-indigo-600" /> Kredensial Akun
            </h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase">Username Admin</span>
                <input type="text" disabled value={adminProfile.username} className="w-full px-4 py-3.5 bg-slate-100 rounded-xl text-xs font-bold text-slate-400 border-none cursor-not-allowed" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase">Sandi Baru</span>
                <input 
                  type="password" placeholder="••••••••" 
                  value={adminProfile.passwordBaru}
                  onChange={(e) => setAdminProfile({...adminProfile, passwordBaru: e.target.value})}
                  className="w-full px-4 py-3.5 bg-slate-50 rounded-xl text-xs font-bold border-none focus:ring-2 focus:ring-indigo-500" 
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase">Ulangi Sandi Baru</span>
                <input 
                  type="password" placeholder="••••••••" 
                  value={adminProfile.konfirmasiPassword}
                  onChange={(e) => setAdminProfile({...adminProfile, konfirmasiPassword: e.target.value})}
                  className="w-full px-4 py-3.5 bg-slate-50 rounded-xl text-xs font-bold border-none focus:ring-2 focus:ring-indigo-500" 
                />
              </div>
              <button type="submit" className="w-full py-4 bg-[#0a1e36] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-md">
                Update Password
              </button>
            </form>
          </div>

          {/* MAINTENANCE ZONE */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-rose-100 shadow-sm space-y-6">
            <h3 className="font-black text-rose-600 text-sm uppercase tracking-widest flex items-center gap-2 border-b border-rose-50 pb-4">
              <Database size={18} /> Maintenance Zone
            </h3>
            <p className="text-xs font-medium text-slate-400 leading-relaxed">
              Lakukan pembersihan data berkala untuk menjaga performa query database cloud Supabase SI-FLAMBOYAN tetap ringan.
            </p>
            <div className="space-y-3">
              <button 
                onClick={handleClearAnnouncements}
                className="w-full flex items-center justify-between p-4 bg-rose-50/50 hover:bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl transition-all group active:scale-95"
              >
                <div className="text-left">
                  <span className="text-xs font-black uppercase block">Wipe Broadcast</span>
                  <span className="text-[9px] font-bold text-rose-400 block mt-0.5">Kosongkan semua baris pengumuman</span>
                </div>
                <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SettingsAdmin;