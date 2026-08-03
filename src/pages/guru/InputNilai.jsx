// src/pages/guru/InputNilai.jsx
import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck, Calendar, Users,
  Save, User, Download, FileText, ChevronDown, BookOpen, Sparkles, Bot
} from 'lucide-react';
import Swal from 'sweetalert2';
import { supabase } from '../../utils/supabaseClient';
import { dapatkanRekomendasiAI } from '../../utils/naiveBayes'; // 👈 Tambahkan ini, Senior

const InputNilai = () => {
  // --- STATE UTAMA ---
  const [inputType, setInputType] = useState('Harian');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [kelompok, setKelompok] = useState('Kelompok A');
  const [selectedSemester, setSelectedSemester] = useState('1 (Ganjil)');
  const [selectedSiswaId, setSelectedSiswaId] = useState('');
  const [loading, setLoading] = useState(false);

  // State Dinamis Penampung Anak Didik dari Database Supabase
  const [anekdotSiswa, setAnekdotSiswa] = useState([]);

  // State untuk Rekapitulasi Global
  const [rekapData, setRekapData] = useState([]);

  const [selectedRekapDetail, setSelectedRekapDetail] = useState(null);

  // --- PARAMETER ADAPTIF: BERDASARKAN RENTANG USIA ANAK (DOKUMEN PAUD RESMI) ---
  const parameterAkademikBerdasarkanUsia = {
    "2-3 Tahun": [
      {
        kategori: "I. MORAL DAN NILAI-NILAI AGAMA",
        indikator: [
          { id: "nam_23_1", teks: "Dapat meniru gerakan berdo'a" },
          { id: "nam_23_2", teks: "Dapat meniru do'a-do'a pendek (Minimal 3 do'a pendek)" },
          { id: "nam_23_3", teks: "Memahami kapan mengucapkan salam, terima kasih, minta ma'af, dll." }
        ]
      },
      {
        kategori: "II. MOTORIK (A. Motorik Kasar)",
        indikator: [
          { id: "mot_23_1", teks: "Berjalan sambil berjinjit" },
          { id: "mot_23_2", teks: "Melompat ke depan dan ke belakang dengan 2 kaki" },
          { id: "mot_23_3", teks: "Melempar dan menangkap bola" },
          { id: "mot_23_4", teks: "Menari mengikuti irama" },
          { id: "mot_23_5", teks: "Naik turun tangga dengan berpegangan" }
        ]
      },
      {
        kategori: "II. MOTORIK (B. Motorik Halus)",
        indikator: [
          { id: "mot_23_6", teks: "Meremas kertas atau kain dengan menggerakkan 5 jari" },
          { id: "mot_23_7", teks: "Melipat kertas walaupun belum rapi/belum lurus" },
          { id: "mot_23_8", teks: "Menggunting kertas sembarang (tanpa pola)" },
          { id: "mot_23_9", teks: "Koordinasi jari tangan, dapat memegang benda pipih seperti sikat gigi, sendok, dll." }
        ]
      },
      {
        kategori: "III. KOGNITIF (A. Pengetahuan Umum)",
        indikator: [
          { id: "kog_23_1", teks: "Menyebut bagian-bagian suatu gambar seperti bagian pada gambar wajah, mobil, binatang, dll." },
          { id: "kog_23_2", teks: "Dapat menyebutkan minimal 5 bagian tubuh" }
        ]
      },
      {
        kategori: "III. KOGNITIF (B. Konsep Ukuran, Bentuk dan Pola)",
        indikator: [
          { id: "kog_23_3", teks: "Dapat membedakan konsep ukuran (besar-kecil, panjang-pendek)" },
          { id: "kog_23_4", teks: "Dapat menyebutkan/menunjukkan 3 macam bentuk (lingkaran, segitiga, bujur sangkar)" },
          { id: "kog_23_5", teks: "Mengenal pola" }
        ]
      },
      {
        kategori: "IV. BAHASA (A. Menerima Bahasa)",
        indikator: [
          { id: "bah_23_1", teks: "Hafal beberapa lagu anak sederhana" },
          { id: "bah_23_2", teks: "Memahami cerita sederhana" },
          { id: "bah_23_3", teks: "Memahami perintah sederhana" }
        ]
      },
      {
        kategori: "IV. BAHASA (B. Mengungkapkan Bahasa)",
        indikator: [
          { id: "bah_23_4", teks: "Dapat menggunakan kata tanya dengan tepat (apa, siapa, di mana, bagaimana, mengapa)" }
        ]
      },
      {
        kategori: "V. SOSIAL EMOSIONAL",
        indikator: [
          { id: "se_23_1", teks: "Menyatakan keinginan ketika ingin BAK dan BAB" },
          { id: "se_23_2", teks: "Memahami hak orang lain (dapat antre, menunggu giliran, dll.)" },
          { id: "se_23_3", teks: "Mau berbagi, membantu orang lain, bekerja sama" },
          { id: "se_23_4", teks: "Dapat menyatakan perasaan terhadap anak lain (suka dengan teman karena baik hati atau tidak suka karena nakal)" },
          { id: "se_23_5", teks: "Dapat berbagi peran dalam suatu permainan (menjadi dokter, perawat, pasien, penjaga toko, pembeli, dll.)" }
        ]
      }
    ],
    "3-4 Tahun": [
      {
        kategori: "I. MORAL DAN NILAI-NILAI AGAMA",
        indikator: [
          { id: "nam_34_1", teks: "Dapat membedakan baik dan buruk" },
          { id: "nam_34_2", teks: "Menyayangi ciptaan Allah" }
        ]
      },
      {
        kategori: "II. MOTORIK (A. Motorik Kasar)",
        indikator: [
          { id: "mot_34_1", teks: "Berlari sambil membawa benda ringan" },
          { id: "mot_34_2", teks: "Naik turun tangga dengan kaki bergantian" },
          { id: "mot_34_3", teks: "Meniti di atas papan titian yang cukup lebar" },
          { id: "mot_34_4", teks: "Melompat turun dari ketinggian kurang lebih 20 cm" },
          { id: "mot_34_5", teks: "Meniru gerakan senam sederhana" }
        ]
      },
      {
        kategori: "II. MOTORIK (B. Motorik Halus)",
        indikator: [
          { id: "mot_34_6", teks: "Menuang air, pasir atau biji-bijian ke tempat penampungan (mangkuk, ember, dll.)" },
          { id: "mot_34_7", teks: "Memasukkan benda kecil ke dalam botol (potongan lidi, kerikil, biji-bijian)" },
          { id: "mot_34_8", teks: "Meronce manik-manik yang tidak terlalu kecil dengan benang yang agak kaku" },
          { id: "mot_34_9", teks: "Menggunting kertas mengikuti pola garis lurus" }
        ]
      },
      {
        kategori: "III. KOGNITIF (A. Pengetahuan Umum)",
        indikator: [
          { id: "kog_34_1", teks: "Menemukan bagian yang hilang dari gambar" },
          { id: "kog_34_2", teks: "Menyebut berbagai makanan dan rasanya" },
          { id: "kog_34_3", teks: "Dapat membedakan dua hal dari jenis yang sama (misalnya perbedaan antara ayam dan kucing, antara rambutan dan pisang)" }
        ]
      },
      {
        kategori: "III. KOGNITIF (B. Konsep Ukuran, Bentuk dan Pola)",
        indikator: [
          { id: "kog_34_4", teks: "Dapat mengurutkan benda dari benda yang paling kecil hingga benda yang paling besar atau sebaliknya" },
          { id: "kog_34_5", teks: "Dapat mengikuti pola tepuk tangan" },
          { id: "kog_34_6", teks: "Dapat membedakan konsep banyak dan sedikit" }
        ]
      },
      {
        kategori: "IV. BAHASA (A. Menerima Bahasa)",
        indikator: [
          { id: "bah_34_1", teks: "Pura-pura membaca cerita bergambar dalam buku dengan kata-kata sendiri" },
          { id: "bah_34_2", teks: "Memahami 2 perintah yang diberikan" }
        ]
      },
      {
        kategori: "IV. BAHASA (B. Mengungkapkan Bahasa)",
        indikator: [
          { id: "bah_34_3", teks: "Menyatakan keinginan dengan kalimat sederhana" },
          { id: "bah_34_4", teks: "Menceritakan pengalaman yang dialami dengan cerita sederhana" }
        ]
      },
      {
        kategori: "V. SOSIAL EMOSIONAL",
        indikator: [
          { id: "se_34_1", teks: "Buang air kecil tanpa bantuan" },
          { id: "se_34_2", teks: "Sabar menunggu giliran" },
          { id: "se_34_3", teks: "Menunjukkan sikap toleran sehingga dapat bekerja dalam kelompok" },
          { id: "se_34_4", teks: "Menghargai orang lain" },
          { id: "se_34_5", teks: "Bereaksi terhadap hal yang dianggap tidak benar (marah bila diganggu atau diperlakukan berbeda)" },
          { id: "se_34_6", teks: "Menunjukkan ekspresi menyesal ketika melakukan kesalahan" }
        ]
      }
    ],
    "4-5 Tahun": [
      {
        kategori: "I. MORAL DAN NILAI-NILAI AGAMA",
        indikator: [
          { id: "nam_45_1", teks: "Dapat menyebutkan nama Allah dan paling sedikit 5 sifat-sifat asmaul husna-Nya" },
          { id: "nam_45_2", teks: "Dapat meniru gerakan ibadah (sholat, wudhu bagi kaum muslimin)" },
          { id: "nam_45_3", teks: "Dapat berdo'a sebelum dan sesudah melakukan sesuatu (Do'a sebelum belajar, sesudah belajar, sebelum makan, sesudah makan, sebelum tidur, sesudah tidur)" },
          { id: "nam_45_4", teks: "Dapat membedakan perilaku baik dan buruk" },
          { id: "nam_45_5", teks: "Dapat membiasakan diri berperilaku baik" },
          { id: "nam_45_6", teks: "Terbiasa mengucapkan salam dan membalas salam" }
        ]
      },
      {
        kategori: "II. MOTORIK (A. Motorik Kasar)",
        indikator: [
          { id: "mot_45_1", teks: "Dapat meniru gerakan (misalnya gerakan binatang, pohon tertiup angin, pesawat terbang, dll.)" },
          { id: "mot_45_2", teks: "Dapat melakukan gerakan menggantung (bergelayut)" },
          { id: "mot_45_3", teks: "Dapat melakukan gerakan melompat, meloncat, dan berlari secara terkoordinasi" },
          { id: "mot_45_4", teks: "Dapat melempar sesuatu secara terarah" },
          { id: "mot_45_5", teks: "Dapat menangkap sesuatu secara tepat" },
          { id: "mot_45_6", teks: "Dapat melakukan gerakan antisipasi" },
          { id: "mot_45_7", teks: "Dapat menendang sesuatu secara terarah" },
          { id: "mot_45_8", teks: "Dapat memanfaatkan alat permainan di luar kelas" }
        ]
      },
      {
        kategori: "II. MOTORIK (B. Motorik Halus)",
        indikator: [
          { id: "mot_45_9", teks: "Dapat membuat garis vertikal, horizontal, lengkung kiri, lengkung kanan, miring kiri, miring kanan dan lingkaran" },
          { id: "mot_45_10", teks: "Menjiplak bentuk" },
          { id: "mot_45_11", teks: "Mengoordinasikan mata dan tangan untuk melakukan gerakan yang rumit" },
          { id: "mot_45_12", teks: "Melakukan gerakan manipulatif untuk menghasilkan suatu bentuk dengan menggunakan media" },
          { id: "mot_45_13", teks: "Mengekspresikan diri dengan karya seni dengan berbagai media" }
        ]
      },
      {
        kategori: "II. MOTORIK (C. Kesehatan Fisik)",
        indikator: [
          { id: "mot_45_14", teks: "Memiliki kesesuaian antara usia dengan berat badan" },
          { id: "mot_45_15", teks: "Memiliki kesesuaian antara usia dengan tinggi badan" },
          { id: "mot_45_16", teks: "Memiliki kesesuaian antara tinggi dengan berat badan" }
        ]
      },
      {
        kategori: "III. KOGNITIF (A. Pengetahuan Umum)",
        indikator: [
          { id: "kog_45_1", teks: "Menyebutkan benda dan fungsinya (mis: pisau untuk memotong, pensil untuk menulis, dll.)" },
          { id: "kog_45_2", teks: "Menggunakan benda-benda sebagai permainan simbolik (sapu ijuk sebagai gitar, kursi sebagai mobil, dll.)" },
          { id: "kog_45_3", teks: "Menyebutkan sebab akibat terkait dengan dirinya" },
          { id: "kog_45_4", teks: "Menunjukkan, menyebutkan konsep sederhana dalam kehidupan sehari-hari (gerimis, hujan, gelap, terang, temaram)" },
          { id: "kog_45_5", teks: "Mengekspresikan sesuai dengan idenya sendiri" }
        ]
      },
      {
        kategori: "III. KOGNITIF (B. Konsep Ukuran, Bentuk, Warna dan Pola)",
        indikator: [
          { id: "kog_45_6", teks: "Mengklasifikasikan benda berdasarkan bentuk, warna atau ukuran" },
          { id: "kog_45_7", teks: "Mengklasifikasikan benda ke dalam kelompok yang sama atau sejenis atau kelompok yang berpasangan dengan 2 variasi" },
          { id: "kog_45_8", teks: "Mengenal pola AB-AB dan ABC-ABC" },
          { id: "kog_45_9", teks: "Mengurutkan benda berdasarkan 5 seriasi ukuran atau warna" }
        ]
      },
      {
        kategori: "III. KOGNITIF (C. Konsep Bilangan, Lambang Bilangan dan Huruf)",
        indikator: [
          { id: "kog_45_10", teks: "Menunjukkan/menyebutkan konsep banyak dan sedikit" },
          { id: "kog_45_11", teks: "Membilang benda 1 sampai 10" },
          { id: "kog_45_12", teks: "Mengenal konsep bilangan" },
          { id: "kog_45_13", teks: "Mengenal lambang bilangan" },
          { id: "kog_45_14", teks: "Mengenal lambang huruf" }
        ]
      },
      {
        kategori: "IV. BAHASA (A. Menerima Bahasa)",
        indikator: [
          { id: "bah_45_1", teks: "Menyimak/mendengarkan perkataan orang lain" },
          { id: "bah_45_2", teks: "Mengerti 2 perintah yang diberikan bersamaan" },
          { id: "bah_45_3", teks: "Memahami cerita yang dibacakan" },
          { id: "bah_45_4", teks: "Mengenal perbendaharaan kata tentang sifat (baik, berani, dll.)" }
        ]
      },
      {
        kategori: "IV. BAHASA (B. Mengungkapkan Bahasa)",
        indikator: [
          { id: "bah_45_5", teks: "Mengulang kalimat sederhana" },
          { id: "bah_45_6", teks: "Menjawab pertanyaan sederhana" },
          { id: "bah_45_7", teks: "Mengungkapkan perasaan dengan kata sifat (baik, senang, nakal, pelit, jelek, berani, dll.)" },
          { id: "bah_45_8", teks: "Menyebutkan kata-kata yang dikenal" },
          { id: "bah_45_9", teks: "Menyampaikan pendapat kepada orang lain" },
          { id: "bah_45_10", teks: "Menyatakan alasan terhadap sesuatu yang diinginkan atau yang tidak diinginkan (menyatakan kesetujuan atau ketidaksetujuan)" },
          { id: "bah_45_11", teks: "Menceritakan kembali dongeng yang pernah didengar" }
        ]
      },
      {
        kategori: "IV. BAHASA (C. Keaksaraan)",
        indikator: [
          { id: "bah_45_12", teks: "Menunjukkan/menyebutkan simbol-simbol" },
          { id: "bah_45_13", teks: "Meniru/menyebutkan suara-suara hewan, benda, dll." },
          { id: "bah_45_14", teks: "Membuat coretan bermakna" },
          { id: "bah_45_15", teks: "Meniru huruf" }
        ]
      },
      {
        kategori: "V. SOSIAL EMOSIONAL",
        indikator: [
          { id: "se_45_1", teks: "Menunjukkan sikap mandiri dalam memilih kegiatan" },
          { id: "se_45_2", teks: "Mau berbagi, menolong dan membantu teman" },
          { id: "se_45_3", teks: "Menunjukkan antusiasme dalam bermain secara kompetitif dan positif" },
          { id: "se_45_4", teks: "Mengendalikan perasaan" },
          { id: "se_45_5", teks: "Menaati peraturan yang berlaku dalam permainan" },
          { id: "se_45_6", teks: "Menunjukkan rasa percaya diri" },
          { id: "se_45_7", teks: "Menjaga diri sendiri dan lingkungannya" },
          { id: "se_45_8", teks: "Menghargai orang lain" }
        ]
      }
    ],
    "5-6 Tahun": [
      {
        kategori: "I. MORAL DAN NILAI-NILAI AGAMA",
        indikator: [
          { id: "nam_56_1", teks: "Mengenal agama yang dianut: Menyebutkan sifat Allah paling sedikit 10 asmaul husna dengan artinya" },
          { id: "nam_56_2", teks: "Mengenal agama yang dianut: Menyebutkan paling sedikit 10 nama malaikat dengan tugasnya" },
          { id: "nam_56_3", teks: "Mengenal agama yang dianut: Menyebutkan paling sedikit 5 nama Nabi dan Rasul" },
          { id: "nam_56_4", teks: "Mengenal agama yang dianut: Menyebutkan sifat-sifat Nabi dan Rasul" },
          { id: "nam_56_5", teks: "Mengenal agama yang dianut: Dapat melakukan gerakan wudhu dengan urutan yang benar" },
          { id: "nam_56_6", teks: "Mengenal agama yang dianut: Dapat melakukan gerakan sholat dengan urutan yang benar" },
          { id: "nam_56_7", teks: "Mengenal agama yang dianut: Hafal surat Al-Fatihah" },
          { id: "nam_56_8", teks: "Mengenal agama yang dianut: Hafal surat Al-Ikhlas, Al-Ashr dan Al-Kautsar" },
          { id: "nam_56_9", teks: "Mengenal agama yang dianut: Hafal minimal 3 hadits pendek" },
          { id: "nam_56_10", teks: "Membiasakan diri beribadah" },
          { id: "nam_56_11", teks: "Memahami perilaku mulia (jujur, penolong, sopan, hormat, dll.)" },
          { id: "nam_56_12", teks: "Membedakan perilaku baik dan buruk" },
          { id: "nam_56_13", teks: "Mengenal hari besar agama (Idulfitri, Iduladha)" },
          { id: "nam_56_14", teks: "Menghormati agama orang lain" }
        ]
      },
      {
        kategori: "II. MOTORIK (A. Motorik Kasar)",
        indikator: [
          { id: "mot_56_1", teks: "Melakukan gerakan tubuh secara terkoordinasi untuk melatih kelenturan, keseimbangan dan kelincahan" },
          { id: "mot_56_2", teks: "Melakukan koordinasi gerakan kaki-tangan-kepala dalam menirukan tarian atau senam" },
          { id: "mot_56_3", teks: "Melakukan permainan fisik dengan aturan" },
          { id: "mot_56_4", teks: "Terampil menggunakan tangan kanan dan kiri" },
          { id: "mot_56_5", teks: "Melakukan kegiatan kebersihan diri" }
        ]
      },
      {
        kategori: "II. MOTORIK (B. Motorik Halus)",
        indikator: [
          { id: "mot_56_6", teks: "Menggambar sesuai gagasan" },
          { id: "mot_56_7", teks: "Meniru bentuk" },
          { id: "mot_56_8", teks: "Melakukan eksplorasi dengan berbagai media dan kegiatan" },
          { id: "mot_56_9", teks: "Menggunakan alat tulis dengan benar" },
          { id: "mot_56_10", teks: "Menggunting sesuai pola" },
          { id: "mot_56_11", teks: "Menempel gambar dengan tepat" },
          { id: "mot_56_12", teks: "Mengekspresikan diri melalui gerakan menggambar secara detail" }
        ]
      },
      {
        kategori: "II. MOTORIK (C. Kesehatan Fisik)",
        indikator: [
          { id: "mot_56_13", teks: "Memiliki kesesuaian antara usia dengan berat badan" },
          { id: "mot_56_14", teks: "Memiliki kesesuaian antara usia dengan tinggi badan" },
          { id: "mot_56_15", teks: "Memiliki kesesuaian antara tinggi dengan berat badan" }
        ]
      },
      {
        kategori: "III. KOGNITIF (A. Pengetahuan Umum)",
        indikator: [
          { id: "kog_56_1", teks: "Mengklasifikasi benda berdasarkan fungsi" },
          { id: "kog_56_2", teks: "Menunjukkan aktivitas yang bersifat eksploratif (misal: Apa yang terjadi ketika air ditumpahkan?)" },
          { id: "kog_56_3", teks: "Merencanakan kegiatan yang akan dilakukan" },
          { id: "kog_56_4", teks: "Menyebutkan/menunjukkan sebab akibat tentang lingkungan (angin bertiup menyebabkan pohon bergerak, air menyebabkan basah, api menyebabkan terbakar, dll.)" },
          { id: "kog_56_5", teks: "Menunjukkan inisiatif dalam memilih tema permainan (misal: \"Ayo bermain pura-pura seperti burung!\")" },
          { id: "kog_56_6", teks: "Memecahkan masalah sederhana dalam kehidupan sehari-hari" }
        ]
      },
      {
        kategori: "III. KOGNITIF (B. Konsep Ukuran, Bentuk, Warna dan Pola)",
        indikator: [
          { id: "kog_56_7", teks: "Menunjukkan/menyebutkan perbedaan berdasarkan ukuran (kurang dari, lebih dari, paling besar, paling kecil, dll.)" },
          { id: "kog_56_8", teks: "Mengklasifikasikan benda berdasarkan warna, bentuk dan ukuran (3 variasi)" },
          { id: "kog_56_9", teks: "Mengklasifikasikan benda yang lebih banyak ke dalam kelompok yang sama atau jenis yang sama atau kelompok berpasangan lebih dari 2 variasi" },
          { id: "kog_56_10", teks: "Mengenal pola ABCD-ABCD" },
          { id: "kog_56_11", teks: "Mengurutkan benda berdasarkan ukuran dari paling kecil ke paling besar dan sebaliknya" }
        ]
      },
      {
        kategori: "III. KOGNITIF (C. Konsep Bilangan, Lambang Bilangan dan Huruf)",
        indikator: [
          { id: "kog_56_12", teks: "Menyebutkan lambang bilangan 1 - 10" },
          { id: "kog_56_13", teks: "Mencocokkan bilangan dengan lambang bilangan" },
          { id: "kog_56_14", teks: "Menunjukkan/menyebutkan/membacakan berbagai lambang huruf vokal dan konsonan" }
        ]
      },
      {
        kategori: "IV. BAHASA (A. Menerima Bahasa)",
        indikator: [
          { id: "bah_56_1", teks: "Mengerti beberapa perintah secara bersamaan" },
          { id: "bah_56_2", teks: "Mengulang kalimat yang lebih kompleks atau rumit" },
          { id: "bah_56_3", teks: "Memahami aturan dalam permainan" }
        ]
      },
      {
        kategori: "IV. BAHASA (B. Mengungkapkan Bahasa)",
        indikator: [
          { id: "bah_56_4", teks: "Menjawab pertanyaan yang lebih rumit (kompleks)" },
          { id: "bah_56_5", teks: "Menyebutkan kelompok gambar yang memiliki bunyi yang sama (misal: katak, kadal, dll.)" },
          { id: "bah_56_6", teks: "Berkomunikasi secara lisan, memiliki perbendaharaan kata, serta memahami simbol-simbol untuk persiapan calistung" },
          { id: "bah_56_7", teks: "Menyusun kalimat sederhana dalam struktur kalimat yang lengkap" },
          { id: "bah_56_8", teks: "Memiliki banyak kata untuk mengekspresikan ide pada orang lain" },
          { id: "bah_56_9", teks: "Melanjutkan bagian cerita yang telah diperdengarkan" }
        ]
      },
      {
        kategori: "IV. BAHASA (C. Keaksaraan)",
        indikator: [
          { id: "bah_56_10", teks: "Menyebutkan simbol-simbol huruf yang dikenal" },
          { id: "bah_56_11", teks: "Meberi tahu/menunjukkan huruf awal dari nama benda-benda yang ada di sekitarnya" },
          { id: "bah_56_12", teks: "Menyebutkan kelompok gambar yang memiliki bunyi/huruf yang sama (misal: bunga-buah, dll.)" },
          { id: "bah_56_13", teks: "Memahami hubungan antara bunyi dan bentuk huruf" },
          { id: "bah_56_14", teks: "Membaca nama sendiri" },
          { id: "bah_56_15", teks: "Menuliskan nama sendiri" }
        ]
      },
      {
        kategori: "V. SOSIAL EMOSIONAL",
        indikator: [
          { id: "se_56_1", teks: "Bersikap kooperatif dengan teman/dapat bekerja sama" },
          { id: "se_56_2", teks: "Menunjukkan sikap toleran" },
          { id: "se_56_3", teks: "Mengekspresikan emosi yang sesuai dengan kondisi yang ada (senang-sedih, semangat, dll.)" },
          { id: "se_56_4", teks: "Membiasakan sopan santun" },
          { id: "se_56_5", teks: "Memahami peraturan dan disiplin" },
          { id: "se_56_6", teks: "Menunjukkan rasa empati" },
          { id: "se_56_7", teks: "Memiliki sikap gigih (tidak mudah menyerah)" },
          { id: "se_56_8", teks: "Bangga terhadap hasil karya sendiri" },
          { id: "se_56_9", teks: "Menghargai keunggulan orang lain" }
        ]
      }
    ],
  };
  // Fungsi Sakti Penerjemah Angka Umur ke Rumpun Kategori PAUD 🧠 (FIXED LOGIC)
  const dapatkanKategoriUsiaSesuaiAngka = (usiaInput) => {
    // Jika di database isinya sudah berupa teks seperti "3-4 Tahun", langsung loloskan
    if (typeof usiaInput === 'string' && usiaInput.includes('Tahun')) {
      return usiaInput;
    }

    // Ubah ke bentuk angka bersih
    const umur = parseInt(usiaInput, 10);

    // Pemetaan presisi 1-ke-1 sesuai standarisasi kurikulum rumpun usia
    if (umur === 2) return "2-3 Tahun";
    if (umur === 3) return "3-4 Tahun";
    if (umur === 4) return "4-5 Tahun";
    if (umur === 5 || umur === 6) return "5-6 Tahun";

    // Nilai default aman jika data umur kosong/eror
    return "5-6 Tahun";
  };
  // --- EFEK TARIK DATA REALTIME DARI CLOUD ---
  useEffect(() => {
    fetchSiswaByKelompok();
  }, [kelompok, tanggal]); // Setiap kelompok atau tanggal berubah, tarik ulang data ter-update

  const fetchSiswaByKelompok = async () => {
    setLoading(true);
    try {
      // =======================================================================
      // 1. IF-ELSE KELOMPOK / ROMBEL
      // Tugas: Mengubah string panjang dari UI menjadi huruf tunggal sesuai DB
      // =======================================================================
      const dbRombel = kelompok === 'Kelompok A' ? 'A' : 'B';

      // Tarik data dari database Supabase
      const { data, error } = await supabase
        .from('v_siswa_evaluasi')
        .select('id, nama, rombel, usia, nisn')
        .eq('rombel', dbRombel)
        .order('nama', { ascending: true });

      if (error) throw error;

      // Proses mapping data siswa ke dalam State UI
      const formattedSiswa = data.map(siswa => {
        const existingInRekap = rekapData.find(r => r.id === siswa.id && r.kelompok === kelompok && r.tanggal === tanggal);

        // =======================================================================
        // 2. IF-ELSE USIA (Menerjemahkan Angka Umur ke Rumpun Kurikulum PAUD)
        // Tugas: Memastikan indikator penilaian muncul tepat sesuai umur anak
        // =======================================================================
        const umurMentah = siswa.usia ? parseInt(siswa.usia, 10) : 5;
        let kategoriUsiaFinal = "5-6 Tahun"; // Nilai default aman jika umur di atas 5 tahun atau kosong

        if (umurMentah === 2) {
          kategoriUsiaFinal = "2-3 Tahun";
        } else if (umurMentah === 3) {
          kategoriUsiaFinal = "3-4 Tahun";
        } else if (umurMentah === 4) {
          kategoriUsiaFinal = "4-5 Tahun";
        } else if (umurMentah === 5 || umurMentah === 6) {
          kategoriUsiaFinal = "5-6 Tahun";
        }

        return {
          id: siswa.id,
          nama: siswa.nama,
          usia: siswa.usia,
          nisn: siswa.nisn || "-",
          emoji: existingInRekap ? existingInRekap.emoji : null,
          label: existingInRekap ? existingInRekap.label : null,
          catatan: existingInRekap ? existingInRekap.catatan : "",
          nilaiSemester: existingInRekap ? existingInRekap.nilaiSemester : {},
          rekomendasi: existingInRekap ? existingInRekap.rekomendasi : ""
        };
      });

      setAnekdotSiswa(formattedSiswa);
    } catch (err) {
      console.error("Gagal menarik data siswa dari Big Data Supabase:", err.message);
    } finally {
      setLoading(false);
    }
  };
  // --- HANDLER FUNCTIONS ---

  const handleGantiKelompok = (klp) => {
    setKelompok(klp);
    setSelectedSiswaId('');
  };

  const updateSiswa = (id, field, value, extra = null) => {
    setAnekdotSiswa(prev => prev.map(s => {
      if (s.id === id) {
        if (field === 'emoji') return { ...s, emoji: value, label: extra };
        return { ...s, [field]: value };
      }
      return s;
    }));
  };

  const updateSkorSemesterSiswa = (siswaId, indikatorId, skor) => {
    setAnekdotSiswa(prev => prev.map(s => {
      if (s.id === siswaId) {
        const newNilai = { ...s.nilaiSemester, [indikatorId]: skor };
        const autoAiText = dapatkanRekomendasiAI(newNilai);
        return {
          ...s,
          nilaiSemester: newNilai,
          rekomendasi: autoAiText || s.rekomendasi
        };
      }
      return s;
    }));
  };

  const handleSaveToRekap = async () => {
    if (inputType === 'Semester' && !selectedSiswaId) {
      return Swal.fire('Form Belum Lengkap', 'Silakan pilih nama anak didik terlebih dahulu.', 'warning');
    }

    Swal.fire({
      title: 'Menyimpan Nilai...',
      text: `Sedang merekam data ${inputType} ke Supabase Cloud.`,
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    try {
      if (inputType === 'Semester') {
        const targetSiswa = anekdotSiswa.find(s => s.id === parseInt(selectedSiswaId));
        if (!targetSiswa) throw new Error("Siswa tidak ditemukan.");

        const autoTextOnSave = dapatkanRekomendasiAI(targetSiswa.nilaiSemester || {});
        const finalRekomendasiText = targetSiswa.rekomendasi || autoTextOnSave || `Ananda ${targetSiswa.nama} berkembang sangat baik dalam nilai agama, moral, motorik, kognitif, serta bahasa & sosial sesuai usia.`;

        const payloadSemester = {
          nisn: targetSiswa.nisn || "-",
          nama_siswa: targetSiswa.nama,
          kelompok: kelompok,
          tanggal: tanggal,
          semester: selectedSemester,
          rekomendasi_guru: finalRekomendasiText,
          skor_indikator: targetSiswa.nilaiSemester || {},
          input_oleh_guru: `Wali Kelas ${kelompok}`
        };

        // -----------------------------------------------------------
        // 🔥 SINKRONISASI DAY-BY-DAY KE LOCALSTORAGE UNTUK REPORT GURU
        // -----------------------------------------------------------
        try {
          const rawSem = localStorage.getItem('sitka_all_semester_reports');
          const existingSem = rawSem ? JSON.parse(rawSem) : [];
          const filteredSem = existingSem.filter(s => !(s.nisn === payloadSemester.nisn && s.semester === payloadSemester.semester));
          filteredSem.push(payloadSemester);
          localStorage.setItem('sitka_all_semester_reports', JSON.stringify(filteredSem));
        } catch (e) {
          console.error("Gagal simpan semester ke localStorage:", e);
        }

        try {
          const { error: errSem } = await supabase
            .from('nilai_semester')
            .upsert([payloadSemester]);
          if (errSem) console.warn("Supabase semester warning:", errSem.message);
        } catch (e) {
          console.warn("Cloud Supabase semester offline/fallback.");
        }

        // 🔥 BROADCAST DISPATCH SEMESTER EVENT UNTUK LIVE SYNC DASBOARD ORTU & REPORT GURU
        window.dispatchEvent(new CustomEvent('sitka_semester_updated', { detail: payloadSemester }));

      } else {
        const payloadHarian = anekdotSiswa.map(s => ({
          nisn: s.nisn || "-",
          nama_siswa: s.nama,
          kelompok: kelompok,
          tanggal: tanggal,
          emoji: s.emoji || '-',
          status_kondisi: s.label || '-',
          catatan_anekdot: s.catatan || '',
          input_oleh_guru: `Wali Kelas ${kelompok}`
        }));

        // -----------------------------------------------------------
        // 🔥 SINKRONISASI DAY-BY-DAY KE LOCALSTORAGE UNTUK REPORT GURU
        // -----------------------------------------------------------
        try {
          const rawHar = localStorage.getItem('sitka_all_harian_reports');
          const existingHar = rawHar ? JSON.parse(rawHar) : [];

          // Gabungkan data baru dengan filter pencocokan (nisn/nama & tanggal)
          const updatedHar = [...existingHar];
          payloadHarian.forEach(item => {
            const cleanName = (item.nama_siswa || "").toLowerCase().trim();
            const matchIndex = updatedHar.findIndex(h =>
              ((h.nisn && item.nisn && h.nisn !== '-' && h.nisn === item.nisn) ||
                (h.nama_siswa && h.nama_siswa.toLowerCase().trim() === cleanName)) &&
              h.tanggal === item.tanggal
            );

            if (matchIndex >= 0) {
              updatedHar[matchIndex] = item;
            } else {
              updatedHar.push(item);
            }
          });

          localStorage.setItem('sitka_all_harian_reports', JSON.stringify(updatedHar));
        } catch (e) {
          console.error("Gagal simpan harian ke localStorage:", e);
        }

        try {
          const { error: errHar } = await supabase
            .from('nilai_harian')
            .upsert(payloadHarian);
          if (errHar) console.warn("Supabase harian warning:", errHar.message);
        } catch (e) {
          console.warn("Cloud Supabase harian offline/fallback.");
        }

        // 🔥 BROADCAST DISPATCH HARIAN EVENT UNTUK LIVE SYNC DASBOARD ORTU & REPORT GURU
        window.dispatchEvent(new CustomEvent('sitka_harian_updated', { detail: payloadHarian }));
      }

      // =======================================================================
      // 🔥 PERBAIKAN SINKRONISASI LOKAL (Data Detail Ikut Tersimpan Permanen)
      // =======================================================================
      let updatedData = [];
      if (inputType === 'Semester') {
        const targetSiswa = anekdotSiswa.find(s => s.id === parseInt(selectedSiswaId));
        if (targetSiswa) {
          updatedData = [{
            ...targetSiswa,
            kelompok,
            tanggal,
            label: `Semester ${selectedSemester}`,
            rekomendasi: targetSiswa.rekomendasi || '',
            nilaiSemester: { ...targetSiswa.nilaiSemester }
          }];
        }
      } else {
        updatedData = anekdotSiswa.map(s => ({ ...s, kelompok, tanggal }));
      }

      setRekapData(prev => {
        const idsToFilter = updatedData.map(u => u.id);
        const filtered = prev.filter(p => !(
          p.kelompok === kelompok &&
          p.tanggal === tanggal &&
          idsToFilter.includes(p.id) &&
          p.label.includes(inputType === 'Semester' ? 'Semester' : 'Bahagia')
        ));
        return [...filtered, ...updatedData];
      });

      Swal.fire({
        icon: 'success',
        title: 'Sukses Sinkronisasi!',
        text: `Data ${inputType} berhasil tersimpan per hari & terhubung ke modul Report Guru!`,
        confirmButtonColor: '#306896',
        customClass: { popup: 'rounded-[2rem]' }
      });

    } catch (err) {
      Swal.fire({
        title: 'Gagal Sinkronisasi Cloud',
        text: err.message,
        icon: 'error',
        confirmButtonColor: '#f43f5e',
        customClass: { popup: 'rounded-[2rem]' }
      });
    }
  };

  const downloadCSV = () => {
    if (rekapData.length === 0) {
      return Swal.fire('Oops!', 'Belum ada data rekap untuk di-export.', 'warning');
    }

    const headers = "Tanggal,Kelompok,Nama Siswa,Periode/Status,Catatan/Rekomendasi\n";
    const rows = rekapData.map(s => {
      const catatanText = s.label.includes('Semester') ? s.rekomendasi : s.catatan;
      return `${s.tanggal},${s.kelompok},${s.nama},${s.label},"${(catatanText || '').replace(/"/g, '""')}"`;
    }).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rekap_Nilai_SITKA_${tanggal}.csv`;
    a.click();
  };

  const currentSelectedSiswa = anekdotSiswa.find(s => s.id === parseInt(selectedSiswaId));

  const dapatkanDaftarParameterSiswaTerpilih = () => {
    if (!detailSiswaSemesterTerpilih) return [];

    const kategori = detailSiswaSemesterTerpilih.usia;

    return parameterAkademikBerdasarkanUsia[kategori] || parameterAkademikBerdasarkanUsia["5-6 Tahun"];
  };
  // --- HANDLER DETAIL REKAPITULASI ---
  const handleLihatDetailSiswa = (item) => {
    // Jika tipenya bukan Semester atau tidak memiliki data skor, munculkan info biasa
    if (!item.label.includes('Semester') || !item.nilaiSemester || Object.keys(item.nilaiSemester).length === 0) {
      return Swal.fire({
        title: item.nama,
        html: `<div class="text-left bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p class="font-semibold text-gray-500 mb-1">Catatan/Anekdot Harian:</p>
                <p class="text-gray-800 font-medium">${item.catatan || 'Tidak ada catatan harian.'}</p>
               </div>`,
        confirmButtonColor: '#306896',
        customClass: { popup: 'rounded-[2rem]' }
      });
    }

    // Bangun baris tabel HTML secara dinamis dari skor indikator semester (BM, MM, BSH, dll.)
    let barisIndikatorHtml = '';

    // Ambil daftar parameter kurikulum berdasarkan usia anak yang tersimpan di state item tersebut
    const kategoriUsia = item.usia || '5-6 Tahun';
    const parameterKurikulum = parameterAkademikBerdasarkanUsia[kategoriUsia] || parameterAkademikBerdasarkanUsia["5-6 Tahun"];

    parameterKurikulum.forEach(kat => {
      kat.indikator.forEach(ind => {
        const skorAnak = item.nilaiSemester[ind.id];
        if (skorAnak) { // Hanya tampilkan indikator yang sudah dinilai guru
          // Beri warna badge sesuai tingkat perkembangan anak
          let warnaBadge = 'bg-gray-100 text-gray-700';
          if (skorAnak === 'BSH') warnaBadge = 'bg-indigo-100 text-indigo-700 font-bold';
          if (skorAnak === 'BSB') warnaBadge = 'bg-emerald-100 text-emerald-700 font-bold';
          if (skorAnak === 'BB') warnaBadge = 'bg-rose-100 text-rose-700 font-bold';

          barisIndikatorHtml += `
            <tr class="border-b border-gray-100 hover:bg-gray-50/50">
              <td class="py-3 pr-2 text-xs font-semibold text-indigo-600 align-top">${ind.id.toUpperCase()}</td>
              <td class="py-3 px-2 text-xs text-gray-700 text-left align-top">${ind.teks}</td>
              <td class="py-3 pl-2 text-right align-top">
                <span class="px-2.5 py-1 text-[11px] rounded-md ${warnaBadge}">${skorAnak}</span>
              </td>
            </tr>
          `;
        }
      });
    });

    if (!barisIndikatorHtml) {
      barisIndikatorHtml = `<tr><td colspan="3" class="text-center py-4 text-sm text-gray-400 italic">Belum ada skor indikator yang diisi.</td></tr>`;
    }

    // Tampilkan popup SweetAlert berisi tabel rapi capaian perkembangan
    Swal.fire({
      title: `<span class="text-lg font-bold block text-gray-900">${item.nama}</span>
              <span class="text-xs text-gray-400 block font-normal mt-0.5">${item.label} (${item.kelompok})</span>`,
      html: `
        <div class="max-h-[60vh] overflow-y-auto pr-1">
          <div class="mb-4 text-left bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/60">
            <span class="block text-[11px] font-bold text-indigo-500 uppercase tracking-wider mb-0.5">Rekomendasi Pendidik / Catatan Akhir:</span>
            <p class="text-xs text-gray-700 italic font-medium">"${item.rekomendasi || 'Belum ada rekomendasi tertulis.'}"</p>
          </div>
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b-2 border-gray-200 text-gray-400 text-[11px] uppercase tracking-wider">
                <th class="pb-2 font-bold w-16">Kode</th>
                <th class="pb-2 font-bold">Indikator Penilaian</th>
                <th class="pb-2 font-bold text-right w-16">Skor</th>
              </tr>
            </thead>
            <tbody>
              ${barisIndikatorHtml}
            </tbody>
          </table>
        </div>
      `,
      confirmButtonText: 'Tutup Detail',
      confirmButtonColor: '#306896',
      width: '600px',
      customClass: { popup: 'rounded-[1.5rem]' }
    });
  };
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 text-left">

      {/* --- HEADER SECTION --- */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

          <div className="flex items-center gap-5">
            <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
              <ClipboardCheck size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#0a1e36]">Input Nilai</h2>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Panel Evaluasi Guru ({kelompok})</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Dropdown Tipe Input */}
            <div className="relative">
              <select
                value={`Input ${inputType}`}
                onChange={(e) => {
                  setInputType(e.target.value.replace('Input ', ''));
                  setSelectedSiswaId('');
                }}
                className="pl-6 pr-10 py-4 bg-indigo-50 border-none rounded-2xl text-sm font-black text-[#0a1e36] appearance-none focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
              >
                {['Input Harian', 'Input Semester'].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>

            {/* Dropdown Siswa DINAMIS CLOUD */}
            {inputType === 'Semester' && (
              <div className="relative">
                <select
                  value={selectedSiswaId}
                  onChange={(e) => {
                    // 🔥 KUNCI BIAR BERUBAH REALTIME: Set ID Siswa yang baru diklik
                    setSelectedSiswaId(e.target.value);
                  }}
                  className="pl-6 pr-10 py-4 bg-indigo-600 text-white border-none rounded-2xl text-sm font-black appearance-none outline-none cursor-pointer"
                >
                  <option value="">-- Pilih Anak Didik --</option>
                  {anekdotSiswa.map(s => (
                    <option key={s.id} value={s.id} className="text-black">{s.nama}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none" size={16} />
              </div>
            )}

            {/* Dropdown Target Semester */}
            {inputType === 'Semester' && (
              <div className="relative">
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="pl-6 pr-10 py-4 bg-emerald-50 border-none rounded-2xl text-sm font-black text-emerald-800 appearance-none outline-none cursor-pointer"
                >
                  <option value="1 (Ganjil)">Semester 1 (Ganjil)</option>
                  <option value="2 (Genap)">Semester 2 (Genap)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none" size={16} />
              </div>
            )}

            {/* Dropdown Kelompok */}
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" size={18} />
              <select
                value={kelompok}
                onChange={(e) => handleGantiKelompok(e.target.value)}
                className="pl-12 pr-10 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-[#0a1e36] outline-none cursor-pointer"
              >
                <option value="Kelompok A">Kelompok A</option>
                <option value="Kelompok B">Kelompok B</option>
              </select>
            </div>

            {/* Date Picker */}
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-[#0a1e36] outline-none"
            />
          </div>
        </div>
      </div>

      {/* --- REFRESH LOADING INDICATOR --- */}
      {loading ? (
        <div className="text-center py-12 font-bold text-indigo-600 animate-pulse">
          Sedang menarik data anak didik terbaru dari database SITKA...
        </div>
      ) : (
        <>
          {/* --- FORM CONDITION 1: INPUT HARIAN --- */}
          {inputType === 'Harian' && (
            <div className="space-y-6">
              {anekdotSiswa.length === 0 ? (
                <div className="bg-white p-12 rounded-[2.5rem] text-center text-slate-400 border border-dashed">
                  Belum ada data siswa terdaftar di {kelompok} pada database Cloud.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {anekdotSiswa.map((siswa) => (
                    <div key={siswa.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start group hover:border-indigo-200 transition-all">
                      <div className="flex items-center gap-4 min-w-[200px]">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          {siswa.nama ? siswa.nama.charAt(0) : 'S'}
                        </div>
                        <div>
                          <h4 className="font-bold text-[#0a1e36]">{siswa.nama}</h4>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{kelompok}</p>
                        </div>
                      </div>

                      {/* Emoji Picker - Klik emoji yg sudah dipilih untuk membatalkan (null) */}
                      <div className="flex gap-2 p-2 bg-slate-50 rounded-[1.5rem]">
                        {[
                          { emo: '😊', label: 'Bahagia' },
                          { emo: '😐', label: 'Tenang' },
                          { emo: '😢', label: 'Sedih' },
                          { emo: '🌟', label: 'Istimewa' }
                        ].map((item) => (
                          <button
                            key={item.emo}
                            type="button"
                            onClick={() => {
                              // Jika sudah terpilih → klik lagi = deselect (null)
                              if (siswa.emoji === item.emo) {
                                updateSiswa(siswa.id, 'emoji', null, null);
                              } else {
                                updateSiswa(siswa.id, 'emoji', item.emo, item.label);
                              }
                            }}
                            className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all ${siswa.emoji === item.emo
                                ? 'bg-white shadow-md scale-105 border-b-4 border-indigo-500'
                                : 'opacity-40 hover:opacity-100 hover:bg-white/50'
                              }`}
                          >
                            <span className="text-2xl">{item.emo}</span>
                            <span className={`text-[8px] font-black uppercase mt-1 ${siswa.emoji === item.emo ? 'text-indigo-600' : 'text-slate-500'}`}>
                              {item.label}
                            </span>
                          </button>
                        ))}
                      </div>


                      <textarea
                        placeholder={`Tulis catatan harian untuk ${siswa.nama}...`}
                        value={siswa.catatan}
                        onChange={(e) => updateSiswa(siswa.id, 'catatan', e.target.value)}
                        className="flex-1 w-full p-4 bg-slate-50 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 min-h-[85px] resize-none"
                      />
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleSaveToRekap}
                disabled={anekdotSiswa.length === 0}
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:bg-slate-300"
              >
                <Save size={16} /> Simpan Seluruh Catatan Harian Ke Rekap
              </button>
            </div>
          )}

          {/* --- FORM CONDITION 2: INPUT SEMESTER --- */}
          {inputType === 'Semester' && (
            selectedSiswaId ? (
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-md space-y-6">

                  {/* Identitas Siswa, Semester Dinamis & Kelompok Usia Adaptif */}
                  <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                    <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-md shadow-indigo-100">
                      {currentSelectedSiswa?.nama ? currentSelectedSiswa.nama.charAt(0) : 'S'}
                    </div>
                    <div className="flex flex-col text-left">
                      <h3 className="text-xl font-black text-[#0a1e36] tracking-tight">
                        {currentSelectedSiswa?.nama}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                          LEMBAR KUESIONER RAPOT CAPAIAN {selectedSemester} ({kelompok})
                        </span>
                        <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                          👶 USIA: {currentSelectedSiswa?.usia || "5-6 Tahun"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Render Kategori - SEKARANG OTOMATIS MENYESUAIKAN USIA ANAK 🧠 */}
                  <div className="space-y-6">
                    {(() => {
                      // Konversi otomatis angka umur (misal: 3) menjadi rumpun kategori (misal: "2-3 Tahun") ⚡
                      const usiaMentah = currentSelectedSiswa?.usia || 6;
                      const usiaSiswaAktif = dapatkanKategoriUsiaSesuaiAngka(usiaMentah);

                      // Tarik indikator yang cocok dengan usianya dari gudang data
                      const parameterSiswaAktif = parameterAkademikBerdasarkanUsia[usiaSiswaAktif] || [];

                      if (parameterSiswaAktif.length === 0) {
                        return <p className="text-xs text-slate-400 italic p-4">Indikator usia {usiaSiswaAktif} belum tersedia.</p>;
                      }

                      return parameterSiswaAktif.map((kat, kIdx) => (
                        <div key={kIdx} className="border border-slate-100 rounded-2xl overflow-hidden shadow-inner">
                          <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center gap-2">
                            <BookOpen size={16} className="text-indigo-600" />
                            <span className="text-[10px] font-black text-[#0a1e36] tracking-wider uppercase">{kat.kategori}</span>
                          </div>

                          <div className="divide-y divide-slate-50">
                            {kat.indikator.map((ind) => (
                              <div key={ind.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <p className="text-xs font-bold text-slate-600 max-w-xl">{ind.teks}</p>

                                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl self-end sm:self-center">
                                  {[
                                    { key: 'BM', name: 'Belum Muncul' },
                                    { key: 'MM', name: 'Mulai Muncul' },
                                    { key: 'BSH', name: 'Sesuai Harapan' },
                                    { key: 'BSB', name: 'Sangat Baik' },
                                    { key: 'BB', name: 'Belum Berkembang' } // 👈 Tambah BB sesuai dokumen sekolah Senior
                                  ].map((skala) => (
                                    <button
                                      key={skala.key}
                                      type="button"
                                      title={skala.name}
                                      onClick={() => updateSkorSemesterSiswa(currentSelectedSiswa.id, ind.id, skala.key)}
                                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${currentSelectedSiswa?.nilaiSemester?.[ind.id] === skala.key
                                          ? 'bg-[#0a1e36] text-white shadow-sm'
                                          : 'bg-white text-slate-400 hover:text-slate-600'
                                        }`}
                                    >
                                      {skala.key}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>

                  {/* Catatan Rekomendasi Naive Bayes AI */}
                  <div className="space-y-2 pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="text-[10px] font-black text-[#0a1e36] uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles size={14} className="text-purple-600" />
                        Rekomendasi Pendidik / Catatan Akhir Semester untuk {currentSelectedSiswa?.nama}
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          if (!currentSelectedSiswa) return;
                          const aiText = dapatkanRekomendasiAI(currentSelectedSiswa.nilaiSemester || {});
                          if (aiText) {
                            updateSiswa(currentSelectedSiswa.id, 'rekomendasi', aiText);
                            Swal.fire({
                              icon: 'success',
                              title: 'Catatan Naive Bayes AI Dihasilkan!',
                              text: `Catatan rekomendasi semester untuk ${currentSelectedSiswa.nama} berhasil dikalkulasi otomatis berdasarkan indikator usianya.`,
                              timer: 2000,
                              showConfirmButton: false
                            });
                          } else {
                            Swal.fire('Informasi', 'Silakan pilih minimal satu skala indikator penilaian di atas untuk menghasilkan catatan Naive Bayes AI.', 'info');
                          }
                        }}
                        className="px-3.5 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-full text-[10px] font-black uppercase tracking-wider border border-purple-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0 self-start sm:self-auto"
                      >
                        <Bot size={14} className="text-purple-600" /> 🤖 Generate Naive Bayes AI
                      </button>
                    </div>

                    <textarea
                      placeholder="Catatan Naive Bayes AI akan otomatis terisi saat Anda mengklik skala indikator penilaian di atas..."
                      value={currentSelectedSiswa?.rekomendasi || ""}
                      onChange={(e) => updateSiswa(currentSelectedSiswa.id, 'rekomendasi', e.target.value)}
                      className="w-full p-4 bg-purple-50/50 border border-purple-100 rounded-2xl text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-purple-600 min-h-[110px] leading-relaxed shadow-inner"
                    />
                    <p className="text-[10px] text-purple-700 font-bold italic flex items-center gap-1">
                      ✨ <b>Terkalkulasi Otomatis (Teorema Naive Bayes PAUD)</b>: Catatan ini disintesis otomatis berdasarkan indikator usia {currentSelectedSiswa?.nama}. Pendidik dapat langsung menyimpan atau menyesuaikannya.
                    </p>
                  </div>

                </div>

                <button
                  onClick={handleSaveToRekap}
                  className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Save size={16} /> Simpan Rapot Semester {currentSelectedSiswa?.nama} Ke Rekap
                </button>
              </div>
            ) : (
              <div className="bg-white p-16 rounded-[3rem] text-center border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={28} />
                </div>
                <h4 className="text-base font-black text-[#0a1e36] uppercase tracking-wider">Lembar Evaluasi Semester</h4>
                <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto">
                  Silakan klik tombol <span className="text-indigo-600 font-bold">"-- Pilih Anak Didik --"</span> di barisan menu atas untuk membuka berkas kuesioner rapot fisik PAUD.
                </p>
              </div>
            )
          )}
        </>
      )}

      {/* --- CONDITION 3: FALLBACK MINGGUAN & QUARTAL --- */}
      {inputType !== 'Harian' && inputType !== 'Semester' && (
        <div className="bg-white p-20 rounded-[3rem] text-center border border-dashed border-slate-200">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText size={40} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-[#0a1e36]">Form {inputType}</h3>
          <p className="text-slate-400 mt-2">Fitur pengisian untuk periode {inputType} sedang dalam pengembangan.</p>
        </div>
      )}

      {/* --- SECTION REKAPITULASI GLOBAL --- */}
      <div className="bg-[#0a1e36] p-8 md:p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h3 className="text-2xl font-black mb-1 italic">Rekapitulasi Input ({inputType})</h3>
            <p className="text-indigo-300 text-xs font-bold uppercase tracking-[0.2em]">Data Terkumpul ({kelompok})</p>
          </div>
          <button
            onClick={downloadCSV}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95"
          >
            <Download size={18} /> Export ke CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">
                <th className="px-6 pb-2">Kelompok</th>
                <th className="px-6 pb-2">Siswa</th>
                <th className="px-6 pb-2">Tipe / Periode</th>
                <th className="px-6 pb-2">Keterangan Catatan / Rekomendasi</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                // ⚡ FILTER OTOMATIS: Pisahkan data agar tidak bercampur antara Harian/Semester
                const dataTerfilter = rekapData.filter(item => {
                  if (inputType === 'Semester') {
                    return item.label.includes('Semester');
                  } else {
                    return !item.label.includes('Semester');
                  }
                });

                if (dataTerfilter.length === 0) {
                  return (
                    <tr>
                      <td colSpan="4" className="text-center py-10 text-slate-500 font-bold italic bg-white/5 rounded-2xl">
                        📭 Belum ada data rekapitulasi untuk kategori <span className="text-indigo-400">{inputType}</span>.
                      </td>
                    </tr>
                  );
                }

                return dataTerfilter
                  .sort((a, b) => a.kelompok.localeCompare(b.kelompok))
                  .map((item, idx) => (
                    <tr
                      key={idx}
                      onClick={() => handleLihatDetailSiswa(item)} // 👈 TRIGER KLIK POPUP DETAIL BB, BSH, DLL
                      className="bg-white/5 backdrop-blur-md rounded-2xl hover:bg-white/10 cursor-pointer transition-all group"
                    >
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-[10px] font-black uppercase">
                          {item.kelompok}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm group-hover:text-indigo-300 transition-colors">
                            {item.nama}
                          </span>
                          <span className="text-[10px] text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            🔍 Lihat Detail
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-black bg-white/10 px-2 py-1 rounded-md text-slate-300">
                          {item.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-300 italic max-w-xs truncate">
                        {item.label.includes('Semester') ? (item.rekomendasi || "(Tidak ada rekomendasi)") : (item.catatan || "(Tidak ada catatan)")}
                      </td>
                    </tr>
                  ));
              })()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InputNilai;