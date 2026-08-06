// src/components/RaporOfficialPDF.jsx
import React from 'react';
import html2pdf from 'html2pdf.js';

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

export const generateRaporPDF = async (reportData, elementId = "rapor-pdf-container") => {
  let element = document.getElementById(elementId);
  let isTemp = false;

  if (!element) {
    // 🛡️ FALLBACK OTOMATIS: Buat DOM tersembunyi secara dinamis agar 100% Bebas Error DOM
    isTemp = true;
    element = document.createElement("div");
    element.id = "temp-rapor-pdf-export";
    element.style.position = "absolute";
    element.style.left = "-9999px";
    element.style.top = "0";
    element.style.margin = "0";
    element.style.padding = "0";
    element.style.width = "194mm"; // 👈 Area cetak A4 presisi
    element.style.backgroundColor = "#ffffff";
    element.style.boxSizing = "border-box";

    const nama = reportData?.namaSiswa || reportData?.nama_siswa || "Siswa";
    const kelas = reportData?.kelompok || reportData?.rombel || "A";
    const semester = reportData?.semester || "2";
    const skorMap = reportData?.skorIndikator || reportData?.skor_indikator || {};
    const catatan = reportData?.catatanGuru || reportData?.rekomendasi_guru || reportData?.semesterRekomendasi || "";

    const isSelected = (key, pred) => {
      const val = skorMap[key];
      return val && val.toString().toUpperCase() === pred.toUpperCase();
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
          ['BM', 'MM', 'B', 'BSH', 'BB'].forEach((pred) => {
            const checked = isSelected(item.id, pred);
            const boxStyle = "display:inline-block; width:12px; height:12px; border:1px solid #000; text-align:center; line-height:10px; font-size:9px; font-weight:bold;";
            predCellsHtml += `<td style="text-align:center; vertical-align:middle; width:20%;">${checked ? `<span style="${boxStyle} background-color:#000; color:#fff;">✓</span>` : `<span style="${boxStyle}"></span>`}</td>`;
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
        <h1 style="text-align:center; font-weight:bold; font-size:17px; text-transform:uppercase; border-bottom:2px solid #000; padding-bottom:4px; margin-top:0; margin-bottom:12px; letter-spacing:0.5px;">PERKEMBANGAN ANAK DIDIK</h1>
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
            <p style="margin-bottom:40px; margin-top:0;">Taman Kanak-Kanak SITKA,<br/>Wali Kelas</p>
            <p style="border-bottom:1px solid #000; display:inline-block; width:150px; margin:0;">( ........................................ )</p>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(element);
  }

  const cleanName = (reportData?.namaSiswa || reportData?.nama_siswa || "Siswa").replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Rapor_PAUD_${cleanName}_Semester_${reportData?.semester || '2'}.pdf`;

  const opt = {
    margin: [6, 6, 6, 6], // Top, Left, Bottom, Right margin dalam mm
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true, 
      logging: false,
      scrollX: 0,
      scrollY: 0,
      onclone: (clonedDoc) => {
        // 🛡️ PERBAIKAN OKLCH TAILWIND V4: Bersihkan fungsi warna oklch yang tidak didukung html2canvas
        const styleTags = clonedDoc.querySelectorAll('style');
        styleTags.forEach((style) => {
          if (style.innerText && style.innerText.includes('oklch')) {
            style.innerText = style.innerText.replace(/oklch\([^)]+\)/gi, '#64748b');
          }
        });

        const allElements = clonedDoc.querySelectorAll('*');
        allElements.forEach((el) => {
          const inlineStyle = el.getAttribute('style');
          if (inlineStyle && inlineStyle.includes('oklch')) {
            el.setAttribute('style', inlineStyle.replace(/oklch\([^)]+\)/gi, '#64748b'));
          }
        });
      }
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'] } // 👈 Menghapus 'avoid-all' agar Halaman 1 TIDAK Kosong!
  };

  try {
    const pdfPromise = await html2pdf().set(opt).from(element).save();
    if (isTemp && element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
    return pdfPromise;
  } catch (err) {
    if (isTemp && element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
    throw err;
  }
};

const RaporOfficialPDF = ({ data }) => {
  const namaSiswa = data?.namaSiswa || data?.nama_siswa || "ALBIYAN ABDUL AZIZ";
  const kelas = data?.kelompok || data?.rombel || "A";
  const semester = data?.semester || "2";
  const skorMap = data?.skorIndikator || data?.skor_indikator || {};
  const catatanGuru = data?.catatanGuru || data?.rekomendasi_guru || data?.semesterRekomendasi || "";

  // Helper untuk menentukan apakah predikat cocok
  const isSelected = (itemKey, predicate) => {
    const val = skorMap[itemKey];
    if (!val) return false;
    return (val || '').toString().toUpperCase() === predicate.toUpperCase();
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
                          {['BM', 'MM', 'B', 'BSH', 'BB'].map((pred) => {
                            const checked = isSelected(item.id, pred);
                            return (
                              <span key={pred} className="inline-flex justify-center items-center text-xs">
                                {checked ? (
                                  <span className="w-3.5 h-3.5 bg-black text-white rounded-2xs flex items-center justify-center text-[10px] leading-none">✓</span>
                                ) : (
                                  <span className="w-3 h-3 border border-black inline-block rounded-2xs"></span>
                                )}
                              </span>
                            );
                          })}
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
          <p className="mb-10 mt-0">Taman Kanak-Kanak SITKA,<br/>Wali Kelas</p>
          <p className="border-b border-black inline-block min-w-36 m-0">( ........................................ )</p>
        </div>
      </div>
    </div>
  );
};

export default RaporOfficialPDF;
