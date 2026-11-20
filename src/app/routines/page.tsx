"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import BottomNav from "@/components/BottomNav";
import ScreenHeader from "@/components/ScreenHeader";
import { awardPetReward } from "@/lib/pets";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Columns3,
  FolderPlus,
  LayoutList,
  Plus,
  RotateCcw,
  Search,
  Star,
  Sun,
  Trash2,
  X,
} from "lucide-react";

type RoutineStatus = "todo" | "doing" | "done";
type TimeSlot = "Pagi" | "Siang" | "Malam" | "Kapan saja";
type ViewMode = "list" | "board";

type RoutineStep = {
  id: string;
  text: string;
  done: boolean;
};

type Routine = {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  status: RoutineStatus;
  starred: boolean;
  timeSlot: TimeSlot;
  notes?: string;
  steps?: RoutineStep[];
};

const STORAGE_KEY = "lumif_routines";
const CUSTOM_LISTS_KEY = "lumif_routine_lists";

const DEFAULT_LISTS = ["Pikiran", "Fisik", "Emosi", "Edukasi"];

const DEFAULT_ROUTINES: Routine[] = [
  {
    id: "breathing",
    title: "Latihan Pernapasan 2 Menit",
    category: "Pikiran",
    completed: true,
    status: "done",
    starred: true,
    timeSlot: "Pagi",
    steps: [
      { id: "s1", text: "Duduk tenang jauh dari layar", done: true },
      { id: "s2", text: "Tarik 4 detik, hembuskan 4 detik (4 siklus)", done: true },
    ],
  },
  {
    id: "hydration",
    title: "Minum 2 Gelas Air Putih",
    category: "Fisik",
    completed: true,
    status: "done",
    starred: false,
    timeSlot: "Pagi",
  },
  {
    id: "workout",
    title: "Olahraga / Peregangan Ringan 10 Menit",
    category: "Fisik",
    completed: false,
    status: "doing",
    starred: true,
    timeSlot: "Siang",
    notes: "Cukup peregangan bahu, punggung, atau jalan kaki keliling rumah.",
  },
  {
    id: "journaling",
    title: "Menulis Refleksi 3 Menit",
    category: "Emosi",
    completed: false,
    status: "todo",
    starred: false,
    timeSlot: "Malam",
  },
  {
    id: "reading",
    title: "Membaca 1 Bagian Modul CBT/ACT",
    category: "Edukasi",
    completed: false,
    status: "todo",
    starred: false,
    timeSlot: "Malam",
  },
];

function normalizeRoutine(raw: Partial<Routine>, idx: number): Routine {
  const completed = Boolean(raw.completed || raw.status === "done");
  const status: RoutineStatus =
    raw.status === "todo" || raw.status === "doing" || raw.status === "done"
      ? raw.status
      : completed
        ? "done"
        : "todo";
  return {
    id: typeof raw.id === "string" && raw.id ? raw.id : `routine_${idx}`,
    title: typeof raw.title === "string" && raw.title.trim() ? raw.title : "Rutinitas Harian",
    category: typeof raw.category === "string" && raw.category.trim() ? raw.category : "Pikiran",
    completed: status === "done",
    status,
    starred: Boolean(raw.starred),
    timeSlot:
      raw.timeSlot === "Pagi" ||
      raw.timeSlot === "Siang" ||
      raw.timeSlot === "Malam" ||
      raw.timeSlot === "Kapan saja"
        ? raw.timeSlot
        : "Pagi",
    notes: typeof raw.notes === "string" ? raw.notes : undefined,
    steps: Array.isArray(raw.steps) ? raw.steps : undefined,
  };
}

const BOARD_COLUMNS: {
  key: RoutineStatus;
  title: string;
  accentBar: string;
}[] = [
  { key: "todo", title: "Akan Dilakukan", accentBar: "bg-muted-foreground/40" },
  { key: "doing", title: "Sedang Dijalankan", accentBar: "bg-[#FF8200]" },
  { key: "done", title: "Selesai", accentBar: "bg-primary" },
];

export default function RoutinesScreen() {
  const [routines, setRoutines] = useState<Routine[]>(DEFAULT_ROUTINES);
  const [lists, setLists] = useState<string[]>(DEFAULT_LISTS);
  const [selectedList, setSelectedList] = useState<string>("__my_day__");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortByStar, setSortByStar] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("Pikiran");
  const [newTaskTime, setNewTaskTime] = useState<TimeSlot>("Pagi");

  const [showNewListInput, setShowNewListInput] = useState(false);
  const [newListName, setNewListName] = useState("");

  const [boardDrafts, setBoardDrafts] = useState<Record<RoutineStatus, string>>({
    todo: "",
    doing: "",
    done: "",
  });
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<RoutineStatus | null>(null);

  const [detailRoutineId, setDetailRoutineId] = useState<string | null>(null);
  const [newStepText, setNewStepText] = useState("");

  const idSeqRef = useRef(1);

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setRoutines(parsed.map((item, i) => normalizeRoutine(item, i)));
          }
        }
        const savedLists = window.localStorage.getItem(CUSTOM_LISTS_KEY);
        if (savedLists) {
          const parsedLists = JSON.parse(savedLists);
          if (Array.isArray(parsedLists) && parsedLists.length > 0) {
            setLists(parsedLists);
          }
        }
      } catch {
        // Keep defaults if localStorage JSON is malformed
      }
    });
    return () => window.cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!detailRoutineId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDetailRoutineId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [detailRoutineId]);

  const persistRoutines = (next: Routine[]) => {
    setRoutines(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage unavailable
    }
  };

  const persistLists = (nextLists: string[]) => {
    setLists(nextLists);
    try {
      window.localStorage.setItem(CUSTOM_LISTS_KEY, JSON.stringify(nextLists));
    } catch {
      // Storage unavailable
    }
  };

  const setRoutineStatus = (id: string, nextStatus: RoutineStatus) => {
    const target = routines.find((r) => r.id === id);
    if (!target || target.status === nextStatus) return;

    const wasDone = target.status === "done";
    const willBeDone = nextStatus === "done";

    const updated = routines.map((r) =>
      r.id === id ? { ...r, status: nextStatus, completed: willBeDone } : r
    );
    persistRoutines(updated);

    if (!wasDone && willBeDone) {
      awardPetReward(15, 10);
    } else if (wasDone && !willBeDone) {
      awardPetReward(-15, 0);
    }
  };

  const toggleComplete = (id: string) => {
    const target = routines.find((r) => r.id === id);
    if (!target) return;
    setRoutineStatus(id, target.status === "done" ? "todo" : "done");
  };

  const toggleStar = (id: string) => {
    const updated = routines.map((r) =>
      r.id === id ? { ...r, starred: !r.starred } : r
    );
    persistRoutines(updated);
  };

  const deleteRoutine = (id: string) => {
    persistRoutines(routines.filter((r) => r.id !== id));
    if (detailRoutineId === id) setDetailRoutineId(null);
  };

  const addRoutineItem = (
    title: string,
    status: RoutineStatus = "todo",
    categoryOverride?: string
  ) => {
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    let nextSeq = idSeqRef.current + 1;
    while (routines.some((r) => r.id === `custom_${nextSeq}`)) {
      nextSeq += 1;
    }
    idSeqRef.current = nextSeq;

    const defaultCat =
      selectedList.startsWith("__") ? newTaskCategory : selectedList;
    const category = categoryOverride || defaultCat || "Pikiran";

    const nextItem: Routine = {
      id: `custom_${nextSeq}`,
      title: cleanTitle,
      category,
      completed: status === "done",
      status,
      starred: selectedList === "__important__",
      timeSlot: newTaskTime,
    };

    persistRoutines([...routines, nextItem]);
    if (status === "done") awardPetReward(15, 10);
  };

  const handleAddList = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = newListName.trim();
    if (!cleaned || lists.includes(cleaned)) return;
    const nextLists = [...lists, cleaned];
    persistLists(nextLists);
    setSelectedList(cleaned);
    setNewTaskCategory(cleaned);
    setNewListName("");
    setShowNewListInput(false);
  };

  const resetAll = () => {
    persistRoutines(
      routines.map((r) => ({ ...r, completed: false, status: "todo" }))
    );
  };

  const filteredRoutines = useMemo(() => {
    let items = routines.filter((r) => {
      if (selectedList === "__important__" && !r.starred) return false;
      if (
        !selectedList.startsWith("__") &&
        r.category !== selectedList
      ) {
        return false;
      }
      if (
        searchQuery.trim() &&
        !r.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
      ) {
        return false;
      }
      return true;
    });

    if (sortByStar) {
      items = [...items].sort((a, b) => Number(b.starred) - Number(a.starred));
    }
    return items;
  }, [routines, selectedList, searchQuery, sortByStar]);

  const activeItems = filteredRoutines.filter((r) => r.status !== "done");
  const completedItems = filteredRoutines.filter((r) => r.status === "done");

  const activeHeading =
    selectedList === "__my_day__"
      ? "Hari Ini"
      : selectedList === "__important__"
        ? "Prioritas Bintang"
        : selectedList === "__all__"
          ? "Semua Rutinitas"
          : selectedList;

  const detailRoutine = detailRoutineId
    ? routines.find((r) => r.id === detailRoutineId) ?? null
    : null;

  const updateDetail = (patch: Partial<Routine>) => {
    if (!detailRoutine) return;
    persistRoutines(
      routines.map((r) => (r.id === detailRoutine.id ? { ...r, ...patch } : r))
    );
  };

  const addDetailStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailRoutine || !newStepText.trim()) return;
    idSeqRef.current += 1;
    const nextSteps = [
      ...(detailRoutine.steps ?? []),
      { id: `step_${idSeqRef.current}`, text: newStepText.trim(), done: false },
    ];
    updateDetail({ steps: nextSteps });
    setNewStepText("");
  };

  const completedTotal = routines.filter((r) => r.status === "done").length;

  const smartLists = [
    {
      key: "__my_day__",
      label: "Hari Ini",
      icon: Sun,
      count: routines.filter((r) => r.status !== "done").length,
    },
    {
      key: "__important__",
      label: "Prioritas",
      icon: Star,
      count: routines.filter((r) => r.starred && r.status !== "done").length,
    },
    {
      key: "__all__",
      label: "Semua",
      icon: LayoutList,
      count: routines.length,
    },
  ];

  return (
    <div className="lumif-with-nav relative flex min-h-dvh flex-col bg-surface-soft font-sans text-foreground">
      <ScreenHeader
        title="Rutinitas Harian"
        subtitle={`${completedTotal} dari ${routines.length} kebiasaan selesai hari ini`}
        rightAction={
          <div className="flex items-center gap-2">
            {/* List (Microsoft To Do) / Board (Trello) Switcher */}
            <div
              role="group"
              aria-label="Mode tampilan rutinitas"
              className="flex rounded-xl border border-border bg-surface-soft p-1"
            >
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-pressed={viewMode === "list"}
                className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-lg px-2.5 text-xs font-bold transition ${
                  viewMode === "list"
                    ? "bg-card text-primary shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutList className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Daftar</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("board")}
                aria-pressed={viewMode === "board"}
                className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-lg px-2.5 text-xs font-bold transition ${
                  viewMode === "board"
                    ? "bg-card text-primary shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Columns3 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Papan</span>
              </button>
            </div>

            <button
              type="button"
              onClick={resetAll}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-xs hover:bg-muted active:scale-95"
              aria-label="Reset checklist hari ini"
              title="Reset checklist"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        }
      />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-[calc(110px+env(safe-area-inset-bottom))] pt-5 md:px-8 md:pb-10">
        {/* Mobile List Switcher */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
          {smartLists.map((item) => {
            const active = selectedList === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setSelectedList(item.key)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-foreground"
                }`}
              >
                <item.icon className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{item.label}</span>
                <span className="opacity-75">({item.count})</span>
              </button>
            );
          })}
          {lists.map((cat) => {
            const active = selectedList === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedList(cat);
                  setNewTaskCategory(cat);
                }}
                className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-muted-foreground"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[235px_minmax(0,1fr)]">
          {/* Desktop Microsoft To Do Style Lists Sidebar */}
          <aside className="hidden flex-col justify-between rounded-2xl border border-border bg-card p-3.5 lg:flex">
            <div className="space-y-4">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari rutinitas..."
                  className="h-9 w-full rounded-xl border border-input bg-surface-soft pl-8 pr-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="space-y-1">
                {smartLists.map((item) => {
                  const Icon = item.icon;
                  const active = selectedList === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setSelectedList(item.key)}
                      className={`flex min-h-[40px] w-full items-center justify-between rounded-xl px-3 text-xs font-semibold transition ${
                        active
                          ? "bg-primary-light text-primary"
                          : "text-foreground hover:bg-surface-soft"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon
                          className={`h-4 w-4 ${
                            item.key === "__important__"
                              ? "text-[#FF8200]"
                              : active
                                ? "text-primary"
                                : "text-muted-foreground"
                          }`}
                          aria-hidden="true"
                        />
                        <span>{item.label}</span>
                      </span>
                      <span className="text-[11px] font-bold text-muted-foreground">
                        {item.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-border pt-3">
                <p className="mb-1.5 px-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  Daftar Kategori
                </p>
                <div className="space-y-1">
                  {lists.map((cat) => {
                    const active = selectedList === cat;
                    const count = routines.filter(
                      (r) => r.category === cat && r.status !== "done"
                    ).length;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setSelectedList(cat);
                          setNewTaskCategory(cat);
                        }}
                        className={`flex min-h-[38px] w-full items-center justify-between rounded-xl px-3 text-xs font-medium transition ${
                          active
                            ? "bg-primary-light font-semibold text-primary"
                            : "text-foreground hover:bg-surface-soft"
                        }`}
                      >
                        <span className="flex items-center gap-2.5 truncate">
                          <span
                            className="h-2 w-2 shrink-0 rounded-full bg-primary"
                            aria-hidden="true"
                          />
                          <span className="truncate">{cat}</span>
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-3">
              {showNewListInput ? (
                <form onSubmit={handleAddList} className="space-y-2">
                  <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="Nama daftar baru..."
                    maxLength={24}
                    autoFocus
                    className="h-9 w-full rounded-xl border border-input bg-background px-3 text-xs text-foreground"
                  />
                  <div className="flex justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowNewListInput(false)}
                      className="rounded-lg px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:bg-muted"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-primary px-3 py-1 text-xs font-bold text-primary-foreground"
                    >
                      Tambah
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowNewListInput(true)}
                  className="flex min-h-[40px] w-full items-center gap-2 rounded-xl px-3 text-xs font-semibold text-muted-foreground transition hover:bg-surface-soft hover:text-primary"
                >
                  <FolderPlus className="h-4 w-4" aria-hidden="true" />
                  <span>Daftar Baru</span>
                </button>
              )}
            </div>
          </aside>

          {/* Main Workspace: Microsoft To Do List OR Trello Kanban Board */}
          <section className="flex min-w-0 flex-col rounded-2xl border border-border bg-card p-4 sm:p-6">
            {/* List Heading & Filter Controls */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <h2 className="font-heading text-xl font-bold text-foreground">
                  {activeHeading}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {viewMode === "list"
                    ? "Klik lingkaran untuk selesai (+15 XP), bintang untuk prioritas, atau judul untuk detail langkah."
                    : "Seret kartu atau gunakan panah untuk memindahkan progres dari Akan Dilakukan hingga Selesai."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSortByStar((s) => !s)}
                  aria-pressed={sortByStar}
                  className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition ${
                    sortByStar
                      ? "border-[#FF8200]/50 bg-[#FFF6EB] text-brand-orange-ink"
                      : "border-border bg-surface-soft text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Star className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Prioritas dulu</span>
                </button>
              </div>
            </div>

            {viewMode === "list" ? (
              /* ============================================================
               * MICROSOFT TO DO LIST VIEW
               * ========================================================== */
              <div className="flex flex-1 flex-col justify-between gap-5">
                <div className="space-y-4">
                  {/* Inline Quick Add (Microsoft To Do style) */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      addRoutineItem(newTaskTitle);
                      setNewTaskTitle("");
                    }}
                    className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-surface-soft px-3.5 py-2 focus-within:border-primary"
                  >
                    <Plus
                      className="h-4 w-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="Tambahkan rutinitas baru lalu tekan Enter..."
                      className="h-9 min-w-[180px] flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                    <select
                      value={
                        selectedList.startsWith("__")
                          ? newTaskCategory
                          : selectedList
                      }
                      onChange={(e) => setNewTaskCategory(e.target.value)}
                      aria-label="Pilih kategori rutinitas"
                      className="h-8 rounded-lg border border-border bg-card px-2 text-xs font-semibold text-foreground"
                    >
                      {lists.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <select
                      value={newTaskTime}
                      onChange={(e) => setNewTaskTime(e.target.value as TimeSlot)}
                      aria-label="Pilih waktu"
                      className="h-8 rounded-lg border border-border bg-card px-2 text-xs font-semibold text-foreground"
                    >
                      {(["Pagi", "Siang", "Malam", "Kapan saja"] as TimeSlot[]).map(
                        (slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        )
                      )}
                    </select>
                    <button
                      type="submit"
                      disabled={!newTaskTitle.trim()}
                      className="min-h-[34px] rounded-lg bg-primary px-3.5 font-heading text-xs font-bold text-primary-foreground transition hover:bg-primary-dark disabled:opacity-40"
                    >
                      Tambah
                    </button>
                  </form>

                  {/* Active Uncompleted Tasks */}
                  <div className="space-y-1.5">
                    {activeItems.length === 0 ? (
                      <p className="rounded-xl bg-surface-soft px-4 py-6 text-center text-xs text-muted-foreground">
                        Tidak ada tugas aktif di daftar ini. Tambahkan rutinitas di atas atau cek bagian Selesai di bawah.
                      </p>
                    ) : (
                      activeItems.map((routine) => {
                        const stepsDone =
                          routine.steps?.filter((s) => s.done).length ?? 0;
                        const stepsTotal = routine.steps?.length ?? 0;

                        return (
                          <div
                            key={routine.id}
                            className={`group flex min-h-[54px] items-center justify-between gap-2 rounded-xl border px-3 py-2 transition ${
                              detailRoutineId === routine.id
                                ? "border-primary bg-primary-light/50"
                                : "border-border/80 bg-background hover:border-primary/40 hover:bg-surface-soft/70"
                            }`}
                          >
                            <div className="flex min-w-0 flex-1 items-center gap-2.5">
                              <button
                                type="button"
                                onClick={() => toggleComplete(routine.id)}
                                aria-label={`Tandai ${routine.title} selesai`}
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:text-primary"
                              >
                                <Circle className="h-5 w-5" aria-hidden="true" />
                              </button>

                              <button
                                type="button"
                                onClick={() => setDetailRoutineId(routine.id)}
                                className="min-w-0 flex-1 py-1 text-left"
                              >
                                <p className="truncate text-sm font-medium text-foreground">
                                  {routine.title}
                                </p>
                                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                                  <span>{routine.category}</span>
                                  <span>·</span>
                                  <span className="inline-flex items-center gap-1">
                                    <Calendar className="h-3 w-3" aria-hidden="true" />
                                    {routine.timeSlot}
                                  </span>
                                  {routine.status === "doing" && (
                                    <>
                                      <span>·</span>
                                      <span className="font-semibold text-brand-orange-ink">
                                        Sedang dikerjakan
                                      </span>
                                    </>
                                  )}
                                  {stepsTotal > 0 && (
                                    <>
                                      <span>·</span>
                                      <span>
                                        {stepsDone}/{stepsTotal} langkah
                                      </span>
                                    </>
                                  )}
                                </div>
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => toggleStar(routine.id)}
                              aria-label={
                                routine.starred
                                  ? "Hapus dari prioritas"
                                  : "Tandai sebagai prioritas"
                              }
                              aria-pressed={routine.starred}
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition hover:bg-muted"
                            >
                              <Star
                                className={`h-4 w-4 ${
                                  routine.starred
                                    ? "fill-[#FF8200] text-[#FF8200]"
                                    : "text-muted-foreground"
                                }`}
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Collapsible Completed Section (like Microsoft To Do) */}
                  {completedItems.length > 0 && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setShowCompleted((v) => !v)}
                        aria-expanded={showCompleted}
                        className="mb-2 inline-flex min-h-[36px] items-center gap-1.5 rounded-lg bg-surface-soft px-3 text-xs font-bold text-foreground hover:bg-muted"
                      >
                        {showCompleted ? (
                          <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                        <span>Selesai ({completedItems.length})</span>
                      </button>

                      {showCompleted && (
                        <div className="space-y-1.5">
                          {completedItems.map((routine) => (
                            <div
                              key={routine.id}
                              className="flex min-h-[50px] items-center justify-between gap-2 rounded-xl border border-border/60 bg-surface-soft/50 px-3 py-1.5"
                            >
                              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                                <button
                                  type="button"
                                  onClick={() => toggleComplete(routine.id)}
                                  aria-label={`Batalkan selesai ${routine.title}`}
                                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-primary"
                                >
                                  <CheckCircle2
                                    className="h-5 w-5 fill-primary-light"
                                    aria-hidden="true"
                                  />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setDetailRoutineId(routine.id)}
                                  className="min-w-0 flex-1 py-1 text-left"
                                >
                                  <p className="truncate text-sm font-medium text-muted-foreground line-through">
                                    {routine.title}
                                  </p>
                                  <span className="text-[11px] text-muted-foreground">
                                    {routine.category} · {routine.timeSlot}
                                  </span>
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => toggleStar(routine.id)}
                                aria-label="Toggle prioritas"
                                aria-pressed={routine.starred}
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl hover:bg-muted"
                              >
                                <Star
                                  className={`h-4 w-4 ${
                                    routine.starred
                                      ? "fill-[#FF8200] text-[#FF8200]"
                                      : "text-muted-foreground/60"
                                  }`}
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* ============================================================
               * TRELLO KANBAN BOARD VIEW
               * ========================================================== */
              <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
                {BOARD_COLUMNS.map((col, colIdx) => {
                  const colItems = filteredRoutines.filter(
                    (r) => r.status === col.key
                  );
                  const isOver = dragOverCol === col.key;

                  return (
                    <div
                      key={col.key}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (dragOverCol !== col.key) setDragOverCol(col.key);
                      }}
                      onDragLeave={() => {
                        if (dragOverCol === col.key) setDragOverCol(null);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragOverCol(null);
                        if (draggedId) {
                          setRoutineStatus(draggedId, col.key);
                          setDraggedId(null);
                        }
                      }}
                      className={`flex flex-col justify-between rounded-2xl border p-3.5 transition ${
                        isOver
                          ? "border-primary bg-primary-light/40"
                          : "border-border/80 bg-surface-soft/80"
                      }`}
                    >
                      <div>
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${col.accentBar}`}
                              aria-hidden="true"
                            />
                            <h3 className="font-heading text-xs font-bold uppercase tracking-wide text-foreground">
                              {col.title}
                            </h3>
                          </div>
                          <span className="rounded-md bg-card px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
                            {colItems.length}
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          {colItems.map((card) => (
                            <article
                              key={card.id}
                              draggable
                              onDragStart={() => setDraggedId(card.id)}
                              onDragEnd={() => {
                                setDraggedId(null);
                                setDragOverCol(null);
                              }}
                              className="rounded-xl border border-border bg-card p-3 shadow-xs transition hover:border-primary/40"
                            >
                              <div className="mb-1.5 flex items-center justify-between gap-2">
                                <span className="rounded-md bg-surface-soft px-2 py-0.5 text-[10px] font-bold text-primary">
                                  {card.category} · {card.timeSlot}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => toggleStar(card.id)}
                                  aria-label="Tandai prioritas"
                                  className="p-1"
                                >
                                  <Star
                                    className={`h-3.5 w-3.5 ${
                                      card.starred
                                        ? "fill-[#FF8200] text-[#FF8200]"
                                        : "text-muted-foreground/60"
                                    }`}
                                    aria-hidden="true"
                                  />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => setDetailRoutineId(card.id)}
                                className={`block w-full text-left text-sm font-medium ${
                                  card.status === "done"
                                    ? "text-muted-foreground line-through"
                                    : "text-card-foreground"
                                }`}
                              >
                                {card.title}
                              </button>

                              {/* Touch & keyboard friendly quick-move arrows */}
                              <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2">
                                <button
                                  type="button"
                                  disabled={colIdx === 0}
                                  onClick={() =>
                                    setRoutineStatus(
                                      card.id,
                                      BOARD_COLUMNS[colIdx - 1].key
                                    )
                                  }
                                  aria-label="Geser ke kolom sebelumnya"
                                  className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-[11px] font-semibold text-muted-foreground hover:bg-muted disabled:opacity-30"
                                >
                                  <ArrowLeft className="h-3 w-3" aria-hidden="true" />
                                  <span>Mundur</span>
                                </button>

                                <button
                                  type="button"
                                  disabled={colIdx === BOARD_COLUMNS.length - 1}
                                  onClick={() =>
                                    setRoutineStatus(
                                      card.id,
                                      BOARD_COLUMNS[colIdx + 1].key
                                    )
                                  }
                                  aria-label="Geser ke kolom berikutnya"
                                  className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-[11px] font-bold text-primary hover:bg-primary-light disabled:opacity-30"
                                >
                                  <span>Lanjut</span>
                                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                                </button>
                              </div>
                            </article>
                          ))}
                        </div>
                      </div>

                      {/* Trello-style per-column inline card creator */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          addRoutineItem(boardDrafts[col.key], col.key);
                          setBoardDrafts((prev) => ({ ...prev, [col.key]: "" }));
                        }}
                        className="mt-3 flex gap-1.5"
                      >
                        <input
                          type="text"
                          value={boardDrafts[col.key]}
                          onChange={(e) =>
                            setBoardDrafts((prev) => ({
                              ...prev,
                              [col.key]: e.target.value,
                            }))
                          }
                          placeholder="+ Tambah kartu..."
                          className="h-9 min-w-0 flex-1 rounded-xl border border-input bg-card px-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        {boardDrafts[col.key].trim() && (
                          <button
                            type="submit"
                            className="h-9 shrink-0 rounded-xl bg-primary px-3 text-xs font-bold text-primary-foreground"
                          >
                            +
                          </button>
                        )}
                      </form>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Microsoft To Do / Trello Right-side Task Detail Drawer */}
      {detailRoutine && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-routine-title"
          className="fixed inset-0 z-50 flex justify-end bg-black/45 backdrop-blur-[1px]"
          onClick={() => setDetailRoutineId(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-full max-w-md flex-col justify-between overflow-y-auto border-l border-border bg-card p-6 shadow-2xl"
          >
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => toggleComplete(detailRoutine.id)}
                    aria-label="Ubah status selesai"
                    className="text-primary"
                  >
                    {detailRoutine.status === "done" ? (
                      <CheckCircle2 className="h-6 w-6 fill-primary-light" aria-hidden="true" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                    )}
                  </button>
                  <h2
                    id="detail-routine-title"
                    className="font-heading text-lg font-bold text-foreground"
                  >
                    Detail Rutinitas
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setDetailRoutineId(null)}
                  aria-label="Tutup detail"
                  className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-muted"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-muted-foreground">
                  Judul
                </span>
                <input
                  type="text"
                  value={detailRoutine.title}
                  onChange={(e) => updateDetail({ title: e.target.value })}
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-medium text-foreground"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-muted-foreground">
                    Kategori
                  </span>
                  <select
                    value={detailRoutine.category}
                    onChange={(e) => updateDetail({ category: e.target.value })}
                    className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs font-semibold text-foreground"
                  >
                    {lists.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-muted-foreground">
                    Waktu
                  </span>
                  <select
                    value={detailRoutine.timeSlot}
                    onChange={(e) =>
                      updateDetail({ timeSlot: e.target.value as TimeSlot })
                    }
                    className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs font-semibold text-foreground"
                  >
                    {(["Pagi", "Siang", "Malam", "Kapan saja"] as TimeSlot[]).map(
                      (slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      )
                    )}
                  </select>
                </label>
              </div>

              {/* Sub-steps (Microsoft To Do "Add step") */}
              <div className="rounded-2xl bg-surface-soft p-4">
                <p className="mb-2.5 text-xs font-bold text-foreground">
                  Langkah Kecil (Sub-tugas)
                </p>

                <div className="space-y-2">
                  {(detailRoutine.steps ?? []).map((st) => (
                    <div key={st.id} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateDetail({
                            steps: (detailRoutine.steps ?? []).map((x) =>
                              x.id === st.id ? { ...x, done: !x.done } : x
                            ),
                          })
                        }
                        aria-label={`Tandai ${st.text}`}
                        className="text-primary"
                      >
                        {st.done ? (
                          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        )}
                      </button>
                      <span
                        className={`flex-1 text-xs ${
                          st.done
                            ? "text-muted-foreground line-through"
                            : "text-foreground"
                        }`}
                      >
                        {st.text}
                      </span>
                    </div>
                  ))}
                </div>

                <form onSubmit={addDetailStep} className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={newStepText}
                    onChange={(e) => setNewStepText(e.target.value)}
                    placeholder="+ Tambah langkah kecil..."
                    className="h-9 min-w-0 flex-1 rounded-xl border border-input bg-card px-3 text-xs text-foreground"
                  />
                  <button
                    type="submit"
                    className="h-9 rounded-xl bg-primary px-3 text-xs font-bold text-primary-foreground"
                  >
                    Tambah
                  </button>
                </form>
              </div>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-muted-foreground">
                  Catatan
                </span>
                <textarea
                  rows={3}
                  value={detailRoutine.notes ?? ""}
                  onChange={(e) => updateDetail({ notes: e.target.value })}
                  placeholder="Tambahkan catatan pengingat..."
                  className="w-full rounded-xl border border-input bg-background p-3 text-xs text-foreground"
                />
              </label>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <button
                type="button"
                onClick={() => deleteRoutine(detailRoutine.id)}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl px-3 text-xs font-bold text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                <span>Hapus</span>
              </button>

              <button
                type="button"
                onClick={() => setDetailRoutineId(null)}
                className="min-h-[40px] rounded-xl bg-primary px-5 font-heading text-xs font-bold text-primary-foreground"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
