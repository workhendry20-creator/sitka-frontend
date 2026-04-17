import React, { useState } from 'react';
import { Users, Search, UserPlus, GraduationCap, UserCheck, Key, Mail, Fingerprint } from 'lucide-react';

const ManajemenUser = () => {
  const [roleFilter, setRoleFilter] = useState('GURU');
  const [searchTerm, setSearchTerm] = useState('');

  // Data Dummy untuk Demo
  const dataGuru = [
    { id: 1, nama: "Budi Santoso, S.Pd", nip: "198802142015031002", email: "budi.guru@sitka.sch.id", token: "GURU-7721" },
    { id: 2, nama: "Siti Aminah, M.Pd", nip: "199205102019012005", email: "siti.guru@sitka.sch.id", token: "GURU-9902" },
  ];

  const dataOrtu = [
    { id: 1, nama: "Hendry Bambang", nisnAnak: "0012345678", email: "hendry.papa@email.com", anak: "Aditya Pratama" },
    { id: 2, nama: "Ibu Ratna", nisnAnak: "0012345679", email: "ratna.mama@email.com", anak: "Salsa Bella" },
  ];

  const currentData = roleFilter === 'GURU' ? dataGuru : dataOrtu;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* HEADER & FILTER */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
              <Users size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#0a1e36]">Manajemen Pengguna</h2>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Kelola Akun Guru & Orang Tua</p>
            </div>
          </div>
          <button className="flex items-center justify-center gap-3 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg active:scale-95">
            <UserPlus size={18} /> Tambah {roleFilter === 'GURU' ? 'Guru' : 'Ortu'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-gray-50">
          {/* Dropdown Filter */}
          <div className="flex-shrink-0">
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full md:w-48 px-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-[#0a1e36] focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
            >
              <option value="GURU">Role: GURU</option>
              <option value="ORTU">Role: ORTU</option>
            </select>
          </div>
          
          {/* Search Bar */}
          <div className="relative flex-grow">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder={`Cari nama atau ${roleFilter === 'GURU' ? 'NIP' : 'NISN Anak'}...`}
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* TABLE DATA */}
      <div className="bg-white p-4 md:p-8 rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="pb-6 pl-4">Profil Pengguna</th>
                <th className="pb-6">{roleFilter === 'GURU' ? 'Identitas (NIP)' : 'NISN Anak'}</th>
                <th className="pb-6">Kontak Email</th>
                <th className="pb-6">{roleFilter === 'GURU' ? 'Kode Token' : 'Nama Anak'}</th>
                <th className="pb-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentData.map((user) => (
                <tr key={user.id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="py-6 pl-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-sm ${roleFilter === 'GURU' ? 'bg-indigo-500' : 'bg-orange-500'}`}>
                        {user.nama.charAt(0)}
                      </div>
                      <span className="font-bold text-[#0a1e36]">{user.nama}</span>
                    </div>
                  </td>
                  <td className="py-6 font-medium text-slate-500 flex items-center gap-2 mt-2">
                    <Fingerprint size={14} className="text-slate-300" />
                    {roleFilter === 'GURU' ? user.nip : user.nisnAnak}
                  </td>
                  <td className="py-6">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Mail size={14} className="text-slate-300" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                  </td>
                  <td className="py-6">
                    {roleFilter === 'GURU' ? (
                      <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-xl w-fit">
                        <Key size={14} />
                        <span className="text-xs font-black tracking-wider">{user.token}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-indigo-600 font-bold">
                        <GraduationCap size={16} />
                        <span className="text-sm">{user.anak}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-6">
                    <div className="flex justify-center gap-2">
                      <button className="p-3 hover:bg-white rounded-xl text-slate-400 hover:text-indigo-600 hover:shadow-sm transition-all">
                        Edit
                      </button>
                      <button className="p-3 hover:bg-white rounded-xl text-slate-400 hover:text-red-600 hover:shadow-sm transition-all">
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManajemenUser;