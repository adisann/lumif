"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, Calendar, CheckCircle2, TrendingUp } from "lucide-react";

const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export type CheckInDatum = {
  label: string;
  stress: number;
  tenang: number;
  count: number;
  catatan: string;
};

export type ModuleDatum = {
  id: string;
  title: string;
  progress: number;
  status: "selesai" | "berjalan" | "belum";
  lastActivity: string;
};

export type RoutineDatum = {
  day: string;
  completed: number;
  target: number;
  detail: string;
};

type RechartsClickState<T> = {
  activePayload?: Array<{
    payload?: T;
  }>;
};

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    dataKey?: string | number;
    name?: string | number;
    value?: string | number;
    color?: string;
    payload?: {
      catatan?: string;
      detail?: string;
    };
  }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="max-w-[220px] rounded-2xl border border-border bg-card px-3.5 py-3 text-card-foreground shadow-lg">
      <p className="mb-1.5 font-heading text-xs font-bold text-foreground">
        {label}
      </p>

      <div className="space-y-1">
        {payload.map((item) => (
          <div
            key={String(item.dataKey ?? item.name)}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color ?? "#2D936C" }}
              />
              <p className="text-[11px] capitalize text-muted-foreground">
                {item.name}
              </p>
            </div>
            <p className="text-[11px] font-bold text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      {payload[0]?.payload?.catatan && (
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          {payload[0].payload.catatan}
        </p>
      )}

      {payload[0]?.payload?.detail && (
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          {payload[0].payload.detail}
        </p>
      )}
    </div>
  );
}

function SectionHeader({
  icon,
  eyebrow,
  title,
  rightLabel,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  rightLabel?: string;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex items-start gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
          {icon}
        </div>

        <div>
          <p className="text-xs font-medium leading-none text-muted-foreground">
            {eyebrow}
          </p>
          <h3 className="mt-1 font-heading text-base font-bold leading-none text-card-foreground">
            {title}
          </h3>
        </div>
      </div>

      {rightLabel && (
        <p className="rounded-full bg-[#FFF3DF] px-2.5 py-1 text-[11px] font-bold text-brand-orange-ink dark:bg-amber-950/50">
          {rightLabel}
        </p>
      )}
    </div>
  );
}

function InsightCard({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-xs">
      {children}
    </section>
  );
}

export function CheckInTrendChart({
  data,
  isAuthenticated,
}: {
  data: CheckInDatum[];
  isAuthenticated: boolean;
}) {
  const isClient = useIsClient();
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const activeDatum = useMemo(() => {
    if (data.length === 0) return null;
    if (selectedLabel) {
      const found = data.find((item) => item.label === selectedLabel);
      if (found) return found;
    }
    return data[data.length - 1];
  }, [data, selectedLabel]);

  const averageUrge = useMemo(() => {
    if (data.length === 0) return "0.0";
    const total = data.reduce((sum, item) => sum + item.stress, 0);
    return (total / data.length).toFixed(1);
  }, [data]);

  return (
    <InsightCard>
      <SectionHeader
        icon={<TrendingUp className="h-5 w-5" aria-hidden="true" />}
        eyebrow={isAuthenticated ? "Statistik Check-in Nyata" : "Statistik Check-in (Demo)"}
        title="Dorongan & Ketenangan"
        rightLabel={data.length > 0 ? `Rata-rata ${averageUrge}` : "Belum ada data"}
      />

      {data.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface-soft/60 px-5 py-10 text-center">
          <p className="font-heading text-sm font-bold text-foreground">
            Belum ada check-in yang tercatat
          </p>
          <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
            Setelah kamu mengisi Evaluasi Harian atau Catat Hasrat, grafik tren intensitas dorongan dan suasana tenangmu akan muncul di sini secara otomatis.
          </p>
          <Link
            href="/urge-log"
            className="mt-4 inline-flex min-h-[40px] items-center rounded-xl bg-primary px-4 font-heading text-xs font-bold text-primary-foreground hover:bg-primary-dark"
          >
            Catat Check-in Pertama
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-3 flex items-center justify-end gap-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF8200]" />
              <p className="text-xs text-muted-foreground">Intensitas Dorongan</p>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#EDBF45]" />
              <p className="text-xs text-muted-foreground">Skor Tenang</p>
            </div>
          </div>

          <div className="h-[220px] w-full">
            {isClient ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
                <BarChart
                  data={data}
                  barGap={8}
                  barCategoryGap={22}
                  onClick={(state) => {
                    const chartState = state as unknown as RechartsClickState<CheckInDatum>;
                    const payload = chartState.activePayload?.[0]?.payload;
                    if (payload) {
                      setSelectedLabel(payload.label);
                    }
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="4 4"
                    vertical={false}
                    stroke="#E4E7EF"
                  />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#676A7D" }}
                  />
                  <YAxis
                    width={24}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "#73758A" }}
                    domain={[0, 10]}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(45,147,108,0.08)" }}
                  />
                  <Bar
                    name="Dorongan"
                    dataKey="stress"
                    radius={[6, 6, 0, 0]}
                    fill="#FF8200"
                  />
                  <Bar
                    name="Tenang"
                    dataKey="tenang"
                    radius={[6, 6, 0, 0]}
                    fill="#EDBF45"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full animate-pulse rounded-2xl bg-muted/60" />
            )}
          </div>

          {activeDatum && (
            <div className="mt-3.5 rounded-2xl bg-surface-soft px-3.5 py-3 text-left">
              <p className="font-heading text-xs font-bold text-foreground">
                Detail {activeDatum.label} ({activeDatum.count} check-in)
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Dorongan: <span className="font-bold">{activeDatum.stress}/10</span>, Tenang:{" "}
                <span className="font-bold">{activeDatum.tenang}/10</span>.{" "}
                {activeDatum.catatan}
              </p>
            </div>
          )}
        </>
      )}
    </InsightCard>
  );
}

export function ModuleProgressChart({ data }: { data: ModuleDatum[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedModule = useMemo(() => {
    if (data.length === 0) return null;
    if (selectedId) {
      const found = data.find((m) => m.id === selectedId);
      if (found) return found;
    }
    return data[0];
  }, [data, selectedId]);

  const completedModules = data.filter((item) => item.progress >= 100).length;

  return (
    <InsightCard>
      <SectionHeader
        icon={<CheckCircle2 className="h-5 w-5" aria-hidden="true" />}
        eyebrow="Pembelajaran CBT & ACT"
        title="Progres Modul (%)"
        rightLabel={`${completedModules}/${data.length} selesai`}
      />

      <div className="space-y-2.5">
        {data.map((item) => {
          const isSelected = selectedModule?.id === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={`w-full rounded-2xl px-3.5 py-2.5 text-left transition active:scale-[0.99] ${
                isSelected ? "bg-primary-light/70" : "bg-surface-soft/70 hover:bg-surface-soft"
              }`}
            >
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-heading text-xs font-bold text-foreground">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[10px] capitalize text-muted-foreground">
                    {item.status}
                  </p>
                </div>

                <p className="font-heading text-xs font-bold text-foreground">
                  {item.progress}%
                </p>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {selectedModule && (
        <div className="mt-3.5 rounded-2xl bg-surface-soft px-3.5 py-3">
          <p className="font-heading text-xs font-bold text-foreground">
            {selectedModule.title}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {selectedModule.lastActivity}
          </p>
        </div>
      )}
    </InsightCard>
  );
}

export function RoutineCompletionChart({ data }: { data: RoutineDatum[] }) {
  const isClient = useIsClient();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const activeRoutine = useMemo(() => {
    if (data.length === 0) return null;
    if (selectedDay) {
      const found = data.find((r) => r.day === selectedDay);
      if (found) return found;
    }
    return data[data.length - 1];
  }, [data, selectedDay]);

  const maxTarget = useMemo(() => {
    const highest = Math.max(3, ...data.map((d) => Math.max(d.target, d.completed)));
    return highest;
  }, [data]);

  const averageRoutine = useMemo(() => {
    if (data.length === 0) return "0.0";
    const total = data.reduce((sum, item) => sum + item.completed, 0);
    return (total / data.length).toFixed(1);
  }, [data]);

  return (
    <InsightCard>
      <SectionHeader
        icon={<Calendar className="h-5 w-5" aria-hidden="true" />}
        eyebrow="Rata-Rata Misi & Rutinitas Harian"
        title={`${averageRoutine} selesai/hari`}
        rightLabel="Minggu Ini"
      />

      <div className="h-[220px] w-full">
        {isClient ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
            <LineChart
              data={data}
              margin={{ top: 16, right: 8, left: -16, bottom: 0 }}
              onClick={(state) => {
                const chartState = state as unknown as RechartsClickState<RoutineDatum>;
                const payload = chartState.activePayload?.[0]?.payload;
                if (payload) {
                  setSelectedDay(payload.day);
                }
              }}
            >
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E4E7EF" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "#676A7D" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#73758A" }}
                domain={[0, maxTarget]}
                allowDecimals={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "#2D936C", strokeDasharray: "4 4" }}
              />
              <Line
                name="Selesai"
                type="monotone"
                dataKey="completed"
                stroke="#FF8200"
                strokeWidth={3.5}
                dot={({ cx, cy, payload }) => {
                  const isSelected = payload.day === activeRoutine?.day;
                  return (
                    <circle
                      key={payload.day}
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 7 : 5}
                      fill={isSelected ? "#2D936C" : "#FF8200"}
                      stroke="#FFFFFF"
                      strokeWidth={2.5}
                    />
                  );
                }}
                activeDot={{
                  r: 8,
                  fill: "#2D936C",
                  stroke: "#FFFFFF",
                  strokeWidth: 2.5,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full animate-pulse rounded-2xl bg-muted/60" />
        )}
      </div>

      {activeRoutine && (
        <div className="mt-3.5 rounded-2xl bg-surface-soft px-3.5 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-heading text-xs font-bold text-foreground">
                Hari {activeRoutine.day}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {activeRoutine.detail}
              </p>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF3DF] dark:bg-amber-950/50">
              <p className="font-heading text-sm font-bold text-brand-orange-ink">
                {activeRoutine.completed}/{activeRoutine.target}
              </p>
            </div>
          </div>
        </div>
      )}
    </InsightCard>
  );
}

export default function InteractiveInsightCharts({
  checkInData,
  moduleData,
  routineData,
  isAuthenticated,
}: {
  checkInData: CheckInDatum[];
  moduleData: ModuleDatum[];
  routineData: RoutineDatum[];
  isAuthenticated: boolean;
}) {
  const [activeTab, setActiveTab] = useState<"checkin" | "module" | "routine">(
    "checkin"
  );

  const tabs = [
    {
      id: "checkin",
      label: "Check-in",
      icon: <BarChart3 className="h-4 w-4" aria-hidden="true" />,
    },
    {
      id: "module",
      label: "Modul",
      icon: <CheckCircle2 className="h-4 w-4" aria-hidden="true" />,
    },
    {
      id: "routine",
      label: "Rutinitas",
      icon: <Calendar className="h-4 w-4" aria-hidden="true" />,
    },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex min-h-[42px] items-center justify-center gap-1.5 rounded-2xl px-2.5 py-2.5 font-heading text-xs font-bold transition active:scale-95 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === "checkin" && (
        <CheckInTrendChart data={checkInData} isAuthenticated={isAuthenticated} />
      )}
      {activeTab === "module" && <ModuleProgressChart data={moduleData} />}
      {activeTab === "routine" && <RoutineCompletionChart data={routineData} />}
    </div>
  );
}
