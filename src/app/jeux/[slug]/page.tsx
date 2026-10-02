import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MAX_VIEWERS, getCrawl, getZeroViewersStreamers, groupByGame } from "@/decouverte";
import { GameLinks } from "@/ui/GameLinks";
import { StreamerList } from "@/ui/StreamerList";
import styles from "../jeux.module.css";

export const maxDuration = 60;

type Props = { params: Promise<{ slug: string }> };

// slugifyGame never outputs anything else: other input can't be a game
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const EMPTY_TITLE = "Ce jeu n'a personne en live en ce moment";

// cacheComponents rejects an empty list; "_" fails SLUG, so 404
export async function generateStaticParams() {
  const params = groupByGame(await getZeroViewersStreamers()).map(({ slug }) => ({ slug }));
  return params.length > 0 ? params : [{ slug: "_" }];
}

async function load(params: Props["params"]) {
  const { slug } = await params;
  if (slug.length > 100 || !SLUG.test(slug)) notFound();
  const { streamers, crawledAt } = await getCrawl();
  const games = groupByGame(streamers);
  const game = games.find((g) => g.slug === slug);
  return { slug, game, crawledAt, others: games.filter((g) => g !== game) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, game } = await load(params);
  const page = { alternates: { canonical: `/jeux/${slug}` }, openGraph: { url: `/jeux/${slug}`, images: ["/opengraph-image"] } };
  if (!game) return { ...page, title: EMPTY_TITLE, robots: { index: false, follow: true } };
  return {
    ...page,
    title: `Streamers ${game.name} FR à 0 spectateur`,
    description: `Regarde des streamers Twitch français en live sur ${game.name} devant 0 viewer ou presque, et deviens leur premier spectateur. Liste mise à jour toutes les 5 minutes.`,
  };
}

export default async function GamePage({ params }: Props) {
  const { game, crawledAt, others } = await load(params);
  return (
    <section className={`container ${styles.page}`} aria-labelledby="game-title">
      <nav aria-label="Fil d'Ariane" className={styles.crumbs}>
        <ol>
          <li><Link href="/">Accueil</Link></li>
          <li><Link href="/jeux">Jeux</Link></li>
          <li><span aria-current="page">{game?.name ?? "Jeu sans live"}</span></li>
        </ol>
      </nav>
      {game ? (
        <>
          <h1 id="game-title">Streamers <span className="highlight">{game.name}</span> FR à 0 spectateur</h1>
          <p className={styles.intro}>
            {game.count > 1 ? `${game.count} streamers français sont` : "Un streamer français est"} en live sur {game.name} avec {MAX_VIEWERS} spectateurs ou moins&nbsp;: choisis un live et passe dire bonjour dans le chat.
          </p>
          <StreamerList streamers={game.streamers} renderedAt={crawledAt} gamePage />
        </>
      ) : (
        <>
          <h1 id="game-title">{EMPTY_TITLE}</h1>
          <p className={styles.intro}>Personne ne le streame avec {MAX_VIEWERS} spectateurs ou moins. Repasse dans quelques minutes, ou choisis un autre jeu.</p>
        </>
      )}
      <section className={styles.others} aria-labelledby="others-title">
        <h2 id="others-title">Autres jeux en direct</h2>
        {others.length > 0 ? <GameLinks games={others} /> : <p>Aucun autre jeu en direct pour l&apos;instant.</p>}
        <Link href="/streamers" className="btn btn-ghost">Voir tous les streamers</Link>
      </section>
    </section>
  );
}
