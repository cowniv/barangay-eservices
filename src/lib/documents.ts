export const DOC_TYPES = ["clearance", "indigency", "residency"] as const;
export type DocType = (typeof DOC_TYPES)[number];

export const DOCS: Record<DocType, { title: string; feeCents: number; blurb: string }> = {
  clearance: {
    title: "Barangay Clearance",
    feeCents: 10000,
