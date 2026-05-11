"use client";

import { useMemo, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import {
    HiArrowTrendingUp,
    HiCalendarDays,
    HiChartBar,
    HiCheckCircle,
} from "react-icons/hi2";

type CheckInDatum = {
    month: string;
    stress: number;
    tenang: number;
    catatan: string;
};

type ModuleDatum = {
    id: number;
    title: string;
    progress: number;
    status: "selesai" | "berjalan" | "belum";
    lastActivity: string;
};

type RoutineDatum = {
    day: string;
    completed: number;
    target: number;
    detail: string;
};

const DUMMY_CHECKIN_DATA: CheckInDatum[] = [
    {
        month: "Jan",
        stress: 8,
        tenang: 6,
        catatan: "Dorongan masih sering muncul, tapi kamu mulai mengenali trigger.",
    },
    {
        month: "Feb",
        stress: 8,
        tenang: 6,
        catatan: "Pola stress masih tinggi, namun check-in mulai lebih konsisten.",
    },
    {
        month: "Mar",
        stress: 10,
        tenang: 9,
        catatan: "Bulan paling aktif. Kamu sering check-in dan mulai memakai teknik tenang.",
    },
    {
        month: "Apr",
        stress: 6,
        tenang: 4,
        catatan: "Dorongan mulai turun. Perlu jaga rutinitas agar stabil.",
    },
];

const DUMMY_MODULE_DATA: ModuleDatum[] = [
    {
        id: 1,
        title: "Bab 1",
        progress: 95,
        status: "selesai",
        lastActivity: "Hampir selesai. Tinggal evaluasi akhir.",
    },
    {
        id: 2,
        title: "Bab 2",
        progress: 12,
        status: "berjalan",
        lastActivity: "Baru mulai. Lanjutkan 1 materi kecil hari ini.",
    },
    {
        id: 3,
        title: "Bab 3",
        progress: 0,
        status: "belum",
        lastActivity: "Belum dibuka.",
    },
    {
        id: 4,
        title: "Bab 4",
        progress: 0,
        status: "belum",
        lastActivity: "Belum dibuka.",
    },
];

const DUMMY_ROUTINE_DATA: RoutineDatum[] = [
    {
        day: "sen",
        completed: 4,
        target: 4,
        detail: "Rutinitas sangat baik. Semua target selesai.",
    },
    {
        day: "sel",
        completed: 1,
        target: 4,
        detail: "Hari cukup berat. Minimal kamu tetap hadir.",
    },
    {
        day: "rab",
        completed: 2,
        target: 4,
        detail: "Setengah target selesai. Ada progres kecil.",
    },
    {
        day: "kam",
        completed: 1,
        target: 4,
        detail: "Belum stabil. Bisa mulai dari satu aksi kecil.",
    },
    {
        day: "jum",
        completed: 3,
        target: 4,
        detail: "Bagus. Hampir semua rutinitas selesai.",
    },
    {
        day: "sab",
        completed: 1,
        target: 4,
        detail: "Aktivitas rendah, tapi tidak kosong.",
    },
    {
        day: "min",
        completed: 3,
        target: 4,
        detail: "Akhir minggu cukup stabil.",
    },
];

type MonthlyStat = {
    month: string;
    stress: number;
    calm: number;
    note?: string;
};

function CustomTooltip({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: any[];
    label?: string;
}) {
    if (!active || !payload || payload.length === 0) return null;

    return (
        <div className="max-w-[220px] rounded-[16px] border border-[#ECEEF2] bg-white px-[14px] py-[12px] shadow-[0px_8px_24px_rgba(0,0,0,0.14)]">
            <p className="mb-[6px] font-poppins text-[13px] font-bold text-[#202124]">
                {label}
            </p>

            <div className="space-y-[4px]">
                {payload.map((item) => (
                    <div key={item.dataKey} className="flex items-center justify-between gap-[18px]">
                        <div className="flex items-center gap-[6px]">
                            <span
                                className="h-[8px] w-[8px] rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <p className="text-[11px] capitalize text-[#6F7280]">
                                {item.name}
                            </p>
                        </div>
                        <p className="text-[11px] font-bold text-[#28293D]">
                            {item.value}
                        </p>
                    </div>
                ))}
            </div>

            {payload[0]?.payload?.catatan && (
                <p className="mt-[8px] text-[11px] leading-[16px] text-[#6F7280]">
                    {payload[0].payload.catatan}
                </p>
            )}

            {payload[0]?.payload?.detail && (
                <p className="mt-[8px] text-[11px] leading-[16px] text-[#6F7280]">
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
        <div className="mb-[18px] flex items-start justify-between gap-[12px]">
            <div className="flex items-start gap-[10px]">
                <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[14px] bg-[#E8F5EF] text-[#1B8E5A]">
                    {icon}
                </div>

                <div>
                    <p className="text-[13px] font-medium leading-none text-[#9A9AAF]">
                        {eyebrow}
                    </p>
                    <h3 className="mt-[5px] font-poppins text-[17px] font-bold leading-none text-[#28293D]">
                        {title}
                    </h3>
                </div>
            </div>

            {rightLabel && (
                <p className="rounded-full bg-[#FFF3DF] px-[10px] py-[6px] text-[11px] font-bold text-[#FF8A00]">
                    {rightLabel}
                </p>
            )}
        </div>
    );
}

function InsightCard({ children }: { children: React.ReactNode }) {
    return (
        <section className="rounded-[24px] border border-[#F0F0F0] bg-white p-[20px] shadow-[0px_4px_18px_rgba(0,0,0,0.08)]">
            {children}
        </section>
    );
}

export function CheckInTrendChart() {
    const [selectedMonth, setSelectedMonth] = useState<CheckInDatum>(
        DUMMY_CHECKIN_DATA[DUMMY_CHECKIN_DATA.length - 1]
    );

    const averageStress = useMemo(() => {
        const total = DUMMY_CHECKIN_DATA.reduce((sum, item) => sum + item.stress, 0);
        return (total / DUMMY_CHECKIN_DATA.length).toFixed(1);
    }, []);

    return (
        <InsightCard>
            <SectionHeader
                icon={<HiArrowTrendingUp className="h-[20px] w-[20px]" />}
                eyebrow="Statistik Check-in"
                title="Dorongan Muncul"
                rightLabel={`Avg ${averageStress}`}
            />

            <div className="mb-[12px] flex items-center justify-end gap-[12px]">
                <div className="flex items-center gap-[6px]">
                    <span className="h-[10px] w-[10px] rounded-full bg-[#FF7A00]" />
                    <p className="text-[12px] text-[#676A7D]">Stress</p>
                </div>

                <div className="flex items-center gap-[6px]">
                    <span className="h-[10px] w-[10px] rounded-full bg-[#FFC766]" />
                    <p className="text-[12px] text-[#676A7D]">Tenang</p>
                </div>
            </div>

            <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={DUMMY_CHECKIN_DATA}
                        barGap={8}
                        barCategoryGap={22}
                        onClick={(state) => {
                            const chartState = state as unknown as {
                                activePayload?: Array<{
                                    payload?: MonthlyStat;
                                }>;
                            };

                            const payload = chartState.activePayload?.[0]?.payload;

                            if (payload) {
                                setSelectedMonth(payload);
                            }
                        }}
                    >
                        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E4E7EF" />
                        <XAxis
                            dataKey="month"
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
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(27,142,90,0.06)" }} />
                        <Bar name="Stress" dataKey="stress" radius={[6, 6, 0, 0]} fill="#FF7A00" />
                        <Bar name="Tenang" dataKey="tenang" radius={[6, 6, 0, 0]} fill="#FFC766" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <button
                type="button"
                className="mt-[14px] w-full rounded-[18px] bg-[#F7F8FA] px-[14px] py-[12px] text-left active:scale-[0.99]"
            >
                <p className="font-poppins text-[12px] font-bold text-[#28293D]">
                    Detail {selectedMonth.month}
                </p>
                <p className="mt-[4px] text-[11px] leading-[17px] text-[#6F7280]">
                    Stress: <span className="font-bold">{selectedMonth.stress}</span>, Tenang:{" "}
                    <span className="font-bold">{selectedMonth.tenang}</span>.{" "}
                    {selectedMonth.catatan}
                </p>
            </button>
        </InsightCard>
    );
}

export function ModuleProgressChart() {
    const [selectedModule, setSelectedModule] = useState<ModuleDatum>(
        DUMMY_MODULE_DATA[0]
    );

    const completedModules = DUMMY_MODULE_DATA.filter(
        (item) => item.progress >= 90
    ).length;

    return (
        <InsightCard>
            <SectionHeader
                icon={<HiCheckCircle className="h-[20px] w-[20px]" />}
                eyebrow="Pembelajaran"
                title="Progres Modul (%)"
                rightLabel={`${completedModules}/${DUMMY_MODULE_DATA.length} selesai`}
            />

            <div className="space-y-[14px]">
                {DUMMY_MODULE_DATA.map((item) => {
                    const isSelected = selectedModule.id === item.id;

                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setSelectedModule(item)}
                            className={`w-full rounded-[16px] px-[12px] py-[10px] text-left transition active:scale-[0.99] ${isSelected ? "bg-[#E8F5EF]" : "bg-[#FAFAFA]"
                                }`}
                        >
                            <div className="mb-[7px] flex items-center justify-between">
                                <div>
                                    <p className="font-poppins text-[12px] font-bold text-[#28293D]">
                                        {item.title}
                                    </p>
                                    <p className="mt-[2px] text-[10px] capitalize text-[#8B8FA0]">
                                        {item.status}
                                    </p>
                                </div>

                                <p className="font-poppins text-[12px] font-bold text-[#28293D]">
                                    {item.progress}%
                                </p>
                            </div>

                            <div className="h-[12px] overflow-hidden rounded-full bg-[#EEF0F5]">
                                <div
                                    className="h-full rounded-full bg-[#FFB238] transition-all duration-500"
                                    style={{ width: `${item.progress}%` }}
                                />
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="mt-[14px] rounded-[18px] bg-[#F7F8FA] px-[14px] py-[12px]">
                <p className="font-poppins text-[12px] font-bold text-[#28293D]">
                    {selectedModule.title}
                </p>
                <p className="mt-[4px] text-[11px] leading-[17px] text-[#6F7280]">
                    {selectedModule.lastActivity}
                </p>
            </div>
        </InsightCard>
    );
}

export function RoutineCompletionChart() {
    const [selectedRoutine, setSelectedRoutine] = useState<RoutineDatum>(
        DUMMY_ROUTINE_DATA[4]
    );

    const averageRoutine = useMemo(() => {
        const total = DUMMY_ROUTINE_DATA.reduce((sum, item) => sum + item.completed, 0);
        return (total / DUMMY_ROUTINE_DATA.length).toFixed(2);
    }, []);

    return (
        <InsightCard>
            <SectionHeader
                icon={<HiCalendarDays className="h-[20px] w-[20px]" />}
                eyebrow="Rata-Rata Penyelesaian Rutinitas"
                title={`${averageRoutine} rutinitas`}
                rightLabel="Mingguan"
            />

            <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={DUMMY_ROUTINE_DATA}
                        margin={{ top: 16, right: 8, left: -16, bottom: 0 }}
                        onClick={(state) => {
                            if (state?.activePayload?.[0]?.payload) {
                                setSelectedRoutine(state.activePayload[0].payload);
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
                            domain={[0, 4]}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#1B8E5A", strokeDasharray: "4 4" }} />
                        <Line
                            name="Rutinitas selesai"
                            type="monotone"
                            dataKey="completed"
                            stroke="#FFB238"
                            strokeWidth={4}
                            dot={({ cx, cy, payload }) => {
                                const isSelected = payload.day === selectedRoutine.day;

                                return (
                                    <circle
                                        cx={cx}
                                        cy={cy}
                                        r={isSelected ? 7 : 5}
                                        fill={isSelected ? "#1B8E5A" : "#FFB238"}
                                        stroke="#FFFFFF"
                                        strokeWidth={3}
                                    />
                                );
                            }}
                            activeDot={{
                                r: 8,
                                fill: "#1B8E5A",
                                stroke: "#FFFFFF",
                                strokeWidth: 3,
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-[14px] rounded-[18px] bg-[#F7F8FA] px-[14px] py-[12px]">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-poppins text-[12px] font-bold text-[#28293D]">
                            Hari {selectedRoutine.day}
                        </p>
                        <p className="mt-[4px] text-[11px] leading-[17px] text-[#6F7280]">
                            {selectedRoutine.detail}
                        </p>
                    </div>

                    <div className="ml-[12px] flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-[#FFF3DF]">
                        <p className="font-poppins text-[15px] font-bold text-[#FF8A00]">
                            {selectedRoutine.completed}/{selectedRoutine.target}
                        </p>
                    </div>
                </div>
            </div>
        </InsightCard>
    );
}

export default function InteractiveInsightCharts() {
    const [activeTab, setActiveTab] = useState<"checkin" | "module" | "routine">(
        "checkin"
    );

    const tabs = [
        {
            id: "checkin",
            label: "Check-in",
            icon: <HiChartBar className="h-[16px] w-[16px]" />,
        },
        {
            id: "module",
            label: "Modul",
            icon: <HiCheckCircle className="h-[16px] w-[16px]" />,
        },
        {
            id: "routine",
            label: "Rutinitas",
            icon: <HiCalendarDays className="h-[16px] w-[16px]" />,
        },
    ] as const;

    return (
        <div className="space-y-[18px]">
            <div className="grid grid-cols-3 gap-[8px]">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center justify-center gap-[6px] rounded-[16px] px-[10px] py-[10px] font-poppins text-[11px] font-bold transition active:scale-95 ${isActive
                                ? "bg-[#1B8E5A] text-white shadow-[0px_8px_18px_rgba(27,142,90,0.24)]"
                                : "bg-white text-[#8B8FA0] shadow-[0px_3px_14px_rgba(0,0,0,0.06)]"
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {activeTab === "checkin" && <CheckInTrendChart />}
            {activeTab === "module" && <ModuleProgressChart />}
            {activeTab === "routine" && <RoutineCompletionChart />}
        </div>
    );
}