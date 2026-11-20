export type ModuleSection = {
  id: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  bullets?: {
    lead: string;
    detail: string;
  }[];
  callout?: {
    label: string;
    text: string;
    tone?: "emerald" | "orange";
  };
  evidence?: {
    study: string;
    finding: string;
  };
  actionPrompt: string;
};

export type ModuleItem = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  readMinutes: number;
  summary: string;
  sections: ModuleSection[];
  nextModuleId?: string;
};

export const MODULES_DATA: ModuleItem[] = [
  {
    id: "1",
    number: 1,
    title: "Pengenalan Pendekatan Terapi CBT & ACT",
    subtitle: "Mengapa tekad saja sering kalah, dan cara kerja pikiran saat dorongan datang",
    readMinutes: 7,
    summary:
      "Pelajari mengapa melawan pikiran secara frontal justru memperbesar gema godaan, serta bagaimana sains CBT dan ACT melatih otak keluar dari mode autopilot dengan ketenangan.",
    nextModuleId: "2",
    sections: [
      {
        id: "paradoks-beruang-putih",
        eyebrow: "Bagian 01",
        title: "Paradoks Beruang Putih: Mengapa Melarang Pikiran Justru Menguatkannya",
        paragraphs: [
          "Pada akhir 1980-an, psikolog Universitas Harvard bernama Daniel Wegner melakukan eksperimen sederhana yang hasilnya mengejutkan ruang-ruang kelas psikologi. Ia meminta sejumlah mahasiswa berdiri di depan mikrofon dan berbicara bebas selama lima menit, dengan satu syarat ketat: jangan pernah sekalipun membayangkan beruang putih. Setiap kali bayangan beruang putih melintas, mereka harus membunyikan bel di meja.",
          "Dalam hitungan menit, ruang laboratorium itu justru dipenuhi denting bel bertubi-tubi. Lebih aneh lagi, ketika pada sesi berikutnya mereka akhirnya diizinkan memikirkan beruang putih, kelompok yang sebelumnya mati-matian melarang dirinya justru memikirkan beruang putih jauh lebih sering daripada kelompok yang sejak awal tidak dilarang.",
          "Wegner menyebut jebakan ini sebagai Ironic Process Theory. Ketika kamu memerintahkan otak untuk tidak memikirkan sesuatu (entah itu layar ponsel larut malam, kebiasaan lama, atau kecemasan), ada satu mekanisme pengawas internal yang diam-diam terus memindai: 'Apakah pikiran itu sudah hilang? Bagaimana dengan sekarang?' Aktivitas memindai itu sendiri terus menyalakan ulang bayangan yang sedang kamu hindari.",
        ],
        callout: {
          label: "Pelajaran Utama Wegner",
          text: "Menekan pikiran membutuhkan tenaga besar dan hampir selalu memicu efek pantulan (rebound). Ketenangan tidak lahir dari perang batin, melainkan dari mengubah cara kamu menanggapi pikiran yang lewat.",
          tone: "emerald",
        },
        evidence: {
          study: "Wegner et al. (1987), Journal of Personality and Social Psychology",
          finding:
            "Instruksi aktif untuk menekan pikiran target justru memicu lonjakan kemunculan pikiran tersebut (rebound effect) ketika pengawasan mental melemah.",
        },
        actionPrompt:
          "Saat pikiran pemicu muncul hari ini, ganti perintah 'Jangan pikirkan ini!' dengan ucapan netral: 'Oh, pikiran itu sedang melintas lagi.'",
      },
      {
        id: "mitos-tekad-baja",
        eyebrow: "Bagian 02",
        title: "Mitos Tekad Baja: Pelajaran dari 7.827 Sinyal Keseharian",
        paragraphs: [
          "Kita sering mengagumi orang-orang yang tampak disiplin sebagai manusia dengan otot tekad baja. Namun penelitian Angela Duckworth bersama ekonom perilaku Katherine Milkman dan David Laibson (2018) membongkar asumsi itu. Orang-orang yang konsisten menjaga kendali diri jangka panjang ternyata bukan orang yang paling heroik bertarung melawan godaan setiap menit.",
          "Sebaliknya, temuan Wilhelm Hofmann, Roy Baumeister, dan kolega (2012) lewat pelacakan ponsel secara real-time terhadap 205 orang dewasa dengan total 7.827 laporan hasrat harian memperlihatkan gambaran nyata. Orang yang melaporkan diri punya 'kontrol diri tinggi' justru mengalami lebih sedikit pertarungan batin per hari, karena sejak awal mereka menata situasi agar godaan tidak terus-terusan hadir di depan mata.",
          "Menariknya lagi, data yang sama menunjukkan bahwa semakin sering seseorang menahan diri menggunakan tenaga mental murni sejak pagi, semakin rapuh daya tahannya saat malam tiba. Pemulihan sejati bukan tentang seberapa keras kamu mengepalkan tangan di jam 11 malam, melainkan seberapa cerdas kamu merancang sistem sebelum jam rawan itu datang.",
        ],
        callout: {
          label: "Prinsip Kendali Situasional",
          text: "Strategi menata situasi dan pemicu bekerja jauh lebih andal daripada sekadar mengandalkan perlawanan mental di detik-detik godaan sudah memuncak.",
          tone: "orange",
        },
        evidence: {
          study: "Hofmann et al. (2012), JPSP (205 peserta, 7.827 laporan); Duckworth, Milkman & Laibson (2018)",
          finding:
            "Keberhasilan kontrol diri sehari-hari lebih banyak ditentukan oleh pencegahan situasional sebelum godaan membesar, karena daya tahan mental cepat terkuras setelah dipakai berulang.",
        },
        actionPrompt:
          "Catat jam berapa dalam sehari energi mentalmu paling tipis agar kamu bisa memasang sistem pengaman lebih awal.",
      },
      {
        id: "peta-segitiga-cbt",
        eyebrow: "Bagian 03",
        title: "Peta CBT: Mengurai Rantai Pikiran, Emosi, dan Tindakan",
        paragraphs: [
          "Cognitive Behavioral Therapy (CBT) yang dirintis Aaron Beck berakar pada satu gagasan jernih: kita jarang bereaksi langsung terhadap peristiwa mentah; kita bereaksi terhadap tafsir yang seketika ditempelkan oleh pikiran kita. Tiga elemen ini (pikiran, emosi tubuh, dan tindakan) berputar seperti roda gigi yang saling mengunci.",
          "Bayangkan dua orang mengalami hari kerja yang sama-sama melelahkan pada pukul 9 malam. Orang pertama menangkap kalimat batin: 'Hari ini kacau sekali, aku berhak dapat pelarian cepat sekarang juga.' Kalimat itu memicu rasa sesak dan dorongan mendesak, yang lalu mendorong tangan meraih pelarian kebiasaan lama.",
          "CBT mengajakmu memperlambat film di kepala menjadi frame per frame. Begitu kamu mampu menunjuk pikiran otomatisnya di atas kertas atau di layar, jarak antara pemicu dan tindakan melebar. Kamu berhenti menjadi penumpang pasif dan kembali memegang kemudi.",
        ],
        bullets: [
          {
            lead: "1. Pikiran otomatis:",
            detail:
              "Kalimat singkat yang melintas cepat tanpa disaring, misalnya 'Sekali saja tidak apa-apa' atau 'Aku memang tidak bisa berubah'.",
          },
          {
            lead: "2. Gelombang emosi:",
            detail:
              "Gelisah, bosan, tertekan, atau kosong yang mencari tombol pereda secepat mungkin.",
          },
          {
            lead: "3. Ruang koreksi:",
            detail:
              "Menguji kalimat batin tadi dengan bukti nyata: apakah satu pelarian benar-benar membuatmu lega besok pagi?",
          },
        ],
        evidence: {
          study: "Model Kognitif Aaron T. Beck & Literatur Terapi Perilaku Kognitif",
          finding:
            "Identifikasi dan restrukturisasi pikiran otomatis secara terukur melemahkan eskalasi respons emosional serta menurunkan perilaku impulsif berulang.",
        },
        actionPrompt:
          "Buka menu Catat Hasrat hari ini dan tulis persis satu kalimat batin yang muncul sebelum dorongan terasa kuat.",
      },
      {
        id: "eksperimen-susu-act",
        eyebrow: "Bagian 04",
        title: "Eksperimen 'Susu-Susu-Susu': Seni Mengamati Pikiran ala ACT",
        paragraphs: [
          "Jika CBT membantu menguji apakah pikiranmu akurat, Acceptance & Commitment Therapy (ACT) menjawab pertanyaan yang lebih mendesak: bagaimana kalau pikiranmu tetap keras kepala meskipun kamu sudah tahu ia keliru? Di sinilah teknik bernama defusi kognitif bekerja.",
          "Pada 2004, peneliti Akihiko Masuda dan Steven Hayes menguji ulang sebuah latihan klasik berumur hampir seabad. Mereka meminta peserta mengucapkan satu kata pemicu negatif berulang-ulang dengan lantang dan cepat selama 30 detik, seperti mengulang kata 'susu' tanpa henti. Pada detik-detik awal, otak memunculkan makna harfiahnya. Namun setelah puluhan pengulangan, kata itu terdengar sekadar seperti bunyi vokal dan getaran tenggorokan yang aneh.",
          "Dalam studi Masuda, pengulangan tersebut secara signifikan menurunkan tingkat keyakinan peserta pada pikiran negatif mereka sekaligus mengurangi rasa tidak nyaman emosionalnya. Tujuannya bukan menghapus isi pikiran, melainkan melepaskan statusnya sebagai perintah mutlak. Kamu bisa melihat tulisan 'Aku harus menyerah sekarang' bukan sebagai hukum alam, melainkan sekadar barisan huruf yang kebetulan muncul di layar kesadaranmu.",
        ],
        bullets: [
          {
            lead: "Teknik memberi awalan jarak:",
            detail:
              "Ubah kalimat 'Aku tidak kuat lagi' menjadi 'Aku sedang memperhatikan ada pikiran bahwa aku tidak kuat lagi.'",
          },
          {
            lead: "Arah kompas nilai:",
            detail:
              "Sambil membiarkan pikiran bising itu lewat di latar belakang, gerakkan tubuh ke arah nilai hidup yang ingin kamu jaga hari ini.",
          },
        ],
        evidence: {
          study: "Masuda, Hayes, Sackett & Twohig (2004), Behaviour Research and Therapy",
          finding:
            "Latihan defusi kognitif menurunkan tingkat kepercayaan terhadap pikiran negatif diri dan meredakan ketidaknyamanan jauh lebih efektif dibanding sekadar mengalihkan pikiran.",
        },
        actionPrompt:
          "Coba beri jarak pada satu pikiran mengganggu hari ini dengan mengawalinya lewat frasa: 'Otakku sedang mengirim sinyal berupa...'",
      },
      {
        id: "ketetapan-hati-grit",
        eyebrow: "Bagian 05",
        title: "Ketetapan Hati ala Grit: Mengapa Bangkit Lebih Penting daripada Sempurna",
        paragraphs: [
          "Saat meneliti ribuan taruna di akademi militer West Point selama masa pelatihan musim panas paling berat berjuluk Beast Barracks, Angela Duckworth menemukan pola yang melawan intuisi. Nilai ujian masuk, prestasi olahraga, dan skor kepemimpinan hampir tidak mampu memprediksi siapa yang bertahan hingga akhir. Faktor pembeda terkuat justru adalah Grit: perpaduan gairah jangka panjang dan ketekunan untuk kembali berdiri setelah hari yang buruk.",
          "Kesalahpahaman terbesar dalam pemulihan kebiasaan adalah mentalitas 'semua atau tidak sama sekali'. Begitu terpeleset satu kali, suara keras di kepala langsung berbisik bahwa seluruh hari bersih sebelumnya sudah hangus, jadi sekalian saja menyerah sampai minggu depan.",
          "Kenyataannya, jatuh satu kali hanyalah satu titik data, bukan akhir kurva pembelajaran otakmu. Yang merusak lintasan jangka panjang bukanlah kesalahan tunggal, melainkan keputusan untuk berhenti kembali ke jalur setelah kesalahan itu terjadi.",
        ],
        callout: {
          label: "Aturan Emas Konsistensi",
          text: "Jangan pernah melewatkan dua kali berturut-turut tanpa kembali check-in. Kebangkitan cepat membangun ketangguhan jauh lebih kuat daripada rekor mulus yang rapuh saat goyah.",
          tone: "emerald",
        },
        evidence: {
          study: "Duckworth, Peterson, Matthews & Kelly (2007), West Point Grit Studies",
          finding:
            "Skor ketekunan jangka panjang (Grit) memprediksi keberhasilan bertahan melalui latihan berat West Point lebih akurat daripada gabungan nilai akademik dan kebugaran.",
        },
        actionPrompt:
          "Pilih satu rutinitas paling kecil di halaman Rutinitas yang masih sanggup kamu kerjakan bahkan di hari paling melelahkan.",
      },
    ],
  },
  {
    id: "2",
    number: 2,
    title: "Mengenal Pemicu Utama (HALT System)",
    subtitle: "Membaca empat sinyal biologis dan emosional sebelum dorongan membajak keputusan",
    readMinutes: 6,
    summary:
      "Banyak impuls mendadak sebenarnya adalah kebutuhan dasar tubuh yang belum terjawab. Pelajari data ilmiah di balik sistem HALT: Hungry, Angry, Lonely, Tired.",
    nextModuleId: "3",
    sections: [
      {
        id: "apa-itu-halt",
        eyebrow: "Bagian 01",
        title: "Hungry: Ketika Penurunan Energi Menyamar Menjadi Godaan",
        paragraphs: [
          "Pernahkah kamu merasa sangat yakin berkomitmen di pagi hari, lalu mendadak sangat mudah tergoda menjelang sore ketika perut kosong atau tubuh kurang minum? Dalam psikologi klinis pemulihan, kondisi kerentanan fisik pertama ini disebut Hungry (lapar fisik atau kekurangan energi dan hidrasi).",
          "Regulasi impuls dilakukan oleh korteks prefrontal di belakang dahi, bagian otak yang paling boros mengonsumsi energi metabolik. Ketika kadar energi dan cairan turun drastis, otak otomatis menghemat tenaga dengan mematikan pertimbangan jangka panjang dan menyalakan jalur kebiasaan cepat yang menuntut usaha paling rendah.",
          "Sebelum menyimpulkan bahwa karaktermu lemah, periksa terlebih dahulu kapan terakhir kali kamu minum air atau makan dengan layak. Sering kali kamu tidak sedang menginginkan kebiasaan lamamu; otakmu hanya berteriak meminta bahan bakar dengan bahasa yang salah alamat.",
        ],
        callout: {
          label: "Cek Fisiologis Pertama",
          text: "Lapar fisik dan haus ringan sering terasa mirip kegelisahan psikologis. Menjawab kebutuhan energi dasarnya memotong separuh kekuatan dorongan dalam beberapa menit.",
          tone: "emerald",
        },
        evidence: {
          study: "Riset Kendali Eksekutif Prefrontal & Kerangka Relapse Prevention Klinis",
          finding:
            "Penurunan ketersediaan energi metabolik dan kelelahan keputusan mendorong otak beralih dari kontrol reflektif menuju pilihan imbalan instan berbiaya kognitif rendah.",
        },
        actionPrompt:
          "Setiap kali gelisah datang sebelum jam makan, minum satu gelas penuh air putih dan tunda keputusan apapun selama 5 menit.",
      },
      {
        id: "angry-emosi-negatif",
        eyebrow: "Bagian 02",
        title: "Angry: Mengapa 35% Kekambuhan Dimulai dari Tekanan Emosi",
        paragraphs: [
          "Saat psikolog G. Alan Marlatt dan Judith Gordon (1985) memetakan ratusan episode kambuh dalam studi klinis perintisnya, mereka mencari pemicu mana yang paling sering menjatuhkan orang. Bukan pesta perayaan, bukan pula rasa percaya diri berlebih.",
          "Penyumbang terbesar tunggal adalah emosi negatif seperti marah, frustrasi, cemas, atau merasa tertekan, yang tercatat pada sekitar 35% hingga 37% kasus. Bila digabungkan dengan konflik antarpribadi dan tekanan sosial, tiga kondisi emosional ini menyumbang sekitar 75% dari keseluruhan situasi berisiko tinggi.",
          "Kebiasaan lama bertahan lama di hidup kita karena satu alasan jujur: ia bertindak sebagai peredam rasa sakit tercepat dalam hitungan detik. Memahami fungsi peredam itu membantumu berhenti membenci diri sendiri, lalu mulai mengganti peredam berisiko dengan pelepasan emosi yang lebih aman.",
        ],
        bullets: [
          {
            lead: "Kenali wajah tersembunyi 'Angry':",
            detail:
              "Bukan selalu amarah meledak. Sering bentuknya adalah kesal tertahan, bosan berkepanjangan, kecewa setelah dikritik, atau kewalahan tugas.",
          },
          {
            lead: "Tanya fungsi dorongannya:",
            detail:
              "'Emosi tidak nyaman apa yang sedang berusaha diredam oleh dorongan ini?'",
          },
        ],
        evidence: {
          study: "Marlatt & Gordon (1985), Relapse Prevention Taxonomy",
          finding:
            "Emosi negatif menjadi pemicu intrapersonal paling dominan (sekitar 35% sampai 37% episode kambuh), dan bersama konflik interpersonal mencakup sekitar 75% kasus.",
        },
        actionPrompt:
          "Saat merasa kesal atau tertekan hari ini, beri label spesifik emosinya di Catat Hasrat atau lakukan 1 menit Latihan Napas.",
      },
      {
        id: "lonely-isolasi-sosial",
        eyebrow: "Bagian 03",
        title: "Lonely: Mengapa Otak Sosial Mencari Pengisi Ruang Kosong",
        paragraphs: [
          "Manusia berevolusi bertahan hidup secara berkelompok; di dalam arsitektur saraf kita, terputus dari koneksi bermakna terasa sebagai tanda bahaya nyata. Meta-analisis besar Julianne Holt-Lunstad dan tim (2015) yang menelaah 70 studi prospektif dengan lebih dari 3,4 juta partisipan menunjukkan bahwa kesepian subjektif berkaitan dengan kenaikan risiko kematian dini sebesar 26%, sementara isolasi sosial objektif meningkatkannya sebesar 29%.",
          "Dalam tolok ukur kesehatan masyarakat, dampak isolasi sosial jangka panjang itu sebanding dengan risiko merokok hingga 15 batang per hari. Tidak mengherankan bila pada sore yang sepi atau akhir pekan tanpa interaksi tatap muka, otak mencari stimulasi cepat di layar untuk menutupi kekosongan sosial tersebut.",
          "Stimulasi digital hanya meniru rasa terhubung untuk sementara, lalu meninggalkan rasa hampa yang lebih dalam. Koneksi singkat dengan satu orang nyata atau ruang komunitas yang aman memberi sinyal aman yang sesungguhnya kepada sistem saraf.",
        ],
        callout: {
          label: "Fakta Koneksi Manusia",
          text: "Godaan jauh lebih agresif di ruang sunyi tanpa rasa terhubung. Bahkan satu pesan singkat dengan teman tepercaya sudah cukup mengubah kimia rasa aman di otak.",
          tone: "orange",
        },
        evidence: {
          study: "Holt-Lunstad et al. (2015), Perspectives on Psychological Science (70 studi, >3,4 juta orang)",
          finding:
            "Kesepian meningkatkan risiko kematian dini sebesar 26% dan isolasi sosial sebesar 29%, sebanding dengan faktor risiko merokok hingga 15 batang per hari.",
        },
        actionPrompt:
          "Jika hari ini terasa sepi, kirim satu pesan ringan ke teman baik atau baca cerita pemulihan di menu Komunitas Lumif.",
      },
      {
        id: "tired-rem-otak",
        eyebrow: "Bagian 04",
        title: "Tired: Mengapa Rem Otak Terputus Saat Kurang Tidur",
        paragraphs: [
          "Pada 2007, tim peneliti di UC Berkeley yang dipimpin Seung-Schik Yoo dan ahli tidur Matthew Walker memindai otak peserta menggunakan fMRI setelah satu periode tanpa tidur penuh. Hasil pemindaiannya membuka tabir mengapa malam hari menjadi jam paling rawan bagi hampir setiap orang dalam pemulihan.",
          "Pada peserta yang kurang tidur, reaktivitas amigdala (pusat alarm emosi dan impuls primitif otak) melonjak lebih dari 60% dibanding kelompok yang tidur cukup. Parahnya lagi, jalur penghubung antara korteks prefrontal medial (rem rasional otak) dan amigdala mengalami pemutusan fungsional.",
          "Artinya sangat jelas: mempertahankan aturan ketat di atas jam 10 malam sambil memandangi layar dengan mata lelah bukan pertarungan adil. Saat sistem rem terputus oleh rasa lelah, keputusan terbaik bukan lagi beradu argumen di kepala, melainkan mematikan layar dan tidur.",
        ],
        evidence: {
          study: "Yoo, Gujar, Hu, Jolesz & Walker (2007), Current Biology (UC Berkeley)",
          finding:
            "Kurang tidur menyebabkan lonjakan reaktivitas amigdala lebih dari 60% sekaligus memutus konektivitas kendali dari korteks prefrontal medial.",
        },
        actionPrompt:
          "Tetapkan batas jam tidur atau taruh pengisi daya ponsel di luar jangkauan tempat tidur malam ini.",
      },
      {
        id: "audit-15-detik",
        eyebrow: "Bagian 05",
        title: "Protokol Audit 15 Detik: Jawaban Spesifik untuk Tiap Sinyal",
        paragraphs: [
          "Ketika dorongan datang mendadak, jangan langsung bertanya 'Kenapa aku lemah sekali?' Pertanyaan itu hanya menguras tenaga. Ganti dengan audit biologis dan emosional 15 detik menggunakan huruf H-A-L-T, lalu berikan jawaban yang tepat sasaran.",
        ],
        bullets: [
          {
            lead: "Jika H (Hungry):",
            detail: "Minum segelas air dan isi energi tubuh dengan camilan bernutrisi ringan sebelum memegang ponsel.",
          },
          {
            lead: "Jika A (Angry/Stres):",
            detail: "Turunkan ketegangan lewat Latihan Pernapasan atau mini game Singkirkan Kabut selama 60 detik.",
          },
          {
            lead: "Jika L (Lonely):",
            detail: "Pindah ke ruang tamu, hubungi teman, atau sapa sesama pejuang di Komunitas.",
          },
          {
            lead: "Jika T (Tired):",
            detail: "Berhenti membuat keputusan besar malam ini; tutup aplikasi pemicu dan beri hak istirahat pada otakmu.",
          },
        ],
        callout: {
          label: "Aturan Jam 10 Malam",
          text: "Urus lelahnya, bukan dorongannya. Keputusan paling bijak yang dibuat dalam kondisi lelah adalah menunda keputusan sampai besok pagi.",
          tone: "emerald",
        },
        actionPrompt:
          "Simpan satu respons HALT andalanmu sebagai kartu Prioritas di daftar Rutinitas Harian.",
      },
    ],
  },
  {
    id: "3",
    number: 3,
    title: "Rekonstruksi Kebiasaan & Dopamin",
    subtitle: "Bagaimana otak mengotomatisasi rutinitas, mitos 21 hari, dan cara mengatur ulang sistem reward",
    readMinutes: 6,
    summary:
      "Pahami mengapa hampir separuh perilaku harian berjalan otomatis, apa peran sebenarnya dari dopamin, dan fakta ilmiah 66 hari membentuk jalur kebiasaan baru.",
    nextModuleId: "4",
    sections: [
      {
        id: "autopilot-45-persen",
        eyebrow: "Bagian 01",
        title: "Ketika 45% Hari Kamu Berjalan di Atas Autopilot",
        paragraphs: [
          "Coba ingat kembali apa yang kamu lakukan persis lima menit pertama setelah bangun tidur pagi ini. Kemungkinan besar kamu hampir tidak berpikir, namun urutan gerakan tangan dan langkah kakimu berlangsung persis sama seperti kemarin dan minggu lalu.",
          "Dalam studi pencatatan aktivitas harian terhadap mahasiswa dan warga umum oleh Wendy Wood, Jeffrey Quinn, dan Deborah Kashy (2002), para peneliti menemukan bahwa sekitar 45% dari seluruh perilaku kita setiap hari dilakukan di lokasi fisik yang sama secara berulang tanpa pertimbangan sadar. Dan kabar baiknya: selama kebiasaan berjalan otomatis, tingkat stres mental terasa jauh lebih rendah karena otak tidak perlu memikirkan setiap langkah.",
          "Namun mekanisme hemat energi inilah pedang bermata dua. Otak tidak membedakan mana kebiasaan yang membangun dan mana yang melelahkan. Apa pun yang sering diulang di konteks ruangan dan jam yang sama akan dipindahkan dari korteks pemikir ke sirkuit basal ganglia menjadi autopilot.",
        ],
        evidence: {
          study: "Wood, Quinn & Kashy (2002), Journal of Personality and Social Psychology",
          finding:
            "Sekitar 45% tindakan sehari-hari dilakukan secara rutin pada konteks lokasi yang konsisten, membebaskan pikiran dari pengambilan keputusan sadar.",
        },
        actionPrompt:
          "Tandai satu lokasi dan jam tetap di mana kebiasaan lamamu hampir selalu menyala otomatis.",
      },
      {
        id: "dopamin-wanting-liking",
        eyebrow: "Bagian 02",
        title: "Salah Paham Terbesar Tentang Dopamin: Antisipasi vs Kenikmatan",
        paragraphs: [
          "Banyak artikel populer menyebut dopamin sebagai 'molekul kenikmatan'. Penelitian ahli saraf Wolfram Schultz (1997) bersama rekan-rekannya menunjukkan cerita yang jauh lebih menarik melalui pengamatan neuron dopamin pada eksperimen belajar hadiah. Saat hadiah datang mengejutkan tanpa tanda apa pun, neuron dopamin langsung melonjak.",
          "Namun begitu otak belajar mengenali sebuah tanda peringatan (misalnya bunyi notifikasi, jam sepi malam, atau membuka aplikasi) yang selalu mendahului hadiah, puncak tembakan dopamin berpindah maju ke saat tanda pemicu muncul, bukan lagi saat hadiah dikonsumsi! Ahli saraf Kent Berridge membedakan dua sistem terpisah ini: 'wanting' (dorongan mengejar berbahan bakar dopamin) dan 'liking' (kenikmatan nyata saat menikmati).",
          "Itulah mengapa pada kebiasaan yang sudah terlalu sering diulang, kamu bisa sangat menginginkan ('wanting') membuka layar berjam-jam padahal setelah melakukannya kamu hampir tidak merasa senang ('liking') sama sekali. Sistem prediksimu terus membunyikan alarm kejaran meskipun hasilnya terasa hambar.",
        ],
        callout: {
          label: "Mengapa Rasa Penasaran Terasa Mendesak",
          text: "Dopamin melonjak paling tinggi sebelum tindakan terjadi (saat pemicu muncul), bukan sesudahnya. Mengamati lonjakan antisipasi ini membantumu melihat bahwa hasrat hanyalah sinyal prediksi, bukan jaminan kepuasan.",
          tone: "orange",
        },
        evidence: {
          study: "Schultz, Dayan & Montague (1997), Science; Berridge & Robinson Incentive-Sensitization Theory",
          finding:
            "Neuron dopamin mengkodekan Reward Prediction Error pada momen tanda pemicu dan antisipasi ('wanting'), terpisah dari pusat hedonic kenikmatan ('liking').",
        },
        actionPrompt:
          "Saat muncul hasrat membuka pelarian cepat, tanyakan jujur: 'Apakah aku benar-benar menikmati ini nanti, atau ini hanya dorongan antisipasi?'",
      },
      {
        id: "mitos-21-vs-66-hari",
        eyebrow: "Bagian 03",
        title: "Mitos 21 Hari dan Fakta 66 Hari dari University College London",
        paragraphs: [
          "Hampir semua orang pernah mendengar klaim bahwa membangun kebiasaan baru hanya butuh 21 hari. Sayangnya, angka populer itu berasal dari pengamatan anekdot seorang dokter bedah plastik pada 1960-an tentang waktu adaptasi pasien terhadap wajah barunya, bukan studi pembentukan kebiasaan.",
          "Untuk mengujinya secara ilmiah, Phillippa Lally dan timnya di University College London (2010) melacak 96 peserta selama 12 minggu saat mereka membangun satu kebiasaan harian baru. Hasilnya menunjukkan angka tengah (median) 66 hari hingga perilaku tersebut terasa otomatis, dengan rentang individu bervariasi antara 18 hingga 254 hari tergantung kompleksitas kebiasaannya.",
          "Namun bagian paling melegakan dari studi Lally jarang diceritakan: melewatkan satu hari secara acak TIDAK merusak kurva pembiasaan jangka panjang. Otomatisasi sempat melambat sedikit lalu langsung melanjutkan lintasan naiknya selama peserta kembali ke jalur keesokan harinya.",
        ],
        callout: {
          label: "Pembebasan dari Perfeksionisme",
          text: "Tidak ada kata 'gagal total' hanya karena satu hari terlewat. Kurva kebiasaanmu dibangun oleh rata-rata pengulangan ratusan hari ke depan, bukan satu kesempurnaan tanpa celah.",
          tone: "emerald",
        },
        evidence: {
          study: "Lally et al. (2010), European Journal of Social Psychology (UCL, 96 peserta)",
          finding:
            "Waktu median menuju otomatisasi kebiasaan adalah 66 hari (rentang 18-254 hari), dan melewatkan satu kesempatan tunggal tidak merusak proses pembentukan kebiasaan.",
        },
        actionPrompt:
          "Lepaskan target instan 21 hari dan rayakan setiap minggu di mana kamu kembali konsisten meski sempat bolong satu hari.",
      },
      {
        id: "desain-lingkungan-gesekan",
        eyebrow: "Bagian 04",
        title: "Desain Lingkungan: Memperbesar Hambatan untuk Kebiasaan Lama",
        paragraphs: [
          "Dalam kajian Angela Duckworth tentang kontrol diri situasional, perubahan paling konsisten muncul saat seseorang membuat kebiasaan baik tinggal berjarak satu sentuhan, sementara kebiasaan lama diberi beberapa detik hambatan fisik ekstra.",
          "Jika ponselmu tepat berada 30 sentimeter di samping bantal sambil terhubung Wi-Fi sepanjang malam, otakmu nyaris nol tenaga untuk menurutinya. Sebaliknya, memindahkan pengisi daya ke meja lain, keluar akun aplikasi pemicu, atau memakai pengingat waktu memberi jeda berharga agar korteks rasionalmu sempat ikut bersuara.",
          "Jangan minta dirimu menjadi manusia super di dalam kamar yang penuh jebakan. Rancang kamarmu agar versi paling lelah dari dirimu pun tetap terbantu.",
        ],
        bullets: [
          {
            lead: "Tambah hambatan kebiasaan berisiko:",
            detail: "Tambahkan minimal 20 detik jarak fisik (simpan gawai jauh dari kasur, matikan notifikasi non-esensial).",
          },
          {
            lead: "Turunkan hambatan kebiasaan sehat:",
            detail: "Siapkan botol minum penuh, buku bacaan ringan, atau pintasan Latihan Napas sebelum jam rawan tiba.",
          },
        ],
        evidence: {
          study: "Duckworth, Milkman & Laibson (2018), Beyond Willpower",
          finding:
            "Modifikasi lingkungan (memperkecil jarak ke pilihan sehat dan menambah friksi ke godaan) secara konsisten melampaui efektivitas tekad batin belaka.",
        },
        actionPrompt:
          "Ubah satu tata letak fisik di kamar tidur atau meja kerjamu sebelum malam ini.",
      },
      {
        id: "tukar-rutinitas-rayakan-kemenangan",
        eyebrow: "Bagian 05",
        title: "Menukar Rutinitas di Pemicu yang Sama & Kemenangan Kecil",
        paragraphs: [
          "Jalur saraf kebiasaan lama tidak serta-merta lenyap; ia tetap tersimpan seperti jalan aspal lama. Yang kita bangun dalam pemulihan adalah jalan setapak baru yang lebih lebar di persimpangan pemicu yang sama.",
          "Bila pemicumu adalah rasa jenuh jam 8 malam dan imbalan yang dicari otak adalah jeda relaksasi, jangan paksa dirimu bekerja lebih keras lagi di persimpangan itu. Tukar tindakannya dengan jeda penenang baru: tiga menit peregangan, mandi air hangat, menyeduh teh, atau memainkan satu sesi singkat game ketenangan di Lumif.",
          "Setiap kali kamu memilih jalur baru dan menutupnya dengan rasa lega yang jujur, mielin pada jalur saraf baru ikut menebal. Kemenangan kecil yang diulang setiap hari pada akhirnya mengalahkan jalan lama.",
        ],
        actionPrompt:
          "Tambahkan 1 aktivitas pengganti berdurasi di bawah 3 menit ke papan Rutinitas untuk jam rawanmu.",
      },
    ],
  },
  {
    id: "4",
    number: 4,
    title: "Intervensi Dini & Urge Surfing",
    subtitle: "Menunggangi gelombang dorongan selama 90 detik tanpa melawan atau menyerah",
    readMinutes: 6,
    summary:
      "Dari eksperimen 123 perokok oleh Bowen dan Marlatt hingga rencana Jika-Maka yang teruji pada 94 studi: belajar membiarkan ombak dorongan naik, memuncak, lalu pecah sendiri.",
    nextModuleId: "5",
    sections: [
      {
        id: "eksperimen-bowen-marlatt",
        eyebrow: "Bagian 01",
        title: "Eksperimen Sebatang Rokok: Mengapa Dorongan Tidak Harus Hilang untuk Dikalahkan",
        paragraphs: [
          "Pada 2009, peneliti Sarah Bowen dan G. Alan Marlatt mengundang 123 mahasiswa perokok ke laboratorium untuk sebuah uji psikologi yang agak menegangkan. Di ruangan uji, peserta diminta menyentuh, memegangi, dan mencium bau bungkus rokok untuk sengaja membangkitkan keinginan kuat merokok.",
          "Sebagian peserta hanya diminta menghadapi godaan itu seperti biasa, sementara kelompok lain diberi panduan singkat selama sesi bernama 'Urge Surfing'. Mereka diajarkan membayangkan dorongan merokok bukan sebagai perintah darurat, melainkan seperti ombak laut yang naik perlahan, mencapai puncak di tubuh, lalu pasti pecah dan surut bila sekadar diamati tanpa ditunggangi atau dilawan.",
          "Tujuh hari kemudian, hasil tindak lanjutnya membalik kepercayaan lama. Kelompok Urge Surfing memang MASIH merasakan keinginan merokok pada tingkat intensitas awal yang mirip saat dipicu. Namun jumlah rokok yang benar-benar mereka konsumsi sepanjang minggu berikutnya turun sekitar 37% dibanding kelompok pembanding! Dorongan tidak perlu hilang dulu agar tindakanmu bisa berubah.",
        ],
        callout: {
          label: "Terobosan Klinis",
          text: "Memutus hubungan antara 'merasa ingin' dan 'harus melakukan' jauh lebih realistis dan ampuh daripada menunggu hidup bebas dari rasa ingin sama sekali.",
          tone: "emerald",
        },
        evidence: {
          study: "Bowen & Marlatt (2009), Psychology of Addictive Behaviors (123 peserta)",
          finding:
            "Instruksi singkat urge surfing mengurangi konsumsi rokok sekitar 37% selama tindak lanjut 7 hari karena memutus ikatan otomatis antara hasrat dan tindakan.",
        },
        actionPrompt:
          "Saat hasrat datang hari ini, ingatkan diri: 'Aku boleh merasakan dorongan ini muncul tanpa harus menandatangani izin untuk melakukannya.'",
      },
      {
        id: "anatomi-gelombang-90-detik",
        eyebrow: "Bagian 02",
        title: "Anatomi Gelombang: Mengapa Hasrat Selalu Punya Puncak dan Surut",
        paragraphs: [
          "Ketika sebuah dorongan atau gejolak emosi mendadak menghantam, pikiran kita sering berbohong dengan mengatakan: 'Perasaan ini akan terus membesar sampai meledak kalau aku tidak menuruti sekarang juga!' Kenyataannya, fisika sistem saraf otonom bekerja persis kebalikannya.",
          "Lonjakan kimia stres dan reaksi fisiologis akut di pembuluh darah sebenarnya hanya bertahan aktif sekitar 90 detik sebelum tubuh membersihkannya secara alami, selama kita tidak terus memompanya ulang dengan cerita-cerita panik di kepala. Demikian pula kurva sebuah dorongan kebiasaan: jika tidak diberi umpan berupa membuka konten pemicu atau bernegosiasi terus-menerus, intensitas puncaknya akan mulai melandai.",
          "Bayangkan peselancar berpengalaman di pantai. Ia tidak berlari menendang ombak setinggi tiga meter supaya ombaknya berhenti datang. Ia hanya menjaga keseimbangan di atas papan selama ombak itu lewat di bawah kakinya, lalu meluncur tenang saat air kembali datar.",
        ],
        callout: {
          label: "Aturan Jeda Ombak",
          text: "Semua gelombang dorongan bersifat sementara. Bagian yang membuatnya bertahan berjam-jam bukanlah kekuatan fisiknya, melainkan negosiasi batin yang terus memberinya bahan bakar.",
          tone: "orange",
        },
        evidence: {
          study: "Model Gelombang Hasrat Marlatt & Neurokimia Gelombang Otonom Akut (~90 detik)",
          finding:
            "Gelombang rangsangan otonom memuncak singkat dan mereda secara fisiologis apabila tidak terus-menerus dipicu ulang oleh ruminasi mental atau pengulangan perilaku.",
        },
        actionPrompt:
          "Buka permainan Ombak Berlalu di menu Permainan saat gelisah mulai naik untuk melatih fokus visual mengikuti ritme ombak.",
      },
      {
        id: "empat-langkah-urge-surfing",
        eyebrow: "Bagian 03",
        title: "Empat Langkah Menunggangi Ombak Tanpa Tenggelam",
        paragraphs: [
          "Urge surfing bukan latihan melamun pasif, melainkan observasi fisik yang konkret di dalam tubuhmu sendiri selama satu hingga dua menit.",
        ],
        bullets: [
          {
            lead: "1. Pindah ke posisi jeda:",
            detail:
              "Letakkan gawai atau jauhkan tangan dari tombol aksi, duduk tegak dengan kedua telapak kaki menyentuh lantai.",
          },
          {
            lead: "2. Pindai sensasi fisik murni:",
            detail:
              "Di mana dorongan itu terasa secara fisik? Apakah berupa dada terasa hangat, perut mengencang, atau gelisah di ujung jari? Sebut suhunya, ukurannya, dan detaknya seperti pengamat netral.",
          },
          {
            lead: "3. Bernapas di sekitar gelombang:",
            detail:
              "Tarik napas pelan dan panjangkan hembusan, seolah napasmu memberi ruang luas di sekitar sensasi tegang itu tanpa memaksanya pergi.",
          },
          {
            lead: "4. Nilai ulang skalanya tiap 30 detik:",
            detail:
              "Beri angka 1 sampai 10 pada intensitas gelombang. Amati bagaimana angka tersebut mulai turun bahkan satu poin ketika tidak dituruti.",
          },
        ],
        actionPrompt:
          "Praktikkan empat langkah di atas minimal 90 detik penuh sebelum menyentuh pilihan lama di momen dorongan berikutnya.",
      },
      {
        id: "rencana-jika-maka",
        eyebrow: "Bagian 04",
        title: "Rencana 'Jika-Maka': Senjata Otomatis Teruji di 94 Studi",
        paragraphs: [
          "Ada satu jebakan klasik saat ombak dorongan datang di tengah malam: korteks rasional kita terlalu sibuk mencari ide solusi baru ('Harus ngapain ya sekarang?'). Menentukan strategi di saat kepala sudah penuh hasrat nyaris mustahil.",
          "Psikolog Peter Gollwitzer dan Paschal Sheeran (2006) membuktikan solusinya lewat meta-analisis terhadap 94 studi independen yang melibatkan lebih dari 8.000 peserta. Orang yang hanya menulis niat umum ('Saya ingin lebih tenang minggu ini') jauh tertinggal dibanding orang yang menyusun Implementation Intentions alias rencana spesifik 'Jika-Maka': 'JIKA situasi X terjadi, MAKA aku langsung menjalankan perilaku Y.'",
          "Dalam meta-analisis tersebut, rencana Jika-Maka mencatat ukuran efek rata-rata d = 0,65, kategori dampak sedang menuju besar yang jarang ditemui dalam intervensi perubahan perilaku sederhana. Mengunci keputusan sebelum badai datang memangkas waktu ragu hingga mendekati nol.",
        ],
        callout: {
          label: "Rumus Siap Pakai",
          text: "'JIKA jam menunjukkan pukul 22.00 dan aku sendirian merasa bosan di kamar, MAKA aku langsung menaruh ponsel di meja luar dan membuka Latihan Napas 2 menit.'",
          tone: "emerald",
        },
        evidence: {
          study: "Gollwitzer & Sheeran (2006), Advances in Experimental Social Psychology (94 studi, >8.000 peserta)",
          finding:
            "Perencanaan spesifik If-Then menghasilkan ukuran efek d = 0,65 pada pencapaian target perilaku karena mengotomatisasi respons saat pemicu muncul.",
        },
        actionPrompt:
          "Tulis satu kalimat 'JIKA [pemicumu]..., MAKA aku akan [aksi pengganti]...' di catatan atau detail Rutinitas.",
      },
      {
        id: "memetakan-peta-ombak",
        eyebrow: "Bagian 05",
        title: "Dari Bertahan Menjadi Mengenal Peta Diri Sendiri",
        paragraphs: [
          "Keindahan dari Urge Surfing dan rencana Jika-Maka adalah efek kumulatifnya. Setiap gelombang yang berhasil kamu tunggangi hingga surut membuktikan langsung kepada otakmu bahwa dorongan bukanlah tuan rumah, melainkan tamu yang hanya lewat.",
          "Semakin sering kamu mencatat jam, situasi, dan kondisi emosi di fitur Catat Hasrat dan Insight, semakin jelas pula peta gelombang pribadimu. Kamu mulai melihat bahwa ombakmu sebenarnya punya jadwal dan pola yang sangat bisa diprediksi, bukan serangan acak tanpa harapan.",
        ],
        actionPrompt:
          "Setelah menunggangi satu gelombang hari ini, catat skor pemicunya di Catat Hasrat untuk melatih kesadaran polamu.",
      },
    ],
  },
  {
    id: "5",
    number: 5,
    title: "Teknik Grounding 5-4-3-2-1",
    subtitle: "Menarik kendali kembali dari pusaran cemas ke realitas panca indra di detik kritis",
    readMinutes: 6,
    summary:
      "Pelajari ilmu saraf di balik lumpuhnya akal sehat saat cemas akut, mengapa menamai objek nyata meredakan alarm amigdala, dan protokol 5-4-3-2-1 plus napas penghela siklik.",
    sections: [
      {
        id: "mengapa-otak-lumpuh-saat-stres",
        eyebrow: "Bagian 01",
        title: "Mengapa Otak Cerdas Tiba-Tiba 'Blank' Saat Panik dan Terdesak",
        paragraphs: [
          "Pernahkah kamu tahu persis nasihat yang benar secara teori, namun ketika rasa panik, malu, atau dorongan akut datang, semua teori yang baru kamu baca seakan menguap dalam satu detik? Itu bukan tanda bahwa belajarmu sia-sia; itu reaksi biokimia otak yang dipelajari mendalam oleh ahli neurobiologi Yale, Amy Arnsten (2009).",
          "Di bawah kondisi tenang, korteks prefrontal memegang jabatan sebagai konduktor orkestra: mempertimbangkan masa depan, empati, dan nilai diri. Namun saat stres akut atau dorongan panik menyergap, aliran katekolamin melonjak dan secara cepat mematikan aktivitas sinaps halus di korteks prefrontal, lalu menyerahkan kendali penuh kepada sirkuit kuno amigdala dan ganglia basalis yang berorientasi reaksi instan.",
          "Kabar baiknya: karena penyebabnya adalah peralihan jalur sensorik dan sistem saraf otonom, cara tercepat memulihkan akses akal sehatmu bukanlah berdebat lebih keras di kepala, melainkan menurunkan alarm tubuh lewat input indrawi yang aman.",
        ],
        evidence: {
          study: "Arnsten (2009), Nature Reviews Neuroscience",
          finding:
            "Stres akut melepaskan katekolamin tinggi yang melemahkan jaringan korteks prefrontal sekaligus mengalihkan kendali perilaku ke sirkuit respons kebiasaan amigdala.",
        },
        actionPrompt:
          "Sadari tanda awal otakmu berpindah ke mode alarm: napas mendadak dangkal, pikiran berputar cepat, atau bahu menegang.",
      },
      {
        id: "menamai-realitas-ucla",
        eyebrow: "Bagian 02",
        title: "Efek Penamaan Realitas: Temuan Pemindai Otak UCLA",
        paragraphs: [
          "Pada 2007, ahli neurosains sosial Matthew Lieberman dan kolega di UCLA memindai otak peserta dengan fMRI sembari menampilkan gambar ekspresi emosi tajam yang biasanya menyalakan alarm amigdala dengan kuat. Di satu sesi, peserta diminta sekadar menamai secara verbal kata benda atau kata emosi apa yang terlihat pada gambar tersebut.",
          "Efek pemindaiannya luar biasa presisi: tindakan sederhana menerjemahkan pengalaman batin maupun pengamatan ke dalam kata-kata konkret langsung menyalakan korteks prefrontal ventrolateral kanan (RVLPFC), yang pada gilirannya mengirim sinyal penghambat menuju amigdala dan meredam lonjakan kecemasan secara otomatis.",
          "Teknik klinis inilah alasan mengapa membisikkan atau menyebut lima objek nyata di ruangan jauh lebih menenangkan daripada sekadar memejamkan mata menyuruh diri sendiri tenang. Kata-kata konkret memaksa sirkuit bahasa dan kontrol prefrontal kembali menyala.",
        ],
        callout: {
          label: "Mengapa Mengucapkan Benda Nyata Bekerja",
          text: "Menamai kenyataan objektif dengan kata-kata konkret menggeser aktivitas otak dari pusat kepanikan amigdala kembali menuju pusat kontrol korteks prefrontal kanan.",
          tone: "emerald",
        },
        evidence: {
          study: "Lieberman et al. (2007), Psychological Science (UCLA fMRI Study)",
          finding:
            "Affect labeling atau penamaan konkret mengaktifkan right ventrolateral prefrontal cortex (RVLPFC) dan menurunkan aktivitas amigdala secara langsung.",
        },
        actionPrompt:
          "Saat pikiran mulai melantur ke skenario terburuk, sebutkan dengan pelan 3 nama benda nyata yang ada di jarak pandangmu sekarang.",
      },
      {
        id: "anatomi-grounding-54321",
        eyebrow: "Bagian 03",
        title: "Anatomi Grounding 5-4-3-2-1: Mengunci Memori Kerja dengan Panca Indra",
        paragraphs: [
          "Memori kerja manusia punya kapasitas terbatas. Ketika memori kerja dipenuhi gambar skenario penyesalan atau godaan di masa depan, kecemasan memonopoli layar perhatianmu. Teknik Grounding 5-4-3-2-1 sengaja mengalihkan kapasitas memori kerja ke lima saluran sensorik masa kini satu per satu.",
        ],
        bullets: [
          {
            lead: "5 Hal yang Bisa Dilihat:",
            detail:
              "Cari detail spesifik yang sebelumnya terlewat, seperti pantulan cahaya di sudut meja, serat kayu kursi, atau warna jarum jam.",
          },
          {
            lead: "4 Hal yang Bisa Disentuh:",
            detail:
              "Rasakan suhu dingin gelas, tekstur kain celana, telapak kaki menapak di lantai, atau berat ponsel di telapak tangan.",
          },
          {
            lead: "3 Suara yang Bisa Didengar:",
            detail:
              "Dengarkan suara jarak dekat dan jauh secara terpisah: dengung kipas, lalu lintas jauh, atau suara helaan napasmu sendiri.",
          },
          {
            lead: "2 Aroma yang Bisa Dicium:",
            detail:
              "Kenali wangi sabun di tangan, aroma kopi, bau udara setelah hujan, atau aroma bersih kain baju.",
          },
          {
            lead: "1 Rasa atau Sensasi Mulut:",
            detail:
              "Rasakan sisa rasa air minum, mint, atau sekadar rasa segar setelah membasahi bibir dengan air putih.",
          },
        ],
        callout: {
          label: "Tips Agar Tidak Terburu-Buru",
          text: "Tidak ada nilai kecepatan untuk teknik 5-4-3-2-1. Beri jeda dua detik setiap selesai menyebut satu objek agar otak benar-benar memproses sensasi nyatanya.",
          tone: "orange",
        },
        actionPrompt:
          "Latih versi visualnya di mini game Temukan Sekitarmu agar langkah 5-4-3-2-1 terasa akrab bahkan sebelum kamu membutuhkannya.",
      },
      {
        id: "napas-cyclic-sighing-stanford",
        eyebrow: "Bagian 04",
        title: "Pasangan Alami Grounding: Napas Menghela Siklik 5 Menit",
        paragraphs: [
          "Grounding mengembalikan orientasi pikiran ke masa kini, sementara ritme napas mengirim sinyal langsung ke saraf vagus untuk melambatkan detak jantung. Dalam uji acak terkontrol (RCT) tahun 2023 di Stanford oleh Melis Yilmaz Balban, David Spiegel, dan Andrew Huberman yang dipublikasikan di Cell Reports Medicine, lebih dari 100 peserta membandingkan meditasi pasif melawan beberapa pola pernapasan aktif selama 5 menit sehari selama 28 hari.",
          "Kelompok yang berlatih pernapasan berorientasi hembusan panjang bernama Cyclic Sighing (tarik napas dalam lewat hidung, tambah satu tarikan pendek lagi di puncak untuk membuka kantung udara paru-paru, lalu hembuskan panjang dan perlahan lewat mulut) mencatat peningkatan suasana hati positif tertinggi serta penurunan laju napas istirahat yang bermakna.",
          "Menggabungkan dua siklus napas menghela panjang tepat sebelum atau sesudah hitung 5-4-3-2-1 memberi otakmu rem biologis ganda: fokus panca indra dari luar, ketenangan vagal dari dalam.",
        ],
        evidence: {
          study: "Balban, Spiegel, Huberman et al. (2023), Cell Reports Medicine RCT (Stanford)",
          finding:
            "Latihan 5 menit per hari pola cyclic sighing (dua tarikan berurutan diikuti hembusan panjang) meningkatkan suasana hati positif dan menurunkan arousal fisiologis melampaui kontrol meditasi pasif.",
        },
        actionPrompt:
          "Lakukan 3 kali tarikan ganda plus hembusan panjang sekarang, atau lanjutkan ke fitur Latihan Napas di Lumif.",
      },
      {
        id: "jangkar-harian-grit",
        eyebrow: "Bagian 05",
        title: "Menutup Lima Bab: Ketangguhan Adalah Keterampilan yang Bisa Dilatih",
        paragraphs: [
          "Jika kamu sampai di halaman terakhir Bab 5, ada satu hal mendasar yang kini kamu miliki melebihi niat baik semata: kamu memegang peta ilmiah tentang bagaimana pikiran melantur (Wegner & Masuda), mengapa tubuh menjadi rentan (HALT & kurang tidur), bagaimana dopamin membangun ekspektasi (Schultz & Lally), cara menunggangi ombak tanpa perang batin (Bowen, Marlatt & Gollwitzer), serta bagaimana menarik diri kembali ke realitas (Arnsten, Lieberman & Stanford RCT).",
          "Di halaman akhir bukunya, Angela Duckworth menulis bahwa grit bukanlah bakat mistis yang jatuh dari langit hanya untuk segelintir manusia super. Ia adalah gabungan minat jangka panjang, latihan terarah di hari biasa, rasa bermakna, dan harapan realistis untuk bangkit lagi esok pagi.",
          "Kamu tidak perlu menaklukkan seluruh tahun depan hari ini. Cukup menangkan lima menit berikutnya dengan tenang, rawat pendamping kecilmu di Lair, dan kembali lagi besok.",
        ],
        callout: {
          label: "Penutup Kurikulum CBT & ACT Lumif",
          text: "Pemulihan bukan garis lurus tanpa celah, melainkan keterampilan harian yang makin mantap setiap kali kamu memilih jeda sadar alih-alih reaksi otomatis.",
          tone: "emerald",
        },
        actionPrompt:
          "Tandai bab ini selesai, lalu pilih satu mini game atau rutinitas di Lumif untuk langsung mempraktikkan satu ilmu dari lima bab ini.",
      },
    ],
  },
];

export function getModuleById(id?: string | null): ModuleItem | undefined {
  return MODULES_DATA.find((m) => m.id === id);
}
