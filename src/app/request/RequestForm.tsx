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
