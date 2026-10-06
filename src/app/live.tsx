"use client";

import Link from "next/link";
import { MAX_VIEWERS } from "@/decouverte/rule";
import { groupByCategory } from "@/decouverte/categories";
import { CategoryTile } from "@/ui/CategoryLinks";
import { Marquee } from "@/ui/Marquee";
import { useCrawl } from "@/ui/useCrawl";
import styles from "./page.module.css";

const plural = (n: number, word: string) => `${word}${n > 1 ? "s" : ""}`;
const fr = (n: number) => n.toLocaleString("fr-FR");

export function LiveCount() {
  const { crawl } = useCrawl();
  if (!crawl || crawl.liveCount === 0) return <p className={styles.count} aria-hidden="true" />;
  const { liveCount, zeroCount } = crawl;
  return (
    <p className={styles.count}>
      En ce moment, <strong>{fr(zeroCount)}</strong> {plural(zeroCount, "live")} sur <strong>{fr(liveCount)}</strong> en français
      {zeroCount > 1 ? " sont" : " est"} à 0 spectateur ({Math.round((zeroCount / liveCount) * 100)} %).
    </p>
  );
}

export function LiveCategories() {
  const { crawl } = useCrawl();
  const categories = crawl ? groupByCategory(crawl.streamers, crawl.boxArt) : [];
  if (categories.length === 0) return null;
  return (
    <section className={`container ${styles.categories}`} aria-labelledby="categories-title">
      <h2 id="categories-title">Parcours par catégorie</h2>
      <Marquee itemWidth="9rem" secondsPerItem={4} items={categories.map((g) => ({ key: g.slug, node: <CategoryTile category={g} /> }))} />
      <Link href="/categories" className="btn btn-ghost">Toutes les catégories en direct</Link>
    </section>
  );
}

export function LiveStats() {
  const { crawl } = useCrawl();
  if (!crawl) return null;
  const { streamers, liveCount } = crawl;
  const zeros = streamers.filter((s) => s.viewerCount === 0).length;
  return (
    <section className={styles.stats} aria-labelledby="stats-title">
      <div className="container">
        <h2 id="stats-title" className="visually-hidden">En chiffres</h2>
        <p>
          En ce moment, <strong>{zeros}</strong> {plural(zeros, "streamer")} français {zeros > 1 ? "sont" : "est"} en live devant 0 spectateur,
          sur <strong>{streamers.length}</strong> {plural(streamers.length, "live")} à {MAX_VIEWERS} spectateurs ou moins
          et <strong>{fr(liveCount)}</strong> {plural(liveCount, "live")} en français au total.
        </p>
      </div>
    </section>
  );
}
