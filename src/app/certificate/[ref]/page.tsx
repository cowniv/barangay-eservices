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

