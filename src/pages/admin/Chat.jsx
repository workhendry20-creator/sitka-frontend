import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, User, MoreVertical, Paperclip, Smile } from 'lucide-react';

const ChatAdmin = () => {
  const [selectedGuru, setSelectedGuru] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  // State untuk menyimpan percakapan dinamis
  const [messages, setMessages] = useState([
    { id: 1, sender: 'guru', text: "Halo Admin, saya ada kendala input nilai.", time: "09:00" },
    { id: 2, sender: 'admin', text: "Halo Pak Budi, kendalanya di bagian mana ya?", time: "09:05" },
  ]);

  const scrollRef = useRef(null);

  // Auto scroll ke bawah setiap ada pesan baru
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const listGuru = [
    { id: 1, nama: "Budi Santoso, S.Pd", status: "Online", avatar: "B", lastMsg: "Siap pak, laporan segera dikirim." },
    { id: 2, nama: "Siti Aminah, M.Pd", status: "Offline", avatar: "S", lastMsg: "Token guru saya tidak bisa dipakai." },
    { id: 3, nama: "Hendriawan, M.Kom", status: "Online", avatar: "H", lastMsg: "Jadwal kurikulum sudah oke." },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');

    const newMessage = {
      id: messages.length + 1,
      sender: 'admin',
      text: messageInput,
      time: timeString
    };

    setMessages([...messages, newMessage]);
    setMessageInput(''); // Kosongkan input setelah kirim
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* SIDEBAR KONTAK GURU */}
      <div className="w-full md:w-80 border-r border-gray-50 flex flex-col">
        <div className="p-6 border-b border-gray-50">
          <h2 className="text-xl font-black text-[#0a1e36] mb-4">Chat Guru</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari guru..." 
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {listGuru.map((guru) => (
            <div 
              key={guru.id}
              onClick={() => setSelectedGuru(guru)}
              className={`p-4 flex items-center gap-4 cursor-pointer transition-all ${selectedGuru?.id === guru.id ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'hover:bg-slate-50'}`}
            >
              <div className="relative">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${guru.status === 'Online' ? 'bg-indigo-500' : 'bg-slate-300'}`}>
                  {guru.avatar}
                </div>
                {guru.status === 'Online' && (
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-[#0a1e36] truncate">{guru.nama}</h4>
                <p className="text-[11px] text-slate-400 truncate">{guru.lastMsg}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AREA CHAT */}
      <div className="flex-1 flex flex-col bg-slate-50/50">
        {selectedGuru ? (
          <>
            {/* Header Chat */}
            <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center font-bold text-indigo-600">
                  {selectedGuru.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0a1e36]">{selectedGuru.nama}</h4>
                  <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">{selectedGuru.status}</p>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><MoreVertical size={20} /></button>
            </div>

            {/* Bubble Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`max-w-[70%] p-4 rounded-2xl text-sm shadow-sm ${
                    msg.sender === 'admin' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-600 rounded-tl-none border border-gray-100'
                  }`}>
                    {msg.text}
                    <p className={`text-[9px] mt-1 font-medium ${msg.sender === 'admin' ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
              {/* Invisible element untuk auto-scroll */}
              <div ref={scrollRef} />
            </div>

            {/* Input Chat (Form agar bisa Enter untuk kirim) */}
            <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-gray-100">
              <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                <button type="button" className="p-2 text-slate-400 hover:text-indigo-600"><Smile size={20} /></button>
                <input 
                  type="text" 
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Ketik pesan untuk guru..."
                  className="flex-1 bg-transparent border-none outline-none text-sm px-2"
                />
                <button 
                  type="submit"
                  disabled={!messageInput.trim()}
                  className={`p-3 rounded-xl shadow-md transition-all active:scale-95 ${messageInput.trim() ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-200 text-slate-400'}`}
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm">
              <User size={40} className="text-slate-200" />
            </div>
            <p className="font-bold text-sm tracking-widest uppercase text-center">Pilih guru untuk<br/>memulai koordinasi</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatAdmin;