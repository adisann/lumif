"use client";

import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import {
    HiArrowLeft,
    HiArrowRight,
    HiChatBubbleLeftRight,
    HiBolt,
    HiHeart,
    HiPuzzlePiece,
    HiSparkles,
    HiClipboardDocumentCheck,
} from "react-icons/hi2";

type MoreMenuItem = {
    title: string;
    description: string;
    buttonLabel: string;
    icon: React.ReactNode;
    href: string;
};

type MoreMenuSection = {
    title: string;
    items: MoreMenuItem[];
};

const MORE_MENU_SECTIONS: MoreMenuSection[] = [
    {
        title: "Kesadaran Diri",
        items: [
            {
                title: "Curhat ke Komunitas",
                description: "Mengobrol dengan sesama pejuang di komunitas",
                buttonLabel: "Mulai",
                icon: <HiChatBubbleLeftRight className="h-[18px] w-[18px]" />,
                href: "/community",
            },
            {
                title: "Catat Hasrat",
                description: "Rekam intensitas godaan yang kamu rasa.",
                buttonLabel: "Mulai",
                icon: <HiBolt className="h-[18px] w-[18px]" />,
                href: "/urge-log",
            },
        ],
    },
    {
        title: "Tenangkan Pikiran",
        items: [
            {
                title: "Latihan Napas",
                description: "Ambil 2 menit untuk menenangkan diri",
                buttonLabel: "Mulai",
                icon: <HiHeart className="h-[18px] w-[18px]" />,
                href: "/exercises/breathing",
            },
            {
                title: "Meditasi Terpandu",
                description: "Relaksasi 3 menit untuk kendali diri.",
                buttonLabel: "Mulai",
                icon: <HiBolt className="h-[18px] w-[18px]" />,
                href: "/meditation",
            },
        ],
    },
    {
        title: "Alihkan Fokus",
        items: [
            {
                title: "Kuis Pintar",
                description: "Tantang logika dengan pertanyaan seru",
                buttonLabel: "Mainkan",
                icon: <HiHeart className="h-[18px] w-[18px]" />,
                href: "/quiz",
            },
            {
                title: "Game Fokus",
                description: "Main sebentar sampai keinginan hilang",
                buttonLabel: "Mainkan",
                icon: <HiPuzzlePiece className="h-[18px] w-[18px]" />,
                href: "/focus-game",
            },
        ],
    },
    {
        title: "Bangun Kebiasaan",
        items: [
            {
                title: "Rutinitas Harian",
                description: "Checklist kecil untuk menjaga konsistensi",
                buttonLabel: "Buka",
                icon: <HiClipboardDocumentCheck className="h-[18px] w-[18px]" />,
                href: "/routines",
            },
            {
                title: "Permainan",
                description: "Aktivitas ringan untuk mengalihkan pikiran",
                buttonLabel: "Buka",
                icon: <HiSparkles className="h-[18px] w-[18px]" />,
                href: "/games",
            },
        ],
    },
];

function MoreMenuCard({ item }: { item: MoreMenuItem }) {
    const router = useRouter();

    return (
        <article className="flex min-h-[176px] flex-col overflow-hidden rounded-[18px] border border-[#E6E6E6] bg-white shadow-[0px_2px_10px_rgba(0,0,0,0.03)]">
            <button
                type="button"
                onClick={() => router.push(item.href)}
                className="flex flex-1 flex-col items-start px-[12px] pb-[14px] pt-[12px] text-left transition active:scale-[0.99]"
            >
                <div className="mb-[18px] flex h-[32px] w-[32px] items-center justify-center rounded-[7px] bg-[#2D936C] text-white">
                    {item.icon}
                </div>

                <h3 className="font-poppins text-[13px] font-bold leading-[18px] text-black">
                    {item.title}
                </h3>

                <p className="mt-[12px] text-[13px] leading-[18px] text-black">
                    {item.description}
                </p>
            </button>

            <button
                type="button"
                onClick={() => router.push(item.href)}
                className="flex h-[44px] w-full items-center justify-center gap-[4px] bg-[#2D936C] font-poppins text-[14px] font-bold text-white transition active:scale-[0.99]"
            >
                {item.buttonLabel}
                <HiArrowRight className="h-[16px] w-[16px]" />
            </button>
        </article>
    );
}

export default function MoreMenuPage() {
    const router = useRouter();

    return (
        <main className="relative flex h-dvh w-full flex-col overflow-hidden bg-white font-lexend text-black">
            <header className="shrink-0 bg-white px-[24px] pb-[20px] pt-[20px]">
                <div className="flex items-center">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[#E5E5E5] bg-white transition active:scale-95"
                    >
                        <HiArrowLeft className="h-[18px] w-[18px] text-black" />
                    </button>

                    <h1 className="mr-[34px] flex-1 text-center font-poppins text-[20px] font-bold tracking-[-0.4px] text-black">
                        Menu Lainnya
                    </h1>
                </div>
            </header>

            <section className="flex-1 overflow-y-auto px-[24px] pb-[calc(110px+env(safe-area-inset-bottom))] pt-[4px]">
                <div className="flex flex-col gap-[34px]">
                    {MORE_MENU_SECTIONS.map((section) => (
                        <section key={section.title}>
                            <h2 className="mb-[24px] font-poppins text-[15px] font-bold text-black">
                                {section.title}
                            </h2>

                            <div className="grid grid-cols-2 gap-[12px]">
                                {section.items.map((item) => (
                                    <MoreMenuCard key={item.title} item={item} />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </section>

            <BottomNav />
        </main>
    );
}