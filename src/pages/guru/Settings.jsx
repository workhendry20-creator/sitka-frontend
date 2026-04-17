// src/pages/guru/Settings.jsx
import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, ShieldCheck, Camera, Save } from 'lucide-react';
import Swal from 'sweetalert2';

const Settings = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Data Biodata Guru
  const [profile, setProfile] = useState({
    nama: "Budi Santoso, S.Pd",
    nip: "19880522 201503 1 002",
    jabatan: "Wali Kelas A1 / Guru Madya",
    email: "budi.santoso@sitka.sch.id",
    telepon: "0812-3456-7890",
    alamat: "Jl. Pendidikan No. 45, Cimahi, Jawa Barat",
    tglLahir: "22 Mei 1988",
    pendidikan: "S1 Pendidikan Guru PAUD - Universitas Pendidikan Indonesia",
    mulaiTugas: "01 Maret 2015"
  });

  const handleSave = () => {
    setIsEditing(false);
    Swal.fire({
      title: 'Profil Diperbarui!',
      text: 'Perubahan data biodata Anda telah disimpan ke sistem.',
      icon: 'success',
      confirmButtonColor: '#306896',
      customClass: { popup: 'rounded-[2rem]' }
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Header Profil */}
      <div className="relative h-48 bg-[#0a1e36] rounded-[3rem] overflow-hidden shadow-xl">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="absolute -bottom-1 top-20 left-10 flex items-end gap-6">
          <div className="relative group">
            <div className="w-32 h-32 bg-white rounded-[2.5rem] p-2 shadow-2xl">
              <div className="w-full h-full bg-[#306896] rounded-[2rem] flex items-center justify-center text-white text-4xl font-black">
                B
              </div>
            </div>
            <button className="absolute bottom-2 right-2 p-2 bg-white rounded-xl shadow-lg text-[#306896] hover:scale-110 transition-transform">
              <Camera size={18} />
            </button>
          </div>
          <div className="mb-4 text-white">
            <h2 className="text-2xl font-black">{profile.nama}</h2>
            <p className="text-white/60 font-medium tracking-wide text-sm">{profile.jabatan}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
        
        {/* Kolom Kiri: Info Utama */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Status Kepegawaian</h3>
            <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
              <ShieldCheck className="text-[#306896]" size={24} />
              <div>
                <p className="text-[10px] font-black text-[#306896] uppercase">NIP / ID Guru</p>
                <p className="text-sm font-bold text-[#0a1e36]">{profile.nip}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <Calendar className="text-slate-400" size={24} />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Bergabung Sejak</p>
                <p className="text-sm font-bold text-[#0a1e36]">{profile.mulaiTugas}</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              isEditing ? 'bg-green-500 text-white shadow-green-200 shadow-lg' : 'bg-[#0a1e36] text-white shadow-blue-900/20 shadow-lg hover:bg-[#1a2e46]'
            }`}
          >
            {isEditing ? <><Save size={18} /> Simpan Perubahan</> : 'Edit Profil'}
          </button>
        </div>

        {/* Kolom Kanan: Biodata Lengkap */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-[#0a1e36]">Data Biodata Lengkap</h3>
              <div className="h-1 w-12 bg-[#306896] rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InfoField icon={Mail} label="Email Instansi" value={profile.email} isEditing={isEditing} />
              <InfoField icon={Phone} label="Nomor Telepon" value={profile.telepon} isEditing={isEditing} />
              <InfoField icon={Calendar} label="Tanggal Lahir" value={profile.tglLahir} isEditing={isEditing} />
              <InfoField icon={Briefcase} label="Pendidikan Terakhir" value={profile.pendidikan} isEditing={isEditing} />
              <div className="md:col-span-2">
                <InfoField icon={MapPin} label="Alamat Domisili" value={profile.alamat} isEditing={isEditing} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Komponen Kecil untuk Baris Informasi
const InfoField = ({ icon: Icon, label, value, isEditing }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 text-slate-400">
      <Icon size={16} />
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
    {isEditing ? (
      <input 
        type="text" 
        defaultValue={value}
        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-[#0a1e36] outline-none focus:ring-2 focus:ring-[#306896]"
      />
    ) : (
      <p className="text-sm font-bold text-[#0a1e36] pl-6">{value}</p>
    )}
  </div>
);

export default Settings;