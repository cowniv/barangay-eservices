import { headers } from "next/headers";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { PrintButton } from "./PrintButton";
import { db } from "@/lib/db";
import { BARANGAY, docTitle } from "@/lib/documents";

async function baseUrl() {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

const BODY: Record<string, (name: string, address: string, purpose: string, years: number) => string> = {
  clearance: (n, a, p) =>
    `This is to certify that ${n}, of legal age, residing at ${a}, has no derogatory record on file in this barangay as of this date. This clearance is issued upon request for ${p.toLowerCase()}.`,
  indigency: (n, a, p) =>
    `This is to certify that ${n}, residing at ${a}, belongs to an indigent family of this barangay. This certification is issued upon request for ${p.toLowerCase()}.`,
  residency: (n, a, p, y) =>
    `This is to certify that ${n} is a bona fide resident of ${a}, and has been residing in this barangay for ${y} year${y === 1 ? "" : "s"}. This certification is issued upon request for ${p.toLowerCase()}.`,
};

export default async function CertificatePage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const req = await db.request.findUnique({ where: { ref } });
  if (!req || req.status !== "ISSUED" || !req.issuedAt) notFound();

  const verifyUrl = `${await baseUrl()}/verify/${req.ref}`;
  const qr = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 160 });
  const issued = req.issuedAt.toLocaleDateString("en-PH", { dateStyle: "long" });

  return (
    <div className="mx-auto max-w-[800px]">
      <div className="no-print mb-4 flex justify-end">
        <PrintButton />
      </div>
      <article className="border border-slate-300 bg-white p-12 font-serif shadow-sm print:border-0 print:shadow-none">
        <header className="text-center">
          <div className="text-sm">Republic of the Philippines</div>
          <div className="text-sm">{BARANGAY.city}</div>
          <div className="text-lg font-bold uppercase">{BARANGAY.name}</div>
          <div className="text-sm">Office of the Punong Barangay</div>
        </header>
        <h1 className="mt-10 text-center text-2xl font-bold uppercase tracking-widest">{docTitle(req.docType)}</h1>

        <p className="mt-8 font-semibold">TO WHOM IT MAY CONCERN:</p>
        <p className="mt-4 indent-12 leading-8 text-justify">
          {BODY[req.docType](req.fullName.toUpperCase(), req.address, req.purpose, req.yearsOfResidency)}
        </p>
        <p className="mt-4 indent-12 leading-8">Issued this {issued} at {BARANGAY.name}, {BARANGAY.city}.</p>

        <div className="mt-16 flex items-end justify-between">
          <div className="text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt="QR code to verify this certificate" width={120} height={120} />
            <div className="mt-1 font-mono text-xs">{req.ref}</div>
            <div className="text-[10px] text-slate-500">Scan to verify</div>
          </div>
          <div className="text-center">
            <div className="w-56 border-t border-slate-800 pt-1 font-bold">{BARANGAY.captain}</div>
            <div className="text-sm">Punong Barangay</div>
          </div>
        </div>
        <p className="mt-10 text-[10px] text-slate-500">
          OR/Payment: {req.paymentRef} · Not valid without the barangay dry seal · Sample document for a student project
        </p>
      </article>
    </div>
  );
}
