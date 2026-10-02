export function pickOther(count: number, current: number, rand: () => number = Math.random): number {
  if (count <= 1) return 0;
  const offset = 1 + Math.floor(rand() * (count - 1));
  return (current + offset) % count;
}

export function nextIndex(count: number, current: number): number {
  return count > 0 ? (current + 1) % count : 0;
}
