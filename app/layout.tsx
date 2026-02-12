import type { Metadata } from "next";
import { Space_Grotesk, Sora } from "next/font/google";
import "./globals.css";
import PwaRegister from "@/components/PwaRegister";

const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });

export const metadata: Metadata = {
  title: "Bühnentechnik-MWG",
  description: "Buehnentechnik Verwaltung",
  manifest: "/manifest.webmanifest",
  themeColor: "#1b1a5e",
  icons: {
    icon: ["/icons/icon-192.png", "/icons/icon-512.png"],
    apple: ["/icons/apple-touch-icon.png"]
  },
  appleWebApp: {
    capable: true,
    title: "Bühnentechnik-MWG",
    statusBarStyle: "black-translucent"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${space.variable} ${sora.variable}`}>
      <body className="font-[var(--font-space)]">
        <div className="min-h-screen bg-gradient-to-br from-ink via-night-900 to-night-800">
          <PwaRegister />
          {children}
          <footer className="mt-12 py-6 text-center text-white text-2xl font-semibold">
            Mit <span className="text-red-500 text-xl animate-heart">♥</span> Programmiert von Moritz Döppner
          </footer>
        </div>
      </body>
    </html>
  );
}
