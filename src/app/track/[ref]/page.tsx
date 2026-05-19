import Link from "next/link";
import { notFound } from "next/navigation";
import { payOnline } from "../../actions";
import { History } from "@/components/History";
import { StatusBadge } from "@/components/StatusBadge";
import { db } from "@/lib/db";
import { docTitle, peso } from "@/lib/documents";
import { HAPPY_PATH, STATUS_LABEL, type Status } from "@/lib/workflow";

export default async function TrackRef({
  params,
  searchParams,
}: {
  params: Promise<{ ref: string }>;
  searchParams: Promise<{ new?: string }>;
}) {
  const { ref } = await params;
  const { new: isNew } = await searchParams;
  const req = await db.request.findUnique({
    where: { ref: decodeURIComponent(ref).toUpperCase() },
    include: { transitions: { orderBy: { createdAt: "asc" } } },
  });
  if (!req) notFound();

  const stepIndex = HAPPY_PATH.indexOf(req.status as Status);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {isNew && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          Request submitted! Save your reference number: <strong className="font-mono">{req.ref}</strong>
        </div>
      )}

      <div className="card">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="font-mono text-sm text-slate-500">{req.ref}</div>
            <h1 className="text-xl font-bold">{docTitle(req.docType)}</h1>
            <div className="text-sm text-slate-600">for {req.fullName}</div>
          </div>
          <StatusBadge status={req.status} />
        </div>

        {req.status !== "REJECTED" && (
          <ol className="mt-5 grid grid-cols-7 gap-1">
            {HAPPY_PATH.map((s, i) => (
              <li key={s} title={STATUS_LABEL[s]} className={`h-2 rounded-full ${i <= stepIndex ? "bg-brand" : "bg-slate-200"}`} />
            ))}
          </ol>
        )}

        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
