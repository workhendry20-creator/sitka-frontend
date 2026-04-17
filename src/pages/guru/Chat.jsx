// src/pages/guru/Chat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, MoreVertical, Phone, Video, CheckCheck, User } from 'lucide-react';

const Chat = () => {
  // 1. Data Dummy Kontak (Daftar Orang Tua)
  const contacts = [
    { 
      id: 1, 
      nama: 'Mama Aditya', 
      siswa: 'Aditya Pratama', 
      online: true,
      messages: [
        { id: 1, sender: 'ortu', text: 'Selamat pagi Bu Guru, bagaimana perkembangan Aditya hari ini?', time: '09:00' },
        { id: 2, sender: 'guru', text: 'Selamat pagi Mama Aditya. Hari ini Aditya sangat aktif saat pelajaran Matematika.', time: '09:05' },
      ]
    },
    { 
      id: 2, 
      nama: 'Papa Budi', 
      siswa: 'Budi Santoso', 
      online: false,
      messages: [
        { id: 1, sender: 'ortu', text: 'Bu, besok Budi izin karena ada acara keluarga.', time: '08:15' },
        { id: 2, sender: 'guru', text: 'Baik Pak, terima kasih informasinya. Nanti tugasnya bisa menyusul.', time: '08:20' },
      ]
    },
    { 
      id: 3, 
      nama: 'Bunda Citra', 
      siswa: 'Citra Lestari', 
      online: true,
      messages: [
        { id: 1, sender: 'ortu', text: 'Hasil report Citra sudah saya terima, terima kasih ya Bu.', time: 'Kemarin' },
      ]
    }
  ];

  // 2. State Management
  const [activeId, setActiveId] = useState(1); // Default ke Mama Aditya
  const [messageText, setMessageText] = useState('');
  const [chatHistory, setChatHistory] = useState(contacts);
  const scrollRef = useRef(null);

  // Auto scroll ke bawah saat pesan bertambah
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeId, chatHistory]);

  // Mencari data kontak yang sedang aktif dipilih
  const currentChat = chatHistory.find(c => c.id === activeId);

  // 3. Fungsi Kirim Pesan
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'guru',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update history chat khusus untuk kontak yang aktif
    const updatedHistory = chatHistory.map(contact => {
      if (contact.id === activeId) {
        return { ...contact, messages: [...contact.messages, newMessage] };
      }
      return contact;
    });

    setChatHistory(updatedHistory);
    setMessageText('');
  };

  return (
    <div className="flex bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden h-[calc(100vh-140px)] animate-in fade-in duration-500">
      
      {/* --- SIDEBAR KIRI (LIST KONTAK) --- */}
      <div className="w-full md:w-80 lg:w-[400px] border-r border-gray-100 flex flex-col bg-slate-50/30">
        <div className="p-6 bg-white border-b border-gray-50">
          <h2 className="text-2xl font-black text-[#0a1e36] mb-4">Pesan Ortu</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari chat..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-transparent rounded-2xl text-sm focus:border-blue-100 focus:bg-white transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {chatHistory.map((contact) => (
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
                  {contact.nama.charAt(0)}
                </div>
                {contact.online && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-white rounded-full"></div>}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className="font-bold text-[#0a1e36] truncate">{contact.nama}</h4>
                  <span className="text-[10px] font-bold text-slate-400">
                    {contact.messages[contact.messages.length - 1]?.time}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter mb-1 italic">Siswa: {contact.siswa}</p>
                <p className="text-xs text-slate-500 truncate font-medium">
                  {contact.messages[contact.messages.length - 1]?.text}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* --- AREA KANAN (JENDELA CHAT AKTIF) --- */}
      <div className="flex-1 flex flex-col bg-white relative">
        {/* Header Chat */}
        <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-[#306896]">
              {currentChat.nama.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-[#0a1e36] text-lg">{currentChat.nama}</h3>
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
              <div className={`max-w-[70%] group`}>
                <div className={`px-6 py-4 rounded-[2.2rem] text-[15px] font-medium shadow-sm leading-relaxed ${
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
              placeholder={`Tulis pesan untuk ${currentChat.nama}...`}
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
      </div>

    </div>
  );
};

export default Chat;