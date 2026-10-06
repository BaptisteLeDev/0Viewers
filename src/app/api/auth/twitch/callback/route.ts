import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, SESSION_MAX_AGE, STATE_COOKIE, cookieOptions, isOwner, signSession } from "@/compte/session";
import { DISPLAY_COOKIE, toDisplayCookie } from "@/compte/display";
import { fetchTwitchViewer, saveViewer, sessionSecret } from "@/compte/twitch";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const code = url.searchParams.get("code");
  const state = request.cookies.get(STATE_COOKIE)?.value;
  const res = NextResponse.redirect(new URL("/", url), 303);
  res.cookies.delete(STATE_COOKIE);
  // denied consent comes back with ?error and no code
  if (!code || !state || url.searchParams.get("state") !== state) return res;
  try {
    const viewer = await fetchTwitchViewer(code, new URL("/api/auth/twitch/callback", url).toString());
    await saveViewer(viewer);
    res.cookies.set(SESSION_COOKIE, signSession(viewer, sessionSecret()), cookieOptions(SESSION_MAX_AGE));
    res.cookies.set(DISPLAY_COOKIE, toDisplayCookie(viewer, isOwner(viewer.id, process.env.OWNER_TWITCH_ID)), { ...cookieOptions(SESSION_MAX_AGE), httpOnly: false });
  } catch (error) {
    console.error(error);
  }
  return res;
}
