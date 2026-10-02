"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Streamer0V } from "@/decouverte/types";
import { formatLiveDuration } from "./duration";
import { PlayerFacade } from "./PlayerFacade";
import { nextIndex, pickOther } from "./random";
import { viewerLabel } from "./search";
import { StreamerCard } from "./StreamerCard";
import { Theater } from "./Theater";
import styles from "./Reco.module.css";

const GRID_SIZE = 6;

type Props = { streamers: Streamer0V[]; renderedAt: number; children: React.ReactNode };

export function Reco({ streamers, renderedAt, children }: Props) {
  const [index, setIndex] = useState(0);
  const [now, setNow] = useState(renderedAt);
  const [active, setActive] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [rerolled, setRerolled] = useState(false);
  const [theater, setTheater] = useState<{ id: string; chat: boolean } | null>(null);
  const activate = useCallback(() => setActive(true), []);

  useEffect(() => {
    // random pick after hydration keeps ISR HTML identical for everyone
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIndex(Math.floor(Math.random() * streamers.length));
    setActive(false);
    setNow(Date.now());
  }, [streamers.length]);

  const reroll = () => {
    setActive(false);
    setAutoplay(true);
    setRerolled(true);
    setNow(Date.now());
    setIndex((i) => pickOther(streamers.length, i));
  };

  const openTheater = (id: string, chat = false) => {
    setActive(false);
    setAutoplay(false);
    setTheater({ id, chat });
  };

  const streamer = streamers.length > 0 ? streamers[index % streamers.length] : undefined;
  const others = streamers.filter((s) => s.id !== streamer?.id).slice(0, GRID_SIZE);
  const duration = streamer ? formatLiveDuration(streamer.startedAt, now) : "";
  const theaterIndex = theater ? streamers.findIndex((s) => s.id === theater.id) : -1;
  const listLabel = streamers.length > 1 ? `Voir les ${streamers.length} streamers` : "Voir la liste";

  return (
    <>
      <section className={`container ${styles.hero}`} aria-labelledby="hero-title">
        <div className={styles.pitch}>
          {children}
          <div className={styles.ctas}>
            {streamer && (
              <button type="button" className="btn" onClick={() => openTheater(streamer.id)}>Regarder maintenant</button>
            )}
            <Link href="/streamers" className="btn btn-ghost">{listLabel}</Link>
          </div>
        </div>
        {streamer ? (
          <div className={styles.media}>
            <PlayerFacade key={streamer.id} streamer={streamer} active={active} onActivate={activate} autoplayWhenFits={autoplay} onPlay={() => openTheater(streamer.id)} priority />
            <div className={styles.strip}>
              <p className={styles.who}>
                <span className={styles.name}>{streamer.displayName}</span>
                <span>{streamer.gameName}</span>
              </p>
              <p className={styles.meta}>
                {duration && <span>en live depuis {duration}</span>}
                <span className={streamer.viewerCount === 0 ? styles.zero : styles.badge}>{viewerLabel(streamer.viewerCount)}</span>
              </p>
              <p className="visually-hidden" aria-live="polite">{rerolled ? `${streamer.displayName}, ${streamer.gameName}` : ""}</p>
              <div className={styles.actions}>
                {streamers.length > 1 && (
                  <button type="button" className="btn btn-ghost" onClick={reroll}>Autre streamer</button>
                )}
                <button type="button" className="btn btn-ghost" onClick={() => openTheater(streamer.id, true)}>Rejoindre le chat</button>
              </div>
            </div>
          </div>
        ) : (
          <p className={styles.empty}>Aucun streamer français à 0 spectateur en ce moment. Repasse dans quelques minutes.</p>
        )}
      </section>
      {streamer && (
        <section className={`container ${styles.live}`} aria-labelledby="live-title">
          <h2 id="live-title">En direct maintenant</h2>
          {others.length > 0 ? (
            <ul className={styles.grid}>
              {others.map((s) => (
                <li key={s.id}>
                  <StreamerCard streamer={s} onActivate={() => openTheater(s.id)} />
                </li>
              ))}
            </ul>
          ) : (
            <p>Pas d&apos;autre streamer en live pour l&apos;instant. Repasse dans quelques minutes.</p>
          )}
        </section>
      )}
      <Theater
        streamer={streamers[theaterIndex] ?? null}
        chatFirst={theater?.chat}
        onClose={() => setTheater(null)}
        onNext={streamers.length > 1 ? () => setTheater((t) => t && { ...t, id: streamers[nextIndex(streamers.length, theaterIndex)].id }) : undefined}
      />
    </>
  );
}
