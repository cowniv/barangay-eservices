import { db } from "@/lib/db";
import { BARANGAY, docTitle } from "@/lib/documents";

export const metadata = { title: "Verify a certificate" };

// Shows only what's needed to confirm a printed copy is genuine.
function maskName(name: string) {
  return name
    .split(/\s+/)
