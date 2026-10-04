export const SUGGESTION_KINDS = { feature: "Nouvelle fonctionnalité", bug: "Correction (bug)", algo: "Algo", autre: "Autre" } as const;
export type SuggestionKind = keyof typeof SUGGESTION_KINDS;
export type Suggestion = { kind: SuggestionKind; body: string };

export const MIN_LENGTH = 10;
export const MAX_LENGTH = 2000;
export const MAX_PER_DAY = 5;

const isKind = (v: unknown): v is SuggestionKind => typeof v === "string" && Object.hasOwn(SUGGESTION_KINDS, v);

export function parseSuggestion(kind: unknown, body: unknown): Suggestion | { error: string } {
  if (!isKind(kind)) return { error: "Choisis un type de proposition." };
  const text = typeof body === "string" ? body.trim() : "";
  if (text.length < MIN_LENGTH) return { error: `Écris au moins ${MIN_LENGTH} caractères.` };
  if (text.length > MAX_LENGTH) return { error: `${MAX_LENGTH} caractères maximum.` };
  return { kind, body: text };
}
