# 05 — Rehab (Physio, Occupational, Speech-Swallowing)

## 1. Purpose
Function-oriented rehabilitation: assess impairment, set measurable goals, deliver therapy sittings, re-score outcomes, and discharge the patient to a safe home program. Covers physiotherapy, occupational therapy, and speech-swallowing therapy in OPD and daycare settings, with package billing and therapist/equipment scheduling.

Rehab is episode-based: one referral opens an episode that owns assessments, goals, packages, sittings, and the discharge summary, so gain and adherence report per episode and per condition.

## 2. Ubiquitous Language
| Term | Definition | Example |
|---|---|---|
| Rehab Assessment | Baseline functional evaluation using standard scales | MMT grade 3 quadriceps, Berg 32/56 |
| MMT | Manual Muscle Testing, 0–5 strength grade per muscle | Shoulder abduction grade 4 |
| ROM | Range of Motion in degrees, active/passive per joint | Knee flexion AROM 0–110° |
| Berg Balance Scale | 14-item balance test scored 0–56 | Berg 41/56 = independent |
| Barthel Index | 0–100 ADL independence score | Barthel 70 = moderate dependence |
| FIM | Functional Independence Measure, 18 items × 1–7 | FIM motor 62, cognition 30 |
| VAS | Visual Analogue Scale for pain, 0–10 | VAS 6 → 3 post-session |
| Gait Analysis | Observed gait pattern, aids, distance, assistance level | Walker-assisted 50 m, antalgic gait |
| GUSS | Gugging Swallowing Screen for dysphagia risk | GUSS 14 = moderate dysphagia |
| FOIS | Functional Oral Intake Scale, levels 1–7 | FOIS 5 = total oral diet, multiple consistencies |
| Care Goal | Short-term (2–4 wk) or long-term (8–12 wk) measurable target | Walk 100 m unaided in 6 weeks |
| Therapy Package | Tailor-made bundle of sittings for a condition | 10-session back-pain package |
| Rehab Sitting | One executed therapy procedure with vitals + modalities | Sitting 4/10: IFT + exercise, pre/post vitals logged |
| Modality | Physical agent used in a sitting | IFT, ultrasound, TENS, wax bath |
| Home Program | Prescribed exercise sheet with images/videos for home | Printed sheet + WhatsApp PDF with 6 exercises |
| Discharge Summary | Closing note with pre/post scores and home advice | Berg 32→48, continue home program 4 weeks |

## 3. Scope In/Out
In: physio/OT/speech assessments and scales listed above; goal plans; tailor-made packages; therapist + equipment scheduling with conflict detection; daycare sitting capture (pre/post vitals, modality, consumables, billing hook); exercise sheet with media, print/WhatsApp; progress chart and discharge. Out: wearable/EMG device streaming; inpatient rehab ward management (see 11-IPD); prosthetic fabrication; tele-rehab video consult hosting (link only).

## 4. MUST Functionalities
- MUST-0501: Record MMT per muscle group (0–5 with +/−) and ROM per joint (active/passive, degrees) on a body-chart form.
- MUST-0502: Score Berg (14 items), Barthel (10 items), FIM (18 items), VAS (0–10), and gait (aid, distance, assistance, pattern) with auto-totals and severity interpretation.
- MUST-0503: Score GUSS and FOIS for speech-swallowing cases with diet recommendation derived from band.
- MUST-0504: Create short-term and long-term goals per assessment, each with measure, target date, and linked outcome scale.
- MUST-0505: Build tailor-made Physio packages (e.g. 10-session back-pain, post-stroke) with sitting count, validity days, price, and included modalities.
- MUST-0506: Book therapist + equipment/facility slots with conflict detection (therapist double-book, equipment overlap) and suggest next free slot.
- MUST-0507: Capture each daycare sitting as a Procedure with pre vitals, modality used with dosage/duration, post vitals, and therapist note.
- MUST-0508: Capture consumables per sitting (gel pads, electrodes, tape) and push line items to billing.
- MUST-0509: Decrement package sitting balance on attended sittings only; show remaining/expiry on booking.
- MUST-0510: Re-score linked outcome scales at review sittings and render pre/post progress chart.
- MUST-0511: Refuse sitting close without vitals note and at least one modality or exercise entry.
- MUST-0512: Generate exercise prescription sheet with images/videos from library, dosage (sets × reps × frequency), and precautions.
- MUST-0513: Print home program and send via WhatsApp (PDF + media links) with delivery log.
- MUST-0514: Produce discharge summary with admission vs discharge scores, sittings attended/missed, and home-program continuation plan.
- MUST-0515: Show therapist day board: booked, in-progress, completed sittings with load counts.

## 5. SHOULD P1
- SHOULD-0501: Package pause/extend on medical grounds with approval trail.
- SHOULD-0502: Missed-sitting recall via SMS/WhatsApp reminder.
- SHOULD-0503: Group-therapy batch booking (one therapist, many patients).
- SHOULD-0504: Outcome benchmark: compare gain against condition-average.
- SHOULD-0505: Equipment maintenance block that prevents booking during downtime.

## 6. Entities & States
Entities: RehabAssessment (Draft → Final), RehabGoalPlan (Active → Achieved/Modified/Closed), TherapyPackage (Active → Exhausted/Expired), RehabSession/Sitting (Booked → CheckedIn → InProgress → Completed/Cancelled/NoShow), ExercisePrescription (Active → Superseded), OutcomeScore (point-in-time). Equipment master reuses Facility with schedule blocks.

## 7. Workflows
Referral/OPD → Assessment (scales) → Goals + Package selection → Schedule (therapist + equipment) → Sitting execution (pre vitals → modality/exercise → post vitals → consumables → billing) → Re-score at reviews → Progress chart → Discharge + home program. No-show → recall → rebook within package validity.

Review sittings (e.g. every 5th sitting) mandate re-scoring of the primary goal scale; ward-referred cases notify the referring doctor at discharge with the gain summary.

## 8. Business Rules
- Session cannot close without outcome/vitals note (enforced at save).
- Package sessions decrement on attendance only; cancelled/no-show does not decrement unless policy flags late-cancel.
- Expired or exhausted package blocks new bookings until renewed.
- Equipment conflict blocks booking; therapist overlap warns and requires override reason.
- GUSS high-risk band forces NPO/diet-hold flag and doctor notification before oral intake plan.
- Discharge requires at least one pre and one post score on the primary goal scale.
- Therapist cannot be booked for two sittings in overlapping time windows even across branches.

## 9. CX Requirements
- Assessment form completable in < 6 min with body-chart pickers and scale calculators.
- Sitting capture one screen: vitals → modality → exercises → consumables → close.
- Progress chart printable in one page; home program sheet uses large images with Hindi/English instructions.
- Booking shows therapist photo, room/equipment, and remaining package balance inline.
- Package expiry warnings appear at booking (7 days) and on the sitting screen (3 days).

## 10. Reports & Acceptance
Reports: functional gain (pre/post per scale), session adherence %, therapist load, package sale vs utilization vs revenue, no-show rate. Acceptance: (a) assessment → plan → first sitting booked in same visit; (b) package balance decrements only on attendance; (c) progress graph printable; (d) sitting cannot close without vitals; (e) conflict booking blocked with alternative offered.
