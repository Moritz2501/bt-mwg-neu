import { ReactNode } from "react";

export default function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="bg-ink/70 border border-night-800 rounded-xl p-6 shadow">
      <h2 className="text-lg font-semibold mb-4 text-night-100">{title}</h2>
      {children}
    </section>
  );
}
