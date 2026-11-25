"use client";

import { useEffect, useState } from "react";

export type PhotoSummary = {
  id: string;
  key: string;
  caption: string | null;
  blurDataUrl: string;
};

// One shared request per page load, however many components want photos.
let cache: Promise<PhotoSummary[]> | null = null;

function load() {
  cache ??= fetch("/api/photos")
    .then((res) => res.json())
    .then((data) => (data.photos ?? []) as PhotoSummary[])
    .catch(() => {
      cache = null;
      return [];
    });
  return cache;
}

export function usePhotos() {
  const [photos, setPhotos] = useState<PhotoSummary[]>([]);

  useEffect(() => {
    let alive = true;
    load().then((p) => alive && setPhotos(p));
    return () => {
      alive = false;
    };
  }, []);

  return photos;
}
