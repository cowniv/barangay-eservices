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
