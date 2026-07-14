// src/pages/admin/Chat.jsx
import React, { useState, useEffect } from 'react';
import { Megaphone, Send, Trash2, Bell, Clock } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import Swal from 'sweetalert2';

const ChatAdmin = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);

  // --- LOAD DATA DARI SUPABASE CLOUD ---
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pengumuman')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (err) {
      console.error("Gagal memuat pengumuman:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- KIPRAH BROADCAST DATA KE SUPABASE ---
  const handleSend = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    try {
      const { error } = await supabase
        .from('pengumuman')
        .insert([
          { title: formData.title, content: formData.content }
        ]);

      if (error) throw error;

      setFormData({ title: '', content: '' });
      Swal.fire({ 
        icon: 'success', 
        title: 'Broadcast Berhasil!', 
        text: 'Info pengumuman otomatis tayang di Dashboard Guru & Ortu.', 
        confirmButtonColor: '#0a1e36' 
      });

      fetchAnnouncements(); // Refresh data riwayat
    } catch (err) {
      console.error("Gagal mengirim broadcast:", err.message);
      Swal.fire({ 
        icon: 'error', 
        title: 'Gagal Broadcast', 
        text: err.message, 
        confirmButtonColor: '#ef4444' 
      });
    }
  };

  // --- HAPUS PENGUMUMAN DARI CLOUD ---
  const deleteInfo = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Pengumuman?',
      text: "Pengumuman ini juga akan hilang dari dashboard Guru & Ortu.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase
          .from('pengumuman')
          .delete()
          .eq('id', id);

        if (error) throw error;

        Swal.fire({ 
          icon: 'success', 
          title: 'Dihapus!', 
          text: 'Pengumuman ditarik dari peredaran.', 
          confirmButtonColor: '#0a1e36' 
        });
        
        fetchAnnouncements();
      } catch (err) {
        console.error("Gagal menghapus:", err.message);
      }
    }
  };

  // Helper formatting waktu lokalisasi Indonesia
  const formatIndoDate = (isoString) => {
    return new Date(isoString).toLocaleString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 text-left">
      <div className="bg-[#0a1e36] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-4">
          <Megaphone className="text-orange-400 -rotate-12" size={40} />
          <div>
            <h2 className="text-3xl font-black italic">Broadcast Center</h2>
            <p className="text-indigo-200 text-sm opacity-80">Kirim pesan pengumuman ke seluruh ekosistem SI-FLAMBOYAN Cloud</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Input */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="font-black text-[#0a1e36] mb-6 flex items-center gap-2 text-sm uppercase tracking-widest"><Send size={16}/> Info Baru</h3>
            <form onSubmit={handleSend} className="space-y-4">
              <input 
                type="text" placeholder="Judul Pengumuman"
                className="w-full px-5 py-4 bg-slate-50 rounded-2xl text-sm font-bold border-none focus:ring-2 focus:ring-orange-500 transition-all"
                value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
              <textarea 
                placeholder="Isi pesan..." rows="4"
                className="w-full px-5 py-4 bg-slate-50 rounded-2xl text-sm font-medium border-none focus:ring-2 focus:ring-orange-500 transition-all"
                value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})}
              ></textarea>
              <button className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-orange-200 active:scale-95 transition-all">
                Broadcast Sekarang
              </button>
            </form>
          </div>
        </div>

        {/* Riwayat List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-black text-[#0a1e36] flex items-center gap-2 ml-4 uppercase text-xs tracking-widest"><Clock size={16}/> Riwayat Pengumuman</h3>
          
          {loading ? (
            <div className="text-center py-10 font-bold text-indigo-600 animate-pulse">Menarik riwayat broadcast...</div>
          ) : announcements.map((info) => (
            <div key={info.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-3 group">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center"><Bell size={20}/></div>
                  <div>
                    <h4 className="font-black text-[#0a1e36]">{info.title}</h4>
                    <span className="text-[10px] font-bold text-slate-400">{formatIndoDate(info.created_at)}</span>
                  </div>
                </div>
                <button onClick={() => deleteInfo(info.id)} className="text-slate-300 hover:text-red-500 p-2"><Trash2 size={18}/></button>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl italic">"{info.content}"</p>
            </div>
          ))}

          {!loading && announcements.length === 0 && (
            <div className="text-center py-10 text-slate-300 font-bold italic">Belum ada pengumuman terkirim...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatAdmin;