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
