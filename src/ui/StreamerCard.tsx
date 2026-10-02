"use client";

import Link from "next/link";
import { slugifyCategory } from "@/decouverte/categories";
import type { Streamer0V } from "@/decouverte/types";
import { PlayerFacade } from "./PlayerFacade";
import { twitchChannelUrl } from "./player";
import { viewerLabel } from "./search";
import styles from "./StreamerCard.module.css";

type Props = { streamer: Streamer0V; onActivate: () => void; headingLevel?: "h2" | "h3"; linkCategory?: boolean };

export function StreamerCard({ streamer, onActivate, headingLevel: Heading = "h3", linkCategory = true }: Props) {
  const categorySlug = linkCategory ? slugifyCategory(streamer.categoryName) : "";
  return (
    <article className={styles.card}>
      <PlayerFacade streamer={streamer} onPlay={onActivate} />
      <div className={styles.body}>
        <Heading className={styles.name}>{streamer.displayName}</Heading>
        <p className={styles.title}>{streamer.title}</p>
        <p className={styles.meta}>
          <span className={streamer.viewerCount === 0 ? styles.zero : styles.badge}>{viewerLabel(streamer.viewerCount)}</span>
          {categorySlug ? <Link href={`/categories/${categorySlug}`} className={styles.category}>{streamer.categoryName}</Link> : <span>{streamer.categoryName}</span>}
        </p>
        <a className={`btn btn-ghost ${styles.link}`} href={twitchChannelUrl(streamer.login)} target="_blank" rel="noopener noreferrer">
          Ouvrir sur Twitch<span className="visually-hidden"> (nouvel onglet)</span>
        </a>
      </div>
    </article>
  );
}
