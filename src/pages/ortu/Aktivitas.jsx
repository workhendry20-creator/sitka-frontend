// src/pages/ortu/Aktivitas.jsx
import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Send, Clock, User, MoreHorizontal } from 'lucide-react';
import Swal from 'sweetalert2';

const Aktivitas = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('sitka_posts');
    if (saved) {
      setPosts(JSON.parse(saved));
    }
    
    // Auto-refresh via storage event untuk cross-tab
    const handleStorageChange = (e) => {
      if (e.key === 'sitka_posts' && e.newValue) setPosts(JSON.parse(e.newValue));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const [commentInput, setCommentInput] = useState({});

  // Fungsi Like
  const toggleLike = (postId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem('sitka_posts', JSON.stringify(updatedPosts));
  };

  // Fungsi Tambah Komentar
  const handleComment = (postId) => {
    if (!commentInput[postId]) return;
    
    const userSession = JSON.parse(localStorage.getItem('user_session')) || { nama: 'Orang Tua' };

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, { id: Date.now(), user: userSession.nama, teks: commentInput[postId], waktu: "Baru saja" }]
        };
      }
      return post;
    });
    
    setPosts(updatedPosts);
    localStorage.setItem('sitka_posts', JSON.stringify(updatedPosts));

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
          {post.image && (
            <div className="relative aspect-video bg-slate-100">
              <img src={post.image} alt="Aktivitas" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2">
                <Clock size={12} className="text-[#306896]" />
                <span className="text-[10px] font-black text-[#306896] uppercase">{post.waktu}</span>
              </div>
            </div>
          )}

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
              {post.konten}
            </p>

            {/* Comment Section */}
            <div className="space-y-3 pt-4 border-t border-gray-50">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 text-sm">
                  <span className="font-black text-[#0a1e36] whitespace-nowrap">{comment.user}</span>
                  <span className="text-slate-500 font-medium">{comment.teks || comment.text}</span>
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