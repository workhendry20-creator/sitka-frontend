import React, { useState } from 'react';
import { 
  Image as ImageIcon, Send, MessageCircle, 
  Heart, MoreHorizontal, X, User, Check
} from 'lucide-react';
import Swal from 'sweetalert2';

const PostAktivitas = () => {
  const [postText, setPostText] = useState('');
  const [selectedComments, setSelectedComments] = useState(null); // State untuk Modal

  // Data Dummy Postingan
  const [posts, setPosts] = useState([
    {
      id: 1,
      guru: "Ibu Siti Aminah",
      waktu: "2 jam yang lalu",
      konten: "Hari ini anak-anak Kelompok A belajar mewarnai menggunakan teknik gradasi. Semuanya sangat antusias! 🎨✨",
      likes: 12,
      comments: [
        { id: 1, user: "Mama Aditya", teks: "Wah seru banget! Aditya cerita terus tadi pas pulang.", waktu: "1 jam yang lalu" },
        { id: 2, user: "Papa Rizky", teks: "Hasil warnanya bagus-bagus ya bu.", waktu: "30 menit yang lalu" }
      ]
    },
    {
      id: 2,
      guru: "Ibu Siti Aminah",
      waktu: "5 jam yang lalu",
      konten: "Makan siang bersama dengan menu sehat: Sayur bayam dan telur dadar. Menanamkan kebiasaan makan sayur sejak dini. 🥗",
      likes: 8,
      comments: [
        { id: 3, user: "Bunda Salsa", teks: "Salsa tadi habis ya bu sayurnya?", waktu: "2 jam yang lalu" }
      ]
    }
  ]);

  const handlePost = () => {
    if(!postText) return;
    Swal.fire({
      icon: 'success',
      title: 'Berhasil Update!',
      text: 'Aktivitas sudah terbit di beranda orang tua.',
      confirmButtonColor: '#4f46e5'
    });
    setPostText('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* --- BOX BUAT POSTINGAN --- */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <textarea 
          placeholder="Apa aktivitas seru hari ini, Bu Guru?"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none min-h-[120px] resize-none"
        />
        <div className="flex items-center justify-between mt-4">
          <button className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-all font-bold text-xs">
            <ImageIcon size={20} className="text-indigo-500" />
            Tambah Foto
          </button>
          <button 
            onClick={handlePost}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-lg active:scale-95 transition-all"
          >
            <Send size={16} /> Posting
          </button>
        </div>
      </div>

      {/* --- FEED AKTIVITAS --- */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                    S
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#0a1e36]">{post.guru}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{post.waktu}</p>
                  </div>
                </div>
                <button className="text-slate-300"><MoreHorizontal size={20} /></button>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">{post.konten}</p>
              
              <div className="flex items-center gap-6 pt-4 border-t border-slate-50">
                <button className="flex items-center gap-2 text-slate-400 hover:text-rose-500 transition-all font-bold text-xs">
                  <Heart size={18} /> {post.likes}
                </button>
                {/* TOMBOL KOMENTAR - KLIK UNTUK LIHAT SIAPA YANG KOMEN */}
                <button 
                  onClick={() => setSelectedComments(post)}
                  className="flex items-center gap-2 text-indigo-600 hover:bg-indigo-50 px-3 py-1 rounded-lg transition-all font-bold text-xs"
                >
                  <MessageCircle size={18} /> {post.comments.length} Komentar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL DETAIL KOMENTAR --- */}
      {selectedComments && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0a1e36]/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-black text-[#0a1e36] flex items-center gap-2">
                <MessageCircle size={20} className="text-indigo-600" />
                Komentar Orang Tua
              </h3>
              <button 
                onClick={() => setSelectedComments(null)}
                className="p-2 hover:bg-white rounded-full transition-all text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-6 space-y-6">
              {selectedComments.comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-2xl flex-shrink-0 flex items-center justify-center text-slate-400 font-bold text-xs">
                    {comment.user.charAt(0)}
                  </div>
                  <div className="flex-1 bg-slate-50 p-4 rounded-2xl rounded-tl-none">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-[#0a1e36]">{comment.user}</span>
                      <span className="text-[9px] font-bold text-slate-400">{comment.waktu}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-normal">{comment.teks}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-white border-t border-slate-50">
              <button 
                onClick={() => setSelectedComments(null)}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-200"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PostAktivitas;