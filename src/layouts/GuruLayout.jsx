// src/layouts/GuruLayout.jsx
import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, UserCheck, Heart, BookOpen,
  MessageSquare, FileText, Settings, LogOut, Menu, Bell, X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import logoImg from '../assets/logo.png';

const GuruLayout = ({ children, onLogout, user }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Otomatis tutup sidebar saat navigasi berubah di HP
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/guru/dashboard' },
    { name: 'Absensi Siswa', icon: UserCheck, path: '/guru/absensi' },
    { name: 'Jurnal Aktivitas', icon: Heart, path: '/guru/aktivitas' },
    { name: 'Input Nilai', icon: BookOpen, path: '/guru/input-nilai' },
    { name: 'Laporan Perkembangan', icon: FileText, path: '/guru/report' },
    { name: 'Pesan', icon: MessageSquare, path: '/guru/chat' },
  ];

  // FUNGSI LOGOUT DENGAN POP-UP SWEETALERT2 PREMIUM
  const handleLogoutClick = () => {
    Swal.fire({
      title: 'Konfirmasi Keluar',
      text: "Apakah Bunda/Yanda yakin ingin keluar dari akun?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#306896',
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
        onLogout();
      }
    });
  };

  return (
    <div className="flex h-screen bg-slate-50 relative overflow-hidden">

      {/* --- OVERLAY UNTUK MOBILE --- */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 flex flex-col md:flex-shrink-0 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo Area */}
        <div className="p-8 flex items-center justify-between">
          <Link to="/guru/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 p-1 rounded-xl flex items-center justify-center border border-blue-100 shadow-sm">
              <img src={logoImg} alt="Logo PAUD SITKA" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-black text-[#0a1e36] tracking-tight">SITKA</h1>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400">
            <X size={24} />
          </button>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all duration-200 ${isActive
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

        {/* Footer Sidebar - Tombol Keluar */}
        <div className="p-6 border-t border-gray-50">
          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-4 px-4 py-4 text-red-500 font-bold hover:bg-red-50 w-full rounded-2xl transition-all"
          >
            <LogOut size={22} />
            Keluar
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* HEADER */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 md:px-8 flex-shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-slate-100 rounded-lg md:hidden transition-colors"
            >
              <Menu className="text-[#0a1e36]" size={24} />
            </button>
            <span className="text-[10px] md:text-xs font-black text-slate-300 tracking-[0.3em] uppercase hidden sm:block">
              Main / {menuItems.find(i => i.path === location.pathname)?.name || 'Settings'}
            </span>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <button className="relative text-slate-400 hover:text-slate-600 p-2">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <Link to="/guru/settings" className="flex items-center gap-3 md:gap-4 text-right group transition-all">
              {/* 🔥 SEKARANG NAMA PROFIL SINKRON OTOMATIS DARI SUPABASE */}
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-[#0a1e36] group-hover:text-[#306896] transition-colors">
                  {user?.nama || 'Pengajar SITKA'}
                </p>
                <p className="text-[9px] font-black text-[#306896] tracking-widest uppercase">
                  {user?.role ? `TENAGA PENDIDIK ${user.role}` : 'GURU PAUD'}
                </p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-[#306896] border-2 border-white shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all">
                {user?.nama ? user.nama.charAt(0).toUpperCase() : 'G'}
              </div>
            </Link>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default GuruLayout;