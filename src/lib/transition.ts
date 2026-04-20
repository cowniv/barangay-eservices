import "server-only";
import { Prisma } from "@prisma/client";
import { db } from "./db";
import { canTransition, findRule, type Actor } from "./workflow";

export class TransitionError extends Error {}

type Move = {
  requestId: string;
  from: string; // status the actor saw on screen
  to: string;
