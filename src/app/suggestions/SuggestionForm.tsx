"use client";

import { useActionState, useState } from "react";
import { MAX_LENGTH, MIN_LENGTH, SUGGESTION_KINDS } from "@/suggestion/rule";
import { Combobox } from "@/ui/Combobox";
import { sendSuggestion, type SendState } from "./actions";
import styles from "./suggestions.module.css";

const KINDS = Object.entries(SUGGESTION_KINDS).map(([value, label]) => ({ value, label }));

export function SuggestionForm({ displayName }: { displayName: string }) {
  const [state, action, pending] = useActionState<SendState, FormData>(sendSuggestion, null);
  const [kind, setKind] = useState("feature");
  return (
    <form action={action} className={styles.form}>
      <p>Connecté en tant que <strong>{displayName}</strong>.</p>
      <Combobox label="Type" options={KINDS} value={kind} onChange={setKind} />
      <input type="hidden" name="kind" value={kind} />
      <label htmlFor="body">Ta proposition</label>
      <textarea id="body" name="body" required minLength={MIN_LENGTH} maxLength={MAX_LENGTH} rows={6} />
      <button type="submit" className="btn" disabled={pending}>{pending ? "Envoi…" : "Envoyer"}</button>
      <p role="status" className={state?.ok === false ? styles.error : undefined}>{state?.message}</p>
    </form>
  );
}
