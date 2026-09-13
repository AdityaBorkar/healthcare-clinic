# 01 — Registration, Appointments, Queue, Telemedicine

## 1. Purpose
Single front-desk backbone for the clinic: register a patient once, schedule them against the right practitioner + facility + service + pricelist, run the day's OPD queue in-clinic or over video call, and recall them or issue fitness certificates afterwards. Covers walk-in and booked flows, room-wise queues, tele-encounters, and the shared appointment engine used by dental chairs, Nadi rooms, and therapy slots.
This spec owns the appointment engine as a shared library: every department (allopathy OPD, dental chairs, AYUSH therapy, Nadi room) books through the same slot + conflict + reschedule primitives. Registration is the single entry point — no clinical spec creates patients directly.

## 2. Ubiquitous Language

| Term | Definition | Example |
|---|---|---|
| Patient | Person receiving care; one master record with contacts and ABHA link | "Register new patient with phone + ABHA ID" |
| Family Link | Relation between patient records for shared history/billing | "Link child to mother's family" |
| Practitioner | Doctor/therapist who consults; has day-wise schedule | "Dr. Rao OPD Mon–Sat 10–2" |
| Facility | One bookable unit (room, chair, bed, Nadi room, equipment) | "Chair-2 booked for RCT sitting" |
| Service | Billable clinical activity mapped to a facility + pricelist | "MRI Brain → Radio room + cost" |
| Pricelist | Named price table applied at booking | "General vs. senior-citizen pricelist" |
| Appointment | Reserved slot binding patient + practitioner + facility + service + time | "10:30 appointment with dentist, Chair-1" |
| Queue Token | Day's running number for OPD order per department/room | "Token A-14, room 3" |
| Check-in | Arrival confirmation moving booked → in-queue | "Patient checked in at 10:05" |
| No-show | Booked patient who never checks in | "Mark 11:00 slot no-show" |
| Recall | Follow-up invitation for a future date | "Recall diabetic after 30 days" |
| Video Session | Tele-consult with link + consent + e-prescription delivery | "Video link sent on WhatsApp" |
| Tele-encounter | Clinical note created from a video session | "Tele-encounter auto-linked to appointment" |
| Fitness Certificate | Signed templated certificate (foreign/under-treatment/general/sick-leave) | "Foreign travel fitness certificate" |

## 3. Scope In/Out
In: patient master + dedupe + family linking; day-wise OPD schedule; slot booking with duration/buffer/emergency handling; conflict detection; drag-drop reschedule library; check-in, room-wise queue, call-next, no-show, recall; video link + consent + tele-encounter + e-prescription delivery; four fitness certificate templates with sign/print/WhatsApp; Data Explorer/Forms/Reports hooks. Out: SOP/SLA engine, POS payments, auto NEFT match, inpatient bed management (covered by IPD spec).

## 4. MUST Functionalities

- MUST-001: Reception registers a patient with demographics, contact, photo, language, allergies; system dedupes by phone/ABHA — _accept: duplicate phone warns before creating second record._
- MUST-002: Reception links family members across patient records — _accept: family view shows linked members._
- MUST-003: Admin defines day-wise OPD schedule per practitioner/department — _accept: booking only offers scheduled days._
- MUST-004: Reception books walk-in + booked appointments against slot + practitioner + facility + chair + service + pricelist — _accept: booking stores all six elements._
- MUST-005: System enforces slot duration + buffer and blocks double-booking with a clear message — _accept: overlapping book rejected with reason shown._
- MUST-006: Reception reserves emergency slots and overbooks only via emergency reason — _accept: emergency booking logged with reason._
- MUST-007: Reception drag-drop reschedules from the shared appointment library with audit trail — _accept: old slot + new slot + actor recorded._
- MUST-008: System sends confirm/remind via SMS/WhatsApp — _accept: reminder log per appointment._
- MUST-009: Reception checks in patients, issues day tokens, runs room-wise queue with call-next — _accept: queue order visible per room._
- MUST-010: Reception marks no-show and creates recall/follow-up bookings — _accept: no-show % reportable per doctor/day._
- MUST-011: Reception creates video call appointments with link generation — _accept: unique link per session sent to patient._
- MUST-012: Patient provides tele-consent before joining video call — _accept: join blocked until consent captured._
- MUST-013: Doctor runs tele-encounter from video session and issues e-prescription — _accept: prescription deliverable over WhatsApp._
- MUST-014: Doctor issues templated fitness certificates (foreign safe-to-use, under-treatment, general, sick-leave) with signature — _accept: each type prints with correct template._
- MUST-015: Admin manages masters (practitioners, facilities by category, services + facility map, pricelists, vendors) — _accept: one Facility row = one bookable unit with schedule._
- MUST-016: Reception searches Medical Records link from registration — _accept: one click from patient to timeline._

## 5. SHOULD P1
- SHOULD-01: Self check-in QR at reception kiosk.
- SHOULD-02: Preferred-language SMS/WhatsApp templates.
- SHOULD-03: Wait-time prediction on queue display board.
- SHOULD-04: Bulk recall campaigns (e.g. vaccination due).
- SHOULD-05: Practitioner leave planner auto-blocking schedule.

## 6. Entities & States
Patient (Active/Merged), FamilyLink, Practitioner (Active/Inactive), Facility (Available/Blocked), Service (+FacilityMap, Price), Appointment (Booked/Confirmed/Checked-in/In-consult/Completed/Cancelled/No-show/Rescheduled), QueueToken (Waiting/Called/In-consult/Done/Skipped), VideoSession (Scheduled/Consent-pending/Live/Completed), Certificate (Draft/Signed/Issued).

## 7. Workflows
- Returning patient: Search → Book (slot+service+pricelist) → Confirm/Remind → Check-in → Room queue → Consult → Follow-up/Recall → Certificate if needed.
- Video: Book tele-slot → Link + reminder → Consent → Join → Tele-encounter → e-prescription via WhatsApp.
- Reschedule: Drag-drop → Conflict check → Audit entry → Re-notify patient.
- Certificate: consult → template select → doctor sign → print/WhatsApp → register entry.

## 8. Business Rules
- One active token per patient per department per day.
- Cancellation requires a reason; reschedule keeps full audit.
- Video join requires recorded consent.
- Facility booking respects category (chair/OT/Nadi-room) and schedule windows.
- ABHA ID link optional but dedupe on phone is mandatory.
- Fitness certificates require a linked encounter on the same day or an active under-treatment record.

## 9. CX Requirements
- Book → check-in → consult in ≤3 clicks for returning patient.
- Double-booking error states the conflicting booking plainly.
- Queue display shows token, room, and approximate wait.
- Appointment slip and certificates print + WhatsApp in English/regional language.
- Consent screen readable on low-end phones before video join.

## 10. Reports & Acceptance
Reports: OPD dashboard, daily appointment census, no-show %, doctor/facility utilization, certificate register, reminder delivery log. Acceptance: returning-patient booking under 60s; conflict blocked 100% in test matrix; video consent → e-prescription round-trip verified on mobile data.
Certificate register auditable by type with signatory and issue timestamp.
