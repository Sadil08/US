import { NextResponse } from "next/server";
import { getFromR2 } from "@/lib/r2";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const { key } = await params;
  const objectKey = key.join("/");

  try {
    const object = await getFromR2(objectKey);
    const body = object.Body;
    if (!body) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const bytes = await body.transformToByteArray();

    return new NextResponse(Buffer.from(bytes), {
      headers: {
        "Content-Type": object.ContentType ?? "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
