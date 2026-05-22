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

  return (
    <div className="mx-auto max-w-md">
      <div className={`card text-center ${valid ? "border-green-300" : "border-red-300"}`}>
        <div className={`text-4xl ${valid ? "text-green-600" : "text-red-600"}`}>{valid ? "✔" : "✖"}</div>
        <h1 className="mt-2 text-xl font-bold">{valid ? "Valid document" : "No valid document found"}</h1>
        <div className="mt-1 font-mono text-sm text-slate-500">{decodeURIComponent(ref)}</div>
        {valid && req ? (
          <dl className="mt-5 grid grid-cols-2 gap-2 text-left text-sm">
            <dt className="text-slate-500">Document</dt>
            <dd>{docTitle(req.docType)}</dd>
            <dt className="text-slate-500">Issued to</dt>
            <dd>{maskName(req.fullName)}</dd>
            <dt className="text-slate-500">Issued on</dt>
            <dd>{req.issuedAt!.toLocaleDateString("en-PH", { dateStyle: "long" })}</dd>
            <dt className="text-slate-500">Issued by</dt>
            <dd>{BARANGAY.name}</dd>
          </dl>
        ) : (
