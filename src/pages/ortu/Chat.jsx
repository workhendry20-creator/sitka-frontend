// src/pages/ortu/Chat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, MoreVertical, Phone, Video, CheckCheck } from 'lucide-react';

const Chat = () => {
  // 1. Data Dummy Kontak (Daftar Guru)
  const teachers = [
    { 
      id: 1, 
      nama: 'Ibu Guru Ani', 
      mapel: 'Wali Kelas / Matematika', 
      online: true,
      messages: [
        { id: 1, sender: 'ortu', text: 'Selamat siang Bu, mau tanya PR Matematika halaman berapa ya?', time: '11:00' },
        { id: 2, sender: 'guru', text: 'Selamat siang Mama Aditya. Untuk PR-nya halaman 42 bagian A saja ya.', time: '11:15' },
      ]
    },
    { 
      id: 2, 
      nama: 'Pak Guru Budi', 
      mapel: 'Guru Olahraga', 
      online: false,
      messages: [
        { id: 1, sender: 'guru', text: 'Besok jangan lupa Aditya membawa baju ganti ya Bu.', time: 'Kemarin' },
      ]
    },
    { 
      id: 3, 
      nama: 'Ustadz Zaki', 
      mapel: 'Guru Agama', 
      online: true,
      messages: [
        { id: 1, sender: 'ortu', text: 'Terima kasih Ustadz, hafalan Aditya akan saya pantau di rumah.', time: '08:00' },
      ]
    }
  ];

  // 2. State Management
  const [activeId, setActiveId] = useState(1);
  const [messageText, setMessageText] = useState('');
  const [chatHistory, setChatHistory] = useState(teachers);
  const scrollRef = useRef(null);

  // Auto scroll ke bawah
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeId, chatHistory]);

  const currentChat = chatHistory.find(c => c.id === activeId);

  // 3. Fungsi Kirim Pesan
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'ortu', // Identitas pengirim sebagai Ortu
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = chatHistory.map(teacher => {
      if (teacher.id === activeId) {
        return { ...teacher, messages: [...teacher.messages, newMessage] };
      }
      return teacher;
    });

    setChatHistory(updatedHistory);
    setMessageText('');
  };

  return (
    <div className="flex bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden h-[calc(100vh-140px)] animate-in fade-in duration-500">
      
      {/* --- SIDEBAR KIRI (LIST GURU) --- */}
      <div className="w-full md:w-80 lg:w-[400px] border-r border-gray-100 flex flex-col bg-slate-50/30">
        <div className="p-6 bg-white border-b border-gray-50">
          <h2 className="text-2xl font-black text-[#0a1e36] mb-4">Chat Guru</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari guru..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-transparent rounded-2xl text-sm focus:border-blue-100 focus:bg-white transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {chatHistory.map((teacher) => (
            <button 
              key={teacher.id}
              onClick={() => setActiveId(teacher.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-[2rem] transition-all duration-300 ${
                activeId === teacher.id ? 'bg-white shadow-lg shadow-blue-900/5 ring-1 ring-blue-50' : 'hover:bg-white/60'
              }`}
            >
              <div className="relative">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg border-2 border-white shadow-sm ${
                  activeId === teacher.id ? 'bg-[#306896] text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {teacher.nama.charAt(0)}
                </div>
                {teacher.online && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-white rounded-full"></div>}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className="font-bold text-[#0a1e36] truncate">{teacher.nama}</h4>
                  <span className="text-[10px] font-bold text-slate-400">
                    {teacher.messages[teacher.messages.length - 1]?.time}
                  </span>
                </div>
                <p className="text-[11px] text-[#306896] font-black uppercase tracking-tighter mb-1">{teacher.mapel}</p>
                <p className="text-xs text-slate-500 truncate font-medium">
                  {teacher.messages[teacher.messages.length - 1]?.text}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* --- AREA KANAN (JENDELA CHAT) --- */}
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

        {/* Bubble Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/40"
          style={{ backgroundImage: 'radial-gradient(#cbd5e1 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }}
        >
          {currentChat.messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'ortu' ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[70%] group">
                <div className={`px-6 py-4 rounded-[2.2rem] text-[15px] font-medium shadow-sm leading-relaxed ${
                  msg.sender === 'ortu' 
                  ? 'bg-orange-600 text-white rounded-tr-none shadow-orange-900/10' // Warna Orange untuk identitas Ortu
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

        {/* Input Form */}
        <div className="p-6 bg-white border-t border-gray-50">
          <form onSubmit={handleSendMessage} className="flex items-center gap-4 bg-slate-50 p-2 rounded-[2rem] border border-slate-100 focus-within:bg-white focus-within:shadow-xl focus-within:shadow-orange-900/5 transition-all">
            <input 
              type="text" 
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={`Tulis pesan untuk ${currentChat.nama}...`}
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
      </div>

    </div>
  );
};

export default Chat;