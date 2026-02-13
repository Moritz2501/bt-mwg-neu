"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/stempeln", label: "Stempeln" },
  { href: "/kalender", label: "Kalender" },
  { href: "/events", label: "Events" },
  { href: "/requests", label: "Anfragen" },
  { href: "/profile", label: "Profil" },
  { href: "/admin", label: "Admin" },
  { href: "/admin/users", label: "Benutzer" },
  { href: "/admin/changelog", label: "Changelog", hidden: true },
  { href: "/admin/logs", label: "Audit Log", hidden: true }
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
  const router = useRouter();
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const adminLinks = links.filter((link) => link.href.startsWith("/admin"));

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
        className={`fixed left-0 top-0 h-full w-72 bg-ink/90 border-r border-night-800 p-6 gap-6 z-50 flex flex-col transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
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
            .filter((link) => !link.hidden)
            .filter((link) => (link.href.startsWith("/admin") ? isAdmin : true))
            .map((link) => {
              const isAdminLink = link.href.startsWith("/admin");
              const needsAdminPassword = ["/admin", "/admin/changelog", "/admin/logs"].includes(
                link.href
              );
              const isActive =
                link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(event) => {
                    if (!isAdminLink || !needsAdminPassword) {
                      onClose();
                      return;
                    }
                    event.preventDefault();
                    setAdminError("");
                    setAdminPassword("");
                    setPendingHref(link.href);
                    setShowAdminPrompt(true);
                  }}
                  className={`rounded-xl px-4 py-2 transition ${
                    isActive ? "bg-night-700 text-white shadow-neon" : "text-night-200 hover:bg-night-800"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
        </nav>
      </aside>
      {showAdminPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-ink border border-night-800 rounded-xl p-6 w-full max-w-sm grid gap-4">
            <div className="text-lg font-semibold">Admin Passwort</div>
            <input
              type="password"
              placeholder="Admin Passwort"
              value={adminPassword}
              onChange={(event) => setAdminPassword(event.target.value)}
              autoFocus
              required
            />
            {adminError && <div className="text-red-400 text-sm">{adminError}</div>}
            <div className="flex gap-3 justify-end">
              <button
                className="rounded-pill px-4 py-2 border border-night-600"
                type="button"
                onClick={() => setShowAdminPrompt(false)}
              >
                Abbrechen
              </button>
              <button
                className="rounded-pill px-4 py-2 bg-night-700"
                type="button"
                onClick={async () => {
                  if (!adminPassword.trim()) {
                    setAdminError("Admin Passwort erforderlich");
                    return;
                  }
                  const response = await fetch("/api/admin/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ password: adminPassword })
                  });
                  if (!response.ok) {
                    const data = await response.json();
                    setAdminError(data.message || "Admin Passwort falsch");
                    return;
                  }
                  const target = pendingHref ?? adminLinks[0]?.href ?? "/admin";
                  setShowAdminPrompt(false);
                  onClose();
                  router.push(target);
                }}
              >
                Öffnen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
