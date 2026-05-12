"use client";

import { useActionState } from "react";
import { submitRequest, type FormState } from "../actions";
import { DOC_TYPES, DOCS, peso, type DocType } from "@/lib/documents";

function Field({ name, label, errors, children }: { name: string; label: string; errors?: Record<string, string[] | undefined>; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={name} className="label">{label}</label>
      {children}
      {errors?.[name]?.map((e) => <p key={e} className="error">{e}</p>)}
    </div>
  );
}

export function RequestForm({ initialType }: { initialType: DocType }) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitRequest, {});
  const fe = state.fieldErrors;

  return (
    <form action={action} className="card mt-6 space-y-4">
      <fieldset>
        <legend className="label">Document</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {DOC_TYPES.map((t) => (
            <label key={t} className="flex cursor-pointer items-start gap-2 rounded-lg border border-slate-200 p-3 text-sm has-[:checked]:border-brand has-[:checked]:bg-brand-light">
              <input type="radio" name="docType" value={t} defaultChecked={t === initialType} className="mt-1" />
              <span>
                <span className="block font-semibold">{DOCS[t].title}</span>
                <span className="text-slate-500">{peso(DOCS[t].feeCents)}</span>
              </span>
            </label>
          ))}
        </div>
        {fe?.docType?.map((e) => <p key={e} className="error">{e}</p>)}
      </fieldset>

      <Field name="fullName" label="Full name" errors={fe}>
        <input id="fullName" name="fullName" className="input" placeholder="Demo Resident" />
      </Field>
      <Field name="address" label="Address in the barangay" errors={fe}>
        <input id="address" name="address" className="input" placeholder="Demo Address, Purok 2" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="birthdate" label="Birthdate" errors={fe}>
          <input id="birthdate" name="birthdate" type="date" className="input" />
        </Field>
        <Field name="yearsOfResidency" label="Years living here" errors={fe}>
          <input id="yearsOfResidency" name="yearsOfResidency" type="number" min={0} defaultValue={1} className="input" />
        </Field>
      </div>
