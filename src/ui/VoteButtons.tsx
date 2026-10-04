"use client";

import { useEffect, useState, useSyncExternalStore, useTransition } from "react";
import { parseDisplayCookie } from "@/compte/display";
import { vote } from "@/vote/actions";
import { nextVote, type VoteValue } from "@/vote/rule";
import styles from "./VoteButtons.module.css";

// ponytail: own votes mirrored in localStorage, not read from Neon
// (no DB call per visit). Other device = neutral buttons, server stays right.
const KEY = "0v_votes";
const readVotes = (): Record<string, VoteValue> => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
};
const saveVote = (id: string, value: VoteValue) => {
  const votes = readVotes();
  if (value === 0) delete votes[id];
  else votes[id] = value;
  try {
    localStorage.setItem(KEY, JSON.stringify(votes));
  } catch {}
};

const noSubscribe = () => () => {};

export function VoteButtons({ broadcasterId, name }: { broadcasterId: string; name: string }) {
  const signedIn = useSyncExternalStore(noSubscribe, () => parseDisplayCookie(document.cookie) !== null, () => false);
  const [mine, setMine] = useState<VoteValue>(0);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage only exists after hydration
    setMine(readVotes()[broadcasterId] ?? 0);
  }, [broadcasterId]);

  if (!signedIn) return null;

  const click = (clicked: -1 | 1) => {
    const previous = mine;
    const next = nextVote(mine, clicked);
    setMine(next);
    setError("");
    saveVote(broadcasterId, next);
    startTransition(async () => {
      const result = await vote(broadcasterId, next);
      if (result.ok) return;
      setMine(previous);
      saveVote(broadcasterId, previous);
      setError(result.message);
    });
  };

  return (
    <div className={styles.votes}>
      <button type="button" className={styles.vote} aria-pressed={mine === 1} disabled={pending} onClick={() => click(1)} title="Soutenir ce streamer">
        <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill={mine === 1 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
          <path d="M12 21s-7-4.35-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.65-9.5 9-9.5 9z" />
        </svg>
        <span className="visually-hidden">Soutenir {name}</span>
      </button>
      <button type="button" className={`${styles.vote} ${styles.flag}`} aria-pressed={mine === -1} disabled={pending} onClick={() => click(-1)} title="Signaler : ce live ne correspond pas à l'esprit 0Viewers">
        <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill={mine === -1 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 21V4m0 0h11l-2 4 2 4H5" />
        </svg>
        <span className="visually-hidden">Signaler {name}</span>
      </button>
      <span role="status" className={styles.error}>{error}</span>
    </div>
  );
}
