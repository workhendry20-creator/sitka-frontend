// src/pages/ortu/Aktivitas.jsx
import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Send, Clock, User, MoreHorizontal } from 'lucide-react';
import Swal from 'sweetalert2';

const Aktivitas = () => {
  // Data Dummy Postingan Guru
  const [posts, setPosts] = useState([
    {
      id: 1,
      guru: "Ibu Guru Ani",
      role: "Wali Kelas A1",
      waktu: "2 jam yang lalu",
      caption: "Hari ini anak-anak belajar mengenal warna melalui teknik Finger Painting. Kreativitas mereka luar biasa! 🎨✨",
      image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=1000",
      likes: 12,
      isLiked: false,
      comments: [
        { id: 1, user: "Mama Budi", text: "Seru sekali kegiatannya Bu!" }
      ]
    },
    {
      id: 2,
      guru: "Pak Guru Budi",
      role: "Guru Olahraga",
      waktu: "5 jam yang lalu",
      caption: "Latihan fisik pagi ini: Melatih keseimbangan dan motorik kasar di lapangan sekolah. Semangat terus ya anak-anak! 🏃‍♂️",
      image: "https://images.unsplash.com/photo-1560439514-4e9645039924?auto=format&fit=crop&q=80&w=1000",
      likes: 8,
      isLiked: true,
      comments: []
    }
  ]);

  const [commentInput, setCommentInput] = useState({});

  // Fungsi Like
  const toggleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  // Fungsi Tambah Komentar
  const handleComment = (postId) => {
    if (!commentInput[postId]) return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, { id: Date.now(), user: "Mama Aditya", text: commentInput[postId] }]
        };
      }
      return post;
    }));

    setCommentInput({ ...commentInput, [postId]: '' });
    
    // Toast Notification
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
    });
    Toast.fire({ icon: 'success', title: 'Komentar terkirim' });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      
      {/* Header Info */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-[#0a1e36]">Jurnal Aktivitas</h2>
        <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.2em]">Melihat Momen Berharga Si Kecil</p>
      </div>

      {/* Feed Postingan */}
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
          
          {/* Post Header */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center font-black text-[#306896]">
                {post.guru.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-[#0a1e36] leading-none">{post.guru}</h4>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{post.role}</p>
              </div>
            </div>
            <button className="text-slate-300 hover:text-slate-500 transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>

          {/* Post Content (Image) */}
          <div className="relative aspect-video bg-slate-100">
            <img src={post.image} alt="Aktivitas" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2">
              <Clock size={12} className="text-[#306896]" />
              <span className="text-[10px] font-black text-[#306896] uppercase">{post.waktu}</span>
            </div>
          </div>

          {/* Post Actions */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => toggleLike(post.id)}
                className={`flex items-center gap-2 transition-all active:scale-90 ${post.isLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
              >
                <Heart size={24} fill={post.isLiked ? "currentColor" : "none"} />
                <span className="font-black text-sm">{post.likes}</span>
              </button>
              <div className="flex items-center gap-2 text-slate-400">
                <MessageCircle size={24} />
                <span className="font-black text-sm">{post.comments.length}</span>
              </div>
              <button className="ml-auto text-slate-400 hover:text-[#306896]">
                <Share2 size={24} />
              </button>
            </div>

            {/* Caption */}
            <p className="text-sm text-slate-700 leading-relaxed">
              <span className="font-black text-[#0a1e36] mr-2">{post.guru}</span>
              {post.caption}
            </p>

            {/* Comment Section */}
            <div className="space-y-3 pt-4 border-t border-gray-50">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 text-sm">
                  <span className="font-black text-[#0a1e36] whitespace-nowrap">{comment.user}</span>
                  <span className="text-slate-500 font-medium">{comment.text}</span>
                </div>
              ))}
            </div>

            {/* Input Komentar */}
            <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100 mt-4 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-50 transition-all">
              <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center text-[10px] font-black text-orange-600">M</div>
              <input 
                type="text" 
                placeholder="Tulis apresiasi anda..."
                value={commentInput[post.id] || ''}
                onChange={(e) => setCommentInput({...commentInput, [post.id]: e.target.value})}
                onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
                className="flex-1 bg-transparent outline-none text-xs font-medium"
              />
              <button 
                onClick={() => handleComment(post.id)}
                className="p-2 text-[#306896] hover:scale-110 transition-transform"
              >
                <Send size={18} />
              </button>
            </div>
          </div>

        </div>
      ))}

    </div>
  );
};

export default Aktivitas;