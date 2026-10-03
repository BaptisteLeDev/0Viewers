import type { Metadata } from "next";
import { MAX_STREAMERS, MAX_VIEWERS, MIN_LIVE_MINUTES } from "@/decouverte";

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
        <em>France</em> ou <em>ville</em>, et ceux dont les tags parlent de radio, de webradio, d&apos;oldies ou
        d&apos;années 70 et 80.
      </p>
      <p>
        Le pseudo est traité avec plus de souplesse : un streamer dont le pseudo contient un de ces mots (par
        exemple « MaxTV ») reste affiché, mais en fin de liste.
      </p>

      <h2>Le reste</h2>
      <p>
        La recommandation de l&apos;accueil est tirée au hasard parmi ces streamers, dans ton navigateur. Aucun
        streamer ne paie ni ne s&apos;inscrit pour apparaître. Le code de l&apos;algo est public sur GitHub.
      </p>
    </article>
  );
}
