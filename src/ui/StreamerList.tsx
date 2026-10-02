"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useId, useMemo, useRef, useState } from "react";
import { groupByCategory } from "@/decouverte/categories";
import type { Streamer0V } from "@/decouverte/types";
import { DEFAULT_FILTERS, activeCount, applyFilters, parseFilters, toSearch, type Filters } from "./filters";
import { Combobox } from "./Combobox";
import { StreamerCard } from "./StreamerCard";
import { nextIndex } from "./random";
import { Theater } from "./Theater";
import styles from "./StreamerList.module.css";

type Props = { streamers: Streamer0V[]; renderedAt: number; categoryPage?: boolean };

const VIEWER_CHOICES: [Filters["viewers"], string][] = [["", "Tous"], ["0", "0"], ["1-2", "1 à 2"], ["3-5", "3 à 5"]];
const DURATION_CHOICES: [Filters["duration"], string][] = [["", "Toutes"], ["moins-1h", "Moins d'1 h"], ["1-3h", "1 à 3 h"], ["plus-3h", "Plus de 3 h"]];
const CONTENT_CHOICES: [Filters["content"], string][] = [["", "Tous"], ["tout-public", "Tout public"], ["adulte", "Adulte"]];
const SORT_OPTIONS = [
  { value: "spectateurs", label: "Moins de spectateurs" },
  { value: "recent", label: "Live le plus récent" },
  { value: "long", label: "Live le plus long" },
];
const NO_PARAMS = new URLSearchParams();
const FIRST_PAGE = 10;
const PAGE = 25;

// useSearchParams bails out of prerender up to the nearest Suspense:
// the fallback keeps the full default list in the static HTML for SEO.
export function StreamerList(props: Props) {
  return (
    <Suspense fallback={<FilterableList {...props} params={NO_PARAMS} />}>
      <UrlStreamerList {...props} />
    </Suspense>
  );
}

function UrlStreamerList(props: Props) {
  return <FilterableList {...props} params={useSearchParams()} />;
}

// replaceState syncs useSearchParams without the RSC refetch router.replace
// triggers on a search-param-only change, and adds no history entry.
const writeUrl = (f: Filters) => {
  const search = toSearch(f);
  window.history.replaceState(null, "", search ? `?${search}` : window.location.pathname);
};

function FilterableList({ streamers, renderedAt: now, categoryPage = false, params }: Props & { params: { get(name: string): string | null } }) {
  const categories = useMemo(() => groupByCategory(streamers), [streamers]);
  const categoryOptions = useMemo(
    () => [{ value: "", label: "Toutes les catégories" }, ...categories.map((g) => ({ value: g.name, label: g.name, hint: String(g.count) }))],
    [categories],
  );
  const f = useMemo(() => parseFilters(params, categoryPage ? [] : categories.map((g) => g.name)), [params, categories, categoryPage]);
  const [query, setQuery] = useState(f.q);
  const [urlQuery, setUrlQuery] = useState(f.q);
  if (f.q !== urlQuery) {
    setUrlQuery(f.q);
    setQuery(f.q);
  }
  const [openId, setOpenId] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const id = useId();

  useEffect(() => {
    if (query === f.q) return;
    const timer = setTimeout(() => writeUrl({ ...f, q: query }), 250);
    return () => clearTimeout(timer);
  }, [query, f]);

  const current = { ...f, q: query };
  const set = (patch: Partial<Filters>) => writeUrl({ ...current, ...patch });
  const reset = () => {
    setQuery("");
    writeUrl(DEFAULT_FILTERS);
  };
  const shown = applyFilters(streamers, current, now);
  const openIndex = shown.findIndex((s) => s.id === openId);
  if (openId && openIndex === -1) setOpenId(null);
  const active = activeCount(current);
  const [limit, setLimit] = useState(FIRST_PAGE);
  const [infinite, setInfinite] = useState(false);
  const [listKey, setListKey] = useState(toSearch(current));
  if (toSearch(current) !== listKey) {
    setListKey(toSearch(current));
    setLimit(FIRST_PAGE);
    setInfinite(false);
  }
  const visible = shown.slice(0, limit);
  const hasMore = visible.length < shown.length;
  const sentinel = useRef<HTMLDivElement>(null);

  // limit in deps re-observes after each page: still in view -> next page
  useEffect(() => {
    if (!infinite || !sentinel.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setLimit((l) => l + PAGE), { rootMargin: "400px" });
    io.observe(sentinel.current);
    return () => io.disconnect();
  }, [infinite, limit]);
  const dirty = active > 0 || query.trim() !== "";

  return (
    <>
      <div className={styles.search}>
        <label htmlFor={`${id}-q`}>Rechercher un streamer, une catégorie ou un titre</label>
        <input id={`${id}-q`} type="search" value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
      </div>
      <button type="button" className={`btn btn-ghost ${styles.toggle}`} aria-expanded={panelOpen} aria-controls={`${id}-panel`} onClick={() => setPanelOpen((v) => !v)}>
        Filtres{active > 0 && <span className={styles.badge}>{active}<span className="visually-hidden"> actifs</span></span>}
      </button>
      <div id={`${id}-panel`} className={styles.panel} data-open={panelOpen}>
        <Pills legend="Spectateurs" name={`${id}-viewers`} choices={VIEWER_CHOICES} value={current.viewers} onChange={(viewers) => set({ viewers })} />
        <Pills legend="Durée du live" name={`${id}-duration`} choices={DURATION_CHOICES} value={current.duration} onChange={(duration) => set({ duration })} />
        <Pills legend="Public" name={`${id}-content`} choices={CONTENT_CHOICES} value={current.content} onChange={(content) => set({ content })} />
        {!categoryPage && (
          <Combobox label="Catégorie" searchable placeholder="Rechercher une catégorie" emptyText="Aucune catégorie en live" options={categoryOptions} value={current.category} onChange={(category) => set({ category })} />
        )}
        <Combobox label="Trier par" options={SORT_OPTIONS} value={current.sort} onChange={(sort) => set({ sort: sort as Filters["sort"] })} />
      </div>
      <div className={styles.status}>
        <p aria-live="polite" className={styles.count}>{shown.length} streamer{shown.length > 1 ? "s" : ""} trouvé{shown.length > 1 ? "s" : ""}</p>
        {dirty && shown.length > 0 && <button type="button" className="btn btn-ghost" onClick={reset}>Réinitialiser</button>}
      </div>
      {shown.length === 0 ? (
        <div className={styles.empty}>
          <p>Aucun streamer ne correspond à ces filtres.</p>
          <button type="button" className="btn" onClick={reset}>Réinitialiser</button>
        </div>
      ) : (
        <ul className={styles.grid}>
          {visible.map((s) => (
            <li key={s.id}>
              <StreamerCard headingLevel="h2" streamer={s} linkCategory={!categoryPage} onActivate={() => setOpenId(s.id)} />
            </li>
          ))}
        </ul>
      )}
      {hasMore && !infinite && (
        <button type="button" className={`btn btn-ghost ${styles.more}`} onClick={() => { setLimit((l) => l + PAGE); setInfinite(true); }}>
          Voir plus
        </button>
      )}
      {hasMore && infinite && <div ref={sentinel} aria-hidden="true" />}
      <Theater
        streamer={shown[openIndex] ?? null}
        onClose={() => setOpenId(null)}
        onNext={shown.length > 1 ? () => setOpenId(shown[nextIndex(shown.length, openIndex)].id) : undefined}
      />
    </>
  );
}

type PillsProps<T extends string> = { legend: string; name: string; choices: [T, string][]; value: T; onChange: (value: T) => void };

function Pills<T extends string>({ legend, name, choices, value, onChange }: PillsProps<T>) {
  return (
    <fieldset className={styles.pills}>
      <legend>{legend}</legend>
      <div className={styles.pillRow}>
        {choices.map(([v, label]) => (
          <label key={v || "all"} className={styles.pill}>
            <input type="radio" name={name} value={v} checked={value === v} onChange={() => onChange(v)} />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
