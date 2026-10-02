"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Streamer0V } from "@/decouverte/types";
import { CardStack } from "./CardStack";
import { Marquee } from "./Marquee";
import { nextIndex, sample } from "./random";
import { StreamerCard } from "./StreamerCard";
import { Theater } from "./Theater";
import styles from "./Reco.module.css";

const STACK_SIZE = 5;
const CAROUSEL_SIZE = 12;

type Props = { streamers: Streamer0V[]; children: React.ReactNode };

export function Reco({ streamers, children }: Props) {
  const [picks, setPicks] = useState(() => streamers.slice(0, STACK_SIZE).map((_, i) => i));
  const [theater, setTheater] = useState<{ id: string } | null>(null);

  useEffect(() => {
    // random pick after hydration keeps ISR HTML identical for everyone
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
      <section className={`container ${styles.hero}`} aria-labelledby="hero-title">
        {children}
        <div className={styles.ctas}>
          {stack[0] && <button type="button" className="btn" onClick={() => openTheater(stack[0].id)}>Regarder maintenant</button>}
          <Link href="/streamers" className="btn btn-ghost">{listLabel}</Link>
        </div>
        {!stack[0] && <p className={styles.empty}>Aucun streamer français à 0 spectateur en ce moment. Repasse dans quelques minutes.</p>}
      </section>
      {stack.length > 0 && (
        <section className={`container ${styles.stack}`} aria-labelledby="stack-title">
          <h2 id="stack-title">Cinq lives pris au hasard</h2>
          <CardStack streamers={stack} onPick={openTheater} />
        </section>
      )}
      {live.length > 0 && (
        <section className={`container ${styles.live}`} aria-labelledby="live-title">
          <h2 id="live-title">En direct maintenant</h2>
          <Marquee itemWidth="17rem" items={live.map((s) => ({ key: s.id, node: <StreamerCard streamer={s} onActivate={() => openTheater(s.id)} /> }))} />
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
