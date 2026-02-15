"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type RequestItem = {
  id: string;
  requesterName: string;
  eventTitle: string;
  status: string;
  start: string;
};

export default function RequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);

  async function load() {
    const response = await fetch("/api/requests");
    if (response.ok) setRequests(await response.json());
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-semibold">Anfragen</h1>
      <div className="grid gap-3">
        {requests.length === 0 ? (
          <div className="text-night-300 text-3xl font-semibold text-center min-h-[50vh] flex items-center justify-center">Es gibt gerade keine Anfragen.</div>
        ) : (
          requests.map((request) => (
            <Link
              key={request.id}
              href={`/requests/${request.id}`}
              className="border border-night-800 rounded-xl p-4 hover:bg-night-800/50"
            >
              <div className="font-semibold">{request.eventTitle}</div>
              <div className="text-night-300 text-sm">{request.requesterName}</div>
              <div className="text-night-400 text-xs">{request.status}</div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
