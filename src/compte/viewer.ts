import "server-only";
import { cookies } from "next/headers";
import { sql } from "@/db";
import { SESSION_COOKIE, isOwner, verifySession, type Viewer } from "./session";

export type { Viewer };

export async function currentViewer(): Promise<Viewer | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const secret = process.env.SESSION_SECRET;
  return token && secret ? verifySession(token, secret) : null;
}

export async function currentOwner(): Promise<Viewer | null> {
  const viewer = await currentViewer();
  return viewer && isOwner(viewer.id, process.env.OWNER_TWITCH_ID) ? viewer : null;
}

export type Contribution = { signalements: number; soutiens: number };

export async function contributionOf(viewerId: string): Promise<Contribution> {
  if (!sql) return { signalements: 0, soutiens: 0 };
  const [row] = await sql`
    SELECT count(*) FILTER (WHERE value = -1)::int AS signalements, count(*) FILTER (WHERE value = 1)::int AS soutiens
    FROM vote WHERE viewer_id = ${viewerId}`;
  return { signalements: row.signalements, soutiens: row.soutiens };
}
