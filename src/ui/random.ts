export function pickOther(count: number, current: number, rand: () => number = Math.random): number {
  if (count <= 1) return 0;
  const offset = 1 + Math.floor(rand() * (count - 1));
  return (current + offset) % count;
}

export function nextIndex(count: number, current: number): number {
  return count > 0 ? (current + 1) % count : 0;
}

/** count distinct indexes in [0, size), partial Fisher-Yates */
export function sample(size: number, count: number, rand: () => number = Math.random): number[] {
  const pool = Array.from({ length: size }, (_, i) => i);
  const n = Math.min(count, size);
  for (let i = 0; i < n; i++) {
    const j = i + Math.floor(rand() * (size - i));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
}
