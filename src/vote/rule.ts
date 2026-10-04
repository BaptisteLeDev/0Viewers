export const HIDE_AT = 10;

// 1 = Soutien, -1 = Signalement, 0 = vote retiré
export type VoteValue = -1 | 0 | 1;

const BROADCASTER_ID = /^\d{1,20}$/;

export function parseVote(broadcasterId: unknown, value: unknown): { broadcasterId: string; value: VoteValue } | null {
  if (typeof broadcasterId !== "string" || !BROADCASTER_ID.test(broadcasterId)) return null;
  if (value !== -1 && value !== 0 && value !== 1) return null;
  return { broadcasterId, value };
}

// Clicking the active button clears it, the other one switches.
export const nextVote = (current: VoteValue, clicked: -1 | 1): VoteValue => (current === clicked ? 0 : clicked);
