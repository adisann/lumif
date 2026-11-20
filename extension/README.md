# Lumif Focus Guard Extension (WXT + TypeScript)

Ekstensi browser lokal-first untuk **Lumif Focus Guard** yang mendukung **Chrome Desktop**, **Brave Desktop**, **Firefox Desktop**, dan **Firefox Android**, terintegrasi secara opsional dengan website Next.js Lumif (`/focus-guard`).

---

## 1. Arsitektur & Pemisahan Komponen

1. **Shared Core (`../src/lib/focus-guard/`):**
   - `types.ts` — Kontrak konfigurasi, status proteksi, dan statistik agregat.
   - `validation.ts` — Sanitasi domain (menolak localhost, IP privat, scheme internal browser), normalisasi Unicode NFKC kata kunci, dan sanitasi pesan/tujuan pribadi (mencegah XSS).
   - `matcher.ts` — Evaluator deterministik domain/subdomain (`hostname === d || hostname.endsWith('.' + d)`), pengecualian allowlist, ekstrak query pada mesin pencari yang didukung, dan pengecualian konteks edukasi/pemulihan.
   - `dnrRules.ts` — Kompilator aturan MV3 `declarativeNetRequest` (RE2 tanpa *lookaround*, prioritas `100` Allowlist & Localhost -> `90` Konteks Edukasi/Pemulihan -> `50` Kata Kunci Pencarian -> `40` Domain Dibatasi).
   - `bridge.ts` — Protokol komunikasi tervalidasi untuk origin lokal yang diizinkan (`http://localhost:*`, `http://127.0.0.1:*`).
2. **Protection Engine (`entrypoints/background.ts` & `lib/storage.ts`):**
   - Menyimpan aturan di `browser.storage.local`, memperbarui `declarativeNetRequest.updateDynamicRules`, mengelola jeda terjadwal via `browser.alarms`, dan memverifikasi izin host.
3. **Intervensi Lokal (`entrypoints/intervention/`):**
   - Halaman CBT/ACT yang bekerja **100% mandiri tanpa perlu server Next.js berjalan**. Menyediakan pengingat tujuan pribadi, panduan napas `4-4-6`, latihan *Grounding 3-2-1*, cek HALT, dan kontrol transparan.
4. **Popup & Options (`entrypoints/popup/`, `entrypoints/options/`):**
   - Pengelolaan aturan penuh, paket preset sukarela (*opt-in*), pengingat tujuan, statistik agregat non-menghakimi, serta tombol hapus data lokal.
5. **Localhost Bridge (`entrypoints/lumif-bridge.content.ts`):**
   - HANYA disuntikkan ke `http://localhost/*` dan `http://127.0.0.1/*` (zero `<all_urls>` content script).

---

## 2. Instalasi & Pengujian di Laptop (Chrome Desktop & Brave Desktop)

### Prasyarat
- Node.js 20+ dan npm 10+

### Langkah Build
```bash
# 1. Dari root lumif-app, jalankan website Next.js (opsional; extension tetap jalan tanpa ini)
npm install
npm run dev:3001

# 2. Masuk ke folder extension, install dependency, jalankan unit test & build
cd extension
npm install
npm test
npm run build:all
```

Hasil build berada di:
- **Chrome Desktop & Brave Desktop:** `extension/.output/chrome-mv3`
- **Firefox Desktop & Firefox Android:** `extension/.output/firefox-mv3`

### Cara Load Unpacked di Brave Desktop & Chrome Desktop
1. Buka **Brave Desktop**: ketik `brave://extensions` pada address bar (atau `chrome://extensions` di Chrome).
2. Aktifkan **Developer mode** di sudut kanan atas.
3. Klik **Load unpacked**, lalu pilih folder:
   `.../lumif-app/extension/.output/chrome-mv3`
4. Klik ikon puzzle extensions -> sematkan **Lumif Focus Guard**.

### Skenario Pengujian Cepat di Desktop
1. Buka popup **Lumif Focus Guard** -> tambahkan domain aman uji coba `example.com` atau buka halaman **Pengaturan** dan aktifkan paket **Paket Uji Aman (Simulasi Lokal)** (`example.com` & kata kunci `lumiftestblock`).
2. Kunjungi `https://example.com` -> browser langsung mengarahkan ke halaman intervensi lokal Lumif (`/intervention.html?reason=domain...`).
3. Uji kata kunci pencarian:
   - Buka Google atau Brave Search (`search.brave.com`) dan cari `lumiftestblock` -> muncul halaman intervensi Lumif.
   - Uji *false positive*: bila memblokir kata `porn`, pencarian `caramel popcorn` tetap terbuka normal.
   - Uji pengecualian pemulihan: pencarian `cara pemulihan lumiftestblock` atau `terapi kecanduan porn` tetap diloloskan oleh aturan Prioritas 90.
4. Matikan server Next.js (`Ctrl+C`), lalu buka `https://example.com` lagi -> layar intervensi dan napas `4-4-6` tetap berjalan normal tanpa internet maupun Next.js.

---

## 3. Pengujian Android (Firefox for Android) & Batasan Brave Android

### Dukungan Nyata per Browser Android
- **Firefox for Android (didukung via `firefox-mv3`):** Mendukung Manifest V3, `declarativeNetRequest`, `gecko_android`, popup, options, dan halaman intervensi.
- **Brave Browser for Android & Chrome Android standar (TIDAK mendukung extension):** Browser Brave Android berbasis Chromium seluler saat ini tidak menyediakan mekanisme memuat WebExtension desktop/unpacked. Di Brave Android, halaman web `/focus-guard` tetap dapat dibuka sebagai dashboard pratinjau preferensi dan alat pemulihan web, tetapi **tidak memblokir tab lain di Brave Android**. Jangan mengklaim proteksi lintas aplikasi/browser di Android dari extension ini.

### Langkah Uji Lokal di Firefox Android (Temporary Install via ADB + `web-ext`)
1. Aktifkan **USB Debugging** pada perangkat Android (*Settings -> About Phone -> tap Build Number 7x -> Developer Options -> USB Debugging*).
2. Pasang **Firefox for Android** (atau Firefox Nightly) di HP, lalu buka **Settings -> About Firefox**, ketuk logo Firefox 5 kali untuk membuka menu developer, dan aktifkan **Remote debugging via USB**.
3. Hubungkan HP ke laptop via USB, lalu verifikasi:
   ```bash
   adb devices
   ```
4. Dari folder `extension/`:
   ```bash
   npx web-ext run --source-dir=.output/firefox-mv3 --target=firefox-android --android-device=<ID_DEVICE>
   ```
   *(Catatan: `adb` terhubung dengan perangkat fisik Android yang sedang dicolokkan diperlukan untuk langkah ini; `adb` tidak ditemukan di lingkungan workspace build saat ini).*
5. Setelah terbuka di Firefox Android:
   - Buka menu `Extensions` -> **Lumif Focus Guard**, pastikan izin akses pengalihan situs diizinkan (atau klik **"Izinkan Pengalihan Intervensi"** di popup).
   - Uji membuka `https://example.com` setelah mengaktifkan preset uji aman.

### Instalasi Sementara vs Permanen di Firefox Android
- **Sementara (`web-ext run`):** Bertahan selama sesi debugging ADB aktif; tidak memerlukan penandatanganan Mozilla.
- **Permanen:** Firefox Android produksi memerlukan paket `.xpi` yang ditandatangani oleh Mozilla Add-ons (AMO). Untuk distribusi nyata tanpa listing publik, gunakan opsi distribusi *Unlisted (Self-distributed)* melalui akun AMO Developer atau koleksi add-on khusus pada Firefox Nightly. Jangan mengunggah kode ke layanan pihak ketiga mana pun selama tahap lokal.

### Alternatif Masa Depan Lintas Aplikasi Android
Apabila di fase berikutnya dibutuhkan pemblokiran di seluruh browser dan aplikasi Android (termasuk Brave Android), opsi yang layak dievaluasi adalah companion Android native (menggunakan `VpnService` lokal DNS filter atau konfigurasi Private DNS / NextDNS berbasis persetujuan pengguna), dengan tinjauan keamanan jaringan yang terpisah.

---

## 4. Tinjauan Keamanan & Privasi

- **Least Privilege Permissions:** Hanya meminta `storage`, `declarativeNetRequest`, `declarativeNetRequestWithHostAccess`, `alarms`, serta `host_permissions` untuk `http://*/*` dan `https://*/*` yang diwajibkan browser untuk aksi `redirect` menuju `/intervention.html`. Tidak ada izin `tabs`, `history`, `cookies`, maupun content script `<all_urls>`.
- **Zero Traffic Payload / DOM Inspection:** Penyaringan berjalan di layer jaringan deklaratif browser (`declarativeNetRequest`), tidak menginspeksi isi HTML halaman eksternal atau trafik TLS.
- **Zero URL/Query Leakage:** Redirect ke `/intervention.html` hanya membawa parameter kategori (`?reason=domain|keyword&mode=...`), tidak pernah meneruskan URL lengkap atau query sensitif sehingga bebas risiko Open Redirect dan kebocoran histori.
- **Strict Web Bridge & CSP:** `lumif-bridge.content.ts` hanya aktif di `localhost` / `127.0.0.1`, memeriksa `event.source === window` dan whitelist origin, serta menolak pesan di luar skema. `extension_pages` CSP menolak `eval` dan inline script.
- **Privasi Data Lokal:** Riwayat kunjungan tidak disimpan. Hanya penghitung agregat sederhana (jumlah intervensi harian, jeda sadar, aksi pemulihan) yang dapat dihapus satu klik lewat tombol **Hapus Semua Data Lokal**.
