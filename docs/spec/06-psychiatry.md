# 06 — Psychiatry (incl. Psychology, De-addiction)

## 1. Purpose
Confidential mental-health OPD/IPD: masked scheduling, structured assessment with validated scales, counselling and tele-psychiatry, de-addiction withdrawal care, controlled-drug discipline, and suicide-risk escalation — with reception and non-authorized roles seeing slots only, never clinical content.

Every encounter re-screens risk and refreshes the plan, so a stable follow-up can escalate to crisis protocol within the same visit without losing confidentiality discipline.

## 2. Ubiquitous Language
| Term | Definition | Example |
|---|---|---|
| Masked Note | Clinical note hidden from all but authorized roles | "Follow-up — confidential" shown to reception |
| Break-Glass | Emergency override access with mandatory reason + audit | Nurse opens note during crisis, logged |
| Psychometric Scale | Validated questionnaire with scored severity band | PHQ-9 15 = moderately severe |
| PHQ-9 / GAD-7 | Depression / anxiety screeners (0–27 / 0–21) | PHQ-9 18, GAD-7 12 |
| YMRS / HAM-D / HAM-A | Mania / depression / anxiety clinician scales | YMRS 22 = acute mania |
| MMSE / MoCA | Cognitive screens (0–30) | MoCA 21 = mild impairment |
| AUDIT / DAST | Alcohol / drug use screeners | AUDIT 19 = high-risk drinking |
| Risk Assessment | Suicide/self-harm/violence screen with level | High risk: plan + means present |
| Safety Plan | Documented coping + contact + means-restriction plan | Warning signs, 3 contacts, helpline |
| Counselling Sitting | Timed therapy session with duration billing | 45-min CBT sitting, billed per slab |
| Tele-Psychiatry | Remote video/audio consult with consent + link | Tele follow-up, consent logged |
| CIWA / COWS | Alcohol / opioid withdrawal severity charts | CIWA 18 = moderate withdrawal |
| Relapse Plan | Trigger map + coping + follow-up schedule post-detox | 3 triggers, weekly review × 4 |
| Controlled Drug | Regulated psychotropic with refill control | Clonazepam 0.5 mg, 14-day refill |
| Caregiver Consent | Guardian permission for minor/incapacitated care | Mother consents for adolescent therapy |
| Involuntary Note | Legal-hold documentation hook per local act | Reception order reference attached |

## 3. Scope In/Out
In: confidentiality + break-glass; reception slot-only view; listed scales; suicide-risk escalation with safety plan + senior alert; counselling scheduling + duration billing + tele; de-addiction admission, CIWA/COWS charting, relapse plan; controlled-drug refill control + side-effect checklist; caregiver consent + involuntary hooks. Out: MLC/legal certification automation; court-report generation; eCT/ward procedure management.

## 4. MUST Functionalities
- MUST-0601: Mask all psych notes/content by default; unauthorized roles see only slot time, doctor, and masked reason.
- MUST-0602: Provide break-glass access requiring reason + OTP/confirm, writing immutable audit (who, when, reason).
- MUST-0603: Score PHQ-9, GAD-7, YMRS, HAM-D, HAM-A, MMSE, MoCA, AUDIT, DAST with auto-totals, severity bands, and trend view.
- MUST-0604: Force structured suicide/self-harm risk screen on every new and review encounter with Low/Moderate/High level.
- MUST-0605: On Moderate/High risk, block encounter close until safety plan is saved and senior clinician alert is sent.
- MUST-0606: Schedule counselling sittings by duration slab (30/45/60 min) with duration-based billing hook.
- MUST-0607: Support tele-psychiatry booking with consent capture, link log, and duration billing identical to in-person.
- MUST-0608: Manage de-addiction admission with substance history, last-use log, and withdrawal chart schedule.
- MUST-0609: Chart CIWA-Ar and COWS serially with score-triggered medication protocol prompts.
- MUST-0610: Create relapse prevention plan (triggers, coping, support contacts, follow-up dates) at discharge.
- MUST-0611: Flag controlled drugs at prescription with max days/refill gap, and block early refill without override reason.
- MUST-0612: Capture side-effect checklist (EPS, sedation, weight, metabolic) at each psychotropic review.
- MUST-0613: Record caregiver consent (relationship, ID, scope) for minors/incapacitated patients before therapy.
- MUST-0614: Attach involuntary-admission hook note (authority, order ref, review date) without generating legal certificates.
- MUST-0615: Send missed follow-up recall for risk-positive and de-addiction cases on configurable days-overdue.

## 5. SHOULD P1
- SHOULD-0601: Anonymized scale-trend dashboard for quality review.
- SHOULD-0602: Counsellor caseload view with supervision-flag queue.
- SHOULD-0603: Mood/sleep diary patient-reported capture between visits.
- SHOULD-0604: Group-therapy batch with per-patient attendance billing.
- SHOULD-0605: Interaction check psychotropic vs comorbidity meds.

## 6. Entities & States
Entities: PsychAssessment (Draft → Final), ScaleResult (point-in-time), RiskFlag (Active → Resolved/Escalated), SafetyPlan (Active → Reviewed), CounsellingSession (Booked → Completed/Cancelled/NoShow), AddictionChart (Active → Closed), ControlledPrescription (Active → Exhausted/Held). Notes: Masked default; break-glass creates access-log entry.

## 7. Workflows
Book (masked reason) → Assessment + scales → Risk screen → Plan (meds + therapy) → Counselling sittings/tele → Risk review each visit → Refill/side-effect check → Relapse plan (addiction) → Follow-up/recall. Crisis path: High risk → safety plan → senior alert → caregiver involvement → close follow-up scheduled < 7 days.

Admission path (de-addiction/IPD): admission note + consent → withdrawal chart schedule → daily review → relapse plan → discharge with scheduled follow-up; elopement/absconding logs an incident and notifies guardian.

## 8. Business Rules
- Risk-positive encounter cannot close without safety plan + senior alert (hard block).
- Reception and non-authorized roles can never open clinical content; every break-glass is audited.
- Controlled-drug refill before minimum gap requires psychiatrist override with reason.
- Tele-psychiatry requires recorded consent before link issue.
- De-addiction discharge requires relapse plan and scheduled follow-up.
- Caregiver consent mandatory for patients flagged minor/incapacitated before counselling starts.
- Scale re-administration interval is enforced (e.g. PHQ-9 not re-scored within 7 days without reason) to prevent noise.

## 9. CX Requirements
- Booking shows neutral reason labels ("Follow-up") — never diagnosis — on reception screens and slips.
- Risk screen is one page with plain-language prompts and auto-level; safety plan prints as patient-friendly card.
- Scale entry uses large tap targets with running total visible; trend sparkline on review.
- Break-glass flow is 2 clicks with reason picker; audit receipt shown immediately.
- All screens use neutral language in headers so shoulder-surfing reveals no diagnosis.

## 10. Reports & Acceptance
Reports: counselling load per clinician, scale trends (anonymized), missed follow-up recall list, de-addiction retention/completion, break-glass audit, controlled-drug refill overrides. Acceptance: (a) reception cannot open clinical content in any path; (b) risk flag blocks close without safety plan; (c) break-glass events appear in audit; (d) early refill blocked without override; (e) CIWA/COWS serial chart renders with protocol prompts.
