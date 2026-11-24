"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

function seededPetals(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: (i * 37) % 100,
    delay: (i * 1.7) % 8,
    duration: 14 + (i % 6) * 2,
    size: 10 + (i % 4) * 4,
    drift: (i % 2 === 0 ? 1 : -1) * (20 + (i % 3) * 10),
  }));
}

export default function FloatingPetals() {
  const petals = useMemo(() => seededPetals(16), []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.3,
            background:
              "radial-gradient(circle at 30% 30%, var(--rose), var(--gold))",
            opacity: 0.35,
          }}
          initial={{ top: "-5%", x: 0, rotate: 0 }}
          animate={{ top: "105%", x: p.drift, rotate: 180 }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
