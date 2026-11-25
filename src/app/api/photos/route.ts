import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { processImage, uploadToR2 } from "@/lib/r2";
import { thumbKeyFor } from "@/lib/photo-keys";

export async function GET() {
  const photos = await prisma.photo.findMany({ orderBy: { takenAt: "asc" } });
  return NextResponse.json({ photos });
}

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");
  const caption = form.get("caption")?.toString() ?? null;
  const takenAt = form.get("takenAt")?.toString();
  const milestone = form.get("milestone")?.toString() ?? null;
  const uploadedBy = form.get("uploadedBy")?.toString();

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }
  if (!takenAt) {
    return NextResponse.json({ error: "takenAt is required" }, { status: 400 });
  }
  if (uploadedBy !== "ME" && uploadedBy !== "HER") {
    return NextResponse.json({ error: "uploadedBy must be ME or HER" }, { status: 400 });
  }

  const original = Buffer.from(await file.arrayBuffer());
  const { buffer, thumbBuffer, width, height, blurDataUrl } = await processImage(original);

  const key = `photos/${crypto.randomUUID()}.webp`;
  await uploadToR2(key, buffer, "image/webp");
  await uploadToR2(thumbKeyFor(key), thumbBuffer, "image/webp");

  const photo = await prisma.photo.create({
    data: {
      key,
      caption,
      takenAt: new Date(takenAt),
      milestone,
      width,
      height,
      blurDataUrl,
      uploadedBy,
    },
  });

  return NextResponse.json({ photo }, { status: 201 });
}
