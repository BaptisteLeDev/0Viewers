"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { parseDisplayCookie } from "@/compte/display";
import { Account } from "./Account";
import styles from "./Header.module.css";

const LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/streamers", label: "Streamers" },
  { href: "/categories", label: "Catégories" },
];

const ADMIN_LINK = { href: "/admin", label: "Admin" };

const noSubscribe = () => () => {};

function useOwner(hint: boolean): boolean {
  const [owner, setOwner] = useState(false);
  useEffect(() => {
    if (!hint) return;
    let live = true;
    fetch("/api/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((me) => live && setOwner(me?.owner === true))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [hint]);
  return hint && owner;
}

export function Header() {
  const pathname = usePathname();
  // null on the server: header stays static, slots fill after hydration
  const cookie = useSyncExternalStore(noSubscribe, () => document.cookie, () => null);
  const viewer = cookie === null ? undefined : parseDisplayCookie(cookie);
  const links = useOwner(viewer?.owner === true) ? [...LINKS, ADMIN_LINK] : LINKS;
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  return (
    <header className={styles.header}>
      <nav aria-label="Navigation principale" className={styles.nav}>
        <Link href="/" className={styles.logo}>
          <span className={styles.wordmark}>0Viewers</span>
        </Link>
        <ul className={styles.links}>
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} aria-current={isActive(l.href) ? "page" : undefined}>{l.label}</Link>
            </li>
          ))}
        </ul>
        <Account viewer={viewer} />
      </nav>
    </header>
  );
}
