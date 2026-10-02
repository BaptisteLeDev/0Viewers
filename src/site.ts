export const SITE_NAME = "0Viewers";
export const SITE_DESCRIPTION =
  "Découvre les streamers Twitch français en live à 0 viewer et deviens leur premier spectateur.";
export const PUBLIC_PATHS = ["/", "/streamers", "/jeux"] as const;

export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelHost) return `https://${vercelHost}`;
  return "http://localhost:3000";
}

export function isIndexable(): boolean {
  return process.env.VERCEL_ENV !== "preview";
}
