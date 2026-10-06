import { connection } from "next/server";
import { CRAWL_SECONDS, getLiveCrawl } from "@/decouverte";

export const maxDuration = 60;

// Dynamic on purpose: a prerendered handler would be an ISR entry again.
// The CDN cache costs no ISR write. ADR 0002.
export async function GET() {
  await connection();
  return Response.json(await getLiveCrawl(), {
    headers: { "Cache-Control": `public, s-maxage=${CRAWL_SECONDS}, stale-while-revalidate=3600` },
  });
}
