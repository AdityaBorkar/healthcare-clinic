# 02 — Allopathy EMR

## 1. Purpose
SOAP-based consultation record for allopathy OPD/IPD (general medicine, pediatrics, OBG, surgery, casualty): capture vitals, allergies, history, exam, ICD-11-coded problem list and diagnosis, investigations, and e-prescription — with chronic-disease protocols, immunization tracking, orders, triage/emergency handling, and birth/death/MLC registers.
Covers both first-visit workups and sub-minute follow-ups driven by the problem list + recently-used medicines. Casualty and triage entries use the same encounter model with a severity fast-lane, so emergency cases never wait on full OPD formalities.

## 2. Ubiquitous Language

| Term | Definition | Example |
|---|---|---|
| Encounter | One clinical contact (OPD/follow-up/casualty/tele) | "OPD encounter dated 12-Sep" |
| SOAP Note | Subjective/Objective/Assessment/Plan note structure | "S: fever 3 days; O: 101°F…" |
| Vitals | BP, pulse, temp, SpO2, RR, weight/height/BMI | "BP 140/90 at triage" |
| Allergy | Recorded drug/food allergy triggering prescribe warnings | "Penicillin rash" |
| Problem List | Longitudinal ICD-11-coded active problems | "Type 2 diabetes (active)" |
| Diagnosis | Encounter-level ICD-11 conclusion | "J06 acute URI" |
| E-prescription | Electronic prescription with dosage/frequency/duration | "Amoxicillin 500mg TDS × 5d" |
| Recently-used | Per-doctor shortcut list of frequent medicines | "Refill from recently-used" |
| Order | Request to lab/radio/pharmacy/referral/admit/surgery | "CBC + chest X-ray ordered" |
| Triage | Severity sorting at casualty/OPD entry | "Red triage → casualty bed" |
| MLC Flag | Medico-legal case marker (register only) | "Flag RTA as MLC" |
| Immunization | Vaccine dose with due/reminder tracking | "BCG + OPV-0 recorded" |
| Chronic Protocol | Structured Diabetes/HTN/TB/Antenatal template | "HTN protocol: BP log + drugs" |
| Follow-up | Planned recall visit linked to encounter | "Review after 7 days" |

## 3. Scope In/Out
In: vitals, history, allergies, ICD-11 problem list, exam, diagnosis, e-prescription + recently-used, chronic Diabetes/HTN/TB/Antenatal templates, immunization chart + reminders, orders (lab/radio/pharmacy/referral/admit/surgery), triage + emergency/casualty entry, MLC flag (register only), birth/death register entries. Out: full MLC workflow, document/prescription OCR, inpatient nursing charts (IPD spec).

## 4. MUST Functionalities

- MUST-001: Nurse records vitals before doctor encounter — _accept: vitals timestamped per encounter._
- MUST-002: Doctor records history + SOAP note per encounter — _accept: S/O/A/P sections all present._
- MUST-003: Doctor records allergies with reaction/severity — _accept: allergy visible as banner on encounter._
- MUST-004: Doctor maintains ICD-11 problem list (active/resolved) — _accept: problem carries ICD-11 code + status._
- MUST-005: Doctor records examination findings and encounter diagnosis — _accept: prescription blocked without diagnosis._
- MUST-006: Doctor writes e-prescription with dose/frequency/duration — _accept: prints + WhatsApps in English/regional language._
- MUST-007: Doctor refills from per-doctor recently-used medicines — _accept: follow-up prescription creatable in <60s._
- MUST-008: System warns on allergy/drug-interaction at prescribe time — _accept: warning must be acknowledged to proceed._
- MUST-009: Doctor uses chronic templates for Diabetes/HTN/TB/Antenatal — _accept: protocol fields (e.g. HbA1c, BP log, fundal height) captured._
- MUST-010: Nurse/Doctor records immunizations with due-date reminders — _accept: overdue vaccines flagged on visit._
- MUST-011: Doctor places orders (lab/radiology/pharmacy/referral/admit/surgery) — _accept: each order has status + receiving unit._
- MUST-012: Reception/Nurse runs triage + emergency/casualty entry — _accept: triage category drives queue priority._
- MUST-013: Doctor flags MLC cases into MLC register only — _accept: flagged case appears in MLC list; no workflow launched._
- MUST-014: Staff records birth/death register entries from encounters — _accept: entry carries date, certifier, linked encounter._
- MUST-015: Doctor sets follow-up/recall or converts to admission — _accept: follow-up date appears on queue/recall list._

## 5. SHOULD P1
- SHOULD-01: Growth charts (pediatric) with percentile plots.
- SHOULD-02: Antenatal visit graph (weight/BP/fundal height).
- SHOULD-03: Drug formulary with stock-aware substitution hints.
- SHOULD-04: Standing-order sets per chief complaint.
- SHOULD-05: Regional-language prescription transliteration preview.

## 6. Entities & States
Encounter (Open/Signed), Vitals, Allergy (Active/Inactive), Diagnosis (Provisional/Confirmed), PrescriptionLine, InvestigationOrder (Ordered/Collected/Reported), Immunization (Due/Given/Overdue), Referral (Issued/Accepted/Closed), RegisterEntry (Draft/Final).

## 7. Workflows
- Standard: Queue → Vitals (nurse) → Doctor encounter (SOAP+exam+diagnosis) → Orders → e-prescription print/WhatsApp → Follow-up or Admit.
- Casualty: Triage → Emergency encounter → Stabilize → MLC flag if needed → Admit/Refer/Discharge.
- Chronic: Protocol visit → Parameter log → Drug titration → Recall scheduled.
- Registers: encounter outcome → birth/death/MLC row → register finalization by MRO.

## 8. Business Rules
- Prescription requires at least one encounter diagnosis.
- Allergy warning must be overridden explicitly with reason.
- Recently-used list is per doctor, not global.
- MLC flag is register-only; no investigation workflow in v1.
- Signed encounter immutable; corrections via addendum (see spec 20).
- Birth/death entries require a certifying doctor distinct from the data-entry operator where staffing permits.

## 9. CX Requirements
- Follow-up encounter completable in <60s with recently-used refill.
- Allergy banner always visible during prescribing.
- Prescription print legible with generic + brand names and regional language option.
- Triage screen operable one-handed on tablet at casualty desk.
- Immunization dues surfaced before prescription step.

## 10. Reports & Acceptance
Reports: OPD census, diagnosis-wise counts, prescription audit, referral register, immunization coverage, chronic-cohort defaulters. Acceptance: follow-up <60s timed test; prescription print + WhatsApp verified in English + one regional language; diagnosis-required rule tested with blocked-prescription case.
Triage-to-encounter time tracked separately for casualty shifts.
