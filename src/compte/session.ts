import { createHmac, timingSafeEqual } from "node:crypto";

export type Viewer = { id: string; login: string; displayName: string; avatarUrl: string };

export const SESSION_COOKIE = "0v_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
export const STATE_COOKIE = "0v_oauth_state";

export const cookieOptions = (maxAge: number) =>
  ({ httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge }) as const;

const mac = (payload: string, secret: string) => createHmac("sha256", secret).update(payload).digest("base64url");

export function signSession(viewer: Viewer, secret: string, now = Date.now()): string {
  const payload = Buffer.from(JSON.stringify({ ...viewer, exp: now + SESSION_MAX_AGE * 1000 })).toString("base64url");
  return `${payload}.${mac(payload, secret)}`;
}

export function verifySession(token: string, secret: string, now = Date.now()): Viewer | null {
  const [payload, sig, extra] = token.split(".");
  if (!payload || !sig || extra !== undefined) return null;
  const expected = Buffer.from(mac(payload, secret));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const { exp, id, login, displayName, avatarUrl } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof exp === "number" && exp > now ? { id, login, displayName, avatarUrl } : null;
  } catch {
    return null;
  }
}
