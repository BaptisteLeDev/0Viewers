import type { Metadata } from "next";
import { getCrawl, type SetAsideReason } from "@/decouverte";
import { twitchChannelUrl } from "@/ui/player";
import { viewerLabel } from "@/ui/search";

export const maxDuration = 60;

// ponytail: public for now, put behind auth when an admin area exists
export const metadata: Metadata = {
  title: "Streams mis de côté",
  description: "Les lives à peu de viewers que l'algo de 0Viewers écarte en ce moment, et pourquoi.",
  robots: { index: false },
};

const REASONS: Record<SetAsideReason, string> = {
  media: "Radio, TV, diffusion automatique",
  crypto: "Trading, crypto",
  gambling: "Paris (jeux d'argent)",
};

export default async function SetAsidePage() {
  const { setAside } = await getCrawl();
  return (
    <article className="container">
      <h1>Streams mis de côté</h1>
      <p>Lives qui remplissent les critères de viewers et de durée, mais que l&apos;algo écarte. {setAside.length} en ce moment.</p>
      {(Object.keys(REASONS) as SetAsideReason[]).map((reason) => {
        const streams = setAside.filter((s) => s.reason === reason);
        if (streams.length === 0) return null;
        return (
          <section key={reason} aria-labelledby={`reason-${reason}`}>
            <h2 id={`reason-${reason}`}>{REASONS[reason]} ({streams.length})</h2>
            <ul>
              {streams.map((s) => (
                <li key={s.id}>
                  <a href={twitchChannelUrl(s.login)} target="_blank" rel="noopener noreferrer">{s.displayName}</a>
                  {" "}· {s.categoryName} · {viewerLabel(s.viewerCount)} · <span>{s.title}</span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </article>
  );
}
