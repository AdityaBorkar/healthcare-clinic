# 00 — Overview & Platform Scope

## 1. Purpose

Define the shared platform every clinic and hospital module builds on: one tenant-aware system that covers a 5–30 doctor OPD-only clinic and scales to a 10–100 bed hospital with OPD, IPD, OT, and emergency. This file fixes tiers, roles, views, and platform-wide contracts so all other specs inherit the same language and guarantees.

## 2. Ubiquitous Language

| Term | Definition | Example |
|---|---|---|
| Organization | The hospital or clinic company owning data and subdomain | Fortis Erode owns all its branches |
| Branch | A physical site under an organization with its own schedule and stock | Erode Main vs Perundurai branch |
| Practitioner | Any care-giver who consults or treats: doctor, dentist, vaidya, therapist | Dr. Meena, dental surgeon |
| Patient | A person receiving care, with one longitudinal identity across branches | Mrs. Lakshmi, UHID ERO-10231 |
| Facility | One bookable place or machine with its own calendar | OT-1, MRI-1, Dental Chair-2 |
| Service | A billable or schedulable clinical activity bound to a facility or practitioner | Root canal, MRI brain, physio session |
| Encounter | One clinical contact between a patient and a practitioner | 12-Sep morning OPD consult |
| Episode | A linked chain of encounters for one illness or treatment course | Fracture care over 6 weeks |
| Package | A bundled set of services sold at one price with a validity window | 10-session physio package |
| Pricelist | Branch-wise rate card mapping services to fees | Erode Main consultation ₹300 |
| Appointment | A reserved practitioner plus facility slot for a patient | Tue 10:00 with Dr. Ravi, Room-3 |
| Queue Token | The walk-in sequence number for the day's OPD board | Token 14, General Medicine |
| Sidebar View | Role-tailored navigation: ERP, Doctor, Nursing, Reception | Nurse sees Nursing view only |
| Audit Trail | Immutable who-did-what-when record for every write | User, time, old and new value |

## 3. Scope

**In Scope**

- Clinic tier (5–30 doctors, OPD-only): registration, appointments and queue, specialty EMR, billing, pharmacy, basic reports.
- Hospital tier (10–100 beds): everything in clinic tier plus ADT and beds, nursing and vitals, OT scheduling, emergency, TPA and insurance helpers, duty rosters.
- All specialities in v1: Allopathy, Dental, Ayurveda, Homeopathy, Physio and Rehab, Psychiatry, Old Age Home.
- Cross-cutting platform: subdomain routing, branch selector, role-based access, audit, file policy, print and WhatsApp share, export, search and command palette.

**Out of Scope**

- External live validations: penny-drop bank check, NMC register check, insurance eligibility, CKYC.
- OCR scanning, task and helpdesk ticketing, gate and security module, POS payouts and auto NEFT matching.
- Single sign-on and OIDC, learning management, horizontal multi-region scaling, airgapped on-premise deploy.

## 4. MUST Functionalities

- **MUST-001 — Tier-aware module activation**: What: enabling Hospital tier unlocks ADT, nursing, OT, emergency without reinstall. Who: Org Admin. Accepts: toggling tier shows or hides sidebar modules instantly.
- **MUST-002 — Subdomain tenant resolution**: What: each request resolves organization from host subdomain against public web domain. Who: all users. Accepts: wrong subdomain shows friendly not-found page.
- **MUST-003 — Branch selector in header**: What: switch working branch; lists, queues, and stocks re-scope immediately. Who: all multi-branch users. Accepts: switch branch refreshes queue and pricelist.
- **MUST-004 — Role-based sidebar views**: What: ERP, Doctor, Nursing, Reception views show only permitted modules. Who: all roles. Accepts: receptionist never sees HR payroll views.
- **MUST-005 — Universal audit trail**: What: every create, edit, delete, and PHI view writes user plus timestamp. Who: system for all users. Accepts: audit log replays any record change.
- **MUST-006 — File policy enforcement**: What: images convert to WebP and reject above 2MB; PDFs reject above 20MB under files area. Who: all uploaders. Accepts: oversize file rejected with size message.
- **MUST-007 — Validated forms everywhere**: What: standard form with smart fields and valibot schemas; Tamil labels where configured. Who: all data entry users. Accepts: invalid entry blocked with field message.
- **MUST-008 — ICD-11 plus TM2 plus CPT coding**: What: diagnoses code to ICD-11, AYUSH to TM2, procedures to configurable CPT master. Who: doctors, billing. Accepts: invoice carries at least one valid code.
- **MUST-009 — Universal export and print**: What: every list supports CSV export and printer-friendly print. Who: all staff. Accepts: any list exports current filter set.
- **MUST-010 — Global search (Ctrl+F)**: What: one shortcut searches patients, practitioners, services, bills from anywhere. Who: all staff. Accepts: under 3 keystrokes finds returning patient.
- **MUST-011 — Global actions (Ctrl+K)**: What: command palette for register patient, book, collect payment, start encounter. Who: all staff. Accepts: palette completes action in under 3 steps.
- **MUST-012 — Print plus WhatsApp share**: What: slips, prescriptions, bills, and reports print and share via WhatsApp link. Who: reception, billing, nurses. Accepts: share delivers readable PDF on phone.
- **MUST-013 — Bilingual Tamil and English**: What: patient-facing slips and instructions render in Tamil and English. Who: patients, caretakers. Accepts: toggle reprints slip in other language.
- **MUST-014 — Branch-scoped masters by default**: What: practitioners, services, pricelists default to a branch unless marked global. Who: admins. Accepts: new branch starts with copied rate card.

## 5. SHOULD (P1)

- SHOULD-001: Recall engine for follow-up and vaccination reminders via SMS and WhatsApp.
- SHOULD-002: OPD board TV view with token, room, and delay announcements.
- SHOULD-003: Saved filter views per user for queues, bills, and admissions.
- SHOULD-004: Offline-tolerant queue display that survives short network drops.
- SHOULD-005: Annual census pack: OPD, IPD, OT, pharmacy, and collection summaries.

## 6. Entities & States

- Entities: Organization, Branch, User, Role, Patient, Practitioner, Facility, Service, Appointment, Encounter, Invoice, AuditLog.
- Organization states: trial, active, suspended. Branch states: setup, active, closed.
- Appointment states: booked, checked-in, in-consult, done, no-show, cancelled.
- Encounter states: open, signed, amended. Invoice states: draft, due, partial, paid, refunded.

## 7. Workflows

1. Create organization with subdomain, then first branch and admin user.
2. Configure masters: practitioners, facilities, services, pricelists, billing codes.
3. Publish schedules for practitioners and facilities; open booking.
4. Register or find patient, book appointment or issue queue token.
5. Check in, run encounter, order tests or therapy, raise pharmacy indent.
6. Bill, collect, dispense, schedule follow-up; audit everything.
7. Review daily census, collection, and pending reports; close day.

## 8. Business Rules

1. Organization is always resolved from subdomain; no cross-tenant reads.
2. Every write records actor and timestamp; price or code edits never rewrite history.
3. Lists default to current branch; global view requires explicit permission.
4. PHI access is logged; failed permission attempts are logged.
5. No nested forms in v1; one form submits one record.

## 9. Customer Experience Requirements

- Speed: search under 1 second on 50k patients; list pages under 2 seconds.
- Clicks: returning-patient booking under 3 clicks; bill collection under 2 clicks.
- Print and WhatsApp: every slip prints on A5 and shares legibly on low-end phones.
- Tamil and English: names, instructions, and consent lines bilingual; errors in plain words.
- Error messages: state what happened, what to do next, and whom to call; never raw codes.

## 10. Reports & Acceptance

- Reports: branch-wise OPD and IPD census, collection by mode, module adoption checklist.
- Acceptance: subdomain plus branch switch works; every list has search, export, print; every write is audited with user and timestamp; oversize files rejected with clear message.
