import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { currentOwner } from "@/compte/viewer";
import { findChannels, getLiveCounts, type LivePoint } from "@/decouverte";
import { LiveTrend } from "@/ui/LiveTrend";
import { twitchChannelUrl } from "@/ui/player";
import { communityActivity, listHidden } from "@/vote";
import { unhideBroadcaster } from "@/vote/actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

const WEEK = 7 * 24 * 3_600_000;
const date = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

// Shell stays empty: nothing admin-related renders before the owner check.
export default function AdminPage() {
  return (
    <Suspense>
      <Admin />
    </Suspense>
  );
}

function Trend({ points, unit }: { points: LivePoint[]; unit: string }) {
  if (points.length === 0) return <p>Pas encore de données.</p>;
  return <LiveTrend points={points} from={points[points.length - 1].at - WEEK} unit={unit} />;
}

async function Admin() {
  if (!(await currentOwner())) notFound();
  const [hidden, lives, activity] = await Promise.all([listHidden(), getLiveCounts(), communityActivity()]);
  const channels = await findChannels(hidden.map((h) => h.broadcasterId)).catch((error) => (console.error(error), new Map()));
  return (
    <article className="container">
      <h1>Admin</h1>
      <h2>Streamers masqués ({hidden.length})</h2>
      {hidden.length === 0 ? (
        <p>Aucun streamer masqué.</p>
      ) : (
        <ol>
          {hidden.map((h) => {
            const channel = channels.get(h.broadcasterId);
            return (
              <li key={h.broadcasterId}>
                {channel ? <a href={twitchChannelUrl(channel.login)} target="_blank" rel="noopener noreferrer">{channel.displayName}</a> : h.broadcasterId}
                {" "}· {h.signalements} signalements · masqué le {date.format(h.hiddenAt)}
                <form action={unhideBroadcaster} style={{ display: "inline", marginInlineStart: "0.5rem" }}>
                  <input type="hidden" name="broadcasterId" value={h.broadcasterId} />
                  <button type="submit" className="btn btn-ghost">Réafficher</button>
                </form>
              </li>
            );
          })}
        </ol>
      )}
      <h2>Lives FR, 7 jours</h2>
      <Trend points={lives} unit="lives FR" />
      <h2>Nouveaux viewers par jour</h2>
      <Trend points={activity.map((d) => ({ at: d.at, lives: d.viewers }))} unit="nouveaux viewers" />
      <h2>Signalements par jour</h2>
      <Trend points={activity.map((d) => ({ at: d.at, lives: d.signalements }))} unit="signalements" />
    </article>
  );
}
