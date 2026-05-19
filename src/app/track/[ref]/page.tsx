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
