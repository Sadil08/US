"use client";

import { motion } from "framer-motion";
import { useId } from "react";

type LilyProps = {
  size?: number;
  petalColor?: string;
  petalColorLight?: string;
  petalColorDeep?: string;
  centerColor?: string;
  delay?: number;
};

const PETAL_ANGLES = [0, 60, 120, 180, 240, 300];

// A stargazer-style lily petal: narrow at the throat, widest past the
// middle, tapering to a recurved point at the tip.
const PETAL_PATH =
  "M0,0 C -4,-12 -10,-22 -10,-34 C -10,-48 -6,-61 0,-73 C 6,-61 10,-48 10,-34 C 10,-22 4,-12 0,0 Z";

// Dark speckles clustered near the throat, the way a real stargazer's
// spots fade out toward the petal's outer half.
const SPECKLES = [
  { x: -1.5, y: -9, r: 1 },
  { x: 1.8, y: -10.5, r: 0.9 },
  { x: -2.6, y: -14, r: 1.1 },
  { x: 2.3, y: -15.5, r: 0.9 },
  { x: 0.2, y: -18, r: 1 },
  { x: -1.2, y: -21, r: 0.8 },
  { x: 1.6, y: -20.5, r: 0.8 },
  { x: -0.4, y: -6, r: 0.7 },
];

export default function Lily({
  size = 160,
  petalColor = "#d6356f",
  petalColorLight = "#fdf1f6",
  petalColorDeep = "#9c1248",
  centerColor = "#7a2b2f",
  delay = 0,
}: LilyProps) {
  const gradientId = useId();

  return (
    <motion.g
      transform={`scale(${size / 160})`}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.09, delayChildren: delay },
        },
      }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={petalColorLight} />
          <stop offset="50%" stopColor={petalColor} />
          <stop offset="100%" stopColor={petalColorDeep} />
        </linearGradient>
      </defs>

      {PETAL_ANGLES.map((angle) => (
        <motion.g
          key={angle}
          transform={`rotate(${angle})`}
          style={{ transformOrigin: "0px 0px" }}
          variants={{
            hidden: { scale: 0, opacity: 0, rotate: angle - 25 },
            visible: {
              scale: 1,
              opacity: 1,
              rotate: angle,
              transition: { type: "spring", stiffness: 80, damping: 11 },
            },
          }}
        >
          <path
            d={PETAL_PATH}
            fill={`url(#${gradientId})`}
            stroke={petalColorDeep}
            strokeWidth={0.5}
            strokeOpacity={0.4}
          />
          {SPECKLES.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={petalColorDeep} fillOpacity={0.55} />
          ))}
        </motion.g>
      ))}

      {/* stamens: curved filaments with elongated anthers, the way real lily
          stamens arc outward and droop under the anther's weight */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angleDeg = i * 60 + 30;
        const a = (angleDeg * Math.PI) / 180;
        // Rounded to avoid a server/client hydration mismatch: sin/cos can
        // differ in their last bit between Node's and the browser's V8 build.
        const round = (n: number) => Math.round(n * 1000) / 1000;
        const dirX = round(Math.sin(a));
        const dirY = round(-Math.cos(a));
        const tipX = round(dirX * 36);
        const tipY = round(dirY * 36);
        const midX = round(dirX * 20 - dirY * 5);
        const midY = round(dirY * 20 + dirX * 5);
        return (
          <motion.g
            key={`stamen-${i}`}
            variants={{
              hidden: { opacity: 0, scale: 0 },
              visible: { opacity: 1, scale: 1, transition: { delay: 0.4 } },
            }}
          >
            <path
              d={`M0,0 Q${midX},${midY} ${tipX},${tipY}`}
              stroke="#cfc79a"
              strokeWidth={1}
              fill="none"
            />
            <ellipse
              cx={tipX}
              cy={tipY}
              rx={3.4}
              ry={1.4}
              fill={centerColor}
              transform={`rotate(${angleDeg} ${tipX} ${tipY})`}
            />
          </motion.g>
        );
      })}

      {/* pistil, slightly longer than the stamens and dead centre */}
      <motion.g
        variants={{
          hidden: { opacity: 0, scale: 0 },
          visible: { opacity: 1, scale: 1, transition: { delay: 0.45 } },
        }}
      >
        <path d="M0,0 Q4,-24 0,-44" stroke="#cfc79a" strokeWidth={1.1} fill="none" />
        <circle cx={0} cy={-44} r={1.6} fill={centerColor} />
      </motion.g>
    </motion.g>
  );
}
