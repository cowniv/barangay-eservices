// The request lifecycle as an explicit state machine.
// Request → Verification → Approval → Fee assessment → Payment → Issuance

export const STATUSES = [
  "SUBMITTED",
  "UNDER_VERIFICATION",
  "VERIFIED",
  "APPROVED",
  "FEE_ASSESSED",
  "PAID",
  "ISSUED",
  "REJECTED",
] as const;
export type Status = (typeof STATUSES)[number];

export const ROLES = ["clerk", "approver", "treasurer"] as const;
export type Role = (typeof ROLES)[number];
export type Actor = Role | "citizen";

type Rule = { from: Status; to: Status; by: Actor[]; label: string; needsNote?: boolean };

export const TRANSITIONS: Rule[] = [
  { from: "SUBMITTED", to: "UNDER_VERIFICATION", by: ["clerk"], label: "Start verification" },
