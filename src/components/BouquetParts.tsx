"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import { mulberry32, r2 } from "@/lib/prng";

// Framer Motion scales SVG around the element's own bounding box, so
// originY 1 makes stems, buds and leaves grow out from their base.
const pop = (delay: number, fromBase = false) => ({
  initial: { opacity: 0, scale: 0.3 },
  animate: { opacity: 1, scale: 1 },
  transition: { delay, duration: 0.6, ease: "easeOut" as const },
  style: fromBase ? { originX: 0.5, originY: 1 } : undefined,
});

// --- White chrysanthemum ---------------------------------------------------

const CHRYS_RINGS = [
  { n: 20, len: 17, w: 2.7, off: 0, color: "#ffffff" },
  { n: 16, len: 13, w: 2.5, off: 9, color: "#f6f5ef" },
  { n: 12, len: 9, w: 2.3, off: 4, color: "#eceedd" },
  { n: 8, len: 5.5, w: 2, off: 20, color: "#e1e8c4" },
];

export function Chrysanthemum({ scale = 1, delay = 0 }: { scale?: number; delay?: number }) {
  return (
    <g transform={`scale(${r2(scale)})`}>
      <motion.g {...pop(delay)}>
        {CHRYS_RINGS.map((ring, ri) =>
          Array.from({ length: ring.n }, (_, i) => (
            <ellipse
              key={`${ri}-${i}`}
              cx={0}
              cy={r2(-ring.len / 2 - 1.5)}
              rx={ring.w}
              ry={r2(ring.len / 2)}
              fill={ring.color}
              stroke="#d3d2c6"
              strokeWidth={0.3}
              transform={`rotate(${r2((i * 360) / ring.n + ring.off)})`}
            />
          ))
        )}
        <circle r={3} fill="#d4dea0" />
      </motion.g>
    </g>
  );
}

// --- Burgundy carnation ----------------------------------------------------

function ruffledCircle(radius: number, amp: number, freq: number, seed: number) {
  const rand = mulberry32(seed);
  const steps = 72;
  const pts: string[] = [];
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const r = radius + amp * Math.sin(a * freq) + (rand() - 0.5) * amp;
    pts.push(`${r2(Math.cos(a) * r)},${r2(Math.sin(a) * r)}`);
  }
  return `M${pts.join(" L")} Z`;
}

const CARNATION_LAYERS = [
  { d: ruffledCircle(13, 1.4, 16, 1), fill: "#6e0d24" },
  { d: ruffledCircle(10, 1.3, 13, 2), fill: "#8e1732" },
  { d: ruffledCircle(7, 1.1, 11, 3), fill: "#a8223f" },
  { d: ruffledCircle(3.8, 0.8, 8, 4), fill: "#7a1229" },
];

export function Carnation({ scale = 1, delay = 0 }: { scale?: number; delay?: number }) {
  return (
    <g transform={`scale(${r2(scale)})`}>
      <motion.g {...pop(delay)}>
        {CARNATION_LAYERS.map((layer, i) => (
          <path key={i} d={layer.d} fill={layer.fill} stroke="#4f0818" strokeOpacity={0.4} strokeWidth={0.4} />
        ))}
      </motion.g>
    </g>
  );
}

// --- Sprays: purple statice and baby's breath -------------------------------

type SprigData = {
  branches: string[];
  dots: { x: number; y: number; r: number; c: string }[];
  stemColor: string;
};

function buildSprig(seed: number, colors: string[], dotR: [number, number], perTip: number, stemColor: string): SprigData {
  const rand = mulberry32(seed);
  const branches = ["M0,0 Q3,-25 0,-52"];
  const tips: [number, number][] = [[0, -52]];
  for (let b = 0; b < 4; b++) {
    const t = 0.3 + b * 0.17;
    const sx = r2(3 * Math.sin(t * Math.PI));
    const sy = r2(-52 * t);
    const dir = b % 2 === 0 ? -1 : 1;
    const ex = r2(sx + dir * (10 + rand() * 10));
    const ey = r2(sy - (10 + rand() * 10));
    branches.push(`M${sx},${sy} Q${r2((sx + ex) / 2 + dir * 2)},${r2((sy + ey) / 2 + 3)} ${ex},${ey}`);
    tips.push([ex, ey]);
  }
  const dots: SprigData["dots"] = [];
  for (const [tx, ty] of tips) {
    for (let i = 0; i < perTip; i++) {
      dots.push({
        x: r2(tx + (rand() - 0.5) * 9),
        y: r2(ty + (rand() - 0.5) * 7),
        r: r2(dotR[0] + rand() * (dotR[1] - dotR[0])),
        c: colors[Math.floor(rand() * colors.length)],
      });
    }
  }
  return { branches, dots, stemColor };
}

export const STATICE = buildSprig(7, ["#8f7cc8", "#a796da", "#c4b9ea", "#f4f1fb"], [1.1, 2], 9, "#7f9a62");
export const BABYS_BREATH = buildSprig(13, ["#ffffff", "#f7f4ee", "#efeee6"], [0.9, 1.6], 8, "#8fa577");

export function Sprig({ data, scale = 1, delay = 0 }: { data: SprigData; scale?: number; delay?: number }) {
  return (
    <g transform={`scale(${r2(scale)})`}>
      <motion.g {...pop(delay, true)}>
        {data.branches.map((d, i) => (
          <path key={i} d={d} stroke={data.stemColor} strokeWidth={0.9} fill="none" />
        ))}
        {data.dots.map((dot, i) => (
          <circle key={i} cx={dot.x} cy={dot.y} r={dot.r} fill={dot.c} />
        ))}
      </motion.g>
    </g>
  );
}

// --- Closed lily bud --------------------------------------------------------

const BUD_PATH =
  "M0,0 C -7,-10 -11,-30 -9,-45 C -7,-58 -3,-66 0,-70 C 3,-66 7,-58 9,-45 C 11,-30 7,-10 0,0 Z";

export function Bud({ scale = 1, delay = 0 }: { scale?: number; delay?: number }) {
  const id = useId();
  return (
    <g transform={`scale(${r2(scale)})`}>
      <motion.g {...pop(delay, true)}>
        <defs>
          <linearGradient id={`${id}-bud`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#7f9f52" />
            <stop offset="40%" stopColor="#c3d091" />
            <stop offset="75%" stopColor="#ef9fbe" />
            <stop offset="100%" stopColor="#d4467c" />
          </linearGradient>
        </defs>
        <path d="M0,18 Q-1,8 0,0" stroke="#5f7f3e" strokeWidth={2.4} fill="none" />
        <path d={BUD_PATH} fill={`url(#${id}-bud)`} stroke="#6f8f48" strokeOpacity={0.35} strokeWidth={0.6} />
        <path d="M0,-4 C 1.5,-30 1.5,-52 0,-67" stroke="#ffffff" strokeOpacity={0.4} strokeWidth={0.8} fill="none" />
        <path d="M-4.5,-9 C -6,-30 -4,-52 -1.2,-65" stroke="#5c7a3a" strokeOpacity={0.25} strokeWidth={0.7} fill="none" />
      </motion.g>
    </g>
  );
}

// --- Leaf -------------------------------------------------------------------

export function Leaf({ scale = 1, delay = 0 }: { scale?: number; delay?: number }) {
  const id = useId();
  return (
    <g transform={`scale(${r2(scale)})`}>
      <motion.g {...pop(delay, true)}>
        <defs>
          <linearGradient id={`${id}-leaf`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2f5a2e" />
            <stop offset="50%" stopColor="#5d8c45" />
            <stop offset="100%" stopColor="#3b6a34" />
          </linearGradient>
        </defs>
        <path d="M0,0 C -9,-20 -9,-55 0,-85 C 9,-55 9,-20 0,0 Z" fill={`url(#${id}-leaf)`} />
        <path d="M0,-2 L0,-80" stroke="#9fc27f" strokeOpacity={0.6} strokeWidth={0.8} />
      </motion.g>
    </g>
  );
}
