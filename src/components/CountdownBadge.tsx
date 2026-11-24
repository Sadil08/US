"use client";

import { useEffect, useState } from "react";

export default function CountdownBadge({ date }: { date: string }) {
  const [text, setText] = useState("");

  useEffect(() => {
    const target = new Date(date);
    const now = new Date();
    const diffDays = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Computed client-side on purpose: the "now" these pages render with
    // must come from the viewer's clock, not server/build time.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (diffDays < 0) setText(`${Math.abs(diffDays)} days ago`);
    else if (diffDays === 0) setText("today!");
    else setText(`in ${diffDays} day${diffDays !== 1 ? "s" : ""}`);
  }, [date]);

  if (!text) return null;

  return (
    <span className="text-xs uppercase tracking-wide text-[var(--gold)] whitespace-nowrap">
      {text}
    </span>
  );
}
