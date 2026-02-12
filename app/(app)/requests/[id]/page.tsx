"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Comment = { id: string; text: string; createdAt: string; user: { username: string } };

type RequestDetail = {
  id: string;
  requesterName: string;
  email: string;
  eventTitle: string;
  status: string;
  location: string;
  start: string;
  end: string;
  notes?: string | null;
  comments: Comment[];
};

export default function RequestDetailPage() {
  const params = useParams();
  const requestId = params.id as string;
  const [request, setRequest] = useState<RequestDetail | null>(null);
  const [comment, setComment] = useState("");

  async function load() {
    const response = await fetch(`/api/requests/${requestId}`);
    if (response.ok) setRequest(await response.json());
  }

  useEffect(() => {
    if (requestId) load();
  }, [requestId]);

  async function updateStatus(status: string) {
    await fetch(`/api/requests/${requestId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    load();
  }

  async function addComment(event: React.FormEvent) {
    event.preventDefault();
    await fetch(`/api/requests/${requestId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: comment })
    });
    setComment("");
    load();
  }

  if (!request) return null;

  return (
    <div className="grid gap-6">
      <div className="bg-ink/70 border border-night-800 rounded-xl p-6">
        <h1 className="text-2xl font-semibold">{request.eventTitle}</h1>
        <div className="text-night-300 break-words">
          {request.requesterName} ({request.email})
        </div>
        <div className="text-night-400 text-sm">
          {new Date(request.start).toLocaleString("de-DE")} - {new Date(request.end).toLocaleString("de-DE")}
        </div>
        <div className="text-night-300">Ort: {request.location}</div>
        {request.notes && <div className="text-night-200 mt-2">{request.notes}</div>}
        <div className="flex flex-wrap gap-2 mt-4">
          {[
            { label: "Neu", value: "neu" },
            { label: "Pruefung", value: "in_pruefung" },
            { label: "Angenommen", value: "angenommen" },
            { label: "Abgelehnt", value: "abgelehnt" }
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => updateStatus(item.value)}
              className={`rounded-pill px-3 py-1 border ${
                request.status === item.value ? "bg-night-700" : "border-night-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-ink/70 border border-night-800 rounded-xl p-6">
        <div className="text-night-200 text-sm mb-4">Kommentare</div>
        <ul className="space-y-2">
          {request.comments.map((item) => (
            <li key={item.id} className="border border-night-800 rounded-xl p-3">
              <div className="text-night-300 text-xs">
                {item.user.username} - {new Date(item.createdAt).toLocaleString("de-DE")}
              </div>
              <div>{item.text}</div>
            </li>
          ))}
        </ul>
        <form onSubmit={addComment} className="mt-4 flex flex-col sm:flex-row gap-2">
          <input
            className="flex-1 min-w-0"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Interner Kommentar"
          />
          <button className="rounded-pill px-4 py-2 bg-night-700" type="submit">
            Senden
          </button>
        </form>
      </div>
    </div>
  );
}
