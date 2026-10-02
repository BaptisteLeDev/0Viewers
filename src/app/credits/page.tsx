import type { Metadata } from "next";
import { AUTHOR_URL, REPO_URL } from "@/ui/Footer";

export const metadata: Metadata = {
  title: "Crédits",
  alternates: { canonical: "/credits" },
};

export default function Credits() {
  return (
    <article className="container">
      <h1>Crédits</h1>

      <h2>Données</h2>
      <p>
        Les streams, catégories et images viennent de l&apos;<a href="https://dev.twitch.tv/docs/api/">API Twitch</a>{" "}
        (Helix). Twitch et son logo sont des marques de Twitch Interactive, Inc. 0Viewers n&apos;est ni affilié
        ni approuvé par Twitch.
      </p>

      <h2>Conception et développement</h2>
      <p>
        Site conçu et développé par <a href={AUTHOR_URL}>BaptisteLeDev</a>. Le code est{" "}
        <a href={REPO_URL}>public sur GitHub</a>.
      </p>

      <h2>Outils</h2>
      <p>
        Construit avec <a href="https://nextjs.org">Next.js</a>, hébergé sur <a href="https://vercel.com">Vercel</a>.
        Polices Iceland, Geist et Share Tech Mono via <a href="https://fonts.google.com">Google Fonts</a>{" "}
        (licence SIL Open Font License).
      </p>
    </article>
  );
}
