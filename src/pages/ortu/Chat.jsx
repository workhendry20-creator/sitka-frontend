// src/pages/ortu/Chat.jsx
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

  // --- AMBIL DAFTAR GURU SECARA REALTIME DARI SUPABASE ---
  useEffect(() => {
    fetchDaftarGuru();

    const handleStorage = (e) => {
      if (e.key === 'sitka_chats') {
        const globalChats = JSON.parse(e.newValue || '[]');
        const myUser = JSON.parse(localStorage.getItem('user_session')) || { id: 999 };
        
        setChatHistory(prevHistory => prevHistory.map(guru => {
          let msgs = globalChats.filter(m => m.guruId == guru.id && m.ortuId == myUser.id);
          if (msgs.length === 0) {
             msgs = [{ id: `init-${guru.id}`, sender: 'guru', text: `Assalamu'alaikum Mama/Papa, ada yang bisa kami bantu?`, time: '08:00' }];
          }
          return { ...guru, messages: msgs };
        }));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const fetchDaftarGuru = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, nama')
        .eq('role', 'guru')
        .order('nama', { ascending: true });

      if (error) throw error;

      const myUser = JSON.parse(localStorage.getItem('user_session')) || { id: 999 };
      const globalChats = JSON.parse(localStorage.getItem('sitka_chats') || '[]');

      // Memetakan data guru asli dari DB dan menyematkan mapel/posisi dinamis beserta pembuka chat
      const formattedTeachers = data.map((guru, index) => {
        let posisiSistem = 'Guru Pendamping';
        if (guru.nama.includes('Budi')) posisiSistem = 'Wali Kelas / Pendidik Utama';
        else if (guru.nama.includes('Endah')) posisiSistem = 'Guru Sentra Balok';
        else if (guru.nama.includes('Ahmad')) posisiSistem = 'Guru Agama / Tahfidz';

        let msgs = globalChats.filter(m => m.guruId == guru.id && m.ortuId == myUser.id);
        if (msgs.length === 0) {
           msgs = [{ id: `init-${guru.id}`, sender: 'guru', text: `Assalamu'alaikum Mama/Papa, ada yang bisa kami bantu mengenai perkembangan ananda di sekolah?`, time: '08:00' }];
        }

        return {
          id: guru.id,
          nama: guru.nama, // Nama Asli dari DB (Contoh: Budi Santoso, S.Pd)
          mapel: posisiSistem,
          online: index !== 1, // Simulasi status online
          messages: msgs
        };
      });

      setChatHistory(formattedTeachers);
      if (formattedTeachers.length > 0) {
        setActiveId(formattedTeachers[0].id);
      }
    } catch (err) {
      console.error("Gagal sinkronisasi daftar kontak guru:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto scroll ke bawah setiap ada pesan masuk atau berganti room chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeId, chatHistory]);

  const currentChat = chatHistory.find(c => c.id === activeId);

  // --- FUNGSI KIRIM PESAN DARI SISI ORANG TUA ---
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeId) return;

    const myUser = JSON.parse(localStorage.getItem('user_session')) || { id: 999 };

    const newMessage = {
      id: Date.now(),
      guruId: activeId,
      ortuId: myUser.id,
      sender: 'ortu', // Identitas pengirim dikunci sebagai Ortu (Warna Oranye)
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const globalChats = JSON.parse(localStorage.getItem('sitka_chats') || '[]');
    globalChats.push(newMessage);
    localStorage.setItem('sitka_chats', JSON.stringify(globalChats));

    setChatHistory(prev => prev.map(teacher => {
      if (teacher.id === activeId) {
        return { ...teacher, messages: [...teacher.messages, newMessage] };
      }
      return teacher;
    }));
    setMessageText('');
  };

  // Pencarian kontak guru berdasarkan input teks
  const filteredTeachers = chatHistory.filter(teacher =>
    teacher.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex bg-white rounded-[2.5rem] border border-gray-100 shadow-sm h-[calc(100vh-140px)] items-center justify-center font-bold text-orange-600 animate-pulse">
        Menghubungkan ke server kontak Guru SITKA...
      </div>
    );
  }

  return (
    <div className="flex bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden h-[calc(100vh-140px)] animate-in fade-in duration-500 text-left">
      
      {/* --- SIDEBAR KIRI (LIST GURU AKTIF REALTIME) --- */}
      <div className="w-full md:w-80 lg:w-[400px] border-r border-gray-100 flex flex-col bg-slate-50/30">
        <div className="p-6 bg-white border-b border-gray-50">
          <h2 className="text-2xl font-black text-[#0a1e36] mb-4">Chat Guru</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari guru pembimbing..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-transparent rounded-2xl text-sm focus:border-orange-100 focus:bg-white transition-all outline-none font-medium"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredTeachers.length === 0 ? (
            <p className="text-xs text-slate-400 font-bold italic text-center py-8">Nama guru tidak ditemukan.</p>
          ) : (
            filteredTeachers.map((teacher) => (
              <button 
                key={teacher.id}
                onClick={() => setActiveId(teacher.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-[2rem] transition-all duration-300 ${
                  activeId === teacher.id ? 'bg-white shadow-lg shadow-orange-900/5 ring-1 ring-orange-50' : 'hover:bg-white/60'
                }`}
              >
                <div className="relative">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg border-2 border-white shadow-sm ${
                    activeId === teacher.id ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {teacher.nama ? teacher.nama.charAt(0) : 'G'}
                  </div>
                  {teacher.online && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-white rounded-full"></div>}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <h4 className="font-bold text-[#0a1e36] truncate text-sm">{teacher.nama}</h4>
                    <span className="text-[10px] font-bold text-slate-400">
                      {teacher.messages[teacher.messages.length - 1]?.time}
                    </span>
                  </div>
                  <p className="text-[10px] text-orange-600 font-black uppercase tracking-tighter mb-1">{teacher.mapel}</p>
                  <p className="text-xs text-slate-500 truncate font-medium">
                    {teacher.messages[teacher.messages.length - 1]?.text}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* --- AREA KANAN (JENDELA CHAT AKTIF) --- */}
      <div className="flex-1 flex flex-col bg-white relative">
        {currentChat ? (
          <>
            {/* Header Ruang Chat */}
            <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-orange-50 rounded-2xl flex items-center justify-center font-black text-orange-600">
                  {currentChat.nama ? currentChat.nama.charAt(0) : 'G'}
                </div>
                <div>
                  <h3 className="font-bold text-[#0a1e36] text-base">{currentChat.nama}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${currentChat.online ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {currentChat.online ? 'Online' : 'Offline'}
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

            {/* Bubble Obrolan */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/40"
              style={{ backgroundImage: 'radial-gradient(#cbd5e1 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }}
            >
              {currentChat.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'ortu' ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[70%] group">
                    <div className={`px-6 py-4 rounded-[2.2rem] text-[14px] font-medium shadow-sm leading-relaxed ${
                      msg.sender === 'ortu' 
                      ? 'bg-orange-600 text-white rounded-tr-none shadow-orange-900/10' 
                      : 'bg-white text-slate-700 rounded-tl-none border border-gray-100'
                    }`}>
                      {msg.text}
                    </div>
                    <div className={`flex items-center gap-1.5 mt-2 text-[10px] font-black text-slate-400 ${msg.sender === 'ortu' ? 'justify-end' : 'justify-start'}`}>
                      {msg.time}
                      {msg.sender === 'ortu' && <CheckCheck size={14} className="text-orange-600" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Form Pengiriman */}
            <div className="p-6 bg-white border-t border-gray-50">
              <form onSubmit={handleSendMessage} className="flex items-center gap-4 bg-slate-50 p-2 rounded-[2rem] border border-slate-100 focus-within:bg-white focus-within:shadow-xl focus-within:shadow-orange-900/5 transition-all">
                <input 
                  type="text" 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={`Tulis pesan konsultasi untuk ${currentChat.nama}...`}
                  className="flex-1 bg-transparent px-6 py-2 outline-none text-sm font-medium text-slate-700"
                />
                <button 
                  type="submit"
                  className="w-12 h-12 bg-orange-600 text-white rounded-2xl flex items-center justify-center hover:bg-orange-700 transition-all shadow-lg active:scale-90"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 font-bold italic">
            Belum ada kontak guru pembina yang dipilih.
          </div>
        )}
      </div>

    </div>
  );
};

export default Chat;