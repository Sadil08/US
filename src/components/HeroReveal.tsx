"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function HeroReveal({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative z-10"
    >
      {children}
    </motion.div>
  );
}
