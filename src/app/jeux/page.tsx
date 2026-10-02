import type { Metadata } from "next";
import { MAX_VIEWERS, getZeroViewersStreamers, groupByGame } from "@/decouverte";
import { GameLinks } from "@/ui/GameLinks";
import styles from "./jeux.module.css";

export const revalidate = 60;
export const maxDuration = 60;

export const metadata: Metadata = {
  title: "Jeux en direct avec des petits streamers FR",
  description: "Les jeux streamés en ce moment par des streamers Twitch français à 0 viewer ou presque. Choisis un jeu et découvre ses petits lives.",
  alternates: { canonical: "/jeux" },
  openGraph: { url: "/jeux", images: ["/opengraph-image"] },
};

export default async function GamesPage() {
  const games = groupByGame(await getZeroViewersStreamers());
  return (
    <section className={`container ${styles.page}`} aria-labelledby="games-title">
      <h1 id="games-title">Jeux en direct avec des <span className="highlight">petits streamers FR</span></h1>
      <p className={styles.intro}>
        Les jeux streamés en ce moment sur Twitch par des streamers français à {MAX_VIEWERS} spectateurs ou moins. Le chiffre indique le nombre de lives.
        Choisis un jeu pour voir qui le streame.
      </p>
      {games.length > 0 ? <GameLinks games={games} /> : <p>Aucun jeu en direct pour l&apos;instant. Repasse dans quelques minutes.</p>}
    </section>
  );
}
