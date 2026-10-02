import { MAX_VIEWERS, MIN_LIVE_MINUTES } from "@/decouverte";
import { SITE_DESCRIPTION, SITE_NAME, siteUrl } from "@/site";

export const dynamic = "force-static";

export function GET() {
  const url = siteUrl();
  const body = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

${SITE_NAME} liste les lives Twitch en français, lancés depuis plus de ${MIN_LIVE_MINUTES} minutes et qui comptent ${MAX_VIEWERS} spectateurs ou moins, en commençant par ceux à 0. Liste mise à jour toutes les 5 minutes. Gratuit, sans compte.

## Pages

- [Accueil](${url}/): un streamer à 0 spectateur mis en avant et d'autres lives
- [Streamers](${url}/streamers): tous les petits lives FR du moment, avec recherche
- [Jeux](${url}/jeux): les jeux streamés en ce moment, une page par jeu
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
