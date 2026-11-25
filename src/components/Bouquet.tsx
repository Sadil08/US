"use client";

import { useId, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Lily, { type LilyPalette } from "@/components/Lily";
import { BABYS_BREATH, Bud, Carnation, Chrysanthemum, Leaf, STATICE, Sprig } from "@/components/BouquetParts";
import { mulberry32, r2 } from "@/lib/prng";

// Stargazer and its cultivar cousins, weighted toward the classic magenta.
const PALETTES: { weight: number; palette: LilyPalette }[] = [
  { weight: 0.45, palette: { edge: "#fde3ec", light: "#f7b6cf", body: "#e0336f", deep: "#b0144f", spot: "#7e0b36" } },
  { weight: 0.25, palette: { edge: "#f9d2e0", light: "#ef8fb3", body: "#c8175a", deep: "#8f0d40", spot: "#5e0626" } },
  { weight: 0.2, palette: { edge: "#fff0f5", light: "#fbd3e2", body: "#f07aa6", deep: "#d94b85", spot: "#a6245a" } },
  { weight: 0.1, palette: { edge: "#ffffff", light: "#fff6f9", body: "#fbdbe7", deep: "#f2a9c5", spot: "#d0507f" } },
];

const HEAD = { x: 220, y: 215 };

const LILY_SLOTS = [[-92, -42], [2, -78], [96, -40], [-48, 8], [52, 6], [-122, 48], [124, 44], [2, 62], [-6, -22]];
const CHRYS_SLOTS = [[-50, -88], [56, -90], [-150, -2], [150, 4], [-82, 82], [86, 84], [34, -40]];
const CARNATION_SLOTS = [[-28, 104], [112, -82], [-112, -84]];

function arrange(seed: number) {
  const rand = mulberry32(seed);
  const jitter = (n: number) => (rand() * 2 - 1) * n;
  const pickPalette = () => {
    let x = rand();
    for (const p of PALETTES) {
      x -= p.weight;
      if (x <= 0) return p.palette;
    }
    return PALETTES[0].palette;
  };
  const onRing = (angleDeg: number, rx: number, ry: number, spread = 8) => {
    const a = ((angleDeg + jitter(spread)) * Math.PI) / 180;
    return {
      x: r2(HEAD.x + Math.cos(a) * rx),
      y: r2(HEAD.y + Math.sin(a) * ry),
      rot: r2((a * 180) / Math.PI + 90),
    };
  };

  const lilies = LILY_SLOTS.map(([dx, dy], i) => ({
    id: i,
    x: r2(HEAD.x + dx + jitter(12)),
    y: r2(HEAD.y + dy + jitter(10)),
    size: r2(150 + rand() * 45),
    spin: r2(rand() * 360),
    axis: r2(rand() * 180),
    tilt: r2(0.7 + rand() * 0.3),
    delay: r2(0.7 + i * 0.12 + rand() * 0.2),
    palette: pickPalette(),
  })).sort((a, b) => a.y - b.y);

  return {
    lilies,
    chrysanthemums: CHRYS_SLOTS.map(([dx, dy], i) => ({
      id: i,
      x: r2(HEAD.x + dx + jitter(8)),
      y: r2(HEAD.y + dy + jitter(8)),
      scale: r2(0.9 + rand() * 0.25),
      delay: r2(0.5 + rand() * 0.4),
    })),
    carnations: CARNATION_SLOTS.map(([dx, dy], i) => ({
      id: i,
      x: r2(HEAD.x + dx + jitter(8)),
      y: r2(HEAD.y + dy + jitter(8)),
      scale: r2(1.1 + rand() * 0.3),
      delay: r2(0.5 + rand() * 0.4),
    })),
    leaves: [-178, -138, -42, -2, 168, 12].map((a, i) => ({ id: i, ...onRing(a, 128, 108), scale: r2(1 + rand() * 0.25) })),
    buds: [-122, -62, -158].map((a, i) => ({ id: i, ...onRing(a, 135, 118), scale: r2(0.9 + rand() * 0.2) })),
    statice: [-165, -110, -75, -18].map((a, i) => ({ id: i, ...onRing(a, 150, 125), scale: r2(1 + rand() * 0.2) })),
    babysBreath: [-150, -95, -50, -28, 175, 5].map((a, i) => ({ id: i, ...onRing(a, 140, 112), scale: r2(0.9 + rand() * 0.2) })),
  };
}

export default function Bouquet() {
  const [seed, setSeed] = useState(1);
  const b = useMemo(() => arrange(seed), [seed]);
  const uid = useId();
  const paper = `${uid}-paper`;
  const paperAlt = `${uid}-paper-alt`;
  const red = `${uid}-red`;
  const satin = `${uid}-satin`;
  const shadow = `${uid}-shadow`;

  return (
    <div className="flex w-full flex-col items-center">
      <motion.div
        className="w-full max-w-[440px]"
        style={{ transformOrigin: "50% 82%" }}
        animate={{ rotate: [-1, 1] }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      >
        <svg key={seed} viewBox="0 0 440 500" className="block h-auto w-full">
          <defs>
            <linearGradient id={paper} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e4dfe6" />
            </linearGradient>
            <linearGradient id={paperAlt} x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#dcd6de" />
            </linearGradient>
            <linearGradient id={red} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e2324a" />
              <stop offset="100%" stopColor="#a50f26" />
            </linearGradient>
            <linearGradient id={satin} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e0384f" />
              <stop offset="50%" stopColor="#b3122c" />
              <stop offset="100%" stopColor="#8a0c20" />
            </linearGradient>
            <radialGradient id={`${uid}-foliage`}>
              <stop offset="0%" stopColor="#24401f" />
              <stop offset="70%" stopColor="#2f5228" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#2f5228" stopOpacity={0} />
            </radialGradient>
            <filter id={shadow} x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#1b0610" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* back wrapping: red sheets and fanned white paper */}
          <motion.g initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <path d="M210,405 L28,222 L66,118 L216,392 Z" fill={`url(#${red})`} />
            <path d="M232,408 L404,214 L424,262 L238,410 Z" fill={`url(#${red})`} />
            <path d="M214,405 L48,170 L148,64 L226,392 Z" fill={`url(#${paper})`} stroke="#d8d2d9" strokeWidth={0.8} />
            <path d="M216,398 L100,118" stroke="#d9d3da" strokeWidth={1} />
            <path d="M226,405 L292,62 L412,172 L232,392 Z" fill={`url(#${paperAlt})`} stroke="#d8d2d9" strokeWidth={0.8} />
            <path d="M229,398 L352,118" stroke="#d9d3da" strokeWidth={1} />
            <path d="M218,405 L166,46 L278,48 L224,392 Z" fill={`url(#${paper})`} stroke="#d8d2d9" strokeWidth={0.8} />
          </motion.g>


          {/* dark greenery filling the gaps between blooms */}
          <motion.ellipse
            cx={HEAD.x}
            cy={HEAD.y + 10}
            rx={150}
            ry={118}
            fill={`url(#${uid}-foliage)`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          />

          {b.leaves.map((l) => (
            <g key={`leaf-${l.id}`} transform={`translate(${l.x} ${l.y}) rotate(${l.rot})`}>
              <Leaf scale={l.scale} delay={0.4} />
            </g>
          ))}

          {b.buds.map((bud) => (
            <g key={`bud-${bud.id}`} transform={`translate(${bud.x} ${bud.y}) rotate(${bud.rot})`}>
              <Bud scale={bud.scale} delay={1} />
            </g>
          ))}

          {b.statice.map((s) => (
            <g key={`statice-${s.id}`} transform={`translate(${s.x} ${s.y}) rotate(${s.rot})`}>
              <Sprig data={STATICE} scale={s.scale} delay={0.6} />
            </g>
          ))}

          {b.babysBreath.map((s) => (
            <g key={`bb-${s.id}`} transform={`translate(${s.x} ${s.y}) rotate(${s.rot})`}>
              <Sprig data={BABYS_BREATH} scale={s.scale} delay={0.7} />
            </g>
          ))}

          {/* front wrap cone with a red edge; flowers spill over it */}
          <motion.g initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}>
            <path d="M92,290 Q220,345 348,290 L262,470 Q220,482 178,470 Z" fill={`url(#${paper})`} stroke="#d8d2d9" strokeWidth={0.8} />
            <path d="M92,290 Q220,345 348,290 L330,318 Q220,365 110,318 Z" fill="#000000" fillOpacity={0.04} />
            <path d="M148,306 L194,468" stroke="#d9d3da" strokeWidth={1} />
            <path d="M292,306 L246,468" stroke="#d9d3da" strokeWidth={1} />
            <path d="M92,290 Q220,345 348,290" stroke={`url(#${red})`} strokeWidth={5} fill="none" />
          </motion.g>

          {b.chrysanthemums.map((c) => (
            <g key={`chrys-${c.id}`} transform={`translate(${c.x} ${c.y})`} filter={`url(#${shadow})`}>
              <Chrysanthemum scale={c.scale} delay={c.delay} />
            </g>
          ))}

          {b.carnations.map((c) => (
            <g key={`carn-${c.id}`} transform={`translate(${c.x} ${c.y})`}>
              <Carnation scale={c.scale} delay={c.delay} />
            </g>
          ))}

          {b.lilies.map((l) => (
            <g
              key={`lily-${l.id}`}
              transform={`translate(${l.x} ${l.y}) rotate(${l.axis}) scale(1 ${l.tilt}) rotate(${r2(l.spin - l.axis)})`}
              filter={`url(#${shadow})`}
            >
              <Lily size={l.size} delay={l.delay} palette={l.palette} />
            </g>
          ))}

          {/* satin ribbon tied at the neck */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.6 }}>
            <path d="M180,432 Q220,444 260,432 L258,448 Q220,460 182,448 Z" fill={`url(#${satin})`} />
            <path d="M214,446 L192,498 L204,494 L222,448 Z" fill={`url(#${satin})`} />
            <path d="M226,446 L250,496 L238,499 L218,448 Z" fill={`url(#${satin})`} />
            <path d="M220,440 C 186,412 150,428 168,452 C 180,466 204,454 220,440 Z" fill={`url(#${satin})`} />
            <path d="M220,440 C 254,412 290,428 272,452 C 260,466 236,454 220,440 Z" fill={`url(#${satin})`} />
            <ellipse cx={220} cy={441} rx={8} ry={7} fill="#8a0c20" />
          </motion.g>
        </svg>
      </motion.div>

      <button onClick={() => setSeed((s) => s + 1)} className="btn btn-gold mt-6">
        Make another bouquet
      </button>
    </div>
  );
}
