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
    <div className="bg-[#FAFAFA] relative h-full w-full flex flex-col font-lexend overflow-hidden">

      {/* Top Nav */}
      <div className="flex items-center px-[24px] pt-[20px] pb-[16px] shrink-0 bg-white border-b border-[#e5e5e5]">
        <button
          onClick={() => router.back()}
          className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px] bg-white border border-[#e5e5e5]"
        >
          <HiArrowLeft className="h-[16px] w-[16px] text-black" />
        </button>
        <h1 className="flex-1 text-center font-poppins text-[16px] font-bold text-black tracking-[-0.32px] mr-[32px]">
          Bab 1: Pengenalan CBT & ACT
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-[24px] pt-[24px] pb-[40px]">
        {/* Lessons */}
        <div className="flex flex-col gap-[24px]">
          {LESSONS.map((lesson, idx) => (
            <div
              key={idx}
              className="animate-fadeInUp"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <h3 className="font-poppins font-bold text-[14px] text-black mb-[8px]">
                {lesson.title}
              </h3>
              <p className="text-[13px] text-[#444] leading-[1.7]">
                {lesson.content}
              </p>
            </div>
          ))}
        </div>

        {/* Mark Complete Button */}
        <div className="mt-[32px]">
          <button
            onClick={() => router.back()}
            className="w-full bg-[#2D936C] text-white h-[48px] rounded-[12px] font-poppins font-bold text-[14px] hover:bg-[#257B5A] transition-colors active:scale-[0.98]"
          >
            Selesai Membaca ✓
          </button>
        </div>
      </div>
    </div>
  );
}
