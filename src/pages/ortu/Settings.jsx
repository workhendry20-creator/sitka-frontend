// src/pages/ortu/Settings.jsx
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Heart, ShieldCheck, Camera, Save, Baby, AlertCircle, Key, XCircle, Star } from 'lucide-react';
import Swal from 'sweetalert2';
import { supabase } from '../../utils/supabaseClient';

const Settings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [parentData, setParentData] = useState(null);
  
  // State cadangan untuk menampung data asli dari database sebelum diedit
  const [originalProfile, setOriginalProfile] = useState(null);

  // State Biodata Orang Tua & Siswa
  const [profile, setProfile] = useState({
    nama: "",          
    namaAnak: "",      
    nisn: "",
    usia: "",
    kelompok: "",      
    pekerjaan: "",     
    telepon: "",       
    email: "",         
    hubungan: "",      
    alamat: ""         
  });

  useEffect(() => {
    fetchLatestProfile();
  }, []);

  const fetchLatestProfile = async () => {
    const savedSession = localStorage.getItem('user_session');
    if (savedSession) {
      const userObj = JSON.parse(savedSession);
      setParentData(userObj);

      try {
        const { data: userData, error: userErr } = await supabase
          .from('users')
          .select('*')
          .eq('id', userObj.id)
          .single();

        if (userErr) throw userErr;

        const { data: siswaData } = await supabase
          .from('siswa')
          .select('*')
          .eq('nama', userObj.nama_anak || userObj.namaAnak)
          .maybeSingle();

        if (userData) {
          const updatedProfile = {
            nama: userData.nama || "",
            namaAnak: userData.nama_anak || "",
            nisn: userData.nisn || "",
            usia: siswaData ? siswaData.usia : "",
            kelompok: userData.kelompok || "",
            pekerjaan: siswaData ? siswaData.pekerjaan_ibu : "",
            telepon: siswaData ? siswaData.no_wa : "",
            email: siswaData ? siswaData.email : "",
            hubungan: siswaData ? siswaData.hubungan_keluarga : "",
            alamat: siswaData ? siswaData.alamat_lengkap : ""
          };
          setProfile(updatedProfile);
          setOriginalProfile(updatedProfile); // Amankan data asli sebagai backup cancelation
          
          const newSession = { ...userObj, ...userData };
          localStorage.setItem('user_session', JSON.stringify(newSession));
        }
      } catch (err) {
        console.error("Gagal sinkronisasi data cloud:", err.message);
      }
    }
  };

  const handleInputChange = (field, val) => {
    setProfile(prev => ({ ...prev, [field]: val }));
  };

  // LOGIKA FUNGSI: BATALKAN PERUBAHAN
  const handleCancel = () => {
    if (originalProfile) {
      setProfile({ ...originalProfile }); // Kembalikan ke data backup asli
    }
    setIsEditing(false); // Keluar dari mode editing
  };

  // FUNGSI SIMPAN DATA PROFIL
  const handleSave = async () => {
    if (!profile.nisn || profile.nisn.trim() === "") {
      Swal.fire('NISN Wajib Diisi', 'NISN tidak boleh kosong karena digunakan untuk login.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const { error: errorUsers } = await supabase
        .from('users')
        .update({ nisn: profile.nisn })
        .eq('id', parentData.id);

      if (errorUsers) throw new Error(`Gagal update Akun Login: ${errorUsers.message}`);

      const { error: errorSiswa } = await supabase
        .from('siswa')
        .update({
          nisn: profile.nisn,
          usia: profile.usia,
          pekerjaan_ibu: profile.pekerjaan,
          no_wa: profile.telepon,
          email: profile.email,
          hubungan_keluarga: profile.hubungan,
          alamat_lengkap: profile.alamat
        })
        .eq('nama', profile.namaAnak);

      if (errorSiswa) throw new Error(`Gagal update Data Rekam Siswa: ${errorSiswa.message}`);

      await fetchLatestProfile();
      setIsEditing(false);
      
      Swal.fire({
        title: 'Profil Diperbarui!',
        text: 'Data informasi profil Anda berhasil disimpan aman.',
        icon: 'success',
        confirmButtonColor: '#306896',
        customClass: { popup: 'rounded-[2rem]' }
      });
    } catch (err) {
      Swal.fire({
        title: 'Gagal Menyimpan',
        text: err.message,
        icon: 'error',
        confirmButtonColor: '#f43f5e',
        customClass: { popup: 'rounded-[2rem]' }
      });
    } finally {
      setLoading(false);
    }
  };

  // FUNGSI MANDIRI: POPUP MODAL UBAH PASSWORD VIA SWEETALERT2
  const handleUpdatePassword = async () => {
    Swal.fire({
      title: 'Ubah Password Akun',
      html: `
        <div style="text-align: left; font-family: inherit;">
          <label style="font-size: 11px; font-weight: 900; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.05em;">Password Baru</label>
          <input type="password" id="swal-input-pass" class="swal2-input" placeholder="Minimal 6 karakter" style="width: 100%; box-sizing: border-box; margin: 4px 0 15px 0; border-radius: 12px; font-size: 14px;">
          
          <label style="font-size: 11px; font-weight: 900; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.05em;">Konfirmasi Password</label>
          <input type="password" id="swal-input-confirm" class="swal2-input" placeholder="Ulangi password baru" style="width: 100%; box-sizing: border-box; margin: 4px 0 0 0; border-radius: 12px; font-size: 14px;">
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Perbarui Password',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#306896',
      cancelButtonColor: '#94a3b8',
      customClass: {
        popup: 'rounded-[2.5rem] p-8',
        confirmButton: 'rounded-xl font-bold text-xs uppercase tracking-wider px-4 py-2.5',
        cancelButton: 'rounded-xl font-bold text-xs uppercase tracking-wider px-4 py-2.5'
      },
      preConfirm: () => {
        const pass = document.getElementById('swal-input-pass').value;
        const confirm = document.getElementById('swal-input-confirm').value;
        
        if (!pass || !confirm) {
          Swal.showValidationMessage('Semua kolom password wajib diisi!');
          return false;
        }
        if (pass.length < 6) {
          Swal.showValidationMessage('Password minimal harus 6 karakter!');
          return false;
        }
        if (pass !== confirm) {
          Swal.showValidationMessage('Konfirmasi password tidak cocok!');
          return false;
        }
        return pass;
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Memproses...',
          allowOutsideClick: false,
          didOpen: () => { Swal.showLoading(); }
        });

        try {
          const { error } = await supabase.auth.updateUser({ password: result.value });
          if (error) throw error;

          Swal.fire({
            title: 'Password Diganti!',
            text: 'Kredensial login baru Anda berhasil disimpan di cloud database.',
            icon: 'success',
            confirmButtonColor: '#306896',
            customClass: { popup: 'rounded-[2rem]' }
          });
        } catch (err) {
          Swal.fire({
            title: 'Gagal Ganti Password',
            text: err.message,
            icon: 'error',
            confirmButtonColor: '#f43f5e',
            customClass: { popup: 'rounded-[2rem]' }
          });
        }
      }
    });
  };

  const isDataIncomplete = !profile.pekerjaan || !profile.telepon || !profile.email || !profile.hubungan || !profile.alamat;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 text-left">
      
      {isDataIncomplete && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-[2rem] flex items-center gap-4 shadow-sm animate-pulse">
          <AlertCircle className="text-red-500 shrink-0" size={28} />
          <div>
            <h4 className="font-black text-sm uppercase tracking-wider">Biodata Belum Lengkap!</h4>
            <p className="text-xs font-medium text-red-600/90 mt-0.5">Mohon lengkapi informasi biodata Anda di bawah ini agar dapat terdata dengan valid di sistem database sekolah.</p>
          </div>
        </div>
      )}

      {/* Header Profil Ortu */}
      <div className="relative h-48 bg-gradient-to-r from-[#0a1e36] to-[#306896] rounded-[3rem] overflow-hidden shadow-xl">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="absolute -bottom-1 top-16 left-6 md:left-10 flex items-end gap-6 text-left">
          <div className="relative group">
            <div className="w-28 h-28 md:w-32 md:h-32 bg-white rounded-[2.5rem] p-2 shadow-2xl">
              <div className="w-full h-full bg-orange-100 rounded-[2rem] flex items-center justify-center text-orange-600 text-4xl font-black">
                {profile.nama ? profile.nama.charAt(0).toUpperCase() : 'M'}
              </div>
            </div>
            <button className="absolute bottom-2 right-2 p-2 bg-white rounded-xl shadow-lg text-orange-600 hover:scale-110 transition-transform">
              <Camera size={18} />
            </button>
          </div>
          <div className="mb-4 text-white">
            <h2 className="text-xl md:text-2xl font-black">{profile.nama || 'Wali Murid'}</h2>
            <p className="text-white/60 font-medium tracking-wide text-xs md:text-sm">
              {profile.hubungan || 'Wali'} dari {profile.namaAnak || 'Anak Didik'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
        
        {/* Kolom Kiri: Info Anak & Tombol Aksi Bersarang (Sesuai Screenshot 2026-06-23 at 16.20.15.png) */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-left">Data Anak Terhubung</h3>
            
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-orange-600 shadow-sm shrink-0">
                <Baby size={24} />
              </div>
              <div className="flex-1 w-full min-w-0">
                <p className="text-[10px] font-black text-orange-600 uppercase mb-1">Nama Siswa</p>
                <p className="text-sm font-bold text-[#0a1e36] truncate">{profile.namaAnak || '-'}</p>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                <Star size={24} />
              </div>
              <div className="flex-1 w-full min-w-0">
                <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">Usia Saat Ini</p>
                {isEditing ? (
                  <input 
                    type="number" 
                    value={profile.usia || ''}
                    onChange={(e) => handleInputChange('usia', e.target.value)}
                    placeholder="Mis. 5"
                    className="w-full bg-white border border-emerald-200 rounded-lg px-3 py-1.5 text-sm font-bold text-[#0a1e36] outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                ) : (
                  <p className="text-sm font-bold text-[#0a1e36]">
                    {profile.usia ? `${profile.usia} Tahun` : '-'}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">
              <ShieldCheck className="text-slate-400" size={24} />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Kelas Terdaftar</p>
                <p className="text-sm font-bold text-[#0a1e36]">
                  Kelompok <span className="text-indigo-600 font-black">{profile.kelompok || '-'}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Wrapper Aksi Tombol Bertumpuk */}
          <div className="space-y-3 px-1">
            {/* Tombol Utama: Edit Profil / Simpan */}
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                isEditing 
                  ? 'bg-emerald-500 text-white shadow-emerald-200 shadow-lg hover:bg-emerald-600' 
                  : 'bg-[#306896] text-white shadow-blue-900/20 shadow-lg hover:bg-[#235177]'
              }`}
            >
              {loading ? 'Menyimpan...' : isEditing ? <><Save size={18} /> Simpan Perubahan</> : 'Lengkapi / Edit Profil'}
            </button>

            {/* Tombol: Ubah Password Akun */}
            <button 
              onClick={handleUpdatePassword}
              className="w-full py-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 hover:bg-slate-50 hover:text-orange-600 hover:border-orange-200 shadow-sm"
            >
              <Key size={14} /> Ubah Password Akun
            </button>
          </div>
        </div>

        {/* Kolom Kanan: Formulir Informasi */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-[#0a1e36]">Informasi Orang Tua</h3>
              <div className="h-1 w-12 bg-orange-600 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <InfoField icon={ShieldCheck} label="NISN Anak (ID Login)" fieldName="nisn" value={profile.nisn} isEditing={isEditing} onChange={handleInputChange} placeholder="Masukkan 10 digit NISN asli" />
              <UserField icon={User} label="Pekerjaan Ibu" fieldName="pekerjaan" value={profile.pekerjaan} isEditing={isEditing} onChange={handleInputChange} />
              <InfoField icon={Phone} label="Nomor WhatsApp" fieldName="telepon" value={profile.telepon} isEditing={isEditing} onChange={handleInputChange} placeholder="Contoh: 0812345..." />
              <InfoField icon={Mail} label="Alamat Email" fieldName="email" value={profile.email} isEditing={isEditing} onChange={handleInputChange} placeholder="Contoh: bapak/ibu@email.com" />
              <InfoField icon={Heart} label="Hubungan Keluarga" fieldName="hubungan" value={profile.hubungan} isEditing={isEditing} onChange={handleInputChange} placeholder="Contoh: Ibu Kandung, Ayah, Wali" />
              
              <div className="md:col-span-2">
                <InfoField icon={MapPin} label="Alamat Rumah Lengkap" fieldName="alamat" value={profile.alamat} isEditing={isEditing} onChange={handleInputChange} placeholder="Tulis nama jalan, RT/RW, nomor rumah, dan kecamatan..." />
              </div>
            </div>

            {/* --- BUTTON BARU: BATALKAN PERUBAHAN (Hanya muncul di bawah alamat saat mode edit aktif) --- */}
            {isEditing && (
              <div className="mt-8 pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full py-3.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 hover:bg-rose-100 hover:text-rose-700 shadow-sm"
                >
                  <XCircle size={16} /> Batalkan Perubahan
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

// Sub-komponen bidang field form umum
const InfoField = ({ icon: Icon, label, fieldName, value, isEditing, onChange, placeholder }) => {
  const isEmpty = !value || value.trim() === "";

  return (
    <div className="space-y-2 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400">
          <Icon size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </div>
        {isEmpty && (
          <span className="text-[9px] font-black bg-red-50 text-red-500 px-2 py-0.5 rounded-md border border-red-100 uppercase tracking-wider animate-pulse">
            ⚠️ Wajib Diisi
          </span>
        )}
      </div>

      {isEditing ? (
        <input 
          type="text" 
          value={value}
          placeholder={placeholder || `Masukkan ${label}`}
          onChange={(e) => onChange(fieldName, e.target.value)}
          className={`w-full p-3 bg-slate-50 border rounded-xl text-sm font-bold text-[#0a1e36] outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
            isEmpty ? 'border-red-200 bg-red-50/20 focus:border-red-400' : 'border-slate-200 focus:border-blue-500'
          }`}
        />
      ) : (
        <p className={`text-sm font-bold pl-6 ${isEmpty ? 'text-red-400 italic font-medium' : 'text-[#0a1e36]'}`}>
          {isEmpty ? "Belum dilengkapi (Klik Edit Profil)" : value}
        </p>
      )}
    </div>
  );
};

// Sub-komponen bidang field Pekerjaan Ibu (tidak wajib diisi warna merah)
const UserField = ({ icon: Icon, label, fieldName, value, isEditing, onChange }) => {
  return (
    <div className="space-y-2 text-left">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon size={16} />
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      {isEditing ? (
        <input 
          type="text" 
          value={value}
          placeholder={`Masukkan ${label}`}
          onChange={(e) => onChange(fieldName, e.target.value)}
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-[#0a1e36] outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      ) : (
        <p className="text-sm font-bold text-[#0a1e36] pl-6">{value || "-"}</p>
      )}
    </div>
  );
};

export default Settings;