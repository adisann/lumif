# DESIGN.md — Lumif Self-Recovery Web App

Dial: ENERGY 2 / RHYTHM 2 / MOTION 1

## Design Read
Reading this as: a calm, supportive self-recovery and habit-tracking web app for young adults and Indonesian users rebuilding focus and daily discipline, in a warm grounded emerald-and-paper visual language, dial ENERGY 2 / RHYTHM 2 / MOTION 1.

## Brand Identity & Personality
- **Product:** Lumif — pendamping pemulihan kebiasaan tanpa menghakimi (CBT & ACT tools, check-in hasrat, misi harian, dan komunitas suportif).
- **Voice:** Jujur, hangat, praktis, tidak menggurui, tanpa angka palsu atau buzzword pemasaran.
- **Identity Motif:** Sudut membulat lembut (`16px`–`24px`) berpadu kartu berbingkai tipis dan satu maskot beruang pendamping.

## Color Palette (Capped per R-29, Verified AA per R-25)
- **Primary Core:** Deep Emerald `#257B5A` & Emerald `#2D936C` + Soft Mint `#EAF7F1`.
- **Brand Orange & Amber Accents:** Brand Orange `#FF8200` (display highlights, XP/frekuensi besar, serta `#CC6500` untuk teks kecil di latar putih) dan Warm Gold `#EDBF45` (tombol Aksi Cepat, bonus streak).
- **Semantic Emergency:** `#D82C1C` (khusus tombol Bantuan Darurat dan status destruktif).
- **Neutrals (Light):** Ink `#071013` / `#0F172A`, Surface `#FFFFFF`, Canvas `#F8FAF9`, Secondary text `#475569` / `#64748B`.
- **Neutrals (Dark):** Canvas `#0B1411`, Surface `#13201B`, Elevated `#1A2B24`, Border `#243B32`, Ink `#ECFDF5`, Secondary text `#A7C4B8`.

## Typography
- **Headings (`--font-poppins`):** `Poppins` — geometris lembut, mudah dipindai saat lelah atau cemas.
- **Body (`--font-lexend`):** `Lexend` — jarak karakter lega untuk mengurangi kepadatan visual saat membaca modul atau mencatat emosi.
- **Scale:** Gunakan skala fluida (`clamp`) pada judul utama agar proporsional dari `360px` ponsel hingga `1440px` desktop.

## Responsive Breakpoints & Layout Architecture
1. **Mobile (`< 768px`):** Satu kolom penuh (`w-full`), `BottomNav` tetap di bawah dengan ruang aman (`pb-[104px]`), tap target minimal `44x44px`.
2. **Tablet (`768px–1023px`):** Navigasi samping ringkas atau rail atas + grid 2 kolom untuk kartu aksi, modul, dan statistik agar layar tidak kosong maupun terhimpit.
3. **Desktop (`>= 1024px`):**
   - **Persistent App Sidebar (`240px`, collapsible):** Logo Lumif, navigasi utama (`Home`, `Insight`, `Komunitas`, `Modul`, `Rutinitas`, `Menu Lengkap`, `Setelan`), pemicu `Aksi Cepat`, dan akses cepat `Bantuan Darurat`.
   - **Asymmetric Content Canvas (`max-w-6xl`):**
     - **Home:** Grid 12 kolom — Kolom utama (Hero Hari Bersih + Evaluasi Harian + Misi Kecil) dan Kolom pendamping (Kartu Maskot Beruang 3D interaktif + Bantuan Darurat + Akses Modul/Rutinitas).
     - **Insight:** Ringkasan Streak Mingguan + 2 kolom grafik tren & konsistensi.
     - **Community:** Filter/kategori + komposer di kolom kiri/atas, feed diskusi di kolom utama.
     - **Modules / More / Routines / Urge Log:** Grid 2–3 kolom responsif dengan satu hierarki fokus yang jelas.
   - **Auth / Onboarding / Splash / Breathing / Meditation:** Terpusat rapi dengan panel konteks atau split-card di layar lebar, tidak membentang kosong.

## Motion & Accessibility Rules
- `MOTION 1` (tenang): transisi hover/tekan singkat (`150–200ms`), tanpa loop/pulse tak berujung di seluruh UI.
- Maskot 3D Polyfork (`bear-base`) di halaman `/home` dan `/exercises/breathing` memakai `THREE.NoToneMapping`, bergerak halus saat berinteraksi/bernapas dengan tombol jeda yang terlihat dan mematuhi `prefers-reduced-motion: reduce`.
- Semua kontrol memakai elemen native (`<button>`, `<a href>`), `cursor: pointer`, ring fokus `:focus-visible` kontras tinggi, dan mendukung mode terang & gelap penuh.
