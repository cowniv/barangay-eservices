import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

// Demo accounts only. Everyone shares one password so the demo is easy to try.
const DEMO_PASSWORD = process.env.SEED_STAFF_PASSWORD ?? "barangay123";

const STAFF = [
  { username: "clerk", name: "Demo Clerk", role: "clerk" },
  { username: "approver", name: "Demo Approver", role: "approver" },
  { username: "treasurer", name: "Demo Treasurer", role: "treasurer" },
];

type Step = { to: string; by: string; role: string; note: string };

const SAMPLE: { ref: string; docType: string; fullName: string; purpose: string; steps: Step[]; feeCents?: number }[] = [
  { ref: "BRGY-2026-DEMO01", docType: "clearance", fullName: "Demo Resident One", purpose: "Employment", steps: [] },
  {
    ref: "BRGY-2026-DEMO02",
    docType: "residency",
    fullName: "Demo Resident Two",
    purpose: "School requirement",
    steps: [{ to: "UNDER_VERIFICATION", by: "Demo Clerk", role: "clerk", note: "Checking residency records" }],
  },
  {
    ref: "BRGY-2026-DEMO03",
    docType: "indigency",
    fullName: "Demo Resident Three",
    purpose: "Medical assistance",
    steps: [
      { to: "UNDER_VERIFICATION", by: "Demo Clerk", role: "clerk", note: "Start verification" },
      { to: "VERIFIED", by: "Demo Clerk", role: "clerk", note: "Household listed in demo barangay profile" },
    ],
  },
  {
    ref: "BRGY-2026-DEMO04",
    docType: "clearance",
    fullName: "Demo Resident Four",
    purpose: "Business permit",
