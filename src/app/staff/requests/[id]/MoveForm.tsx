"use client";

import { useActionState } from "react";
import { moveRequest, type FormState } from "../../../actions";

type Option = { to: string; label: string; needsNote: boolean };

export function MoveForm({ requestId, from, actions }: { requestId: string; from: string; actions: Option[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(moveRequest, {});

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="requestId" value={requestId} />
      <input type="hidden" name="from" value={from} />
      <div>
        <label htmlFor="note" className="label">Note</label>
        <textarea id="note" name="note" rows={3} maxLength={300} className="input" placeholder="Optional, required when rejecting" />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <div className="flex flex-col gap-2">
        {actions.map((a) => (
          <button
            key={a.to}
            name="to"
            value={a.to}
            disabled={pending}
            className={a.to === "REJECTED" ? "btn bg-accent" : "btn"}
          >
            {a.label}
          </button>
        ))}
      </div>
    </form>
  );
}
