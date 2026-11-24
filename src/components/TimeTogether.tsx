"use client";

import { useEffect, useState } from "react";
import { SITE_CONFIG } from "@/lib/site-config";

function describeDuration(from: Date, to: Date) {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const parts = [];
  if (years > 0) parts.push(`${years} year${years !== 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} month${months !== 1 ? "s" : ""}`);
  if (days > 0 || parts.length === 0) parts.push(`${days} day${days !== 1 ? "s" : ""}`);
  return parts.join(", ");
}

export default function TimeTogether() {
  const [text, setText] = useState("");

  useEffect(() => {
    const start = new Date(SITE_CONFIG.relationshipStart);
    // Computed client-side on purpose: the home page is statically
    // prerendered, so "now" must come from the viewer's clock, not build time.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setText(describeDuration(start, new Date()));
  }, []);

  if (!text) return null;

  return (
    <p className="text-sm tracking-wide text-[var(--ink-muted)] uppercase">
      {text} together, and counting
    </p>
  );
}
