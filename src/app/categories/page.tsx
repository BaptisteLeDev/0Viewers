import type { Metadata } from "next";
import { MAX_VIEWERS } from "@/decouverte";
import { CategorySearch } from "@/ui/CategorySearch";
import { LiveCategoryLinks } from "@/ui/CategoryLinks";
import styles from "./categories.module.css";

export const metadata: Metadata = {
  title: "Catégories en direct avec des petits streamers FR",
  description: "Les catégories Twitch streamées en ce moment par des streamers français à 0 viewer ou presque. Choisis une catégorie et découvre ses petits lives.",
  alternates: { canonical: "/categories" },
};

export default function CategoriesPage() {
  return (
    <section className={`container ${styles.page}`} aria-labelledby="categories-title">
      <h1 id="categories-title">Catégories en direct avec des <span className="highlight">petits streamers FR</span></h1>
      <p className={styles.intro}>
        Les catégories streamées en ce moment sur Twitch par des streamers français à {MAX_VIEWERS} spectateurs ou moins. Le chiffre indique le nombre de lives.
        Choisis une catégorie pour voir qui la streame.
      </p>
      <div className={styles.search}>
        <CategorySearch />
      </div>
      <LiveCategoryLinks empty={<p>Aucune catégorie en direct pour l&apos;instant. Repasse dans quelques minutes.</p>} />
    </section>
  );
}
