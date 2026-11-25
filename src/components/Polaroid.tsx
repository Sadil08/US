import Image from "next/image";
import clsx from "clsx";
import { thumbUrl } from "@/lib/photo-keys";
import type { PhotoSummary } from "@/lib/use-photos";

export default function Polaroid({
  photo,
  width,
  showCaption = true,
  className,
}: {
  photo: PhotoSummary;
  width: number | string;
  showCaption?: boolean;
  className?: string;
}) {
  return (
    <div
      className={clsx("rounded-[3px] bg-[#f8f3ea] p-2 pb-1 shadow-[0_12px_30px_rgba(0,0,0,0.45)]", className)}
      style={{ width }}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#2a2030]">
        <Image
          src={thumbUrl(photo.key)}
          alt={photo.caption ?? "A memory of us"}
          fill
          unoptimized
          placeholder="blur"
          blurDataURL={photo.blurDataUrl}
          className="object-cover"
        />
      </div>
      <p className="font-script truncate px-1 pt-1 pb-1 text-center text-[0.95em] leading-tight text-[#6b3a48]">
        {showCaption && photo.caption ? photo.caption : " "}
      </p>
    </div>
  );
}
