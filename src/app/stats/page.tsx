import type { Metadata } from "next";
import { getLiveCounts } from "@/decouverte";
import { LiveTrend } from "@/ui/LiveTrend";

export const metadata: Metadata = {
  title: "Stats",
  description: "Combien de streams Twitch en français sont en live, et comment ce nombre évolue.",
  alternates: { canonical: "/stats" },
};

const WEEK = 7 * 24 * 3_600_000;
const num = new Intl.NumberFormat("fr-FR");
const day = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });

export default async function Stats() {
  const points = await getLiveCounts();
  const first = points[0];
  const last = points[points.length - 1];
  return (
    <article className="container">
      <h1>Stats</h1>
      <h2>Streams FR en live</h2>
      {last ? (
        <>
          <p>
            <strong>{num.format(last.lives)}</strong> streams en français en live au dernier passage.
            Sur 7 jours (depuis le {day.format(first.at)}) : {last.lives >= first.lives ? "+" : ""}
            {num.format(last.lives - first.lives)}.
          </p>
          <LiveTrend points={points} from={last.at - WEEK} />
          <p>Un point par heure (le maximum vu dans l&apos;heure), sur les 7 derniers jours. Au-delà de 10 000 lives, le compte est un minimum.</p>
        </>
      ) : (
        <p>Collecte en cours : la courbe apparaît après le premier passage.</p>
      )}
    </article>
  );
}
