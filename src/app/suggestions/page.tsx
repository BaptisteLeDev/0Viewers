import type { Metadata } from "next";
import { Suspense } from "react";
import { currentViewer } from "@/compte/viewer";
import { SuggestionForm } from "./SuggestionForm";

export const metadata: Metadata = {
  title: "Boîte à idées",
  description: "Propose une fonctionnalité, signale un bug ou une règle de l'algo à revoir sur 0Viewers.",
  alternates: { canonical: "/suggestions" },
};

async function SuggestionBox() {
  const viewer = await currentViewer();
  if (!viewer) {
    return (
      <p>
        <a className="btn" href="/api/auth/twitch">Se connecter avec Twitch</a>
      </p>
    );
  }
  return <SuggestionForm displayName={viewer.displayName} />;
}

export default function SuggestionsPage() {
  return (
    <article className="container">
      <h1>Boîte à idées</h1>
      <p>
        Une fonctionnalité qui manque, un bug, un streamer écarté à tort par l&apos;algo ? Dis-le ici. Il faut être
        connecté avec Twitch, pour éviter le spam. Chaque proposition est lue.
      </p>
      <Suspense fallback={null}>
        <SuggestionBox />
      </Suspense>
    </article>
  );
}
