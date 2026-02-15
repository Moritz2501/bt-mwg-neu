"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type EventDetail = {
  id: string;
  name: string;
  start: string;
  end: string;
  venue: string;
  contact: string;
  status: string;
  notes?: string | null;
  checklist: Array<{ id: string; area: string; text: string; done: boolean }>;
  equipment: Array<{
    id: string;
    itemName: string;
    quantity: number;
    condition: string;
    storageLocation: string;
    reserved: boolean;
  }>;
};

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const [event, setEvent] = useState<EventDetail | null>(null);

  async function load() {
    const response = await fetch(`/api/events/${eventId}`);
    if (response.ok) setEvent(await response.json());
  }

  useEffect(() => {
    if (eventId) load();
  }, [eventId]);

  async function remove() {
    await fetch(`/api/events/${eventId}`, { method: "DELETE" });
    router.push("/events");
  }

  if (!event) return null;

  return (
    <div className="grid gap-6">
      <div className="bg-ink/70 border border-night-800 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{event.name}</h1>
            <div className="text-night-300 text-sm">{event.venue}</div>
          </div>
          <button className="rounded-pill px-4 py-2 border border-night-600" onClick={remove}>
            Löschen
          </button>
        </div>
        <div className="text-night-300 mt-4">
          {new Date(event.start).toLocaleString("de-DE")} - {new Date(event.end).toLocaleString("de-DE")}
        </div>
        <div className="text-night-300">Kontakt: {event.contact}</div>
        <div className="text-night-400 text-sm">Status: {event.status}</div>
        {event.notes && <div className="text-night-200 mt-3">{event.notes}</div>}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-ink/70 border border-night-800 rounded-xl p-6">
          <div className="text-night-200 text-sm mb-4">Checkliste</div>
          <ul className="space-y-2">
            {event.checklist.length === 0 ? (
              <li className="text-night-400 text-sm">Es gibt gerade keine Checkliste.</li>
            ) : (
              event.checklist.map((item) => (
                <li key={item.id} className="border border-night-800 rounded-xl p-3">
                  <div className="text-sm text-night-400">{item.area}</div>
                  <div>{item.text}</div>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="bg-ink/70 border border-night-800 rounded-xl p-6">
          <div className="text-night-200 text-sm mb-4">Equipment</div>
          <ul className="space-y-2">
            {event.equipment.length === 0 ? (
              <li className="text-night-400 text-sm">Es gibt gerade kein Equipment.</li>
            ) : (
              event.equipment.map((item) => (
                <li key={item.id} className="border border-night-800 rounded-xl p-3">
                  <div className="font-semibold">{item.itemName}</div>
                  <div className="text-night-300 text-sm">
                    Menge: {item.quantity} | Zustand: {item.condition}
                  </div>
                  <div className="text-night-400 text-xs">Lager: {item.storageLocation}</div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
