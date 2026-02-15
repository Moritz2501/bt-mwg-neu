"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type EventItem = {
  id: string;
  name: string;
  start: string;
  status: string;
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);

  async function load() {
    const response = await fetch("/api/events");
    if (response.ok) setEvents(await response.json());
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Events</h1>
        <Link className="rounded-pill px-5 py-2 bg-night-700" href="/events/new">
          Neues Event
        </Link>
      </div>
      <div className="grid gap-3">
        {events.length === 0 ? (
          <div className="text-night-400 text-sm">Es gibt gerade keine Events.</div>
        ) : (
          events.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="border border-night-800 rounded-xl p-4 hover:bg-night-800/50"
            >
              <div className="font-semibold">{event.name}</div>
              <div className="text-night-300 text-sm">
                {new Date(event.start).toLocaleString("de-DE")}
              </div>
              <div className="text-night-400 text-xs">{event.status}</div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
