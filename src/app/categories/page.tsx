import type { Metadata } from "next";
import { MAX_VIEWERS, getCrawl, groupByCategory } from "@/decouverte";
import { CategorySearch } from "@/ui/CategorySearch";
import { CategoryLinks } from "@/ui/CategoryLinks";
import styles from "./categories.module.css";

export const maxDuration = 60;

export const metadata: Metadata = {
  title: "Catégories en direct avec des petits streamers FR",
  description: "Les catégories Twitch streamées en ce moment par des streamers français à 0 viewer ou presque. Choisis une catégorie et découvre ses petits lives.",
  alternates: { canonical: "/categories" },
  openGraph: { url: "/categories", images: ["/opengraph-image"] },
};

export default async function CategoriesPage() {
  const { streamers, boxArt } = await getCrawl();
  const categories = groupByCategory(streamers, boxArt);
  return (
    <section className={`container ${styles.page}`} aria-labelledby="categories-title">
      <h1 id="categories-title">Catégories en direct avec des <span className="highlight">petits streamers FR</span></h1>
      <p className={styles.intro}>
        Les catégories streamées en ce moment sur Twitch par des streamers français à {MAX_VIEWERS} spectateurs ou moins. Le chiffre indique le nombre de lives.
        Choisis une catégorie pour voir qui la streame.
      </p>
      <div className={styles.search}>
        <CategorySearch live={Object.fromEntries(categories.map((g) => [g.slug, g.count]))} />
      </div>
      {categories.length > 0 ? <CategoryLinks categories={categories} /> : <p>Aucune catégorie en direct pour l&apos;instant. Repasse dans quelques minutes.</p>}
    </section>
  );
}
