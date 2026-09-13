# 14 — Practitioners

## 1. Purpose

Keep one trusted roster of everyone who delivers care — doctors, dentists, vaidyas, therapists, counsellors — with verified identity, schedule, fees, and workload, so booking is always fast and conflicts never reach the patient.

## 2. Ubiquitous Language

| Term | Definition | Example |
|---|---|---|
| Practitioner | Any empanelled care-giver with profile, schedule, and fees | Dr. Ravi, physiotherapist Anu |
| Registration Number | Council enrolment such as NMC or state Ayurveda council ID | TNMC 98765 |
| Specialization | Clinical discipline from the governed master | General Medicine, Orthodontics |
| System of Medicine | Care tradition grouping specializations | Allopathy, Ayurveda, Homeopathy |
| Department | Branch-level grouping of practitioners | Dental, Physio, Psychiatry |
| OPD Schedule | Weekly days and hours a practitioner consults per branch | Mon–Sat 10:00–13:00 |
| Slot | The bookable time slice within a schedule | 10-minute general slot |
| Buffer | Unbookable gap for overruns and notes | 5-minute buffer hourly |
| Emergency Slot | Reserved same-day capacity for urgent cases | Two daily casualty slots |
| Video Consult | Flag allowing remote consultation with link | Tele follow-up enabled |
| Visiting Consultant | Practitioner serving limited days across branches | Tuesday-only cardiologist |
| Leave Block | Dated unavailability stopping new bookings | 20-Sep leave, flu |
| Fee Head | A chargeable consult type: new, revisit, tele | Revisit within 7 days ₹200 |
| Recently Used | Practitioner-specific shortcut list of frequent medicines | Amoxicillin 500mg shortcut |
| OPD Board | Public display of who is in, room, token, and delay | Room-3, Token 14, on time |
| Medical Registration | One council enrolment record with council, number, year, renewal date; a practitioner can hold several | TNMC 98765 (2020, renews 2028) |
| Education | One qualification entry with degree, institution, and year | MBBS, Madras Medical College, 2015 |
| Overall Experience | Total clinical experience in completed years | 10 years |
| Specialist Experience | Post-specialization experience in completed years, never exceeding overall | 6 years as orthodontist |

## 3. Scope

**In Scope**

- Full profile: photo and name, contact number, description, education history, medical registrations, specializations, overall and specialist experience (in years), languages, signature, OPD board display name.
- Employment: branches, departments, consultant versus visiting versus resident versus therapist roles, duty roster, leave hooks.
- Scheduling: OPD days and hours, slot duration, buffer, per-facility and chair binding, emergency slots, video-consult flag.
- Fees via pricelist, share and incentive hooks, availability with leave and block, room mapping, OT conflict detection, recently-used medicines, standard create-edit-view pattern with explorer and reports.

**Out of Scope**

- Live NMC or council API validation, payroll computation and payouts, learning management and credential courses.

## 4. MUST Functionalities

- **MUST-001 — Practitioner profile**: What: capture photo, name, contact number, description, languages, signature, board name, plus overall experience and specialist experience in completed years. Who: Admin, HR. Accepts: profile prints correctly on prescription; experience shows as e.g. "10 yrs overall, 6 yrs specialist".
- **MUST-002 — Council registration record**: What: store one or more medical registrations, each with council, registration number, year, and renewal date. Who: Admin, HR. Accepts: expired registration flagged on roster; multiple concurrent registrations supported.
- **MUST-002a — Education record**: What: store education history as one or more entries with degree, institution, and year. Who: Admin, HR. Accepts: degrees print on prescription in entry order.
- **MUST-003 — Specialization mapping**: What: assign one or more governed specializations across Allopathy, Dental, Ayurveda, Homeopathy, Physio, Psychiatry. Who: Admin. Accepts: search by specialization finds practitioner.
- **MUST-004 — Branch and department posting**: What: post practitioner to branches and departments with role type. Who: Admin, HR. Accepts: visiting doctor visible only at assigned branches.
- **MUST-005 — OPD schedule publishing**: What: publish weekly days and hours per branch with slot duration. Who: Admin, Doctor. Accepts: booking grid matches published hours.
- **MUST-006 — Slot, buffer, and emergency flags**: What: set slot length, hourly buffer, emergency and video-consult flags. Who: Admin, Doctor. Accepts: buffer never offered for booking.
- **MUST-007 — Facility and chair binding**: What: bind sessions to a room, dental chair, or therapy room. Who: Admin, Reception. Accepts: double booking of room blocked.
- **MUST-008 — Fee and pricelist linkage**: What: link new, revisit, and tele fees to branch pricelist. Who: Admin, Accountant. Accepts: billing auto-pulls correct fee.
- **MUST-009 — Leave and block management**: What: record leave or block with reason; stops new bookings instantly. Who: Admin, Doctor, HR. Accepts: blocked day shows clear patient message.
- **MUST-010 — OT and schedule conflict check**: What: warn when OPD overlaps OT or surgery duty. Who: Reception, OT coordinator. Accepts: conflict shown before confirming booking.
- **MUST-011 — Recently-used medicines**: What: maintain per-practitioner shortcut list for fast refill. Who: Doctor. Accepts: refill from shortcut in one click.
- **MUST-012 — Duty roster view**: What: weekly branch roster by department with leaves marked. Who: HR, Nurse, Reception. Accepts: roster printable for notice board.
- **MUST-013 — OPD board presence**: What: show in-room, on-leave, delayed status on public board. Who: Reception, Nurse. Accepts: delay updates board within a minute.
- **MUST-014 — Practitioner search for booking**: What: find by name, specialization, language, branch, availability. Who: Reception. Accepts: next free slot shown per result.

## 5. SHOULD (P1)

- SHOULD-001: Utilization heatmap of booked versus available slots per week.
- SHOULD-002: Automatic revisit window suggestion from department policy.
- SHOULD-003: Tele-consult link generation with WhatsApp invite.
- SHOULD-004: Visiting consultant multi-branch day planner.
- SHOULD-005: No-show and late-start trend per practitioner.

## 6. Entities & States

- Entities: Practitioner, PractitionerRegistration, PractitionerEducation, Specialization, Posting, PractitionerSchedule, PractitionerFee, LeaveBlock, DutyRoster.
- Practitioner states: draft, active, on-leave, suspended, exited.
- Schedule states: draft, published, paused. LeaveBlock states: requested, approved, cancelled.

## 7. Workflows

1. Create practitioner with photo, name, contact number, description, education, medical registrations, specializations, and overall/specialist experience.
2. Assign specializations, branches, departments, and role type.
3. Link fees to branch pricelist and set share hooks.
4. Publish OPD schedule with slots, buffers, facility binding, video flag.
5. Open booking; manage leave, blocks, and OT conflicts daily.
6. Consult, refill from recently-used list, update OPD board presence.
7. Review utilization, no-shows, collections, and roster monthly.

## 8. Business Rules

1. Booking allowed only on published schedule; double-booking a practitioner is blocked.
2. Inactive or on-leave practitioners hide from booking but stay in records.
3. Visiting consultants appear only at assigned branches and days.
4. Fee edits apply prospectively; past invoices never change.
5. Registration expiry flags the profile but preserves history.
6. Specialist experience never exceeds overall experience; both stored as completed years.

## 9. Customer Experience Requirements

- Speed: practitioner search under 1 second; schedule publish under 2 seconds.
- Clicks: create to bookable in one admin flow; leave block in 2 clicks.
- Print and WhatsApp: roster and appointment slips print cleanly and share on phone.
- Tamil and English: display names, departments, and delay notices bilingual.
- Error messages: booking blocks explain leave, full slots, or OT clash plus next free slot.

## 10. Reports & Acceptance

- Reports: practitioner-wise OPD count, collection, no-show percent, OT and surgery count, leave versus duty.
- Acceptance: create to schedule to bookable in one flow; leave block stops new bookings with a clear message; OT clash warns before confirmation.
