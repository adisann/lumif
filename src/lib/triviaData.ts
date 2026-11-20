export type TriviaQuestion = {
  id: string;
  question: string;
  image?: string;
  imageAlt?: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  funFact: string;
};

export type TriviaDeck = {
  id: string;
  title: string;
  duration: string;
  category: string;
  coverImage: string;
  coverAlt: string;
  questions: TriviaQuestion[];
};

export const TRIVIA_DECKS: TriviaDeck[] = [
  {
    id: "landmark-dunia",
    title: "Tebak Landmark Dunia",
    duration: "3 menit",
    category: "Geografi & Sejarah",
    coverImage: "/assets/trivia/landmark.jpg",
    coverAlt: "Benteng dan Tembok Besar Tiongkok membentang di perbukitan hijau",
    questions: [
      {
        id: "lm-1",
        question:
          "Benteng batu raksasa pada foto ini membentang ribuan kilometer di perbukitan Tiongkok. Bahan perekat unik apa yang pernah dicampurkan ke adukan batunya pada era Dinasti Ming?",
        image: "/assets/trivia/landmark.jpg",
        imageAlt: "Tembok Besar Tiongkok di kawasan perbukitan",
        options: [
          "Bubur beras ketan",
          "Minyak zaitun murni",
          "Garam laut kasar",
          "Madu lebah hutan",
        ],
        correctIndex: 0,
        funFact:
          "Pekerja Dinasti Ming mencampur sup beras ketan dengan kapur mati karena kandungan amilopektinnya membuat mortar menjadi sangat rapat dan tahan gempa.",
      },
      {
        id: "lm-2",
        question:
          "Candi Buddha terbesar di dunia yang tampak pada foto ini berada di Magelang, Jawa Tengah. Batu apa yang menyusun jutaan blok bangunannya?",
        image: "/assets/trivia/borobudur.jpg",
        imageAlt: "Stupa dan arca Candi Borobudur di Jawa Tengah",
        options: [
          "Marmer putih",
          "Batu andesit vulkanik",
          "Batu kapur koral",
          "Granit merah muda",
        ],
        correctIndex: 1,
        funFact:
          "Borobudur disusun dari sekitar dua juta blok batu andesit vulkanik dari sungai sekitar dengan sistem kunci saling mengait tanpa semen modern.",
      },
      {
        id: "lm-3",
        question:
          "Di negara manakah kota kuno Suku Inka bernama Machu Picchu berdiri di punggung pegunungan setinggi lebih dari 2.400 meter?",
        options: ["Meksiko", "Peru", "Chili", "Ekuador"],
        correctIndex: 1,
        funFact:
          "Machu Picchu terletak di Pegunungan Andes, Peru, dan dibangun pada abad ke-15 dengan teknik pemotongan batu presisi tinggi yang tahan guncangan gempa.",
      },
      {
        id: "lm-4",
        question:
          "Mengapa tinggi Menara Eiffel di Paris bisa bertambah hingga sekitar 15 sentimeter saat musim panas terik?",
        options: [
          "Angin panas mendorong puncak menara",
          "Struktur besi tempa memuai oleh panas",
          "Tanah di bawah fondasi terangkat",
          "Cat pelapis mengembang saat kering",
        ],
        correctIndex: 1,
        funFact:
          "Besi tempa mengalami pemuaian termal ketika suhu udara tinggi, sehingga kerangka menara memanjang sedikit di hari musim panas yang terik.",
      },
      {
        id: "lm-5",
        question:
          "Jika kamu berdiri di tepi Selat Bosphorus di kota Istanbul, kamu sedang menatap dua benua sekaligus. Dua benua apakah itu?",
        options: [
          "Eropa dan Afrika",
          "Asia dan Afrika",
          "Eropa dan Asia",
          "Asia dan Australia",
        ],
        correctIndex: 2,
        funFact:
          "Istanbul terkenal sebagai satu-satunya kota metropolitan besar di dunia yang wilayahnya membentang melintasi dua benua: Eropa dan Asia.",
      },
    ],
  },
  {
    id: "brain-snack-satwa",
    title: "Brain Snack: Dunia Satwa",
    duration: "2 menit",
    category: "Biologi & Alam",
    coverImage: "/assets/trivia/kingfisher.jpg",
    coverAlt: "Burung Raja Udang biru jingga bertengger di ranting",
    questions: [
      {
        id: "bs-1",
        question:
          "Bentuk paruh burung Raja Udang (Kingfisher) yang menyelam ke air tanpa menimbulkan cipratan besar pernah menginspirasi insinyur Jepang mendesain benda modern apa?",
        image: "/assets/trivia/kingfisher.jpg",
        imageAlt: "Burung Raja Udang dengan paruh panjang runcing",
        options: [
          "Sayap pesawat tempur supersonik",
          "Hidung kereta cepat Shinkansen seri 500",
          "Baling-baling kapal selam nuklir",
          "Lensa kamera kecepatan tinggi",
        ],
        correctIndex: 1,
        funFact:
          "Insinyur Eiji Nakatsu meniru geometri paruh Raja Udang pada moncong Shinkansen agar kereta tidak menimbulkan ledakan suara keras saat keluar dari terowongan.",
      },
      {
        id: "bs-2",
        question:
          "Terumbu karang berwarna jingga cerah pada foto ini sering dikira tumbuhan laut. Sebenarnya terumbu karang termasuk kelompok apa?",
        image: "/assets/trivia/coral.jpg",
        imageAlt: "Terumbu karang di perairan jernih bersama ikan kecil",
        options: [
          "Rumput laut berkapur",
          "Koloni hewan laut kecil bernama polip",
          "Jamur dasar samudra",
          "Kristal mineral alam",
        ],
        correctIndex: 1,
        funFact:
          "Karang adalah hewan kolonial dari filum Cnidaria. Warna cerahnya banyak dibantu oleh alga mikroskopis bernama zooxanthellae yang bersimbiosis di dalam jaringannya.",
      },
      {
        id: "bs-3",
        question:
          "Berapa jumlah jantung yang dimiliki oleh seekor gurita untuk memompa darah biru berbasis tembaga di tubuhnya?",
        options: ["1 jantung", "2 jantung", "3 jantung", "5 jantung"],
        correctIndex: 2,
        funFact:
          "Gurita memiliki tiga jantung: dua memompa darah melewati insang, sementara satu jantung utama memompanya ke seluruh tubuh (dan berhenti berdetak saat gurita berenang).",
      },
      {
        id: "bs-4",
        question:
          "Bagaimana cara lumba-lumba bisa beristirahat di laut tanpa tenggelam dan tetap muncul mengambil napas?",
        options: [
          "Menahan napas selama 8 jam penuh",
          "Mengistirahatkan satu belahan otak secara bergantian",
          "Mengambang kaku di permukaan setiap tengah malam",
          "Bernapas melalui kulit saat tidur",
        ],
        correctIndex: 1,
        funFact:
          "Lumba-lumba melakukan unihemispheric sleep: separuh otak tidur sementara separuh lainnya tetap terjaga memantau pemangsa dan mengatur napas.",
      },
      {
        id: "bs-5",
        question:
          "Lebah madu pekerja punya cara unik memberi tahu anggota sarangnya arah dan jarak lokasi bunga penuh nektar. Bagaimana caranya?",
        options: [
          "Mengeluarkan suara dengung berbeda nada",
          "Melakukan tarian berpola angka delapan (waggle dance)",
          "Meninggalkan jejak serbuk sari di daun",
          "Mengubah warna antena saat terbang",
        ],
        correctIndex: 1,
        funFact:
          "Sudut tarian waggle lebah terhadap arah vertikal sarang menunjukkan sudut posisi bunga relatif terhadap letak matahari di langit.",
      },
    ],
  },
  {
    id: "fakta-buah-kuliner",
    title: "Fakta Unik Buah & Rasa",
    duration: "2 menit",
    category: "Sains Sehari-hari",
    coverImage: "/assets/trivia/strawberries.jpg",
    coverAlt: "Potongan buah stroberi merah segar berdetail biji di permukaan luar",
    questions: [
      {
        id: "bk-1",
        question:
          "Secara klasifikasi botani resmi, mana di antara buah berikut yang sebenarnya BUKAN tergolong buah beri (berry)?",
        image: "/assets/trivia/strawberries.jpg",
        imageAlt: "Potongan melintang stroberi merah segar",
        options: ["Pisang", "Tomat", "Stroberi", "Anggur"],
        correctIndex: 2,
        funFact:
          "Dalam botani, buah beri sejati tumbuh dari satu bakal buah dan bijinya di dalam daging buah. Stroberi adalah buah aksesori dengan bintik biji (achene) di kulit luar.",
      },
      {
        id: "bk-2",
        question:
          "Pohon kakao penghasil cokelat diberi nama ilmiah Theobroma cacao oleh ahli botani Carl Linnaeus. Apa arti harfiah kata 'Theobroma'?",
        options: [
          "Pohon cokelat gelap",
          "Makanan para dewa",
          "Biji pahit berharga",
          "Hadiah hutan hujan",
        ],
        correctIndex: 1,
        funFact:
          "Dalam bahasa Yunani, theo berarti dewa dan broma berarti makanan. Suku Maya dan Aztek dulu menyajikan kakao sebagai minuman bernilai tinggi.",
      },
      {
        id: "bk-3",
        question:
          "Rempah vanili asli yang harumnya sering dipakai pada kue dan es krim berasal dari keluarga tumbuhan apa?",
        options: [
          "Keluarga anggrek",
          "Keluarga jahe-jahean",
          "Keluarga kacang polong",
          "Keluarga pinus",
        ],
        correctIndex: 0,
        funFact:
          "Vanilla planifolia adalah satu-satunya spesies dari keluarga besar anggrek (Orchidaceae) yang dibudidayakan secara luas sebagai bahan pangan.",
      },
      {
        id: "bk-4",
        question:
          "Mengapa madu murni yang disimpan rapat dapat bertahan bertahun-tahun tanpa mudah ditumbuhi bakteri pembusuk?",
        options: [
          "Mengandung alkohol alami tinggi",
          "Kadar air sangat rendah dan bersifat asam",
          "Suhunya selalu lebih dingin dari udara kamar",
          "Mengandung garam mineral laut",
        ],
        correctIndex: 1,
        funFact:
          "Kandungan air yang sangat sedikit (higroskopis) dan pH asam madu menarik air dari sel mikroba sehingga bakteri tidak sanggup berkembang biak.",
      },
      {
        id: "bk-5",
        question:
          "Senyawa alami apakah yang memberi warna kuning keemasan khas pada rimpang kunyit di masakan Nusantara?",
        options: ["Kapsaisin", "Kurkumin", "Klorofil", "Likopen"],
        correctIndex: 1,
        funFact:
          "Kurkumin adalah pigmen polifenol utama dalam kunyit yang juga banyak diteliti karena sifat antioksidan dan antiinflamasinya.",
      },
    ],
  },
  {
    id: "kosmos-tata-surya",
    title: "Jelajah Kosmos & Planet",
    duration: "3 menit",
    category: "Astronomi",
    coverImage: "/assets/trivia/saturn.jpg",
    coverAlt: "Planet Saturnus lengkap dengan sistem cincinnya difoto oleh wahana Cassini",
    questions: [
      {
        id: "ks-1",
        question:
          "Dari seluruh planet di Tata Surya, Saturnus punya keunikan massa jenis (kerapatan) paling kecil. Kalau ada samudra raksasa cukup luas, apa yang terjadi pada Saturnus?",
        image: "/assets/trivia/saturn.jpg",
        imageAlt: "Foto Saturnus dan cincin esnya",
        options: [
          "Langsung tenggelam ke dasar",
          "Terapung seperti gabus di air",
          "Meledak karena tekanan dingin",
          "Membeku menjadi cincin es",
        ],
        correctIndex: 1,
        funFact:
          "Massa jenis rata-rata Saturnus hanya sekitar 0,687 g/cm3, lebih ringan daripada air cair (1 g/cm3), karena sebagian besar tersusun atas gas hidrogen dan helium.",
      },
      {
        id: "ks-2",
        question:
          "Berapa lama waktu yang dibutuhkan seberkas cahaya dari Matahari untuk menempuh perjalanan sejauh ~150 juta kilometer sampai ke mata kita di Bumi?",
        options: [
          "Sekitar 8 detik",
          "Sekitar 8 menit 20 detik",
          "Sekitar 2 jam",
          "Sekitar 1 hari penuh",
        ],
        correctIndex: 1,
        funFact:
          "Dengan kecepatan cahaya ~300.000 kilometer per detik, sinar matahari butuh sekitar 500 detik (8 menit 20 detik) untuk tiba di Bumi.",
      },
      {
        id: "ks-3",
        question:
          "Di planet manakah durasi 'satu hari' (satu kali berputar pada porosnya) ternyata lebih lama daripada durasi 'satu tahunnya' mengelilingi Matahari?",
        options: ["Merkurius", "Venus", "Mars", "Neptunus"],
        correctIndex: 1,
        funFact:
          "Venus berotasi sangat lambat dan berlawanan arah sekitar 243 hari Bumi untuk sekali putar, padahal orbit tahunannya hanya butuh 225 hari Bumi.",
      },
      {
        id: "ks-4",
        question:
          "Satelit alami (bulan) manakah yang ukurannya paling besar di seluruh Tata Surya, bahkan sedikit lebih besar daripada planet Merkurius?",
        options: [
          "Titan (milik Saturnus)",
          "Ganymede (milik Jupiter)",
          "Europa (milik Jupiter)",
          "Bulan (milik Bumi)",
        ],
        correctIndex: 1,
        funFact:
          "Ganymede berdiameter sekitar 5.268 km dan merupakan satu-satunya bulan di Tata Surya yang diketahui punya medan magnet sendiri.",
      },
      {
        id: "ks-5",
        question:
          "Terdiri dari materi apakah sebenarnya cincin indah Saturnus yang tampak menyala memantulkan sinar Matahari?",
        options: [
          "Awan gas metana padat",
          "Miliaran pecahan es air dan debu batuan",
          "Debu emas vulkanik",
          "Kilatan aurora magnetik",
        ],
        correctIndex: 1,
        funFact:
          "Cincin Saturnus tersusun dari miliaran potongan es air murni dan batuan seukuran butir pasir hingga bongkahan sebesar rumah.",
      },
    ],
  },
];
