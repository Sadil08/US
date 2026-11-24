"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/bouquet", label: "The Bouquet" },
  { href: "/memory-lane", label: "Memory Lane" },
  { href: "/diary", label: "Diary" },
  { href: "/future", label: "Future" },
];

export default function Nav() {
  const pathname = usePathname();

  if (pathname === "/gate") return null;

  return (
    <nav className="sticky top-0 z-50 flex justify-center px-4 py-4">
      <div className="card flex gap-1 px-2 py-1.5">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "rounded-full px-3 py-1.5 text-sm transition-colors",
              pathname === link.href
                ? "bg-[var(--rose)] text-[var(--bg)]"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
