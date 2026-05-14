"use client";

import { useActionState } from "react";
import { login, type FormState } from "../../actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState<FormState, FormData>(login, {});
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-bold">Staff sign in</h1>
      <form action={action} className="card mt-6 space-y-4">
        <div>
          <label htmlFor="username" className="label">Username</label>
          <input id="username" name="username" autoComplete="username" className="input" />
        </div>
        <div>
          <label htmlFor="password" className="label">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" className="input" />
        </div>
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        <button className="btn w-full" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
      </form>
    </div>
  );
}
