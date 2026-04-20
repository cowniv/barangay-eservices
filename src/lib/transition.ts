import "server-only";
import { Prisma } from "@prisma/client";
import { db } from "./db";
import { canTransition, findRule, type Actor } from "./workflow";

export class TransitionError extends Error {}

type Move = {
  requestId: string;
  from: string; // status the actor saw on screen
  to: string;
  actor: Actor;
  actorName: string;
  staffId?: string;
  note: string;
  extra?: Prisma.RequestUpdateInput; // e.g. fee, payment ref, issuedAt
};

/**
 * The only place a request's status changes. Checks the rule table, then
 * updates with `where: { status: from }` so two staff clicking at the same
 * time can't both move it, and writes the audit row in the same transaction.
 */
export async function applyTransition(m: Move, tx: Prisma.TransactionClient | typeof db = db) {
  const rule = findRule(m.from, m.to);
  if (!rule || !canTransition(m.from, m.to, m.actor)) {
    throw new TransitionError(`A ${m.actor} can't move a request from ${m.from} to ${m.to}.`);
  }
  if (rule.needsNote && !m.note.trim()) throw new TransitionError("Please add a note explaining why.");

  const run = async (t: Prisma.TransactionClient) => {
    const res = await t.request.updateMany({
