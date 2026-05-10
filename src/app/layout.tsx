import type { Metadata } from "next";
import { Lexend, Poppins } from "next/font/google";
import "./globals.css";

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
  title: "Lumif Web App",
  description: "Lumif Mobile App ported to Web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lexend.variable} ${poppins.variable} antialiased bg-neutral-100`}
    >
      <body className="min-h-screen font-sans">
        <div className="max-w-[440px] mx-auto min-h-[100dvh] bg-white relative overflow-x-hidden shadow-2xl ring-1 ring-black/5">
          {children}
        </div>
      </body>
    </html>
  );
}
