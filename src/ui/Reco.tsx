"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Streamer0V } from "@/decouverte/types";
import { pickOther } from "./random";
import { StreamerCard } from "./StreamerCard";
import { Theater } from "./Theater";
import styles from "./Reco.module.css";

export function Reco({ streamers }: { streamers: Streamer0V[] }) {
  const [index, setIndex] = useState(0);
  const [active, setActive] = useState(false);
  const [theater, setTheater] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const activate = useCallback(() => setActive(true), []);

  useEffect(() => {
    // random pick after hydration keeps ISR HTML identical for everyone
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIndex(Math.floor(Math.random() * streamers.length));
  }, [streamers.length]);

  const reroll = () => {
    setActive(false);
    setIndex((i) => pickOther(streamers.length, i));
  };

  const openTheater = () => {
    setActive(false);
    setAutoplay(false);
    setTheater(true);
  };

  const streamer = streamers[index % streamers.length];
  return (
    <div className={styles.reco}>
      <StreamerCard key={streamer.id} streamer={streamer} active={active} onActivate={activate} autoplayWhenFits={autoplay} headingLevel="h3" />
      <div className={styles.actions}>
        <button type="button" className="btn btn-ghost" onClick={openTheater}>Mode cinéma</button>
        {streamers.length > 1 && (
          <button type="button" className="btn" onClick={reroll}>Autre streamer</button>
        )}
        <Link href="/streamers" className="btn btn-ghost">Voir tous les streamers</Link>
      </div>
      <Theater streamer={theater ? streamer : null} onClose={() => setTheater(false)} onNext={streamers.length > 1 ? reroll : undefined} />
    </div>
  );
}
