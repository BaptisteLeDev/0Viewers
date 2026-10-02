"use client";

export default function AppError({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="container" role="alert">
      <h1>Twitch ne répond pas</h1>
      <p>Impossible de récupérer les streamers pour le moment. Ce n&apos;est pas de ta faute.</p>
      <button type="button" className="btn" onClick={reset}>Réessayer</button>
    </section>
  );
}
