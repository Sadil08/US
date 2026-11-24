"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Lily from "@/components/Lily";

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PALETTES = [
  { petalColor: "#e3a9a0", petalColorLight: "#f6ece4", centerColor: "#cda05f" },
  { petalColor: "#cda05f", petalColorLight: "#fbeedd", centerColor: "#b05c4a" },
  { petalColor: "#c98fae", petalColorLight: "#f6ece4", centerColor: "#e3a9a0" },
  { petalColor: "#f3dede", petalColorLight: "#ffffff", centerColor: "#cda05f" },
];

// Centre of the box (in the 420x380 viewBox) where every stem gathers,
// just above the ribbon wrap.
const GATHER = { x: 210, y: 300 };

type Flower = {
  id: number;
  x: number;
  y: number;
  size: number;
  rotate: number;
  delay: number;
  palette: (typeof PALETTES)[number];
};

function makeBouquet(seed: number, count = 7): Flower[] {
  const rand = mulberry32(seed);
  const flowers: Flower[] = [];
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const angleDeg = 200 + t * 140 + (rand() * 16 - 8);
    const angle = (angleDeg * Math.PI) / 180;
    const radius = 55 + rand() * 55;
    flowers.push({
      id: i,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      size: 95 + rand() * 65,
      rotate: rand() * 24 - 12,
      delay: 0.5 + rand() * 0.7,
      palette: PALETTES[Math.floor(rand() * PALETTES.length)],
    });
  }
  // Largest, most central flower last so it blooms on top.
  flowers.sort((a, b) => a.size - b.size);
  return flowers;
}

export default function Bouquet() {
  const [seed, setSeed] = useState(1);
  const flowers = useMemo(() => makeBouquet(seed), [seed]);

  return (
    <div className="flex flex-col items-center">
      <motion.div key={seed} className="relative" style={{ width: 420, height: 380 }}>
        <svg viewBox="0 0 420 380" width={420} height={380} className="absolute inset-0">
          {/* stems, gathered at one point just above the ribbon */}
          {flowers.map((f) => {
            const fx = GATHER.x + f.x;
            const fy = GATHER.y + f.y - 40;
            const midX = (fx + GATHER.x) / 2 + f.x * 0.15;
            const midY = (fy + GATHER.y) / 2;
            return (
              <motion.path
                key={`stem-${f.id}`}
                d={`M${fx},${fy} Q${midX},${midY} ${GATHER.x},${GATHER.y}`}
                stroke="#5a6b4a"
                strokeWidth={2.5}
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: f.delay * 0.4, duration: 0.6, ease: "easeOut" }}
              />
            );
          })}

          {/* ribbon wrap */}
          <motion.path
            d="M165,292 C180,330 240,330 255,292 L275,350 C230,378 190,378 145,350 Z"
            fill="#9c3b4a"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          />
          <motion.path
            d="M180,295 L160,365 M240,295 L260,365"
            stroke="#c9a356"
            strokeWidth={3}
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </svg>

        {flowers.map((f) => (
          <div
            key={f.id}
            className="absolute"
            style={{
              left: GATHER.x + f.x,
              top: GATHER.y + f.y - 40,
              transform: `translate(-50%, -50%) rotate(${f.rotate}deg)`,
            }}
          >
            <Lily size={f.size} delay={f.delay} {...f.palette} />
          </div>
        ))}
      </motion.div>

      <button onClick={() => setSeed((s) => s + 1)} className="btn btn-gold mt-6">
        Make another bouquet
      </button>
    </div>
  );
}
