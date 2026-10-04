import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { STATE_COOKIE, cookieOptions } from "@/compte/session";
import { authorizeUrl } from "@/compte/twitch";

export function GET(request: NextRequest) {
  const state = randomBytes(16).toString("base64url");
  const res = NextResponse.redirect(authorizeUrl(new URL("/api/auth/twitch/callback", request.url).toString(), state));
  res.cookies.set(STATE_COOKIE, state, cookieOptions(600));
  return res;
}
