import type { Viewer } from "./session";

// Display-only copy for the static header, readable by JS.
// Never trusted server-side: authz uses the signed 0v_session cookie.
export const DISPLAY_COOKIE = "0v_viewer";

export type ViewerDisplay = Pick<Viewer, "displayName" | "avatarUrl">;

export const toDisplayCookie = ({ displayName, avatarUrl }: Viewer): string => JSON.stringify({ displayName, avatarUrl });

export function parseDisplayCookie(cookieHeader: string): ViewerDisplay | null {
  const raw = cookieHeader.split("; ").find((c) => c.startsWith(`${DISPLAY_COOKIE}=`))?.slice(DISPLAY_COOKIE.length + 1);
  if (!raw) return null;
  try {
    const { displayName, avatarUrl } = JSON.parse(decodeURIComponent(raw));
    return typeof displayName === "string" && typeof avatarUrl === "string" && avatarUrl.startsWith("https://") ? { displayName, avatarUrl } : null;
  } catch {
    return null;
  }
}
