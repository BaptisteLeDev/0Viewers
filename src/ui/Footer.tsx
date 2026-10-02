import Link from "next/link";
import styles from "./Footer.module.css";

export const AUTHOR_URL = "https://github.com/BaptisteLeDev";
export const REPO_URL = `${AUTHOR_URL}/0Viewers`;

export function Footer() {
  return (
    <footer className={styles.footer}>
      <p>0Viewers n&apos;est pas affilié à Twitch.</p>
      <ul className={styles.links}>
        <li><Link href="/mentions-legales">Mentions légales et confidentialité</Link></li>
        <li><Link href="/credits">Crédits</Link></li>
        <li><a href={REPO_URL} rel="noopener">Code source</a></li>
        <li><a href={AUTHOR_URL} rel="noopener">Mon GitHub</a></li>
      </ul>
    </footer>
  );
}
