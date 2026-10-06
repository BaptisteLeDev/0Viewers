"use server";

import { updateTag } from "next/cache";
import { currentOwner, currentViewer } from "@/compte/viewer";
import { HIDDEN_TAG, HIDE_AT, castVote, parseBroadcasterId, parseVote, unhide } from "@/vote";

export type VoteResult = { ok: true } | { ok: false; message: string };

export async function vote(broadcasterId: string, value: number): Promise<VoteResult> {
  const viewer = await currentViewer();
  if (!viewer) return { ok: false, message: "Connecte-toi avec Twitch pour voter." };
  const parsed = parseVote(broadcasterId, value);
  if (!parsed) return { ok: false, message: "Vote invalide." };
  try {
    const signalements = await castVote(viewer.id, parsed.broadcasterId, parsed.value);
    if (signalements >= HIDE_AT - 1) updateTag(HIDDEN_TAG);
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "Vote impossible pour le moment." };
  }
}

export async function unhideBroadcaster(formData: FormData): Promise<void> {
  if (!(await currentOwner())) return;
  const broadcasterId = parseBroadcasterId(formData.get("broadcasterId"));
  if (!broadcasterId) return;
  await unhide(broadcasterId);
  updateTag(HIDDEN_TAG);
}
