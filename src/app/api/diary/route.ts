import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const entries = await prisma.diaryEntry.findMany({ orderBy: { entryDate: "desc" } });
  return NextResponse.json({ entries });
}

export async function POST(request: Request) {
  const data = await request.json();
  const { title, body, entryDate, author } = data;

  if (!title || !body || !entryDate || (author !== "ME" && author !== "HER")) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  const entry = await prisma.diaryEntry.create({
    data: { title, body, entryDate: new Date(entryDate), author },
  });

  return NextResponse.json({ entry }, { status: 201 });
}
