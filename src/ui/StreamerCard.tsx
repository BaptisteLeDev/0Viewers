"use client";

import Link from "next/link";
import { slugifyGame } from "@/decouverte/games";
import type { Streamer0V } from "@/decouverte/types";
import { PlayerFacade } from "./PlayerFacade";
import { viewerLabel } from "./search";
import styles from "./StreamerCard.module.css";

type Props = { streamer: Streamer0V; active?: boolean; onActivate: () => void; autoplayWhenFits?: boolean; headingLevel?: "h2" | "h3"; linkGame?: boolean };

export function StreamerCard({ streamer, active = false, onActivate, autoplayWhenFits, headingLevel: Heading = "h3", linkGame = true }: Props) {
  const gameSlug = linkGame ? slugifyGame(streamer.gameName) : "";
  return (
    <article className={styles.card}>
      <PlayerFacade streamer={streamer} active={active} onActivate={onActivate} autoplayWhenFits={autoplayWhenFits} />
      <div className={styles.body}>
        <Heading className={styles.name}>{streamer.displayName}</Heading>
        <p className={styles.title}>{streamer.title}</p>
        <p className={styles.meta}>
          <span className={streamer.viewerCount === 0 ? styles.zero : styles.badge}>{viewerLabel(streamer.viewerCount)}</span>
          {gameSlug ? <Link href={`/jeux/${gameSlug}`} className={styles.game}>{streamer.gameName}</Link> : <span>{streamer.gameName}</span>}
        </p>
        <a className={`btn btn-ghost ${styles.link}`} href={`https://www.twitch.tv/${streamer.login}`} target="_blank" rel="noopener noreferrer">
          Ouvrir sur Twitch<span className="visually-hidden"> (nouvel onglet)</span>
        </a>
      </div>
    </article>
  );
}
