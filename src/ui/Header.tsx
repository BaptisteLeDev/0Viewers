import Link from "next/link";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <nav aria-label="Navigation principale" className={`container ${styles.nav}`}>
        <Link href="/" className={styles.logo}>
          {/* eslint-disable-next-line @next/next/no-img-element -- static svg, next/image adds nothing */}
          <img src="/icon.svg" alt="" width={28} height={28} className={styles.mark} />
          <span className={styles.wordmark}>0Viewers</span>
        </Link>
        <ul className={styles.links}>
          <li><Link href="/">Accueil</Link></li>
          <li><Link href="/streamers">Streamers</Link></li>
        </ul>
      </nav>
    </header>
  );
}
