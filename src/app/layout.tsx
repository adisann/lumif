import type { Metadata } from "next";
import { Lexend, Poppins } from "next/font/google";
import "./globals.css";
import ThemeInitializer from "@/components/ThemeInitializer";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lumif: Ruang Pemulihan Mandiri",
  description:
    "Pendamping pemulihan kebiasaan dengan check-in harian, latihan pernapasan, modul CBT/ACT, dan komunitas suportif.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${lexend.variable} ${poppins.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh w-full bg-surface-soft font-sans text-foreground">
        <ThemeInitializer />
        <div className="min-h-dvh w-full overflow-x-clip bg-surface-soft">
          {children}
        </div>
      </body>
    </html>
  );
}
