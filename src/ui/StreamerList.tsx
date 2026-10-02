"use client";

import { useId, useState } from "react";
import type { Streamer0V } from "@/decouverte/types";
import { StreamerCard } from "./StreamerCard";
import { nextIndex } from "./random";
import { matchesQuery } from "./search";
import { Theater } from "./Theater";
import styles from "./StreamerList.module.css";

export function StreamerList({ streamers }: { streamers: Streamer0V[] }) {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const inputId = useId();
  const shown = streamers.filter((s) => matchesQuery(s, query));
  const openIndex = shown.findIndex((s) => s.id === openId);

  return (
    <>
      <div className={styles.search}>
        <label htmlFor={inputId}>Rechercher un streamer, un jeu ou un titre</label>
        <input id={inputId} type="search" value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
      </div>
      <p aria-live="polite" className={styles.count}>{shown.length} streamer{shown.length > 1 ? "s" : ""} affiché{shown.length > 1 ? "s" : ""}</p>
      {shown.length === 0 ? (
        <p>Aucun streamer ne correspond à cette recherche.</p>
      ) : (
        <ul className={styles.grid}>
          {shown.map((s) => (
            <li key={s.id}>
              <StreamerCard headingLevel="h2" streamer={s} onActivate={() => setOpenId(s.id)} />
            </li>
          ))}
        </ul>
      )}
      <Theater
        streamer={shown[openIndex] ?? null}
        onClose={() => setOpenId(null)}
        onNext={shown.length > 1 ? () => setOpenId(shown[nextIndex(shown.length, openIndex)].id) : undefined}
      />
    </>
  );
}
