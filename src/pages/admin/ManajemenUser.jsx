// src/pages/admin/ManajemenUser.jsx
import React, { useState, useEffect } from 'react';
import { Users, Search, UserPlus, GraduationCap, Key, Mail, Fingerprint } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import Swal from 'sweetalert2';

const ManajemenUser = () => {
  const [roleFilter, setRoleFilter] = useState('guru');
  const [searchTerm, setSearchTerm] = useState('');
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- AMBIL DATA USER UTAMA DARI SUPABASE ---
  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', roleFilter)
        .order('nama', { ascending: true });

      if (error) throw error;
      setUsersList(data || []);
    } catch (err) {
      console.error("Gagal mengambil data user:", err.message);
      Swal.fire({
        icon: 'error',
        title: 'Koneksi Gagal',
        text: 'Gagal sinkronisasi data pengguna dengan cloud.',
        confirmButtonColor: '#4f46e5'
      });
    } finally {
      setLoading(false);
    }
  };

  // --- FUNGSI HAPUS USER DARI DATABASE ---
  const handleDeleteUser = async (id, name) => {
    const result = await Swal.fire({
      title: 'Apakah Anda Yakin?',
      text: `Akun ${name} akan dihapus permanen dari sistem SI-FLAMBOYAN.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', id);

        if (error) throw error;

        Swal.fire({
          icon: 'success',
          title: 'Berhasil Dihapus',
          text: `Akun ${name} telah dibersihkan dari database cloud.`,
          confirmButtonColor: '#4f46e5'
        });

        fetchUsers();
      } catch (err) {
        console.error("Gagal menghapus user:", err.message);
        Swal.fire({
          icon: 'error',
          title: 'Gagal Menghapus',
          text: err.message,
          confirmButtonColor: '#4f46e5'
        });
      }
    }
  };

  // --- FILTER PENCARIAN CLIENT-SIDE ---
  const filteredUsers = usersList.filter((user) => {
    const namaUser = user.nama || '';
    const nipUser = user.nip || '';
    const tokenUser = user.token || '';

    const nameMatch = namaUser.toLowerCase().includes(searchTerm.toLowerCase());
    const nipMatch = nipUser.toLowerCase().includes(searchTerm.toLowerCase());
    const tokenMatch = tokenUser.toLowerCase().includes(searchTerm.toLowerCase());

    return nameMatch || nipMatch || tokenMatch;
  });

  // --- FUNGSI AMBIL PROFIL DETAIL COCOK RELASI "user_name" (ANTI-ERROR) ---
  const handleShowDetail = async (user) => {
    // Tampilkan loading spinner selagi menarik data relasi
    Swal.fire({
      title: 'Memuat Profil...',
      text: 'Sinkronisasi data sekunder profil...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const validTxt = (val) => (val && String(val).trim() !== '' ? val : '-');
    let p = {}; // Penampung objek profil tambahan

    try {
      if (user.role === 'guru') {
        // Tarik data profil_guru dicocokkan dengan nama user utama
        const { data: profilGuru } = await supabase
          .from('profil_guru')
          .select('*')
          .eq('user_name', user.nama)
          .maybeSingle();

        if (profilGuru) p = profilGuru;

        Swal.fire({
          title: '✨ Profil Lengkap Guru',
          html: `
            <div style="text-align: left; font-family: sans-serif; padding-top: 15px; border-top: 1px solid #f1f5f9; font-size: 14px;">
              <div style="margin-bottom: 12px;">
                <span style="color: #64748b; font-size: 10px; font-weight: 800; text-transform: uppercase; tracking-wider: 0.5px;">Nama Lengkap Pendidik</span>
                <p style="margin: 2px 0 0 0; font-size: 15px; font-weight: 700; color: #0a1e36;">${validTxt(user.nama)}</p>
              </div>
              <div style="margin-bottom: 12px;">
                <span style="color: #4f46e5; font-size: 10px; font-weight: 800; text-transform: uppercase; tracking-wider: 0.5px;">Nomor Induk Pegawai (NIP)</span>
                <p style="margin: 2px 0 0 0; font-size: 13px; font-weight: 600; color: #334155; font-family: monospace;">${validTxt(user.nip)}</p>
              </div>
              <div style="margin-bottom: 12px;">
                <span style="color: #64748b; font-size: 10px; font-weight: 800; text-transform: uppercase; tracking-wider: 0.5px;">Pendidikan Terakhir</span>
                <p style="margin: 2px 0 0 0; font-size: 13px; font-weight: 700; color: #0a1e36;">🎓 ${validTxt(p.pendidikan_terakhir)}</p>
              </div>
              <div style="margin-bottom: 12px;">
                <span style="color: #64748b; font-size: 10px; font-weight: 800; text-transform: uppercase; tracking-wider: 0.5px;">Nomor WhatsApp</span>
                <p style="margin: 2px 0 0 0; font-size: 13px; font-weight: 600; color: #334155;">📞 ${validTxt(p.no_whatsapp)}</p>
              </div>
              <div style="margin-bottom: 12px;">
                <span style="color: #64748b; font-size: 10px; font-weight: 800; text-transform: uppercase; tracking-wider: 0.5px;">Alamat Email</span>
                <p style="margin: 2px 0 0 0; font-size: 13px; font-weight: 600; color: #334155;">✉️ ${validTxt(p.alamat_email)}</p>
              </div>
              <div style="margin-bottom: 12px;">
                <span style="color: #64748b; font-size: 10px; font-weight: 800; text-transform: uppercase; tracking-wider: 0.5px;">Kata Sandi Akun</span>
                <p style="margin: 2px 0 0 0; font-size: 13px; font-weight: 600; color: #334155; font-family: monospace; background: #f8fafc; padding: 4px 10px; border-radius: 6px; width: fit-content; border: 1px solid #f1f5f9;">
                  ${validTxt(user.password)}
                </p>
              </div>
              <div>
                <span style="color: #10b981; font-size: 10px; font-weight: 800; text-transform: uppercase; tracking-wider: 0.5px;">Token Validasi SI-FLAMBOYAN</span>
                <p style="margin: 2px 0 0 0; font-size: 13px; font-weight: 800; color: #065f46;">🔐 ${validTxt(user.token)}</p>
              </div>
            </div>
          `,
          icon: 'success',
          confirmButtonText: 'Tutup Dokumen',
          confirmButtonColor: '#4f46e5',
        });

      } else {
        // Tarik data profil_ortu dicocokkan dengan nama user utama
        const { data: profilOrtu } = await supabase
          .from('profil_ortu')
          .select('*')
          .eq('user_name', user.nama)
          .maybeSingle();

        if (profilOrtu) p = profilOrtu;

        Swal.fire({
          title: '✨ Profil Orang Tua / Wali',
          html: `
            <div style="text-align: left; font-family: sans-serif; padding-top: 15px; border-top: 1px solid #f1f5f9; font-size: 14px;">
              <div style="margin-bottom: 12px;">
                <span style="color: #64748b; font-size: 10px; font-weight: 800; text-transform: uppercase; tracking-wider: 0.5px;">Nama Wali Murid</span>
                <p style="margin: 2px 0 0 0; font-size: 15px; font-weight: 700; color: #0a1e36;">${validTxt(user.nama)}</p>
              </div>
              <div style="margin-bottom: 12px;">
                <span style="color: #ea580c; font-size: 10px; font-weight: 800; text-transform: uppercase; tracking-wider: 0.5px;">Nama Anak Didik</span>
                <p style="margin: 2px 0 0 0; font-size: 14px; font-weight: 700; color: #4f46e5;">👦 ${validTxt(user.nama_anak)}</p>
              </div>
              <div style="margin-bottom: 12px;">
                <span style="color: #64748b; font-size: 10px; font-weight: 800; text-transform: uppercase; tracking-wider: 0.5px;">Kelompok Kelas Anak</span>
                <p style="margin: 2px 0 0 0; font-size: 13px; font-weight: 700; color: #334155; text-transform: uppercase;">${validTxt(user.kelompok)}</p>
              </div>
              <div style="margin-bottom: 12px;">
                <span style="color: #64748b; font-size: 10px; font-weight: 800; text-transform: uppercase; tracking-wider: 0.5px;">Hubungan Keluarga</span>
                <p style="margin: 2px 0 0 0; font-size: 13px; font-weight: 600; color: #334155;">👪 ${validTxt(p.hubungan_keluarga)}</p>
              </div>
              <div style="margin-bottom: 12px;">
                <span style="color: #64748b; font-size: 10px; font-weight: 800; text-transform: uppercase; tracking-wider: 0.5px;">Pekerjaan</span>
                <p style="margin: 2px 0 0 0; font-size: 13px; font-weight: 600; color: #334155;">💼 ${validTxt(p.pekerjaan)}</p>
              </div>
              <div style="margin-bottom: 12px;">
                <span style="color: #64748b; font-size: 10px; font-weight: 800; text-transform: uppercase; tracking-wider: 0.5px;">Nomor WhatsApp</span>
                <p style="margin: 2px 0 0 0; font-size: 13px; font-weight: 600; color: #334155;">📞 ${validTxt(p.no_whatsapp)}</p>
              </div>
              <div style="margin-bottom: 12px;">
                <span style="color: #64748b; font-size: 10px; font-weight: 800; text-transform: uppercase; tracking-wider: 0.5px;">Alamat Email</span>
                <p style="margin: 2px 0 0 0; font-size: 13px; font-weight: 600; color: #334155;">✉️ ${validTxt(p.alamat_email)}</p>
              </div>
              <div style="margin-bottom: 12px;">
                <span style="color: #64748b; font-size: 10px; font-weight: 800; text-transform: uppercase; tracking-wider: 0.5px;">Alamat Rumah</span>
                <p style="margin: 2px 0 0 0; font-size: 13px; font-weight: 600; color: #334155;">📍 ${validTxt(p.alamat_rumah)}</p>
              </div>
              <div style="margin-bottom: 12px;">
                <span style="color: #64748b; font-size: 10px; font-weight: 800; text-transform: uppercase; tracking-wider: 0.5px;">Kata Sandi Akses</span>
                <p style="margin: 2px 0 0 0; font-size: 13px; font-weight: 600; color: #334155; font-family: monospace; background: #f8fafc; padding: 4px 10px; border-radius: 6px; width: fit-content; border: 1px solid #f1f5f9;">
                  ${validTxt(user.password)}
                </p>
              </div>
              <div>
                <span style="color: #10b981; font-size: 10px; font-weight: 800; text-transform: uppercase; tracking-wider: 0.5px;">Token Validasi SI-FLAMBOYAN</span>
                <p style="margin: 2px 0 0 0; font-size: 13px; font-weight: 800; color: #065f46;">🔐 ${validTxt(user.token)}</p>
              </div>
            </div>
          `,
          icon: 'info',
          confirmButtonText: 'Selesai',
          confirmButtonColor: '#ea580c',
        });
      }
    } catch (err) {
      console.error("Bypass error profil:", err.message);
      // Fallback jika error, modal tetap muncul dengan sisa data ter-strip aman
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 text-left">
      
      {/* HEADER & FILTER */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
              <Users size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#0a1e36]">Manajemen Pengguna</h2>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Kelola Akun Guru & Orang Tua Cloud</p>
            </div>
          </div>
          <button 
            onClick={() => Swal.fire({
              title: `Tambah Akun ${roleFilter === 'guru' ? 'Guru' : 'Ortu'}`,
              text: 'Gunakan fitur registrasi bawaan atau jalankan query SQL untuk efisiensi massal.',
              icon: 'info',
              confirmButtonColor: '#4f46e5'
            })}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
          >
            <UserPlus size={18} /> Tambah {roleFilter === 'guru' ? 'Guru' : 'Ortu'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-gray-50">
          <div className="flex-shrink-0">
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full md:w-56 px-4 py-4 bg-slate-50 border border-transparent rounded-2xl text-xs font-black uppercase tracking-wider text-[#0a1e36] focus:bg-white focus:border-indigo-100 outline-none cursor-pointer transition-all"
            >
              <option value="guru">Role: GURU PENDIDIK</option>
              <option value="ortu">Role: ORANG TUA / WALI</option>
            </select>
          </div>
          
          <div className="relative flex-grow">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder={`Cari nama, token, atau NIP...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* TABLE DATA */}
      <div className="bg-white p-4 md:p-8 rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-20 font-bold text-indigo-600 animate-pulse">
            Sinkronisasi matriks otentikasi data pengguna...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16 text-slate-400 font-bold italic">
            Tidak ada data pengguna ber-role "{roleFilter}" yang ditemukan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="pb-6 pl-4">Profil Pengguna</th>
                  <th className="pb-6">{roleFilter === 'guru' ? 'Identitas (NIP)' : 'Kelompok Kelas'}</th>
                  <th className="pb-6">Akses Password</th>
                  <th className="pb-6">Status Akun</th>
                  <th className="pb-6 text-center">Aksi Operasional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="py-6 pl-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-sm ${roleFilter === 'guru' ? 'bg-indigo-600' : 'bg-orange-600'}`}>
                          {user.nama ? user.nama.charAt(0) : 'U'}
                        </div>
                        <div>
                          <span className="font-bold text-[#0a1e36] block">{user.nama || '-'}</span>
                          <span className="text-[10px] text-slate-400 font-mono">ID: #{user.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-6 font-bold text-slate-600 text-sm">
                      <div className="flex items-center gap-2">
                        <Fingerprint size={15} className="text-slate-400" />
                        <span>{roleFilter === 'guru' ? (user.nip || '-') : (user.kelompok || '-')}</span>
                      </div>
                    </td>

                    <td className="py-6">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Mail size={15} className="text-slate-400" />
                        <span className="text-sm font-mono tracking-wider bg-slate-100 px-2 py-1 rounded-lg text-slate-600">Pass: {user.password || '-'}</span>
                      </div>
                    </td>

                    <td className="py-6">
                      <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-xl w-fit text-xs font-black tracking-wider">
                        <Key size={14} />
                        <span className="uppercase">{user.role || '-'}</span>
                      </div>
                    </td>

                    <td className="py-6">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleShowDetail(user)}
                          className="px-3 py-2 bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl font-bold text-xs transition-all"
                        >
                          Lihat
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id, user.nama)}
                          className="px-3 py-2 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-xl font-bold text-xs transition-all"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManajemenUser;