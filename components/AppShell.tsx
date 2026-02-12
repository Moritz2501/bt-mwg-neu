"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

type AppShellProps = {
  username: string;
  isAdmin: boolean;
  children: React.ReactNode;
};

export default function AppShell({ username, isAdmin, children }: AppShellProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      <main className="flex-1 px-6 lg:px-10 py-6">
        <Topbar username={username} onToggleMenu={() => setOpen((prev) => !prev)} />
        <div className="grid gap-6">{children}</div>
      </main>
      <Sidebar isAdmin={isAdmin} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
