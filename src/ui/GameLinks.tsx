import Link from "next/link";
import type { Game } from "@/decouverte/games";
import styles from "./GameLinks.module.css";

export function GameLinks({ games }: { games: Game[] }) {
  return (
    <ul className={styles.games}>
      {games.map((g) => (
        <li key={g.slug}>
          <Link href={`/jeux/${g.slug}`} className={styles.game}>
            {g.name}
            <span className={styles.count}>{g.count}<span className="visually-hidden"> live{g.count > 1 ? "s" : ""}</span></span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
