"use client";

import { motion } from "framer-motion";
import { useId } from "react";

type LilyProps = {
  size?: number;
  petalColor?: string;
  petalColorLight?: string;
  centerColor?: string;
  delay?: number;
};

const PETAL_ANGLES = [0, 60, 120, 180, 240, 300];

// A single stylised, recurved lily petal, drawn pointing "up" (-y) from the
// flower's centre. The slight S-curve mimics how real lily petals flick
// backwards at the tip.
const PETAL_PATH =
  "M0,2 C -9,-14 -11,-34 -4,-52 C -2,-58 2,-58 4,-52 C 11,-34 9,-14 0,2 Z";

export default function Lily({
  size = 160,
  petalColor = "#e3a9a0",
  petalColorLight = "#f6ece4",
  centerColor = "#cda05f",
  delay = 0,
}: LilyProps) {
  const gradientId = useId();

  return (
    <motion.svg
      viewBox="-60 -60 120 120"
      width={size}
      height={size}
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
          <stop offset="100%" stopColor={petalColor} />
        </linearGradient>
      </defs>

      {PETAL_ANGLES.map((angle) => (
        <motion.path
          key={angle}
          d={PETAL_PATH}
          fill={`url(#${gradientId})`}
          stroke={petalColor}
          strokeWidth={0.5}
          strokeOpacity={0.4}
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
        />
      ))}

      {/* stamens */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i * 60 * Math.PI) / 180;
        // Rounded to avoid a server/client hydration mismatch: sin/cos can
        // differ in their last bit between Node's and the browser's V8 build.
        const x = Math.round(Math.sin(a) * 14 * 1000) / 1000;
        const y = Math.round(-Math.cos(a) * 14 * 1000) / 1000;
        return (
          <motion.g
            key={`stamen-${i}`}
            variants={{
              hidden: { opacity: 0, scale: 0 },
              visible: { opacity: 1, scale: 1, transition: { delay: 0.4 } },
            }}
          >
            <line x1={0} y1={0} x2={x} y2={y} stroke={centerColor} strokeWidth={1} />
            <circle cx={x} cy={y} r={2.2} fill={centerColor} />
          </motion.g>
        );
      })}
      <motion.circle
        cx={0}
        cy={0}
        r={5}
        fill={centerColor}
        variants={{
          hidden: { opacity: 0, scale: 0 },
          visible: { opacity: 1, scale: 1, transition: { delay: 0.45 } },
        }}
      />
    </motion.svg>
  );
}
