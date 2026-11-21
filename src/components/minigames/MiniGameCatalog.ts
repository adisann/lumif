import {
  CircleDot,
  Compass,
  Droplets,
  Eye,
  Grid2x2,
  Origami,
  Palette,
  Sprout,
  Sun,
  Waves,
  type LucideIcon,
} from "lucide-react";

export type MiniGameId =
  | "bubbles"
  | "zen-garden"
  | "breath-light"
  | "passing-waves"
  | "color-sort"
  | "grow-hope"
  | "grounding-find"
  | "calm-path"
  | "paper-fold"
  | "clear-fog";

export type MiniGameGroup = "crisis" | "sensory" | "focus";

export type MiniGameInfo = {
  id: MiniGameId;
  number: number;
  group: MiniGameGroup;
  title: string;
  description: string;
  mechanism: string;
  duration: string;
  icon: LucideIcon;
  accentBg: string;
  accentText: string;
};

export const MINI_GAME_GROUPS: {
  key: MiniGameGroup;
  title: string;
  subtitle: string;
}[] = [
  {
    key: "crisis",
    title: "Jeda Cepat & Napas",
    subtitle: "Cocok saat dorongan muncul mendadak atau pikiran terasa penuh.",
  },
  {
    key: "sensory",
    title: "Sentuhan & Visual",
    subtitle: "Interaksi lambat dan visual tenang tanpa batas waktu.",
  },
  {
    key: "focus",
    title: "Fokus Ringan",
    subtitle: "Aktivitas singkat terstruktur untuk mengalihkan perhatian.",
  },
];

export const MINI_GAMES: MiniGameInfo[] = [
  {
    id: "breath-light",
    number: 3,
    group: "crisis",
    title: "Cahaya Napas",
    description:
      "Ikuti lingkaran cahaya yang membesar dan mengecil perlahan selaras ritme pernapasanmu.",
    mechanism: "Pernapasan terpandu",
    duration: "45-60 detik",
    icon: Sun,
    accentBg: "bg-[#FFF3E5] dark:bg-orange-950/40",
    accentText: "text-brand-orange-ink",
  },
  {
    id: "passing-waves",
    number: 4,
    group: "crisis",
    title: "Ombak Berlalu",
    description:
      "Arahkan perahu kecil mengikuti ombak yang datang dan pergi tanpa perlu melawannya.",
    mechanism: "Metafora urge surfing (ACT)",
    duration: "45-90 detik",
    icon: Waves,
    accentBg: "bg-[#EAF7F1] dark:bg-emerald-950/50",
    accentText: "text-primary",
  },
  {
    id: "grounding-find",
    number: 7,
    group: "crisis",
    title: "Temukan Sekitarmu",
    description:
      "Temukan 3 benda di ilustrasi tenang, lalu amati 3 hal nyata di ruangan sekitarmu.",
    mechanism: "Latihan grounding & orientasi",
    duration: "60-90 detik",
    icon: Eye,
    accentBg: "bg-[#FCF6E3] dark:bg-amber-950/40",
    accentText: "text-[#8A6700] dark:text-[#EDBF45]",
  },
  {
    id: "zen-garden",
    number: 2,
    group: "sensory",
    title: "Taman Zen",
    description:
      "Garuk pola di atas pasir halus dan geser batu atau lumut sesukamu tanpa aturan salah.",
    mechanism: "Interaksi sensorimotor menenangkan",
    duration: "45-90 detik",
    icon: Compass,
    accentBg: "bg-[#FCF6E3] dark:bg-amber-950/40",
    accentText: "text-[#8A6700] dark:text-[#EDBF45]",
  },
  {
    id: "clear-fog",
    number: 10,
    group: "sensory",
    title: "Singkirkan Kabut",
    description:
      "Usap kabut pagi di layar perlahan untuk menampakkan pemandangan pegunungan yang tenang.",
    mechanism: "Gerakan lambat & umpan balik visual",
    duration: "30-60 detik",
    icon: Droplets,
    accentBg: "bg-[#EAF7F1] dark:bg-emerald-950/50",
    accentText: "text-primary",
  },
  {
    id: "grow-hope",
    number: 6,
    group: "sensory",
    title: "Tumbuhkan Harapan",
    description:
      "Siram tanaman dan atur cahaya hangatnya agar tunas tumbuh mekar tanpa risiko layu.",
    mechanism: "Perhatian positif pada proses",
    duration: "45-60 detik",
    icon: Sprout,
    accentBg: "bg-[#EAF7F1] dark:bg-emerald-950/50",
    accentText: "text-primary",
  },
  {
    id: "bubbles",
    number: 1,
    group: "focus",
    title: "Gelembung Ketenangan",
    description:
      "Pecahkan gelembung lembut yang mengapung pelan. Setiap sentuhan memunculkan riak tenang.",
    mechanism: "Perhatian visual & interaksi sederhana",
    duration: "30-60 detik",
    icon: CircleDot,
    accentBg: "bg-[#EAF7F1] dark:bg-emerald-950/50",
    accentText: "text-primary",
  },
  {
    id: "color-sort",
    number: 5,
    group: "focus",
    title: "Susun Warna",
    description:
      "Urutkan kepingan gradasi warna dari paling terang ke gelap dengan tempo santai.",
    mechanism: "Fokus visual & kognitif ringan",
    duration: "30-60 detik",
    icon: Palette,
    accentBg: "bg-[#FFF3E5] dark:bg-orange-950/40",
    accentText: "text-brand-orange-ink",
  },
  {
    id: "calm-path",
    number: 8,
    group: "focus",
    title: "Jejak Tenang",
    description:
      "Telusuri jalur melengkung dari titik 1 hingga 5. Jika meleset, kamu tetap bisa lanjut.",
    mechanism: "Koordinasi mata & tangan",
    duration: "30-45 detik",
    icon: Grid2x2,
    accentBg: "bg-[#EAF7F1] dark:bg-emerald-950/50",
    accentText: "text-primary",
  },
  {
    id: "paper-fold",
    number: 9,
    group: "focus",
    title: "Lipat Kertas",
    description:
      "Ikuti langkah lipatan berurutan untuk membentuk perahu, burung, atau bunga kertas.",
    mechanism: "Perhatian berurutan & taktil",
    duration: "45-90 detik",
    icon: Origami,
    accentBg: "bg-[#FFF3E5] dark:bg-orange-950/40",
    accentText: "text-brand-orange-ink",
  },
];
