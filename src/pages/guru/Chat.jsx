// src/pages/guru/Chat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, MoreVertical, Phone, Video, CheckCheck } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

const Chat = () => {
  // --- STATE MANAGEMENT ---
  const [activeId, setActiveId] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // --- AMBIL DAFTAR WALI MURID (ORTU) DARI DATABASE ---
  useEffect(() => {
    fetchDaftarOrtu();

    const handleStorage = (e) => {
      if (e.key === 'sitka_chats') {
        const globalChats = JSON.parse(e.newValue || '[]');
        const myUser = JSON.parse(localStorage.getItem('user_session')) || { id: 999 };
        
        setChatHistory(prevHistory => prevHistory.map(ortu => {
          let msgs = globalChats.filter(m => m.guruId == myUser.id && m.ortuId == ortu.id);
          if (msgs.length === 0) {
             msgs = [{ id: `init-${ortu.id}`, sender: 'ortu', text: `Halo Ibu/Pak Guru, bagaimana perkembangan ${ortu.siswa || 'anak saya'} di sekolah hari ini?`, time: '08:30' }];
          }
          return { ...ortu, messages: msgs };
        }));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const fetchDaftarOrtu = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, nama, nama_anak, kelompok')
        .eq('role', 'ortu')
        .order('nama_anak', { ascending: true });

      if (error) throw error;

      const myUser = JSON.parse(localStorage.getItem('user_session')) || { id: 999 };
      const globalChats = JSON.parse(localStorage.getItem('sitka_chats') || '[]');

      // Map data Ortu dari DB dan berikan template chat pembuka awal
      const formattedContacts = data.map((ortu, index) => {
        let msgs = globalChats.filter(m => m.guruId == myUser.id && m.ortuId == ortu.id);
        if (msgs.length === 0) {
           msgs = [{ id: `init-${ortu.id}`, sender: 'ortu', text: `Halo Ibu/Pak Guru, bagaimana perkembangan ${ortu.nama_anak} di sekolah hari ini?`, time: '08:30' }];
        }

        return {
          id: ortu.id,
          nama: ortu.nama, // Nama Wali / Orang Tua
          siswa: ortu.nama_anak, // Nama Anak Didik
          kelompok: ortu.kelompok,
          online: index % 2 === 0, // Simulasi status keaktifan bergantian
          messages: msgs
        };
      });

      setChatHistory(formattedContacts);
      if (formattedContacts.length > 0) {
        setActiveId(formattedContacts[0].id);
      }
    } catch (err) {
      console.error("Gagal memuat kontak wali murid:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto scroll ke bawah saat ruang obrolan berpindah atau bertambah pesan
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeId, chatHistory]);

  const currentChat = chatHistory.find(c => c.id === activeId);

  // --- FUNGSI KIRIM PESAN GURU ---
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeId) return;

    const myUser = JSON.parse(localStorage.getItem('user_session')) || { id: 999 };

    const newMessage = {
      id: Date.now(),
      guruId: myUser.id,
      ortuId: activeId,
      sender: 'guru', // Identitas pengirim diset sebagai Guru
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const globalChats = JSON.parse(localStorage.getItem('sitka_chats') || '[]');
    globalChats.push(newMessage);
    localStorage.setItem('sitka_chats', JSON.stringify(globalChats));

    setChatHistory(prev => prev.map(contact => {
      if (contact.id === activeId) {
        return { ...contact, messages: [...contact.messages, newMessage] };
      }
      return contact;
    }));
    setMessageText('');
  };

  // Filter pencarian kontak berdasarkan nama Orang Tua atau nama Siswa
  const filteredContacts = chatHistory.filter(contact =>
    contact.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.siswa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex bg-white rounded-[2.5rem] border border-gray-100 shadow-sm h-[calc(100vh-140px)] items-center justify-center font-bold text-[#306896] animate-pulse">
        Menghubungkan ke enkripsi data obrolan Wali Murid...
      </div>
    );
  }

  return (
    <div className="flex bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden h-[calc(100vh-140px)] animate-in fade-in duration-500 text-left">
      
      {/* --- SIDEBAR KIRI (LIST KONTAK ORTU DARI SUPABASE) --- */}
      <div className="w-full md:w-80 lg:w-[400px] border-r border-gray-100 flex flex-col bg-slate-50/30">
        <div className="p-6 bg-white border-b border-gray-50">
          <h2 className="text-2xl font-black text-[#0a1e36] mb-4">Pesan Ortu</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama ortu atau siswa..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-transparent rounded-2xl text-sm focus:border-blue-100 focus:bg-white transition-all outline-none font-medium"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredContacts.length === 0 ? (
            <p className="text-xs text-slate-400 font-bold italic text-center py-8">Kontak tidak ditemukan.</p>
          ) : (
            filteredContacts.map((contact) => (
              <button 
                key={contact.id}
                onClick={() => setActiveId(contact.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-[2rem] transition-all duration-300 ${
                  activeId === contact.id ? 'bg-white shadow-lg shadow-blue-900/5 ring-1 ring-blue-50' : 'hover:bg-white/60'
                }`}
              >
                <div className="relative">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg border-2 border-white shadow-sm ${
                    activeId === contact.id ? 'bg-[#306896] text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {contact.nama ? contact.nama.charAt(0) : 'O'}
                  </div>
                  {contact.online && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-white rounded-full"></div>}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <h4 className="font-bold text-[#0a1e36] truncate text-sm">{contact.nama}</h4>
                    <span className="text-[10px] font-bold text-slate-400">
                      {contact.messages[contact.messages.length - 1]?.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[10px] text-slate-400 font-bold italic truncate">Siswa: {contact.siswa}</p>
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[8px] font-black rounded uppercase">{contact.kelompok}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate font-medium">
                    {contact.messages[contact.messages.length - 1]?.text}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* --- AREA KANAN (JENDELA CHAT AKTIF GURU) --- */}
      <div className="flex-1 flex flex-col bg-white relative">
        {currentChat ? (
          <>
            {/* Header Chat */}
            <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-blue-50 rounded-2xl flex items-center justify-center font-black text-[#306896]">
                  {currentChat.nama ? currentChat.nama.charAt(0) : 'O'}
                </div>
                <div>
                  <h3 className="font-bold text-[#0a1e36] text-base">{currentChat.nama}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${currentChat.online ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {currentChat.online ? 'Sedang Aktif' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <button className="p-3 hover:bg-slate-50 rounded-xl transition-colors"><Phone size={20} /></button>
                <button className="p-3 hover:bg-slate-50 rounded-xl transition-colors"><Video size={20} /></button>
                <button className="p-3 hover:bg-slate-50 rounded-xl transition-colors"><MoreVertical size={20} /></button>
              </div>
            </div>

            {/* Bubble Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/40"
              style={{ backgroundImage: 'radial-gradient(#cbd5e1 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }}
            >
              {currentChat.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'guru' ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[70%] group">
                    <div className={`px-6 py-4 rounded-[2.2rem] text-[14px] font-medium shadow-sm leading-relaxed ${
                      msg.sender === 'guru' 
                      ? 'bg-[#306896] text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 rounded-tl-none border border-gray-100'
                    }`}>
                      {msg.text}
                    </div>
                    <div className={`flex items-center gap-1.5 mt-2 text-[10px] font-black text-slate-400 ${msg.sender === 'guru' ? 'justify-end' : 'justify-start'}`}>
                      {msg.time}
                      {msg.sender === 'guru' && <CheckCheck size={14} className="text-[#306896]" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Form Input Pesan */}
            <div className="p-6 bg-white border-t border-gray-50">
              <form onSubmit={handleSendMessage} className="flex items-center gap-4 bg-slate-50 p-2 rounded-[2rem] border border-slate-100 focus-within:bg-white focus-within:shadow-xl focus-within:shadow-blue-900/5 transition-all">
                <input 
                  type="text" 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={`Tulis pesan tanggapan untuk ${currentChat.nama}...`}
                  className="flex-1 bg-transparent px-6 py-2 outline-none text-sm font-medium text-slate-700"
                />
                <button 
                  type="submit"
                  className="w-12 h-12 bg-[#306896] text-white rounded-2xl flex items-center justify-center hover:bg-[#25547a] transition-all shadow-lg active:scale-90"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 font-bold italic">
            Belum ada obrolan wali murid yang dipilih.
          </div>
        )}
      </div>

    </div>
  );
};

export default Chat;