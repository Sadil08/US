"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function AddDiaryEntryForm() {
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
    const res = await fetch("/api/diary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        body: form.get("body"),
        entryDate: form.get("entryDate"),
        author: form.get("author"),
      }),
    });

    setLoading(false);
    if (res.ok) {
      formRef.current?.reset();
      setOpen(false);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Couldn't save that entry.");
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn btn-gold">
        + Write an entry
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="card w-full max-w-lg p-6 flex flex-col gap-3 text-left"
    >
      <h3 className="font-display text-xl">New diary entry</h3>
      <input type="text" name="title" placeholder="Title" required />
      <textarea name="body" placeholder="What happened..." rows={6} required />
      <label className="text-sm text-[var(--ink-muted)]">
        Date this is about
        <input type="date" name="entryDate" required />
      </label>
      <select name="author" required defaultValue="">
        <option value="" disabled>
          Who&apos;s writing?
        </option>
        <option value="ME">Me</option>
        <option value="HER">Her</option>
      </select>
      {error && <p className="text-sm text-[var(--rose)]">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="btn btn-gold">
          {loading ? "Saving..." : "Save entry"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="btn">
          Cancel
        </button>
      </div>
    </form>
  );
}
