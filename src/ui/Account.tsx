"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { parseDisplayCookie } from "@/compte/display";
import styles from "./Header.module.css";

const noSubscribe = () => () => {};

export function Account() {
  // null on the server: header stays static, slot fills after hydration
  const cookie = useSyncExternalStore(noSubscribe, () => document.cookie, () => null);
  if (cookie === null) return null;
  const viewer = parseDisplayCookie(cookie);
  if (!viewer) {
    return (
      // plain <a>: route handler redirect, no client prefetch
      <a href="/api/auth/twitch" className={styles.account}>Se connecter avec Twitch</a>
    );
  }
  return (
    <Link href="/profil" className={styles.profile} aria-label={`Mon profil (${viewer.displayName})`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- Twitch CDN avatar, next/image needs remotePatterns for 32px */}
      <img src={viewer.avatarUrl} alt="" width={32} height={32} className={styles.avatar} />
    </Link>
  );
}
