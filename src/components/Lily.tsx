"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import { mulberry32, r2 } from "@/lib/prng";

export type LilyPalette = {
  edge: string;
  light: string;
  body: string;
  deep: string;
  spot: string;
};

type Spot = { x: number; y: number; rx: number; ry: number };
type Petal = { d: string; midrib: string; throat: string; spots: Spot[] };

// Builds one stargazer tepal pointing "up" from the flower centre: narrow
// claw at the throat, widest just before the middle, a ruffled outer half and
// a tip that bends sideways like a recurved petal seen from the front.
function buildPetal(
  length: number,
  width: number,
  bend: number,
  ruffle: number,
  seed: number,
  spotCount: number
): Petal {
  const rand = mulberry32(seed);
  const steps = 40;
  const norm = 1 / 0.5026; // peak of t^0.45 * (1-t)^0.55
  const phaseL = rand() * 6;
  const phaseR = rand() * 6;
  const center = (t: number) => bend * t * t * length * 0.14;
  const half = (t: number) => width * norm * Math.pow(t, 0.45) * Math.pow(1 - t, 0.55);
  const ruff = (t: number, phase: number) =>
    ruffle * Math.sin(t * 28 + phase) * Math.min(1, Math.max(0, (t - 0.3) / 0.35));

  const right: string[] = [];
  const left: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = -t * length;
    right.push(`${r2(center(t) + half(t) + ruff(t, phaseR))},${r2(y)}`);
    left.push(`${r2(center(t) - half(t) - ruff(t, phaseL))},${r2(y)}`);
  }
  left.reverse();

  const along = (from: number, to: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 12; i++) {
      const t = from + ((to - from) * i) / 12;
      pts.push(`${r2(center(t))},${r2(-t * length)}`);
    }
    return `M${pts.join(" L")}`;
  };

  // Spots cluster toward the throat and thin out along the petal.
  const spots: Spot[] = [];
  for (let i = 0; i < spotCount; i++) {
    const t = 0.07 + 0.5 * Math.pow(rand(), 1.4);
    const u = (rand() * 2 - 1) * 0.68;
    const rx = 0.5 + rand() * 1.1;
    spots.push({
      x: r2(center(t) + u * half(t)),
      y: r2(-t * length),
      rx: r2(rx),
      ry: r2(rx * (0.55 + rand() * 0.4)),
    });
  }

  return {
    d: `M${right.join(" L")} L${left.join(" L")} Z`,
    midrib: along(0.03, 0.8),
    throat: along(0, 0.24),
    spots,
  };
}

const OUTER_PETALS = [0, 1, 2].map((i) =>
  buildPetal(84, 11.5, i === 1 ? -0.9 : 0.8, 0.9, 101 + i, 16)
);
const INNER_PETALS = [0, 1, 2].map((i) =>
  buildPetal(76, 16, i === 0 ? 0.7 : -0.8, 1.6, 201 + i, 24)
);

const STAMENS = [0, 1, 2, 3, 4, 5].map((i) => {
  const deg = i * 60 + 15 + (i % 2) * 8;
  const a = (deg * Math.PI) / 180;
  const len = 34 + (i % 3) * 3;
  const dx = Math.sin(a);
  const dy = -Math.cos(a);
  const tip = { x: r2(dx * len), y: r2(dy * len) };
  const mid = { x: r2(dx * len * 0.55 - dy * 6), y: r2(dy * len * 0.55 + dx * 6) };
  return { d: `M0,0 Q${mid.x},${mid.y} ${tip.x},${tip.y}`, tip, rot: r2(deg + 90) };
});

export default function Lily({
  size = 170,
  palette,
  delay = 0,
}: {
  size?: number;
  palette: LilyPalette;
  delay?: number;
}) {
  const id = useId();
  const bodyId = `${id}-body`;
  const fadeId = `${id}-fade`;
  const throatId = `${id}-throat`;

  // The fan angle lives in a static SVG transform: Framer Motion animates SVG
  // transforms around the element's own bounding box, so only the bloom is
  // animated, anchored at the petal's base (bottom-centre of its box).
  const renderPetal = (p: Petal, angle: number, key: string) => (
    <g key={key} transform={`rotate(${angle})`}>
    <motion.g
      style={{ originX: 0.5, originY: 1 }}
      variants={{
        hidden: { scale: 0.2, opacity: 0, rotate: -25 },
        visible: {
          scale: 1,
          opacity: 1,
          rotate: 0,
          transition: { type: "spring", stiffness: 70, damping: 12 },
        },
      }}
    >
      <path d={p.d} fill={`url(#${bodyId})`} stroke={palette.deep} strokeOpacity={0.35} strokeWidth={0.7} />
      <path d={p.d} fill={`url(#${fadeId})`} />
      <path d={p.midrib} stroke={palette.light} strokeOpacity={0.75} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <path d={p.throat} stroke="#d7e6a6" strokeOpacity={0.9} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      {p.spots.map((s, i) => (
        <ellipse key={i} cx={s.x} cy={s.y} rx={s.rx} ry={s.ry} fill={palette.spot} fillOpacity={0.85} />
      ))}
    </motion.g>
    </g>
  );

  return (
    <g transform={`scale(${r2(size / 170)})`}>
      <motion.g
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.07, delayChildren: delay } },
        }}
      >
        <defs>
          {/* across the petal: white margins, pink, then the deep centre band */}
          <linearGradient id={bodyId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={palette.edge} />
            <stop offset="6%" stopColor={palette.light} />
            <stop offset="22%" stopColor={palette.body} />
            <stop offset="50%" stopColor={palette.deep} />
            <stop offset="78%" stopColor={palette.body} />
            <stop offset="94%" stopColor={palette.light} />
            <stop offset="100%" stopColor={palette.edge} />
          </linearGradient>
          {/* along the petal: green-white throat, paler tip */}
          <linearGradient id={fadeId} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#eef5d2" stopOpacity={0.9} />
            <stop offset="15%" stopColor="#ffffff" stopOpacity={0} />
            <stop offset="68%" stopColor="#ffffff" stopOpacity={0} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0.35} />
          </linearGradient>
          <radialGradient id={throatId}>
            <stop offset="0%" stopColor="#f1f6d4" />
            <stop offset="55%" stopColor="#e6efbf" stopOpacity={0.7} />
            <stop offset="100%" stopColor="#e6efbf" stopOpacity={0} />
          </radialGradient>
        </defs>

        {OUTER_PETALS.map((p, i) => renderPetal(p, 30 + i * 120, `o${i}`))}
        {INNER_PETALS.map((p, i) => renderPetal(p, 90 + i * 120, `i${i}`))}

        <motion.circle r={12} fill={`url(#${throatId})`} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} />

        <motion.g
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { delay: 0.35, duration: 0.6 } },
          }}
        >
          {STAMENS.map((s, i) => (
            <g key={i}>
              <path d={s.d} stroke="#e4ecc8" strokeWidth={1.1} fill="none" />
              <ellipse
                cx={s.tip.x}
                cy={s.tip.y}
                rx={3.6}
                ry={1.4}
                fill="#a3501f"
                transform={`rotate(${s.rot} ${s.tip.x} ${s.tip.y})`}
              />
              <ellipse
                cx={s.tip.x}
                cy={s.tip.y}
                rx={2}
                ry={0.6}
                fill="#c96a2b"
                transform={`rotate(${s.rot} ${s.tip.x} ${s.tip.y})`}
              />
            </g>
          ))}
          <path d="M0,0 Q5,-24 2,-42" stroke="#d6e2a4" strokeWidth={1.4} fill="none" />
          <circle cx={0.5} cy={-42.5} r={1.7} fill="#7d8f48" />
          <circle cx={3.5} cy={-42.5} r={1.7} fill="#7d8f48" />
          <circle cx={2} cy={-44.5} r={1.7} fill="#7d8f48" />
        </motion.g>
      </motion.g>
    </g>
  );
}
