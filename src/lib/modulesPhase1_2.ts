import type { ModuleItem } from "./modulesTypes";

export const MODULES_PHASE_1_2: ModuleItem[] = [
  {
    id: "1",
    number: 1,
    phase: 1,
    phaseTitle: "Memahami Diri dan Kebiasaan Digital",
    approachTag: "Psikoedukasi",
    isCoreStart: true,
    title: "Kenapa Sulit Berhenti Scrolling?",
    subtitle: "Membedakan penggunaan digital yang sehat, berlebihan, dan bermasalah",
    readMinutes: 7,
    summary:
      "Tidak semua durasi layar yang tinggi berarti kecanduan. Pelajari mengapa jempol bisa terus menggulir di luar niat awal, serta peta ilmiah di balik kebiasaan digital.",
    learningObjective:
      "Membedakan durasi pemakaian layar yang produktif dari pola penggunaan bermasalah yang mengganggu fungsi hidup dan keseimbangan emosi.",
    evidenceStrength: "Tinjauan langsung masalah digital (kepastian bervariasi)",
    evidenceLimitation:
      "Umbrella review menunjukkan berbagai intervensi membantu menurunkan gejala, tetapi heterogenitas hasil tinggi sehingga respon tiap individu bervariasi.",
    references: [
      {
        citation: "Zhang et al. (2026), Journal of Medical Internet Research",
        url: "https://doi.org/10.2196/81705",
        note: "Umbrella review 29 meta-analisis (66.530 peserta) mengenai efektivitas intervensi penggunaan digital bermasalah.",
      },
      {
        citation: "Brand et al. (2019), Neuroscience & Biobehavioral Reviews",
        url: "https://doi.org/10.1016/j.neubiorev.2019.06.032",
        note: "Model I-PACE tentang interaksi faktor pribadi, emosi, kognisi, dan kontrol eksekutif.",
      },
    ],
    practiceLink: {
      href: "/insight",
      label: "Lihat Pola di Insight",
      description: "Amati kapan waktu penggunaan terasa paling berat bagi fokus harianmu.",
    },
    nextModuleId: "2",
    sections: [
      {
        id: "lima-menit-yang-molor",
        eyebrow: "Bagian 01 · Pembuka",
        title: "Niat Lima Menit yang Berubah Menjadi Satu Jam",
        paragraphs: [
          "Bayangkan pukul 22.15 di kamar yang sudah redup. Kamu sebenarnya hanya berniat mengecek pesan penting atau melihat prakiraan cuaca esok pagi. Satu menit kemudian, ibu jari mengetuk video pendek pertama, lalu video kedua, dan mendadak jam di pojok layar sudah menunjuk pukul 23.20.",
          "Sensasi aneh itu jarang terasa seperti kesenangan besar. Lebih sering, seseorang merasa agak kosong, sedikit tegang di bahu, dan bingung mengapa tangannya terus menggulir padahal mata sudah lelah. Pengalaman seperti ini dialami jutaan pelajar, pekerja, maupun profesional setiap malam.",
          "Langkah pertama yang paling menenangkan adalah berhenti memberi label cepat bahwa dirimu 'rusak' atau 'tidak berkarakter'. Dalam psikologi kebiasaan digital, rasa kehilangan kendali itu punya penjelasan mekanisme yang jauh lebih manusiawi dan bisa dipelajari.",
        ],
        callout: {
          label: "Fakta Penting",
          text: "Durasi screen time tinggi belum otomatis berarti kecanduan. Desainer grafis, mahasiswa peneliti, atau pekerja jarak jauh memang menatap layar berjam-jam tanpa mengalami masalah regulasi perilaku.",
          tone: "emerald",
        },
        actionPrompt:
          "Ingat satu momen minggu ini saat durasi layar terasa paling tidak sejalan dengan niat awalmu.",
      },
      {
        id: "tiga-zona-penggunaan",
        eyebrow: "Bagian 02 · Penjelasan Psikologi",
        title: "Spektrum Sehat, Berlebihan, dan Bermasalah",
        paragraphs: [
          "Para peneliti membedakan penggunaan teknologi berdasarkan dampaknya terhadap kendali diri dan fungsi kehidupan, bukan semata angka jam di pengatur baterai. Dalam model I-PACE yang dirumuskan Matthias Brand dan kolega (2019), kebiasaan digital bermasalah lahir dari pertemuan antara kondisi personal (seperti stres atau kesepian), respons emosi terhadap konten, melemahnya rem eksekutif saat lelah, dan pengulangan berulang.",
          "Pada zona sehat, kamu membuka aplikasi dengan tujuan jelas dan mudah menutupnya saat selesai. Pada zona berlebihan, waktu sering molor sesekali tetapi tidur, relasi, dan pekerjaan utama masih berjalan baik.",
          "Barulah disebut penggunaan bermasalah ketika aplikasi mulai dipakai otomatis sebagai peredam perasaan tidak nyaman, sulit dihentikan walau kamu berniat berhenti, dan pelan-pelan menggeser tidur, belajar, atau hubungan tatap muka.",
        ],
        evidence: {
          study: "Brand et al. (2019), I-PACE Model; Zhang et al. (2026), JMIR",
          finding:
            "Perilaku digital bermasalah berkaitan erat dengan regulasi emosi dan kendali eksekutif, sementara tinjauan 66.530 peserta menunjukkan intervensi terstruktur mampu menurunkan gejala meski kepastian bukti bervariasi.",
        },
        actionPrompt:
          "Nilai minggu terakhirmu secara jujur: di momen apa penggunaan ponsel masih terarah, dan kapan ia berubah menjadi pelarian otomatis?",
      },
      {
        id: "mengenal-audit-kendali",
        eyebrow: "Bagian 03 · Mengenal Teknik",
        title: "Teknik Tiga Pertanyaan Audit Diri Tanpa Menghakimi",
        paragraphs: [
          "Alih-alih menghitung berapa jam layar menyala dengan rasa bersalah, gunakan teknik audit fungsi dari pendekatan psikoedukasi CBT. Setiap kali mengevaluasi satu aplikasi atau kebiasaan digital, ajukan tiga pertanyaan netral berikut:",
        ],
        bullets: [
          {
            lead: "1. Fungsi vs pelarian:",
            detail:
              "Apakah aku membuka ini untuk tujuan spesifik, atau untuk kabur dari rasa lelah, cemas, dan bosan?",
          },
          {
            lead: "2. Dampak setelah menutup:",
            detail:
              "Bagaimana kondisi tubuh dan fokusku 10 menit setelah meletakkan ponsel: lebih segar atau justru lebih tumpul?",
          },
          {
            lead: "3. Biaya kesempatan:",
            detail:
              "Hal penting apa yang diam-diam tergeser, misalnya tidur cukup, olahraga, atau obrolan dengan keluarga?",
          },
        ],
        actionPrompt:
          "Pilih satu aplikasi yang paling sering menyedot fokusmu, lalu jawab ketiga pertanyaan di atas dalam kepala.",
      },
      {
        id: "penerapan-sederhana-01",
        eyebrow: "Bagian 04 · Penerapan Sederhana",
        title: "Latihan Jeda 10 Detik Sebelum Mengetuk Ikon",
        paragraphs: [
          "Mulai hari ini, kamu tidak perlu memaksa diri membuang ponsel. Terapkan latihan mikro sederhana: setiap kali menyadari tangan hendak membuka media sosial atau gim di sela kerja, tahan jari satu sentimeter di atas layar selama dua tarikan napas.",
          "Tanyakan pelan: 'Aku mau cari apa di sini, dan berapa menit aku mau di sini?' Jika jawabannya jelas, silakan lanjutkan dengan sadar. Jika ternyata hanya mencari pengalihan sesaat, letakkan ponsel menghadap meja selama satu menit terlebih dahulu.",
        ],
        callout: {
          label: "Tujuan Bab Ini",
          text: "Target kita bukan anti-teknologi, melainkan mengembalikan kendali sadar di tanganmu sehingga layar kembali menjadi alat, bukan pengemudi.",
          tone: "orange",
        },
        actionPrompt:
          "Praktikkan jeda dua tarikan napas satu kali hari ini sebelum membuka aplikasi hiburan.",
      },
      {
        id: "refleksi-batasan-01",
        eyebrow: "Bagian 05 · Refleksi & Rujukan",
        title: "Refleksi Pribadi dan Batasan Bukti Ilmiah",
        paragraphs: [
          "Tanyakan pada dirimu sendiri: kapan terakhir kali kamu menggunakan gawai dengan perasaan puas saat menutupnya, dan hal kecil apa yang membedakan momen itu dari saat kamu terjebak scrolling?",
          "Catatan ilmiah: Bab ini disusun sebagai materi edukasi swabantu berbasis prinsip CBT, ACT, dan model I-PACE. Lumif bukan layanan terapi klinis, dan durasi baca 6-8 menit merupakan estimasi rancangan kurikulum, bukan takaran klinis yang diuji terpisah.",
        ],
        actionPrompt:
          "Tandai bagian ini selesai jika kamu sudah memahami beda antara durasi layar tinggi dan kebiasaan bermasalah.",
      },
    ],
  },
  {
    id: "2",
    number: 2,
    phase: 1,
    phaseTitle: "Memahami Diri dan Kebiasaan Digital",
    approachTag: "Psikoedukasi",
    isCoreStart: true,
    title: "Bagaimana Kebiasaan Terbentuk?",
    subtitle: "Memahami pemicu, tindakan, konsekuensi, dan otomatisasi perilaku",
    readMinutes: 6,
    summary:
      "Kenali lingkaran pemicu-tindakan-konsekuensi yang membuat perilaku menjadi otomatis, sekaligus meluruskan mitos populer soal reset dopamin dan aturan 21 hari.",
    learningObjective:
      "Memetakan bagaimana kebiasaan digital menguat melalui pembelajaran perilaku (habit learning) dan melepaskan asumsi keliru tentang dopamin maupun durasi kaku pembentukan kebiasaan.",
    evidenceStrength: "Tinjauan langsung masalah digital (kepastian bervariasi)",
    evidenceLimitation:
      "Waktu yang dibutuhkan tiap orang untuk membentuk kebiasaan baru sangat bervariasi antar individu dan jenis perilaku.",
    references: [
      {
        citation: "Brand et al. (2019), Neuroscience & Biobehavioral Reviews",
        url: "https://doi.org/10.1016/j.neubiorev.2019.06.032",
        note: "Menjelaskan peralihan dari tindakan terarah menuju respons kebiasaan otomatis melalui penguatan berulang.",
      },
      {
        citation: "Balhara et al. (2026), Journal of Medical Internet Research",
        url: "https://doi.org/10.2196/89280",
        note: "Perbandingan berbagai pendekatan terapeutik untuk penggunaan digital bermasalah.",
      },
    ],
    practiceLink: {
      href: "/routines",
      label: "Susun Satu Pengulangan di Rutinitas",
      description: "Tambahkan kebiasaan pengganti sederhana yang nyaman diulang tiap hari.",
    },
    nextModuleId: "3",
    sections: [
      {
        id: "tangan-otomatis-di-antrean",
        eyebrow: "Bagian 01 · Pembuka",
        title: "Kenapa Tangan Bisa Bergerak Sebelum Kita Sempat Berpikir?",
        paragraphs: [
          "Pernahkah kamu mengantre kopi atau menunggu lampu merah selama dua puluh detik, lalu tiba-tiba layar ponsel sudah terbuka di tangan padahal kamu tidak ingat mengambil keputusan untuk membukanya?",
          "Itu bukan tanda lemahnya kecerdasan. Justru sebaliknya: itu adalah bukti betapa efisiennya otak manusia menghemat energi lewat autopilot. Setiap gerakan yang diulang ratusan kali dalam situasi yang mirip akan dipadatkan otak menjadi pintasan cepat.",
          "Mengetahui bagaimana pintasan itu terbentuk jauh lebih berguna daripada memarahi diri sendiri setiap kali jari meluncur ke ikon aplikasi.",
        ],
        actionPrompt:
          "Perhatikan momen transisi harianmu (bangun tidur, selesai rapat, atau menunggu sesuatu) yang paling sering memicu gerakan refleks membuka ponsel.",
      },
      {
        id: "lingkaran-kebiasaan-dan-mitos",
        eyebrow: "Bagian 02 · Penjelasan Psikologi",
        title: "Pemicu, Tindakan, Konsekuensi, serta Koreksi Dua Mitos Populer",
        paragraphs: [
          "Dalam ilmu perilaku, kebiasaan menguat lewat tiga mata rantai: Pemicu (cue) seperti rasa bosan atau notifikasi bergetar, Tindakan (behavior) yaitu membuka umpan video atau gim, dan Konsekuensi (outcome) berupa kelegaan sesaat dari rasa jenuh atau tertekan. Selama tindakan itu memberi jeda cepat dari rasa tidak nyaman, otak belajar mengulanginya.",
          "Di media sosial, kamu mungkin sering mendengar istilah 'reset dopamin' atau janji bahwa 'kebiasaan baru pasti terbentuk dalam 21 hari'. Keduanya adalah penyederhanaan berlebihan yang tidak akurat secara ilmiah.",
          "Dopamin bukanlah 'racun kesenangan' yang bisa dikosongkan lalu diisi ulang seperti baterai. Ia berperan normal dalam pembelajaran, motivasi, dan antisipasi imbalan. Demikian pula, tinjauan ilmiah pembentukan kebiasaan menunjukkan durasi adaptasi kebiasaan baru sangat bervariasi tergantung kerumitan aktivitas dan konsistensi konteks, bukan patokan kaku 21 hari.",
        ],
        callout: {
          label: "Koreksi Ilmiah",
          text: "Pemulihan kebiasaan digital bukan 'puasa reset dopamin' 21 hari. Ini adalah proses melatih ulang respons perilaku di konteks nyata dengan ritme bertahap.",
          tone: "emerald",
        },
        evidence: {
          study: "Brand et al. (2019), I-PACE; Balhara et al. (2026), JMIR",
          finding:
            "Pengulangan perilaku di bawah kondisi stres atau imbalan tidak terduga mempercepat otomatisasi, sedangkan perubahan kebiasaan membutuhkan modifikasi konteks dan latihan berulang tanpa batas waktu tunggal.",
        },
        actionPrompt:
          "Lepaskan target kaku 21 hari dan anggap latihan kebiasaan sebagai eksperimen bertahap yang boleh disesuaikan.",
      },
      {
        id: "memecah-mata-rantai",
        eyebrow: "Bagian 03 · Mengenal Teknik",
        title: "Teknik Memutus Rantai di Titik Pemicu dan Imbalan Alternatif",
        paragraphs: [
          "Kamu tidak bisa langsung menghapus memori kebiasaan yang sudah terlanjur kuat, tetapi kamu bisa mengubah salah satu dari tiga mata rantainya:",
        ],
        bullets: [
          {
            lead: "1. Geser pemicu:",
            detail:
              "Pindahkan aplikasi hiburan dari halaman utama ponsel atau taruh charger di luar jangkauan tempat tidur.",
          },
          {
            lead: "2. Tambah jeda tindakan:",
            detail:
              "Pasang jeda kecil 5-10 detik agar bagian otak sadar sempat masuk sebelum autopilot mengambil alih.",
          },
          {
            lead: "3. Ganti konsekuensi:",
            detail:
              "Sediakan penutup jeda yang nyata, seperti segelas air dingin, peregangan bahu, atau catatan 1 kalimat.",
          },
        ],
        actionPrompt:
          "Pilih satu dari tiga mata rantai di atas (pemicu, jeda tindakan, atau alternatif) untuk diuji selama tiga hari ke depan.",
      },
      {
        id: "penerapan-sederhana-02",
        eyebrow: "Bagian 04 · Penerapan Sederhana",
        title: "Eksperimen Memindahkan Satu Ikon Aplikasi",
        paragraphs: [
          "Luangkan 30 detik sekarang juga: pilih satu aplikasi yang paling sering dibuka secara refleks, lalu pindahkan dari layar utama ke folder di halaman paling belakang, atau keluarkan dari mode login cepat.",
          "Tujuannya bukan melarangmu membuka aplikasi itu selamanya, melainkan mengembalikan keputusan sadar: ketika harus menggeser dua halaman lebih dulu, otakmu mendapat kesempatan sepersekian detik untuk bertanya apakah kamu memang benar-benar memerlukannya saat ini.",
        ],
        callout: {
          label: "Friksi Sehat",
          text: "Tambahan waktu 3 detik untuk mengakses aplikasi sering kali sudah cukup untuk menggagalkan sebagian besar impuls autopilot.",
          tone: "orange",
        },
        actionPrompt:
          "Uji memindahkan satu ikon aplikasi yang paling sering dibuka refleks hari ini.",
      },
      {
        id: "refleksi-batasan-02",
        eyebrow: "Bagian 05 · Refleksi & Rujukan",
        title: "Refleksi dan Catatan Bukti",
        paragraphs: [
          "Kebiasaan lama manakah yang sebenarnya berfungsi memberi 'istirahat singkat' di sela hari sibukmu, dan aktivitas istirahat nyata apa yang bisa mengisi peran itu dengan lebih sehat?",
          "Batasan bukti: Penjelasan mengenai pembelajaran kebiasaan di bab ini merangkum literatur neuroperilaku dan model I-PACE, bukan hasil uji klinis khusus atas satu aplikasi swabantu tertentu.",
        ],
        actionPrompt:
          "Lanjutkan ke menu Rutinitas jika ingin memasang satu alternatif istirahat non-layar hari ini.",
      },
    ],
  },
  {
    id: "3",
    number: 3,
    phase: 1,
    phaseTitle: "Memahami Diri dan Kebiasaan Digital",
    approachTag: "Psikoedukasi",
    isCoreStart: true,
    title: "Kenali Pemicu dan Emosimu",
    subtitle: "Stres, bosan, kesepian, kelelahan, dan HALT sebagai pengingat kebutuhan diri",
    readMinutes: 7,
    summary:
      "Dorongan membuka layar sering kali bukan tentang layar itu sendiri, melainkan sinyal emosi atau fisik seperti lelah, stres, bosan, dan kesepian.",
    learningObjective:
      "Menggunakan kerangka emosi dan akronim HALT secara tepat sebagai pengingat praktis memeriksa kebutuhan diri, bukan sebagai alat diagnosis biologis.",
    evidenceStrength: "Teknik pendukung manajemen stres",
    evidenceLimitation:
      "HALT dipakai luas sebagai pengingat klinis praktis, tetapi penelitian langsung yang menguji HALT sebagai instrumen tervalidasi masih terbatas.",
    references: [
      {
        citation: "Brand et al. (2019), Neuroscience & Biobehavioral Reviews",
        url: "https://doi.org/10.1016/j.neubiorev.2019.06.032",
        note: "Menunjukkan pengaruh suasana hati negatif, stres, dan kelelahan terhadap meningkatnya dorongan kompensatoris.",
      },
      {
        citation: "Radunz et al. (2026), Clinical Psychology Review",
        url: "https://doi.org/10.1016/j.cpr.2026.102740",
        note: "Regulasi emosi tercatat sebagai salah satu komponen paling sering hadir dalam intervensi CBT.",
      },
    ],
    practiceLink: {
      href: "/urge-log",
      label: "Catat Pemicu di Catat Hasrat",
      description: "Rekam emosi atau kondisi HALT yang muncul bersama dorongan agar polanya terlihat jelas.",
    },
    nextModuleId: "4",
    sections: [
      {
        id: "mengapa-malam-lebih-berat",
        eyebrow: "Bagian 01 · Pembuka",
        title: "Mengapa Niat Pagi Hari Sering Kalah di Malam Hari?",
        paragraphs: [
          "Di pukul sembilan pagi dengan segelas teh hangat di meja, keputusan menjauhi gim berlebihan atau doomscrolling terasa masuk akal dan mudah dijalankan. Namun tepat di pukul sebelas malam, semua argumen rasional pagi tadi seolah menguap begitu saja.",
          "Perubahan drastis itu jarang terjadi karena kamu berubah menjadi orang lain di malam hari. Yang berubah adalah kondisi bahan bakar tubuh dan beban emosimu sepanjang hari: gula darah mulai turun, tenggat tugas menumpuk, pesan teman tidak dibalas, dan tubuh sebenarnya meminta tidur.",
          "Saat kebutuhan dasar itu tidak terbaca, otak cenderung memilih tombol pintas yang paling cepat menumpulkan rasa tidak enak: layar yang terus bergerak.",
        ],
        actionPrompt:
          "Ingat jam rawan terberatmu kemarin: kondisi fisik atau suasana hati apa yang sebenarnya sedang kamu rasakan saat itu?",
      },
      {
        id: "peran-emosi-dan-halt",
        eyebrow: "Bagian 02 · Penjelasan Psikologi",
        title: "Emosi yang Meminta Perhatian dan Posisi Tepat Akronim HALT",
        paragraphs: [
          "Tinjauan Radunz et al. (2026) menempatkan regulasi emosi dan psikoedukasi sebagai tulang punggung praktik CBT pada kebiasaan digital. Dorongan kuat sering berfungsi sebagai lampu indikator dashboard mobil: ia menyala bukan untuk memusuhimu, melainkan memberi tahu ada sesuatu yang perlu diperiksa.",
          "Dalam pendampingan pemulihan, dikenal akronim praktis HALT: Hungry (lapar/kurang nutrisi), Angry (kesal/tertekan), Lonely (kesepian/kurang terhubung), dan Tired (lelah fisik atau mental). Keempat kata itu membantu otak yang sedang berkabut segera mengecek kebutuhan dasar.",
          "Penting untuk bersikap jujur secara ilmiah: HALT adalah alat bantu mengingat praktis yang berguna di kehidupan sehari-hari, bukan empat penanda biologis terpisah atau sistem diagnosis klinis. Selain HALT, rasa bosan dan kecemasan akademik atau kerja juga sangat sering menjadi pemicu utama.",
        ],
        callout: {
          label: "Catatan Akurasi",
          text: "Gunakan HALT sebagai daftar cek praktis satu menit ('Apakah aku lapar, kesal, kesepian, atau lelah?'), bukan sebagai vonis medis.",
          tone: "emerald",
        },
        evidence: {
          study: "Radunz et al. (2026), Clinical Psychology Review",
          finding:
            "Dari 22 studi intervensi CBT, regulasi emosi dan pengenalan pemicu menjadi komponen inti yang paling konsisten diajarkan kepada peserta.",
        },
        actionPrompt:
          "Lain kali dorongan datang mendadak, cek satu saja: apakah tubuhmu sebenarnya sedang minta istirahat, makan, atau teman bicara?",
      },
      {
        id: "teknik-cek-kebutuhan-halt",
        eyebrow: "Bagian 03 · Mengenal Teknik",
        title: "Teknik Pemindaian Kebutuhan 30 Detik (HALT + Bosan)",
        paragraphs: [
          "Saat dorongan terasa tinggi, latih dirimu menjawab kebutuhan dasarnya lebih dulu alih-alih langsung menghakimi dorongannya:",
        ],
        bullets: [
          {
            lead: "Hungry / Haus:",
            detail:
              "Minum segelas air atau ambil camilan sehat kecil; dehidrasi ringan kerap terasa mirip gelisah.",
          },
          {
            lead: "Angry / Tertekan:",
            detail:
              "Tulis satu kalimat tentang hal yang membuatmu kesal hari ini atau lakukan enam tarikan napas perlahan.",
          },
          {
            lead: "Lonely / Bosan:",
            detail:
              "Kirim pesan singkat ke satu teman tepercaya atau pindah ke ruang keluarga sejenak daripada tenggelam di feed pasif.",
          },
          {
            lead: "Tired / Lelah:",
            detail:
              "Jika mata sudah berat dan jam sudah larut, beri izin diri untuk tidur lebih awal tanpa harus menyelesaikan semua hiburan malam ini.",
          },
        ],
        actionPrompt:
          "Pilih salah satu huruf dari HALT yang paling sering luput kamu sadari selama seminggu terakhir.",
      },
      {
        id: "penerapan-sederhana-03",
        eyebrow: "Bagian 04 · Penerapan Sederhana",
        title: "Mengisi Log Pemicu Pertama di Catat Hasrat",
        paragraphs: [
          "Setiap kali dorongan muncul hari ini (baik kamu akhirnya membuka aplikasi maupun berhasil menundanya), buka halaman Catat Hasrat di Lumif dan pilih satu atau dua label pemicu yang paling mendekati keadaanmu saat itu.",
          "Menamai emosi dengan kata spesifik (disebut affect labeling dalam riset psikologi) membantu menurunkan intensitas reaksi reaktif dan memberimu data nyata untuk dibaca di halaman Insight.",
        ],
        callout: {
          label: "Prinsip Pendampingan",
          text: "Mencatat pemicu bukan laporan dosa harian. Itu adalah catatan lapangan seorang peneliti yang sedang mempelajari pola tubuh dan pikirannya sendiri.",
          tone: "orange",
        },
        actionPrompt:
          "Catat minimal satu situasi pemicu di menu Catat Hasrat hari ini.",
      },
      {
        id: "refleksi-batasan-03",
        eyebrow: "Bagian 05 · Refleksi & Rujukan",
        title: "Refleksi dan Batasan Penelitian",
        paragraphs: [
          "Kondisi apa yang paling sering menyamar menjadi 'cuma ingin hiburan sebentar' dalam keseharianmu: rasa lelah, tertekan oleh tugas, atau rasa sepi di penghujung hari?",
          "Batasan bukti: Pengenalan emosi sejalan dengan praktik CBT modern, sedangkan penggunaan khusus akronim HALT lebih banyak ditopang pengalaman klinis daripada uji coba acak terkontrol terpisah.",
        ],
        actionPrompt:
          "Buka menu Catat Hasrat kapan pun dorongan datang agar catatan pribadimu makin akurat.",
      },
    ],
  },
  {
    id: "4",
    number: 4,
    phase: 1,
    phaseTitle: "Memahami Diri dan Kebiasaan Digital",
    approachTag: "Psikoedukasi",
    title: "Membaca Pola Kebiasaan Sendiri",
    subtitle: "Pencatatan sederhana situasi, pikiran, emosi, dorongan, dan perilaku",
    readMinutes: 6,
    summary:
      "Pelajari teknik pemantauan diri CBT (ABC dan pencatatan singkat) agar kamu bisa melihat pola yang sebelumnya terasa acak dan tak terkendali.",
    learningObjective:
      "Melakukan observasi diri singkat mengenai situasi, pikiran, emosi, dorongan, dan respons perilaku untuk menemukan titik intervensi paling efektif.",
    evidenceStrength: "Komponen CBT teruji pada konteks terkait",
    evidenceLimitation:
      "Self-monitoring paling bermanfaat bila tetap ringan dan tidak berubah menjadi obsesi mencatat setiap menit.",
    references: [
      {
        citation: "Radunz et al. (2026), Clinical Psychology Review",
        url: "https://doi.org/10.1016/j.cpr.2026.102740",
        note: "Mengidentifikasi self-monitoring dan psikoedukasi sebagai komponen berulang dalam program CBT.",
      },
      {
        citation: "Brand et al. (2019), Neuroscience & Biobehavioral Reviews",
        url: "https://doi.org/10.1016/j.neubiorev.2019.06.032",
        note: "Menekankan keterkaitan antara situasi eksternal, respons kognitif-afektif, dan kebiasaan.",
      },
    ],
    practiceLink: {
      href: "/urge-log",
      label: "Buka Riwayat Catat Hasrat",
      description: "Bandingkan jam kejadian dan lokasi yang paling sering muncul di riwayatmu.",
    },
    nextModuleId: "5",
    sections: [
      {
        id: "efek-lampu-senter",
        eyebrow: "Bagian 01 · Pembuka",
        title: "Mengapa Hal yang Dicatat Terasa Lebih Mudah Diatur",
        paragraphs: [
          "Ketika seseorang berkata, 'Rasanya sepanjang minggu ini aku gagal terus menahan diri dari scrolling', kesan yang muncul di kepala terasa kabur sekaligus berat. Kabur membuat otak merasa tidak berdaya.",
          "Namun saat kita menyalakan lampu senter berupa catatan sederhana tiga hari berturut-turut, gambar besarnya sering mengejutkan. Ternyata masalahnya bukan terjadi 24 jam penuh; ia hampir selalu terkonsentrasi di rentang pukul 21.30-22.30 saat duduk sendirian di tepi tempat tidur setelah hari yang melelahkan.",
          "Begitu pola waktu dan tempat terlihat, perubahan tidak lagi menuntut energi tanpa batas. Ia menjadi rencana yang terarah.",
        ],
        actionPrompt:
          "Bayangkan minggu lalu sejenak: jam dan tempat mana yang paling sering menjadi panggung kebiasaan digitalmu?",
      },
      {
        id: "lembar-abc-sederhana",
        eyebrow: "Bagian 02 · Penjelasan Psikologi",
        title: "Anatomi Pemantauan Diri dalam CBT",
        paragraphs: [
          "Dalam terapi perilaku kognitif, self-monitoring bukan sekadar menulis buku harian emosional. Ia membantu memisahkan lima elemen singkat dalam satu kejadian agar tidak tercampur aduk: Situasi (di mana, jam berapa, sedang apa), Pikiran yang muncul, Emosi dan intensitas dorongan, Perilaku yang dilakukan, serta Dampaknya setelah selesai.",
          "Tinjauan Radunz et al. (2026) menemukan bahwa pemantauan pola harian membantu individu mengenali pemicu spesifik dan mengevaluasi efektivitas strategi perubahan secara objektif, bukan berdasarkan perasaan semata.",
        ],
        evidence: {
          study: "Radunz et al. (2026), Clinical Psychology Review",
          finding:
            "Self-monitoring terstruktur menjadi salah satu dari 14 elemen praktik CBT yang membantu peserta mengenali hubungan langsung antara konteks, emosi, dan respons perilaku.",
        },
        actionPrompt:
          "Sadari bahwa satu catatan singkat 20 detik jauh lebih berguna daripada esai panjang yang malas ditulis besok.",
      },
      {
        id: "teknik-log-5-kolom",
        eyebrow: "Bagian 03 · Mengenal Teknik",
        title: "Teknik Catatan Mini 5-Elemen dalam 30 Detik",
        paragraphs: [
          "Agar ringan dilakukan setiap hari, cukup ringkas pengamatanmu menjadi lima fragmen pendek ini:",
        ],
        bullets: [
          {
            lead: "1. Kapan & di mana:",
            detail: "Contoh: 'Selasa, 22.10, rebahan di kamar'.",
          },
          {
            lead: "2. Pikiran awal:",
            detail: "Contoh: 'Cuma cek sebentar sebelum tidur'.",
          },
          {
            lead: "3. Rasa di badan / emosi:",
            detail: "Contoh: 'Bahu pegal, kesal soal tugas, dorongan 7/10'.",
          },
          {
            lead: "4. Langkah yang diambil:",
            detail: "Contoh: 'Sempat buka 10 menit, lalu pindah cas HP di meja'.",
          },
          {
            lead: "5. Pelajaran kecil:",
            detail: "Contoh: 'Rebahan dengan HP di tangan langsung memicu autopilot'.",
          },
        ],
        actionPrompt:
          "Gunakan format 5 fragmen di atas sebagai kacamata saat membaca ulang log harianmu di Lumif.",
      },
      {
        id: "penerapan-sederhana-04",
        eyebrow: "Bagian 04 · Penerapan Sederhana",
        title: "Menemukan Satu Jam Rawan dan Satu Tempat Rawan",
        paragraphs: [
          "Dari catatan tiga hari atau ingatanmu minggu ini, lingkari satu 'Jam Rawan' dan satu 'Tempat Rawan'. Misalnya: pukul 22.00 di kasur, atau pukul 13.00 di meja belajar setelah makan siang.",
          "Di Fase 2 nanti, kamu akan memakai penemuan ini untuk menyusun perubahan pikiran dan perubahan lingkungan tepat sasaran, sehingga kamu tidak membuang tenaga mengawasi jam-jam yang sebenarnya sudah aman.",
        ],
        callout: {
          label: "Aturan Emas Pencatatan",
          text: "Jika sehari terlewat tidak mencatat, jangan mengulang dari nol atau menghukum diri. Lanjutkan saja pencatatan pada kejadian berikutnya.",
          tone: "emerald",
        },
        actionPrompt:
          "Tentukan satu jam rawan dan satu lokasi rawan utamamu minggu ini.",
      },
      {
        id: "refleksi-batasan-04",
        eyebrow: "Bagian 05 · Refleksi & Rujukan",
        title: "Refleksi dan Batasan Bukti",
        paragraphs: [
          "Pola paling jelas apa yang mulai terlihat dari caramu menggunakan gawai minggu ini: apakah ia berkaitan dengan jam tidur, kelelahan sore, atau kebosanan di sela pekerjaan?",
          "Batasan bukti: Pencatatan diri membantu kesadaran awal, namun hasil yang bertahan lama umumnya tercapai ketika pencatatan digabung dengan restrukturisasi pikiran dan modifikasi lingkungan (Fase 2).",
        ],
        actionPrompt:
          "Kamu telah menyelesaikan fondasi Fase 1. Lanjutkan ke Fase 2 untuk teknik CBT praktis.",
      },
    ],
  },
  {
    id: "5",
    number: 5,
    phase: 2,
    phaseTitle: "Mengubah Pikiran dan Perilaku",
    approachTag: "CBT",
    isCoreStart: true,
    title: "Pikiran Bukan Selalu Fakta",
    subtitle: "Mengenali automatic thoughts seperti 'Cuma lima menit' dan kaitannya dengan perilaku",
    readMinutes: 7,
    summary:
      "Kenali kalimat batin kilat yang sering lolos tanpa disadari dan memicu perilaku kompulsif, serta cara menangkapnya sebelum menggerakkan jari.",
    learningObjective:
      "Mengidentifikasi automatic thoughts dan jebakan pembenaran diri yang umum mendahului kebiasaan digital bermasalah.",
    evidenceStrength: "Komponen CBT teruji pada konteks terkait",
    evidenceLimitation:
      "Mengenali pikiran otomatis membutuhkan latihan berulang karena pikiran tersebut sering muncul sangat cepat di bawah kesadaran penuh.",
    references: [
      {
        citation: "Radunz et al. (2026), Clinical Psychology Review",
        url: "https://doi.org/10.1016/j.cpr.2026.102740",
        note: "Menempatkan restrukturisasi kognitif dan identifikasi pikiran otomatis sebagai elemen utama CBT.",
      },
      {
        citation: "Zhang et al. (2026), Journal of Medical Internet Research",
        url: "https://doi.org/10.2196/81705",
        note: "Mendukung peran intervensi berbasis perilaku kognitif dalam menurunkan penggunaan bermasalah.",
      },
    ],
    practiceLink: {
      href: "/urge-log",
      label: "Tangkap Pikiran di Catat Hasrat",
      description: "Tuliskan satu kalimat izin batin yang muncul sebelum kamu membuka aplikasi.",
    },
    nextModuleId: "6",
    sections: [
      {
        id: "negosiator-di-kepala",
        eyebrow: "Bagian 01 · Pembuka",
        title: "Negosiator Halus yang Selalu Muncul Sebelum Impuls",
        paragraphs: [
          "Sebelum tangan membuka gim kelima malam itu atau membuka tab video pendek saat tugas menumpuk, hampir selalu ada negosiator halus di kepala yang berbisik terdengar sangat masuk akal.",
          "'Aku cuma mau buka lima menit untuk mengecek pembaruan.' 'Hari ini aku sudah capek banget, memangnya tidak boleh menghibur diri sebentar?' 'Ah, barusan sudah telanjur buka, sekalian saja selesaikan malam ini, besok baru mulai rapi lagi.'",
          "Sekilas kalimat-kalimat itu terdengar seperti pikiran rasional kita sendiri. Padahal, dalam CBT, kalimat kilat semacam itu disebut automatic thoughts: komentar spontan yang muncul otomatis saat emosi sedang meminta jalan keluar tercepat.",
        ],
        actionPrompt:
          "Kalimat negosiasi versi kamu sendiri apa yang paling sering berhasil membujukmu membuka layar?",
      },
      {
        id: "hubungan-pikiran-dan-tindakan",
        eyebrow: "Bagian 02 · Penjelasan Psikologi",
        title: "Mengapa Pikiran Otomatis Terasa Sangat Meyakinkan",
        paragraphs: [
          "Menurut kerangka kognitif CBT yang juga menjadi komponen sentral dalam tinjauan Radunz et al. (2026), pikiran otomatis bersifat ringkas, terasa mutlak benar saat emosi tinggi, dan jarang diuji ulang. Ketika otak lelah, kita memperlakukan setiap kalimat yang melintas sebagai fakta mutlak atau perintah yang wajib ditaati.",
          "Ada dua kategori pikiran yang paling sering menjebak dalam kebiasaan digital: pertama, permission-giving thoughts (pikiran pemberi izin) seperti 'Cuma sebentar kok'; kedua, pikiran hitam-putih seperti 'Karena sudah melanggar 15 menit, hariku sudah gagal total'.",
          "Padahal, pikiran hanyalah produk aktivitas mental, bukan berita fakta maupun surat perintah.",
        ],
        callout: {
          label: "Prinsip CBT",
          text: "Pikiran adalah usulan atau tafsir sementara dari otak, bukan perintah yang harus diikuti dan bukan selalu cerminan realitas utuh.",
          tone: "emerald",
        },
        evidence: {
          study: "Radunz et al. (2026), Clinical Psychology Review",
          finding:
            "Identifikasi maladaptive cognitions (termasuk keyakinan permisif dan penilaian kaku tentang kegagalan) merupakan elemen konsisten dalam program CBT yang berhasil.",
        },
        actionPrompt:
          "Bedakan mana fakta objektif ('Hari ini pukul 22.00') dan mana tafsir ('Aku harus hiburan sampai puas baru bisa tidur').",
      },
      {
        id: "teknik-beri-label-pikiran",
        eyebrow: "Bagian 03 · Mengenal Teknik",
        title: "Teknik Menamai Jenis Pikiran Penjebak",
        paragraphs: [
          "Ketika kamu mendengar negosiator batin tadi berbicara, tangkap dan beri label pendek seperti berikut:",
        ],
        bullets: [
          {
            lead: "Jebakan 'Cuma Sebentar':",
            detail:
              "Kalimat izin yang mengecilkan risiko durasi ('5 menit saja'), padahal riwayat membuktikan ia mudah molor.",
          },
          {
            lead: "Jebakan 'Hadiah Balas Dendam':",
            detail:
              "Merasa berhak membuang kendali penuh karena hari terasa berat ('Aku pantas bebas malam ini').",
          },
          {
            lead: "Jebakan 'Sudah Terlanjur':",
            detail:
              "Pola pikir semua-atau-tidak-sama-sekali yang membuat satu selip kecil diperpanjang menjadi begadang berjam-jam.",
          },
          {
            lead: "Jebakan 'Takut Ketinggalan':",
            detail:
              "Keyakinan bahwa tidak membuka linimasa beberapa jam akan membuat kita tertinggal hal krusial.",
          },
        ],
        actionPrompt:
          "Pilih nama satu jebakan yang paling akrab dengan polamu minggu ini.",
      },
      {
        id: "penerapan-sederhana-05",
        eyebrow: "Bagian 04 · Penerapan Sederhana",
        title: "Tambahkan Awalan 'Otakku Sedang Memunculkan Pikiran Bahwa...'",
        paragraphs: [
          "Coba trik sederhana ini tepat ketika pikiran otomatis muncul. Alih-alih menerima mentah-mentah kalimat 'Aku tidak sanggup belajar tanpa hiburan dulu', ucapkan dalam hati: 'Otakku sedang memunculkan pikiran bahwa aku tidak sanggup mulai tanpa hiburan.'",
          "Perubahan tata bahasa kecil itu menciptakan jeda pengamat. Kamu baru saja turun dari kursi penumpang yang terseret pikiran, lalu pindah ke kursi pengemudi yang melihat pikiran itu dari jarak aman.",
        ],
        callout: {
          label: "Latihan Cepat",
          text: "Jangan bertengkar dengan pikiran otomatis. Cukup catat atau beri nama jenis jebakannya dulu.",
          tone: "orange",
        },
        actionPrompt:
          "Uji awalan kalimat 'Otakku sedang memunculkan pikiran bahwa...' satu kali hari ini.",
      },
      {
        id: "refleksi-batasan-05",
        eyebrow: "Bagian 05 · Refleksi & Rujukan",
        title: "Refleksi dan Batasan Bukti",
        paragraphs: [
          "Kapan kalimat 'cuma lima menit' di masa lalu benar-benar berhenti tepat di menit kelima, dan kapan ia justru menjadi pintu pembuka kebiasaan lama?",
          "Batasan bukti: Menamai pikiran otomatis adalah tahap awal restrukturisasi kognitif; pada Bab 06 kita akan belajar bagaimana menguji dan menantangnya dengan bukti nyata.",
        ],
        actionPrompt:
          "Catat satu pikiran permisif di kolom catatan Catat Hasrat agar bisa kamu evaluasi di Bab 06.",
      },
    ],
  },
  {
    id: "6",
    number: 6,
    phase: 2,
    phaseTitle: "Mengubah Pikiran dan Perilaku",
    approachTag: "CBT",
    isCoreStart: true,
    title: "Menantang Pikiran yang Menjebak",
    subtitle: "Cognitive restructuring dengan mencari bukti, alternatif penjelasan, dan pikiran realistis",
    readMinutes: 8,
    summary:
      "Ubah pikiran otomatis yang bias menjadi perspektif yang jujur, realistis, dan membantu menggunakan tiga pertanyaan penguji bukti ala CBT.",
    learningObjective:
      "Menerapkan restrukturisasi kognitif secara terstruktur untuk mengevaluasi pikiran pemicu dan merumuskan respons yang seimbang.",
    evidenceStrength: "Komponen CBT teruji pada konteks terkait",
    evidenceLimitation:
      "Cognitive restructuring bekerja paling baik bila fokus pada bukti realistis, bukan afirmasi positif kosong.",
    references: [
      {
        citation: "Radunz et al. (2026), Clinical Psychology Review",
        url: "https://doi.org/10.1016/j.cpr.2026.102740",
        note: "Restrukturisasi kognitif termasuk tiga elemen praktik terbanyak dalam 22 intervensi CBT yang ditinjau.",
      },
      {
        citation: "Balhara et al. (2026), Journal of Medical Internet Research",
        url: "https://doi.org/10.2196/89280",
        note: "Meninjau efektivitas teknik kognitif dibandingkan intervensi lain untuk perilaku digital bermasalah.",
      },
    ],
    practiceLink: {
      href: "/home",
      label: "Lakukan Evaluasi Harian di Beranda",
      description: "Tuangkan pikiran yang muncul hari ini secara jujur di menu Evaluasi Harian.",
    },
    nextModuleId: "7",
    sections: [
      {
        id: "pengadilan-pikiran",
        eyebrow: "Bagian 01 · Pembuka",
        title: "Menguji Pikiran Seperti Jaksa dan Pembela yang Adil",
        paragraphs: [
          "Setelah berhasil menangkap pikiran di Bab 05, jebakan berikutnya adalah mencoba menggantinya dengan kalimat penyemangat palsu seperti 'Aku pasti selalu kuat 100%!' Ketika kondisi sedang penat, otak langsung menolak kalimat penyemangat yang tidak realistis.",
          "CBT tidak meminta kita berpikir manis secara paksa. CBT melatih kita berpikir akurat. Bayangkan pikiran otomatis itu sedang duduk di ruang pemeriksaan bukti: apa fakta yang mendukungnya, dan fakta nyata apa yang selama ini diabaikan?",
          "Pendekatan yang membumi seperti ini jauh lebih dipercaya oleh pikiran kita sendiri saat keadaan sedang sulit.",
        ],
        actionPrompt:
          "Ambil satu kalimat batin yang sering muncul saat dorongan kuat, lalu bayangkan kamu sedang memeriksanya di atas kertas.",
      },
      {
        id: "mengapa-restrukturisasi-efektif",
        eyebrow: "Bagian 02 · Penjelasan Psikologi",
        title: "Cara Kerja Cognitive Restructuring Menurut Riset CBT",
        paragraphs: [
          "Dalam tinjauan sistematis Radunz et al. (2026), cognitive restructuring masuk dalam tiga besar komponen inti yang paling sering diterapkan bersama psikoedukasi dan regulasi emosi. Tujuannya bukan membuktikan pikiranmu bodoh, melainkan melepaskan bias ekstrem.",
          "Ketika dorongan memuncak, pikiran mengalami penyempitan terowongan: ia hanya memperbesar rasa lega jangka pendek ('scroll sebentar bikin tenang') dan menghapus memori dampak dua jam kemudian ('tidur kacau, besok bangun makin berat').",
          "Mengembalikan dua sisi bukti ke layar kesadaran membuat pengambilan keputusan kembali utuh.",
        ],
        evidence: {
          study: "Radunz et al. (2026), Clinical Psychology Review",
          finding:
            "Evaluasi bukti dan pembentukan pikiran alternatif membantu melemahkan keyakinan maladaptif yang sebelumnya mendorong perilaku kompulsif.",
        },
        actionPrompt:
          "Perhatikan apakah pikiranmu saat dorongan muncul cenderung membesarkan rasa nikmat sesaat dan mengecilkan dampaknya besok.",
      },
      {
        id: "teknik-tiga-pertanyaan-bukti",
        eyebrow: "Bagian 03 · Mengenal Teknik",
        title: "Teknik Tiga Pertanyaan Penguji Bukti",
        paragraphs: [
          "Gunakan tiga pertanyaan praktis ini untuk merumuskan perspektif alternatif yang tetap hangat namun realistis:",
        ],
        bullets: [
          {
            lead: "1. Apa buktinya di kejadian nyata?",
            detail:
              "Dari 10 kali terakhir aku bilang 'cuma lima menit' saat sudah mengantuk, berapa kali benar-benar berhenti tepat waktu?",
          },
          {
            lead: "2. Apa penjelasan atau sudut pandang lain?",
            detail:
              "Apakah benar aku butuh hiburan terus-terusan, atau sebenarnya kepalaku hanya butuh jeda tenang 5 menit tanpa layar?",
          },
          {
            lead: "3. Apa saran yang akan kuberikan pada sahabat?",
            detail:
              "Jika teman dekat mengalami lelah yang sama, pikiran realistis dan suportif apa yang akan kukatakan kepadanya?",
          },
        ],
        actionPrompt:
          "Latih pertanyaan nomor 3 ('Apa saranku untuk sahabat?') karena nada bicara kita pada teman hampir selalu lebih adil.",
      },
      {
        id: "penerapan-sederhana-06",
        eyebrow: "Bagian 04 · Penerapan Sederhana",
        title: "Menulis Satu Kalimat Tandingan yang Masuk Akal",
        paragraphs: [
          "Mari lihat contoh konkret perubahan pikiran otomatis menjadi kalimat realistis:",
          "Pikiran lama: 'Karena tadi aku sudah buka medsos 20 menit di jam kerja, hari ini berantakan total. Sekalian lanjut saja.'",
          "Pikiran realistis: 'Dua puluh menit itu memang terlewat, tetapi aku masih punya beberapa jam ke depan untuk mengerjakan satu tugas terpenting. Aku bisa menutup tab sekarang tanpa memperpanjangnya.'",
        ],
        callout: {
          label: "Uji Realisme",
          text: "Kalimat tandingan yang bagus membuat bahumu sedikit lebih turun dan memberi ruang langkah kecil berikutnya, bukan menambah beban perfeksionis.",
          tone: "emerald",
        },
        actionPrompt:
          "Tuliskan satu kalimat realistis versimu di catatan Evaluasi Harian hari ini.",
      },
      {
        id: "refleksi-batasan-06",
        eyebrow: "Bagian 05 · Refleksi & Rujukan",
        title: "Refleksi dan Batasan Bukti",
        paragraphs: [
          "Setelah menuliskan pikiran realistis, perhatikan: apakah intensitas dorongan langsung turun ke angka nol, atau apakah ia sekadar terasa lebih mudah diajak bernegosiasi?",
          "Batasan bukti: Restrukturisasi kognitif efektif meredam distorsi pikiran, tetapi ketika kamu sangat lelah atau lingkungan penuh notifikasi, mengubah pikiran saja sulit bertahan tanpa penataan lingkungan (Bab 07).",
        ],
        actionPrompt:
          "Lanjutkan ke Bab 07 untuk belajar merancang lingkungan yang melindungi fokusmu.",
      },
    ],
  },
  {
    id: "7",
    number: 7,
    phase: 2,
    phaseTitle: "Mengubah Pikiran dan Perilaku",
    approachTag: "CBT",
    title: "Mengubah Lingkungan, Bukan Hanya Niat",
    subtitle: "Mengelola notifikasi, mengurangi akses otomatis, dan eksperimen perilaku",
    readMinutes: 7,
    summary:
      "Belajar merancang situasi fisik dan digital agar tidak terus-menerus memancing godaan, didukung riset pengendalian situasional dan eksperimen perilaku.",
    learningObjective:
      "Menerapkan strategi kontrol stimulus (stimulus control) dan eksperimen perilaku kecil di perangkat maupun ruangan sehari-hari.",
    evidenceStrength: "Komponen CBT teruji pada konteks terkait",
    evidenceLimitation:
      "Efektivitas blokir atau batasan aplikasi sangat bergantung pada kesepakatan pribadi agar tidak memicu pemberontakan atau perasaan terkekang.",
    references: [
      {
        citation: "Radunz et al. (2026), Clinical Psychology Review",
        url: "https://doi.org/10.1016/j.cpr.2026.102740",
        note: "Eksperimen perilaku dan perubahan lingkungan termasuk dalam strategi modifikasi perilaku CBT.",
      },
      {
        citation: "Sachdeva et al. (2026), Social Science & Medicine",
        url: "https://doi.org/10.1016/j.socscimed.2026.119683",
        note: "Menunjukkan pentingnya perencanaan konkret dan otonomi pilihan pengguna dalam mengatur pemakaian smartphone.",
      },
    ],
    practiceLink: {
      href: "/focus-guard",
      label: "Atur Batas Sukarela di Focus Guard",
      description: "Pasang jeda intervensi CBT/ACT untuk domain atau waktu yang sering mengganggu fokusmu.",
    },
    nextModuleId: "8",
    sections: [
      {
        id: "lingkungan-yang-berbisik",
        eyebrow: "Bagian 01 · Pembuka",
        title: "Mengapa Meja Belajar Penuh Pemicu Selalu Mengalahkan Niat Baik",
        paragraphs: [
          "Bayangkan seseorang sedang berusaha mengurangi camilan manis di malam hari, namun ia meletakkan toples kue terbuka tepat lima sentimeter di samping keyboard tempat ia bekerja berjam-jam. Seberapa besar energi mental yang habis hanya untuk berkata 'tidak' seratus kali semalam?",
          "Di dunia digital, hal yang sama terjadi saat layar ponsel menyala di samping laptop dengan denting notifikasi grup, badge merah di sudut ikon, dan login otomatis yang siap memutar video dalam satu sentuhan.",
          "Dalam psikologi pengendalian diri, peneliti berulang kali menemukan bahwa orang yang konsisten bukanlah yang paling kuat bertarung di menit terakhir, melainkan yang paling cerdas menyingkirkan pemicu dari garis pandang sejak awal.",
        ],
        actionPrompt:
          "Lihat sekeliling meja kerja dan layar ponselmu sekarang: tiga pemicu visual apa yang paling sering memanggil tanganmu?",
      },
      {
        id: "kontrol-stimulus-dan-perencanaan",
        eyebrow: "Bagian 02 · Penjelasan Psikologi",
        title: "Kontrol Stimulus dan Eksperimen Perilaku dalam CBT",
        paragraphs: [
          "Dua komponen perilaku penting dalam CBT adalah stimulus control (mengubah lingkungan agar pemicu berkurang dan perilaku baru lebih mudah dimulai) serta behavioral experiments (menguji secara langsung asumsi seperti 'Kalau notifikasi dimatikan, nanti hidupku kacau').",
          "Penelitian RCT terbaru pada penggunaan smartphone berbasis perencanaan dan otonomi (Sachdeva et al., 2026) juga memperlihatkan bahwa pembatasan bekerja paling sehat ketika dirancang sendiri oleh pengguna sesuai prioritasnya, bukan dipaksakan secara kaku.",
        ],
        evidence: {
          study: "Sachdeva et al. (2026), Social Science & Medicine; Radunz et al. (2026)",
          finding:
            "Kombinasi penataan pemicu lingkungan, perencanaan terarah, dan kebebasan memilih batas sendiri membantu menurunkan penggunaan berlebih secara lebih konsisten.",
        },
        actionPrompt:
          "Bedakan pemicu yang bisa langsung dihilangkan hari ini (misalnya notifikasi promosi) dari akses penting yang hanya perlu diberi jeda waktu.",
      },
      {
        id: "teknik-desain-friksi",
        eyebrow: "Bagian 03 · Mengenal Teknik",
        title: "Empat Penataan Lingkungan dengan Dampak Tertinggi",
        paragraphs: [
          "Pilih dua atau tiga langkah penataan lingkungan yang paling relevan dengan keseharianmu:",
        ],
        bullets: [
          {
            lead: "1. Matikan notifikasi non-manusia:",
            detail:
              "Sisakan bunyi hanya untuk pesan langsung atau telepon penting; matikan pop-up rekomendasi, diskon, dan likes.",
          },
          {
            lead: "2. Zona bebas ponsel di tempat tidur:",
            detail:
              "Isi daya ponsel di meja yang jaraknya minimal dua langkah dari kasur agar malam tidak otomatis berakhir dengan scrolling.",
          },
          {
            lead: "3. Mode abu-abu atau halaman depan bersih:",
            detail:
              "Kurangi kontras warna mencolok di malam hari atau sisakan hanya aplikasi utilitas di halaman pertama.",
          },
          {
            lead: "4. Pasang jeda intervensi sadar:",
            detail:
              "Gunakan Focus Guard di Lumif agar ketika situs pemicu dibuka refleks, muncul layar jeda bernapas sebelum lanjut.",
          },
        ],
        actionPrompt:
          "Ubah salah satu pengaturan notifikasi atau letak pengisi daya hari ini sebagai eksperimen 48 jam.",
      },
      {
        id: "penerapan-sederhana-07",
        eyebrow: "Bagian 04 · Penerapan Sederhana",
        title: "Merancang Satu Eksperimen Perilaku Malam Ini",
        paragraphs: [
          "Jangan ubah semuanya sekaligus agar tidak terasa menekan. Cukup jalankan satu eksperimen kecil selama dua hari: 'Malam ini pukul 22.00 sampai 06.30, ponsel kuletakkan di meja kerja (atau dalam mode Jangan Ganggu), lalu amati apa yang terjadi pada kualitas tidur dan suasana hatiku besok pagi.'",
          "Jika muncul pikiran 'Bagaimana kalau ada info penting?', catat hasilnya setelah dua hari. Eksperimen nyata sering membongkar ketakutan berlebihan yang hanya hidup di pikiran.",
        ],
        callout: {
          label: "Kendali Sukarela",
          text: "Atur batas di Focus Guard sebagai pagar bantu yang kamu pilih dengan sadar, bukan penjara yang membuatmu merasa diawasi.",
          tone: "orange",
        },
        actionPrompt:
          "Aktifkan satu domain atau jadwal fokus di Focus Guard sesuai batas yang benar-benar kamu inginkan.",
      },
      {
        id: "refleksi-batasan-07",
        eyebrow: "Bagian 05 · Refleksi & Rujukan",
        title: "Refleksi dan Batasan Bukti",
        paragraphs: [
          "Setelah mencoba eksperimen menaruh ponsel di luar jangkauan kasur atau mengatur notifikasi, hal kecil apa yang paling terasa berbeda di kepalamu?",
          "Batasan bukti: Pembatasan teknis dan kontrol stimulus sangat membantu mengurangi akses impulsif, namun bila emosi sulit belum ditangani, dorongan sering berpindah ke layar atau kebiasaan pengalihan lain (Bab 08).",
        ],
        actionPrompt:
          "Lanjutkan ke Bab 08 untuk belajar mengisi ruang kosong emosi dan kebosanan dengan aktivitas bermakna.",
      },
    ],
  },
  {
    id: "8",
    number: 8,
    phase: 2,
    phaseTitle: "Mengubah Pikiran dan Perilaku",
    approachTag: "CBT",
    title: "Menghadapi Bosan dan Emosi Sulit",
    subtitle: "Emotion regulation dan behavioral activation untuk membangun aktivitas alternatif bermakna",
    readMinutes: 8,
    summary:
      "Mengurangi layar meninggalkan ruang kosong waktu dan emosi. Pelajari cara menoleransi bosan serta mengaktifkan kegiatan nyata yang memberi energi kembali.",
    learningObjective:
      "Menggunakan regulasi emosi dan behavioral activation untuk mengisi jeda kebosanan maupun beban perasaan tanpa harus mengandalkan stimulasi layar cepat.",
    evidenceStrength: "Komponen CBT teruji pada konteks terkait",
    evidenceLimitation:
      "Aktivitas pengganti membutuhkan masa penyesuaian karena hiburan pasif di gawai terasa lebih instan dan nol usaha di awal.",
    references: [
      {
        citation: "Radunz et al. (2026), Clinical Psychology Review",
        url: "https://doi.org/10.1016/j.cpr.2026.102740",
        note: "Menunjukkan regulasi emosi dan aktivasi perilaku sebagai komponen utama intervensi CBT pada perilaku adiktif digital.",
      },
      {
        citation: "Balhara et al. (2026), Journal of Medical Internet Research",
        url: "https://doi.org/10.2196/89280",
        note: "Mendukung penguatan keterampilan coping non-digital sebagai bagian penting pemulihan kebiasaan.",
      },
    ],
    practiceLink: {
      href: "/games",
      label: "Coba Pengalihan Fokus atau Rutinitas",
      description: "Gunakan permainan fokus singkat atau pilih satu rutinitas fisik 5 menit saat energi menurun.",
    },
    nextModuleId: "9",
    sections: [
      {
        id: "kekosongan-yang-canggung",
        eyebrow: "Bagian 01 · Pembuka",
        title: "Ketika Layar Ditutup, Mengapa Ruang Kosong Terasa Canggung?",
        paragraphs: [
          "Banyak orang kaget pada hari-hari pertama mengurangi scrolling atau gim: bukan hanya dorongannya yang terasa aneh, tetapi juga waktu luang mendadak yang terasa terlalu sunyi dan membosankan.",
          "Selama berbulan-bulan, setiap celah tiga menit tanpa agenda langsung disumpal video pendek atau umpan berita. Ketika sumbat itu dicabut, wajar bila otak yang terbiasa disuapi rangsangan cepat langsung menuntut aktivitas.",
          "Karena itu, menyingkirkan kebiasaan bermasalah tidak cukup dilakukan lewat larangan kosong. Kita perlu membangun 'menu pengisi' yang realistis.",
        ],
        actionPrompt:
          "Di jam berapa kamu paling sering merasa bosan tanpa punya rencana cadangan yang siap langsung dilakukan?",
      },
      {
        id: "aktivasi-perilaku-dan-regulasi",
        eyebrow: "Bagian 02 · Penjelasan Psikologi",
        title: "Mengapa Behavioral Activation Mengubah Suasana Hati",
        paragraphs: [
          "Dalam terapi CBT, ada temuan penting bernama behavioral activation: kita tidak selalu menunggu mood membaik dulu baru bergerak. Sering kali, bergerak melakukan aktivitas nyata berenergi rendah-sedang justru perlahan mengangkat suasana hati dan menurunkan kejenuhan.",
          "Regulasi emosi juga mengingatkan kita bahwa bosan bukanlah keadaan berbahaya. Bosan adalah sinyal otak meminta perubahan rangsangan atau jeda kreatif. Jika langsung ditambal konsumsi pasif, kita kehilangan kesempatan berlatih menenangkan sistem saraf secara alami.",
        ],
        evidence: {
          study: "Radunz et al. (2026), Clinical Psychology Review; Balhara et al. (2026)",
          finding:
            "Intervensi CBT secara konsisten menggabungkan regulasi emosi dengan penjadwalan aktivitas alternatif bermakna agar pengguna tidak mengalami kekosongan perilaku.",
        },
        actionPrompt:
          "Ingat satu aktivitas sederhana tanpa layar yang meski agak malas memulainya, selalu membuatmu merasa lebih baik setelah selesai.",
      },
      {
        id: "teknik-menu-jeda-tiga-tingkat",
        eyebrow: "Bagian 03 · Mengenal Teknik",
        title: "Teknik Menyusun Menu Alternatif Berdasarkan Energi",
        paragraphs: [
          "Kesalahan umum dalam menyusun hobi baru adalah memilih kegiatan yang terlalu berat untuk dilakukan saat energi sedang tipis. Bagilah daftar pengalihanmu menjadi tiga tingkat energi:",
        ],
        bullets: [
          {
            lead: "Energi Rendah (2-5 menit):",
            detail:
              "Minum air hangat, mendengarkan satu lagu instrumental sambil memejamkan mata, peregangan leher, atau merapikan satu sudut meja.",
          },
          {
            lead: "Energi Sedang (10-20 menit):",
            detail:
              "Jalan kaki santai keliling gang, mandi air hangat, menyeduh kopi/teh, mencoret catatan harian, atau permainan fokus singkat di Lumif.",
          },
          {
            lead: "Energi Penuh (30+ menit):",
            detail:
              "Olahraga ringan, memasak hidangan sederhana, menelepon sahabat, membaca buku fisik, atau proyek kreatif tangan.",
          },
        ],
        actionPrompt:
          "Simpan minimal dua ide dari kategori 'Energi Rendah' agar selalu siap dipakai di malam hari.",
      },
      {
        id: "penerapan-sederhana-08",
        eyebrow: "Bagian 04 · Penerapan Sederhana",
        title: "Aturan Dua Menit Memulai Aktivitas Alternatif",
        paragraphs: [
          "Ketika rasa bosan atau suntuk menyerang dan kamu ingin meraih layar, buat kesepakatan kecil dengan dirimu: 'Aku hanya perlu mencoba satu aktivitas Energi Rendah selama dua menit. Setelah dua menit, aku bebas memilih langkah berikutnya.'",
          "Sering kali, bagian tersulit hanyalah menggerakkan tubuh dua menit pertama dari posisi diam. Begitu sirkulasi darah dan perhatian bergeser, rasa gelisah pun ikut melunak.",
        ],
        callout: {
          label: "Catatan Nyata",
          text: "Aktivitas fisik singkat tidak harus sefantastis video viral; nilainya terletak pada rasa hadir dan pulih setelahnya.",
          tone: "emerald",
        },
        actionPrompt:
          "Coba aturan dua menit hari ini saat rasa bosan datang di tengah hari.",
      },
      {
        id: "refleksi-batasan-08",
        eyebrow: "Bagian 05 · Refleksi & Rujukan",
        title: "Refleksi dan Batasan Bukti",
        paragraphs: [
          "Dari daftar tiga tingkat energi tadi, aktivitas kecil apa yang paling mungkin langsung kamu kerjakan malam ini tanpa perlu persiapan panjang?",
          "Batasan bukti: Behavioral activation terbukti kuat untuk perbaikan suasana hati dalam CBT umum; penerapannya pada kebiasaan digital dianjurkan sebagai pelengkap praktis.",
        ],
        actionPrompt:
          "Selamat menyelesaikan Fase 2! Di Fase 3, kita beralih ke pendekatan ACT untuk berdamai dengan dorongan.",
      },
    ],
  },
];
