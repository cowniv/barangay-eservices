import Link from "next/link";
import { notFound } from "next/navigation";
import { MoveForm } from "./MoveForm";
import { History } from "@/components/History";
import { StatusBadge } from "@/components/StatusBadge";
import { requireStaff } from "@/lib/auth";
import { db } from "@/lib/db";
import { DOCS, docTitle, peso, type DocType } from "@/lib/documents";
import { actionsFor } from "@/lib/workflow";

export default async function StaffRequest({ params }: { params: Promise<{ id: string }> }) {
  const staff = await requireStaff();
  const { id } = await params;
  const req = await db.request.findUnique({
    where: { id },
    include: { transitions: { orderBy: { createdAt: "asc" } } },
  });
  if (!req) notFound();

  const actions = actionsFor(req.status, staff.role);

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <Link href="/staff" className="text-sm text-brand hover:underline">← Back to requests</Link>
        <div className="card">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="font-mono text-sm text-slate-500">{req.ref}</div>
              <h1 className="text-xl font-bold">{docTitle(req.docType)}</h1>
            </div>
            <StatusBadge status={req.status} />
          </div>
          <dl className="mt-5 grid grid-cols-[140px_1fr] gap-2 text-sm">
            <dt className="text-slate-500">Applicant</dt><dd>{req.fullName}</dd>
            <dt className="text-slate-500">Address</dt><dd>{req.address}</dd>
            <dt className="text-slate-500">Birthdate</dt><dd>{req.birthdate}</dd>
            <dt className="text-slate-500">Years residing</dt><dd>{req.yearsOfResidency}</dd>
            <dt className="text-slate-500">Purpose</dt><dd>{req.purpose}</dd>
            <dt className="text-slate-500">Contact</dt><dd>{req.contact}</dd>
            <dt className="text-slate-500">Standard fee</dt><dd>{peso(DOCS[req.docType as DocType]?.feeCents)}</dd>
            <dt className="text-slate-500">Assessed fee</dt><dd>{peso(req.feeCents)}</dd>
            <dt className="text-slate-500">Payment ref</dt><dd>{req.paymentRef ?? "—"}</dd>
          </dl>
          {req.status === "ISSUED" && (
            <Link href={`/certificate/${req.ref}`} className="btn mt-5">Open certificate</Link>
          )}
        </div>
        <div className="card">
          <h2 className="mb-4 font-semibold">Audit trail</h2>
          <History rows={req.transitions} />
        </div>
      </div>

      <aside className="card h-fit space-y-3">
        <h2 className="font-semibold">Actions</h2>
        {actions.length === 0 ? (
          <p className="text-sm text-slate-500">
            Nothing for a <span className="capitalize">{staff.role}</span> to do at this step.
          </p>
        ) : (
          <MoveForm requestId={req.id} from={req.status} actions={actions.map((a) => ({ to: a.to, label: a.label, needsNote: !!a.needsNote }))} />
        )}
      </aside>
    </div>
  );
}
