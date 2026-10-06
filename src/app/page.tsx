import type { Metadata } from "next";
import { MAX_VIEWERS, MIN_LIVE_MINUTES } from "@/decouverte";
import { Reco } from "@/ui/Reco";
import { LiveCategories, LiveCount, LiveStats } from "./live";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: { absolute: "Petit streamer Twitch FR : lives à 0 viewer en direct | 0Viewers" },
  description: "Découvre un petit streamer Twitch français en live devant 0 spectateur et deviens son premier viewer. Gratuit, sans compte, mis à jour toutes les 15 minutes.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Reco
        featured={
          <section className={styles.video} aria-labelledby="video-title">
            <div className="container">
              <p className={styles.kicker}>Pour les petits lives Twitch</p>
              <h2 id="video-title"><span className="highlight">0Viewers</span> en 10 secondes</h2>
              <div className={styles.frame}>
                <video controls preload="none" playsInline poster="/video/0viewers.jpg" width={1920} height={1080}>
                  <source src="/video/0viewers.mp4" type="video/mp4" />
                  <track kind="captions" src="/video/0viewers.vtt" srcLang="fr" label="Français" default />
                </video>
              </div>
            </div>
          </section>
        }
      >
        {/* one fragment: an array of RSC children trips the key warning */}
        <>
          <h1 id="hero-title">Découvre les streamers Twitch français à <span className="highlight">0 spectateur</span></h1>
          <p>Un clic pour lancer leur live, un mot dans le chat, et tu deviens leur premier spectateur.</p>
          <LiveCount />
        </>
      </Reco>
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
          0Viewers fait le tri pour toi, et ici les petits lives passent en premier. Toutes les 15 minutes, le site récupère les lives Twitch
          en français lancés depuis plus de {MIN_LIVE_MINUTES} minutes et qui comptent {MAX_VIEWERS} spectateurs ou moins, en commençant par ceux à 0.
          Tu choisis un live, tu le regardes ici ou sur Twitch, et tu passes dire bonjour. C&apos;est gratuit et tu n&apos;as pas besoin de compte
          sur 0Viewers. Pour écrire dans le chat, il te faut juste ton compte Twitch.
        </p>
      </section>
      <LiveCategories />
      <LiveStats />
    </>
  );
}
