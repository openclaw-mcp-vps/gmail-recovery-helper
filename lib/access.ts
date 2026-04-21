import { createHmac, timingSafeEqual } from "node:crypto";

export const ACCESS_COOKIE_NAME = "grh_access";
const ACCESS_COOKIE_TTL_SECONDS = 60 * 60 * 24 * 30;

function getSigningSecret() {
  return process.env.STRIPE_WEBHOOK_SECRET || "local-dev-secret";
}

export function createAccessToken(sessionId: string) {
  const expiresAt = Date.now() + ACCESS_COOKIE_TTL_SECONDS * 1000;
  const payload = `${sessionId}.${expiresAt}`;
  const signature = createHmac("sha256", getSigningSecret()).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

export function verifyAccessToken(token?: string | null): boolean {
  if (!token) {
    return false;
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return false;
  }

  const [sessionId, expiresAtRaw, signature] = parts;
  const expiresAt = Number(expiresAtRaw);
  if (!sessionId || Number.isNaN(expiresAt) || expiresAt < Date.now()) {
    return false;
  }

  const payload = `${sessionId}.${expiresAt}`;
  const expected = createHmac("sha256", getSigningSecret()).update(payload).digest("hex");

  if (signature.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}
