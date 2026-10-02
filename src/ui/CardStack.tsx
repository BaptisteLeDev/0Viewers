import type { CSSProperties } from "react";
import type { Streamer0V } from "@/decouverte/types";
import { thumbnailSrc } from "./player";
import { viewerLabel } from "./search";
import styles from "./CardStack.module.css";

type Props = { streamers: Streamer0V[]; onPick: (id: string) => void };

export function CardStack({ streamers, onPick }: Props) {
  const middle = (streamers.length - 1) / 2;
  return (
    <ul className={styles.stack}>
      {streamers.map((s, i) => (
        <li key={s.id} className={styles.card} style={{ "--i": i - middle } as CSSProperties}>
          <button type="button" className={styles.button} onClick={() => onPick(s.id)}>
            {/* eslint-disable-next-line @next/next/no-img-element -- Twitch resizes, URL churns every 5 min */}
            <img src={thumbnailSrc(s.thumbnailUrl, 440, 248)} alt="" width={440} height={248} className={styles.thumb} />
            <span className={styles.label}>
              <span className={styles.name}>{s.displayName}</span>
              <span className={styles.category}>{s.categoryName}</span>
            </span>
            <span className="visually-hidden">, {viewerLabel(s.viewerCount)}. Regarder le live</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
