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
    feeCents: 10000,
    steps: [
      { to: "UNDER_VERIFICATION", by: "Demo Clerk", role: "clerk", note: "Start verification" },
      { to: "VERIFIED", by: "Demo Clerk", role: "clerk", note: "No demo blotter record" },
      { to: "APPROVED", by: "Demo Approver", role: "approver", note: "Approve" },
      { to: "FEE_ASSESSED", by: "Demo Treasurer", role: "treasurer", note: "Fee assessed: ₱100.00" },
    ],
  },
];

async function main() {
  await db.transition.deleteMany();
  await db.request.deleteMany();
  await db.session.deleteMany();
  await db.staff.deleteMany();

  const hash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const staff = await Promise.all(STAFF.map((s) => db.staff.create({ data: { ...s, passwordHash: hash } })));
  const staffId = (name: string) => staff.find((s) => s.name === name)?.id;

  for (const s of SAMPLE) {
    const last = s.steps.at(-1)?.to ?? "SUBMITTED";
    let prev = "SUBMITTED";
    await db.request.create({
      data: {
        ref: s.ref,
        docType: s.docType,
        status: last,
        fullName: s.fullName,
        address: "Demo Address, Barangay Masigla",
        birthdate: "2000-01-01",
        yearsOfResidency: 6,
        purpose: s.purpose,
        contact: "00000000000",
        feeCents: s.feeCents,
        transitions: {
          create: [
            { fromStatus: "NEW", toStatus: "SUBMITTED", actorName: s.fullName, actorRole: "citizen", note: "Request submitted online" },
            ...s.steps.map((st) => {
              const row = { fromStatus: prev, toStatus: st.to, actorName: st.by, actorRole: st.role, staffId: staffId(st.by), note: st.note };
              prev = st.to;
              return row;
            }),
          ],
        },
      },
    });
  }

  console.log(`Seeded ${staff.length} staff (password: ${DEMO_PASSWORD}) and ${SAMPLE.length} requests.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
