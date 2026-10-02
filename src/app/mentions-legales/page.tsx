import type { Metadata } from "next";
import { REPO_URL } from "@/ui/Footer";

export const metadata: Metadata = {
  title: "Mentions légales et confidentialité",
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegales() {
  return (
    <article className="container">
      <h1>Mentions légales et confidentialité</h1>

      <h2>Éditeur</h2>
      <p>
        0Viewers est édité par un particulier, à titre non professionnel, qui a choisi de rester anonyme
        (art. 6-III-2 de la loi n° 2004-575 du 21 juin 2004, LCEN). Ses coordonnées ont été communiquées à
        l&apos;hébergeur. Contact : <a href={`${REPO_URL}/issues`}>ouvrir une issue sur GitHub</a>.
      </p>

      <h2>Hébergement</h2>
      <p>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis. <a href="https://vercel.com">vercel.com</a></p>

      <h2>Données personnelles (RGPD)</h2>
      <p>
        Le site ne dépose aucun cookie, n&apos;utilise aucun outil de mesure d&apos;audience et ne demande aucune
        donnée. Seul l&apos;hébergeur traite des journaux techniques (adresse IP, navigateur) pour servir les
        pages et assurer la sécurité, conformément à sa{" "}
        <a href="https://vercel.com/legal/privacy-policy">politique de confidentialité</a>.
      </p>
      <p>
        Le lecteur vidéo Twitch n&apos;est chargé que si tu cliques pour lancer un live. Twitch peut alors
        déposer ses propres cookies, régis par sa{" "}
        <a href="https://www.twitch.tv/p/legal/privacy-notice/">politique de confidentialité</a>.
      </p>
      <p>
        Tu disposes d&apos;un droit de réclamation auprès de la <a href="https://www.cnil.fr">CNIL</a>.
      </p>

      <h2>Contenus</h2>
      <p>
        Les noms, images et streams affichés proviennent de l&apos;API publique de Twitch et restent la
        propriété de leurs auteurs. 0Viewers n&apos;est ni affilié ni approuvé par Twitch. Le code source est{" "}
        <a href={REPO_URL}>public sur GitHub</a>.
      </p>
    </article>
  );
}
