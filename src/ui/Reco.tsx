"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CardStack } from "./CardStack";
import { nextIndex, sample } from "./random";
import { StreamerCard } from "./StreamerCard";
import { Theater } from "./Theater";
import { useCrawl } from "./useCrawl";
import styles from "./Reco.module.css";

const STACK_SIZE = 5;
const CAROUSEL_SIZE = 12;

type Props = { children: React.ReactNode; featured?: React.ReactNode };

export function Reco({ children, featured }: Props) {
  const { crawl, failed } = useCrawl();
  const streamers = crawl?.streamers ?? [];
  const [picks, setPicks] = useState(() => streamers.slice(0, STACK_SIZE).map((_, i) => i));
  const [theater, setTheater] = useState<{ id: string } | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPicks(sample(streamers.length, STACK_SIZE));
  }, [streamers.length]);

  const openTheater = (id: string) => setTheater({ id });
  const stack = picks.map((i) => streamers[i]).filter(Boolean);
  const live = streamers.slice(0, CAROUSEL_SIZE);
  const theaterIndex = theater ? streamers.findIndex((s) => s.id === theater.id) : -1;
  const listLabel = streamers.length > 1 ? `Voir les ${streamers.length} streamers` : "Voir la liste";

  return (
    <>
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.intro}>
            {children}
            <div className={styles.ctas}>
              {stack[0] && <button type="button" className="btn" onClick={() => openTheater(stack[0].id)}>Regarder maintenant</button>}
              <Link href="/streamers" className="btn btn-ghost">{listLabel}</Link>
            </div>
            {crawl && !stack[0] && <p className={styles.empty}>Aucun streamer français à 0 spectateur en ce moment. Repasse dans quelques minutes.</p>}
            {failed && <p className={styles.empty}>Liste indisponible pour l&apos;instant. Recharge la page dans un moment.</p>}
          </div>
          {(!crawl || stack.length > 0) && (
            <div className={styles.stack}>
              <h2>Cinq lives pris au hasard</h2>
              <CardStack streamers={stack} onPick={openTheater} />
              <p className={styles.hint} aria-hidden="true">Survole pour déplier, clique pour regarder</p>
            </div>
          )}
        </div>
      </section>
      {featured}
      {live.length > 0 && (
        <section className={`container ${styles.live}`} aria-labelledby="live-title">
          <h2 id="live-title">En direct maintenant</h2>
          <ul className={styles.liveList}>
            {live.map((s) => (
              <li key={s.id}><StreamerCard streamer={s} onActivate={() => openTheater(s.id)} /></li>
            ))}
          </ul>
          <Link href="/streamers?spectateurs=0" className="btn">Voir tous les streamers à 0 viewer</Link>
        </section>
      )}
      <Theater
        streamer={streamers[theaterIndex] ?? null}
        onClose={() => setTheater(null)}
        onNext={streamers.length > 1 ? () => setTheater((t) => t && { id: streamers[nextIndex(streamers.length, theaterIndex)].id }) : undefined}
      />
    </>
  );
}
