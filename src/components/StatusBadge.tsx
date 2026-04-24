import { STATUS_LABEL, type Status } from "@/lib/workflow";

const COLORS: Record<Status, string> = {
  SUBMITTED: "bg-slate-100 text-slate-700",
  UNDER_VERIFICATION: "bg-amber-100 text-amber-800",
  VERIFIED: "bg-sky-100 text-sky-800",
  APPROVED: "bg-indigo-100 text-indigo-800",
  FEE_ASSESSED: "bg-orange-100 text-orange-800",
  PAID: "bg-teal-100 text-teal-800",
  ISSUED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-700",
};

