import { STATUS_LABEL, type Status } from "@/lib/workflow";

const COLORS: Record<Status, string> = {
  SUBMITTED: "bg-slate-100 text-slate-700",
  UNDER_VERIFICATION: "bg-amber-100 text-amber-800",
