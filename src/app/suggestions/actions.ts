"use server";

import { currentViewer } from "@/compte/viewer";
import { MAX_PER_DAY, parseSuggestion, saveSuggestion } from "@/suggestion";

export type SendState = { ok: boolean; message: string } | null;

const MESSAGES = {
  ok: "Merci, ta proposition est bien arrivée.",
  limit: `Tu as déjà envoyé ${MAX_PER_DAY} propositions aujourd'hui. Reviens demain.`,
  unavailable: "Envoi impossible pour le moment. Réessaie plus tard.",
};

export async function sendSuggestion(_: SendState, form: FormData): Promise<SendState> {
  const viewer = await currentViewer();
  if (!viewer) return { ok: false, message: "Connecte-toi avec Twitch pour envoyer une proposition." };
  const parsed = parseSuggestion(form.get("kind"), form.get("body"));
  if ("error" in parsed) return { ok: false, message: parsed.error };
  const result = await saveSuggestion(viewer.id, parsed);
  return { ok: result === "ok", message: MESSAGES[result] };
}
