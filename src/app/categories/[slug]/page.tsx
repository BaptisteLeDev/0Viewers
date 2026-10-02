import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MAX_VIEWERS, getCrawl, getZeroViewersStreamers, groupByCategory } from "@/decouverte";
import { CategoryLinks } from "@/ui/CategoryLinks";
import { StreamerList } from "@/ui/StreamerList";
import { jsonLd, siteUrl } from "@/site";
import styles from "../categories.module.css";

export const maxDuration = 60;

type Props = { params: Promise<{ slug: string }> };

// slugifyCategory never outputs anything else: other input can't be a category
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const EMPTY_TITLE = "Cette catégorie n'a personne en live en ce moment";

// cacheComponents rejects an empty list; "_" fails SLUG, so 404
export async function generateStaticParams() {
  const params = groupByCategory(await getZeroViewersStreamers()).map(({ slug }) => ({ slug }));
  return params.length > 0 ? params : [{ slug: "_" }];
}

async function load(params: Props["params"]) {
  const { slug } = await params;
  if (slug.length > 100 || !SLUG.test(slug)) notFound();
  const { streamers, boxArt, crawledAt } = await getCrawl();
  const categories = groupByCategory(streamers, boxArt);
  const category = categories.find((g) => g.slug === slug);
  return { slug, category, crawledAt, others: categories.filter((g) => g !== category) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, category } = await load(params);
  const page = { alternates: { canonical: `/categories/${slug}` } };
  if (!category) return { ...page, title: EMPTY_TITLE, robots: { index: false, follow: true } };
  return {
    ...page,
    title: `Streamers ${category.name} FR à 0 spectateur`,
    description: `Regarde des streamers Twitch français en live sur ${category.name} devant 0 viewer ou presque, et deviens leur premier spectateur. Liste mise à jour toutes les 5 minutes.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug, category, crawledAt, others } = await load(params);
  const crumbs = jsonLd({
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${siteUrl()}/` },
      { "@type": "ListItem", position: 2, name: "Catégories", item: `${siteUrl()}/categories` },
      { "@type": "ListItem", position: 3, name: category?.name ?? "Catégorie sans live", item: `${siteUrl()}/categories/${slug}` },
    ],
  });
  return (
    <section className={`container ${styles.page}`} aria-labelledby="category-title">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: crumbs }} />
      <nav aria-label="Fil d'Ariane" className={styles.crumbs}>
        <ol>
          <li><Link href="/">Accueil</Link></li>
          <li><Link href="/categories">Catégories</Link></li>
          <li><span aria-current="page">{category?.name ?? "Catégorie sans live"}</span></li>
        </ol>
      </nav>
      {category ? (
        <>
          <h1 id="category-title">Streamers <span className="highlight">{category.name}</span> FR à 0 spectateur</h1>
          <p className={styles.intro}>
            {category.count > 1 ? `${category.count} streamers français sont` : "Un streamer français est"} en live sur {category.name} avec {MAX_VIEWERS} spectateurs ou moins&nbsp;: choisis un live et passe dire bonjour dans le chat.
          </p>
          <StreamerList streamers={category.streamers} renderedAt={crawledAt} categoryPage />
        </>
      ) : (
        <>
          <h1 id="category-title">{EMPTY_TITLE}</h1>
          <p className={styles.intro}>Personne ne le streame avec {MAX_VIEWERS} spectateurs ou moins. Repasse dans quelques minutes, ou choisis une autre catégorie.</p>
        </>
      )}
      <section className={styles.others} aria-labelledby="others-title">
        <h2 id="others-title">Autres catégories en direct</h2>
        {others.length > 0 ? <CategoryLinks categories={others} /> : <p>Aucune autre catégorie en direct pour l&apos;instant.</p>}
        <Link href="/streamers" className="btn btn-ghost">Voir tous les streamers</Link>
      </section>
    </section>
  );
}
