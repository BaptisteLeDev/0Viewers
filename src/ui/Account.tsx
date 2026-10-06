"use client";

import Link from "next/link";
import type { ViewerDisplay } from "@/compte/display";
import styles from "./Header.module.css";

// undefined = not hydrated yet: render nothing rather than guess
export function Account({ viewer }: { viewer: ViewerDisplay | null | undefined }) {
  if (viewer === undefined) return null;
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
