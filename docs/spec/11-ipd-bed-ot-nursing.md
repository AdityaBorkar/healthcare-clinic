# 11 — IPD, Bed, OT & Nursing

## 1. Purpose
Admission-to-discharge for hospital tier: ADT with floor-map bed allocation and multi-floor transfer, WHO-safe 3-phase OT execution (pre/intra/post) with anesthesia, implant, and sterilization discipline, PACU and ward nursing, auto-billing of OT/surgeon/consumables, and surgeon + utilization analytics.

The admission is the container: beds, surgery bookings, checklists, anesthesia records, PACU stays, and IPD bill lines all hang off it, so transfer, discharge, and billing always see the same current state.

## 2. Ubiquitous Language
| Term | Definition | Example |
|---|---|---|
| ADT | Admit–Discharge–Transfer lifecycle | Admit Bed 12 → Transfer 2F → Discharge |
| Bed Allocation | Assigning a bed/ward per category + map | General Bed G-08 allocated |
| Floor Map | Grid view/edit of floors, rooms, beds | 2F grid: 20 beds, 3 occupied-ICU |
| Transfer | Moving admission between bed/ward/floor | Ward → ICU transfer note |
| Discharge Summary | Closing clinical + billing document | Diagnosis, surgery, meds, follow-up |
| Surgery Request | Doctor's proposed procedure needing OT | Lap cholecystectomy, ASA II |
| OT Slot | Booked theatre + team + time window | OT-1, 10:00–12:00, Dr. Shah |
| Buffer / Emergency Slot | Turnover gap / reserved urgent capacity | 20-min buffer, 1 emergency slot/day |
| PAC | Pre-anesthesia checkup with fitness decision | Fit / fit-with-optimization |
| Consent | Digitized surgical + anesthesia consent | Signed consent scanned + e-sign |
| WHO Sign-In/Out | Pre-anesthesia and pre-exit safety checks | Identity + site + consent verified |
| WHO Time-Out | Immediate pre-incision team pause | Surgeon/anesthetist/nurse confirm |
| Anesthesia Record | Serial vitals + drugs + fluids + events | Propofol 120 mg, MAP stable |
| Implant Log | Barcode-traced implant record | Plate Batch I-991, MRP logged |
| PACU | Recovery with readiness scoring | Aldrete 9 → ward shift |
| Sterilization Log | Autoclave/kit cycle + audit checklist | Kit K-7, cycle pass, indicator OK |
| Surgeon Dashboard | Per-surgeon cases, time, outcomes | 14 cases, 92% on-time starts |

## 3. Scope In/Out
In: ADT with floor-map grid + multi-floor transfer + discharge summary; full 3-phase OT (pre-op request/calendar/drag-drop/conflict/buffer/emergency/PAC/consent/Sign-In; intra-op Time-Out/Sign-Out/anesthesia/consumable/implant/roster; post-op PACU/orders/auto-billing/sterilization audit); surgeon dashboard + utilization. Out: device vitals streaming; HA/zero-downtime infra; nursing task-board detail (see 19-Nursing, referenced here).

## 4. MUST Functionalities
- MUST-1101: Raise admission request (doctor, diagnosis, bed category, urgency) and admit with bed allocation from floor-map grid.
- MUST-1102: View/edit floor-plan map as grid across multiple floors; manage rooms, beds, categories, cleaning/hold states.
- MUST-1103: Transfer admissions across bed/ward/floor in one transaction with transfer note and nursing handover trigger.
- MUST-1104: Generate discharge summary (course, surgery, meds, advice, follow-up) with billing-clearance gate.
- MUST-1105: Raise pre-op surgery request with procedure, surgeon, anesthesia type, expected implants, and consent checklist.
- MUST-1106: Schedule OT on visual calendar with drag-drop, surgeon/OT conflict detection, buffer enforcement, and emergency-slot handling.
- MUST-1107: Record PAC with fitness decision; unfit blocks scheduling until re-PAC.
- MUST-1108: Digitize surgical + anesthesia consent (scan/e-sign) and enforce WHO Sign-In before anesthesia induction.
- MUST-1109: Enforce WHO Time-Out before incision and Sign-Out before exit; block case close on missed phase.
- MUST-1110: Capture intra-op anesthesia record: serial vitals, drugs, fluids, events with timestamps.
- MUST-1111: Capture consumables and implant barcodes/batch intra-op with MRP/batch trace.
- MUST-1112: Record surgical + nursing notes and team roster (surgeon, anesthetist, nurses, technician) per case.
- MUST-1113: Run PACU monitoring with readiness score and shift-to-ward trigger plus post-op orders.
- MUST-1114: Auto-bill OT charges + surgeon/anesthetist fees + consumables/implants to IPD bill without re-entry.
- MUST-1115: Schedule sterilization cycles with kit trace and audit checklist; failed cycle blocks kit reuse.
- MUST-1116: Show surgeon dashboard: cases, utilization, on-time starts, cancellations, average duration.

## 5. SHOULD P1
- SHOULD-1101: SMS/WhatsApp OT-day reminder to patient party.
- SHOULD-1102: Blood-requisition hook for scheduled cases.
- SHOULD-1103: Instrument-set preference cards per surgeon.
- SHOULD-1104: Cancellation reason analytics with delay attribution.
- SHOULD-1105: Bed-demand forecast from elective OT list.

## 6. Entities & States
Entities: Admission (Requested → Admitted → Transferred → Discharged/Absconded), Bed (Vacant → Occupied → Cleaning/Hold → Vacant), SurgeryBooking (Requested → Scheduled → InProgress → Completed/Cancelled/Postponed), OTChecklist (SignIn → TimeOut → SignOut), AnesthesiaRecord (append-only series), ImplantLog (append-only), SterilizationLog (Pass/Fail). Discharge: Draft → Final (billing-cleared).

## 7. Workflows
Admit → Bed (map) → Surgery request → PAC + consent → OT book (calendar, conflict/buffer) → Sign-In → Anesthesia → Time-Out → Surgery (vitals/drugs/consumables/implants) → Sign-Out → PACU → Ward + post-op orders → Discharge summary + auto-bill. Emergency path: emergency slot → abbreviated booking with reason → retrospective consent/PAC completion flag. Transfer path anytime with handover.

Cancelled/postponed cases release the OT slot and implant reservation back to stock; linked IPD bill lines void with reason rather than deleting.

## 8. Business Rules
- WHO phases mandatory in order; case cannot close with any phase missed.
- Double-booking surgeon or OT blocked; emergency override needs reason + alert.
- Unfit PAC blocks scheduling; expired consent blocks Sign-In.
- Implants/consumables require batch/barcode; missing trace blocks billing finalization.
- Failed sterilization cycle quarantines the kit until re-pass.
- Discharge print requires billing clearance + summary sign-off.

## 9. CX Requirements
- Floor map is drag-readable: color-coded Vacant/Occupied/Cleaning; admit in 3 clicks from request.
- OT calendar supports drag-drop reschedule with instant conflict banner and buffer visualization.
- WHO checklists are big-tap, one-screen-per-phase with read-aloud confirm for Time-Out.
- Surgeon dashboard loads in one view: today list + weekly utilization + delays.

## 10. Reports & Acceptance
Reports: bed occupancy, ALOS, OT utilization %, surgeon cases/on-time/cancellations, surgery duration variance, sterilization compliance, billing leakage (cases vs billed lines). Acceptance: (a) zero wrong-site path — identity + site + consent verified before incision; (b) OT charges auto-flow to billing with no re-entry; (c) conflict/double-book blocked; (d) missed WHO phase blocks close; (e) implant trace present on every implant case.
