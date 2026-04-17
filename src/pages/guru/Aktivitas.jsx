// src/pages/guru/Aktivitas.jsx
import React, { useState } from 'react';
import { Image as ImageIcon, Send, Heart, MessageCircle, MoreVertical, ThumbsUp } from 'lucide-react';

const Aktivitas = () => {
  // State untuk input postingan baru
  const [newPostContent, setNewPostContent] = useState('');
  
  // Data Dummy Feed Aktivitas (Simulasi dari Database)
  const [posts, setPosts] = useState([
    {
      id: 1,
      guru: 'Ibu Guru Ani',
      avatar: 'G',
      waktu: '3 Jam yang lalu',
      konten: 'Hari ini anak-anak kelas 4A belajar tentang pecahan menggunakan media buah-buahan. Seru sekali melihat antusiasme mereka memahami konsep matematika dengan cara yang menyenangkan!',
      gambar: 'https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=600&auto=format&fit=crop', // Gambar Ilustrasi Belajar
      likes: 12,
      comments: 3,
      myLike: false, // Menandai apakah guru ini sudah like/belum
    },
    {
      id: 2,
      guru: 'Pak Guru Budi',
      avatar: 'B',
      waktu: '5 Jam yang lalu',
      konten: 'Praktikum IPA minggu ini: Membuat gunung berapi sederhana. Eksperimen ini membantu siswa memahami reaksi kimia dasar dan struktur bumi. 🔥🌋',
      gambar: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=600&auto=format&fit=crop', // Gambar Ilustrasi Sains
      likes: 8,
      comments: 5,
      myLike: true,
    },
  ]);

  // Handler untuk Simulasi Like
  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.myLike ? post.likes - 1 : post.likes + 1,
          myLike: !post.myLike
        };
      }
      return post;
    }));
  };

  // Handler untuk Simulasi Post Baru
  const handleNewPost = (e) => {
    e.preventDefault();
    if(!newPostContent.trim()) return;

    const newPostData = {
      id: Date.now(),
      guru: 'Ibu Guru Ani', // Asumsi guru yang login
      avatar: 'G',
      waktu: 'Baru saja',
      konten: newPostContent,
      gambar: null, // Simulasi tanpa gambar dulu
      likes: 0,
      comments: 0,
      myLike: false,
    };

    setPosts([newPostData, ...posts]);
    setNewPostContent(''); // Reset input
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      
      {/* --- FORM PEMBUATAN POSTINGAN BARU --- */}
      <form onSubmit={handleNewPost} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-[#306896] border-2 border-white shadow-sm">
            G
          </div>
          <h2 className="text-xl font-extrabold text-[#0a1e36]">Post Aktivitas Pembelajaran</h2>
        </div>
        
        <textarea 
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Bagikan momen belajar hari ini,Ibu Guru Ani..."
          className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-md outline-none focus:border-[#306896] focus:ring-4 focus:ring-blue-50 transition-all min-h-[120px] resize-none placeholder:text-slate-400"
        />
        
        <div className="flex items-center justify-between gap-4 pt-2">
          {/* Tombol Upload Gambar (Simulasi) */}
          <button type="button" className="flex items-center gap-2.5 px-5 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 font-bold text-sm transition-all group">
            <ImageIcon size={18} className="text-[#306896] group-hover:scale-110 transition-transform" />
            Tambah Foto Kegiatan
          </button>
          
          {/* Tombol Bagikan */}
          <button type="submit" className="flex items-center gap-2.5 px-8 py-3 bg-[#306896] text-white rounded-xl font-bold text-sm hover:bg-[#25547a] transition-all shadow-lg shadow-blue-900/10 active:scale-95">
            <Send size={18} />
            Bagikan ke Ortu
          </button>
        </div>
      </form>

      {/* --- FEED AKTIVITAS (Daftar Postingan) --- */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-7 rounded-[2rem] border border-gray-100 shadow-sm space-y-5 animate-in slide-in-from-bottom-4 duration-300">
            
            {/* Header Post (Info Guru) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-[#306896]/10 rounded-full flex items-center justify-center text-[#306896] font-black text-sm border-2 border-white shadow-sm">
                  {post.avatar}
                </div>
                <div>
                  <p className="font-bold text-[#0a1e36]">{post.guru}</p>
                  <p className="text-[11px] text-slate-400 font-medium tracking-wide">{post.waktu}</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600 p-1">
                <MoreVertical size={20} />
              </button>
            </div>

            {/* Konten Teks */}
            <p className="text-slate-700 leading-relaxed text-[15px]">
              {post.konten}
            </p>

            {/* Konten Gambar (Hanya muncul jika ada) */}
            {post.gambar && (
              <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-inner group">
                <img 
                  src={post.gambar} 
                  alt="Aktivitas Belajar" 
                  className="w-full h-auto max-h-[400px] object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            )}

            {/* Bar Interaksi (Likes & Komen) */}
            <div className="flex items-center gap-6 pt-4 border-t border-slate-100 text-sm font-bold text-slate-500">
              {/* Tombol Like */}
              <button 
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-2.5 transition-colors ${post.myLike ? 'text-[#306896]' : 'hover:text-[#306896]'}`}
              >
                <ThumbsUp size={20} className={post.myLike ? 'fill-[#306896]/10' : ''} />
                <span>{post.likes} <span className="font-medium text-slate-400">Suka</span></span>
              </button>

              {/* Tombol Komen (Simulasi) */}
              <button className="flex items-center gap-2.5 hover:text-blue-600 transition-colors">
                <MessageCircle size={20} />
                <span>{post.comments} <span className="font-medium text-slate-400">Komentar Ortu</span></span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Aktivitas;