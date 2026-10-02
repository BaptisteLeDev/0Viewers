"use client";

import { useEffect, useRef } from "react";
import type { Streamer0V } from "@/decouverte/types";
import { canAutoplay, thumbnailSrc, twitchPlayerSrc } from "./player";
import styles from "./PlayerFacade.module.css";

type Props = {
  streamer: Streamer0V;
  active: boolean;
  onActivate: () => void;
  autoplayWhenFits?: boolean;
  onPlay?: () => void;
  priority?: boolean;
};

export function PlayerFacade({ streamer, active, onActivate, autoplayWhenFits = false, onPlay, priority = false }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const clicked = useRef(false);
  const activateRef = useRef(onActivate);

  // never active during SSR, so window is safe here
  const host = active ? window.location.hostname : null;

  useEffect(() => {
    activateRef.current = onActivate;
  });

  useEffect(() => {
    if (host && clicked.current) frame.current?.focus();
  }, [host]);

  useEffect(() => {
    if (active || !autoplayWhenFits || !box.current) return;
    const el = box.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && canAutoplay(el.getBoundingClientRect())) {
        observer.disconnect();
        activateRef.current();
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [autoplayWhenFits, active]);

  return (
    <div ref={box} className={styles.player}>
      {active && host ? (
        <iframe
          ref={frame}
          className={styles.frame}
          src={twitchPlayerSrc(streamer.login, host, true)}
          title={`Live Twitch de ${streamer.displayName}`}
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      ) : (
        <button type="button" className={styles.facade} onClick={() => { if (onPlay) return onPlay(); clicked.current = true; onActivate(); }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- Twitch resizes, URL churns every 5 min */}
          <img src={thumbnailSrc(streamer.thumbnailUrl, 440, 248)} alt="" width={440} height={248} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} className={styles.thumb} />
          <span className={styles.play}>
            <span aria-hidden="true">▶</span> Regarder<span className="visually-hidden"> le live de {streamer.displayName}</span>
          </span>
        </button>
      )}
    </div>
  );
}
