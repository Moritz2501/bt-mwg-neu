"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/stempeln", label: "Stempeln" },
  { href: "/kalender", label: "Kalender" },
  { href: "/events", label: "Events" },
  { href: "/requests", label: "Anfragen" },
  { href: "/profile", label: "Profil" },
  { href: "/admin", label: "Admin" }
];

export default function Sidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-ink/60 border-r border-night-800 p-6 gap-6">
      <div className="text-xl font-semibold text-night-100">Bühnentechnik-MWG</div>
      <nav className="flex flex-col gap-2">
        {links
          .filter((link) => (link.href.startsWith("/admin") ? isAdmin : true))
          .map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-xl px-4 py-2 transition ${
                pathname.startsWith(link.href)
                  ? "bg-night-700 text-white shadow-neon"
                  : "text-night-200 hover:bg-night-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
      </nav>
    </aside>
  );
}
