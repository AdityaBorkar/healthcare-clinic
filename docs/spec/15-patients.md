# 15 — Patients

## 1. Purpose

Give every person one longitudinal identity across OPD, IPD, pathies, branches, and years — found in seconds, safe to merge, fully consented — so no visit starts from zero and no history is ever lost.

## 2. Ubiquitous Language

| Term | Definition | Example |
|---|---|---|
| Patient | A person with a durable identity and visit history | UHID ERO-10231 |
| UHID | The org-wide unique health identity printed on slips | ERO-10231 |
| ABHA | National health ID linked for record portability | ABHA address linked |
| Guardian | Contact person for minors or dependent elders | Son Kumar, mobile noted |
| Family Link | Relationship joining members of one household | Wife and two children linked |
| Dedupe | The check that prevents creating a second record | Phone plus DOB match found |
| Merge Request | Admin-approved joining of duplicate records | Merge ERO-99 into ERO-10231 |
| Timeline | Chronological view of encounters, orders, and files | Five years in one scroll |
| Flag | A prominent safety or service marker on the record | Infectious, senior citizen |
| MLC | Medico-legal case needing police and register protocol | Road accident MLC |
| Consent | Recorded permission for procedure, tele, or sharing | Surgery consent signed |
| Recall | A due follow-up or preventive reminder | Diabetes review due |
| Allergy | Substance and reaction recorded for safety | Penicillin rash |
| Document | An uploaded report, certificate, or scan | Discharge summary PDF |
| Communication Log | History of SMS and WhatsApp sent per patient | Bill shared on WhatsApp |

## 3. Scope

**In Scope**

- Registration with demographics, contact, photo, language, guardian, ABHA link, family linking, allergies, chronic flags.
- Phone and ABHA dedupe, admin-approved audited merge, full timeline of encounters, prescriptions, lab and radio reports, admissions, therapy packages, certificates, consents, files.
- Safety and service flags, SMS and WhatsApp communication for slips, reports, recalls, and family updates, consent archive, explorer, forms, reports hooks, universal export and print.

**Out of Scope**

- CKYC live validation, OCR data extraction, insurance eligibility checks.

## 4. MUST Functionalities

- **MUST-001 — Fast registration**: What: capture demographics, contact, language, guardian in one form. Who: Reception. Accepts: new registration under 2 minutes.
- **MUST-002 — ABHA linking**: What: store and verify ABHA ID against the record. Who: Reception. Accepts: ABHA badge visible on header.
- **MUST-003 — Family linking**: What: join household members with relationships. Who: Reception. Accepts: family list opens from any member.
- **MUST-004 — Mandatory dedupe check**: What: search phone, ABHA, name plus DOB before create. Who: Reception. Accepts: duplicate warning blocks silent create.
- **MUST-005 — Audited merge**: What: admin-approved merge keeping all history and audit. Who: Admin on reception request. Accepts: merged record shows both UHIDs.
- **MUST-006 — Longitudinal timeline**: What: encounters, prescriptions, reports, admissions, packages, certificates in one scroll. Who: Doctor, Nurse, Billing. Accepts: five-year history loads under 2 seconds.
- **MUST-007 — Safety flags**: What: VIP, senior, MLC, infectious, financial markers with reason. Who: Reception, Nurse, Doctor. Accepts: infectious flag alerts at check-in.
- **MUST-008 — Allergy and chronic capture**: What: record allergies and chronic conditions once, show everywhere. Who: Doctor, Nurse. Accepts: allergy banner on prescription screen.
- **MUST-009 — Consent archive**: What: store procedure, anesthesia, tele, and sharing consents with signature. Who: Nurse, Doctor. Accepts: consent printable at OT gate.
- **MUST-010 — Document uploads**: What: attach photos and PDFs under file policy with labels. Who: Reception, Nurse. Accepts: oversize file rejected with reason.
- **MUST-011 — Slip and report sharing**: What: send slips, bills, and reports by SMS and WhatsApp. Who: Reception, Billing. Accepts: delivery logged per patient.
- **MUST-012 — Recall enrolment**: What: enrol for follow-up, vaccination, and package reminders. Who: Doctor, Reception. Accepts: due list includes enrolled patient.
- **MUST-013 — Old-age-home family updates**: What: share periodic summaries with authorized family. Who: Nurse, Caretaker. Accepts: only consented contacts receive updates.
- **MUST-014 — Financial markers**: What: defaulter and advance flags visible at billing. Who: Billing, Admin. Accepts: defaulter flagged before new credit.

## 5. SHOULD (P1)

- SHOULD-001: Photo-based quick identify at busy counters with consent.
- SHOULD-002: Birthday and festival greeting templates for retention.
- SHOULD-003: Language-preferred message routing per patient.
- SHOULD-004: Inactive-record cleanup suggestions after admin review.
- SHOULD-005: Guardian-level consolidated family billing view.

## 6. Entities & States

- Entities: Patient, FamilyLink, Allergy, Consent, Document, Flag, MergeRequest, CommunicationLog.
- Patient states: registered, active, inactive, deceased. MergeRequest states: requested, approved, rejected.
- Consent states: pending, signed, withdrawn. Flag states: active, resolved.

## 7. Workflows

1. Search by phone, ABHA, or name plus DOB before any create.
2. Register or select patient; link ABHA, family, guardian, language.
3. Record allergies, chronic flags, safety and financial markers.
4. Book or check in; run encounter with timeline in view.
5. Attach consents and documents; enrol recalls.
6. Share slips and reports; log every communication.
7. Raise merge on duplicates; admin approves with full audit.

## 8. Business Rules

1. Duplicate check is mandatory on create; silent duplicates are a defect.
2. Merge never deletes history; both UHIDs remain traceable with audit.
3. Photo uploads follow WebP 2MB policy; PDFs follow 20MB policy.
4. MLC and infectious flags cannot be removed without authorized role.
5. Family updates go only to consented contacts.

## 9. Customer Experience Requirements

- Speed: returning patient in under 3 keystrokes; timeline under 2 seconds.
- Clicks: book to check-in under 3 clicks from search result.
- Print and WhatsApp: timeline and slips print legibly and share on basic phones.
- Tamil and English: demographics, instructions, and consents bilingual.
- Error messages: duplicate and merge messages name the matching record and next step.

## 10. Reports & Acceptance

- Reports: registration census, ABHA linkage percent, recall due, MLC, birth, and death registers.
- Acceptance: returning patient found in 3 keystrokes; timeline printable and WhatsApp-shareable; merge preserves full history with audit.
