"use client";

import Link from "next/link";
import { slugifyCategory } from "@/decouverte/categories";
import type { Streamer0V } from "@/decouverte/types";
import { PlayerFacade } from "./PlayerFacade";
import { twitchChannelUrl } from "./player";
import { viewerLabel } from "./search";
import { VoteButtons } from "./VoteButtons";
import styles from "./StreamerCard.module.css";

type Props = { streamer: Streamer0V; onActivate: () => void; headingLevel?: "h2" | "h3"; linkCategory?: boolean };

export function StreamerCard({ streamer, onActivate, headingLevel: Heading = "h3", linkCategory = true }: Props) {
  const categorySlug = linkCategory ? slugifyCategory(streamer.categoryName) : "";
  return (
    // pointer shortcut only: keyboard users already have the Regarder button
    <article className={styles.card} onClick={(e) => { if (!(e.target as Element).closest("a, button")) onActivate(); }}>
      <PlayerFacade streamer={streamer} onPlay={onActivate} />
      <div className={styles.body}>
        <Heading className={styles.name}>{streamer.displayName}</Heading>
        <p className={styles.title}>{streamer.title}</p>
        <p className={styles.meta}>
          <span className={streamer.viewerCount === 0 ? styles.zero : styles.badge}>{viewerLabel(streamer.viewerCount)}</span>
          {categorySlug ? <Link href={`/categories/${categorySlug}`} className={styles.category}>{streamer.categoryName}</Link> : <span>{streamer.categoryName}</span>}
        </p>
        <div className={styles.foot}>
          <VoteButtons broadcasterId={streamer.id} name={streamer.displayName} />
          <a className={styles.link} href={twitchChannelUrl(streamer.login)} target="_blank" rel="noopener noreferrer">
            Ouvrir sur Twitch<span className="visually-hidden"> (nouvel onglet)</span>
            <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3h7v7M13 3 4 12" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}
