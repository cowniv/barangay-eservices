# Barangay e-Services

**Roadmap stage:** Phase 8 – Full-Stack · April–May 2026

**Inspired by:** local-government service workflows where every request goes through verification, approval, fee assessment, and issuance

Getting a barangay clearance can mean going back two or three times just to ask "is it ready?". The hard part is not the form but the workflow: who can move a request, to which step, and how each change is recorded. So for this project I made the state machine the center of the app. Citizens file a request and get a reference number, staff move it through the steps based on their role, and once it is issued the citizen can print a certificate with a QR code that anyone can scan to verify.

### Features
- Citizen request form for **Barangay Clearance**, **Certificate of Indigency** and **Certificate of Residency**, validated with **Zod** in a server action
