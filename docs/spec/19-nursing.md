# 19 — Nursing

## 1. Purpose
Execute and document all bedside, ward, and daycare nursing: convert doctor orders into a due/overdue task board, chart vitals/I-O/pain/scales, administer the drug chart with missed-dose escalation and allergy/batch discipline, support Panchkarma/Physio sittings and PACU recovery, manage transfer/discharge checklists, and auto-compile shift handover with triage escalation.

Nursing documentation is the legal record of execution: every order must resolve to Given/Held/Refused with timestamp and nurse identity, and the handover carries forward everything still open.

## 2. Ubiquitous Language
| Term | Definition | Example |
|---|---|---|
| Nursing Task | Actionable item derived from a doctor order | "Inj. Ceftriaxone 1 g IV BD" due 14:00 |
| Task Board | Due/overdue queue per nurse, shift, and bed | 6 due, 2 overdue highlighted red |
| Vitals Chart | Serial BP/pulse/temp/SpO2/RR record | 6-hourly vitals for Bed 12 |
| I/O Chart | Intake-output balance (fluids, urine, drains) | +1200/−900 = +300 ml |
| Pain Score | 0–10 or faces scale per assessment | Pain 7 → 3 post-analgesic |
| Fall/Ucer/Nutrition Scale | Morse, Braden, MNA-equivalent screens | Morse 50 = high fall risk |
| Drug Chart | Scheduled administrations with dose/route/time | Paracetamol 650 mg PO TDS |
| Missed-Dose Escalation | Overdue med surfaced to senior/dashboard | 60-min overdue → alert |
| Allergy Warning | Hard stop/verify on allergen prescription | Penicillin allergy → block |
| Batch Trace | Lot/batch recorded per administration | Ceftriaxone Batch B-221 |
| PACU | Post-anesthesia care unit recovery monitoring | Aldrete-scored recovery |
| Transfer Checklist | Bed/ward move prep and readiness items | Oxygen + file + consent moved |
| Discharge Checklist | Take-home readiness: meds, advice, follow-up | Discharge meds counselled |
| Handover | Shift-change summary auto-compiled from logs | Night → morning handover sheet |
| Triage Level | Urgency band driving escalation speed | Red → immediate doctor call |

## 3. Scope In/Out
In: order-to-task board with due/overdue; vitals/I-O/pain/scales; drug chart with escalation, allergy warning, batch trace; daycare Panchkarma/Physio sitting support; PACU post-op monitoring; bed transfer/discharge checklists; auto-compiled handover; triage escalation. Out: device vitals streaming (manual entry only); acuity-based auto-staffing; doctor order entry itself (see EMR/IPD).

## 4. MUST Functionalities
- MUST-1901: Convert every doctor order into nursing tasks (meds, vitals, dressings, samples) with due time and owner.
- MUST-1902: Show task board per shift/bed with Due, Overdue, Done states; overdue tasks stay visible until resolved, never silently close.
- MUST-1903: Chart vitals with EWS-style abnormal highlighting and repeat-due prompt.
- MUST-1904: Chart intake-output with running balance per shift and day.
- MUST-1905: Record pain scores pre/post intervention with reassessment due flag.
- MUST-1906: Score fall, pressure-ulcer, and nutrition screens with precaution orders (rails, turning schedule, diet).
- MUST-1907: Administer drug chart per schedule capturing given/held/refused with reason, witness where required.
- MUST-1908: Escalate missed doses past grace period to senior nurse dashboard with reason-required closure.
- MUST-1909: Raise allergy/interaction warning at administration; allergen match blocks without doctor override.
- MUST-1910: Record batch/lot for injectables, vaccines, and blood products on every administration.
- MUST-1911: Support daycare Panchkarma/Physio sittings: pre/post vitals, nurse note, consumables capture.
- MUST-1912: Monitor PACU with serial vitals + Aldrete-style readiness score and post-op order execution.
- MUST-1913: Execute bed transfer and discharge checklists with tick-off + sign, blocking discharge print on open items.
- MUST-1914: Auto-compile shift handover from shift logs (tasks, vitals exceptions, pending, escalations).
- MUST-1915: Triage-tag walk-in/emergency arrivals and escalate Red/urgent to doctor immediately with timestamp.

## 5. SHOULD P1
- SHOULD-1901: Turning-chart timer for ulcer-risk patients.
- SHOULD-1902: Nurse workload view (tasks per nurse per shift).
- SHOULD-1903: Sample-collection tracking to lab handoff.
- SHOULD-1904: Family update log (what was communicated, by whom).
- SHOULD-1905: Round-compliance checklist per doctor round.

## 6. Entities & States
Entities: NursingTask (Open → Done/Overdue → Closed-with-reason), NursingNote (signed point-in-time), Vitals/I-O entries (append-only), DrugAdministration (Due → Given/Held/Refused/Missed), Handover (Draft → Signed), Transfer/DischargeChecklist (Open → Complete). Orders stay authoritative; tasks mirror them.

## 7. Workflows
Doctor Order → Task Queue (auto-split by schedule) → Execute (vitals/meds/procedure) → Document (note + batch + vitals) → Escalate on miss/abnormal → Handover → Round review. Daycare path: sitting request → pre vitals → support care → post vitals → consumables → handover note. PACU path: receive → serial vitals → readiness → ward transfer.

Triage path: walk-in/emergency → tag level → Red bypasses queue to immediate doctor call; all paths converge on the signed shift handover as the continuity record.

## 8. Business Rules
- Order without execution stays overdue-visible; closure requires Given/Held/Refused with reason.
- Missed meds/meals escalate past grace period; escalation cannot be cleared without senior sign.
- Allergy match blocks administration without documented doctor override.
- All injectable/vaccine administrations trace to batch; missing batch blocks save.
- Discharge print blocked while checklist items remain open.
- Handover sign-off required every shift change; unsigned handover flags on dashboard.
- Verbal/telephone orders require doctor countersign within 24 hours or they stay flagged.

## 9. CX Requirements
- Task board is glanceable: red overdue, amber due-soon, one-tap start/document.
- Drug administration under 30 s per dose with barcode/batch picker and big Given/Held buttons.
- Handover prints one page per ward; handoff meeting runs from the compiled sheet.
- Overdue badges sync live during the shift without page refresh.
- Refused-dose entries force a reason picker so intent is never ambiguous later.
- Abnormal vitals show plain-language action ("Repeat in 15 min, inform MO").

## 10. Reports & Acceptance
Reports: task compliance %, missed-dose %, vitals completeness, handover audit (signed/late), nurse workload, fall/ulcer incidents, PACU readiness times. Acceptance: (a) order → task → documented administration in one flow; (b) overdue never disappears silently; (c) allergy block works without override; (d) shift handover auto-compiles and requires sign; (e) discharge blocked on open checklist.
