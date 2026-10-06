import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { currentOwner } from "@/compte/viewer";
import { findChannels, getLiveCounts, type Channel, type LivePoint } from "@/decouverte";
import { LiveTrend } from "@/ui/LiveTrend";
import { twitchChannelUrl } from "@/ui/player";
import { communityActivity, listHidden, listLoved, listUnhidden, type Score } from "@/vote";
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

function ChannelLink({ id, channels }: { id: string; channels: Map<string, Channel> }) {
  const channel = channels.get(id);
  return channel ? <a href={twitchChannelUrl(channel.login)} target="_blank" rel="noopener noreferrer">{channel.displayName}</a> : <>{id}</>;
}

const counts = (s: Score) => `${s.soutiens} soutiens · ${s.signalements} signalements`;

function Trend({ points, unit }: { points: LivePoint[]; unit: string }) {
  if (points.length === 0) return <p>Pas encore de données.</p>;
  return <LiveTrend points={points} from={points[points.length - 1].at - WEEK} unit={unit} />;
}

async function Admin() {
  if (!(await currentOwner())) notFound();
  const [hidden, loved, unhidden, lives, activity] = await Promise.all([
    listHidden(), listLoved(), listUnhidden(), getLiveCounts(), communityActivity(),
  ]);
  const hiddenIds = new Set(hidden.map((h) => h.broadcasterId));
  const shownAgain = unhidden.filter((u) => !hiddenIds.has(u.broadcasterId));
  const ids = [...new Set([...hiddenIds, ...loved.map((l) => l.broadcasterId), ...shownAgain.map((u) => u.broadcasterId)])];
  const channels: Map<string, Channel> = await findChannels(ids).catch((error) => (console.error(error), new Map()));
  return (
    <article className="container">
      <h1>Admin</h1>
      <h2>Streamers masqués ({hidden.length})</h2>
      {hidden.length === 0 ? (
        <p>Aucun streamer masqué.</p>
      ) : (
        <ol>
          {hidden.map((h) => (
            <li key={h.broadcasterId}>
              <ChannelLink id={h.broadcasterId} channels={channels} />
              {" "}· {h.signalements} signalements · masqué le {date.format(h.hiddenAt)}
              <form action={unhideBroadcaster} style={{ display: "inline", marginInlineStart: "0.5rem" }}>
                <input type="hidden" name="broadcasterId" value={h.broadcasterId} />
                <button type="submit" className="btn btn-ghost">Réafficher</button>
              </form>
            </li>
          ))}
        </ol>
      )}
      <h2>Réaffichés ({shownAgain.length})</h2>
      {shownAgain.length === 0 ? (
        <p>Aucun streamer réaffiché.</p>
      ) : (
        <ul>
          {shownAgain.map((u) => (
            <li key={u.broadcasterId}>
              <ChannelLink id={u.broadcasterId} channels={channels} /> · {counts(u)} · réaffiché le {date.format(u.unhiddenAt)}
            </li>
          ))}
        </ul>
      )}
      <h2>En love ({loved.length})</h2>
      {loved.length === 0 ? (
        <p>Aucun soutien pour le moment.</p>
      ) : (
        <ol>
          {loved.map((l) => (
            <li key={l.broadcasterId}>
              <ChannelLink id={l.broadcasterId} channels={channels} /> · {counts(l)}
            </li>
          ))}
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
