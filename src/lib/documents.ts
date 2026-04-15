export const DOC_TYPES = ["clearance", "indigency", "residency"] as const;
export type DocType = (typeof DOC_TYPES)[number];

export const DOCS: Record<DocType, { title: string; feeCents: number; blurb: string }> = {
  clearance: {
    title: "Barangay Clearance",
    feeCents: 10000,
    blurb: "For employment, business permits, loans and other transactions.",
  },
  indigency: {
    title: "Certificate of Indigency",
    feeCents: 0,
    blurb: "For medical, burial or educational assistance. Free of charge.",
  },
  residency: {
    title: "Certificate of Residency",
    feeCents: 5000,
    blurb: "Proof that you live in the barangay, e.g. for school or bank requirements.",
  },
};

export const BARANGAY = {
  name: "Barangay Masigla",
  city: "Sample City",
  captain: "Hon. Juan Dela Cruz",
};

export function peso(cents: number | null | undefined) {
