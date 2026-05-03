"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, destroySession, requireStaff } from "@/lib/auth";
import { db } from "@/lib/db";
import { DOC_TYPES, DOCS, type DocType } from "@/lib/documents";
import { newPaymentRef, newReference } from "@/lib/ref";
import { applyTransition, TransitionError } from "@/lib/transition";

export type FormState = { error?: string; fieldErrors?: Record<string, string[] | undefined> };

// ---------- Citizen: submit a request ----------

const requestSchema = z.object({
  docType: z.enum(DOC_TYPES, { message: "Choose a document" }),
  fullName: z.string().trim().min(3, "Enter your full name").max(100),
  address: z.string().trim().min(8, "Enter your house no., street and purok").max(200),
  birthdate: z.iso.date("Enter your birthdate"),
  yearsOfResidency: z.coerce.number().int().min(0).max(120),
  purpose: z.string().trim().min(3, "What will you use it for?").max(200),
  contact: z
    .string()
    .trim()
    .regex(/^(09\d{9}|[^@\s]+@[^@\s]+\.[^@\s]+)$/, "Enter a mobile number (09xxxxxxxxx) or email"),
});

export async function submitRequest(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = requestSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

