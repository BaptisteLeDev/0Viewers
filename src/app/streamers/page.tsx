import type { Metadata } from "next";
import { MAX_VIEWERS, MIN_LIVE_MINUTES, getCrawl } from "@/decouverte";
import { jsonLd } from "@/site";
import { twitchChannelUrl } from "@/ui/player";
import { StreamerList } from "@/ui/StreamerList";

export const maxDuration = 60;

export const metadata: Metadata = {
  title: "Streamers français en live à 0 spectateur",
  description: "Trouve ton prochain streamer Twitch français à découvrir : des lives FR à 0 viewer ou presque, liste mise à jour toutes les 5 minutes.",
  alternates: { canonical: "/streamers" },
};

export default async function StreamersPage() {
  const { streamers, crawledAt } = await getCrawl();
  const listLd = jsonLd({
    "@type": "ItemList",
    name: "Streamers Twitch français en live à 0 spectateur",
    numberOfItems: streamers.length,
    itemListElement: streamers.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.displayName, url: twitchChannelUrl(s.login) })),
  });
  return (
    <section className="container" aria-labelledby="streamers-title">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: listLd }} />
      <h1 id="streamers-title">Trouve ton prochain <span className="highlight">streamer FR</span> à découvrir</h1>
      <p>Lives Twitch en français, en direct depuis plus de {MIN_LIVE_MINUTES} minutes, avec {MAX_VIEWERS} spectateurs ou moins. Liste mise à jour toutes les 5 minutes.</p>
      {streamers.length === 0 ? (
        <p>Aucun streamer français à 0 spectateur en ce moment. Repasse dans quelques minutes.</p>
      ) : (
        <StreamerList streamers={streamers} renderedAt={crawledAt} />
      )}
    </section>
  );
}
