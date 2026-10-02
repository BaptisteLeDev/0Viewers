import Link from "next/link";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <nav aria-label="Navigation principale" className={styles.nav}>
        <Link href="/" className={styles.logo}>
          {/* eslint-disable-next-line @next/next/no-img-element -- static svg, next/image adds nothing */}
          <img src="/icon.svg" alt="" width={24} height={24} className={styles.mark} />
          <span className={styles.wordmark}>0Viewers</span>
        </Link>
        <ul className={styles.links}>
          <li><Link href="/">Accueil</Link></li>
          <li><Link href="/streamers">Streamers</Link></li>
          <li><Link href="/categories">Catégories</Link></li>
        </ul>
      </nav>
    </header>
  );
}
