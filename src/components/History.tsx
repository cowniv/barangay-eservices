import { STATUS_LABEL, type Status } from "@/lib/workflow";

type Row = { id: string; toStatus: string; actorName: string; actorRole: string; note: string; createdAt: Date };

export function History({ rows, showActors = true }: { rows: Row[]; showActors?: boolean }) {
