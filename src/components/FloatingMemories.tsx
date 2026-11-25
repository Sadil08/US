"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import clsx from "clsx";
import Polaroid from "@/components/Polaroid";
import { usePhotos, type PhotoSummary } from "@/lib/use-photos";

// Edge positions only, so photos frame the content instead of sitting under it.
const SLOTS = [
  { left: "1%", top: "9%", w: 170, rot: -8, depth: 0.12, mobile: true },
  { left: "83%", top: "5%", w: 150, rot: 7, depth: 0.22, mobile: true },
  { left: "6%", top: "44%", w: 140, rot: 5, depth: 0.08, mobile: false },
  { left: "86%", top: "38%", w: 175, rot: -6, depth: 0.18, mobile: true },
  { left: "2%", top: "74%", w: 160, rot: -3, depth: 0.16, mobile: true },
  { left: "79%", top: "73%", w: 145, rot: 9, depth: 0.1, mobile: true },
  { left: "22%", top: "86%", w: 120, rot: 4, depth: 0.24, mobile: false },
  { left: "62%", top: "88%", w: 125, rot: -7, depth: 0.14, mobile: false },
];

const CYCLE_MS = 9000;
const HIDDEN_ON = ["/gate", "/"];

function Slot({
  slot,
  index,
  photo,
}: {
  slot: (typeof SLOTS)[number];
  index: number;
  photo: PhotoSummary;
}) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, (v) => -v * slot.depth);

  return (
    <motion.div
      className={clsx("absolute", !slot.mobile && "hidden sm:block")}
      style={{ left: slot.left, top: slot.top, y }}
    >
      <motion.div
        className="relative [--s:0.6] sm:[--s:1]"
        style={{ width: `calc(${slot.w}px * var(--s))` }}
        animate={reduce ? undefined : { y: [0, -14, 0], rotate: [slot.rot - 1.5, slot.rot + 1.5, slot.rot - 1.5] }}
        initial={{ rotate: slot.rot }}
        transition={{ duration: 9 + index * 1.3, repeat: Infinity, ease: "easeInOut" }}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={photo.id}
            className="absolute inset-x-0 top-0"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
          >
            <Polaroid photo={photo} width="100%" className="text-[11px] sm:text-sm" />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default function FloatingMemories() {
  const pathname = usePathname();
  const photos = usePhotos();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), CYCLE_MS);
    return () => clearInterval(timer);
  }, []);

  if (HIDDEN_ON.includes(pathname) || photos.length === 0) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{ filter: "saturate(0.85) blur(0.6px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.55 }}
        transition={{ duration: 1.5 }}
      >
        {SLOTS.map((slot, i) => (
          // Each tick moves every slot one step through the photos, staggered
          // so neighbouring slots never show the same picture.
          <Slot key={i} slot={slot} index={i} photo={photos[(i + tick * 3) % photos.length]} />
        ))}
      </motion.div>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 50% 45%, rgba(27,20,32,0.92) 0%, rgba(27,20,32,0.7) 55%, rgba(27,20,32,0.15) 100%)",
        }}
      />
    </div>
  );
}
