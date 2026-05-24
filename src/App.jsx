// src/App.jsx
import React, { useEffect, useState } from 'react';
import { Routes, Route, Outlet, Navigate, useNavigate } from 'react-router-dom';

// Import Layouts
import GuruLayout from './layouts/GuruLayout'; 
import OrtuLayout from './layouts/OrtuLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages - Auth
import Login from './pages/Login';
import Register from './pages/Register';

// Pages - Guru
import DashboardGuru from './pages/guru/DashboardGuru';
import InputNilai from './pages/guru/InputNilai';
import Absensi from './pages/guru/Absensi';
import Aktivitas from './pages/guru/Aktivitas';
import Report from './pages/guru/Report';
import Chat from './pages/guru/Chat'; 
import SettingsGuru from './pages/guru/Settings';

// Pages - Ortu
import DashboardOrtu from './pages/ortu/DashboardOrtu';
import LaporanOrtu from './pages/ortu/Laporan';
import ProgressOrtu from './pages/ortu/Progress';
import AktivitasOrtu from './pages/ortu/Aktivitas';
import ChatOrtu from './pages/ortu/Chat';
import SettingsOrtu from './pages/ortu/Settings';

// Pages - Admin
import DashboardAdmin from './pages/admin/DashboardAdmin';
import ManajemenUser from "./pages/admin/ManajemenUser";
import ManajemenPerkembangan from "./pages/admin/ManajemenPerkembangan";
import Kurikulum from "./pages/admin/Kurikulum";
import ChatAdmin from "./pages/admin/Chat";
import SettingsAdmin from './pages/admin/Settings'; 

function App() {
  const [userSession, setUserSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Cek otomatis data login dari local storage browser saat aplikasi dimuat
    const savedSession = localStorage.getItem('user_session');
    if (savedSession) {
      setUserSession(JSON.parse(savedSession));
    }
    setLoading(false);
  }, []);

  // --- FUNGSI LOGOUT SAKTI ---
  const handleLogout = () => {
    // 1. Bersihkan data session dari browser
    localStorage.removeItem('user_session');
    // 2. Reset state di React pusat
    setUserSession(null);
    // 3. Kembalikan navigasi ke halaman depan
    navigate('/', { replace: true });
    // 4. Alert sukses estetik
    alert('✨ Anda telah keluar dari sistem SITKA. Sampai jumpa kembali, Senior! 🫡');
  };

  // Fungsi pembantu untuk mengamankan halaman berdasarkan Role akun
  const ProtectedRoute = ({ allowedRole, children }) => {
    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400">MEMUAT SISTEM SITKA...</div>;
    
    // Jika tidak ada data login, tendang balik ke halaman Login utama "/"
    if (!userSession) {
      return <Navigate to="/" replace />;
    }

    // Jika role akun di database tidak sesuai dengan rute yang diakses, tendang ke rute yang benar
    if (userSession.role !== allowedRole) {
      return <Navigate to={`/${userSession.role}/dashboard`} replace />;
    }

    return children;
  };

  return (
    <Routes>
      {/* --- RUTE AUTH --- */}
      <Route 
        path="/" 
        element={userSession ? <Navigate to={`/${userSession.role}/dashboard`} replace /> : <Login onLoginSuccess={(user) => setUserSession(user)} />} 
      />
      <Route 
        path="/register" 
        element={userSession ? <Navigate to={`/${userSession.role}/dashboard`} replace /> : <Register />} 
      />
      
      {/* --- RUTE ROLE GURU (TERPROTEKSI) --- */}
      <Route 
        path="/guru" 
        element={
          <ProtectedRoute allowedRole="guru">
            <GuruLayout onLogout={handleLogout} user={userSession}><Outlet /></GuruLayout>
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardGuru />} />
        <Route path="nilai" element={<InputNilai />} />
        <Route path="absensi" element={<Absensi />} />
        <Route path="aktivitas" element={<Aktivitas />} />
        <Route path="report" element={<Report />} />
        <Route path="chat" element={<Chat />} />
        <Route path="settings" element={<SettingsGuru />} />
      </Route>

      {/* --- RUTE ROLE ORTU (TERPROTEKSI) --- */}
      <Route 
        path="/ortu" 
        element={
          <ProtectedRoute allowedRole="ortu">
            <OrtuLayout onLogout={handleLogout} user={userSession}><Outlet /></OrtuLayout>
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardOrtu />} />
        <Route path="laporan" element={<LaporanOrtu />} />
        <Route path="progress" element={<ProgressOrtu />} />
        <Route path="aktivitas" element={<AktivitasOrtu />} />
        <Route path="chat" element={<ChatOrtu />} />
        <Route path="settings" element={<SettingsOrtu />} />
      </Route>

      {/* --- RUTE ROLE ADMIN (TERPROTEKSI) --- */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminLayout onLogout={handleLogout} user={userSession}><Outlet /></AdminLayout>
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardAdmin />} />
        <Route path="users" element={<ManajemenUser />} />
        <Route path="perkembangan" element={<ManajemenPerkembangan />} />
        <Route path="kurikulum" element={<Kurikulum />} />
        <Route path="chat" element={<ChatAdmin />} />
        <Route path="settings" element={<SettingsAdmin />} />
      </Route>

      {/* Rute Nyasar: Jika mengetik URL asal, otomatis dilempar balik */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;