import { NextResponse, type NextRequest } from "next/server";
import { DISPLAY_COOKIE } from "@/compte/display";
import { SESSION_COOKIE } from "@/compte/session";

export function POST(request: NextRequest) {
  const res = NextResponse.redirect(new URL("/", request.url), 303);
  res.cookies.delete(SESSION_COOKIE);
  res.cookies.delete(DISPLAY_COOKIE);
  return res;
}
