// src/pages/guru/Settings.jsx
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, ShieldCheck, Camera, Save, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import { supabase } from '../../utils/supabaseClient';

const SettingsGuru = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teacherData, setTeacherData] = useState(null);

  // State Biodata Guru terikat penuh ke Realtime Cloud Supabase (no_whatsapp)
  const [profile, setProfile] = useState({
    nama: "",
    nip: "",
    mulaiTugas: "",
    email: "",         // Dari profil_guru (alamat_email)
    noWhatsapp: "",    // Dari profil_guru (no_whatsapp)
    tglLahir: "",      // Dari profil_guru (tanggal_lahir)
    pendidikan: "",    // Dari profil_guru (pendidikan_terakhir)
    alamat: ""         // Dari profil_guru (alamat_rumah)
  });

  // Ambil data pertama kali saat halaman dimuat
  useEffect(() => {
    fetchLatestProfile();
  }, []);

  const fetchLatestProfile = async () => {
    const savedSession = localStorage.getItem('user_session');
    if (savedSession) {
      const userObj = JSON.parse(savedSession);
      setTeacherData(userObj);

      try {
        // 1. Ambil data utama kredensial dari tabel 'users'
        const { data: userData, error: userErr } = await supabase
          .from('users')
          .select('*')
          .eq('nama', userObj.nama)
          .single();

        if (userErr) throw userErr;

        // 2. Ambil detail data pelengkap dari tabel 'profil_guru'
        const { data: profileData } = await supabase
          .from('profil_guru')
          .select('*')
          .eq('user_name', userObj.nama)
          .maybeSingle();

        if (userData) {
          setProfile({
            nama: userData.nama || "",
            nip: userData.nip || "",
            mulaiTugas: userData.mulai_tugas || "01 Maret 2015", // Fallback default
            email: profileData ? profileData.alamat_email : "",
            noWhatsapp: profileData ? profileData.no_whatsapp : "",
            tglLahir: profileData ? profileData.tanggal_lahir : "",
            pendidikan: profileData ? profileData.pendidikan_terakhir : "",
            alamat: profileData ? profileData.alamat_rumah : ""
          });

          // Sinkronkan session lokal demi keakuratan dashboard
          const newSession = { ...userObj, ...userData };
          localStorage.setItem('user_session', JSON.stringify(newSession));
        }
      } catch (err) {
        console.error("Gagal sinkronisasi data guru ke cloud:", err.message);
      }
    }
  };

  const handleInputChange = (field, val) => {
    setProfile(prev => ({ ...prev, [field]: val }));
  };

  // FUNGSI UTAMA: UPSERT BIODATA GURU KE CLOUD SUPABASE
  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        user_name: teacherData.nama,
        alamat_email: profile.email,
        no_whatsapp: profile.noWhatsapp,
        tanggal_lahir: profile.tglLahir,
        pendidikan_terakhir: profile.pendidikan,
        alamat_rumah: profile.alamat
      };

      // Periksa apakah record guru sudah ada atau belum
      const { data: existing } = await supabase
        .from('profil_guru')
        .select('id')
        .eq('user_name', teacherData.nama)
        .maybeSingle();

      let dbError;

      if (existing) {
        const { error } = await supabase
          .from('profil_guru')
          .update(payload)
          .eq('user_name', teacherData.nama);
        dbError = error;
      } else {
        const { error } = await supabase
          .from('profil_guru')
          .insert([payload]);
        dbError = error;
      }

      if (dbError) throw dbError;

      // Segarkan data dari cloud
      await fetchLatestProfile();
      setIsEditing(false);

      Swal.fire({
        title: 'Profil Diperbarui!',
        text: 'Perubahan data biodata Anda telah disimpan aman ke sistem cloud.',
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

  // Indikator validasi wajib isi data pelengkap
  const isDataIncomplete = !profile.email || !profile.noWhatsapp || !profile.tglLahir || !profile.pendidikan || !profile.alamat;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 text-left">
      
      {/* ALERT WARNING MERAH JIKA BIODATA BELUM LENGKAP */}
      {isDataIncomplete && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-[2rem] flex items-center gap-4 shadow-sm animate-pulse">
          <AlertCircle className="text-red-500 shrink-0" size={28} />
          <div>
            <h4 className="font-black text-sm uppercase tracking-wider">Biodata Pendidik Belum Lengkap!</h4>
            <p className="text-xs font-medium text-red-600/90 mt-0.5">Mohon lengkapi informasi biodata keguruan Anda di bawah ini agar lolos verifikasi data administrasi sekolah, Senior.</p>
          </div>
        </div>
      )}

      {/* Header Profil */}
      <div className="relative h-48 bg-[#0a1e36] rounded-[3rem] overflow-hidden shadow-xl">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="absolute -bottom-1 top-20 left-10 flex items-end gap-6 text-left">
          <div className="relative group">
            <div className="w-32 h-32 bg-white rounded-[2.5rem] p-2 shadow-2xl">
              <div className="w-full h-full bg-[#306896] rounded-[2rem] flex items-center justify-center text-white text-4xl font-black">
                {profile.nama ? profile.nama.charAt(0).toUpperCase() : 'B'}
              </div>
            </div>
            <button className="absolute bottom-2 right-2 p-2 bg-white rounded-xl shadow-lg text-[#306896] hover:scale-110 transition-transform">
              <Camera size={18} />
            </button>
          </div>
          <div className="mb-4 text-white">
            <h2 className="text-2xl font-black">{profile.nama || 'Nama Guru'}</h2>
            <p className="text-white/60 font-medium tracking-wide text-sm">Tenaga Pendidik SI-FLAMBOYAN</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
        
        {/* Kolom Kiri: Info Utama */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-left">Status Kepegawaian</h3>
            <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 text-left">
              <ShieldCheck className="text-[#306896]" size={24} />
              <div>
                <p className="text-[10px] font-black text-[#306896] uppercase">NIP / ID Guru</p>
                <p className="text-sm font-bold text-[#0a1e36]">{profile.nip || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">
              <Calendar className="text-slate-400" size={24} />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Bergabung Sejak</p>
                <p className="text-sm font-bold text-[#0a1e36]">{profile.mulaiTugas}</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              isEditing 
                ? 'bg-green-500 text-white shadow-green-200 shadow-lg hover:bg-green-600' 
                : 'bg-[#0a1e36] text-white shadow-blue-900/20 shadow-lg hover:bg-[#1a2e46]'
            }`}
          >
            {loading ? (
              'Menyimpan...'
            ) : isEditing ? (
              <><Save size={18} /> Simpan Perubahan</>
            ) : (
              'Edit Profil'
            )}
          </button>
        </div>

        {/* Kolom Kanan: Biodata Lengkap */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-[#0a1e36]">Data Biodata Lengkap</h3>
              <div className="h-1 w-12 bg-[#306896] rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <InfoField icon={Mail} label="Email Instansi" fieldName="email" value={profile.email} isEditing={isEditing} onChange={handleInputChange} placeholder="Contoh: nama@si-flamboyan.sch.id" />
              <InfoField icon={Phone} label="Nomor WhatsApp" fieldName="noWhatsapp" value={profile.noWhatsapp} isEditing={isEditing} onChange={handleInputChange} placeholder="Contoh: 0812-3456-xxxx" />
              <InfoField icon={Calendar} label="Tanggal Lahir" fieldName="tglLahir" value={profile.tglLahir} isEditing={isEditing} onChange={handleInputChange} placeholder="Contoh: 22 Mei 1988" />
              <InfoField icon={Briefcase} label="Pendidikan Terakhir" fieldName="pendidikan" value={profile.pendidikan} isEditing={isEditing} onChange={handleInputChange} placeholder="Contoh: S1 PG-PAUD" />
              <div className="md:col-span-2">
                <InfoField icon={MapPin} label="Alamat Domisili" fieldName="alamat" value={profile.alamat} isEditing={isEditing} onChange={handleInputChange} placeholder="Masukkan alamat rumah tinggal lengkap saat ini..." />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Komponen Reusable InfoField dengan Validasi Sinyal Merah Wajib Isi
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
          className={`w-full p-3 bg-slate-50 border rounded-xl text-sm font-bold text-[#0a1e36] outline-none focus:ring-2 focus:ring-[#306896] transition-all ${
            isEmpty ? 'border-red-200 bg-red-50/20 focus:border-red-400' : 'border-slate-200 focus:border-[#306896]'
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

export default SettingsGuru;