import React, { useState, useEffect, useRef } from 'react';
import { 
  Image as ImageIcon, Send, MessageCircle, 
  Heart, MoreHorizontal, X, User, Check
} from 'lucide-react';
import Swal from 'sweetalert2';

const PostAktivitas = () => {
  const [postText, setPostText] = useState('');
  const [selectedComments, setSelectedComments] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const imageInputRef = useRef(null);

  // State Postingan Global (Sync LocalStorage)
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Load postingan dari localStorage (murni data riil Guru)
    const saved = localStorage.getItem('sitka_posts');
    if (saved) {
      try { setPosts(JSON.parse(saved)); } catch(e) { setPosts([]); }
    }

    // Sinkronisasi antar tab/window
    const handleStorageChange = (e) => {
      if (e.key === 'sitka_posts' && e.newValue) {
        try { setPosts(JSON.parse(e.newValue)); } catch(e) { /* ignore */ }
      }
    };
    // Sinkronisasi dalam tab yang sama (dari ortu yg komentar/like)
    const handleCustomSync = () => {
      const latest = localStorage.getItem('sitka_posts');
      if (latest) try { setPosts(JSON.parse(latest)); } catch(e) { /* ignore */ }
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('sitka_posts_updated', handleCustomSync);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sitka_posts_updated', handleCustomSync);
    };
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        Swal.fire('Terlalu Besar', 'Maksimal ukuran gambar adalah 3MB', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = () => {
    if(!postText && !selectedImage) {
      Swal.fire('Informasi', 'Isi teks atau foto untuk diposting.', 'info');
      return;
    }
    
    // Ambil identitas guru dari sesi
    const userSession = JSON.parse(localStorage.getItem('user_session')) || { nama: 'Ibu Guru' };
    
    const newPost = {
      id: Date.now(),
      guru: userSession.nama,
      role: 'Wali Kelas',
      waktu: "Baru saja",
      konten: postText,
      image: selectedImage,
      likes: 0,
      isLiked: false,
      comments: []
    };
    
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('sitka_posts', JSON.stringify(updatedPosts));

    // 🔥 BROADCAST EVENT agar ortu yg sedang membuka halaman Aktivitas langsung update
    window.dispatchEvent(new CustomEvent('sitka_posts_updated', { detail: newPost }));

    Swal.fire({
      icon: 'success',
      title: 'Berhasil Terkirim!',
      text: 'Aktivitas sudah terbit di beranda orang tua secara real-time.',
      confirmButtonColor: '#4f46e5',
      customClass: { popup: 'rounded-[2rem]' }
    });
    setPostText('');
    setSelectedImage(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* --- BOX BUAT POSTINGAN --- */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
        {selectedImage && (
          <div className="relative inline-block mt-2 group animate-in fade-in duration-300">
            <img src={selectedImage} alt="Preview" className="w-[200px] h-auto object-cover rounded-xl shadow-md border border-slate-100" />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-3 -right-3 bg-rose-500 text-white rounded-full p-1 w-8 h-8 flex items-center justify-center hover:bg-rose-600 shadow-lg"
            >
              <X size={16} />
            </button>
          </div>
        )}
        <textarea 
          placeholder="Apa aktivitas seru hari ini, Bu Guru?"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px] resize-none transition-all"
        />
        <div className="flex items-center justify-between pt-2">
          <input 
            type="file" 
            accept="image/*"
            ref={imageInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
          <button 
            onClick={() => imageInputRef.current.click()}
            className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all font-bold text-xs"
          >
            <ImageIcon size={20} />
            {selectedImage ? "Ganti Foto" : "Tambah Foto"}
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
              {post.image && (
                <div className="mb-4 rounded-[1.5rem] overflow-hidden bg-slate-100 border border-slate-50 relative aspect-video">
                  <img src={post.image} alt="Media" className="w-full h-full object-cover" />
                </div>
              )}
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