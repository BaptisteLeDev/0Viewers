import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container">
      <h1>Page introuvable</h1>
      <p>Cette page n&apos;existe pas ou plus.</p>
      <Link href="/" className="btn">Retour à l&apos;accueil</Link>
    </section>
  );
}
