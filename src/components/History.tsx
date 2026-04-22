import { STATUS_LABEL, type Status } from "@/lib/workflow";

type Row = { id: string; toStatus: string; actorName: string; actorRole: string; note: string; createdAt: Date };

export function History({ rows, showActors = true }: { rows: Row[]; showActors?: boolean }) {
  return (
    <ol className="space-y-3 border-l-2 border-slate-200 pl-4">
      {rows.map((t) => (
        <li key={t.id} className="relative">
