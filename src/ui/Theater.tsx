"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import type { Streamer0V } from "@/decouverte/types";
import { twitchChatSrc, twitchPlayerSrc } from "./player";
import { viewerLabel } from "./search";
import styles from "./Theater.module.css";

const WIDE = "(min-width: 1024px)";
const subscribeWide = (onChange: () => void) => {
  const query = window.matchMedia(WIDE);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

type Props = { streamer: Streamer0V | null; onClose: () => void; onNext?: () => void; chatFirst?: boolean };

export function Theater({ streamer, onClose, onNext, chatFirst = false }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const headingId = useId();
  const [chatOpen, setChatOpen] = useState(chatFirst);
  const wide = useSyncExternalStore(subscribeWide, () => window.matchMedia(WIDE).matches, () => false);
  const id = streamer?.id;
  const [shownId, setShownId] = useState(id);
  if (id !== shownId) {
    setShownId(id);
    setChatOpen(chatFirst);
  }

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
                <span>{streamer.gameName}</span>
                <span className={streamer.viewerCount === 0 ? styles.zero : styles.badge}>{viewerLabel(streamer.viewerCount)}</span>
              </p>
            </div>
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
          {!wide && (
            <button type="button" className={`btn btn-ghost ${styles.chatToggle}`} onClick={() => setChatOpen((v) => !v)}>
              {chatOpen ? "Masquer le chat" : "Afficher le chat"}
            </button>
          )}
          {showChat && (
            <iframe key={`chat-${streamer.id}`} className={styles.chat} src={twitchChatSrc(streamer.login, host)} title={`Chat de ${streamer.displayName}`} />
          )}
          <footer className={styles.foot}>
            <a className="btn btn-ghost" href={`https://www.twitch.tv/${streamer.login}`} target="_blank" rel="noopener noreferrer">
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
