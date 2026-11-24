import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const events = await prisma.event.findMany({ orderBy: { date: "asc" } });
  return NextResponse.json({ events });
}

export async function POST(request: Request) {
  const data = await request.json();
  const { title, date, note, isFuture } = data;

  if (!title || !date) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  const event = await prisma.event.create({
    data: { title, date: new Date(date), note: note ?? null, isFuture: Boolean(isFuture) },
  });

  return NextResponse.json({ event }, { status: 201 });
}
