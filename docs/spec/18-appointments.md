# 18 — Appointments

## 1. Purpose
Fill every practitioner, chair, room, and machine without a single double-booking — across OPD, dental chairs, therapy/Nadi rooms, counselling, daycare sittings, and video — while keeping the front-desk fast, the queue visible, and the patient reminded. The slot engine is a shared library, not per-department logic.

## 2. Ubiquitous Language

| Term | Definition | Example |
|---|---|---|
| Slot engine | Shared library computing bookable time windows | Practitioner+facility+service |
| Slot | One bookable window with duration + buffer | 10:00–10:20 + 5m buffer |
| Buffer | Non-bookable gap after a slot | 5-min turnover |
| Emergency reserve | Slots held back for urgent cases | 2 slots/day |
| Holiday | Non-working day blocking all booking | Diwali, Sunday PM |
| Drag-drop reschedule | Moving a booking on the calendar UI | Tue → Wed 11:00 |
| Walk-in token | Same-day queue entry without prior booking | Token W-14 |
| Room token | Queue number scoped to a room/chair | Dental-2 token 5 |
| Call-next | Advancing the queue display + alert | Now serving 6 |
| No-show | Booked patient never checking in | Auto-marked post-slot |
| Recall | Planned follow-up prompt (clinical/administrative) | 6-month review |
| Tele-encounter | Documented video-visit clinical note | Video OPD note |
| Daycare subtype | Appointment carrying procedure capture | Physio sitting 4/10 |
| Conflict block | Hard stop on practitioner OR facility overlap | "Dr busy till 11" |
| Certificates hook | Post-visit issuable documents | Fitness certificate |

## 3. Scope In/Out

In: slot engine (practitioner + facility + service + pricelist, duration/buffer/emergency/holiday, drag-drop); in-clinic/walk-in/video (link + consent + tele-encounter); OPD queue dashboard (room-token, call-next, no-show, recall); SMS/WhatsApp confirm/remind/recall + slip print/WhatsApp; conflict blocking; daycare subtype with pre/post capture; certificates hook.
Out: SOP/SLA automation, POS collection at booking (basic advance allowed), practitioner payroll, inpatient bed allocation (see 11).

## 4. MUST Functionalities (P0)

- MUST-1801: Engine MUST compute slots from practitioner schedule × facility schedule × service duration + buffer, minus leaves/holidays and emergency reserve.
- MUST-1802: Booking MUST bind service + practitioner + facility + pricelist in one action; returning-patient booking MUST complete in <3 clicks.
- MUST-1803: Reception MUST drag-drop reschedule with automatic conflict re-check; every move MUST log reason + actor (AppointmentAudit).
- MUST-1804: Walk-in MUST issue a room-wise token into the live queue without breaking booked-slot order (walk-in placement rules configurable — walk-ins appended, never overwrite)
- MUST-1805: Video booking MUST generate an expiring join link, capture pre-join consent, and open a tele-encounter note with e-prescription + report delivery.
- MUST-1806: Queue dashboard MUST show room-wise tokens with check-in, call-next, hold, no-show, and done states per room/chair.
- MUST-1807: No-shows MUST auto-flag after slot end + grace period; recall/follow-up MUST be one click from the visit or no-show record.
- MUST-1808: Confirm/remind/recall MUST send via SMS/WhatsApp (booked → T-24h → T-2h → no-show/recall) with delivery log; slip MUST print + WhatsApp.
- MUST-1809: Practitioner OR facility overlap MUST hard-block with a message naming the blocker (who/what/till-when); overrides MUST need supervisor + reason.
- MUST-1810: OT/surgery/therapy liaison warnings MUST surface when a booking collides with linked procedures (soft warn, not silent).
- MUST-1811: Daycare subtype (Panchkarma/Physio/Dental sittings) MUST book as appointments carrying package context + pre/post capture checklist.
- MUST-1812: Certificates hook MUST allow fitness / foreign safe-to-use / under-treatment issue from the completed visit with template + sign + print/WhatsApp.
- MUST-1813: Cancellation/reschedule MUST require reason from a controlled list + free text, fully audited and visible on the patient timeline.
- MUST-1814: Calendar MUST render all rooms/chairs/facilities across days (multi-resource day/week view) with filters by dept/practitioner/facility.

## 5. SHOULD P1 (4-6)

- SHOULD-1801: Waitlist with auto-fill on cancellation (opt-in SMS confirm).
- SHOULD-1802: Patient self reschedule/cancel via link within policy window.
- SHOULD-1803: Overbook suggestion engine (historical no-show–aware).
- SHOULD-1804: Practitioner late-running indicator adjusting queue ETAs live.
- SHOULD-1805: Voice/announcement hook for call-next display screens.

## 6. Entities & States

Entities: Appointment, QueueToken, VideoSession (+consent), Recall, AppointmentAudit, ScheduleRule, HolidayCalendar, EmergencyReserve.
States: Appointment `booked → confirmed → checked-in → in-queue → in-consult → done | no-show | cancelled | rescheduled`; QueueToken `waiting → called → serving → done | skipped`; VideoSession `scheduled → consented → joined → completed | expired`.

## 7. Workflows

Book: Search patient → Service/practitioner/slot → Confirm → SMS/WhatsApp → Remind → Check-in → Room queue → Consult → Follow-up/recall/certificate.
Walk-in: Register → Room token → Queue append → Consult.
Video: Book → Link + consent → Pre-join check → Tele-encounter → e-prescription → Link expiry.
Reschedule: Drag-drop → Conflict check → Reason → Audit → Re-confirm message.

## 8. Business Rules

- BR-1801: One active token per patient/department/day — duplicates blocked with pointer to existing.
- BR-1802: Video join requires recorded consent; link expires after visit window.
- BR-1803: No booking outside practitioner + facility hours, on holidays, or inside emergency reserve (reserve releasable by role + reason).
- BR-1804: Cancellation/reschedule always needs reason; no silent deletes.
- BR-1805: Walk-ins never displace confirmed slots; queue position rules are explicit and visible.
- BR-1806: Expired video links cannot be reactivated — rebook only.

## 9. CX Requirements

- Returning-patient booking <3 clicks; search tolerates phone/name/ABHA fragments.
- Conflict message names the blocker ("Dr Mehta busy till 11:20" / "Chair D2 occupied 10:00–10:45"), never a bare "conflict".
- Queue board is glanceable at 3m: big token, room, ETA; call-next is one tap.
- Reminders carry actionable info: date/time/doctor/room + cancel link.
- Calendar drag-drop is smooth with instant conflict feedback (red highlight + reason).
- Video join works on low bandwidth with a dial-back fallback number shown.

## 10. Reports & Acceptance

Reports: daily census, no-show %, practitioner/facility utilization, video vs in-clinic split, recall conversion, cancellation reasons, queue wait times, emergency-reserve usage.
Acceptance: (a) double-booking impossible via UI for practitioner OR facility; (b) returning-patient booking <3 clicks verified; (c) video visit completes consent → encounter → e-prescription without leaving the flow; (d) calendar shows all resources across days with correct holiday/reserve blocking.
