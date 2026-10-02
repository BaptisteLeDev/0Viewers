import type { Metadata } from "next";
import { MAX_VIEWERS, MIN_LIVE_MINUTES, getZeroViewersStreamers } from "@/decouverte";
import { Reco } from "@/ui/Reco";
import styles from "./page.module.css";

export const revalidate = 300;
export const maxDuration = 60;

export const metadata: Metadata = {
  title: { absolute: "Streamers Twitch français à 0 spectateur en live | 0Viewers" },
  description: "Découvre des streamers Twitch français en live devant 0 spectateur et deviens leur premier viewer. Gratuit, sans compte, mis à jour toutes les 5 minutes.",
  alternates: { canonical: "/" },
};

const plural = (n: number, word: string) => `${word}${n > 1 ? "s" : ""}`;

export default async function Home() {
  const streamers = await getZeroViewersStreamers();
  const zeros = streamers.filter((s) => s.viewerCount === 0).length;
  // server render, once per ISR window: hydration then moves it to client time
  // eslint-disable-next-line react-hooks/purity
  const renderedAt = Date.now();
  return (
    <>
      <Reco streamers={streamers} renderedAt={renderedAt}>
        <h1 id="hero-title">Découvre les streamers Twitch français à <span className="highlight">0 spectateur</span></h1>
        <p>Un clic pour lancer leur live, un mot dans le chat, et tu deviens leur premier spectateur.</p>
      </Reco>
      <section className={styles.stats} aria-labelledby="stats-title">
        <div className="container">
          <h2 id="stats-title" className="visually-hidden">En ce moment</h2>
          <p>
            En ce moment, <strong>{zeros}</strong> {plural(zeros, "streamer")} français {zeros > 1 ? "sont" : "est"} en live devant 0 spectateur,
            sur <strong>{streamers.length}</strong> {plural(streamers.length, "live")} à {MAX_VIEWERS} spectateurs ou moins.
          </p>
        </div>
      </section>
      <section className={`container ${styles.mission}`} aria-labelledby="mission-title">
        <h2 id="mission-title">Pourquoi un premier spectateur compte</h2>
        <p>
          Streamer devant 0 spectateur, c&apos;est parler pendant des heures dans une pièce vide. Tu lances ton live, tu commentes ta partie,
          tu salues un chat qui ne répond pas. Dans les catégories Twitch triées par nombre de spectateurs, ces lives sont tout en bas de la liste,
          là où presque personne ne descend. Beaucoup de petits streamers finissent par arrêter sans que personne ne les ait jamais trouvés.
        </p>
        <p>
          Un seul spectateur suffit à changer l&apos;ambiance. Le streamer voit ton pseudo, te répond, explique ce qu&apos;il fait. Le live devient
          une conversation. Pas besoin d&apos;en faire des tonnes : un salut dans le chat et quelques minutes de présence, c&apos;est déjà
          beaucoup pour quelqu&apos;un qui streame seul. De ton côté, tu tombes sur des chaînes que l&apos;algorithme ne t&apos;aurait jamais montrées.
        </p>
        <p>
          0Viewers fait le tri pour toi. Toutes les 5 minutes, le site récupère les lives Twitch en français en direct depuis plus
          de {MIN_LIVE_MINUTES} minutes avec {MAX_VIEWERS} spectateurs ou moins, en commençant par ceux à 0. Tu choisis un live, tu le regardes ici
          ou sur Twitch, et tu passes dire bonjour. C&apos;est gratuit et tu n&apos;as pas besoin de compte sur 0Viewers. Pour écrire dans le chat,
          il te faut juste ton compte Twitch.
        </p>
      </section>
    </>
  );
}
