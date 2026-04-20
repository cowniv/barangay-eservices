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
