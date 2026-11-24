"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function UploadPhotoForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/photos", { method: "POST", body: formData });

    setLoading(false);
    if (res.ok) {
      formRef.current?.reset();
      setOpen(false);
      router.refresh();
    } else {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Something went wrong uploading that photo.");
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn btn-gold">
        + Add a memory
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="card w-full max-w-md p-6 flex flex-col gap-3 text-left"
    >
      <h3 className="font-display text-xl">Add a photo</h3>
      <input type="file" name="file" accept="image/*" required />
      <input type="text" name="caption" placeholder="Caption (optional)" />
      <input type="text" name="milestone" placeholder="Milestone, e.g. 'Our first trip'" />
      <label className="text-sm text-[var(--ink-muted)]">
        Date taken
        <input type="date" name="takenAt" required />
      </label>
      <select name="uploadedBy" required defaultValue="">
        <option value="" disabled>
          Who&apos;s adding this?
        </option>
        <option value="ME">Me</option>
        <option value="HER">Her</option>
      </select>
      {error && <p className="text-sm text-[var(--rose)]">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="btn btn-gold">
          {loading ? "Uploading..." : "Save memory"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="btn">
          Cancel
        </button>
      </div>
    </form>
  );
}
