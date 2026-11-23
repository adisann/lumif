export type PetSpeciesId =
  | "duck"
  | "chicken"
  | "bird"
  | "bear"
  | "butterfly"
  | "deer"
  | "horse"
  | "spectral-stag"
  | "green-dragon"
  | "crystal-dragon"
  | "fire-dragon"
  | "purple-dragon";

export type PetStage = "egg" | "baby" | "adult";

export type PetCategory = "starter" | "hewan" | "unik" | "naga";

export type PetStageAsset = {
  assetId: string;
  modelUrl: string;
  stageLabel: string;
};

export type PetSpecies = {
  id: PetSpeciesId;
  name: string;
  category: PetCategory;
  categoryLabel: string;
  defaultNickname: string;
  tagline: string;
  swatchHex: string;
  unlockCost: number;
  hasEvolution: boolean;
  stages: Record<PetStage, PetStageAsset>;
};

export const STARTER_PET_IDS: PetSpeciesId[] = [
  "duck",
  "chicken",
  "bird",
  "bear",
];

export type StarterEggOption = {
  speciesId: PetSpeciesId;
  eggName: string;
  eggSubtitle: string;
  shellHex: string;
  hatchPreviewName: string;
};

export const STARTER_EGGS: StarterEggOption[] = [
  {
    speciesId: "duck",
    eggName: "Telur Kuning Hangat",
    eggSubtitle: "Tenang dan santai di tepi air",
    shellHex: "#F5D77F",
    hatchPreviewName: "Bebek",
  },
  {
    speciesId: "chicken",
    eggName: "Telur Krem Pagi",
    eggSubtitle: "Ceria menyambut pagi dan rutinitas",
    shellHex: "#F0B98D",
    hatchPreviewName: "Ayam",
  },
  {
    speciesId: "bird",
    eggName: "Telur Zamrud Hutan",
    eggSubtitle: "Ringan dan lincah mengalihkan pikiran",
    shellHex: "#8ED1B5",
    hatchPreviewName: "Burung Beo",
  },
  {
    speciesId: "bear",
    eggName: "Telur Rimba Klasik",
    eggSubtitle: "Hangat, kokoh, dan menenangkan",
    shellHex: "#D2B295",
    hatchPreviewName: "Beruang Lumif",
  },
];

export const PET_SPECIES: PetSpecies[] = [
  {
    id: "duck",
    name: "Bebek",
    category: "starter",
    categoryLabel: "Teman Dasar",
    defaultNickname: "Kwek",
    tagline: "Santai dan selalu siap menemani langkah kecilmu",
    swatchHex: "#E6B44B",
    unlockCost: 30,
    hasEvolution: false,
    stages: {
      egg: { assetId: "duck-base", modelUrl: "/models/duck-base.glb", stageLabel: "Teman" },
      baby: { assetId: "duck-base", modelUrl: "/models/duck-base.glb", stageLabel: "Teman" },
      adult: { assetId: "duck-base", modelUrl: "/models/duck-base.glb", stageLabel: "Teman" },
    },
  },
  {
    id: "chicken",
    name: "Ayam",
    category: "starter",
    categoryLabel: "Teman Dasar",
    defaultNickname: "Kokok",
    tagline: "Pengingat pagi untuk menjaga rutinitas harian",
    swatchHex: "#D97736",
    unlockCost: 30,
    hasEvolution: false,
    stages: {
      egg: { assetId: "chicken-base", modelUrl: "/models/chicken-base.glb", stageLabel: "Teman" },
      baby: { assetId: "chicken-base", modelUrl: "/models/chicken-base.glb", stageLabel: "Teman" },
      adult: { assetId: "chicken-base", modelUrl: "/models/chicken-base.glb", stageLabel: "Teman" },
    },
  },
  {
    id: "bird",
    name: "Burung Beo",
    category: "starter",
    categoryLabel: "Teman Dasar",
    defaultNickname: "Cuit",
    tagline: "Ceria dan ringan saat mengalihkan pikiran",
    swatchHex: "#2D936C",
    unlockCost: 30,
    hasEvolution: false,
    stages: {
      egg: {
        assetId: "cove-parrot-17850c",
        modelUrl: "/models/cove-parrot-17850c.glb",
        stageLabel: "Teman",
      },
      baby: {
        assetId: "cove-parrot-17850c",
        modelUrl: "/models/cove-parrot-17850c.glb",
        stageLabel: "Teman",
      },
      adult: {
        assetId: "cove-parrot-17850c",
        modelUrl: "/models/cove-parrot-17850c.glb",
        stageLabel: "Teman",
      },
    },
  },
  {
    id: "bear",
    name: "Beruang Lumif",
    category: "starter",
    categoryLabel: "Teman Dasar",
    defaultNickname: "Milo",
    tagline: "Maskot klasik Lumif yang hangat dan tenang",
    swatchHex: "#6B4E3B",
    unlockCost: 30,
    hasEvolution: false,
    stages: {
      egg: { assetId: "bear-base", modelUrl: "/models/bear-base.glb", stageLabel: "Teman" },
      baby: { assetId: "bear-base", modelUrl: "/models/bear-base.glb", stageLabel: "Teman" },
      adult: { assetId: "bear-base", modelUrl: "/models/bear-base.glb", stageLabel: "Teman" },
    },
  },
  {
    id: "butterfly",
    name: "Kupu-kupu",
    category: "hewan",
    categoryLabel: "Metamorfosis",
    defaultNickname: "Kupu",
    tagline: "Tumbuh dari ulat, kepompong, hingga kupu-kupu",
    swatchHex: "#D4A338",
    unlockCost: 50,
    hasEvolution: true,
    stages: {
      egg: {
        assetId: "swallowtail-caterpillar-base",
        modelUrl: "/models/swallowtail-caterpillar-base.glb",
        stageLabel: "Ulat",
      },
      baby: {
        assetId: "swallowtail-chrysalis-bde444",
        modelUrl: "/models/swallowtail-chrysalis-bde444.glb",
        stageLabel: "Kepompong",
      },
      adult: {
        assetId: "butterfly-base",
        modelUrl: "/models/butterfly-base.glb",
        stageLabel: "Kupu-kupu",
      },
    },
  },
  {
    id: "deer",
    name: "Rusa Hutan",
    category: "hewan",
    categoryLabel: "Rusa",
    defaultNickname: "Rusa",
    tagline: "Peka, tenang, dan kokoh menjaga fokus",
    swatchHex: "#8C6244",
    unlockCost: 80,
    hasEvolution: false,
    stages: {
      egg: { assetId: "deer-base", modelUrl: "/models/deer-base.glb", stageLabel: "Teman" },
      baby: { assetId: "deer-base", modelUrl: "/models/deer-base.glb", stageLabel: "Teman" },
      adult: { assetId: "deer-base", modelUrl: "/models/deer-base.glb", stageLabel: "Teman" },
    },
  },
  {
    id: "horse",
    name: "Kuda",
    category: "hewan",
    categoryLabel: "Kuda",
    defaultNickname: "Poni",
    tagline: "Lincah melangkah maju tanpa menoleh ke belakang",
    swatchHex: "#9C5B34",
    unlockCost: 100,
    hasEvolution: false,
    stages: {
      egg: { assetId: "wild-horse-047e93", modelUrl: "/models/wild-horse-047e93.glb", stageLabel: "Teman" },
      baby: { assetId: "wild-horse-047e93", modelUrl: "/models/wild-horse-047e93.glb", stageLabel: "Teman" },
      adult: { assetId: "wild-horse-047e93", modelUrl: "/models/wild-horse-047e93.glb", stageLabel: "Teman" },
    },
  },
  {
    id: "spectral-stag",
    name: "Rusa Kristal",
    category: "unik",
    categoryLabel: "Hewan Unik",
    defaultNickname: "Astra",
    tagline: "Rusa berkilau simbol kejernihan pikiran",
    swatchHex: "#6DA9B5",
    unlockCost: 150,
    hasEvolution: false,
    stages: {
      egg: { assetId: "spectral-stag-base", modelUrl: "/models/spectral-stag-base.glb", stageLabel: "Unik" },
      baby: { assetId: "spectral-stag-base", modelUrl: "/models/spectral-stag-base.glb", stageLabel: "Unik" },
      adult: { assetId: "spectral-stag-base", modelUrl: "/models/spectral-stag-base.glb", stageLabel: "Unik" },
    },
  },
  {
    id: "green-dragon",
    name: "Naga Hijau",
    category: "naga",
    categoryLabel: "Naga Evolusi",
    defaultNickname: "Lumi",
    tagline: "Tumbuh dari telur hingga naga penjaga fokus",
    swatchHex: "#257B5A",
    unlockCost: 180,
    hasEvolution: true,
    stages: {
      egg: {
        assetId: "miasma-dragon-egg-4b66e0",
        modelUrl: "/models/miasma-dragon-egg-4b66e0.glb",
        stageLabel: "Telur",
      },
      baby: {
        assetId: "green-gas-dragonling-base",
        modelUrl: "/models/green-gas-dragonling-base.glb",
        stageLabel: "Baby",
      },
      adult: {
        assetId: "green-gas-dragon-base",
        modelUrl: "/models/green-gas-dragon-base.glb",
        stageLabel: "Dewasa",
      },
    },
  },
  {
    id: "crystal-dragon",
    name: "Naga Kristal",
    category: "naga",
    categoryLabel: "Naga Evolusi",
    defaultNickname: "Krystal",
    tagline: "Tenang di bawah tekanan dan jernih bersikap",
    swatchHex: "#5C7E9C",
    unlockCost: 220,
    hasEvolution: true,
    stages: {
      egg: {
        assetId: "geode-dragon-egg-89141e",
        modelUrl: "/models/geode-dragon-egg-89141e.glb",
        stageLabel: "Telur",
      },
      baby: {
        assetId: "crystal-dragonling-base",
        modelUrl: "/models/crystal-dragonling-base.glb",
        stageLabel: "Baby",
      },
      adult: {
        assetId: "crystal-dragon-base",
        modelUrl: "/models/crystal-dragon-base.glb",
        stageLabel: "Dewasa",
      },
    },
  },
  {
    id: "fire-dragon",
    name: "Naga Api",
    category: "naga",
    categoryLabel: "Naga Evolusi",
    defaultNickname: "Bara",
    tagline: "Simbol tekad kuat saat menghadapi dorongan berat",
    swatchHex: "#C94632",
    unlockCost: 260,
    hasEvolution: true,
    stages: {
      egg: {
        assetId: "ember-dragon-egg-0700c7",
        modelUrl: "/models/ember-dragon-egg-0700c7.glb",
        stageLabel: "Telur",
      },
      baby: {
        assetId: "red-fire-dragonling-base",
        modelUrl: "/models/red-fire-dragonling-base.glb",
        stageLabel: "Baby",
      },
      adult: {
        assetId: "red-fire-dragon-base",
        modelUrl: "/models/red-fire-dragon-base.glb",
        stageLabel: "Dewasa",
      },
    },
  },
  {
    id: "purple-dragon",
    name: "Naga Kosmik",
    category: "naga",
    categoryLabel: "Naga Evolusi",
    defaultNickname: "Nyx",
    tagline: "Penjaga ketenangan di jam rawan malam hari",
    swatchHex: "#5B4B8A",
    unlockCost: 300,
    hasEvolution: true,
    stages: {
      egg: {
        assetId: "witchfire-dragon-egg-af4b4b",
        modelUrl: "/models/witchfire-dragon-egg-af4b4b.glb",
        stageLabel: "Telur",
      },
      baby: {
        assetId: "purple-flame-dragonling-base",
        modelUrl: "/models/purple-flame-dragonling-base.glb",
        stageLabel: "Baby",
      },
      adult: {
        assetId: "purple-flame-dragon-base",
        modelUrl: "/models/purple-flame-dragon-base.glb",
        stageLabel: "Dewasa",
      },
    },
  },
];

export type PetState = {
  speciesId: PetSpeciesId;
  nickname: string;
  xp: number;
  coins: number;
  unlockedSpecies: PetSpeciesId[];
  xpBySpecies?: Partial<Record<PetSpeciesId, number>>;
  nicknamesBySpecies?: Partial<Record<PetSpeciesId, string>>;
  lastCareBySpecies?: Partial<Record<PetSpeciesId, string>>;
  lastStreakRewardDate?: string;
};

export const DEFAULT_PET_STATE: PetState = {
  speciesId: "duck",
  nickname: "Kwek",
  xp: 0,
  coins: 0,
  unlockedSpecies: ["duck"],
  xpBySpecies: {},
  nicknamesBySpecies: {},
  lastCareBySpecies: {},
};

const STORAGE_KEY = "lumif_pet_state";
const STARTER_CHOSEN_KEY = "lumif_starter_chosen";
const STARTER_PENDING_KEY = "lumif_starter_pending";
const PET_EVENT = "lumif-pet-updated";

export function hasChosenStarterPet(): boolean {
  if (typeof window === "undefined") return true;
  if (window.localStorage.getItem(STARTER_PENDING_KEY) === "1") return false;
  if (window.localStorage.getItem(STARTER_CHOSEN_KEY) === "1") return true;
  return Boolean(window.localStorage.getItem(STORAGE_KEY));
}

export function markStarterChoicePending(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STARTER_PENDING_KEY, "1");
    window.localStorage.removeItem(STARTER_CHOSEN_KEY);
  } catch {
    // Storage unavailable
  }
}

export function selectStarterEgg(
  speciesId: PetSpeciesId,
  customNickname?: string
): PetState {
  const safeId = STARTER_PET_IDS.includes(speciesId) ? speciesId : "duck";
  const species = getPetSpecies(safeId);
  const nickname = customNickname?.trim() || species.defaultNickname;
  const current = loadPetState();

  const next: PetState = {
    ...current,
    speciesId: safeId,
    nickname,
    xp: getSpeciesXp(current, safeId),
    unlockedSpecies: [safeId],
    nicknamesBySpecies: {
      ...(current.nicknamesBySpecies ?? {}),
      [safeId]: nickname,
    },
    lastCareBySpecies: {
      ...(current.lastCareBySpecies ?? {}),
      [safeId]: new Date().toISOString(),
    },
  };

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STARTER_CHOSEN_KEY, "1");
      window.localStorage.removeItem(STARTER_PENDING_KEY);
    } catch {
      // Storage unavailable
    }
  }
  savePetState(next);
  return next;
}

/**
 * Restores a user's saved companion from their Supabase account on a new browser/device
 * without downgrading unlocked non-starter species to duck.
 */
export function hydratePetFromAccount(
  speciesId: PetSpeciesId,
  customNickname?: string
): PetState {
  const species = getPetSpecies(speciesId);
  const current = loadPetState();
  const nickname =
    customNickname?.trim() ||
    current.nicknamesBySpecies?.[species.id] ||
    species.defaultNickname;

  const nextUnlocked = current.unlockedSpecies.includes(species.id)
    ? current.unlockedSpecies
    : [...current.unlockedSpecies, species.id];

  const next: PetState = {
    ...current,
    speciesId: species.id,
    nickname,
    xp: getSpeciesXp(current, species.id),
    unlockedSpecies: nextUnlocked,
    nicknamesBySpecies: {
      ...(current.nicknamesBySpecies ?? {}),
      [species.id]: nickname,
    },
  };

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STARTER_CHOSEN_KEY, "1");
      window.localStorage.removeItem(STARTER_PENDING_KEY);
    } catch {
      // Storage unavailable
    }
  }
  savePetState(next);
  return next;
}

export function getPetSpecies(speciesId?: string | null): PetSpecies {
  return PET_SPECIES.find((item) => item.id === speciesId) ?? PET_SPECIES[0];
}

export function getSpeciesXp(state: PetState, speciesId: PetSpeciesId): number {
  const perPet = state.xpBySpecies?.[speciesId];
  if (typeof perPet === "number" && perPet >= 0) return perPet;
  return speciesId === state.speciesId ? state.xp : 0;
}

export function getSpeciesNickname(
  state: PetState,
  speciesId: PetSpeciesId
): string {
  const custom = state.nicknamesBySpecies?.[speciesId];
  if (typeof custom === "string" && custom.trim()) return custom.trim();
  if (speciesId === state.speciesId && state.nickname.trim()) {
    return state.nickname.trim();
  }
  return getPetSpecies(speciesId).defaultNickname;
}

export function getPetCondition(
  state: PetState,
  speciesId: PetSpeciesId
): {
  label: string;
  description: string;
  tone: "good" | "calm" | "needs-care";
} {
  const lastIso = state.lastCareBySpecies?.[speciesId];
  const speciesXp = getSpeciesXp(state, speciesId);

  if (!lastIso && speciesXp === 0) {
    return {
      label: "Baru Hadir",
      description: "Sapa atau selesaikan satu misi untuk mulai merawat.",
      tone: "calm",
    };
  }

  if (!lastIso) {
    return {
      label: "Tenang",
      description: "Pendamping siap menemanimu hari ini.",
      tone: "calm",
    };
  }

  const diffHours = (Date.now() - new Date(lastIso).getTime()) / (1000 * 60 * 60);
  if (diffHours <= 24) {
    return {
      label: "Segar & Aktif",
      description: "Terawat baik dari aktivitas dan misi hari ini.",
      tone: "good",
    };
  }

  if (diffHours <= 72) {
    return {
      label: "Tenang",
      description: "Ajak berinteraksi atau lakukan evaluasi harian.",
      tone: "calm",
    };
  }

  return {
    label: "Butuh Sapaan",
    description: "Sudah lebih dari 3 hari belum disapa. Klik Rawat di Rumah Pet.",
    tone: "needs-care",
  };
}

export function getPetProgress(
  xp: number,
  species?: PetSpecies
): {
  level: number;
  stage: PetStage;
  stageLabel: string;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
  nextEvolutionText: string;
} {
  const safeXp = Math.max(0, Math.floor(xp));
  const activeSpecies = species ?? PET_SPECIES[0];

  if (safeXp < 50) {
    const stageAsset = activeSpecies.stages.egg;
    return {
      level: 1,
      stage: "egg",
      stageLabel: activeSpecies.hasEvolution ? stageAsset.stageLabel : "Lv. 1",
      currentLevelXp: safeXp,
      nextLevelXp: 50,
      progressPercent: Math.round((safeXp / 50) * 100),
      nextEvolutionText: activeSpecies.hasEvolution
        ? `${50 - safeXp} XP lagi berubah menjadi ${activeSpecies.stages.baby.stageLabel}`
        : `${50 - safeXp} XP lagi menuju Lv. 2`,
    };
  }

  if (safeXp < 100) {
    const into = safeXp - 50;
    const stageAsset = activeSpecies.stages.baby;
    return {
      level: 2,
      stage: "baby",
      stageLabel: activeSpecies.hasEvolution ? stageAsset.stageLabel : "Lv. 2",
      currentLevelXp: into,
      nextLevelXp: 50,
      progressPercent: Math.round((into / 50) * 100),
      nextEvolutionText: activeSpecies.hasEvolution
        ? `${250 - safeXp} XP lagi tumbuh menjadi ${activeSpecies.stages.adult.stageLabel}`
        : `${100 - safeXp} XP lagi menuju Lv. 3`,
    };
  }

  if (safeXp < 175) {
    const into = safeXp - 100;
    const stageAsset = activeSpecies.stages.baby;
    return {
      level: 3,
      stage: "baby",
      stageLabel: activeSpecies.hasEvolution ? stageAsset.stageLabel : "Lv. 3",
      currentLevelXp: into,
      nextLevelXp: 75,
      progressPercent: Math.round((into / 75) * 100),
      nextEvolutionText: activeSpecies.hasEvolution
        ? `${250 - safeXp} XP lagi tumbuh menjadi ${activeSpecies.stages.adult.stageLabel}`
        : `${175 - safeXp} XP lagi menuju Lv. 4`,
    };
  }

  if (safeXp < 250) {
    const into = safeXp - 175;
    const stageAsset = activeSpecies.stages.baby;
    return {
      level: 4,
      stage: "baby",
      stageLabel: activeSpecies.hasEvolution ? stageAsset.stageLabel : "Lv. 4",
      currentLevelXp: into,
      nextLevelXp: 75,
      progressPercent: Math.round((into / 75) * 100),
      nextEvolutionText: activeSpecies.hasEvolution
        ? `${250 - safeXp} XP lagi tumbuh menjadi ${activeSpecies.stages.adult.stageLabel}`
        : `${250 - safeXp} XP lagi menuju Lv. 5`,
    };
  }

  const extraLevels = Math.floor((safeXp - 250) / 100);
  const into = (safeXp - 250) % 100;
  const stageAsset = activeSpecies.stages.adult;
  return {
    level: 5 + extraLevels,
    stage: "adult",
    stageLabel: activeSpecies.hasEvolution
      ? stageAsset.stageLabel
      : `Lv. ${5 + extraLevels}`,
    currentLevelXp: into,
    nextLevelXp: 100,
    progressPercent: Math.round((into / 100) * 100),
    nextEvolutionText: activeSpecies.hasEvolution
      ? `Tahap ${stageAsset.stageLabel} tercapai`
      : `${100 - into} XP lagi menuju Lv. ${6 + extraLevels}`,
  };
}

export function loadPetState(): PetState {
  if (typeof window === "undefined") return DEFAULT_PET_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PET_STATE;
    const parsed = JSON.parse(raw) as Partial<PetState>;
    const species = getPetSpecies(parsed.speciesId);
    const unlockedSet = new Set<PetSpeciesId>();
    if (Array.isArray(parsed.unlockedSpecies)) {
      for (const id of parsed.unlockedSpecies) {
        if (PET_SPECIES.some((s) => s.id === id)) {
          unlockedSet.add(id as PetSpeciesId);
        }
      }
    }
    const isLegacyStarterBundle =
      unlockedSet.size === STARTER_PET_IDS.length &&
      STARTER_PET_IDS.every((id) => unlockedSet.has(id)) &&
      STARTER_PET_IDS.filter(
        (id) =>
          id !== species.id &&
          ((parsed.xpBySpecies?.[id] ?? 0) > 0 ||
            Boolean(parsed.lastCareBySpecies?.[id]))
      ).length === 0;

    if (unlockedSet.size === 0 || isLegacyStarterBundle) {
      unlockedSet.clear();
      unlockedSet.add(species.id);
    }

    const activeId = unlockedSet.has(species.id)
      ? species.id
      : Array.from(unlockedSet)[0];
    const baseXp = typeof parsed.xp === "number" && parsed.xp >= 0 ? parsed.xp : 0;
    const xpBySpecies: Partial<Record<PetSpeciesId, number>> = {
      ...(parsed.xpBySpecies ?? {}),
    };
    if (typeof xpBySpecies[activeId] !== "number") {
      xpBySpecies[activeId] = baseXp;
    }

    return {
      speciesId: activeId,
      nickname:
        typeof parsed.nickname === "string" && parsed.nickname.trim()
          ? parsed.nickname.trim()
          : species.defaultNickname,
      xp: xpBySpecies[activeId] ?? baseXp,
      coins:
        typeof parsed.coins === "number" && parsed.coins >= 0 ? parsed.coins : 0,
      unlockedSpecies: Array.from(unlockedSet),
      xpBySpecies,
      nicknamesBySpecies: parsed.nicknamesBySpecies ?? {},
      lastCareBySpecies: parsed.lastCareBySpecies ?? {},
      lastStreakRewardDate:
        typeof parsed.lastStreakRewardDate === "string"
          ? parsed.lastStreakRewardDate
          : undefined,
    };
  } catch {
    return DEFAULT_PET_STATE;
  }
}

export function savePetState(next: PetState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(PET_EVENT));
  } catch {
    // Storage unavailable
  }
}

export function awardPetReward(xpDelta: number, coinDelta: number): PetState {
  const current = loadPetState();
  const prevSpeciesXp = getSpeciesXp(current, current.speciesId);
  const nextSpeciesXp = Math.max(0, prevSpeciesXp + xpDelta);
  const next: PetState = {
    ...current,
    xp: nextSpeciesXp,
    coins: Math.max(0, current.coins + coinDelta),
    xpBySpecies: {
      ...(current.xpBySpecies ?? {}),
      [current.speciesId]: nextSpeciesXp,
    },
    lastCareBySpecies:
      xpDelta > 0
        ? {
            ...(current.lastCareBySpecies ?? {}),
            [current.speciesId]: new Date().toISOString(),
          }
        : current.lastCareBySpecies,
  };
  savePetState(next);
  return next;
}

export function awardPetXp(delta: number): PetState {
  const coinDelta =
    delta === 0 ? 0 : delta > 0 ? Math.max(10, Math.round(delta * 0.6)) : -15;
  return awardPetReward(delta, coinDelta);
}

export function careForPet(speciesId: PetSpeciesId): PetState {
  const current = loadPetState();
  const prevXp = getSpeciesXp(current, speciesId);
  const nextXp = prevXp + 5;
  const next: PetState = {
    ...current,
    xp: speciesId === current.speciesId ? nextXp : current.xp,
    xpBySpecies: {
      ...(current.xpBySpecies ?? {}),
      [speciesId]: nextXp,
    },
    lastCareBySpecies: {
      ...(current.lastCareBySpecies ?? {}),
      [speciesId]: new Date().toISOString(),
    },
  };
  savePetState(next);
  return next;
}

export function setActivePet(
  speciesId: PetSpeciesId,
  customNickname?: string
): PetState {
  const current = loadPetState();
  const species = getPetSpecies(speciesId);
  const nickname =
    customNickname?.trim() || getSpeciesNickname(current, speciesId);
  const speciesXp = getSpeciesXp(current, speciesId);

  const next: PetState = {
    ...current,
    speciesId: species.id,
    nickname,
    xp: speciesXp,
    nicknamesBySpecies: {
      ...(current.nicknamesBySpecies ?? {}),
      [species.id]: nickname,
    },
  };
  savePetState(next);
  return next;
}

export function renamePetSpecies(
  speciesId: PetSpeciesId,
  nickname: string
): PetState {
  const current = loadPetState();
  const species = getPetSpecies(speciesId);
  const cleaned = nickname.trim() || species.defaultNickname;
  const next: PetState = {
    ...current,
    nickname: speciesId === current.speciesId ? cleaned : current.nickname,
    nicknamesBySpecies: {
      ...(current.nicknamesBySpecies ?? {}),
      [speciesId]: cleaned,
    },
  };
  savePetState(next);
  return next;
}

export function unlockPetSpecies(
  speciesId: PetSpeciesId,
  customNickname?: string
): { ok: boolean; state: PetState; message: string } {
  const current = loadPetState();
  const species = getPetSpecies(speciesId);

  if (current.unlockedSpecies.includes(speciesId)) {
    const updated = setActivePet(speciesId, customNickname);
    return { ok: true, state: updated, message: `${species.name} dipilih.` };
  }

  if (current.coins < species.unlockCost) {
    return {
      ok: false,
      state: current,
      message: `Butuh ${species.unlockCost - current.coins} Koin lagi untuk membuka ${species.name}.`,
    };
  }

  const nickname = customNickname?.trim() || species.defaultNickname;
  const next: PetState = {
    ...current,
    coins: current.coins - species.unlockCost,
    unlockedSpecies: [...current.unlockedSpecies, speciesId],
    speciesId,
    nickname,
    xp: getSpeciesXp(current, speciesId),
    nicknamesBySpecies: {
      ...(current.nicknamesBySpecies ?? {}),
      [speciesId]: nickname,
    },
    lastCareBySpecies: {
      ...(current.lastCareBySpecies ?? {}),
      [speciesId]: new Date().toISOString(),
    },
  };
  savePetState(next);
  return {
    ok: true,
    state: next,
    message: `${species.name} berhasil dibuka dan menjadi pendamping aktif!`,
  };
}

export function claimStreakBonus(
  todayDate: string,
  cleanDays: number
): { claimed: boolean; rewardCoins: number; state: PetState } {
  const current = loadPetState();
  if (cleanDays < 1 || current.lastStreakRewardDate === todayDate) {
    return { claimed: false, rewardCoins: 0, state: current };
  }

  const rewardCoins = Math.min(60, 20 + Math.min(cleanDays, 7) * 5);
  const prevXp = getSpeciesXp(current, current.speciesId);
  const nextXp = prevXp + 20;
  const next: PetState = {
    ...current,
    coins: current.coins + rewardCoins,
    xp: nextXp,
    xpBySpecies: {
      ...(current.xpBySpecies ?? {}),
      [current.speciesId]: nextXp,
    },
    lastCareBySpecies: {
      ...(current.lastCareBySpecies ?? {}),
      [current.speciesId]: new Date().toISOString(),
    },
    lastStreakRewardDate: todayDate,
  };
  savePetState(next);
  return { claimed: true, rewardCoins, state: next };
}

export function subscribePetState(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => onChange();
  window.addEventListener(PET_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(PET_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
