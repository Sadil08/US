"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PhotoReveal from "@/components/PhotoReveal";

type Props = {
  id: string;
  photoKey: string;
  width: number;
  height: number;
  blurDataUrl: string;
  caption: string | null;
  milestone: string | null;
  takenAt: string; // ISO
  index: number;
};

function toDateInput(iso: string) {
  return iso.slice(0, 10);
}

function prettyDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function PhotoCard(props: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    const res = await fetch(`/api/photos/${props.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        caption: form.get("caption"),
        milestone: form.get("milestone"),
        takenAt: form.get("takenAt"),
      }),
    });
    setBusy(false);
    if (res.ok) {
      setEditing(false);
      router.refresh();
    } else {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Couldn't save that.");
    }
  }

  async function remove() {
    if (!confirm("Delete this photo for good? This can't be undone.")) return;
    setBusy(true);
    setError("");
    const res = await fetch(`/api/photos/${props.id}`, { method: "DELETE" });
    setBusy(false);
    if (res.ok) {
      router.refresh();
    } else {
      setError("Couldn't delete that photo.");
    }
  }

  return (
    <div className="group relative">
      <PhotoReveal
        src={`/api/image/${props.photoKey}`}
        width={props.width}
        height={props.height}
        blurDataUrl={props.blurDataUrl}
        caption={props.caption}
        index={props.index}
      />
      <div className="mt-2 flex items-center justify-between gap-2 px-1 text-sm text-[var(--ink-muted)]">
        <span>{prettyDate(props.takenAt)}</span>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="opacity-80 transition hover:text-[var(--gold)] sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
          >
            ✎ Edit
          </button>
        )}
      </div>

      {editing && (
        <form onSubmit={save} className="card mt-3 flex flex-col gap-3 p-4 text-left">
          <input type="text" name="caption" defaultValue={props.caption ?? ""} placeholder="Caption" />
          <input
            type="text"
            name="milestone"
            defaultValue={props.milestone ?? ""}
            placeholder="Milestone, e.g. 'Our first trip'"
          />
          <label className="text-sm text-[var(--ink-muted)]">
            Date taken
            <input type="date" name="takenAt" defaultValue={toDateInput(props.takenAt)} required />
          </label>
          {error && <p className="text-sm text-[var(--rose)]">{error}</p>}
          <div className="flex flex-wrap gap-2">
            <button type="submit" disabled={busy} className="btn btn-gold">
              {busy ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={() => setEditing(false)} className="btn">
              Cancel
            </button>
            <button
              type="button"
              onClick={remove}
              disabled={busy}
              className="btn ml-auto border-[var(--rose)] text-[var(--rose)]"
            >
              Delete
            </button>
          </div>
        </form>
      )}
      {!editing && error && <p className="mt-1 px-1 text-sm text-[var(--rose)]">{error}</p>}
    </div>
  );
}
