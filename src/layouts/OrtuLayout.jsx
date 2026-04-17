// src/layouts/OrtuLayout.jsx
import React, { useState } from 'react';
import { 
  LayoutDashboard, ClipboardList, Image as ImageIcon, 
  MessageSquare, LogOut, Menu, Bell, X 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const OrtuLayout = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/ortu/dashboard' },
    { name: 'Laporan', icon: ClipboardList, path: '/ortu/laporan' },
    { name: 'Aktivitas', icon: ImageIcon, path: '/ortu/aktivitas' },
    { name: 'Chat Guru', icon: MessageSquare, path: '/ortu/chat' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 relative">
      
      {/* --- OVERLAY UNTUK MOBILE --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo Area */}
        <div className="p-8 flex items-center justify-between">
          <Link to="/ortu/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#306896] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <h1 className="text-2xl font-black text-[#0a1e36] tracking-tight">SITKA</h1>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400">
            <X size={24} />
          </button>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all duration-200 ${
                  isActive 
                  ? 'bg-[#306896] text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                }`}
              >
                <item.icon size={22} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar */}
        <div className="p-6 border-t border-gray-50">
          <Link to="/" className="flex items-center gap-4 px-4 py-4 text-red-500 font-bold hover:bg-red-50 w-full rounded-2xl transition-all">
            <LogOut size={22} />
            Keluar
          </Link>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* HEADER */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 md:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-slate-100 rounded-lg md:hidden transition-colors"
            >
              <Menu className="text-[#0a1e36]" size={24} />
            </button>
            <span className="text-[10px] md:text-xs font-black text-slate-300 tracking-[0.3em] uppercase hidden sm:block">
              Parent Portal / {menuItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
            </span>
          </div>

          {/* Profil & Notifikasi (Dibuat identik dengan Guru) */}
          <div className="flex items-center gap-3 md:gap-6">
            <button className="relative text-slate-400 hover:text-slate-600 p-2">
               <Bell size={22} />
               <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
            </button>
            
            {/* KLIK AREA PROFIL MENUJU SETTINGS ORTU */}
            <Link to="/ortu/settings" className="flex items-center gap-3 md:gap-4 text-right group transition-all">
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-[#0a1e36] group-hover:text-[#306896] transition-colors">Mama Aditya</p>
                <p className="text-[9px] font-black text-orange-600 tracking-widest uppercase">Orang Tua Murid</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-orange-600 border-2 border-white shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all">
                M
              </div>
            </Link>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default OrtuLayout;