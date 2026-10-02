import type { Metadata } from "next";
import { MAX_VIEWERS, MIN_LIVE_MINUTES, getZeroViewersStreamers } from "@/decouverte";
import { StreamerList } from "@/ui/StreamerList";

export const revalidate = 60;
export const maxDuration = 60;

export const metadata: Metadata = {
  title: "Streamers français en live à 0 spectateur",
  description: "Trouve ton prochain streamer Twitch français à découvrir : des lives FR à 0 viewer ou presque, liste mise à jour toutes les 5 minutes.",
  alternates: { canonical: "/streamers" },
  openGraph: { url: "/streamers", images: ["/opengraph-image"] },
};

export default async function StreamersPage() {
  const streamers = await getZeroViewersStreamers();
  return (
    <section className="container" aria-labelledby="streamers-title">
      <h1 id="streamers-title">Trouve ton prochain <span className="highlight">streamer FR</span> à découvrir</h1>
      <p>Lives Twitch en français, en direct depuis plus de {MIN_LIVE_MINUTES} minutes, avec {MAX_VIEWERS} spectateurs ou moins. Liste mise à jour toutes les 5 minutes.</p>
      {streamers.length === 0 ? (
        <p>Aucun streamer français à 0 spectateur en ce moment. Repasse dans quelques minutes.</p>
      ) : (
        <StreamerList streamers={streamers} />
      )}
    </section>
  );
}
