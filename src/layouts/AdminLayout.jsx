// src/layouts/AdminLayout.jsx
import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, TrendingUp, BookOpen, 
  MessageSquare, LogOut, Menu, Bell, X, Shield 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Daftar menu navigasi Admin
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Manajemen User', icon: Users, path: '/admin/users' },
    { name: 'Manajemen Perkembangan', icon: TrendingUp, path: '/admin/perkembangan' },
    { name: 'Kurikulum', icon: BookOpen, path: '/admin/kurikulum' },
    { name: 'Chat', icon: MessageSquare, path: '/admin/chat' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 relative font-sans">
      {/* Overlay Sidebar untuk Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-[#0a1e36] text-white flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Shield size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight uppercase">SITKA</h1>
          </div>
          {/* Close button untuk mobile */}
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                onClick={() => setIsSidebarOpen(false)} // Tutup sidebar otomatis di mobile
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all duration-300 ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={22} /> {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Tombol Keluar */}
        <div className="p-6 border-t border-white/5">
          <Link to="/" className="flex items-center gap-4 px-4 py-4 text-red-400 font-bold w-full hover:bg-red-500/10 rounded-2xl transition-all">
            <LogOut size={22} /> Keluar
          </Link>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30">
          {/* Burger Menu Button */}
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-[#0a1e36]">
            <Menu size={24} />
          </button>
          
          <div className="hidden md:block">
            <span className="text-[10px] font-black text-slate-300 tracking-[0.3em] uppercase">
              Administrator System / {menuItems.find(i => i.path === location.pathname)?.name || 'Control Panel'}
            </span>
          </div>

          {/* Profil & Notifikasi */}
          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 p-2 hover:bg-slate-50 rounded-xl transition-all">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-4 text-right group cursor-pointer">
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-[#0a1e36]">Super Admin</p>
                <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest text-right">Root Access</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center font-black text-indigo-600 border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Area Konten Dinamis */}
        <div className="p-4 md:p-8 overflow-y-auto max-h-[calc(100vh-5rem)]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;