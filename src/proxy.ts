import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, isOwner, verifySession } from "@/compte/session";

// Real 404 status: a notFound() inside the page's Suspense streams a 200.
// The page and the unhide action still re-check the owner.
export function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const secret = process.env.SESSION_SECRET;
  const viewer = token && secret ? verifySession(token, secret) : null;
  if (isOwner(viewer?.id, process.env.OWNER_TWITCH_ID)) return NextResponse.next();
  return NextResponse.rewrite(new URL("/404", request.url), { status: 404 });
}

export const config = { matcher: ["/admin/:path*"] };
