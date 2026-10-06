"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { groupByCategory } from "@/decouverte/categories";
import type { Category } from "@/decouverte/types";
import { Combobox } from "./Combobox";
import { useCrawl } from "./useCrawl";

type Result = { term: string; categories: Category[] } | { term: string; error: true };

export function CategorySearch() {
  const { crawl } = useCrawl();
  const live: Record<string, number> = Object.fromEntries(groupByCategory(crawl?.streamers ?? []).map((g) => [g.slug, g.count]));
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const term = query.trim();

  useEffect(() => {
    if (term.length < 2) return;
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/categories?q=${encodeURIComponent(term)}`, { signal: ctrl.signal });
        if (!res.ok) throw new Error(`categories ${res.status}`);
        const { categories } = (await res.json()) as { categories: Category[] };
        setResult({ term, categories });
      } catch {
        if (!ctrl.signal.aborted) setResult({ term, error: true });
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [term]);

  const current = term.length >= 2 && result?.term === term ? result : null;
  const categories = current && "categories" in current ? current.categories : [];
  const options = categories
    .map((c) => ({ value: c.slug, label: c.name, image: c.boxArtUrl, hint: live[c.slug] ? `${live[c.slug]} en live` : "Personne" }))
    .sort((a, b) => Number(!live[a.value]) - Number(!live[b.value]))
    .filter((o, i, all) => all.findIndex((x) => x.value === o.value) === i);
  const emptyText =
    term.length < 2 ? "Tape au moins 2 lettres" : !current ? "Recherche…" : "error" in current ? "Recherche indisponible, réessaie" : "Aucune catégorie trouvée";

  return (
    <Combobox
      label="Chercher une catégorie Twitch"
      searchable
      placeholder="Minecraft, Just Chatting…"
      options={options}
      value=""
      onQuery={setQuery}
      emptyText={emptyText}
      onChange={(slug) => router.push(`/categories/${slug}`)}
    />
  );
}
