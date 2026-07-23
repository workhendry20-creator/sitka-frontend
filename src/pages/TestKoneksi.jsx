// src/pages/TestKoneksi.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient'; // Dari folder pages naik 1 tingkat ke src baru ke utils

const TestKoneksi = () => {
  const [status, setStatus] = useState('Sedang mencoba terhubung ke Supabase...');
  const [dataSiswa, setDataSiswa] = useState([]);

  useEffect(() => {
    const cekKoneksiDanAmbilData = async () => {
      try {
        // Mencoba mengambil data dari tabel 'siswa'
        const { data, error } = await supabase.from('siswa').select('*');

        if (error) throw error;

        setStatus('🟢 BERHASIL CONNECT! Jembatan Database Aman, Senior!');
        setDataSiswa(data || []);
      } catch (err) {
        setStatus(`🔴 KONEKSI GAGAL: ${err.message}`);
      }
    };

    cekKoneksiDanAmbilData();
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'left' }}>
      <h2 style={{ fontWeight: 'bold', color: '#0a1e36', margin: 0 }}>SITKA Database Connection Test</h2>
      <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '20px' }}>Frontend ⇄ Supabase Cloud</p>
      
      <div style={{ 
        padding: '20px', borderRadius: '12px', backgroundColor: '#f8fafc', 
        border: '1px solid #e2e8f0', marginBottom: '20px', fontWeight: 'bold'
      }}>
        Status: {status}
      </div>
      <h3 style={{ color: '#4f46e5', margin: '10px 0' }}>Data Siswa Terdeteksi: {dataSiswa.length} anak</h3>
    </div>
  );
};

export default TestKoneksi;