// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Pages & Layouts
import Login from './pages/Login';
import Register from './pages/Register';
import GuruLayout from './layouts/GuruLayout'; 
import DashboardGuru from './pages/guru/DashboardGuru';
import InputNilai from './pages/guru/InputNilai';
import Absensi from './pages/guru/Absensi';
import Aktivitas from './pages/guru/Aktivitas';
import Report from './pages/guru/Report';
import Chat from './pages/guru/Chat'; 
import Settings from './pages/guru/Settings';

import OrtuLayout from './layouts/OrtuLayout';
import DashboardOrtu from './pages/ortu/DashboardOrtu';
import LaporanOrtu from './pages/ortu/Laporan';
import AktivitasOrtu from './pages/ortu/Aktivitas';
import ChatOrtu from './pages/ortu/Chat';
import SettingsOrtu from './pages/ortu/Settings';

import AdminLayout from './layouts/AdminLayout';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import ManajemenUser from "./pages/admin/ManajemenUser";
import ManajemenPerkembangan from "./pages/admin/ManajemenPerkembangan";
import Kurikulum from "./pages/admin/Kurikulum";
import ChatAdmin from "./pages/admin/Chat";

function App() {
  return (
    <Routes>
      {/* Rute Auth */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Rute Role Guru */}
      <Route 
        path="/guru/dashboard" 
        element={<GuruLayout><DashboardGuru /></GuruLayout>} 
      />
      <Route 
        path="/guru/nilai" 
        element={<GuruLayout><InputNilai /></GuruLayout>} 
      />
      <Route 
        path="/guru/absensi" 
        element={<GuruLayout><Absensi /></GuruLayout>} 
      />
      <Route 
        path="/guru/aktivitas" 
        element={<GuruLayout><Aktivitas /></GuruLayout>} 
      />
      <Route 
        path="/guru/report" 
        element={<GuruLayout><Report /></GuruLayout>} 
      />
      <Route 
        path="/guru/chat" 
        element={<GuruLayout><Chat /></GuruLayout>} 
      />
      <Route 
        path="/guru/settings" 
        element={<GuruLayout><Settings /></GuruLayout>} 
      />

      {/* Rute Role Ortu */}
      <Route 
        path="/ortu/dashboard" 
        element={<OrtuLayout><DashboardOrtu /></OrtuLayout>}
      />
      <Route 
        path="/ortu/laporan" 
        element={<OrtuLayout><LaporanOrtu /></OrtuLayout>} 
      />
      <Route 
        path="/ortu/aktivitas" 
        element={<OrtuLayout><AktivitasOrtu /></OrtuLayout>} 
      />
      <Route 
        path="/ortu/chat" 
        element={<OrtuLayout><ChatOrtu /></OrtuLayout>} 
      />
      <Route 
        path="/ortu/settings" 
        element={<OrtuLayout><SettingsOrtu /></OrtuLayout>} 
      />

      {/* Rute Role Admin (DIPERBAIKI: ManajemenUser sekarang dibungkus AdminLayout) */}
      <Route 
        path="/admin/dashboard" 
        element={<AdminLayout><DashboardAdmin /></AdminLayout>} 
      />
      <Route 
        path="/admin/users" 
        element={<AdminLayout><ManajemenUser /></AdminLayout>} 
      />
      <Route 
  path="/admin/perkembangan" 
  element={<AdminLayout><ManajemenPerkembangan /></AdminLayout>} 
/>
<Route 
  path="/admin/kurikulum" 
  element={<AdminLayout><Kurikulum /></AdminLayout>} 
/>
<Route 
  path="/admin/chat" 
  element={<AdminLayout><ChatAdmin /></AdminLayout>} 
/>
    </Routes>
  );
}

export default App;