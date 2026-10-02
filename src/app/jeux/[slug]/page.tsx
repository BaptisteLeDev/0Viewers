import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MAX_VIEWERS, getZeroViewersStreamers, groupByGame } from "@/decouverte";
import { GameLinks } from "@/ui/GameLinks";
import { StreamerList } from "@/ui/StreamerList";
import styles from "../jeux.module.css";

export const revalidate = 300;
export const maxDuration = 60;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

// slugifyGame never outputs anything else: other input can't be a game
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export async function generateStaticParams() {
  return groupByGame(await getZeroViewersStreamers()).map(({ slug }) => ({ slug }));
}

async function load(params: Props["params"]) {
  const { slug } = await params;
  if (slug.length > 100 || !SLUG.test(slug)) notFound();
  const games = groupByGame(await getZeroViewersStreamers());
  const game = games.find((g) => g.slug === slug);
  return { slug, game, name: game?.name ?? slug.replace(/-/g, " "), others: games.filter((g) => g !== game) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, game, name } = await load(params);
  return {
    title: `Streamers ${name} FR à 0 spectateur`,
    description: `Regarde des streamers Twitch français en live sur ${name} devant 0 viewer ou presque, et deviens leur premier spectateur. Liste mise à jour toutes les 5 minutes.`,
    alternates: { canonical: `/jeux/${slug}` },
    openGraph: { url: `/jeux/${slug}`, images: ["/opengraph-image"] },
    ...(game ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function GamePage({ params }: Props) {
  const { game, name, others } = await load(params);
  return (
    <section className={`container ${styles.page}`} aria-labelledby="game-title">
      <nav aria-label="Fil d'Ariane" className={styles.crumbs}>
        <ol>
          <li><Link href="/">Accueil</Link></li>
          <li><Link href="/jeux">Jeux</Link></li>
          <li><span aria-current="page">{name}</span></li>
        </ol>
      </nav>
      <h1 id="game-title">Streamers <span className="highlight">{name}</span> FR à 0 spectateur</h1>
      {game ? (
        <>
          <p className={styles.intro}>
            {game.count > 1 ? `${game.count} streamers français sont` : "Un streamer français est"} en live sur {name} avec {MAX_VIEWERS} spectateurs ou moins&nbsp;: choisis un live et passe dire bonjour dans le chat.
          </p>
          <StreamerList streamers={game.streamers} />
        </>
      ) : (
        <p className={styles.intro}>Personne ne streame {name} en ce moment avec {MAX_VIEWERS} spectateurs ou moins. Repasse dans quelques minutes.</p>
      )}
      <section className={styles.others} aria-labelledby="others-title">
        <h2 id="others-title">Autres jeux en direct</h2>
        {others.length > 0 ? <GameLinks games={others} /> : <p>Aucun autre jeu en direct pour l&apos;instant.</p>}
        <p><Link href="/streamers">Voir tous les streamers</Link></p>
      </section>
    </section>
  );
}
