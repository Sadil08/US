export const AUTH_COOKIE = "ml_auth";

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET env var is not set");
  }
  return secret;
}

export async function createAuthToken(): Promise<string> {
  const key = await hmacKey(getSecret());
  const payload = "authed";
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return `${payload}.${toHex(sig)}`;
}

export async function isValidAuthToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [payload, sigHex] = token.split(".");
  if (!payload || !sigHex) return false;
  const key = await hmacKey(getSecret());
  const expected = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return payload === "authed" && toHex(expected) === sigHex;
}

export function checkPassphrase(input: string): boolean {
  const correct = process.env.SITE_PASSPHRASE;
  if (!correct) return false;
  return input === correct;
}
