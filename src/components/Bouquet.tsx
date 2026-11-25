"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Lily from "@/components/Lily";
import FillerBloom from "@/components/FillerBloom";

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Stargazer-lily palettes: pale, speckled throat deepening to a vivid
// magenta/crimson edge, the way real stargazers look.
const PALETTES = [
  { petalColorLight: "#fdf1f6", petalColor: "#d6356f", petalColorDeep: "#9c1248", centerColor: "#7a2b2f" },
  { petalColorLight: "#fbdde7", petalColor: "#c81457", petalColorDeep: "#7a0f3a", centerColor: "#5c2020" },
  { petalColorLight: "#ffffff", petalColor: "#f0a8c0", petalColorDeep: "#c85a8a", centerColor: "#8a4a4a" },
  { petalColorLight: "#ffffff", petalColor: "#fbeaf1", petalColorDeep: "#e8b8cf", centerColor: "#7a2b2f" },
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

type Filler = {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
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

function makeFillers(seed: number, count = 7): Filler[] {
  const rand = mulberry32(seed + 999);
  const fillers: Filler[] = [];
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const angleDeg = 195 + t * 150 + (rand() * 18 - 9);
    const angle = (angleDeg * Math.PI) / 180;
    const radius = 40 + rand() * 80;
    fillers.push({
      id: i,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      size: 12 + rand() * 10,
      delay: 0.9 + rand() * 0.6,
    });
  }
  return fillers;
}

export default function Bouquet() {
  const [seed, setSeed] = useState(1);
  const flowers = useMemo(() => makeBouquet(seed), [seed]);
  const fillers = useMemo(() => makeFillers(seed), [seed]);

  return (
    <div className="flex flex-col items-center w-full">
      <motion.svg
        key={seed}
        viewBox="0 0 420 380"
        className="block w-full max-w-[420px] h-auto mx-auto"
      >
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

        {/* small white filler blooms tucked between the lilies */}
        {fillers.map((f) => (
          <g key={`filler-${f.id}`} transform={`translate(${GATHER.x + f.x} ${GATHER.y + f.y - 40})`}>
            <FillerBloom size={f.size} delay={f.delay} />
          </g>
        ))}

        {flowers.map((f) => (
          <g
            key={f.id}
            transform={`translate(${GATHER.x + f.x} ${GATHER.y + f.y - 40}) rotate(${f.rotate})`}
          >
            <Lily size={f.size} delay={f.delay} {...f.palette} />
          </g>
        ))}
      </motion.svg>

      <button onClick={() => setSeed((s) => s + 1)} className="btn btn-gold mt-6">
        Make another bouquet
      </button>
    </div>
  );
}
