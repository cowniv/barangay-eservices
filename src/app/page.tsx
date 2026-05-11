import Link from "next/link";
import { goToTracking } from "./actions";
import { DOC_TYPES, DOCS, peso } from "@/lib/documents";

const STEPS = ["Request", "Verification", "Approval", "Fee assessment", "Payment", "Issuance"];

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-brand px-6 py-10 text-white">
        <h1 className="text-3xl font-bold">Barangay documents, without the long line</h1>
        <p className="mt-2 max-w-xl text-white/80">
          Request a clearance or certificate online, follow it with your reference number, pay, and print it once
          it&apos;s issued.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/request" className="btn bg-white text-brand">Request a document</Link>
          <form action={goToTracking} className="flex gap-2">
            <input name="ref" placeholder="BRGY-2026-XXXXXX" className="input w-52 text-slate-800" />
            <button className="btn-ghost">Track</button>
