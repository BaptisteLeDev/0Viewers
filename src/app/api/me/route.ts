import { NextResponse } from "next/server";
import { currentOwner } from "@/compte/viewer";

// Truth for the Admin link: the signed session, never the display cookie.
export async function GET() {
  return NextResponse.json({ owner: (await currentOwner()) !== null }, { headers: { "Cache-Control": "private, no-store" } });
}
