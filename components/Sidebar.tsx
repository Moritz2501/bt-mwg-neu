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

export default function Sidebar({
  isAdmin,
  open,
  onClose
}: {
  isAdmin: boolean;
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <button
          className="fixed inset-0 bg-black/60 z-40"
          onClick={onClose}
          aria-label="Menue schliessen"
          type="button"
        />
      )}
      <aside
        className={`fixed right-0 top-0 h-full w-72 bg-ink/90 border-l border-night-800 p-6 gap-6 z-50 flex flex-col transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold text-night-100">Bühnentechnik-MWG</div>
          <button
            onClick={onClose}
            className="rounded-pill px-3 py-1 border border-night-600 text-night-100"
            type="button"
          >
            X
          </button>
        </div>
        <nav className="flex flex-col gap-2">
          {links
            .filter((link) => (link.href.startsWith("/admin") ? isAdmin : true))
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
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
    </>
  );
}
