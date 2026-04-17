import React, { useState } from 'react';
import { BookOpen, Plus, Search, MoreVertical, Book, Star, Code, Edit3, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

const Kurikulum = () => {
  const [activeTab, setActiveTab] = useState('Akademik');

  const dataMapel = {
    Akademik: [
      { id: 1, kode: 'MAT-01', nama: 'Matematika', kkm: 75, jam: 4, status: 'Aktif' },
      { id: 2, kode: 'BIN-01', nama: 'Bahasa Indonesia', kkm: 75, jam: 3, status: 'Aktif' },
      { id: 3, kode: 'IPA-01', nama: 'Sains & IPA', kkm: 70, jam: 3, status: 'Draft' },
    ],
    Karakter: [
      { id: 4, kode: 'AGM-01', nama: 'Agama & Budi Pekerti', kkm: 80, jam: 2, status: 'Aktif' },
      { id: 5, kode: 'PKN-01', nama: 'Pancasila & Kewarganegaraan', kkm: 75, jam: 2, status: 'Aktif' },
    ],
    Skill: [
      { id: 6, kode: 'SND-01', nama: 'Seni & Desain', kkm: 70, jam: 2, status: 'Aktif' },
      { id: 7, kode: 'TKN-01', nama: 'Teknologi Informasi', kkm: 75, jam: 2, status: 'Aktif' },
    ]
  };

  const handleAddMapel = () => {
    Swal.fire({
      title: 'Tambah Mata Pelajaran',
      input: 'text',
      inputLabel: 'Nama Mata Pelajaran Baru',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#f43f5e',
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* HEADER */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
              <BookOpen size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#0a1e36]">Manajemen Kurikulum</h2>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Atur Mata Pelajaran & Standar KKM</p>
            </div>
          </div>
          
          <button 
            onClick={handleAddMapel}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-[#0a1e36] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
          >
            <Plus size={18} /> Tambah Mapel
          </button>
        </div>
      </div>

      {/* TABS SELECTOR */}
      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        {['Akademik', 'Karakter', 'Skill'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === tab 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'bg-white text-slate-400 hover:bg-slate-50'
            }`}
          >
            {tab === 'Akademik' && <Book size={14} className="inline mr-2" />}
            {tab === 'Karakter' && <Star size={14} className="inline mr-2" />}
            {tab === 'Skill' && <Code size={14} className="inline mr-2" />}
            {tab}
          </button>
        ))}
      </div>

      {/* LIST MAPEL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {dataMapel[activeTab].map((mapel) => (
          <div key={mapel.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:border-indigo-200 transition-all group relative">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold border border-slate-100">
                  {mapel.jam} JP
                </div>
                <div>
                  <h4 className="font-bold text-[#0a1e36] text-lg">{mapel.nama}</h4>
                  <span className="text-[10px] font-black text-slate-300 tracking-widest uppercase">{mapel.kode}</span>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter ${
                mapel.status === 'Aktif' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
              }`}>
                {mapel.status}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Standar KKM</p>
                <p className="text-xl font-black text-[#0a1e36]">{mapel.kkm}</p>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                  <Edit3 size={18} />
                </button>
                <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Kurikulum;