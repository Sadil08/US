"use client";

import { motion, useReducedMotion } from "framer-motion";
import Polaroid from "@/components/Polaroid";
import { usePhotos } from "@/lib/use-photos";

const SCATTER = [
  { left: "4%", top: "10%", w: 190, rot: -9 },
  { left: "14%", top: "42%", w: 170, rot: 6 },
  { left: "3%", top: "68%", w: 180, rot: -4 },
  { right: "4%", top: "8%", w: 180, rot: 8 },
  { right: "15%", top: "40%", w: 165, rot: -7 },
  { right: "3%", top: "66%", w: 190, rot: 5 },
];

export function ScatteredPolaroids() {
  const photos = usePhotos();
  const reduce = useReducedMotion();
  if (photos.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block">
      {SCATTER.map((spot, i) => {
        const photo = photos[i % photos.length];
        return (
          <motion.div
            key={i}
            className="pointer-events-auto absolute"
            style={{ left: spot.left, right: spot.right, top: spot.top }}
            initial={{ opacity: 0, y: 30, rotate: spot.rot * 2 }}
            animate={{ opacity: 1, y: 0, rotate: spot.rot }}
            transition={{ delay: 0.6 + i * 0.15, duration: 0.9, ease: "easeOut" }}
            whileHover={{ scale: 1.08, rotate: 0, zIndex: 30 }}
          >
            <motion.div
              animate={reduce ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
            >
              <Polaroid photo={photo} width={spot.w} />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function PolaroidStrip() {
  const photos = usePhotos();
  const reduce = useReducedMotion();
  if (photos.length === 0) return null;

  // Two copies back to back so the strip can loop seamlessly at -50%.
  const loop = [...photos, ...photos];

  return (
    <div className="relative z-10 mt-12 w-screen overflow-hidden lg:hidden">
      <motion.div
        className="flex w-max gap-4 px-4"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: photos.length * 4, repeat: Infinity, ease: "linear" }}
      >
        {loop.map((photo, i) => (
          <div key={`${photo.id}-${i}`} style={{ rotate: `${i % 2 === 0 ? -3 : 3}deg` }}>
            <Polaroid photo={photo} width={130} className="text-sm" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
