export const HIDE_AT = 10;

// 1 = Soutien, -1 = Signalement, 0 = vote retiré
export type VoteValue = -1 | 0 | 1;

const BROADCASTER_ID = /^\d{1,20}$/;

export const parseBroadcasterId = (id: unknown): string | null =>
  typeof id === "string" && BROADCASTER_ID.test(id) ? id : null;

export function parseVote(broadcasterId: unknown, value: unknown): { broadcasterId: string; value: VoteValue } | null {
  const id = parseBroadcasterId(broadcasterId);
  if (!id || (value !== -1 && value !== 0 && value !== 1)) return null;
  return { broadcasterId: id, value };
}

// Clicking the active button clears it, the other one switches.
export const nextVote = (current: VoteValue, clicked: -1 | 1): VoteValue => (current === clicked ? 0 : clicked);

// Arrival time of the HIDE_AT-th Signalement (ms), null if not hidden.
// An admin unhide resets the count: only later Signalements re-hide.
export function hiddenSince(signalementsAt: number[], unhiddenAt: number | null): number | null {
  const counted = signalementsAt.filter((at) => unhiddenAt === null || at > unhiddenAt).sort((a, b) => a - b);
  return counted.length >= HIDE_AT ? counted[HIDE_AT - 1] : null;
}
