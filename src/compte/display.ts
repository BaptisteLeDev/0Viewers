import type { Viewer } from "./session";

// Display-only copy for the static header, readable by JS.
// Never trusted server-side: authz uses the signed 0v_session cookie.
export const DISPLAY_COOKIE = "0v_viewer";

// owner = hint only: Header then asks /api/me (signed session) before
// showing Admin, so normal viewers never call it. Never the owner id.
export type ViewerDisplay = Pick<Viewer, "displayName" | "avatarUrl"> & { owner?: true };

export const toDisplayCookie = ({ displayName, avatarUrl }: Viewer, owner = false): string =>
  JSON.stringify(owner ? { displayName, avatarUrl, owner: true } : { displayName, avatarUrl });

export function parseDisplayCookie(cookieHeader: string): ViewerDisplay | null {
  const raw = cookieHeader.split("; ").find((c) => c.startsWith(`${DISPLAY_COOKIE}=`))?.slice(DISPLAY_COOKIE.length + 1);
  if (!raw) return null;
  try {
    const { displayName, avatarUrl, owner } = JSON.parse(decodeURIComponent(raw));
    if (typeof displayName !== "string" || typeof avatarUrl !== "string" || !avatarUrl.startsWith("https://")) return null;
    return owner === true ? { displayName, avatarUrl, owner } : { displayName, avatarUrl };
  } catch {
    return null;
  }
}
