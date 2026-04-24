import { STATUS_LABEL, type Status } from "@/lib/workflow";

type Row = { id: string; toStatus: string; actorName: string; actorRole: string; note: string; createdAt: Date };

export function History({ rows, showActors = true }: { rows: Row[]; showActors?: boolean }) {
  return (
    <ol className="space-y-3 border-l-2 border-slate-200 pl-4">
      {rows.map((t) => (
        <li key={t.id} className="relative">
          <span className="absolute -left-[23px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-brand" />
          <div className="text-sm font-semibold">{STATUS_LABEL[t.toStatus as Status] ?? t.toStatus}</div>
          <div className="text-sm text-slate-600">{t.note}</div>
          <div className="text-xs text-slate-400">
            {t.createdAt.toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" })}
            {showActors && ` · ${t.actorName} (${t.actorRole})`}
          </div>
        </li>
      ))}
    </ol>
  );
}
