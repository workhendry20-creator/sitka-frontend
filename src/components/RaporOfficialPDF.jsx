// src/components/RaporOfficialPDF.jsx
import React from 'react';
import html2pdf from 'html2pdf.js';
import logoImg from '../assets/logo.png';

// Dataset Indikator Resmi Sesuai Kurikulum PAUD / Dokumen Rapor
export const DEFAULT_RAPOR_STRUCTURE = [
  {
    categoryTitle: "I. Nilai Agama dan Moral",
    subcategories: [
      {
        subTitle: "",
        items: [
          { id: "nam_23_1", no: "1", text: "Dapat meniru gerakan berdoa" },
          { id: "nam_23_2", no: "2", text: "Dapat meniru doa doa pendek (minimal 3 doa pendek)" },
          { id: "nam_23_3", no: "3", text: "Memahami kapan mengucapkan salam, terima kasih, minta maaf, dll" }
        ]
      }
    ]
  },
  {
    categoryTitle: "II. Fisik Motorik",
    subcategories: [
      {
        subTitle: "1. Motorik Kasar",
        items: [
          { id: "mot_23_1", no: "1", text: "Berjalan sambil berjinjit" },
          { id: "mot_23_2", no: "2", text: "Melompat ke depan dan belakang dengan 2 kaki" },
          { id: "mot_23_3", no: "3", text: "Melempar dan menangkap bola" },
          { id: "mot_23_4", no: "4", text: "Menari mengikuti irama" },
          { id: "mot_23_5", no: "5", text: "Naik turun tangga dengan berpegangan" }
        ]
      },
      {
        subTitle: "2. Motorik Halus",
        items: [
          { id: "mot_23_6", no: "1", text: "Meremas kertas atau kain dengan menggerakan 5 jari" },
          { id: "mot_23_7", no: "2", text: "Melipat kertas walaupun belum rapi / belum lurus" },
          { id: "mot_23_8", no: "3", text: "Menggunting kertas sembarang (tanpa pola)" },
          { id: "mot_23_9", no: "4", text: "Koordinasi jari tangan, dapat memegang benda pipih seperti sikat gigi, sendok, dll" }
        ]
      }
    ]
  },
  {
    categoryTitle: "III. Kognitif",
    subcategories: [
      {
        subTitle: "1. Pengetahuan Umum",
        items: [
          { id: "kog_23_1", no: "1", text: "Menyebut bagian-bagian suatu gambar seperti bagian pada gambar wajah, mobil, binatang, dll" },
          { id: "kog_23_2", no: "2", text: "Dapat menyebutkan minimal 5 bagian tubuh" }
        ]
      },
      {
        subTitle: "2. Konsep Ukuran, Bentuk, dan Pola",
        items: [
          { id: "kog_23_3", no: "1", text: "Dapat membedakan konsep ukuran (Besar-Kecil, Panjang-Pendek)" },
          { id: "kog_23_4", no: "2", text: "Dapat menyebutkan atau menunjukan 3 macam bentuk (lingkarang, segitiga, bujur sangkar)" },
          { id: "kog_23_5", no: "3", text: "Mengenal Pola" }
        ]
      }
    ]
  },
  {
    categoryTitle: "IV. Bahasa",
    subcategories: [
      {
        subTitle: "1. Menerima Bahasa",
        items: [
          { id: "bah_23_1", no: "1", text: "Hafal beberapa lagu anak sederhana" },
          { id: "bah_23_2", no: "2", text: "Memahami cerita sederhana" },
          { id: "bah_23_3", no: "3", text: "Memahami perintah sederhana" }
        ]
      },
      {
        subTitle: "2. Mengungkapkan Bahasa",
        items: [
          { id: "bah_23_4", no: "1", text: "Dapat menggunakan kata tanya dengan tepat (apa, siapa, dimana, bagaimana,mengapa)" }
        ]
      }
    ]
  },
  {
    categoryTitle: "V. Sosial Emosional",
    subcategories: [
      {
        subTitle: "1. Kesadaran Diri",
        items: [
          { id: "se_23_1", no: "1", text: "Menyatakan keinginan ketika ingin BAK dan BAB" },
          { id: "se_23_2", no: "2", text: "Memahami hak orang lain (dapat antri, menunggu giliran, dll)" },
          { id: "se_23_3", no: "3", text: "Mau berbagi, membantu orang lain, bekerja sama" },
          { id: "se_23_4", no: "4", text: "Dapat menyatakan perasaan terhadap anak lain (suka dengan teman karena baik, atau tidak suka karena nakal)" },
          { id: "se_23_5", no: "5", text: "Dapat berbagi peran dalam suatu permainan (menjadi dokter, perawat, pasien)" }
        ]
      }
    ]
  }
];

// Helper konversi URL gambar ke Base64 Data URI dengan batas waktu timeout presisi agar 100% Tidak Pernah Ngefreeze
const getBase64Image = (imgUrl) => {
  return new Promise((resolve) => {
    if (!imgUrl || typeof window === 'undefined') return resolve('');

    // Safeguard: Batas waktu maksimal 1.5 detik. Jika konversi macet, langsung fallback kosong agar UI tidak freeze!
    const timer = setTimeout(() => {
      resolve('');
    }, 1500);

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      clearTimeout(timer);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width || 100;
        canvas.height = img.naturalHeight || img.height || 100;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      } catch (e) {
        resolve('');
      }
    };
    img.onerror = () => {
      clearTimeout(timer);
      resolve('');
    };
    img.src = imgUrl;
  });
};

export const generateRaporPDF = async (reportData) => {
  // 1. Dapatkan Base64 Data URI logo (dengan batas waktu 1.5 detik)
  const logoBase64 = await getBase64Image(logoImg);

  // 2. Selalu gunakan elemen DOM terisolasi bersih (Bebas dari pengaruh z-index modal, backdrop blur, & CSS OKLCH)
  const element = document.createElement("div");
  element.id = "temp-rapor-pdf-export";
  element.style.position = "absolute";
  element.style.left = "-9999px";
  element.style.top = "0";
  element.style.margin = "0";
  element.style.padding = "0";
  element.style.width = "194mm"; // Area cetak A4 presisi
  element.style.backgroundColor = "#ffffff";
  element.style.boxSizing = "border-box";

  const nama = reportData?.namaSiswa || reportData?.nama_siswa || "Siswa";
  const kelas = reportData?.kelompok || reportData?.rombel || "A";
  const semester = reportData?.semester || "2";
  const skorMap = reportData?.skorIndikator || reportData?.skor_indikator || {};
  const catatan = reportData?.catatanGuru || reportData?.rekomendasi_guru || reportData?.semesterRekomendasi || "";

  const getSingleSelectedColumn = (itemKey, sMap) => {
    if (!sMap || typeof sMap !== 'object') return null;

    let rawVal = sMap[itemKey];
    if (!rawVal) {
      const parts = itemKey.split(/_\d{2}_/);
      if (parts.length === 2) {
        for (const ageCode of ['_56_', '_45_', '_34_', '_23_']) {
          const altKey = `${parts[0]}${ageCode}${parts[1]}`;
          if (sMap[altKey]) {
            rawVal = sMap[altKey];
            break;
          }
        }
      }
    }

    if (!rawVal) return null;

    const valUpper = rawVal.toString().trim().toUpperCase();
    if (valUpper === 'BM') return 'BM';
    if (valUpper === 'MM') return 'MM';
    if (valUpper === 'B') return 'B';
    if (valUpper === 'BSH') return 'BSH';
    if (valUpper === 'BSB' || valUpper === 'BB') return 'BB';

    return valUpper;
  };

  let tableRowsHtml = "";
  DEFAULT_RAPOR_STRUCTURE.forEach((cat, cIdx) => {
    const roman = cIdx === 0 ? "I" : cIdx === 1 ? "II" : cIdx === 2 ? "III" : cIdx === 3 ? "IV" : "V";
    tableRowsHtml += `
      <tr style="border-top:1px solid #000; border-bottom:1px solid #000; font-weight:bold; background-color:#f9fafb;">
        <td style="border-right:1px solid #000; padding:4px 6px; text-align:center; vertical-align:top;">${roman}</td>
        <td style="border-right:1px solid #000; padding:4px 6px;" colSpan="2">${cat.categoryTitle}</td>
      </tr>
    `;

    cat.subcategories.forEach((sub) => {
      if (sub.subTitle) {
        tableRowsHtml += `
          <tr style="border-top:1px solid #000; border-bottom:1px solid #000; font-weight:bold; background-color:#ffffff;">
            <td style="border-right:1px solid #000; padding:3px 6px;"></td>
            <td style="border-right:1px solid #000; padding:4px 6px; padding-left:14px;" colSpan="2">${sub.subTitle}</td>
          </tr>
        `;
      }

      sub.items.forEach((item) => {
        let predCellsHtml = "";
        const targetCol = getSingleSelectedColumn(item.id, skorMap);

        ['BM', 'MM', 'B', 'BSH', 'BB'].forEach((pred) => {
          const isMatch = targetCol === pred;
          predCellsHtml += `<td style="text-align:center; vertical-align:middle; width:20%; font-size:12px; font-weight:bold; color:#000;">${isMatch ? '✓' : ''}</td>`;
        });

        tableRowsHtml += `
          <tr style="border-top:1px solid #000; font-size:10.5px; page-break-inside:avoid;">
            <td style="border-right:1px solid #000; padding:4px 6px; text-align:center;">${item.no}</td>
            <td style="border-right:1px solid #000; padding:4px 6px; line-height:1.3;">${item.text}</td>
            <td style="padding:3px 2px;">
              <table style="width:100%; border-collapse:collapse;"><tr>${predCellsHtml}</tr></table>
            </td>
          </tr>
        `;
      });
    });
  });

  element.innerHTML = `
    <div style="font-family:'Times New Roman', Georgia, serif; padding:12px 16px; color:#000; background:#fff; width:100%; box-sizing:border-box; margin:0;">
      <div style="display:flex; align-items:center; justify-content:center; gap:16px; margin-bottom:8px; padding-bottom:6px; border-bottom:2px solid #000;">
        ${logoBase64 ? `<img src="${logoBase64}" style="height:50px; width:auto; object-fit:contain;" />` : ''}
        <div style="text-align:center;">
          <h1 style="font-weight:bold; font-size:16px; text-transform:uppercase; margin:0; letter-spacing:0.5px; line-height:1.2;">LAPORAN PERKEMBANGAN ANAK DIDIK</h1>
          <div style="font-size:12px; font-weight:bold; letter-spacing:1px; margin-top:2px;">SISTEM INFORMASI & TUMBUH KEMBANG ANAK (PAUD SITKA)</div>
        </div>
      </div>
      <div style="margin-bottom:12px; font-weight:bold; font-size:11.5px; line-height:1.4;">
        <div>NAMA ANAK : ${nama.toUpperCase()}</div>
        <div>KELAS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ${kelas}</div>
        <div>SEMESTER &nbsp;&nbsp;: ${semester}</div>
      </div>

      <table style="width:100%; border-collapse:collapse; border:2px solid #000; font-size:10.5px;">
        <thead>
          <tr style="border-bottom:2px solid #000; background-color:#f3f4f6; page-break-inside:avoid;">
            <th style="border-right:1px solid #000; padding:5px; text-align:center; width:28px;">No</th>
            <th style="border-right:1px solid #000; padding:5px; text-align:center;">Aspek Perkembangan</th>
            <th style="padding:5px; text-align:center; width:180px;">
              <div style="border-bottom:1px solid #000; padding-bottom:3px; margin-bottom:3px; font-weight:bold;">Hasil Pengamatan</div>
              <table style="width:100%; border-collapse:collapse; font-weight:bold; font-size:9.5px;">
                <tr>
                  <td style="width:20%; text-align:center;">BM</td>
                  <td style="width:20%; text-align:center;">MM</td>
                  <td style="width:20%; text-align:center;">B</td>
                  <td style="width:20%; text-align:center;">BSH</td>
                  <td style="width:20%; text-align:center;">BB</td>
                </tr>
              </table>
            </th>
          </tr>
        </thead>
        <tbody>
          ${tableRowsHtml}
        </tbody>
      </table>

      <div style="margin-top:12px; font-size:10px; font-weight:bold; line-height:1.4; page-break-inside:avoid;">
        <div>BM &nbsp;&nbsp;: Belum Muncul</div>
        <div>MM &nbsp;&nbsp;: Mulai Muncul</div>
        <div>B &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: Berkembang</div>
        <div>BSH &nbsp;: Berkembang Sesuai Harapan</div>
        <div>BB &nbsp;&nbsp;&nbsp;: Berkembang dengan Baik</div>
      </div>

      ${catatan ? `
        <div style="margin-top:12px; border:2px solid #000; padding:8px 10px; font-size:10px; page-break-inside:avoid;">
          <div style="font-weight:bold; text-transform:uppercase; border-bottom:1px solid #000; padding-bottom:2px; margin-bottom:4px;">Catatan & Rekomendasi Guru:</div>
          <div style="font-style:italic; line-height:1.3;">"${catatan}"</div>
        </div>
      ` : ''}

      <div style="margin-top:24px; display:flex; justify-content:space-between; text-align:center; font-size:10px; font-weight:bold; page-break-inside:avoid;">
        <div style="width:40%;">
          <p style="margin-bottom:40px; margin-top:0;">Mengetahui,<br/>Orang Tua / Wali Murid</p>
          <p style="border-bottom:1px solid #000; display:inline-block; width:150px; margin:0;">( ........................................ )</p>
        </div>
        <div style="width:40%;">
          <p style="margin-bottom:40px; margin-top:0;">SPS FLAMBOYAN,<br/>Wali Kelas</p>
          <p style="border-bottom:1px solid #000; display:inline-block; width:150px; margin:0;">( ........................................ )</p>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(element);

  const cleanName = (reportData?.namaSiswa || reportData?.nama_siswa || "Siswa").replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Rapor_PAUD_${cleanName}_Semester_${reportData?.semester || '2'}.pdf`;

  const opt = {
    margin: [6, 6, 6, 6],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true, 
      allowTaint: true,
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 1024,
      onclone: (clonedDoc) => {
        // 🛡️ SOLUSI TUNTAS 100% BEBAS OKLCH:
        // 1. Bersihkan & ganti clonedDoc.head dengan CSS minimal murni
        // Dokumen Rapor PDF 100% menggunakan gaya inline murni, sehingga menghapus tag style Tailwind v4
        // menghilangkan 100% fungsi warna oklch yang memicu error pada html2canvas!
        try {
          if (clonedDoc.head) {
            clonedDoc.head.innerHTML = `
              <style>
                * { box-sizing: border-box; }
                body { margin: 0; padding: 0; background-color: #ffffff; color: #000000; font-family: 'Times New Roman', Georgia, serif; }
                table { border-collapse: collapse; }
              </style>
            `;
          }
        } catch (e) {}

        // 2. Hapus seluruh sisa tag style atau link stylesheet di body jika ada
        try {
          const extraStyles = clonedDoc.querySelectorAll('style, link');
          extraStyles.forEach(el => {
            try { el.remove(); } catch (e) {}
          });
        } catch (e) {}

        // 3. Sanitasi atribut style inline pada seluruh elemen
        try {
          const allElements = clonedDoc.querySelectorAll('*');
          allElements.forEach((el) => {
            try {
              const inlineStyle = el.getAttribute('style');
              if (inlineStyle && inlineStyle.includes('oklch')) {
                el.setAttribute('style', inlineStyle.replace(/oklch\([^)]+\)/gi, '#000000'));
              }
            } catch (e) {}
          });
        } catch (e) {}
      }
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'] }
  };

  try {
    // 🛡️ Promise.race dengan Timeout 10 detik: Mencegah PDF export menggantung (ngefreeze) secara permanen
    const pdfPromise = Promise.race([
      html2pdf().set(opt).from(element).save(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Waktu pembuatan PDF melebihi batas (Timeout 10 detik).")), 10000)
      )
    ]);
    await pdfPromise;
  } finally {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }
};

const RaporOfficialPDF = ({ data }) => {
  const namaSiswa = data?.namaSiswa || data?.nama_siswa || "ALBIYAN ABDUL AZIZ";
  const kelas = data?.kelompok || data?.rombel || "A";
  const semester = data?.semester || "2";
  const skorMap = data?.skorIndikator || data?.skor_indikator || {};
  const catatanGuru = data?.catatanGuru || data?.rekomendasi_guru || data?.semesterRekomendasi || "";

  const getSingleSelectedColumn = (itemKey) => {
    if (!skorMap || typeof skorMap !== 'object') return null;

    let rawVal = skorMap[itemKey];
    if (!rawVal) {
      const parts = itemKey.split(/_\d{2}_/);
      if (parts.length === 2) {
        for (const ageCode of ['_56_', '_45_', '_34_', '_23_']) {
          const altKey = `${parts[0]}${ageCode}${parts[1]}`;
          if (skorMap[altKey]) {
            rawVal = skorMap[altKey];
            break;
          }
        }
      }
    }

    if (!rawVal) return null;

    const valUpper = rawVal.toString().trim().toUpperCase();
    if (valUpper === 'BM') return 'BM';
    if (valUpper === 'MM') return 'MM';
    if (valUpper === 'B') return 'B';
    if (valUpper === 'BSH') return 'BSH';
    if (valUpper === 'BSB' || valUpper === 'BB') return 'BB';

    return valUpper;
  };

  return (
    <div 
      id="rapor-pdf-container" 
      className="bg-white text-black font-serif p-4 w-[194mm] mx-auto text-left leading-tight border border-gray-200 shadow-lg text-xs box-border m-0"
      style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
    >
      {/* JUDUL UTAMA */}
      <h1 className="text-center font-bold text-base tracking-wide uppercase mt-0 mb-3 text-black border-b-2 border-black pb-1">
        PERKEMBANGAN ANAK DIDIK
      </h1>

      {/* METADATA SISWA */}
      <div className="mb-3 font-bold space-y-0.5 text-xs">
        <div className="flex">
          <span className="w-28">NAMA ANAK</span>
          <span>: {namaSiswa.toUpperCase()}</span>
        </div>
        <div className="flex">
          <span className="w-28">KELAS</span>
          <span>: {kelas}</span>
        </div>
        <div className="flex">
          <span className="w-28">SEMESTER</span>
          <span>: {semester}</span>
        </div>
      </div>

      {/* TABEL PERKEMBANGAN 1:1 TEMPLATE PAUD */}
      <table className="w-full border-collapse border-2 border-black text-[10px]">
        <thead>
          <tr className="border-b-2 border-black bg-gray-100 page-break-inside-avoid">
            <th className="border-r border-black p-1 text-center w-7">No</th>
            <th className="border-r border-black p-1 text-center">Aspek Perkembangan</th>
            <th className="p-1 text-center w-44">
              <div className="border-b border-black pb-0.5 mb-1 font-bold">Hasil Pengamatan</div>
              <div className="grid grid-cols-5 text-center font-bold text-[9px]">
                <span>BM</span>
                <span>MM</span>
                <span>B</span>
                <span>BSH</span>
                <span>BB</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {DEFAULT_RAPOR_STRUCTURE.map((cat, cIdx) => (
            <React.Fragment key={cIdx}>
              {/* HEADING KATEGORI UTAMA */}
              <tr className="border-t border-b border-black font-bold bg-gray-50">
                <td className="border-r border-black p-1 text-center align-top">{cIdx === 0 ? "I" : cIdx === 1 ? "II" : cIdx === 2 ? "III" : cIdx === 3 ? "IV" : "V"}</td>
                <td className="border-r border-black p-1 font-bold" colSpan={2}>
                  {cat.categoryTitle}
                </td>
              </tr>

              {/* SUBKATEGORI & ITEM INDIKATOR */}
              {cat.subcategories.map((sub, sIdx) => (
                <React.Fragment key={sIdx}>
                  {sub.subTitle && (
                    <tr className="border-t border-b border-black font-bold bg-white">
                      <td className="border-r border-black p-1"></td>
                      <td className="border-r border-black p-1 font-bold pl-3" colSpan={2}>
                        {sub.subTitle}
                      </td>
                    </tr>
                  )}

                  {sub.items.map((item) => (
                    <tr key={item.id} className="border-t border-black hover:bg-gray-50 page-break-inside-avoid">
                      <td className="border-r border-black p-1 text-center align-middle">{item.no}</td>
                      <td className="border-r border-black p-1 align-middle leading-tight">{item.text}</td>
                      <td className="p-1 text-center align-middle">
                        <div className="grid grid-cols-5 text-center items-center h-full font-bold">
                          {(() => {
                            const targetCol = getSingleSelectedColumn(item.id);
                            return ['BM', 'MM', 'B', 'BSH', 'BB'].map((pred) => {
                              const isMatch = targetCol === pred;
                              return (
                                <span key={pred} className="inline-flex justify-center items-center text-xs">
                                  {isMatch ? (
                                    <span className="font-black text-black text-sm">✓</span>
                                  ) : (
                                    <span className="w-2.5 h-2.5 border border-slate-300 inline-block rounded-2xs"></span>
                                  )}
                                </span>
                              );
                            });
                          })()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* LEGENDA PREDIKAT */}
      <div className="mt-3 pt-1 text-[10px] font-bold space-y-0.5 page-break-inside-avoid">
        <div className="flex gap-2">
          <span className="w-10">BM</span>
          <span>: Belum Muncul</span>
        </div>
        <div className="flex gap-2">
          <span className="w-10">MM</span>
          <span>: Mulai Muncul</span>
        </div>
        <div className="flex gap-2">
          <span className="w-10">B</span>
          <span>: Berkembang</span>
        </div>
        <div className="flex gap-2">
          <span className="w-10">BSH</span>
          <span>: Berkembang Sesuai Harapan</span>
        </div>
        <div className="flex gap-2">
          <span className="w-10">BB</span>
          <span>: Berkembang dengan Baik</span>
        </div>
      </div>

      {/* CATATAN & REKOMENDASI GURU */}
      {catatanGuru && (
        <div className="mt-3 border-2 border-black p-2.5 text-[10px] page-break-inside-avoid">
          <h4 className="font-bold uppercase border-b border-black pb-1 mb-1">Catatan & Rekomendasi Guru:</h4>
          <p className="italic leading-tight">{catatanGuru}</p>
        </div>
      )}

      {/* TANDA TANGAN */}
      <div className="mt-6 flex justify-between text-center text-[10px] font-bold page-break-inside-avoid">
        <div>
          <p className="mb-10 mt-0">Mengetahui,<br/>Orang Tua / Wali Murid</p>
          <p className="border-b border-black inline-block min-w-36 m-0">( ........................................ )</p>
        </div>
        <div>
          <p className="mb-10 mt-0">SPS FLAMBOYAN,<br/>Wali Kelas</p>
          <p className="border-b border-black inline-block min-w-36 m-0">( ........................................ )</p>
        </div>
      </div>
    </div>
  );
};

export default RaporOfficialPDF;
