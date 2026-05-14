"use client";

import { useActionState } from "react";
import { login, type FormState } from "../../actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState<FormState, FormData>(login, {});
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-bold">Staff sign in</h1>
