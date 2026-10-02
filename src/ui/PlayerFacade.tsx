import type { Streamer0V } from "@/decouverte/types";
import { thumbnailSrc } from "./player";
import styles from "./PlayerFacade.module.css";

export function PlayerFacade({ streamer, onPlay }: { streamer: Streamer0V; onPlay: () => void }) {
  return (
    <div className={styles.player}>
      <button type="button" className={styles.facade} onClick={onPlay}>
        {/* eslint-disable-next-line @next/next/no-img-element -- Twitch resizes, URL churns every 5 min */}
        <img src={thumbnailSrc(streamer.thumbnailUrl, 440, 248)} alt="" width={440} height={248} loading="lazy" className={styles.thumb} />
        <span className={styles.play}>
          <span aria-hidden="true">▶</span> Regarder<span className="visually-hidden"> le live de {streamer.displayName}</span>
        </span>
      </button>
    </div>
  );
}
