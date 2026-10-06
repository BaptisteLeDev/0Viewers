"use client";

import { useEffect, useState } from "react";
import type { LiveCrawl } from "@/decouverte";

const FRESH_MS = 60_000;
let shared: { at: number; crawl: Promise<LiveCrawl> } | null = null;

// One request shared by every live block of the page view.
function load(): Promise<LiveCrawl> {
  if (!shared || Date.now() - shared.at > FRESH_MS) {
    const crawl = fetch("/api/crawl").then((res) => {
      if (!res.ok) throw new Error(`crawl ${res.status}`);
      return res.json() as Promise<LiveCrawl>;
    });
    shared = { at: Date.now(), crawl };
    crawl.catch(() => (shared = null));
  }
  return shared.crawl;
}

export function useCrawl(): { crawl: LiveCrawl | null; failed: boolean } {
  const [state, setState] = useState<{ crawl: LiveCrawl | null; failed: boolean }>({ crawl: null, failed: false });
  useEffect(() => {
    let mounted = true;
    load().then(
      (crawl) => mounted && setState({ crawl, failed: false }),
      (error) => (console.error(error), mounted && setState({ crawl: null, failed: true })),
    );
    return () => {
      mounted = false;
    };
  }, []);
  return state;
}
