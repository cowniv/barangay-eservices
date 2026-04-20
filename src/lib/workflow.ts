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
  { from: "UNDER_VERIFICATION", to: "VERIFIED", by: ["clerk"], label: "Mark verified" },
  { from: "UNDER_VERIFICATION", to: "REJECTED", by: ["clerk"], label: "Reject", needsNote: true },
  { from: "VERIFIED", to: "APPROVED", by: ["approver"], label: "Approve" },
  { from: "VERIFIED", to: "REJECTED", by: ["approver"], label: "Reject", needsNote: true },
  { from: "APPROVED", to: "FEE_ASSESSED", by: ["treasurer"], label: "Assess fee" },
  { from: "FEE_ASSESSED", to: "PAID", by: ["citizen", "treasurer"], label: "Record payment" },
  { from: "PAID", to: "ISSUED", by: ["clerk"], label: "Issue document" },
];

export function findRule(from: string, to: string): Rule | undefined {
  return TRANSITIONS.find((t) => t.from === from && t.to === to);
}

export function canTransition(from: string, to: string, actor: Actor): boolean {
  return !!findRule(from, to)?.by.includes(actor);
}

export function actionsFor(from: string, actor: Actor): Rule[] {
  return TRANSITIONS.filter((t) => t.from === from && t.by.includes(actor));
}

export const STATUS_LABEL: Record<Status, string> = {
  SUBMITTED: "Submitted",
  UNDER_VERIFICATION: "Under verification",
  VERIFIED: "Verified",
  APPROVED: "Approved",
  FEE_ASSESSED: "Awaiting payment",
  PAID: "Paid",
  ISSUED: "Issued",
  REJECTED: "Rejected",
};

// Main path used for the progress stepper on the tracking page.
export const HAPPY_PATH: Status[] = ["SUBMITTED", "UNDER_VERIFICATION", "VERIFIED", "APPROVED", "FEE_ASSESSED", "PAID", "ISSUED"];
