"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Props = {
  src: string;
  width: number;
  height: number;
  blurDataUrl: string;
  caption?: string | null;
  index: number;
};

export default function PhotoReveal({ src, width, height, blurDataUrl, caption, index }: Props) {
  const tilt = index % 2 === 0 ? -1.5 : 1.5;

  return (
    <motion.figure
      initial={{ opacity: 0, y: 40, rotate: tilt * 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="card overflow-hidden p-2"
    >
      <Image
        src={src}
        alt={caption ?? "A memory of us"}
        width={width}
        height={height}
        placeholder="blur"
        blurDataURL={blurDataUrl}
        sizes="(max-width: 768px) 90vw, 420px"
        className="rounded-lg w-full h-auto"
        // Already compressed server-side at upload; this also keeps the
        // request same-origin from the browser so the auth cookie reaches
        // /api/image (Next's own optimizer fetch wouldn't carry it).
        unoptimized
      />
      {caption && (
        <figcaption className="mt-2 px-1 pb-1 text-sm text-[var(--ink-muted)] font-body">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}
