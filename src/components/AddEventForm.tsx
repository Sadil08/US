"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function AddEventForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        date: form.get("date"),
        note: form.get("note") || null,
        isFuture: form.get("isFuture") === "on",
      }),
    });

    setLoading(false);
    if (res.ok) {
      formRef.current?.reset();
      setOpen(false);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Couldn't save that event.");
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn btn-gold">
        + Add an event
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="card w-full max-w-md p-6 flex flex-col gap-3 text-left"
    >
      <h3 className="font-display text-xl">New event</h3>
      <input type="text" name="title" placeholder="e.g. Her birthday" required />
      <input type="date" name="date" required />
      <textarea name="note" placeholder="Note (optional)" rows={3} />
      <label className="flex items-center gap-2 text-sm text-[var(--ink-muted)]">
        <input type="checkbox" name="isFuture" className="w-auto" defaultChecked />
        This is a future / recurring event
      </label>
      {error && <p className="text-sm text-[var(--rose)]">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="btn btn-gold">
          {loading ? "Saving..." : "Save event"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="btn">
          Cancel
        </button>
      </div>
    </form>
  );
}
