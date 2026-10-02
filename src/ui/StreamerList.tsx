"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useId, useMemo, useState } from "react";
import { groupByGame } from "@/decouverte/games";
import type { Streamer0V } from "@/decouverte/types";
import { DEFAULT_FILTERS, activeCount, applyFilters, parseFilters, toSearch, type Filters } from "./filters";
import { StreamerCard } from "./StreamerCard";
import { nextIndex } from "./random";
import { Theater } from "./Theater";
import styles from "./StreamerList.module.css";

type Props = { streamers: Streamer0V[]; renderedAt: number; gamePage?: boolean };

const VIEWER_CHOICES: [Filters["viewers"], string][] = [["", "Tous"], ["0", "0"], ["1-2", "1 à 2"], ["3-5", "3 à 5"]];
const DURATION_CHOICES: [Filters["duration"], string][] = [["", "Toutes"], ["moins-1h", "Moins d'1 h"], ["1-3h", "1 à 3 h"], ["plus-3h", "Plus de 3 h"]];
const SORT_CHOICES: [Filters["sort"], string][] = [["spectateurs", "Moins de spectateurs"], ["recent", "Live le plus récent"], ["long", "Live le plus long"]];
const NO_PARAMS = new URLSearchParams();

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

function FilterableList({ streamers, renderedAt: now, gamePage = false, params }: Props & { params: { get(name: string): string | null } }) {
  const games = useMemo(() => groupByGame(streamers), [streamers]);
  const f = useMemo(() => parseFilters(params, gamePage ? [] : games.map((g) => g.name)), [params, games, gamePage]);
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
  const dirty = active > 0 || query.trim() !== "";

  return (
    <>
      <div className={styles.search}>
        <label htmlFor={`${id}-q`}>Rechercher un streamer, un jeu ou un titre</label>
        <input id={`${id}-q`} type="search" value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
      </div>
      <button type="button" className={`btn btn-ghost ${styles.toggle}`} aria-expanded={panelOpen} aria-controls={`${id}-panel`} onClick={() => setPanelOpen((v) => !v)}>
        Filtres{active > 0 && <span className={styles.badge}>{active}<span className="visually-hidden"> actifs</span></span>}
      </button>
      <div id={`${id}-panel`} className={styles.panel} data-open={panelOpen}>
        <Pills legend="Spectateurs" name={`${id}-viewers`} choices={VIEWER_CHOICES} value={current.viewers} onChange={(viewers) => set({ viewers })} />
        <Pills legend="Durée du live" name={`${id}-duration`} choices={DURATION_CHOICES} value={current.duration} onChange={(duration) => set({ duration })} />
        {!gamePage && (
          <div className={styles.field}>
            <label htmlFor={`${id}-game`}>Jeu</label>
            <select id={`${id}-game`} value={current.game} onChange={(e) => set({ game: e.target.value })}>
              <option value="">Tous les jeux</option>
              {games.map((g) => <option key={g.slug} value={g.name}>{g.name} ({g.count})</option>)}
            </select>
          </div>
        )}
        <div className={styles.field}>
          <label htmlFor={`${id}-sort`}>Trier par</label>
          <select id={`${id}-sort`} value={current.sort} onChange={(e) => set({ sort: e.target.value as Filters["sort"] })}>
            {SORT_CHOICES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
      </div>
      <div className={styles.status}>
        <p aria-live="polite" className={styles.count}>{shown.length} streamer{shown.length > 1 ? "s" : ""} affiché{shown.length > 1 ? "s" : ""}</p>
        {dirty && shown.length > 0 && <button type="button" className="btn btn-ghost" onClick={reset}>Réinitialiser</button>}
      </div>
      {shown.length === 0 ? (
        <div className={styles.empty}>
          <p>Aucun streamer ne correspond à ces filtres.</p>
          <button type="button" className="btn" onClick={reset}>Réinitialiser</button>
        </div>
      ) : (
        <ul className={styles.grid}>
          {shown.map((s) => (
            <li key={s.id}>
              <StreamerCard headingLevel="h2" streamer={s} linkGame={!gamePage} onActivate={() => setOpenId(s.id)} />
            </li>
          ))}
        </ul>
      )}
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
