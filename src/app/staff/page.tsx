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
