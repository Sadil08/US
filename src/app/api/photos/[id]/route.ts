import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { deleteFromR2 } from "@/lib/r2";
import { thumbKeyFor } from "@/lib/photo-keys";

export async function PATCH(request: Request, { params }: RouteContext<"/api/photos/[id]">) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const data: { caption?: string | null; milestone?: string | null; takenAt?: Date } = {};
  if ("caption" in body) data.caption = body.caption?.toString().trim() || null;
  if ("milestone" in body) data.milestone = body.milestone?.toString().trim() || null;
  if ("takenAt" in body) {
    const date = new Date(body.takenAt);
    if (Number.isNaN(date.getTime())) {
      return NextResponse.json({ error: "That date doesn't look right" }, { status: 400 });
    }
    data.takenAt = date;
  }

  try {
    const photo = await prisma.photo.update({ where: { id }, data });
    return NextResponse.json({ photo });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }
    throw error;
  }
}

export async function DELETE(_request: Request, { params }: RouteContext<"/api/photos/[id]">) {
  const { id } = await params;
  const photo = await prisma.photo.findUnique({ where: { id } });
  if (!photo) return NextResponse.json({ error: "Photo not found" }, { status: 404 });

  await prisma.photo.delete({ where: { id } });
  // Row is gone first so the site never points at a missing file; a failed
  // R2 cleanup only leaves an orphaned object behind.
  await Promise.allSettled([deleteFromR2(photo.key), deleteFromR2(thumbKeyFor(photo.key))]);

  return NextResponse.json({ ok: true });
}
