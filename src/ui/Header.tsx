import Link from "next/link";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <nav aria-label="Navigation principale" className={`container ${styles.nav}`}>
        <Link href="/" className={styles.logo}>0Viewers</Link>
        <ul className={styles.links}>
          <li><Link href="/">Accueil</Link></li>
          <li><Link href="/streamers">Streamers</Link></li>
        </ul>
      </nav>
    </header>
  );
}
