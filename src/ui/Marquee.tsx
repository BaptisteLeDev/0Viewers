import type { CSSProperties, ReactNode } from "react";
import styles from "./Marquee.module.css";

const MIN_ITEMS = 8;

type Props = { items: { key: string; node: ReactNode }[]; itemWidth: string; secondsPerItem?: number };

// Track = 2 identical copies sliding by -50%: the loop seam is invisible.
// Short lists are repeated so one copy stays wider than the viewport.
export function Marquee({ items, itemWidth, secondsPerItem = 6 }: Props) {
  const repeat = items.length > 0 ? Math.ceil(MIN_ITEMS / items.length) : 0;
  const filled = Array.from({ length: repeat }, (_, r) => items.map((i) => ({ ...i, key: `${r}-${i.key}` }))).flat();
  const list = (hidden: boolean) => (
    <ul className={styles.list} aria-hidden={hidden || undefined} inert={hidden || undefined}>
      {filled.map((i, n) => (
        <li key={i.key} aria-hidden={(!hidden && n >= items.length) || undefined} inert={(!hidden && n >= items.length) || undefined}>{i.node}</li>
      ))}
    </ul>
  );
  const style = { "--marquee-item": itemWidth, "--marquee-duration": `${filled.length * secondsPerItem}s` } as CSSProperties;
  return (
    <div className={styles.marquee} style={style}>
      <div className={styles.track}>{list(false)}{list(true)}</div>
    </div>
  );
}
