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
