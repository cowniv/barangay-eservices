import { db } from "@/lib/db";
import { BARANGAY, docTitle } from "@/lib/documents";

export const metadata = { title: "Verify a certificate" };

// Shows only what's needed to confirm a printed copy is genuine.
function maskName(name: string) {
  return name
    .split(/\s+/)
    .map((w) => (w.length <= 2 ? w : w[0] + "*".repeat(w.length - 2) + w[w.length - 1]))
    .join(" ");
}

export default async function VerifyPage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const req = await db.request.findUnique({ where: { ref: decodeURIComponent(ref).toUpperCase() } });
  const valid = req?.status === "ISSUED" && req.issuedAt;

