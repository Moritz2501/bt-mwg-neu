import type { Metadata } from "next";
import { Space_Grotesk, Sora } from "next/font/google";
import "./globals.css";

const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });

export const metadata: Metadata = {
  title: "Bühnentechnik-MWG",
  description: "Buehnentechnik Verwaltung"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${space.variable} ${sora.variable}`}>
      <body className="font-[var(--font-space)]">
        <div className="min-h-screen bg-gradient-to-br from-ink via-night-900 to-night-800">
          {children}
          <footer className="mt-12 py-6 text-center text-white text-base">
            Mit Herz <span className="text-red-500 text-xl animate-heart">♥</span> Programmiert von Moritz Döppner
          </footer>
        </div>
      </body>
    </html>
  );
}
