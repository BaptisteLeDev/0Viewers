import type { Metadata } from "next";
import { MAX_VIEWERS, MIN_LIVE_MINUTES, getCrawl, groupByCategory } from "@/decouverte";
import Link from "next/link";
import { CategoryTile } from "@/ui/CategoryLinks";
import { Marquee } from "@/ui/Marquee";
import { Reco } from "@/ui/Reco";
import styles from "./page.module.css";

export const maxDuration = 60;

export const metadata: Metadata = {
  title: { absolute: "Streamers Twitch français à 0 spectateur en live | 0Viewers" },
  description: "Découvre des streamers Twitch français en live devant 0 spectateur et deviens leur premier viewer. Gratuit, sans compte, mis à jour toutes les 5 minutes.",
  alternates: { canonical: "/" },
};

const plural = (n: number, word: string) => `${word}${n > 1 ? "s" : ""}`;

export default async function Home() {
  const { streamers, boxArt } = await getCrawl();
  const zeros = streamers.filter((s) => s.viewerCount === 0).length;
  const categories = groupByCategory(streamers, boxArt);
  return (
    <>
      <Reco streamers={streamers}>
        <h1 id="hero-title">Découvre les streamers Twitch français à <span className="highlight">0 spectateur</span></h1>
        <p>Un clic pour lancer leur live, un mot dans le chat, et tu deviens leur premier spectateur.</p>
      </Reco>
      <section className={`container ${styles.video}`} aria-labelledby="video-title">
        <h2 id="video-title">0Viewers en 10 secondes</h2>
        <video controls preload="none" playsInline poster="/video/0viewers.jpg" width={1920} height={1080}>
          <source src="/video/0viewers.mp4" type="video/mp4" />
          <track kind="captions" src="/video/0viewers.vtt" srcLang="fr" label="Français" default />
        </video>
      </section>
      <section className={`container ${styles.mission}`} aria-labelledby="mission-title">
        <h2 id="mission-title">Pourquoi un premier spectateur compte</h2>
        <p>
          Streamer devant un compteur à 0, c&apos;est dur à tenir. On lance son live, on commente sa partie, on salue un chat qui ne
          répond pas. On continue quand même, en espérant que quelqu&apos;un finisse par passer. Et quand personne ne vient, difficile
          de savoir si ce qu&apos;on fait plaît ou pas.
        </p>
        <p>
          Un seul spectateur suffit à changer l&apos;ambiance. Le streamer voit ton pseudo, te répond, explique ce qu&apos;il fait. Le live devient
          une conversation. Pas besoin d&apos;en faire des tonnes : un salut dans le chat et quelques minutes de présence, c&apos;est déjà
          beaucoup pour quelqu&apos;un qui streame seul. De ton côté, tu découvres des chaînes que tu ne connaissais pas.
        </p>
        <p>
          0Viewers fait le tri pour toi, et ici les petits lives passent en premier. Toutes les 5 minutes, le site récupère les lives Twitch
          en français lancés depuis plus de {MIN_LIVE_MINUTES} minutes et qui comptent {MAX_VIEWERS} spectateurs ou moins, en commençant par ceux à 0.
          Tu choisis un live, tu le regardes ici ou sur Twitch, et tu passes dire bonjour. C&apos;est gratuit et tu n&apos;as pas besoin de compte
          sur 0Viewers. Pour écrire dans le chat, il te faut juste ton compte Twitch.
        </p>
      </section>
      {categories.length > 0 && (
        <section className={`container ${styles.categories}`} aria-labelledby="categories-title">
          <h2 id="categories-title">Parcours par catégorie</h2>
          <Marquee itemWidth="9rem" secondsPerItem={4} items={categories.map((g) => ({ key: g.slug, node: <CategoryTile category={g} /> }))} />
          <Link href="/categories" className="btn btn-ghost">Toutes les catégories en direct</Link>
        </section>
      )}
      <section className={styles.stats} aria-labelledby="stats-title">
        <div className="container">
          <h2 id="stats-title" className="visually-hidden">En chiffres</h2>
          <p>
            En ce moment, <strong>{zeros}</strong> {plural(zeros, "streamer")} français {zeros > 1 ? "sont" : "est"} en live devant 0 spectateur,
            sur <strong>{streamers.length}</strong> {plural(streamers.length, "live")} à {MAX_VIEWERS} spectateurs ou moins.
          </p>
        </div>
      </section>
    </>
  );
}
