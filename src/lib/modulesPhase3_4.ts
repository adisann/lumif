import type { ModuleItem } from "./modulesTypes";

export const MODULES_PHASE_3_4: ModuleItem[] = [
  {
    id: "9",
    number: 9,
    phase: 3,
    phaseTitle: "Berdamai dengan Dorongan dan Emosi",
    approachTag: "ACT",
    isCoreStart: true,
    title: "Dorongan Tidak Harus Dituruti",
    subtitle: "Mengenal acceptance dan urge surfing tanpa wajib bertindak mengikuti impuls",
    readMinutes: 7,
    summary:
      "Pelajari perbedaan antara penerimaan aktif (acceptance) dengan menyerah, serta teknik urge surfing untuk mengamati gelombang dorongan hingga melunak.",
    learningObjective:
      "Mempraktikkan acceptance dan urge surfing guna menciptakan jeda sadar antara munculnya dorongan dan tindakan yang dipilih.",
    evidenceStrength: "Pendekatan ACT eksploratif dan potensial",
    evidenceLimitation:
      "Durasi dan intensitas tiap gelombang dorongan sangat bervariasi; tidak ada jaminan semua dorongan hilang tepat dalam 90 detik.",
    references: [
      {
        citation: "Packer et al. (2026), Journal of Contextual Behavioral Science",
        url: "https://doi.org/10.1016/j.jcbs.2026.101003",
        note: "Scoping review 20 studi (21 intervensi) yang menunjukkan potensi pendekatan ACT pada isu teknologi digital.",
      },
      {
        citation: "NHS Inform, Breathing and Relaxation Exercises",
        url: "https://www.nhsinform.scot/healthy-living/mental-wellbeing/breathing-and-relaxation-exercises/grounding-exercises",
        note: "Panduan regulasi ketenangan dan perhatian terhadap sensasi tubuh yang mudah diakses.",
      },
    ],
    practiceLink: {
      href: "/exercises/breathing",
      label: "Praktik Urge Surfing & Napas",
      description: "Gunakan latihan napas terpandu di Lumif sebagai jangkar saat gelombang dorongan hadir.",
    },
    nextModuleId: "10",
    sections: [
      {
        id: "tarik-tambang-dengan-dorongan",
        eyebrow: "Bagian 01 · Pembuka",
        title: "Mengapa Melawan Dorongan Mati-matian Sering Membuat Kita Lelah Duluan?",
        paragraphs: [
          "Jam empat sore, tenggat belajar makin dekat, kepala mulai terasa penuh. Tiba-tiba muncul keinginan kuat membuka media sosial atau video pendek untuk 'bernapas sejenak'. Kamu tahu kamu masih harus menyelesaikan bab ini, lalu kamu berkata keras dalam hati: 'Jangan buka! Hilangkan perasaan ingin ini sekarang juga!'",
          "Anehnya, makin keras kamu menuntut dorongan itu lenyap, makin tegang dada terasa dan makin kencang pikiran berteriak memintanya. Dalam ACT, ini disebut seperti bermain tarik tambang melawan raksasa di seberang jurang: semakin kuat kamu menarik tali agar monster dorongan itu mati, semakin terseret kakimu ke pinggir jurang.",
          "Bagaimana jika opsinya bukan 'menang perang melawan rasa ingin' atau 'menyerah membuka aplikasi'? Bagaimana jika kamu cukup menjatuhkan talinya?",
        ],
        actionPrompt:
          "Ingat kembali momen terakhir kamu bertarung batin: apa rasanya di dada atau perut saat mencoba mengusir dorongan secara paksa?",
      },
      {
        id: "acceptance-bukan-menyerah",
        eyebrow: "Bagian 02 · Penjelasan Psikologi",
        title: "Memahami Urge dan Mengapa Acceptance Berbeda dari Menyerah",
        paragraphs: [
          "Dorongan (urge) adalah gelombang sensasi fisik dan mental sementara yang mengajak kita mengulang suatu kebiasaan cepat. Banyak orang mengira satu-satunya cara tidak menuruti dorongan adalah membunuh perasaan ingin itu lebih dulu.",
          "Pendekatan Acceptance and Commitment Therapy (ACT) menawarkan jalan lain bernama psychological flexibility: kemampuan memberi ruang bagi rasa tidak nyaman untuk hadir sementara, tanpa harus tunduk mengikuti perintahnya. Acceptance bukan berarti 'aku suka dorongan ini' atau 'aku menyerah membuka aplikasi'. Acceptance berarti berkata jujur: 'Keinginan itu memang sedang ada di tubuhku sekarang, dan aku tetap bebas menentukan gerak tanganku.'",
          "Scoping review oleh Packer et al. (2026) atas 21 intervensi ACT terkait teknologi digital mencatat potensi besar pendekatan ini untuk melatih penerimaan dorongan, meski sebagian besar risetnya masih bersifat eksploratif sehingga tidak diklaim sebagai penyembuhan instan.",
        ],
        callout: {
          label: "Meluruskan Mitos 90 Detik",
          text: "Dorongan datang dan turun seperti ombak, tetapi tidak ada aturan baku bahwa semua dorongan otomatis lenyap dalam 90 detik. Durasi dan tingginya gelombang berbeda-beda tergantung lelah, konteks, dan stres.",
          tone: "emerald",
        },
        evidence: {
          study: "Packer et al. (2026), Journal of Contextual Behavioral Science",
          finding:
            "Tinjauan atas 20 penelitian (21 intervensi ACT digital) menunjukkan pelatihan acceptance dan fleksibilitas psikologis berpotensi membantu pengguna merespons dorongan tanpa perilaku impulsif.",
        },
        actionPrompt:
          "Ubah targetmu dari 'menghilangkan keinginan seketika' menjadi 'membiarkan keinginan lewat sambil tetap memegang kemudi tangan'.",
      },
      {
        id: "mengenal-urge-surfing",
        eyebrow: "Bagian 03 · Mengenal Teknik",
        title: "Mengenal Teknik Urge Surfing",
        paragraphs: [
          "Pertama kali diperkenalkan psikolog Alan Marlatt, urge surfing mengajakmu membayangkan dorongan seperti ombak laut. Kamu tidak bisa menghentikan lautan berombak dengan tangan kosong, tetapi kamu bisa belajar berselancar di punggung ombak sampai tenaganya mereda:",
        ],
        bullets: [
          {
            lead: "1. Sadari dan hentikan refleks:",
            detail:
              "Tahan tangan dan katakan pelan dalam hati: 'Ada gelombang dorongan yang sedang datang.'",
          },
          {
            lead: "2. Amati sensasi di tubuh:",
            detail:
              "Di mana ia paling terasa? Hangat di wajah, sesak di dada, atau gelisah di telapak tangan? Amati seperti pengamat cuaca yang ingin tahu.",
          },
          {
            lead: "3. Bernapas bersama gelombang:",
            detail:
              "Tarik napas tenang lewat hidung dan embuskan sedikit lebih panjang tanpa mencoba memaksa sensasinya hilang.",
          },
          {
            lead: "4. Pilih langkah berikutnya secara sadar:",
            detail:
              "Setelah intensitasnya bergeser atau pikiran agak jernih, pilih tindakan berikutnya sesuai tujuanmu hari itu.",
          },
        ],
        actionPrompt:
          "Saat muncul impuls hari ini, cari di bagian tubuh mana sensasi dorongan paling terasa lebih dulu.",
      },
      {
        id: "penerapan-sederhana-09",
        eyebrow: "Bagian 04 · Penerapan Sederhana",
        title: "Latihan Berselancar 1 Menit di Kursi Belajarmu",
        paragraphs: [
          "Coba bayangkan situasi pembuka tadi saat sedang belajar lalu ingin membuka media sosial. Letakkan kedua telapak kaki rata di lantai, sandarkan punggung, dan lepaskan ponsel ke sudut meja yang tidak menyentuh tanganmu.",
          "Fokus pada naik turun napas di perut selama enam siklus napas pelan. Perhatikan bahwa sensasi ingin itu bisa naik sedikit, lalu mendatar, atau berubah bentuk. Tidak terjadi bahaya apa pun hanya karena sebuah keinginan tidak langsung dituruti.",
        ],
        callout: {
          label: "Gunakan Fitur Lumif",
          text: "Kalau butuh pemandu visual tempo napas saat ombak dorongan terasa cukup kencang, buka Latihan Napas dari beranda atau Aksi Cepat.",
          tone: "orange",
        },
        actionPrompt:
          "Uji bertahan mengamati satu dorongan kecil hari ini selama minimal enam tarikan napas sebelum memutuskan apa pun.",
      },
      {
        id: "refleksi-batasan-09",
        eyebrow: "Bagian 05 · Refleksi & Rujukan",
        title: "Refleksi dan Batasan Penelitian",
        paragraphs: [
          "Ketika kamu berani duduk mengamati dorongan tanpa langsung bertindak maupun memarahinya, perubahan apa yang paling terasa pada intensitas kegelisahanmu?",
          "Batasan bukti: Packer et al. (2026) menegaskan studi ACT khusus isu digital masih terus berkembang dan membutuhkan uji klinis skala lebih besar; urge surfing berfungsi sebagai keterampilan regulasi diri, bukan pengobatan medis tunggal.",
        ],
        actionPrompt:
          "Lanjutkan ke Bab 10 untuk belajar mengambil jarak dari pikiran keras seperti 'Aku pasti gagal'.",
      },
    ],
  },
  {
    id: "10",
    number: 10,
    phase: 3,
    phaseTitle: "Berdamai dengan Dorongan dan Emosi",
    approachTag: "ACT",
    title: "Aku Punya Pikiran, Bukan Dikendalikan Pikiran",
    subtitle: "Mengenal cognitive defusion dengan mengambil jarak dari narasi keras di kepala",
    readMinutes: 7,
    summary:
      "Pelajari teknik cognitive defusion dari ACT agar pikiran seperti 'Aku pasti gagal' tidak lagi terasa seperti kebenaran mutlak yang menghentikan langkahmu.",
    learningObjective:
      "Menggunakan teknik defusi kognitif untuk memisahkan diri sebagai pengamat dari isi pikiran yang menilai atau mendesak.",
    evidenceStrength: "Pendekatan ACT eksploratif dan potensial",
    evidenceLimitation:
      "Defusi bukan metode menghapus pikiran negatif selamanya; ia melatih cara merespons pikiran sehingga pengaruhnya terhadap perilaku berkurang.",
    references: [
      {
        citation: "Packer et al. (2026), Journal of Contextual Behavioral Science",
        url: "https://doi.org/10.1016/j.jcbs.2026.101003",
        note: "Meninjau penerapan proses inti ACT termasuk cognitive defusion pada perilaku penggunaan teknologi.",
      },
    ],
    practiceLink: {
      href: "/meditation",
      label: "Latih Jarak Pikiran di Meditasi",
      description: "Luangkan 3 menit mengamati pikiran lewat seperti awan di layar langit kesadaran.",
    },
    nextModuleId: "11",
    sections: [
      {
        id: "layar-di-depan-mata",
        eyebrow: "Bagian 01 · Pembuka",
        title: "Saat Teks Pikiran Menempel Terlalu Dekat di Wajah",
        paragraphs: [
          "Ambil kedua telapak tanganmu lalu tempelkan tepat dua sentimeter di depan mata. Ketika tangan sedekat itu, seluruh ruangan di sekitarmu seolah hilang; yang terlihat hanyalah garis tanganmu sendiri.",
          "Hal serupa terjadi dalam apa yang oleh ACT disebut cognitive fusion: saat pikiran berbunyi 'Aku memang lemah dan tidak bakal konsisten', kita menempelkan kalimat itu tepat di depan bola mata sehingga seluruh dunia terasa hanya berisi kalimat tersebut.",
          "Sebaliknya, begitu tangan perlahan diturunkan ke pangkuan, tangan itu masih ada di sana, tetapi kamu kembali bisa melihat pintu, meja, cahaya lampu, dan ruang gerak di sekitarmu.",
        ],
        actionPrompt:
          "Pernahkah satu kalimat kritik diri membuatmu langsung merasa tidak ada gunanya mencoba lagi hari itu?",
      },
      {
        id: "pengertian-defusi-kognitif",
        eyebrow: "Bagian 02 · Penjelasan Psikologi",
        title: "Apa Itu Cognitive Defusion dalam ACT?",
        paragraphs: [
          "Jika di Bab 06 (CBT) kamu belajar menguji isi pikiran dengan bukti, di Bab 10 (ACT) kamu mengenal pendekatan pelengkap bernama cognitive defusion: mengubah relasimu dengan pikiran tanpa harus memenangkan debat dengannya.",
          "Mengapa penting punya dua alat sekaligus? Karena ada kalanya pikiran muncul seperti suara radio latar yang berulang-ulang saat kita capek ('Percuma, kamu lemah', 'Harus dibuka sekarang'). Berdebat terus dengan radio latar bisa menghabiskan tenaga. Dengan defusi, kita cukup menyadari: itu suara siaran radio, bukan fakta di ruangan ini.",
        ],
        evidence: {
          study: "Packer et al. (2026), Journal of Contextual Behavioral Science",
          finding:
            "Cognitive defusion merupakan satu dari enam proses inti ACT yang membantu melemahkan keterikatan kaku terhadap pikiran pemicu dan penilaian diri keras.",
        },
        actionPrompt:
          "Sadari bahwa kamu bisa mendengar pikiran negatif lewat sambil tetap memilih perilaku yang sehat.",
      },
      {
        id: "teknik-defusi-praktis",
        eyebrow: "Bagian 03 · Mengenal Teknik",
        title: "Tiga Latihan Defusi Sederhana yang Bisa Dipakai Seketika",
        paragraphs: [
          "Pilih salah satu gaya defusi yang terasa paling natural bagimu saat pikiran mendesak atau menghakimi muncul:",
        ],
        bullets: [
          {
            lead: "1. Teknik Penambahan Jarak Kata:",
            detail:
              "Ubah 'Aku pasti gagal menjaga kendali' menjadi 'Aku memperhatikan ada pikiran bahwa aku pasti gagal'.",
          },
          {
            lead: "2. Teknik 'Terima Kasih, Pikiran':",
            detail:
              "Tanggapi pikiran pencari pelarian dengan ringan: 'Terima kasih sudah mengingatkan caramu mencari nyaman, tapi saat ini aku pilih lanjut tidur/bekerja.'",
          },
          {
            lead: "3. Metafora Daun di Sungai:",
            detail:
              "Bayangkan setiap pikiran ditulis di atas sehelai daun yang hanyut pelan di permukaan sungai di depanmu, tanpa perlu dikejar atau ditenggelamkan.",
          },
        ],
        actionPrompt:
          "Uji teknik penambahan jarak kata pada satu pikiran yang sering menghambatmu minggu ini.",
      },
      {
        id: "penerapan-sederhana-10",
        eyebrow: "Bagian 04 · Penerapan Sederhana",
        title: "Uji Jarak 20 Detik Saat Muncul Rasa Bersalah",
        paragraphs: [
          "Kapan pun suara kritik diri datang ('Kamu tidak disiplin'), coba ulangi kalimat itu dalam hati dengan tempo sangat lambat atau bayangkan suara itu terdengar seperti penyiar radio tua dari kejauhan.",
          "Tujuannya bukan menertawakan perasaanmu, melainkan memecah ilusi bahwa setiap kalimat di kepala harus diperlakukan sebagai perintah serius.",
        ],
        callout: {
          label: "Bedakan dengan Penolakan",
          text: "Defusi mengakui isi pikiran itu muncul sebagai peristiwa mental sementara, tanpa memercayainya sebagai ramalan masa depanmu.",
          tone: "emerald",
        },
        actionPrompt:
          "Buka halaman Meditasi Terpandu selama 3 menit bila kepalamu terasa penuh narasi batin yang berulang.",
      },
      {
        id: "refleksi-batasan-10",
        eyebrow: "Bagian 05 · Refleksi & Rujukan",
        title: "Refleksi dan Batasan Bukti",
        paragraphs: [
          "Dari tiga latihan defusi di atas, cara mana yang paling cepat membantumu melihat pikiran dari kejauhan tanpa terasa dibuat-buat?",
          "Batasan bukti: Sebagian teknik defusi dalam kajian ACT terkait teknologi digital masih memerlukan uji klinis lanjutan untuk membandingkan efek jangka panjangnya secara terpisah.",
        ],
        actionPrompt:
          "Lanjutkan ke Bab 11 untuk membawa kesadaran kembali ke momen kini lewat tubuh.",
      },
    ],
  },
  {
    id: "11",
    number: 11,
    phase: 3,
    phaseTitle: "Berdamai dengan Dorongan dan Emosi",
    approachTag: "ACT",
    title: "Kembali ke Saat Ini",
    subtitle: "Mindful awareness, kesadaran tubuh, dan grounding 5-4-3-2-1 sebagai alat bantu",
    readMinutes: 6,
    summary:
      "Saat stres atau terpicu membuat pikiran melayang ke kekhawatiran dan layar, teknik kesadaran panca indra 5-4-3-2-1 membantu menjangkarkanmu kembali ke kenyataan fisik.",
    learningObjective:
      "Menggunakan teknik kesadaran saat ini (present-moment awareness) dan grounding 5-4-3-2-1 secara tepat sebagai alat bantu regulasi stres sesaat.",
    evidenceStrength: "Teknik pendukung manajemen stres",
    evidenceLimitation:
      "Grounding 5-4-3-2-1 membantu meredakan ketegangan akut di momen sekarang, tetapi bukan pengobatan khusus yang menyembuhkan ketergantungan digital.",
    references: [
      {
        citation: "NHS Inform, Grounding Exercises",
        url: "https://www.nhsinform.scot/healthy-living/mental-wellbeing/breathing-and-relaxation-exercises/grounding-exercises",
        note: "Panduan praktis teknik panca indra 5-4-3-2-1 untuk mengembalikan fokus saat stres atau kewalahan.",
      },
      {
        citation: "Packer et al. (2026), Journal of Contextual Behavioral Science",
        url: "https://doi.org/10.1016/j.jcbs.2026.101003",
        note: "Menjelaskan kontak dengan momen saat ini sebagai proses inti dalam fleksibilitas psikologis ACT.",
      },
    ],
    practiceLink: {
      href: "/exercises/breathing",
      label: "Buka Latihan Napas & Grounding",
      description: "Gabungkan kesadaran napas terpandu dengan pengamatan panca indra di ruanganmu.",
    },
    nextModuleId: "12",
    sections: [
      {
        id: "terhisap-ke-dalam-kaca",
        eyebrow: "Bagian 01 · Pembuka",
        title: "Tubuh di Kamar, Pikiran Terhisap ke Dalam Kaca Enam Inci",
        paragraphs: [
          "Pernahkah kamu duduk satu jam di meja sambil menatap linimasa berita atau media sosial yang penuh perdebatan dan pencapaian orang lain, lalu saat mendongak kamu merasa seperti baru kembali dari tempat yang sangat jauh dan melelahkan?",
          "Selama satu jam tadi, tubuhmu sebenarnya aman duduk di kursi kamar, tetapi perhatianmu tersedot penuh ke masa depan yang cemas, perbandingan sosial, atau ratusan potongan video acak. Jantung berdetak lebih cepat padahal tidak ada bahaya fisik di sekitarmu.",
          "Salah satu cara paling sederhana untuk keluar dari kabut mental itu adalah mengajak panca indra kembali ke ruangan tempat tubuhmu berada detik ini.",
        ],
        actionPrompt:
          "Sekarang juga, cek posisi duduk dan suhu udara di kulit tanganmu: seberapa sering kita lupa merasakan ruangan fisik sendiri?",
      },
      {
        id: "peran-present-moment-awareness",
        eyebrow: "Bagian 02 · Penjelasan Psikologi",
        title: "Mengapa Kesadaran Saat Ini Membantu Meredam Impuls",
        paragraphs: [
          "Dalam kerangka ACT, kontak dengan momen sekarang (present-moment awareness) membuat kita sadar atas apa yang benar-benar terjadi di depan mata, bukan tenggelam dalam skenario pikiran. Saat emosi tegang, sistem saraf cenderung masuk ke mode siaga atau mencari pelarian cepat ke layar.",
          "Teknik grounding panca indra seperti panduan 5-4-3-2-1 yang disarankan layanan kesehatan masyarakat seperti NHS Inform bekerja dengan mengarahkan ulang pusat perhatian otak dari pusaran pikiran abstrak ke input sensorik yang nyata dan netral.",
          "Penting dipahami secara proporsional: grounding adalah alat bantu menenangkan diri saat stres, kecemasan, atau dorongan memuncak, bukan obat khusus atau terapi tunggal untuk kebiasaan digital.",
        ],
        callout: {
          label: "Posisi yang Tepat",
          text: "Gunakan grounding 5-4-3-2-1 sebagai 'tombol jangkar' saat pikiran melayang atau dada terasa penuh, agar kamu cukup tenang untuk menentukan tindakan berikutnya.",
          tone: "emerald",
        },
        evidence: {
          study: "NHS Inform Grounding Guide; Packer et al. (2026), JCBS",
          finding:
            "Latihan kesadaran sensorik dan momen kini membantu menurunkan aktivasi cemas sesaat serta mendukung kapasitas memilih tindakan secara sadar.",
        },
        actionPrompt:
          "Anggap grounding sebagai penenang sistem saraf selama 60 detik, bukan sulap penghapus masalah.",
      },
      {
        id: "teknik-grounding-54321",
        eyebrow: "Bagian 03 · Mengenal Teknik",
        title: "Panduan Langkah Demi Langkah Teknik 5-4-3-2-1",
        paragraphs: [
          "Tarik napas pelan sekali, letakkan ponsel, lalu sebutkan dalam hati lima lapisan sensorik berikut tanpa terburu-buru:",
        ],
        bullets: [
          {
            lead: "5 hal yang bisa dilihat:",
            detail:
              "Perhatikan detail nyata di ruangan, misalnya warna sudut buku, pola tirai, atau bayangan lampu di dinding.",
          },
          {
            lead: "4 hal yang bisa disentuh:",
            detail:
              "Rasakan pijakan kaki di lantai, tekstur kain celana, permukaan meja kayu, atau udara dingin di ujung jari.",
          },
          {
            lead: "3 suara yang terdengar:",
            detail:
              "Dengarkan suara yang biasanya terabaikan: dengung kipas angin, kendaraan dari kejauhan, atau napasmu sendiri.",
          },
          {
            lead: "2 aroma yang tercium:",
            detail:
              "Tangkap aroma sabun, kopi, kertas, atau udara bersih di ruangan.",
          },
          {
            lead: "1 hal yang bisa dirasakan atau disyukuri:",
            detail:
              "Rasakan sisa rasa air di mulut, atau sadari satu fakta aman bahwa tubuhmu saat ini sedang bernapas tenang.",
          },
        ],
        actionPrompt:
          "Coba hitung 5 hal yang terlihat di sekitarmu sekarang selama 15 detik sebelum lanjut membaca.",
      },
      {
        id: "penerapan-sederhana-11",
        eyebrow: "Bagian 04 · Penerapan Sederhana",
        title: "Versi Mini 20 Detik Saat di Tempat Umum",
        paragraphs: [
          "Jika kamu sedang berada di kelas, perpustakaan, atau transportasi umum dan dorongan atau cemas datang tiba-tiba, kamu tidak harus menjalankan seluruh urutan panjang.",
          "Cukup lakukan versi senyap 3-2-1: temukan 3 benda berwarna tertentu, tekan pelan telapak kaki ke sepatu sambil merasakan kontaknya (2 titik sentuh), lalu ikuti 1 embusan napas penuh sampai selesai.",
        ],
        callout: {
          label: "Tips Nyaman",
          text: "Tidak ada nilai benar atau salah saat menghitung. Bahkan jika baru sampai hitungan ke-4 pikiran sudah jauh lebih tenang, tujuannya sudah tercapai.",
          tone: "orange",
        },
        actionPrompt:
          "Praktikkan versi senyap 3-2-1 ketika antre atau merasa tegang hari ini.",
      },
      {
        id: "refleksi-batasan-11",
        eyebrow: "Bagian 05 · Refleksi & Rujukan",
        title: "Refleksi dan Batasan Bukti",
        paragraphs: [
          "Indra mana yang paling cepat menarik perhatianmu kembali ke ruangan saat kepalamu terasa sibuk: penglihatan, sentuhan fisik, atau pendengaran?",
          "Batasan bukti: Teknik 5-4-3-2-1 berakar pada praktik manajemen stres dan regulasi emosional umum serta belum diuji sebagai intervensi spesifik mandiri untuk kecanduan teknologi.",
        ],
        actionPrompt:
          "Lanjutkan ke Bab 12 untuk memisahkan jati dirimu dari kebiasaan yang sedang diubah.",
      },
    ],
  },
  {
    id: "12",
    number: 12,
    phase: 3,
    phaseTitle: "Berdamai dengan Dorongan dan Emosi",
    approachTag: "ACT",
    title: "Aku Lebih dari Kebiasaanku",
    subtitle: "Mengenal self-as-context, nilai pribadi, dan memisahkan identitas dari perilaku",
    readMinutes: 8,
    summary:
      "Mengubah kebiasaan jauh lebih berat bila kamu mengidentikkan diri sebagai 'orang gagal'. Pelajari konsep diri pengamat (self-as-context) dan pemisahan identitas dari perilaku.",
    learningObjective:
      "Memisahkan identitas diri yang utuh dari perilaku kebiasaan yang sedang ingin diperbaiki, sekaligus membangun rasa kasih pada diri saat berproses.",
    evidenceStrength: "Pendekatan ACT eksploratif dan potensial",
    evidenceLimitation:
      "Perubahan pandangan diri membutuhkan konsistensi refleksi serta lingkungan sosial yang tidak menghakimi.",
    references: [
      {
        citation: "Packer et al. (2026), Journal of Contextual Behavioral Science",
        url: "https://doi.org/10.1016/j.jcbs.2026.101003",
        note: "Membahas peran self-as-context dan values dalam intervensi ACT untuk pemulihan kebiasaan digital.",
      },
      {
        citation: "Zhang et al. (2026), Journal of Medical Internet Research",
        url: "https://doi.org/10.2196/81705",
        note: "Menekankan pentingnya faktor psikologis pendukung di samping strategi perilaku jangka pendek.",
      },
    ],
    practiceLink: {
      href: "/community",
      label: "Sapa Ruang Aman di Komunitas",
      description: "Bagikan langkah kecil tanpa stigma bersama pengguna lain yang sama-sama belajar.",
    },
    nextModuleId: "13",
    sections: [
      {
        id: "label-yang-menempel-terlalu-lama",
        eyebrow: "Bagian 01 · Pembuka",
        title: "Bahaya Memakai Kebiasaan Lama Sebagai Nama Belakangmu",
        paragraphs: [
          "Dengar perbedaan dua kalimat ini. Kalimat pertama: 'Semalam aku kelepasan scrolling satu jam.' Kalimat kedua: 'Aku memang orang yang pemalas, lemah, dan tidak bisa diatur.'",
          "Sekilas tampak sepele, tetapi kalimat kedua melakukan sesuatu yang sangat mahal ongkos psikologisnya: ia menyatukan satu perilaku tertentu dengan seluruh identitas dirimu. Ketika seseorang percaya dirinya pada dasarnya pemalas atau rusak, perasaan malu membesar. Ironisnya, rasa malu yang berat justru mendorong otak mencari peredam sakit paling cepat: kembali ke layar.",
          "Dalam banyak penelitian kebiasaan, rasa malu bukan bahan bakar perubahan yang stabil. Keterbukaan yang adil justru membuat orang jauh lebih jujur mengevaluasi langkahnya.",
        ],
        actionPrompt:
          "Label diri negatif apa yang paling sering muncul di kepalamu saat kamu kelelahan atau kelepasan bermain gawai?",
      },
      {
        id: "diri-sebagai-konteks",
        eyebrow: "Bagian 02 · Penjelasan Psikologi",
        title: "Self-as-Context: Langit Tetap Sama Meski Cuaca Berubah",
        paragraphs: [
          "Konsep inti dalam ACT adalah membedakan 'diri sebagai isi' (kumpulan label, kesalahan, dan pikiran sesaat) dengan 'diri sebagai konteks' (ruang luas yang menyaksikan seluruh pengalaman hidupmu, baik saat berhasil maupun tersandung).",
          "Bayangkan langit biru di atas kota. Kadang melintas awan mendung, badai petir, atau senja cerah. Awan-awan itu datang dan pergi dengan intensitas berbeda, namun langit sendiri tidak pernah terbakar oleh petir ataupun hancur oleh badai.",
          "Perilaku scrolling berlebihan, rasa cemas, maupun hari yang produktif adalah cuaca yang melintas. Kamu adalah ruang yang mengalaminya, bukan cuacanya. Ketika identitas terpisah dari kebiasaan, memperbaiki perilaku terasa seperti merapikan kamar, bukan merombak seluruh harga dirimu.",
        ],
        evidence: {
          study: "Packer et al. (2026), Journal of Contextual Behavioral Science",
          finding:
            "Proses self-as-context dan klarifikasi nilai dalam kerangka ACT membantu individu melepaskan stigma internal sehingga lebih adaptif mengubah perilaku.",
        },
        actionPrompt:
          "Ingat bahwa satu hari yang kurang teratur tidak menghapus siapa dirimu, nilai yang kamu pedulikan, maupun progres hari-hari lain.",
      },
      {
        id: "teknik-pisahkan-label",
        eyebrow: "Bagian 03 · Mengenal Teknik",
        title: "Teknik Mengganti Kalimat Identitas Menjadi Kalimat Perilaku",
        paragraphs: [
          "Setiap kali tertangkap menilai dirimu secara global dan permanen, praktikkan pengubahan bingkai berikut:",
        ],
        bullets: [
          {
            lead: "Ganti kata sifat permanen dengan kata kerja sementara:",
            detail:
              "'Aku pecandu pemalas' diubah menjadi 'Saat ini aku sedang berlatih mengubah pola penggunaan aplikasi di malam hari'.",
          },
          {
            lead: "Lihat peran utuhmu di luar layar:",
            detail:
              "Tuliskan tiga peran atau sifat positifmu sebagai teman, anggota keluarga, pembelajar, atau pekerja yang tetap ada terlepas dari angka screen time.",
          },
          {
            lead: "Gunakan suara pendamping yang setara:",
            detail:
              "Tanyakan: jika adik atau sahabatku mengalami hal ini, bagaimana aku menjaga martabatnya sambil tetap mengajaknya melangkah?",
          },
        ],
        actionPrompt:
          "Ubah satu label keras tentang dirimu menjadi kalimat proses yang lebih adil hari ini.",
      },
      {
        id: "penerapan-sederhana-12",
        eyebrow: "Bagian 04 · Penerapan Sederhana",
        title: "Mengingat Tiga Identitas Nyatamu di Luar Layar",
        paragraphs: [
          "Ambil kertas kecil atau catatan ponsel, lalu tulis tiga kalimat ini: 'Di luar kebiasaanku menggunakan gawai, aku adalah seseorang yang peduli pada... (isi sesuai hidupmu, misalnya kesehatan fisik, kejujuran dalam belajar, atau hadir untuk orang tua).'",
          "Saat rasa malu menghampiri, baca ulang catatan itu agar sudut pandangmu kembali melebar.",
        ],
        callout: {
          label: "Pesan Utama",
          text: "Kamu tidak mengubah kebiasaan untuk membuktikan dirimu berharga. Kamu mengubahnya justru karena hidup dan kesehatanmu berharga sejak awal.",
          tone: "emerald",
        },
        actionPrompt:
          "Tulis tiga hal tentang siapa dirimu yang tidak ditentukan oleh gawai.",
      },
      {
        id: "refleksi-batasan-12",
        eyebrow: "Bagian 05 · Refleksi & Rujukan",
        title: "Refleksi dan Batasan Bukti",
        paragraphs: [
          "Bagian mana dari dirimu yang selama ini tertutup oleh kebiasaan digital dan ingin kamu beri ruang hidup kembali di bulan ini?",
          "Batasan bukti: Kajian intervensi ACT pada isu teknologi digital (Packer et al., 2026) menekankan manfaat perspektif diri yang fleksibel namun tetap memerlukan penguatan tindakan konkret (Fase 4).",
        ],
        actionPrompt:
          "Kamu siap memasuki Fase 4 untuk menyusun perubahan nyata jangka panjang!",
      },
    ],
  },
  {
    id: "13",
    number: 13,
    phase: 4,
    phaseTitle: "Membangun Perubahan Berkelanjutan",
    approachTag: "CBT + ACT",
    isCoreStart: true,
    title: "Menentukan Hal yang Benar-Benar Penting",
    subtitle: "Mengenali nilai hidup dan membuat committed action yang realistis, bukan sekadar mengejar streak",
    readMinutes: 7,
    summary:
      "Mengurangi layar bukanlah tujuan akhir. Temukan nilai hidup (values) yang membuat perubahan terasa bermakna, lalu terjemahkan menjadi tindakan nyata sehari-hari.",
    learningObjective:
      "Membedakan tujuan angka (seperti mengejar streak) dari nilai hidup (values), dan menetapkan committed action kecil yang selaras.",
    evidenceStrength: "Tinjauan langsung masalah digital (kepastian bervariasi)",
    evidenceLimitation:
      "Tujuan yang terputus dari nilai pribadi cenderung cepat kehilangan motivasi saat menghadapi minggu yang padat atau lelah.",
    references: [
      {
        citation: "Sachdeva et al. (2026), Social Science & Medicine",
        url: "https://doi.org/10.1016/j.socscimed.2026.119683",
        note: "Menunjukkan keefektifan penetapan tujuan yang dipilih sendiri oleh pengguna untuk mengatur penggunaan smartphone.",
      },
      {
        citation: "Packer et al. (2026), Journal of Contextual Behavioral Science",
        url: "https://doi.org/10.1016/j.jcbs.2026.101003",
        note: "Menekankan values dan committed action sebagai penggerak utama perubahan dalam kerangka ACT.",
      },
    ],
    practiceLink: {
      href: "/routines",
      label: "Pasang Tindakan Bermakna di Rutinitas",
      description: "Ubah satu nilai hidupmu hari ini menjadi kebiasaan rutin kecil yang dipilih sendiri.",
    },
    nextModuleId: "14",
    sections: [
      {
        id: "kompas-vs-angka-streak",
        eyebrow: "Bagian 01 · Pembuka",
        title: "Mengapa Mengejar Angka Tanpa Arah Akhirnya Terasa Hampa",
        paragraphs: [
          "Bayangkan seseorang berlari sangat cepat menuju utara, tapi sebenarnya keluarga dan impiannya berada di timur. Secepat apa pun ia berlari atau seberapa panjang rekor beruntunnya, rasa hampa tetap menunggu.",
          "Dalam pemulihan kebiasaan digital, hal itu terjadi jika satu-satunya alasanmu bertahan adalah 'supaya angka di layar tetap hijau'. Ketika angka itu suatu hari tersandung, motivasi ikut runtuh karena tidak ada kompas yang lebih dalam di belakangnya.",
          "Berhenti menatap layar hanyalah membuka ruang waktu. Pertanyaan terpentingnya adalah: ruang waktu yang baru terbuka ini mau diisi untuk hal apa yang benar-benar kamu pedulikan dalam hidup?",
        ],
        actionPrompt:
          "Jika mulai malam ini kamu tiba-tiba punya tambahan 45 menit waktu tenang setiap hari, hal penting apa yang paling kamu inginkan terwujud darinya?",
      },
      {
        id: "nilai-vs-tujuan",
        eyebrow: "Bagian 02 · Penjelasan Psikologi",
        title: "Bedanya Tujuan (Goal) dan Nilai Hidup (Values)",
        paragraphs: [
          "Dalam ACT, nilai hidup (values) diibaratkan seperti arah mata angin, misalnya 'menjadi teman yang hadir saat mengobrol', 'menjaga kejernihan pikiran untuk belajar', atau 'merawat kesehatan tubuh'. Nilai tidak pernah selesai dicentang seperti daftar belanja; ia adalah kualitas perilaku yang terus kita pilih.",
          "Sementara itu, tujuan (goal) adalah titik perhentian di sepanjang arah itu, misalnya 'membaca 10 halaman buku malam ini' atau 'menaruh ponsel di ruang makan saat makan malam keluarga'.",
          "Penelitian tentang penetapan tujuan smartphone tahun 2026 (Sachdeva et al.) mendukung temuan ini: pengguna bertahan lebih baik ketika tujuan penggunaan dipilih berdasarkan prioritas pribadinya sendiri, bukan target seragam dari luar.",
        ],
        evidence: {
          study: "Sachdeva et al. (2026), Social Science & Medicine; Packer et al. (2026)",
          finding:
            "Self-selected goals yang bermakna secara personal memperkuat konsistensi regulasi penggunaan gawai dibandingkan target eksternal yang kaku.",
        },
        actionPrompt:
          "Pilih dua arah nilai yang paling ingin kamu jaga tahun ini: misalnya relasi, pembelajaran, kesehatan, atau karya.",
      },
      {
        id: "teknik-jembatan-nilai-ke-aksi",
        eyebrow: "Bagian 03 · Mengenal Teknik",
        title: "Teknik Menyusun Committed Action yang Terukur dan Manusiawi",
        paragraphs: [
          "Committed action adalah langkah kecil nyata yang menggerakkanmu ke arah nilai hidup, bahkan ketika rasa malas atau dorongan masih sesekali muncul:",
        ],
        bullets: [
          {
            lead: "1. Pilih satu nilai utama minggu ini:",
            detail: "Contoh: 'Kehadiran penuh bersama keluarga atau sahabat.'",
          },
          {
            lead: "2. Turunkan ke aksi 10 menit:",
            detail:
              "Contoh: 'Saat makan malam, ponsel kuletakkan terbalik atau di tas selama 20 menit untuk benar-benar mendengar cerita mereka.'",
          },
          {
            lead: "3. Jaga skalanya cukup kecil agar bisa menang:",
            detail:
              "Lebih baik aksi 10 menit yang konsisten 5 hari seminggu daripada janji besar 3 jam yang macet di hari kedua.",
          },
        ],
        actionPrompt:
          "Turunkan satu nilai hidupmu hari ini menjadi aksi 10 menit yang tidak mengandalkan suasana hati.",
      },
      {
        id: "penerapan-sederhana-13",
        eyebrow: "Bagian 04 · Penerapan Sederhana",
        title: "Menghubungkan Nilai Diri dengan Fitur Rutinitas Lumif",
        paragraphs: [
          "Buka menu Rutinitas di Lumif dan tambahkan satu kebiasaan harian yang mencerminkan nilai pribadimu, bukan sekadar perintah 'jangan main HP'.",
          "Misalnya: 'Baca buku fisik 5 halaman sebelum tidur' (nilai pembelajaran), 'Peregangan 5 menit sore hari' (nilai kesehatan), atau 'Tulis 1 syukur harian' (nilai ketenangan). Saat alasan di baliknya terasa pribadi, menjalankan rutinitas tidak lagi terasa seperti hukuman.",
        ],
        callout: {
          label: "Prinsip Sehat",
          text: "Streak di aplikasi adalah alat bantu refleksi mingguan, bukan penentu nilai dirimu sebagai manusia.",
          tone: "orange",
        },
        actionPrompt:
          "Tambahkan satu rutinitas berbasis nilai di halaman Rutinitas sekarang.",
      },
      {
        id: "refleksi-batasan-13",
        eyebrow: "Bagian 05 · Refleksi & Rujukan",
        title: "Refleksi dan Batasan Bukti",
        paragraphs: [
          "Apakah alasan utamamu mengubah kebiasaan digital saat ini lahir dari ketakutan akan angka gagal, atau dari keinginan merawat hal-hal yang kamu cintai di dunia nyata?",
          "Batasan bukti: Penetapan tujuan mandiri (Sachdeva et al., 2026) perlu dipasangkan dengan rencana eksekusi konkret dan fleksibilitas saat rencana meleset (Bab 14 dan 15).",
        ],
        actionPrompt:
          "Lanjutkan ke Bab 14 untuk mempelajari perencanaan if-then yang mengikat kebiasaan baru.",
      },
    ],
  },
  {
    id: "14",
    number: 14,
    phase: 4,
    phaseTitle: "Membangun Perubahan Berkelanjutan",
    approachTag: "CBT + ACT",
    title: "Bangun Kebiasaan Baru Secara Bertahap",
    subtitle: "Perencanaan if-then, tujuan pilihan sendiri, dan pembentukan kebiasaan melalui pengulangan",
    readMinutes: 7,
    summary:
      "Niat umum seperti 'besok aku mau lebih produktif' jarang bertahan. Pelajari rumus rencana aksi if-then dan membangun konsistensi bertahap tanpa beban kesempurnaan.",
    learningObjective:
      "Menyusun implementation intentions (if-then planning) dan mengembangkan pengulangan kebiasaan baru secara bertahap.",
    evidenceStrength: "Tinjauan langsung masalah digital (kepastian bervariasi)",
    evidenceLimitation:
      "Pengulangan kebiasaan membutuhkan fleksibilitas konteks; melewatkan satu hari tidak merusak keseluruhan proses pembelajaran perilaku.",
    references: [
      {
        citation: "Sachdeva et al. (2026), Social Science & Medicine",
        url: "https://doi.org/10.1016/j.socscimed.2026.119683",
        note: "Mendukung efektivitas perencanaan terstruktur dan tujuan pilihan sendiri dalam penggunaan smartphone.",
      },
      {
        citation: "Zhang et al. (2026), Journal of Medical Internet Research",
        url: "https://doi.org/10.2196/81705",
        note: "Menekankan bahwa perubahan berkelanjutan membutuhkan keterampilan perilaku praktis yang diulang konsisten.",
      },
    ],
    practiceLink: {
      href: "/routines",
      label: "Rancang Rencana If-Then di Rutinitas",
      description: "Tambatkan kebiasaan barumu ke pemicu waktu atau aktivitas yang sudah pasti terjadi setiap hari.",
    },
    nextModuleId: "15",
    sections: [
      {
        id: "niat-kabur-vs-rencana-spesifik",
        eyebrow: "Bagian 01 · Pembuka",
        title: "Mengapa 'Mulai Senin Aku Mau Berubah' Sering Menguap di Senin Sore?",
        paragraphs: [
          "Kalimat seperti 'Aku mau mengurangi media sosial mulai minggu depan' terdengar penuh tekad, tetapi punya satu kelemahan fatal: ia tidak memberi tahu otak kapan, di mana, dan gerakan tangan apa yang harus dilakukan di menit krusial.",
          "Begitu jam krusial tiba saat tubuh capek, otak yang kebingungan mencari panduan praktis akan langsung kembali memakai skrip lama yang sudah hafal luar kepala.",
          "Untuk membangun kebiasaan baru tanpa perlu berdebat terus-menerus dengan diri sendiri, kita perlu memberi otak skrip pengganti yang sejelas 'Jika situasi X terjadi, maka aku langsung mengerjakan langkah Y'.",
        ],
        actionPrompt:
          "Lihat satu rencana baikmu minggu ini yang sering gagal bukan karena malas, melainkan karena belum jelas kapan dikerjakan.",
      },
      {
        id: "kekuatan-implementation-intentions",
        eyebrow: "Bagian 02 · Penjelasan Psikologi",
        title: "Sains di Balik Rencana If-Then (Implementation Intentions)",
        paragraphs: [
          "Dalam psikologi perilaku, perencanaan berbentuk 'Jika [pemicu/waktu/tempat terjadi], maka aku akan [tindakan spesifik]' memindahkan tugas mengambil keputusan dari bahu kelelahan di malam hari ke perencanaan tenang sebelumnya.",
          "Studi tahun 2026 (Sachdeva et al.) mengenai regulasi penggunaan smartphone menunjukkan bahwa pengguna yang menggabungkan target pilihan sendiri dengan skenario rencana konkret memiliki tingkat tindak lanjut lebih tinggi daripada yang sekadar menetapkan larangan umum.",
          "Ingat pula pelajaran dari Bab 02: pengulangan bertahap melatih jalur saraf kebiasaan sedikit demi sedikit tanpa patokan hari ajaib tertentu.",
        ],
        evidence: {
          study: "Sachdeva et al. (2026), Social Science & Medicine",
          finding:
            "Rencana situasional spesifik yang ditentukan oleh pengguna sendiri membantu mengubah niat abstrak menjadi eksekusi perilaku harian.",
        },
        actionPrompt:
          "Pilih satu jangkar kegiatan harian yang sudah rutin (seperti menyikat gigi atau menyeduh air pagi) untuk mengaitkan kebiasaan baru.",
      },
      {
        id: "teknik-if-then-3-langkah",
        eyebrow: "Bagian 03 · Mengenal Teknik",
        title: "Rumus Menulis Skrip If-Then untuk Dua Situasi Berbeda",
        paragraphs: [
          "Buatlah dua versi skrip singkat: satu untuk menumbuhkan kebiasaan sehat, dan satu lagi sebagai rencana darurat saat godaan muncul:",
        ],
        bullets: [
          {
            lead: "Skrip Pertumbuhan (Habit Stacking):",
            detail:
              "'JIKA aku baru saja selesai shalat isya / menyikat gigi malam, MAKA aku menaruh ponsel di meja kerja dan membuka buku 5 menit.'",
          },
          {
            lead: "Skrip Pengaman (Coping Plan):",
            detail:
              "'JIKA di tengah tugas tanganku refleks ingin membuka video pendek karena bosan, MAKA aku berdiri minum segelas air dulu selama 1 menit.'",
          },
          {
            lead: "Aturan Skala Mini:",
            detail:
              "Mulailah dari versi terkecil agar tingkat keberhasilan di minggu pertama tinggi dan membangun rasa mampu yang realistis.",
          },
        ],
        actionPrompt:
          "Susun satu kalimat Skrip Pengaman versimu sekarang menggunakan pola JIKA... MAKA...",
      },
      {
        id: "penerapan-sederhana-14",
        eyebrow: "Bagian 04 · Penerapan Sederhana",
        title: "Menguji Dua Hari Lalu Evaluasi Tanpa Drama",
        paragraphs: [
          "Terapkan satu skrip If-Then saja selama tiga hari ke depan. Jika ternyata sulit dijalankan (misalnya waktunya selalu bertabrakan dengan makan malam), anggap skrip itu sebagai versi draf yang boleh diedit, bukan bukti kegagalan.",
          "Penyesuaian iteratif seperti inilah cara membangun kebiasaan yang tahan terhadap perubahan jadwal kerja atau ujian kuliah.",
        ],
        callout: {
          label: "Aturan Konsistensi Manusiawi",
          text: "Jangan pernah melewatkan dua hari berturut-turut secara disengaja jika bisa dicegah, namun jika sehari terlewat, kembalilah ke porsi kecil esoknya.",
          tone: "emerald",
        },
        actionPrompt:
          "Uji satu skrip JIKA-MAKA hari ini dan evaluasi apakah pemicunya sudah tepat waktu.",
      },
      {
        id: "refleksi-batasan-14",
        eyebrow: "Bagian 05 · Refleksi & Rujukan",
        title: "Refleksi dan Batasan Bukti",
        paragraphs: [
          "Pemicu harian apa di hidupmu yang paling konsisten waktunya sehingga cocok dijadikan cantolan kebiasaan baru?",
          "Batasan bukti: Keberhasilan rencana if-then tetap dipengaruhi kelelahan ekstrem dan stres berat; karena itu Bab 15 membahas langkah konkret saat kemunduran terjadi.",
        ],
        actionPrompt:
          "Lanjutkan ke Bab 15 untuk mempelajari cara menghadapi lapse dan relapse tanpa rasa gagal.",
      },
    ],
  },
  {
    id: "15",
    number: 15,
    phase: 4,
    phaseTitle: "Membangun Perubahan Berkelanjutan",
    approachTag: "CBT + ACT",
    isCoreStart: true,
    title: "Ketika Kembali ke Kebiasaan Lama",
    subtitle: "Membedakan lapse dan relapse, memahami pemicu kemunduran, dan menyusun rencana pencegahan",
    readMinutes: 8,
    summary:
      "Setiap proses perubahan hampir selalu mengenal hari tersandung. Pelajari beda lapse vs relapse agar satu selip tidak meledak menjadi kekalahan berkepanjangan.",
    learningObjective:
      "Membedakan lapse (selip sementara) dari relapse penuh, mencegah efek 'sudah terlanjur', dan menyusun rencana pencegahan kemunduran tanpa menghukum diri.",
    evidenceStrength: "Komponen CBT teruji pada konteks terkait",
    evidenceLimitation:
      "Pencegahan kekambuhan (relapse prevention) bekerja optimal sebagai panduan refleksi suportif, bukan pengganti konseling intensif pada kasus berat.",
    references: [
      {
        citation: "Radunz et al. (2026), Clinical Psychology Review",
        url: "https://doi.org/10.1016/j.cpr.2026.102740",
        note: "Mengidentifikasi relapse prevention sebagai komponen penting dalam modul CBT akhir program.",
      },
      {
        citation: "Balhara et al. (2026), Journal of Medical Internet Research",
        url: "https://doi.org/10.2196/89280",
        note: "Menekankan perlunya strategi mempertahankan capaian dan menghadapi pemicu kambuh pada masalah digital.",
      },
    ],
    practiceLink: {
      href: "/urge-log",
      label: "Refleksikan Selip di Catat Hasrat",
      description: "Catat pemicu kemunduran dengan objektif tanpa hukuman, kehilangan poin, atau stigma.",
    },
    nextModuleId: "16",
    sections: [
      {
        id: "efek-piring-pecah",
        eyebrow: "Bagian 01 · Pembuka",
        title: "Efek Piring Pecah: Satu Tergelincir yang Diperparah Oleh Rasa Gagal",
        paragraphs: [
          "Bayangkan tanpa sengaja kamu menjatuhkan satu piring di dapur hingga pecah. Apakah tindakan masuk akalnya adalah mengambil seluruh sisa piring bagus di rak lalu membanting semuanya ke lantai karena 'sudah telanjur pecah satu'?",
          "Tentu tidak masuk akal. Namun persis itulah yang sering terjadi ketika seseorang sudah menjaga fokus enam hari, lalu pada malam ketujuh kelepasan bermain gim atau scrolling dua jam. Keesokan paginya muncul rasa bersalah dan pikiran ekstrem: 'Progresku hancur, aku kembali ke titik nol. Buat apa mencoba lagi minggu ini?'",
          "Kerusakan terbesarnya jarang berasal dari dua jam malam tadi; kerusakan terbesarnya justru lahir dari rasa putus asa yang membuat kita menyerah penuh selama tiga minggu sesudahnya.",
        ],
        actionPrompt:
          "Ingat satu kali kamu berhenti menjaga ritme sehat di masa lalu: apakah saat itu rasa kecewa berlebih ikut membuatmu menyerah lebih lama?",
      },
      {
        id: "beda-lapse-dan-relapse",
        eyebrow: "Bagian 02 · Penjelasan Psikologi",
        title: "Lapse vs Relapse dan Abstinence Violation Effect",
        paragraphs: [
          "Dalam literatur pencegahan kekambuhan (relapse prevention) CBT yang juga tercantum dalam tinjauan Radunz et al. (2026), ada perbedaan tegas antara dua istilah penting:",
          "Lapse adalah satu kejadian selip sementara, misalnya kelepasan memakai aplikasi berlebihan satu malam di tengah minggu yang berat. Lapse adalah bagian alami dari kurva belajar. Sementara relapse adalah kembalinya pola kebiasaan bermasalah secara terus-menerus selama berminggu-minggu seperti sebelum ada kesadaran.",
          "Psikolog menyebut bahaya di antara keduanya sebagai abstinence violation effect: badai rasa bersalah, menyalahkan karakter diri, dan pikiran hitam-putih setelah terjadi satu lapse. Memutus rasa malu inilah kunci agar lapse tetap berhenti sebagai satu insiden kecil, bukan tiket pulang ke pola lama.",
        ],
        callout: {
          label: "Fakta Progres",
          text: "Satu malam tergelincir tidak menghapus 20 hari belajar dan perubahan jalur kebiasaan yang sudah pernah kamu latih.",
          tone: "emerald",
        },
        evidence: {
          study: "Radunz et al. (2026), Clinical Psychology Review; Balhara et al. (2026)",
          finding:
            "Komponen relapse prevention dalam CBT membantu peserta mengantisipasi situasi berisiko tinggi dan membedakan selip singkat dari kembalinya pola penuh.",
        },
        actionPrompt:
          "Latih dirimu menyebut selip sebagai 'lapse sementara yang memberi informasi', bukan 'kegagalan total'.",
      },
      {
        id: "teknik-pemulihan-cepat-3-langkah",
        eyebrow: "Bagian 03 · Mengenal Teknik",
        title: "Protokol Pemulihan Cepat 3 Langkah Setelah Lapse",
        paragraphs: [
          "Saat menyadari baru saja terjatuh ke kebiasaan lama, ikuti tiga langkah singkat berikut sebelum rasa bersalah membesar:",
        ],
        bullets: [
          {
            lead: "1. Hentikan penyebaran (Damage Control):",
            detail:
              "Tutup aplikasi, minum segelas air, cuci muka, dan geser perhatian ke tidur atau tugas terdekat tanpa menguliti diri sendiri.",
          },
          {
            lead: "2. Lakukan otopsi pemicu yang netral:",
            detail:
              "Tanyakan seperti detektif ramah: 'Apa yang terjadi 1 jam sebelumnya? Kurang tidur, konflik, stres tugas, atau ponsel terbawa ke kasur?'",
          },
          {
            lead: "3. Perkuat satu pagar pelindung:",
            detail:
              "Tambahkan satu langkah pengaman konkret untuk situasi serupa di masa depan, lalu lanjutkan ritme harianmu seperti biasa.",
          },
        ],
        actionPrompt:
          "Simpan tiga langkah ini sebagai panduan darurat anti-panik apabila suatu hari ritmemu kembali goyah.",
      },
      {
        id: "penerapan-sederhana-15",
        eyebrow: "Bagian 04 · Penerapan Sederhana",
        title: "Menyusun Peta Situasi Berisiko Tinggi Pribadimu",
        paragraphs: [
          "Tuliskan dua kondisi kehidupan yang secara realistis berpotensi memicu lapse di bulan depan: misalnya 'pekan ujian/tenggat proyek saat tidur berantakan' atau 'akhir pekan sendirian di kos/kamar tanpa agenda'.",
          "Lalu siapkan satu rencana cadangan untuk masing-masing situasi sebelum pekan sibuk itu datang. Di Lumif, refleksi kemunduran lewat Evaluasi Harian atau Catat Hasrat tidak pernah menghukum poinmu, karena jujur membaca pola jauh lebih berharga daripada menjaga angka sempurna palsu.",
        ],
        callout: {
          label: "Tanpa Hukuman",
          text: "Kejujuran mencatat kemunduran adalah bentuk keberanian yang membantu kamu belajar, bukan alasan merasa gagal.",
          tone: "orange",
        },
        actionPrompt:
          "Tentukan satu situasi berisiko tinggi bulan ini beserta langkah pengaman awalnya.",
      },
      {
        id: "refleksi-batasan-15",
        eyebrow: "Bagian 05 · Refleksi & Rujukan",
        title: "Refleksi dan Batasan Bukti",
        paragraphs: [
          "Ketika menghadapi minggu yang kurang ideal nanti, kalimat suportif apa yang ingin kamu ingat untuk dirimu sendiri?",
          "Batasan bukti: Strategi relapse prevention membantu memperkecil dampak selip perilaku, namun jika dorongan terasa sangat kompulsif disertai distres berat berkepanjangan, dukungan profesional sangat dianjurkan (Bab 16).",
        ],
        actionPrompt:
          "Lanjutkan ke bab penutup (Bab 16) untuk melihat gambaran besar keseimbangan dan dukungan.",
      },
    ],
  },
  {
    id: "16",
    number: 16,
    phase: 4,
    phaseTitle: "Membangun Perubahan Berkelanjutan",
    approachTag: "CBT + ACT",
    title: "Menjaga Keseimbangan dan Mencari Bantuan",
    subtitle: "Mengevaluasi perubahan, merawat relasi dunia nyata, dan mengenali kapan butuh bantuan profesional",
    readMinutes: 7,
    summary:
      "Bab penutup: merayakan perubahan yang realistis, menjaga keterhubungan manusiawi di dunia nyata, dan mengetahui batas swabantu serta kapan mencari psikolog atau tenaga medis.",
    learningObjective:
      "Mengevaluasi perubahan kebiasaan secara utuh serta memahami batasan aplikasi swabantu dan indikator pentingnya mencari pendampingan profesional.",
    evidenceStrength: "Tinjauan langsung masalah digital (kepastian bervariasi)",
    evidenceLimitation:
      "Aplikasi edukasi swabantu memiliki batas fungsi dan tidak dapat menggantikan evaluasi klinis tatap muka dari psikolog atau psikiater.",
    references: [
      {
        citation: "Zhang et al. (2026), Journal of Medical Internet Research",
        url: "https://doi.org/10.2196/81705",
        note: "Menekankan variasi efek intervensi dan pentingnya pendekatan yang sesuai dengan tingkat kebutuhan individu.",
      },
      {
        citation: "Packer et al. (2026), Journal of Contextual Behavioral Science",
        url: "https://doi.org/10.1016/j.jcbs.2026.101003",
        note: "Menggarisbawahi perlunya penguatan bukti klinis lebih lanjut dan kehati-hatian membedakan edukasi dari terapi klinis.",
      },
    ],
    practiceLink: {
      href: "/community",
      label: "Terhubung di Komunitas Lumif",
      description: "Bagikan refleksimu dan jaga keterhubungan suportif, lalu luangkan waktu juga untuk relasi luring.",
    },
    sections: [
      {
        id: "tujuan-akhir-yang-tenang",
        eyebrow: "Bagian 01 · Pembuka",
        title: "Hidup Sehat Tidak Berarti Bebas Gawai Sepenuhnya",
        paragraphs: [
          "Sampai di Bab 16 ini, gambar keberhasilan mungkin terlihat berbeda dari bayangan hari pertama. Keberhasilan bukan menjadi robot yang selalu menolak layar setiap detik dan hidup di hutan tanpa sinyal.",
          "Keberhasilan adalah hubungan yang seimbang: kamu tetap bekerja, belajar, menjaga silaturahmi, dan sesekali menikmati hiburan digital dengan sadar, sementara kualitas tidur, konsentrasi kerja, dan kehangatan percakapan langsung tetap terjaga.",
          "Perjalanan 16 bab ini memberi peta kerja. Dari sini, kamu hanya perlu melakukan penyesuaian ringan berkala sesuai musim hidupmu.",
        ],
        actionPrompt:
          "Bandingkan dirimu saat memulai Bab 01 dengan sekarang: satu hal positif kecil apa yang mulai lebih mudah kamu sadari?",
      },
      {
        id: "relasi-dan-batas-swabantu",
        eyebrow: "Bagian 02 · Penjelasan Psikologi",
        title: "Merawat Relasi Nyata dan Mengenali Batas Konten Swabantu",
        paragraphs: [
          "Salah satu faktor pelindung paling kuat terhadap penggunaan digital kompulsif adalah rasa terhubung di dunia nyata: memiliki orang yang bisa diajak tertawa, berkeluh kesah, atau sekadar makan bersama tanpa semuanya harus didokumentasikan ke layar.",
          "Di sisi lain, sikap paling bertanggung jawab dalam produk kesehatan digital adalah bersikap jujur tentang batasnya. Materi 16 bab Lumif adalah edukasi swabantu berbasis prinsip CBT, ACT, dan literatur perilaku sampai tahun 2026. Ia dirancang untuk membantu membangun kebiasaan sehat sehari-hari, bukan layanan terapi klinis dan belum diuji sebagai satu paket intervensi medis tunggal.",
        ],
        callout: {
          label: "Prinsip Kejujuran Ilmiah",
          text: "Aplikasi swabantu mendukung refleksi dan latihan mandiri, tetapi tidak pernah menggantikan asesmen serta pendampingan langsung oleh psikolog klinis atau dokter.",
          tone: "emerald",
        },
        evidence: {
          study: "Zhang et al. (2026), JMIR; Packer et al. (2026), JCBS",
          finding:
            "Intervensi digital memberi manfaat awal yang menjanjikan, namun individu dengan gejala berat atau kondisi penyerta membutuhkan evaluasi dan dukungan klinis profesional.",
        },
        actionPrompt:
          "Jadwalkan satu pertemuan atau telepon suara nyata minggu ini dengan teman atau keluarga terdekat.",
      },
      {
        id: "tanda-perlu-bantuan-profesional",
        eyebrow: "Bagian 03 · Mengenal Teknik",
        title: "Kapan Sebaiknya Menghubungi Psikolog atau Tenaga Profesional?",
        paragraphs: [
          "Mencari bantuan ahli bukan tanda kekalahan; itu tanda kedewasaan menjaga kesehatan jiwa. Pertimbangkan berkonsultasi dengan psikolog klinis, konselor kampus/kantor, atau dokter bila muncul tanda-tanda berikut:",
        ],
        bullets: [
          {
            lead: "Gangguan fungsi berlarut-larut:",
            detail:
              "Pekerjaan, studi, atau hubungan keluarga terus merosot selama berbulan-bulan meski berbagai penyesuaian mandiri sudah dicoba.",
          },
          {
            lead: "Tekanan emosional atau kecemasan berat:",
            detail:
              "Kebiasaan layar selalu menyertai perasaan hampa berkepanjangan, sulit tidur parah, panik, atau penurunan mood signifikan.",
          },
          {
            lead: "Kesulitan mengendalikan impuls meski ada konsekuensi serius:",
            detail:
              "Dorongan terasa tidak tertahankan dan mulai berdampak ke keuangan, keamanan diri, atau relasi penting.",
          },
          {
            lead: "Keinginan menyakiti diri atau keputusasaan:",
            detail:
              "Segera hubungi layanan darurat medis, psikolog, atau orang dewasa/keluarga tepercaya di dekatmu.",
          },
        ],
        actionPrompt:
          "Kenali minimal satu jalur layanan konseling (puskesmas, klinik psikologi, atau konselor institusi) di kotamu sebagai informasi berjaga-jaga.",
      },
      {
        id: "penerapan-sederhana-16",
        eyebrow: "Bagian 04 · Penerapan Sederhana",
        title: "Tinjauan Bulanan Lima Menit yang Ringan",
        paragraphs: [
          "Sebulan sekali di hari Minggu, luangkan lima menit membuka Insight dan catatanmu lalu jawab tiga hal: kebiasaan apa yang berjalan lancar, pemicu baru apa yang muncul akibat perubahan jadwal, dan satu penyesuaian kecil apa yang perlu diubah.",
          "Anggap Lumif seperti buku catatan dan kotak perkakas tenang yang kamu buka saat butuh, dan boleh kamu tutup dengan lega saat siap kembali menikmati hidup di dunia nyata.",
        ],
        callout: {
          label: "Apresiasi Perjalananmu",
          text: "Menyelesaikan 16 bab bukan garis finis akhir, melainkan bekal pemahaman diri untuk hari-hari ke depan.",
          tone: "orange",
        },
        actionPrompt:
          "Pilih satu kebiasaan dari 16 bab yang paling ingin kamu jaga bulan depan.",
      },
      {
        id: "refleksi-batasan-16",
        eyebrow: "Bagian 05 · Refleksi & Rujukan",
        title: "Refleksi Penutup dan Komitmen Keseimbangan",
        paragraphs: [
          "Terima kasih sudah membaca dengan sabar dari Bab 01 hingga Bab 16. Pertanyaan terakhir: siapa satu orang di dunia nyata yang ingin kamu ajak hadir lebih utuh minggu ini setelah kamu menaruh ponselmu sejenak?",
          "Catatan resmi: Materi Lumif ditujukan untuk edukasi diri dan pencegahan kebiasaan digital kurang sehat; peninjauan berkala bersama tenaga profesional psikologi tetap dianjurkan sebelum dipakai sebagai panduan klinis formal.",
        ],
        actionPrompt:
          "Tandai Bab 16 selesai dan bawa pembelajaranmu ke aktivitas nyata hari ini.",
      },
    ],
  },
];
