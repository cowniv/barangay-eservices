import { RequestForm } from "./RequestForm";
import { DOC_TYPES, type DocType } from "@/lib/documents";

export const metadata = { title: "Request a document" };

export default async function RequestPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const initial = DOC_TYPES.includes(type as DocType) ? (type as DocType) : "clearance";
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">Request a document</h1>
      <p className="mt-1 text-sm text-slate-600">
        You&apos;ll get a reference number right after submitting. Keep it, you&apos;ll need it to track and claim your
        document.
      </p>
      <RequestForm initialType={initial} />
    </div>
  );
}
