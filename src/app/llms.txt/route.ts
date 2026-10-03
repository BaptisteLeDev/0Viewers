import { MAX_VIEWERS, MIN_LIVE_MINUTES, getCrawl, groupByCategory } from "@/decouverte";
import { SITE_DESCRIPTION, SITE_NAME, siteUrl } from "@/site";

export async function GET() {
  const url = siteUrl();
  const { streamers } = await getCrawl();
  const categories = groupByCategory(streamers)
    .map((g) => `- [${g.name}](${url}/categories/${g.slug}): ${g.count} ${g.count > 1 ? "lives FR" : "live FR"} à ${MAX_VIEWERS} spectateurs ou moins`)
    .join("\n");
  const body = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

${SITE_NAME} liste les lives Twitch en français, lancés depuis plus de ${MIN_LIVE_MINUTES} minutes et qui comptent ${MAX_VIEWERS} spectateurs ou moins, en commençant par ceux à 0. Liste mise à jour toutes les 5 minutes. Gratuit, sans compte.

## Pages

- [Accueil](${url}/): des lives à 0 spectateur pris au hasard et un carrousel des lives du moment
- [Streamers](${url}/streamers): tous les petits lives FR du moment, avec recherche
- [Catégories](${url}/categories): les catégories Twitch streamées en ce moment, une page par catégorie

## Catégories en direct

${categories || "- Aucune catégorie en direct pour l'instant"}

## Optional

- [Mentions légales](${url}/mentions-legales): éditeur, hébergeur, données personnelles
- [Algo](${url}/algo): quels streams sont affichés, lesquels sont écartés et pourquoi
- [Crédits](${url}/credits): sources, polices et données Twitch
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
