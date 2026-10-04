"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import type { Streamer0V } from "@/decouverte/types";
import { twitchChannelUrl, twitchChatSrc, twitchPlayerSrc } from "./player";
import { viewerLabel } from "./search";
import { VoteButtons } from "./VoteButtons";
import styles from "./Theater.module.css";

const WIDE = "(min-width: 1024px)";
const subscribeWide = (onChange: () => void) => {
  const query = window.matchMedia(WIDE);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

type Props = { streamer: Streamer0V | null; onClose: () => void; onNext?: () => void };

export function Theater({ streamer, onClose, onNext }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const headingId = useId();
  const [chatOpen, setChatOpen] = useState(true);
  const wide = useSyncExternalStore(subscribeWide, () => window.matchMedia(WIDE).matches, () => false);
  const id = streamer?.id;

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (!id) {
      if (el.open) el.close();
      return;
    }
    if (!el.open) el.showModal();
    heading.current?.focus();
  }, [id]);

  // streamer is null during SSR, so window is safe here
  const host = streamer ? window.location.hostname : "";
  const showChat = wide || chatOpen;

  return (
    <dialog ref={dialog} className={styles.theater} aria-labelledby={streamer ? headingId : undefined} onClose={onClose}>
      {streamer && (
        <>
          <header className={styles.head}>
            {/* eslint-disable-next-line @next/next/no-img-element -- Twitch CDN avatar, tiny */}
            <img src={streamer.profileImageUrl} alt="" width={48} height={48} className={styles.avatar} />
            <div className={styles.who}>
              <h2 id={headingId} ref={heading} tabIndex={-1} className={styles.name}>{streamer.displayName}</h2>
              <p className={styles.meta}>
                <span>{streamer.categoryName}</span>
                <span className={streamer.viewerCount === 0 ? styles.zero : styles.badge}>{viewerLabel(streamer.viewerCount)}</span>
              </p>
            </div>
            {!wide && (
              <button type="button" className={`btn btn-ghost ${styles.chatToggle}`} aria-pressed={chatOpen} aria-label="Chat" title={chatOpen ? "Masquer le chat" : "Afficher le chat"} onClick={() => setChatOpen((v) => !v)}>
                <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </button>
            )}
            <button type="button" className={`btn btn-ghost ${styles.close}`} onClick={() => dialog.current?.close()}>
              Fermer
            </button>
          </header>
          <div className={styles.stage}>
            <iframe
              key={streamer.id}
              className={styles.player}
              src={twitchPlayerSrc(streamer.login, host, true)}
              title={`Live Twitch de ${streamer.displayName}`}
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
          {showChat && (
            <iframe key={`chat-${streamer.id}`} className={styles.chat} src={twitchChatSrc(streamer.login, host)} title={`Chat de ${streamer.displayName}`} />
          )}
          <footer className={styles.foot}>
            <VoteButtons broadcasterId={streamer.id} name={streamer.displayName} />
            <a className="btn btn-ghost" href={twitchChannelUrl(streamer.login)} target="_blank" rel="noopener noreferrer">
              Ouvrir sur Twitch<span className="visually-hidden"> (nouvel onglet)</span>
            </a>
            {onNext && (
              <button type="button" className="btn" onClick={onNext}>Streamer suivant</button>
            )}
          </footer>
        </>
      )}
    </dialog>
  );
}
