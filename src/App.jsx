// src/App.jsx
import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

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
import Settings from './pages/guru/Settings';

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

function App() {
  return (
    <Routes>
      {/* --- RUTE AUTH --- */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* --- RUTE ROLE GURU --- */}
      <Route path="/guru" element={<GuruLayout><Outlet /></GuruLayout>}>
        <Route path="dashboard" element={<DashboardGuru />} />
        <Route path="nilai" element={<InputNilai />} />
        <Route path="absensi" element={<Absensi />} />
        <Route path="aktivitas" element={<Aktivitas />} />
        <Route path="report" element={<Report />} />
        <Route path="chat" element={<Chat />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* --- RUTE ROLE ORTU (DIPERBAIKI) --- */}
      <Route path="/ortu" element={<OrtuLayout><Outlet /></OrtuLayout>}>
        <Route path="dashboard" element={<DashboardOrtu />} />
        <Route path="laporan" element={<LaporanOrtu />} />
        <Route path="progress" element={<ProgressOrtu />} />
        <Route path="aktivitas" element={<AktivitasOrtu />} />
        <Route path="chat" element={<ChatOrtu />} />
        <Route path="settings" element={<SettingsOrtu />} />
      </Route>

      {/* --- RUTE ROLE ADMIN --- */}
      <Route path="/admin" element={<AdminLayout><Outlet /></AdminLayout>}>
        <Route path="dashboard" element={<DashboardAdmin />} />
        <Route path="users" element={<ManajemenUser />} />
        <Route path="perkembangan" element={<ManajemenPerkembangan />} />
        <Route path="kurikulum" element={<Kurikulum />} />
        <Route path="chat" element={<ChatAdmin />} />
      </Route>
    </Routes>
  );
}

export default App;