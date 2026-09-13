# 20 — Medical Records

## 1. Purpose
One complete, chronological, shareable clinical record per patient across OPD, IPD, tele, and daycare: encounters, SOAP notes, diagnoses, prescriptions, orders, therapy sessions, masked psychiatry notes, documents, consents, certificates, and statutory registers — immutable via addendum-only correction, with print/WhatsApp sharing and retention compliance.
This spec is the read-and-govern layer over records created by specs 01–04: it adds no new clinical capture, only timeline assembly, masking, sharing, registers, immutability, and retention. If it is not on the timeline, it did not happen.

## 2. Ubiquitous Language

| Term | Definition | Example |
|---|---|---|
| Timeline | Chronological view of all encounters + documents | "Full timeline 2022–2026" |
| Encounter | Any OPD/IPD/tele/daycare contact on the timeline | "IPD admission encounter" |
| SOAP Note | Structured clinical note per encounter | "Plan: review with CBC" |
| Diagnosis | ICD-11 (and NAMASTE/TM2 for AYUSH) conclusion | "HTN + TM2-coded Vata disorder" |
| Prescription | Medication list with dosage/duration/Anupana | "Rx with Anupana printed" |
| Order | Lab/radio/pharmacy/referral/admit/surgery request | "CT order with status" |
| Masked Note | Psychiatry/counselling note hidden by role | "Masked unless break-glass" |
| Break-glass | Emergency override access with mandatory audit | "Break-glass by casualty MO" |
| Document | File under /files policy (report/image/consent) | "OPG attached to record" |
| Addendum | Correction appended without altering original | "Addendum corrects dosage" |
| Register Entry | Birth/death/MLC/referral statutory row | "Birth register entry #41" |
| Sharing | Print/WhatsApp delivery of record extracts | "Discharge summary on WhatsApp" |
| Retention | Statutory storage duration per record class | "IPD records 10 years" |
| MRD Completeness | % of records with all required elements | "92% complete this month" |

## 3. Scope In/Out
In: timeline (OPD/IPD/tele/daycare), SOAP, diagnoses, prescriptions (+recently-used, +Anupana), orders, therapy sessions, masked psych notes with break-glass, documents/files policy, sharing (print/WhatsApp incl. family summary for Old Age Home), registers (birth/death/MLC-flag/referral), addendum-only immutability, retention, Data Explorer/Forms/Reports hooks, global search. Out: document/prescription OCR, external HIE/ABDM exchange in v1 (ABHA link only).

## 4. MUST Functionalities

- MUST-001: Doctor/Nurse views unified timeline across OPD/IPD/tele/daycare — _accept: any visit retrievable in <5s._
- MUST-002: System shows vitals + SOAP + diagnoses + prescriptions + orders per encounter — _accept: no encounter renders empty._
- MUST-003: System masks psychiatry/counselling notes by role with break-glass logging — _accept: unauthorized view blocked + audited._
- MUST-004: Staff attaches documents (lab/radio reports, IOPA/OPG/CBCT, consents, certificates, diet sheets, discharge summaries) under /files policy — _accept: each file typed + linked to encounter._
- MUST-005: Doctor issues prescriptions with recently-used shortcut visible in record — _accept: refill traceable to history._
- MUST-006: MRO shares records via print + WhatsApp (prescriptions, summaries, diet, home programs) — _accept: share logged per record._
- MUST-007: MRO generates family summary for Old Age Home residents — _accept: summary aggregates selected residents._
- MUST-008: Staff maintains birth/death/MLC-flag/referral registers — _accept: each register exportable with serial numbers._
- MUST-009: System enforces addendum-only correction on signed records — _accept: original bytes unchanged; addendum appended._
- MUST-010: System audits every view/edit of sensitive notes — _accept: audit shows who/when/why._
- MUST-011: MRO tracks discharge-summary pending/completed status — _accept: pending list per ward._
- MUST-012: System enforces retention per Clinical Establishments Act — _accept: purge blocked before retention expiry._
- MUST-013: Staff finds records via global search (patient/phone/ABHA/diagnosis) — _accept: search returns in <5s._
- MUST-014: MRO archives consents with linked records — _accept: consent retrievable from encounter._
- MUST-015: Merged duplicates preserve full history of both records — _accept: timeline shows pre-merge sources._

## 5. SHOULD P1
- SHOULD-01: MRD completeness dashboard with drill-down.
- SHOULD-02: Records-issued log with delivery receipts.
- SHOULD-03: Diagnosis-volume trends with pathy split.
- SHOULD-04: Auto-flag incomplete discharge summaries at 24h.
- SHOULD-05: Consent-expiry reminders for long-stay patients.

## 6. Entities & States
Encounter (Open/Signed), Diagnosis, Prescription, Order (Open/Completed), ClinicalNote (Visible/Masked), Document (Uploaded/Verified), DischargeSummary (Pending/Issued), RegisterEntry (Draft/Final), ShareLog.

## 7. Workflows
- Encounter → Notes/Diagnosis → Orders/Prescription → Documents attach → Authorize → Share (print/WhatsApp) → Archive → Recall on revisit.
- Correction: signed record → addendum by authorizer → version chained → re-share if needed.
- Break-glass: request → reason → time-boxed access → auto audit entry.
- Registers: clinical event → register draft → MRO finalization → serial-numbered export.

## 8. Business Rules
- Prescription requires diagnosis; psychiatry notes masked by role.
- Signed/authorized record immutable; corrections via addendum only.
- Retention per Clinical Establishments Act; consent archived with record.
- Every sensitive-note view/edit audited; break-glass requires reason.
- Sharing logged; WhatsApp shares use approved templates.
- Registers are append-only; voiding an entry requires MRO reason and preserves the serial sequence.

## 9. CX Requirements
- Timeline readable on mobile with encounter-type color coding.
- Full timeline printable without broken pages/images.
- Masked notes show clear "restricted" placeholder, not blank space.
- Sharing actions confirm recipient number before sending.
- Global search tolerant of spelling/phone-format variants.

## 10. Reports & Acceptance
Reports: MRD completeness, pending discharge summaries, diagnosis volumes, referral register, records-issued log, break-glass audit. Acceptance: any visit <5s retrieval timed; full timeline prints cleanly; addendum path preserves original + audit in test; masked-note access blocked without break-glass.
Old Age Home family summaries countable per home per month.
