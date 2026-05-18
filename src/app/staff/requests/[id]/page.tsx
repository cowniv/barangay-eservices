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
