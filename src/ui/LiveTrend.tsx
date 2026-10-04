"use client";

import { useState } from "react";
import type { LivePoint } from "@/decouverte/types";
import styles from "./LiveTrend.module.css";

const W = 640;
const H = 220;
const PAD = { top: 16, right: 16, bottom: 28, left: 48 };

const time = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const num = new Intl.NumberFormat("fr-FR");

export function LiveTrend({ points }: { points: LivePoint[] }) {
  const [active, setActive] = useState<number | null>(null);
  const first = points[0];
  const last = points[points.length - 1];
  const values = points.map((p) => p.lives);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const t0 = first.at;
  const tSpan = last.at - t0 || 1;
  const x = (at: number) => PAD.left + ((at - t0) / tSpan) * (W - PAD.left - PAD.right);
  const y = (lives: number) => PAD.top + (1 - (lives - min) / span) * (H - PAD.top - PAD.bottom);
  const d = points.map((p, i) => `${i ? "L" : "M"}${x(p.at).toFixed(1)},${y(p.lives).toFixed(1)}`).join("");

  function onMove(event: React.PointerEvent<SVGSVGElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    const at = t0 + (((event.clientX - box.left) / box.width) * W - PAD.left) / (W - PAD.left - PAD.right) * tSpan;
    let best = 0;
    for (let i = 1; i < points.length; i++) if (Math.abs(points[i].at - at) < Math.abs(points[best].at - at)) best = i;
    setActive(best);
  }

  const shown = active === null ? null : points[active];
  return (
    <figure className={styles.figure}>
      <svg viewBox={`0 0 ${W} ${H}`} className={styles.chart} role="img"
        aria-label={`Lives FR de ${num.format(first.lives)} à ${num.format(last.lives)}, du ${time.format(first.at)} au ${time.format(last.at)}`}
        onPointerMove={points.length > 1 ? onMove : undefined} onPointerLeave={() => setActive(null)}>
        {[...new Set([min, max])].map((v) => (
          <g key={v}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(v)} y2={y(v)} className={styles.grid} />
            <text x={PAD.left - 8} y={y(v)} className={styles.axis} textAnchor="end" dominantBaseline="middle">{num.format(v)}</text>
          </g>
        ))}
        <text x={PAD.left} y={H - 8} className={styles.axis}>{time.format(first.at)}</text>
        <text x={W - PAD.right} y={H - 8} className={styles.axis} textAnchor="end">{time.format(last.at)}</text>
        {points.length > 1 && <path d={d} className={styles.line} />}
        {shown && <line x1={x(shown.at)} x2={x(shown.at)} y1={PAD.top} y2={H - PAD.bottom} className={styles.crosshair} />}
        <circle cx={x((shown ?? last).at)} cy={y((shown ?? last).lives)} r={5} className={styles.dot} />
      </svg>
      <figcaption className={styles.tooltip} aria-live="polite">
        {shown ? <><strong>{num.format(shown.lives)}</strong> lives · {time.format(shown.at)}</> : "Survole la courbe pour le détail"}
      </figcaption>
    </figure>
  );
}
