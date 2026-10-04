import type { Metadata } from "next";
import { Suspense } from "react";
import { contributionOf, currentViewer } from "@/compte/viewer";
import styles from "./profil.module.css";

export const metadata: Metadata = { title: "Mon profil", robots: { index: false, follow: false } };

export default function ProfilPage() {
  return (
    <article className="container">
      <h1>Mon profil</h1>
      <Suspense>
        <Profil />
      </Suspense>
    </article>
  );
}

async function Profil() {
  const viewer = await currentViewer();
  if (!viewer) {
    return (
      <p>
        Connecte-toi pour voir ta contribution. <a href="/api/auth/twitch" className="btn">Se connecter avec Twitch</a>
      </p>
    );
  }
  const { signalements, soutiens } = await contributionOf(viewer.id);
  return (
    <>
      <div className={styles.identity}>
        {/* eslint-disable-next-line @next/next/no-img-element -- Twitch CDN avatar */}
        <img src={viewer.avatarUrl} alt="" width={96} height={96} className={styles.avatar} />
        <div>
          <p className={styles.name}>{viewer.displayName}</p>
          <a href={`https://www.twitch.tv/${viewer.login}`} className={styles.login}>twitch.tv/{viewer.login}</a>
        </div>
      </div>
      <h2>Ta contribution</h2>
      <dl className={styles.stats}>
        <div>
          <dt>Streamers signalés</dt>
          <dd>{signalements}</dd>
        </div>
        <div>
          <dt>Streamers soutenus</dt>
          <dd>{soutiens}</dd>
        </div>
      </dl>
      <form action="/api/auth/logout" method="post">
        <button type="submit" className="btn btn-ghost">Se déconnecter</button>
      </form>
    </>
  );
}
