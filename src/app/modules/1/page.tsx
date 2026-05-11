"use client";

import { useRouter } from "next/navigation";
import { HiArrowLeft } from "react-icons/hi2";

const LESSONS = [
  {
    title: "Pelajaran 1: Apa Itu CBT & ACT?",
    content:
      "Cognitive Behavioral Therapy (CBT) dan Acceptance & Commitment Therapy (ACT) adalah dua pendekatan terapeutik berbasis bukti yang telah terbukti efektif dalam mengatasi berbagai pola kebiasaan buruk. CBT berfokus pada mengidentifikasi dan mengubah pola pikir negatif, sedangkan ACT membantu kamu menerima pikiran tanpa harus menuruti dorongan tersebut.",
  },
  {
    title: "Pelajaran 2: Mengapa Modul Ini Penting?",
    content:
      "Memahami dasar-dasar terapi ini memberimu kerangka berpikir yang lebih kuat. Kamu akan belajar bahwa pemulihan bukan tentang menghindari pikiran buruk, melainkan tentang mengubah cara kamu merespons pikiran tersebut. Modul ini adalah fondasi dari seluruh perjalanan pemulihanmu.",
  },
  {
    title: "Pelajaran 3: Prinsip Dasar CBT",
    content:
      "CBT didasarkan pada tiga prinsip: pertama, pikiran mempengaruhi perasaan; kedua, perasaan mempengaruhi perilaku; ketiga, kamu bisa mengubah perilaku dengan mengubah pola pikir. Dalam konteks pemulihan, ini berarti kamu dapat melatih otakmu untuk merespons dorongan dengan cara yang lebih sehat.",
  },
  {
    title: "Pelajaran 4: Prinsip Dasar ACT",
    content:
      "ACT mengajarkan enam prinsip inti: penerimaan, defusi kognitif, kontak dengan momen saat ini, diri sebagai konteks, nilai-nilai, dan tindakan berkomitmen. Alih-alih melawan pikiran yang tidak diinginkan, ACT mengajarkanmu untuk mengamatinya tanpa penilaian dan kemudian memilih tindakan yang selaras dengan nilai-nilaimu.",
  },
  {
    title: "Pelajaran 5: Bagaimana Ini Membantu Kebiasaanmu?",
    content:
      "Proses pemulihan atau membentuk kebiasaan baru jarang ada yang mulus 100%. Pasti ada kalanya kita tersandung. Modul ini hadir bukan untuk membuatmu menjadi sempurna, melainkan memberimu bekal agar kamu tahu cara bangkit lagi tanpa perlu menyalahkan diri sendiri. Setiap langkah kecil yang kamu ambil di sini sangat berarti.",
  },
  {
    title: "Pelajaran 6: Langkah Pertamamu",
    content:
      "Kamu sudah menyelesaikan pengenalan awalnya! Langkah selanjutnya ada di tanganmu. Ingat, proses ini adalah lari maraton, bukan lari cepat. Gunakan modul ini sesuai dengan kecepatan dan kenyamananmu. Saat kamu siap untuk bab selanjutnya, kami akan ada di sini menemanimu. Tarik napas dalam-dalam, dan mari kita mulai perjalanan ini.",
  },
];

export default function ModuleBab1Screen() {
  const router = useRouter();

  return (
    <main className="relative flex h-dvh w-full flex-col overflow-hidden bg-[#FAFAFA] font-lexend text-black">
      {/* Top Nav */}
      <header className="shrink-0 bg-white px-[24px] pb-[18px] pt-[20px]">
        <div className="grid grid-cols-[44px_1fr_44px] items-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-[40px] w-[40px] items-center justify-center rounded-[12px] border border-[#E5E7EB] bg-white text-black shadow-sm transition active:scale-95"
            aria-label="Kembali"
          >
            <HiArrowLeft className="h-[18px] w-[18px]" />
          </button>

          <h1 className="text-center font-poppins text-[16px] font-bold leading-[22px] tracking-[-0.3px] text-black">
            Bab 1: Pengenalan CBT & ACT
          </h1>

          <div aria-hidden="true" />
        </div>
      </header>

      <section className="flex-1 overflow-y-auto px-[24px] pb-[calc(40px+env(safe-area-inset-bottom))] pt-[24px]">
        <div className="mb-[22px] rounded-[24px] bg-[#2D936C] px-[20px] py-[22px] text-white shadow-[0px_10px_24px_rgba(45,147,108,0.18)]">
          <p className="font-poppins text-[13px] font-bold text-white/75">
            Modul 1
          </p>

          <h2 className="mt-[6px] font-poppins text-[22px] font-bold leading-[30px] tracking-[-0.5px]">
            Pengenalan CBT & ACT
          </h2>

          <p className="mt-[8px] text-[13px] leading-[20px] text-white/80">
            Pahami dasar pola pikir, dorongan, dan cara merespons kebiasaan
            secara lebih sehat.
          </p>
        </div>

        {/* Lessons */}
        <div className="flex flex-col gap-[14px]">
          {LESSONS.map((lesson, idx) => (
            <article
              key={idx}
              className="animate-fadeInUp rounded-[20px] border border-[#F1F5F9] bg-white px-[16px] py-[16px] shadow-sm"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="mb-[10px] flex items-center gap-[10px]">
                <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[#E7F3EF] font-poppins text-[13px] font-bold text-[#2D936C]">
                  {idx + 1}
                </div>

                <h3 className="font-poppins text-[14px] font-bold leading-[20px] text-black">
                  {lesson.title}
                </h3>
              </div>

              <p className="text-[13px] leading-[22px] text-[#444]">
                {lesson.content}
              </p>
            </article>
          ))}
        </div>

        {/* Mark Complete Button */}
        <div className="mt-[28px]">
          <button
            type="button"
            onClick={() => router.back()}
            className="h-[52px] w-full rounded-[14px] bg-[#2D936C] font-poppins text-[15px] font-bold text-white shadow-[0px_10px_24px_rgba(45,147,108,0.18)] transition hover:bg-[#257B5A] active:scale-[0.98]"
          >
            Selesai Membaca ✓
          </button>
        </div>
      </section>
    </main>
  );
}