import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, TrendingUp, Database, 
  Megaphone, LogOut, Menu, Bell, X, Shield 
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Otomatis tutup sidebar saat pindah halaman di mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Manajemen User', icon: Users, path: '/admin/users' },
    { name: 'Manajemen Perkembangan', icon: TrendingUp, path: '/admin/perkembangan' },
    { name: 'Manajemen Data', icon: Database, path: '/admin/kurikulum' },
    { name: 'Informasi', icon: Megaphone, path: '/admin/chat' },
  ];

  // FUNGSI LOGOUT DENGAN POP-UP
  const handleLogout = () => {
    Swal.fire({
      title: 'Konfirmasi Keluar',
      text: "Apakah yakin ingin keluar dari SITKA?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#f43f5e',
      confirmButtonText: 'Ya, Keluar!',
      cancelButtonText: 'Batal',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-[2.5rem]',
        confirmButton: 'rounded-xl px-6 py-3 font-bold text-xs uppercase tracking-widest',
        cancelButton: 'rounded-xl px-6 py-3 font-bold text-xs uppercase tracking-widest'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Jika pakai token/session hapus di sini
        // localStorage.clear();
        navigate('/'); // Redirect ke landing page atau login
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans overflow-x-hidden">
      
      {/* 1. OVERLAY UNTUK MOBILE */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#0a1e36]/60 backdrop-blur-sm z-[60] md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 2. SIDEBAR RESPONSIVE */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-72 bg-[#0a1e36] text-white flex flex-col 
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:flex-shrink-0
      `}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Shield size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tight uppercase">SITKA ADMIN</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 p-1">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={20} /> 
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* TOMBOL KELUAR DENGAN FUNGSI SWAL */}
        <div className="p-6 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-4 text-red-400 font-bold w-full hover:bg-red-500/10 rounded-2xl transition-all"
          >
            <LogOut size={20} /> <span className="text-sm">Keluar</span>
          </button>
        </div>
      </aside>

      {/* 3. MAIN AREA */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* HEADER RESPONSIVE */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-50 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="md:hidden p-2 text-[#0a1e36] bg-slate-50 rounded-xl"
            >
              <Menu size={24} />
            </button>
            
            <div className="hidden md:block">
              <span className="text-[10px] font-black text-slate-300 tracking-[0.3em] uppercase">
                System / {menuItems.find(i => i.path === location.pathname)?.name || 'Admin'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <button className="relative text-slate-400 p-2 hover:bg-slate-50 rounded-xl transition-all">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-[#0a1e36]">Super Admin</p>
                <p className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">Root</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-100 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-indigo-600 border-2 border-white shadow-sm transition-transform active:scale-95">
                A
              </div>
            </div>
          </div>
        </header>

        {/* AREA KONTEN */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;