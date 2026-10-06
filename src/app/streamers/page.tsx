import type { Metadata } from "next";
import { MAX_VIEWERS, MIN_LIVE_MINUTES, getDailyCategories } from "@/decouverte";
import { jsonLd, siteUrl } from "@/site";
import { StreamerList } from "@/ui/StreamerList";

export const metadata: Metadata = {
  title: "Petit streamer Twitch FR : lives à 0 viewer en direct",
  description: "Trouve un petit streamer Twitch français à découvrir : des lives FR avec 0 viewer ou presque, liste mise à jour toutes les 15 minutes.",
  alternates: { canonical: "/streamers" },
};

async function CategoriesLd() {
  const url = siteUrl();
  const ld = jsonLd({
    "@type": "CollectionPage",
    name: "Streamers français en live à 0 spectateur",
    url: `${url}/streamers`,
    inLanguage: "fr-FR",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: (await getDailyCategories()).map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, url: `${url}/categories/${c.slug}` })),
    },
  });
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld }} />;
}

export default function StreamersPage() {
  return (
    <section className="container" aria-labelledby="streamers-title">
      <CategoriesLd />
      <h1 id="streamers-title">Trouve ton prochain <span className="highlight">streamer FR</span> à découvrir</h1>
      <p>Lives Twitch en français, en direct depuis plus de {MIN_LIVE_MINUTES} minutes, avec {MAX_VIEWERS} spectateurs ou moins. Liste mise à jour toutes les 15 minutes.</p>
      <StreamerList empty={<p>Aucun streamer français à 0 spectateur en ce moment. Repasse dans quelques minutes.</p>} />
    </section>
  );
}
