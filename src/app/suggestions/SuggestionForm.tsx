"use client";

import { useActionState } from "react";
import { MAX_LENGTH, MIN_LENGTH, SUGGESTION_KINDS } from "@/suggestion/rule";
import { sendSuggestion, type SendState } from "./actions";
import styles from "./suggestions.module.css";

export function SuggestionForm({ displayName }: { displayName: string }) {
  const [state, action, pending] = useActionState<SendState, FormData>(sendSuggestion, null);
  return (
    <form action={action} className={styles.form}>
      <p>Connecté en tant que <strong>{displayName}</strong>.</p>
      <label htmlFor="kind">Type</label>
      <select id="kind" name="kind" required defaultValue="feature">
        {Object.entries(SUGGESTION_KINDS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>
      <label htmlFor="body">Ta proposition</label>
      <textarea id="body" name="body" required minLength={MIN_LENGTH} maxLength={MAX_LENGTH} rows={6} />
      <button type="submit" className="btn" disabled={pending}>{pending ? "Envoi…" : "Envoyer"}</button>
      <p role="status" className={state?.ok === false ? styles.error : undefined}>{state?.message}</p>
    </form>
  );
}
