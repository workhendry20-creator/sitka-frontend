// src/components/RaporPreviewModal.jsx
import React from 'react';
import { X, Download, Printer, FileText } from 'lucide-react';
import RaporOfficialPDF, { generateRaporPDF } from './RaporOfficialPDF';
import Swal from 'sweetalert2';

const RaporPreviewModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const namaSiswa = data?.namaSiswa || data?.nama_siswa || "Siswa";

  const handleDownload = async () => {
    Swal.fire({
      title: 'Mencetak Rapor PDF...',
      text: `Sedang mengunduh dokumen Rapor Official untuk ${namaSiswa}.`,
      allowOutsideClick: false,
      customClass: { popup: 'rounded-[2rem]' },
      didOpen: () => { Swal.showLoading(); }
    });

    try {
      await generateRaporPDF(data);
      Swal.fire({
        icon: 'success',
        title: 'PDF Terunduh! 📄',
        text: `Dokumen Rapor Official untuk ${namaSiswa} telah berhasil diunduh.`,
        confirmButtonColor: '#0a1e36',
        customClass: { popup: 'rounded-[2rem]' }
      });
    } catch (err) {
      console.error("Gagal mengunduh PDF:", err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Export PDF',
        text: err.message || 'Terjadi kesalahan saat mengunduh PDF. Silakan gunakan tombol Cetak.',
        confirmButtonColor: '#0a1e36',
        customClass: { popup: 'rounded-[2rem]' }
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      
      {/* KONTENER MODAL */}
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[92vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* MODAL HEADER */}
        <div className="p-6 bg-[#0a1e36] text-white border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600/30 text-amber-400 rounded-xl flex items-center justify-center border border-amber-400/20">
              <FileText size={22} />
            </div>
            <div>
              <h3 className="font-black text-base text-white">Preview Rapor Official PAUD</h3>
              <p className="text-xs text-indigo-300 font-bold">{namaSiswa.toUpperCase()} • Kelompok {data?.kelompok || 'A'}</p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Download size={16} /> Unduh PDF
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 hidden sm:flex"
            >
              <Printer size={16} /> Cetak
            </button>

            <button
              onClick={onClose}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all ml-2"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* MODAL BODY (CANVAS A4 PREVIEW) */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-200 flex justify-center items-start">
          <div className="shadow-2xl rounded-sm overflow-hidden bg-white max-w-full">
            <RaporOfficialPDF data={data} />
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-[#0a1e36] text-slate-400 border-t border-slate-800 text-xs font-bold text-center flex justify-between items-center px-8">
          <span>📄 Dokumen Rapor Resmi Kurikulum SPS FLAMBOYAN</span>
          <button onClick={onClose} className="text-amber-400 hover:underline">Tutup Preview</button>
        </div>

      </div>
    </div>
  );
};

export default RaporPreviewModal;
