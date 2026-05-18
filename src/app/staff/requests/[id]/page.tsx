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
