"use client";

import Link from "next/link";
import { groupByCategory, type LiveCategory } from "@/decouverte/categories";
import { thumbnailSrc } from "./player";
import { useCrawl } from "./useCrawl";
import styles from "./CategoryLinks.module.css";

export function CategoryTile({ category }: { category: LiveCategory }) {
  return (
    <Link href={`/categories/${category.slug}`} className={styles.tile}>
      {category.boxArtUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- Twitch CDN resizes via the URL template
        <img src={thumbnailSrc(category.boxArtUrl, 144, 192)} alt="" width={144} height={192} loading="lazy" className={styles.art} />
      ) : (
        <span className={styles.art} aria-hidden="true" />
      )}
      <span className={styles.name}>{category.name}</span>
      <span className={styles.count}>{category.count}<span className="visually-hidden"> live{category.count > 1 ? "s" : ""}</span></span>
    </Link>
  );
}

export function CategoryLinks({ categories }: { categories: LiveCategory[] }) {
  return (
    <ul className={styles.grid}>
      {categories.map((g) => (
        <li key={g.slug}>
          <CategoryTile category={g} />
        </li>
      ))}
    </ul>
  );
}

// exclude: slug of the current category page
export function LiveCategoryLinks({ exclude, empty }: { exclude?: string; empty: React.ReactNode }) {
  const { crawl } = useCrawl();
  if (!crawl) return null;
  const categories = groupByCategory(crawl.streamers, crawl.boxArt).filter((g) => g.slug !== exclude);
  return categories.length > 0 ? <CategoryLinks categories={categories} /> : empty;
}
