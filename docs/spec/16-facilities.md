# 16 — Facilities

## 1. Purpose

Treat every bookable place and machine as a first-class resource with its own calendar, status, and map position — so beds, OTs, scanners, chairs, and therapy rooms never double-book and occupancy is visible at a glance.

## 2. Ubiquitous Language

| Term | Definition | Example |
|---|---|---|
| Facility | One bookable unit with its own schedule and status | Bed G-12, OT-1, MRI-1 |
| Category | The kind of facility driving rules and presets | OT, Bed, MRI, Dental Chair |
| Preset | Ready-made category template with defaults | MRI preset with 20-min slots |
| Schedule | Weekly open hours, breaks, and holidays per facility | 08:00–20:00 with lunch break |
| Block | A dated closure for cleaning, maintenance, or holiday | Fumigation 14:00–16:00 |
| Sterilization Turn | The clean-and-certify cycle required between OT cases | 30-minute OT turnover |
| Occupancy | Whether the unit is free, held, or in use right now | Bed occupied, chair free |
| Floor Map | Visual grid of facilities by floor with live status | Ground floor ward grid |
| Status Board | Live wall view of availability across key facilities | OT and bed board at nursing |
| Service Binding | The rule that a service needs a specific facility kind | MRI brain needs MRI-1 |
| Slot Consumption | How a booking occupies facility time | 30-minute MRI consumption |
| Turnover Gap | Mandatory idle minutes between two bookings | 15-minute chair disinfection |
| Maintenance Hold | Out-of-service state hiding the unit from booking | X-ray tube service hold |
| Utilization | Share of open hours actually booked or occupied | Chair 72 percent this week |

## 3. Scope

**In Scope**

- Facility master where one row equals one bookable unit; no quantity field, no is-bed flag.
- Categories: OT, Bed, Ward, MRI, CT, X-ray, USG, consultation room, dental chair, Nadi room, therapy room, counselling room, equipment.
- Preset category seeds, per-facility schedule with breaks and cleaning blocks, multi-floor grid map with shape and position editing.
- Service-to-facility binding, consumption by appointments, OT, radio, and therapy, sterilization scheduling with checklist, live status board.

**Out of Scope**

- IoT and RTLS live tracking, automatic device discovery and telemetry.

## 4. MUST Functionalities

- **MUST-001 — Single-unit facility record**: What: create one row per bookable unit with name, category, branch, location. Who: Admin. Accepts: no quantity or bulk-count fields exist.
- **MUST-002 — Category presets**: What: seed MRI, CT, X-ray, USG, OT, chair with slot and gap defaults. Who: Admin. Accepts: new MRI usable after 2 edits.
- **MUST-003 — Per-facility schedule**: What: set open hours, breaks, cleaning windows, holidays per unit. Who: Admin, Coordinator. Accepts: booking outside hours blocked.
- **MUST-004 — Cleaning and sterilization blocks**: What: recurring turnover and fumigation blocks with checklist. Who: Nurse, OT coordinator. Accepts: OT shows turnover gap automatically.
- **MUST-005 — Floor-plan grid map**: What: toggle header map showing facilities as positioned grid cards. Who: Reception, Nurse. Accepts: map matches physical layout.
- **MUST-006 — Multi-floor management**: What: group map by floor with drag to reposition and resize. Who: Admin. Accepts: bed moved to Floor-2 reflects on board.
- **MUST-007 — Service binding**: What: require a facility category per service with duration. Who: Admin. Accepts: booking MRI without scanner blocked.
- **MUST-008 — Overlap prevention**: What: reject double booking with next-free suggestion. Who: Reception, Coordinators. Accepts: clash message names holder slot.
- **MUST-009 — Bed single-occupancy guard**: What: one active admission per bed facility. Who: Nurse, Reception. Accepts: occupied bed unbookable until discharge.
- **MUST-010 — OT single-procedure guard**: What: one active procedure per OT at a time. Who: OT coordinator. Accepts: parallel case in same OT rejected.
- **MUST-011 — Maintenance hold**: What: mark under-maintenance with reason; hidden from booking. Who: Admin, Nurse. Accepts: hold shows amber on board.
- **MUST-012 — Live status board**: What: beds, OT, chairs, scanners with free, occupied, blocked states. Who: Nurse, Reception. Accepts: admit updates board within a minute.
- **MUST-013 — Occupy and release flow**: What: check in and release with timestamps per booking. Who: Nurse, Coordinator. Accepts: no-show auto-releases after grace.
- **MUST-014 — Sterilization audit checklist**: What: record OT cleaning steps with staff and time. Who: Nurse. Accepts: next case blocked until checklist done.

## 5. SHOULD (P1)

- SHOULD-001: Peak-hour pricing or priority hints per facility.
- SHOULD-002: Equipment due-service reminders from usage hours.
- SHOULD-003: Bed-request queue with auto-assign on discharge.
- SHOULD-004: Printable floor-wise bed and chair directory.
- SHOULD-005: Downtime trend per scanner with reason codes.

## 6. Entities & States

- Entities: Facility, FacilityCategory, FacilitySchedule, FacilityBlock, FloorMap, SterilizationLog.
- Facility states: available, occupied, blocked, under-maintenance, retired.
- Booking states: held, confirmed, in-use, released, cancelled. Block states: scheduled, active, lifted.

## 7. Workflows

1. Seed categories from presets; adjust slots and turnover gaps.
2. Create each facility row with branch, floor, and map position.
3. Set per-facility schedule with breaks and sterilization blocks.
4. Bind services to required facility categories with durations.
5. Book practitioner plus facility together; block overlaps.
6. Occupy on arrival, release on completion, sterilize OT before next case.
7. Review utilization, downtime, and sterilization compliance weekly.

## 8. Business Rules

1. One row equals one bookable unit; quantity shortcuts are forbidden.
2. Booking only on open schedule; overlaps rejected with a message.
3. A bed holds at most one active admission; an OT or chair one active procedure.
4. Maintenance hold hides the unit from booking but preserves history.
5. OT next case requires completed sterilization checklist.

## 9. Customer Experience Requirements

- Speed: status board refresh under 5 seconds; map toggle under 1 second.
- Clicks: facility create to bookable in under 5 screens; hold in 2 clicks.
- Print and WhatsApp: occupancy and sterilization logs print and share cleanly.
- Tamil and English: floor names, directions, and block reasons bilingual.
- Error messages: clash messages show who holds the slot and the next free time.

## 10. Reports & Acceptance

- Reports: facility utilization, downtime, OT and chair occupancy, sterilization compliance.
- Acceptance: new facility with schedule bookable immediately; map toggle shows live status and allows edit; overlaps and double admissions blocked.
