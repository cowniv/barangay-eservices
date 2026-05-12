import { RequestForm } from "./RequestForm";
import { DOC_TYPES, type DocType } from "@/lib/documents";

export const metadata = { title: "Request a document" };

export default async function RequestPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const initial = DOC_TYPES.includes(type as DocType) ? (type as DocType) : "clearance";
