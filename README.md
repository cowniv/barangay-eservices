# Barangay e-Services

**Roadmap stage:** Phase 8 – Full-Stack · April–May 2026

**Inspired by:** local-government service workflows where every request goes through verification, approval, fee assessment, and issuance

Getting a barangay clearance can mean going back two or three times just to ask "is it ready?". The hard part is not the form but the workflow: who can move a request, to which step, and how each change is recorded. So for this project I made the state machine the center of the app. Citizens file a request and get a reference number, staff move it through the steps based on their role, and once it is issued the citizen can print a certificate with a QR code that anyone can scan to verify.

### Features
- Citizen request form for **Barangay Clearance**, **Certificate of Indigency** and **Certificate of Residency**, validated with **Zod** in a server action
- Reference numbers like `BRGY-2026-7KQ2MX` (no 0/O/1/I so they're easy to read out loud)
- Tracking page by reference number: progress bar, history, fee, payment status
- Explicit state machine in `src/lib/workflow.ts`: `SUBMITTED → UNDER_VERIFICATION → VERIFIED → APPROVED → FEE_ASSESSED → PAID → ISSUED` (+ `REJECTED`)
  - each transition lists which role may do it (clerk, approver, treasurer, citizen)
  - enforced on the server in one function (`applyTransition`); the UI only shows buttons you're allowed to press
  - update uses `where: { status: from }` so two staff clicking at once can't both move it
  - every move is logged with actor, role, note and time (rejections need a note)
- Fee assessment comes from the document table, not the form. Indigency is free, so it's waived and skips straight to Paid
- Mock online payment (GCash / Maya / card) on the tracking page, or over-the-counter by the treasurer
- Issuance generates a printable certificate page with a QR code (`qrcode` package) pointing to `/verify/[ref]`
- Public verify page shows valid/invalid with a masked name
- Staff login with **bcryptjs** and a cookie session stored in the database (httpOnly, 8 hours)
- Staff dashboard with "my queue" (only the steps your role can act on) and status filters
- Seed script with 3 demo staff accounts and 4 requests at different steps

### Tech
Next.js 16 (App Router, Server Components, Server Actions) · React 19 · TypeScript · Prisma + SQLite · Zod · Tailwind CSS v4 · bcryptjs · qrcode

### Run
```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```
Staff sign-in is at `/staff/login`. Usernames are `clerk`, `approver` and `treasurer`; the password is whatever you set as `SEED_STAFF_PASSWORD` in `.env`. Try tracking `BRGY-2026-DEMO04`, it's waiting for payment.

All names and the barangay itself are made up for the demo.

### What I practiced
- Modeling a real workflow as a state machine instead of scattered `if` checks
- Role-based authorization done on the server, not just hidden buttons
- Audit trails and why every status change needs an actor and a reason
- Optimistic concurrency with a conditional update
- Cookie sessions and password hashing without an auth library
- Generating QR codes on the server and making a page that prints cleanly
