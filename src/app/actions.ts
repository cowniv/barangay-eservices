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

  const data = parsed.data;
  if (data.docType === "residency" && data.yearsOfResidency < 1) {
    return { fieldErrors: { yearsOfResidency: ["Residency certificates need at least 1 year of residence"] } };
  }

  let ref = "";
  for (let attempt = 0; attempt < 5 && !ref; attempt++) {
    const candidate = newReference();
    const clash = await db.request.findUnique({ where: { ref: candidate }, select: { id: true } });
    if (!clash) ref = candidate;
  }
  if (!ref) return { error: "Could not generate a reference number. Please try again." };

  await db.request.create({
    data: {
      ...data,
      ref,
      transitions: {
        create: { fromStatus: "NEW", toStatus: "SUBMITTED", actorName: data.fullName, actorRole: "citizen", note: "Request submitted online" },
      },
    },
  });
  redirect(`/track/${ref}?new=1`);
}

// ---------- Citizen: track + mock payment ----------

export async function goToTracking(formData: FormData) {
  const ref = String(formData.get("ref") ?? "").trim().toUpperCase();
  if (ref) redirect(`/track/${encodeURIComponent(ref)}`);
}

export async function payOnline(formData: FormData) {
  const ref = String(formData.get("ref") ?? "");
  const method = z.enum(["gcash", "maya", "card"]).catch("gcash").parse(formData.get("method"));
  const req = await db.request.findUnique({ where: { ref } });
  if (!req) redirect("/track");

  try {
    const paymentRef = newPaymentRef();
    await applyTransition({
      requestId: req.id,
      from: "FEE_ASSESSED",
      to: "PAID",
      actor: "citizen",
      actorName: req.fullName,
      note: `Paid online via ${method.toUpperCase()} (mock) · ${paymentRef}`,
      extra: { paymentRef, paidAt: new Date() },
    });
  } catch (e) {
    if (!(e instanceof TransitionError)) throw e;
  }
  revalidatePath(`/track/${ref}`);
  redirect(`/track/${ref}`);
}

// ---------- Staff auth ----------

// Real hash of a throwaway value, so unknown usernames still pay the bcrypt cost.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 10);

const loginSchema = z.object({ username: z.string().trim().min(1), password: z.string().min(1) });

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Enter your username and password." };

  const staff = await db.staff.findUnique({ where: { username: parsed.data.username } });
  // compare against a dummy hash when the user doesn't exist so timing is similar
  const ok = await bcrypt.compare(parsed.data.password, staff?.passwordHash ?? DUMMY_HASH);
  if (!staff || !ok) return { error: "Wrong username or password." };

  await createSession(staff.id);
  redirect("/staff");
}

export async function logout() {
  await destroySession();
  redirect("/staff/login");
}

// ---------- Staff: move a request ----------

const moveSchema = z.object({
  requestId: z.string().min(1),
  from: z.string().min(1),
  to: z.string().min(1),
  note: z.string().trim().max(300).default(""),
});

export async function moveRequest(_prev: FormState, formData: FormData): Promise<FormState> {
  const staff = await requireStaff();
  const parsed = moveSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Invalid action." };
  const { requestId, from, to, note } = parsed.data;

  const req = await db.request.findUnique({ where: { id: requestId } });
  if (!req) return { error: "Request not found." };

  const base = { requestId, from, to, actor: staff.role, actorName: staff.name, staffId: staff.id };

  try {
    if (to === "FEE_ASSESSED") {
      // Fee comes from the document table, never from the form.
      const fee = DOCS[req.docType as DocType].feeCents;
      await db.$transaction(async (tx) => {
        await applyTransition({ ...base, note: note || `Fee assessed: ₱${(fee / 100).toFixed(2)}`, extra: { feeCents: fee } }, tx);
        if (fee === 0) {
          await applyTransition(
            { ...base, from: "FEE_ASSESSED", to: "PAID", note: "Fee waived (free document)", extra: { paidAt: new Date(), paymentRef: "WAIVED" } },
            tx,
          );
        }
      });
    } else if (to === "PAID") {
      await applyTransition({ ...base, note: note || "Paid over the counter", extra: { paidAt: new Date(), paymentRef: newPaymentRef() } });
    } else if (to === "ISSUED") {
      await applyTransition({ ...base, note, extra: { issuedAt: new Date() } });
    } else {
      await applyTransition({ ...base, note });
    }
  } catch (e) {
    if (e instanceof TransitionError) return { error: e.message };
    throw e;
  }

  revalidatePath("/staff");
  revalidatePath(`/staff/requests/${requestId}`);
  return {};
}
