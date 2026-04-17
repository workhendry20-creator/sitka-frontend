// src/pages/ortu/Settings.jsx
import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Heart, Calendar, ShieldCheck, Camera, Save, Baby } from 'lucide-react';
import Swal from 'sweetalert2';

const Settings = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Data Biodata Orang Tua & Anak
  const [profile, setProfile] = useState({
    nama: "Mama Aditya (Siti Aminah)",
    email: "siti.aminah@email.com",
    telepon: "0812-9876-5432",
    alamat: "Jl. Mawar No. 12, Cluster Cimahi Green, Jawa Barat",
    pekerjaan: "Wiraswasta",
    namaAnak: "Aditya Pratama",
    nisn: "0012345678",
    kelas: "A1 (TK Kecil)",
    hubungan: "Ibu Kandung"
  });

  const handleSave = () => {
    setIsEditing(false);
    Swal.fire({
      title: 'Profil Diperbarui!',
      text: 'Data profil Orang Tua telah berhasil disimpan.',
      icon: 'success',
      confirmButtonColor: '#ea580c', // Warna orange sesuai tema Ortu
      customClass: { popup: 'rounded-[2rem]' }
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Header Profil Ortu */}
      <div className="relative h-48 bg-gradient-to-r from-[#0a1e36] to-[#306896] rounded-[3rem] overflow-hidden shadow-xl">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="absolute -bottom-1 top-20 left-10 flex items-end gap-6">
          <div className="relative group">
            <div className="w-32 h-32 bg-white rounded-[2.5rem] p-2 shadow-2xl">
              <div className="w-full h-full bg-orange-100 rounded-[2rem] flex items-center justify-center text-orange-600 text-4xl font-black">
                M
              </div>
            </div>
            <button className="absolute bottom-2 right-2 p-2 bg-white rounded-xl shadow-lg text-orange-600 hover:scale-110 transition-transform">
              <Camera size={18} />
            </button>
          </div>
          <div className="mb-4 text-white">
            <h2 className="text-2xl font-black">{profile.nama}</h2>
            <p className="text-white/60 font-medium tracking-wide text-sm">{profile.hubungan} dari {profile.namaAnak}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
        
        {/* Kolom Kiri: Info Anak (Connected Account) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Data Anak Terhubung</h3>
            
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-orange-600 shadow-sm">
                <Baby size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-orange-600 uppercase">Nama Siswa</p>
                <p className="text-sm font-bold text-[#0a1e36]">{profile.namaAnak}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <ShieldCheck className="text-slate-400" size={24} />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">NISN</p>
                <p className="text-sm font-bold text-[#0a1e36]">{profile.nisn}</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              isEditing ? 'bg-green-500 text-white shadow-green-200 shadow-lg' : 'bg-orange-600 text-white shadow-orange-900/20 shadow-lg hover:bg-orange-700'
            }`}
          >
            {isEditing ? <><Save size={18} /> Simpan Perubahan</> : 'Edit Profil'}
          </button>
        </div>

        {/* Kolom Kanan: Biodata Orang Tua */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-[#0a1e36]">Informasi Orang Tua</h3>
              <div className="h-1 w-12 bg-orange-600 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InfoField icon={User} label="Pekerjaan" value={profile.pekerjaan} isEditing={isEditing} />
              <InfoField icon={Phone} label="Nomor WhatsApp" value={profile.telepon} isEditing={isEditing} />
              <InfoField icon={Mail} label="Alamat Email" value={profile.email} isEditing={isEditing} />
              <InfoField icon={Heart} label="Hubungan Keluarga" value={profile.hubungan} isEditing={isEditing} />
              <div className="md:col-span-2">
                <InfoField icon={MapPin} label="Alamat Rumah" value={profile.alamat} isEditing={isEditing} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Reusable InfoField Component
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
        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-[#0a1e36] outline-none focus:ring-2 focus:ring-orange-500"
      />
    ) : (
      <p className="text-sm font-bold text-[#0a1e36] pl-6">{value}</p>
    )}
  </div>
);

export default Settings;