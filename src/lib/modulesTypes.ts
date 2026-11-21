export type ModuleApproach = "Psikoedukasi" | "CBT" | "ACT" | "CBT + ACT";

export type EvidenceStrength =
  | "Tinjauan langsung masalah digital (kepastian bervariasi)"
  | "Komponen CBT teruji pada konteks terkait"
  | "Pendekatan ACT eksploratif dan potensial"
  | "Teknik pendukung manajemen stres";

export type ModuleReference = {
  citation: string;
  url: string;
  note: string;
};

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

export type ModulePracticeLink = {
  href: string;
  label: string;
  description: string;
};

export type ModuleItem = {
  id: string;
  number: number;
  phase: 1 | 2 | 3 | 4;
  phaseTitle: string;
  approachTag: ModuleApproach;
  isCoreStart?: boolean;
  title: string;
  subtitle: string;
  readMinutes: number;
  summary: string;
  learningObjective: string;
  evidenceStrength: EvidenceStrength;
  evidenceLimitation: string;
  references: ModuleReference[];
  practiceLink?: ModulePracticeLink;
  sections: ModuleSection[];
  nextModuleId?: string;
};

export type ModulePhaseMeta = {
  phase: 1 | 2 | 3 | 4;
  label: string;
  title: string;
  approach: string;
  summary: string;
  basis: string;
};

export const MODULE_PHASES: ModulePhaseMeta[] = [
  {
    phase: 1,
    label: "Fase 1",
    title: "Memahami Diri dan Kebiasaan Digital",
    approach: "Psikoedukasi · I-PACE · CBT",
    summary:
      "Mengenali perbedaan penggunaan sehat dan bermasalah, cara kebiasaan terbentuk, serta memetakan pemicu tanpa menyalahkan diri.",
    basis: "Model I-PACE (Brand et al., 2019) dan tinjauan intervensi CBT.",
  },
  {
    phase: 2,
    label: "Fase 2",
    title: "Mengubah Pikiran dan Perilaku",
    approach: "CBT",
    summary:
      "Melatih kejelian membaca pikiran otomatis, menantang pembenaran impulsif, menata lingkungan digital, dan mengelola emosi sulit.",
    basis: "Komponen praktik CBT (Radunz et al., 2026) dan riset pengendalian situasional.",
  },
  {
    phase: 3,
    label: "Fase 3",
    title: "Berdamai dengan Dorongan dan Emosi",
    approach: "ACT",
    summary:
      "Membangun fleksibilitas psikologis agar kamu tetap bisa memilih tindakan bijak meski pikiran dan dorongan terasa tidak nyaman.",
    basis: "Enam proses inti ACT, tinjauan ACT digital (Packer et al., 2026), dan panduan NHS Inform.",
  },
  {
    phase: 4,
    label: "Fase 4",
    title: "Membangun Perubahan Berkelanjutan",
    approach: "CBT + ACT",
    summary:
      "Menghubungkan langkah harian dengan nilai hidup pribadi, menghadapi kemunduran secara sehat, dan mengenali kapan perlu bantuan profesional.",
    basis: "Penetapan tujuan mandiri (Sachdeva et al., 2026) dan pencegahan kekambuhan CBT.",
  },
];
