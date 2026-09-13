# 03 — Dental

## 1. Purpose
Tooth- and surface-level dental record: FDI charting for adult/deciduous dentition, image-backed diagnosis, staged treatment plans with quotes and per-procedure consent, chair-wise scheduling, package pricing, external lab job coordination, and post-op instruction delivery.
One plan may span months (ortho, implants) while another closes in a day (filling); the same stage + lab-job machinery serves both. Chair time is the scarce resource, so scheduling, buffers, and lab-delay visibility are first-class, not afterthoughts.

## 2. Ubiquitous Language

| Term | Definition | Example |
|---|---|---|
| FDI Notation | Two-digit tooth numbering (quadrant+tooth) | "Tooth 36 — mesial caries" |
| Surface | Tooth face (mesial/distal/buccal/lingual/occlusal) | "Occlusal filling on 46" |
| Deciduous Chart | Primary-dentition chart (51–85 series) | "Carious 74, monitor 75" |
| IOPA/OPG/CBCT | Intraoral periapical / panoramic / 3D scan images | "Attach OPG before ortho plan" |
| Treatment Plan | Set of staged procedures per patient with status | "RCT + crown plan for 36" |
| Plan Stage | One sitting/phase within a plan (e.g. RCT sitting 2) | "Ortho monthly review #4" |
| Quote/Estimate | Priced treatment offer shown before consent | "Quote ₹18,000 for RCT+crown" |
| Consent | Signed per-procedure authorization | "Signed RCT consent" |
| Chair Slot | Time on a dental chair for a procedure | "Chair-1, 45-min RCT slot" |
| Package | Bundled price for multi-stage treatment | "Full RCT + crown package" |
| Lab Job Card | Work order to external prosthesis lab | "Zirconia crown job to lab X" |
| Trial/Delivery | Lab prosthesis try-in and final fit stages | "Trial on 12th, delivery 15th" |
| Shade | Tooth-color specification for prosthesis | "Shade A2, metal-free" |
| Post-op Instructions | Aftercare sheet per procedure | "RCT post-op: avoid chewing…" |

## 3. Scope In/Out
In: FDI charting adult/deciduous surface-wise, IOPA/OPG/CBCT file attach, staged plans (RCT/ortho/implant/crown-bridge), quote/estimate, consent per procedure, chair scheduling with durations, package pricing, lab job card with vendor/trial/delivery/shade, prescription + post-op print/WhatsApp. Out: CAD/CAM device integration, in-house milling, orthodontic cephalometric auto-analysis.

## 4. MUST Functionalities

- MUST-001: Dentist charts findings per tooth + surface in FDI (adult + deciduous) — _accept: chart stores tooth, surface, finding._
- MUST-002: Dentist attaches IOPA/OPG/CBCT files to chart/plan — _accept: image opens from tooth record._
- MUST-003: Dentist builds staged treatment plan (RCT sittings, ortho monthly, implant phases, crown/bridge) — _accept: each stage has procedure + status._
- MUST-004: Reception generates quote/estimate from plan + pricelist — _accept: quote totals match stage prices._
- MUST-005: Dentist captures consent per procedure before first sitting — _accept: stage cannot start without signed consent._
- MUST-006: Reception books chair-wise slots with procedure durations — _accept: overrun buffers respected; conflicts blocked._
- MUST-007: Reception sells package pricing (e.g. RCT + crown) — _accept: package links all covered stages._
- MUST-008: Coordinator raises lab job card with vendor, due date, shade/metal specs — _accept: job shows vendor + due + spec._
- MUST-009: Coordinator tracks trial/delivery/QC status on lab jobs — _accept: delay visible on dashboard._
- MUST-010: Dentist closes each stage with note + next appointment or completion flag — _accept: open stage blocks plan closure._
- MUST-011: Dentist issues prescription + post-op instructions per procedure — _accept: prints + WhatsApps correctly._
- MUST-012: Reception reschedules staged sittings preserving sequence — _accept: ortho review order never reorders._
- MUST-013: Dentist records implant-phase milestones (placement/healing/loading) — _accept: loading blocked before healing note._
- MUST-014: System shows pending lab jobs and stage completion per patient — _accept: chair dashboard lists lab-waits._

## 5. SHOULD P1
- SHOULD-01: Chair utilization heatmap by day/hour.
- SHOULD-02: Before/after smile-gallery file set per cosmetic case.
- SHOULD-03: Ortho due-alert when monthly review overdue.
- SHOULD-04: Lab vendor scorecard (on-time %, remake %).
- SHOULD-05: Package installment tracking with dues reminder.

## 6. Entities & States
DentalChart (per tooth/surface), TreatmentPlan (Draft/Approved/In-progress/Completed), PlanStage (Planned/Scheduled/In-chair/Done), Quote (Draft/Issued/Accepted), ConsentForm (Pending/Signed), LabJob (Raised/In-lab/Trial/Delivered/Remake), ChairSlot (Free/Booked).

## 7. Workflows
- Exam + Chart → Plan + Quote → Consent → Staged chair appointments → Lab job (if prosthesis: raise → trial → delivery) → Completion + Review.
- Ortho: records + OPG → monthly stages → debond + retainer → review.
- Implant: placement → healing check → loading + crown via lab → review.
- Remake: delivery rejected → remake job linked to original → revised trial → re-delivery.

## 8. Business Rules
- Plan stage cannot close without clinical note + next appointment or completion flag.
- Lab job tracks vendor, due date, shade/metal spec, QC status.
- Consent is per procedure, not per plan.
- Chair booking requires procedure duration; emergency pain slots preempt routine buffers.
- Quote validity (e.g. 30 days) printed on every estimate; expired quotes need re-issue before booking.

## 9. CX Requirements
- Chart → plan → first sitting booked in one flow without re-entry.
- Lab delay badge visible on chair and patient views.
- Quote printable with stage-wise breakup + package savings line.
- Post-op sheet in English/regional language via print + WhatsApp.
- Charting usable with gloves on touchscreen (large tooth targets).
- Trial-appointment SMS includes lab-job status so patients are not called in vain.

## 10. Reports & Acceptance
Reports: chair utilization, pending/overdue lab jobs, stage completion, collection by treatment type, consent-pending list. Acceptance: chart→plan→first-sitting in one flow timed; lab delay surfaces on dashboard in test; stage-close rule verified (close blocked without note/next action).
Remake rate per vendor reviewed monthly from lab job history.
Package vs. itemized billing comparable on the quote screen before patient commits.
