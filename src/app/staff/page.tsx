import Link from "next/link";
import { logout } from "../actions";
import { StatusBadge } from "@/components/StatusBadge";
import { requireStaff } from "@/lib/auth";
import { db } from "@/lib/db";
import { docTitle } from "@/lib/documents";
import { STATUSES, STATUS_LABEL, TRANSITIONS, type Status } from "@/lib/workflow";

export const metadata = { title: "Staff dashboard" };

export default async function StaffDashboard({ searchParams }: { searchParams: Promise<{ status?: string; mine?: string }> }) {
  const staff = await requireStaff();
  const { status, mine } = await searchParams;

  // "My queue" = statuses this role is allowed to act on
  const myStatuses = [...new Set(TRANSITIONS.filter((t) => t.by.includes(staff.role)).map((t) => t.from))];
  const filter = STATUSES.includes(status as Status) ? [status as Status] : mine === "0" ? undefined : myStatuses;

  const [requests, counts] = await Promise.all([
    db.request.findMany({
      where: filter ? { status: { in: filter } } : undefined,
      orderBy: { createdAt: "asc" },
      take: 100,
    }),
    db.request.groupBy({ by: ["status"], _count: true }),
  ]);
  const countOf = (s: string) => counts.find((c) => c.status === s)?._count ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Requests</h1>
          <p className="text-sm text-slate-600">
            Signed in as <strong>{staff.name}</strong> · <span className="capitalize">{staff.role}</span>
          </p>
        </div>
        <form action={logout}>
          <button className="btn-ghost">Sign out</button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        <Link href="/staff" className={`rounded-full px-3 py-1 ${!status && mine !== "0" ? "bg-brand text-white" : "bg-white border"}`}>My queue</Link>
        <Link href="/staff?mine=0" className={`rounded-full px-3 py-1 ${mine === "0" && !status ? "bg-brand text-white" : "bg-white border"}`}>All</Link>
        {STATUSES.map((s) => (
          <Link key={s} href={`/staff?status=${s}`} className={`rounded-full px-3 py-1 ${status === s ? "bg-brand text-white" : "bg-white border"}`}>
            {STATUS_LABEL[s]} ({countOf(s)})
          </Link>
        ))}
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Document</th>
              <th className="px-4 py-3">Applicant</th>
              <th className="px-4 py-3">Filed</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 font-mono">
                  <Link href={`/staff/requests/${r.id}`} className="text-brand hover:underline">{r.ref}</Link>
                </td>
                <td className="px-4 py-3">{docTitle(r.docType)}</td>
                <td className="px-4 py-3">{r.fullName}</td>
                <td className="px-4 py-3 text-slate-500">{r.createdAt.toLocaleDateString("en-PH")}</td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-500">Nothing here. 🎉</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
