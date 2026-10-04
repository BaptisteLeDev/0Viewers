import type { Metadata } from "next";
import Link from "next/link";
import { CRYPTO_WORDS, GAMBLING, MAX_STREAMERS, MAX_VIEWERS, MEDIA_TAG_WORDS, MEDIA_WORDS, MIN_LIVE_MINUTES } from "@/decouverte";
import { REPO_URL } from "@/ui/Footer";

const RULE_URL = `${REPO_URL}/blob/main/src/decouverte/rule.ts`;
const words = (list: string[]) => list.map((w, i) => <span key={w}>{i > 0 && ", "}<code>{w}</code></span>);

export const metadata: Metadata = {
  title: "Algo",
  description: "Comment 0Viewers choisit les streamers français à peu de viewers, et lesquels il met de côté.",
  alternates: { canonical: "/algo" },
};

export default function Algo() {
  return (
    <article className="container">
      <h1>Algo</h1>

      <h2>Qui est affiché</h2>
      <p>
        Toutes les quelques minutes, 0Viewers récupère via l&apos;API Twitch les streams en direct en langue
        française. Il garde ceux qui ont <strong>{MAX_VIEWERS} viewers ou moins</strong> et qui sont en live depuis{" "}
        <strong>plus de {MIN_LIVE_MINUTES} minutes</strong>, pour ne pas tomber sur un live qui vient à peine de
        démarrer.
      </p>

      <h2>Dans quel ordre</h2>
      <p>
        Les streams à 0 viewer passent en premier, puis ceux qui en ont le moins. À égalité, le live le plus long
        passe devant : il attend quelqu&apos;un depuis plus longtemps. La liste s&apos;arrête à {MAX_STREAMERS} streamers.
      </p>

      <h2>Qui est mis de côté</h2>
      <p>
        Le site veut mettre en avant des personnes qui streament, pas des diffusions automatiques. Sont donc
        écartés les streams dont le titre ou la catégorie contient les mots <em>radio</em>, <em>TV</em>,{" "}
        <em>France</em>, <em>ville</em>, <em>média</em> ou <em>journal</em>, et ceux dont les tags parlent de radio, de webradio, d&apos;oldies ou
        d&apos;années 70 et 80.
      </p>
      <p>
        Le pseudo est traité avec plus de souplesse : un streamer dont le pseudo contient un de ces mots (par
        exemple « MaxTV ») reste affiché, mais en fin de liste.
      </p>
      <p>
        Même idée pour le trading et les cryptos (<em>trading</em>, <em>crypto</em>, <em>BTC</em>) : une chaîne qui
        en parle dans son pseudo, sa bio, ses tags ou sa catégorie est écartée. Si le mot n&apos;apparaît que dans
        le titre du live, le streamer reste affiché, en fin de liste.
      </p>
      <p>
        Les chaînes qui portent le label de classification Twitch <em>Paris</em> (jeux d&apos;argent, poker ou
        ligues fantasy en argent réel) sont aussi écartées.
      </p>
      <p>
        <Link href="/mis-de-cote">Voir les streams mis de côté en ce moment</Link>
      </p>

      <h2>Sur quoi on se base</h2>
      <p>
        Une seule source : l&apos;API officielle de Twitch (Helix). Le site lit les streams en direct en langue
        française (<code>/streams?language=fr</code>), puis pour les streamers retenus leur profil et leur bio
        (<code>/users</code>) et les labels de classification de leur chaîne (<code>/channels</code>). Rien d&apos;autre : pas de
        données achetées, pas de liste tenue à la main.
      </p>
      <p>Les listes exactes utilisées en ce moment, tirées directement du code :</p>
      <dl>
        <dt>Mots « diffusion automatique » (titre, catégorie, tags, pseudo)</dt>
        <dd>{words(MEDIA_WORDS)}</dd>
        <dt>En plus, dans les tags</dt>
        <dd>{words(MEDIA_TAG_WORDS)}</dd>
        <dt>Mots trading et crypto</dt>
        <dd>{words(CRYPTO_WORDS)}</dd>
        <dt>Label de classification Twitch écarté</dt>
        <dd><code>{GAMBLING}</code> (Paris)</dd>
        <dt>Seuils</dt>
        <dd>{MAX_VIEWERS} viewers maximum, live depuis plus de {MIN_LIVE_MINUTES} minutes, {MAX_STREAMERS} streamers au plus.</dd>
      </dl>

      <h2>Open source</h2>
      <p>
        Tout l&apos;algo tient dans un fichier, public : <a href={RULE_URL}>src/decouverte/rule.ts sur GitHub</a>. Le
        reste du site est aussi <a href={REPO_URL}>en accès libre</a>. Tu peux vérifier chaque règle, ou proposer
        une modification dans la <Link href="/suggestions">boîte à idées</Link>.
      </p>

      <h2>Le reste</h2>
      <p>
        La recommandation de l&apos;accueil est tirée au hasard parmi ces streamers, dans ton navigateur. Aucun
        streamer ne paie ni ne s&apos;inscrit pour apparaître.
      </p>
    </article>
  );
}
