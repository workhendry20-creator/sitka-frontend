// src/pages/ortu/Settings.jsx
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Heart, ShieldCheck, Camera, Save, Baby, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import { supabase } from '../../utils/supabaseClient';

const Settings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [parentData, setParentData] = useState(null);

  // State Biodata Orang Tua (Dipetakan Sempurna ke Kolom tabel 'profil_ortu')
  const [profile, setProfile] = useState({
    nama: "",          // Diambil dari tabel users utama
    namaAnak: "",      // Diambil dari tabel users utama
    nisn: "",          // Diambil dari tabel users utama
    kelompok: "",      // Diambil dari tabel users utama
    pekerjaan: "",     // Diambil dari tabel profil_ortu
    telepon: "",       // Diambil dari tabel profil_ortu (no_whatsapp)
    email: "",         // Diambil dari tabel profil_ortu (alamat_email)
    hubungan: "",      // Diambil dari tabel profil_ortu (hubungan_keluarga)
    alamat: ""         // Diambil dari tabel profil_ortu (alamat_rumah)
  });

  // Load Data Pertama Kali dari Session & Sinkronkan dengan Database Cloud
  useEffect(() => {
    fetchLatestProfile();
  }, []);

  const fetchLatestProfile = async () => {
    const savedSession = localStorage.getItem('user_session');
    if (savedSession) {
      const userObj = JSON.parse(savedSession);
      setParentData(userObj);

      try {
        // 1. Ambil data konfig utama akun dari tabel 'users'
        const { data: userData, error: userErr } = await supabase
          .from('users')
          .select('*')
          .eq('nama', userObj.nama)
          .single();

        if (userErr) throw userErr;

        // 2. Ambil data pelengkap biodata dari tabel terpisah 'profil_ortu'
        const { data: profileData } = await supabase
          .from('profil_ortu')
          .select('*')
          .eq('user_name', userObj.nama)
          .maybeSingle();

        if (userData) {
          const updatedProfile = {
            nama: userData.nama || "",
            namaAnak: userData.nama_anak || "",
            nisn: userData.nisn || "",
            kelompok: userData.kelompok || "",
            pekerjaan: profileData ? profileData.pekerjaan : "",
            telepon: profileData ? profileData.no_whatsapp : "",
            email: profileData ? profileData.alamat_email : "",
            hubungan: profileData ? profileData.hubungan_keluarga : "",
            alamat: profileData ? profileData.alamat_rumah : ""
          };
          setProfile(updatedProfile);
          
          // Perbarui data session lokal agar komponen dashboard ikut sinkron
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

  // FUNGSI UTAMA: SIMPAN DATA DENGAN LOGIKA UPSERT (INSERT/UPDATE) KE TABEL PROFIL_ORTU
  const handleSave = async () => {
    setLoading(true);
    try {
      // Siapkan payload data yang disesuaikan dengan skema nama kolom baru di Supabase
      const payload = {
        user_name: parentData.nama,
        pekerjaan: profile.pekerjaan,
        no_whatsapp: profile.telepon,
        alamat_email: profile.email,
        hubungan_keluarga: profile.hubungan,
        alamat_rumah: profile.alamat
      };

      // Cek apakah data profil untuk user ini sudah pernah diisi atau belum
      const { data: existing } = await supabase
        .from('profil_ortu')
        .select('id')
        .eq('user_name', parentData.nama)
        .maybeSingle();

      let dbError;

      if (existing) {
        // Jika data lama ditemukan, lakukan UPDATE
        const { error } = await supabase
          .from('profil_ortu')
          .update(payload)
          .eq('user_name', parentData.nama);
        dbError = error;
      } else {
        // Jika data masih kosong, lakukan INSERT
        const { error } = await supabase
          .from('profil_ortu')
          .insert([payload]);
        dbError = error;
      }

      if (dbError) throw dbError;

      // Ambil ulang data terbaru untuk memastikan local state & session ter-update
      await fetchLatestProfile();
      
      setIsEditing(false);
      Swal.fire({
        title: 'Profil Diperbarui!',
        text: 'Data informasi pelengkap Orang Tua berhasil disimpan aman ke cloud database.',
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

  // Cek apakah ada informasi penting yang masih kosong
  const isDataIncomplete = !profile.pekerjaan || !profile.telepon || !profile.email || !profile.hubungan || !profile.alamat;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 text-left">
      
      {/* ALERT WARNING MERAH JIKA BIODATA BELUM LENGKAP */}
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
        
        {/* Kolom Kiri: Info Anak & Tombol Aksi */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-left">Data Anak Terhubung</h3>
            
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-orange-600 shadow-sm">
                <Baby size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-orange-600 uppercase">Nama Siswa</p>
                <p className="text-sm font-bold text-[#0a1e36]">{profile.namaAnak || '-'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">
              <ShieldCheck className="text-slate-400" size={24} />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">NISN & Kelas</p>
                <p className="text-sm font-bold text-[#0a1e36]">
                  {profile.nisn || '-'} • <span className="text-indigo-600">{profile.kelompok || '-'}</span>
                </p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              isEditing 
                ? 'bg-emerald-500 text-white shadow-emerald-200 shadow-lg hover:bg-emerald-600' 
                : 'bg-[#306896] text-white shadow-blue-900/20 shadow-lg hover:bg-[#235177]'
            }`}
          >
            {loading ? (
              'Menyimpan ke Database...'
            ) : isEditing ? (
              <><Save size={18} /> Simpan Perubahan</>
            ) : (
              'Lengkapi / Edit Profil'
            )}
          </button>
        </div>

        {/* Kolom Kanan: Formulir Biodata */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-[#0a1e36]">Informasi Orang Tua</h3>
              <div className="h-1 w-12 bg-orange-600 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <InfoField icon={User} label="Pekerjaan" fieldName="pekerjaan" value={profile.pekerjaan} isEditing={isEditing} onChange={handleInputChange} />
              <InfoField icon={Phone} label="Nomor WhatsApp" fieldName="telepon" value={profile.telepon} isEditing={isEditing} onChange={handleInputChange} placeholder="Contoh: 0812345..." />
              <InfoField icon={Mail} label="Alamat Email" fieldName="email" value={profile.email} isEditing={isEditing} onChange={handleInputChange} placeholder="Contoh: bapak@email.com" />
              <InfoField icon={Heart} label="Hubungan Keluarga" fieldName="hubungan" value={profile.hubungan} isEditing={isEditing} onChange={handleInputChange} placeholder="Contoh: Ayah, Ibu, Wali" />
              <div className="md:col-span-2">
                <InfoField icon={MapPin} label="Alamat Rumah" fieldName="alamat" value={profile.alamat} isEditing={isEditing} onChange={handleInputChange} placeholder="Tulis nama jalan, RT/RW, nomor rumah, dan kota..." />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Komponen Reusable InfoField dengan Indikator Kosong / Tanda Merah Wajib Isi
const InfoField = ({ icon: Icon, label, fieldName, value, isEditing, onChange, placeholder }) => {
  const isEmpty = !value || value.trim() === "";

  return (
    <div className="space-y-2 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400">
          <Icon size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </div>
        {/* Tanda Merah Mengingatkan Mengisi */}
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

export default Settings;