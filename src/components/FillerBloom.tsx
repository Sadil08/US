"use client";

import { motion } from "framer-motion";

// A tiny five-petal filler bloom (baby's breath / waxflower style) scattered
// among the lilies for fullness.
const ANGLES = [0, 72, 144, 216, 288];

export default function FillerBloom({
  size = 18,
  color = "#f8f1f6",
  centerColor = "#e8c9d8",
  delay = 0,
}: {
  size?: number;
  color?: string;
  centerColor?: string;
  delay?: number;
}) {
  return (
    <motion.g
      transform={`scale(${size / 18})`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
    >
      {ANGLES.map((angle) => (
        <ellipse
          key={angle}
          cx={0}
          cy={-4}
          rx={2.1}
          ry={3.4}
          fill={color}
          transform={`rotate(${angle})`}
        />
      ))}
      <circle cx={0} cy={0} r={1.6} fill={centerColor} />
    </motion.g>
  );
}
