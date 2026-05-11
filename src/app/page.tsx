import Link from "next/link";
import { goToTracking } from "./actions";
import { DOC_TYPES, DOCS, peso } from "@/lib/documents";

const STEPS = ["Request", "Verification", "Approval", "Fee assessment", "Payment", "Issuance"];

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-brand px-6 py-10 text-white">
