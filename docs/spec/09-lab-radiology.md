# 09 — Lab + Radiology

## 1. Purpose
Run a complete order-to-report cycle — order from EMR, collect/track samples, schedule imaging, enter and authorize results, and deliver signed reports to patient and doctor — with reference-range flagging, facility utilization, and NABL-ready QC traces. Analyzer auto-interface (HL7) is explicitly out of v1.

## 2. Ubiquitous Language

| Term | Definition | Example |
|---|---|---|
| Test master | Orderable lab test with specimen + method | HbA1c, serum |
| Panel | Bundled tests ordered as one unit | CBC, LFT panel |
| Reference range | Age/sex-specific normal band for flagging | Hb 13–17 g/dL (M) |
| Specimen | Sample type + container requirement | EDTA whole blood |
| Order | Doctor's request for test(s)/imaging | LabOrder-2210 |
| Sample | Collected specimen instance, barcode-tracked | Barcode S-88412 |
| Result template | Structured entry form per test (numeric/text/table) | Urine R/M grid |
| Authorization | Qualified sign-off releasing the report | Pathologist signs |
| Radio service | Imaging exam mapped to a facility | MRI Brain → MRI room |
| Facility slot | Bookable imaging time window on a machine/room | MRI slot 10:30 |
| TAT | Turnaround time, order → authorized report | 6h routine |
| QC log | Quality-control record hook for NABL evidence | Daily control run |
| Critical value | Panic result needing immediate doctor alert | K+ 6.8 mmol/L |
| Add-on | Extra test on an already-collected sample | Add calcium to vial |

## 3. Scope In/Out

In: test/panel/range/specimen masters; radio services → facilities; EMR orders; sample collection + barcode hook; result entry (templates) + authorization + print/WhatsApp; radio facility-slot scheduling + image file attach; NABL QC log hooks; TAT/volumes/utilization reports.
Out: HL7/analyzer auto-interface (v1), PACS/DICOM viewer (file attach only), home-collection logistics app, external lab outsourcing portal (hook only).

## 4. MUST Functionalities (P0)

- MUST-0901: Admin MUST define test masters (code, specimen, method, units, ranges by age/sex) and panels; inactive tests MUST hide from ordering but stay in history.
- MUST-0902: Admin MUST map each radiology service to at least one facility; booking MUST offer only mapped facility slots.
- MUST-0903: Doctors MUST order labs/imaging from any EMR with one click; orders MUST carry diagnosis + priority (routine/urgent) + payer/pricelist context.
- MUST-0904: Collection desk MUST register samples with barcode labels (print hook), tracking `ordered → collected → received → processing` with timestamps.
- MUST-0905: Lab MUST enter results via per-test templates with automatic reference-range flagging (L/H/critical highlight) and delta-check vs prior value.
- MUST-0906: Critical values MUST trigger an immediate doctor alert (dashboard + SMS/WhatsApp hook) with acknowledge capture before report release.
- MUST-0907: Reports MUST require role-gated authorization (only qualified signatory); unsigned previews MUST watermark DRAFT.
- MUST-0908: Authorized reports MUST deliver via print + WhatsApp from the report screen, with delivery log.
- MUST-0909: Radiology MUST schedule by facility slot with conflict block (one patient per machine-slot), reschedule with reason + audit.
- MUST-0910: Radio reports MUST attach image/document files (JPG/PDF) to the report record; missing-attachment reports flag in QC list.
- MUST-0911: System MUST support add-on tests on collected samples and recollect/reject flows with reasons (hemolysed, insufficient).
- MUST-0912: Every order/result/auth/delivery event MUST be timestamp-audited (who/when) for TAT and NABL evidence.
- MUST-0913: QC hooks MUST log control runs, reagent lots, equipment, and deviations per day/test-family for NABL readiness.
- MUST-0914: Cancel/refund of unbilled-collected orders MUST need reason and reverse sample state; billed lines MUST route via billing CN flow.

## 5. SHOULD P1 (4-6)

- SHOULD-0901: Cumulative/trend view (e.g. HbA1c graph) on patient timeline.
- SHOULD-0902: Reflex-test rules (e.g. low Hb → auto-suggest peripheral smear).
- SHOULD-0903: Outsourced-test tracking (sent-to reference lab + due date).
- SHOULD-0904: Machine-wise load balancer suggesting least-loaded facility slot.
- SHOULD-0905: Patient pre-prep instructions (fasting) auto-sent on WhatsApp at order.

## 6. Entities & States

Entities: LabTest, Panel (+members), ReferenceRange, SpecimenType, LabOrder (+lines), Sample (barcode), LabResult, RadioService, RadioOrder, FacilitySlot, RadioReport (+files), QCLog, CriticalAlert.
States: LabOrder `ordered → paid/confirmed → collected → received → processing → authorized → delivered`; Sample `pending → collected → received → accepted | rejected`; RadioOrder `booked → checked-in → performed → reported → authorized`; QC `pass | flag | fail`.

## 7. Workflows

Lab: EMR order → Pay/confirm → Collect + barcode → Receive → Enter result (template) → Range-flag check → Critical alert if panic → Authorize → Print/WhatsApp.
Radio: EMR order → Facility-slot book → Prep instructions → Check-in → Perform → Attach images → Report → Authorize → Deliver.
Exception: Reject/recollect → reason → new sample linked to same order; add-on → same sample, new line billed.

## 8. Business Rules

- BR-0901: Result entry requires test + accepted specimen; no result on rejected samples.
- BR-0902: Only users with authorizer role can sign; entry ≠ authorization (four-eyes where configured).
- BR-0903: Reference-range match uses patient age/sex at collection date, not entry date.
- BR-0904: Critical values block silent release — acknowledge required before delivery.
- BR-0905: Radiology double-booking on one facility-slot is blocked; overbook needs supervisor override.
- BR-0906: Report edits after authorization create a revised version (v2+) with diff + re-sign; original retained.
- BR-0907: HL7/analyzer import stays out of v1; manual entry is the record of truth.

## 9. CX Requirements

- Order screen is patient-contextual: open EMRs pre-fill patient + diagnosis; <3 clicks to order a panel.
- Collection queue shows pending draws sorted by priority + waiting time.
- Result entry is grid-friendly: tab-through numerics, auto-flag colors, prior value visible inline.
- Authorization is a sign-off inbox: one screen, preview, sign + deliver combined action.
- Radio booking shows machine-day grid; patient gets slot + prep on one WhatsApp message.
- DRAFT watermark unmissable on any unsigned preview/print attempt.

## 10. Reports & Acceptance

Reports: TAT (order → authorize, by test/priority), test volumes, abnormal/critical %, recollect/reject %, facility (machine) utilization, pending-authorization aging, QC compliance.
Acceptance: (a) EMR order → authorized report delivered with full timestamp chain; (b) out-of-range values auto-flag including age/sex bands; (c) critical value cannot reach patient without doctor acknowledge; (d) radio booking conflict blocked with named blocker.
