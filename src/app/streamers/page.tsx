import type { Metadata } from "next";
import { getZeroViewersStreamers } from "@/decouverte";
import { StreamerList } from "@/ui/StreamerList";

export const revalidate = 300;
export const maxDuration = 60;

export const metadata: Metadata = {
  title: "Streamers français en live à 0 viewer",
  description: "La liste des streamers Twitch français en direct avec 0 viewer ou presque, mise à jour toutes les 5 minutes.",
  alternates: { canonical: "/streamers" },
  openGraph: { url: "/streamers", images: ["/opengraph-image"] },
};

export default async function StreamersPage() {
  const streamers = await getZeroViewersStreamers();
  return (
    <section className="container" aria-labelledby="streamers-title">
      <h1 id="streamers-title">Streamers <span className="highlight">français à découvrir</span></h1>
      <p>Des lives FR avec 0 viewer ou presque, en direct depuis plus de 10 minutes. Liste mise à jour toutes les 5 minutes.</p>
      {streamers.length === 0 ? (
        <p>Aucun streamer français à 0 viewer en ce moment. Revenez dans quelques minutes.</p>
      ) : (
        <StreamerList streamers={streamers} />
      )}
    </section>
  );
}
