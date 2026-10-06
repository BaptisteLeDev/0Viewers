import type { Metadata } from "next";
import { MAX_VIEWERS, MIN_LIVE_MINUTES } from "@/decouverte";
import { StreamerList } from "@/ui/StreamerList";

export const metadata: Metadata = {
  title: "Streamers français en live à 0 spectateur",
  description: "Trouve ton prochain streamer Twitch français à découvrir : des lives FR à 0 viewer ou presque, liste mise à jour toutes les 15 minutes.",
  alternates: { canonical: "/streamers" },
};

export default function StreamersPage() {
  return (
    <section className="container" aria-labelledby="streamers-title">
      <h1 id="streamers-title">Trouve ton prochain <span className="highlight">streamer FR</span> à découvrir</h1>
      <p>Lives Twitch en français, en direct depuis plus de {MIN_LIVE_MINUTES} minutes, avec {MAX_VIEWERS} spectateurs ou moins. Liste mise à jour toutes les 15 minutes.</p>
      <StreamerList empty={<p>Aucun streamer français à 0 spectateur en ce moment. Repasse dans quelques minutes.</p>} />
    </section>
  );
}
