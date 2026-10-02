import type { Metadata } from "next";
import Link from "next/link";
import { getZeroViewersStreamers } from "@/decouverte";
import { Reco } from "@/ui/Reco";

export const revalidate = 300;
export const maxDuration = 60;

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  const streamers = await getZeroViewersStreamers();
  const zeros = streamers.filter((s) => s.viewerCount === 0).length;
  return (
    <>
      <section className="container" aria-labelledby="hero-title">
        <h1 id="hero-title">Soyez le <span className="highlight">premier spectateur</span></h1>
        <p>0Viewers trouve les streamers Twitch français en direct devant personne. Un clic, et ils ne streament plus dans le vide.</p>
      </section>
      <section className="container" aria-labelledby="reco-title">
        <h2 id="reco-title">Le streamer du moment</h2>
        {streamers.length > 0 ? (
          <Reco streamers={streamers} />
        ) : (
          <>
            <p>Aucun streamer français à 0 viewer en ce moment. Revenez dans quelques minutes.</p>
            <Link href="/streamers" className="btn">Voir la liste</Link>
          </>
        )}
      </section>
      <section className="container" aria-labelledby="stats-title">
        <h2 id="stats-title" className="visually-hidden">En chiffres</h2>
        <p><strong>{zeros}</strong> streamers français à 0 viewer, <strong>{streamers.length}</strong> à 5 viewers ou moins, en ce moment.</p>
      </section>
    </>
  );
}
