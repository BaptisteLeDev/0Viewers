import "server-only";
import { sql } from "@/db";
import { MAX_PER_DAY, type Suggestion } from "./rule";

export { MAX_LENGTH, MAX_PER_DAY, MIN_LENGTH, SUGGESTION_KINDS, parseSuggestion, type Suggestion, type SuggestionKind } from "./rule";

// Count and insert in one statement: no race past the daily cap.
export async function saveSuggestion(viewerId: string, { kind, body }: Suggestion): Promise<"ok" | "limit" | "unavailable"> {
  if (!sql) return "unavailable";
  try {
    const rows = await sql`INSERT INTO suggestion (viewer_id, kind, body)
      SELECT ${viewerId}, ${kind}, ${body}
      WHERE (SELECT count(*) FROM suggestion WHERE viewer_id = ${viewerId} AND created_at > now() - interval '1 day') < ${MAX_PER_DAY}
      RETURNING id`;
    return rows.length > 0 ? "ok" : "limit";
  } catch (error) {
    console.error(error);
    return "unavailable";
  }
}
