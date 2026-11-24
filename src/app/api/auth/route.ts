import { NextResponse } from "next/server";
import { AUTH_COOKIE, checkPassphrase, createAuthToken } from "@/lib/auth";

export async function POST(request: Request) {
  const { passphrase } = await request.json().catch(() => ({ passphrase: "" }));

  if (!checkPassphrase(String(passphrase ?? ""))) {
    return NextResponse.json({ ok: false, error: "Wrong passphrase" }, { status: 401 });
  }

  const token = await createAuthToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}
