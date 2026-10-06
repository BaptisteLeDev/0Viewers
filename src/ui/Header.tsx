"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Account } from "./Account";
import styles from "./Header.module.css";

const LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/streamers", label: "Streamers" },
  { href: "/categories", label: "Catégories" },
];

export function Header() {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  return (
    <header className={styles.header}>
      <nav aria-label="Navigation principale" className={styles.nav}>
        <Link href="/" className={styles.logo}>
          <span className={styles.wordmark}>0Viewers</span>
        </Link>
        <ul className={styles.links}>
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} aria-current={isActive(l.href) ? "page" : undefined}>{l.label}</Link>
            </li>
          ))}
        </ul>
        <Account />
      </nav>
    </header>
  );
}
