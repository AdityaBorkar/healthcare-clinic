# 07 — Old Age Home (Assisted Living / Geriatric Long-Stay)

## 1. Purpose
Residential geriatric care: admit residents for short or long stay, allocate room/bed, run geriatric assessments and care plans, capture daily vitals/meds/meals/physio/activity, conduct rounds with referral escalation, keep a register-only visiting log, update families via WhatsApp, and auto-compile monthly stay+meals+care bills.

The resident record is the single source of truth across clinical care, family communication, and billing, so daily logs simultaneously feed the round sheet, the family summary, and the month-end invoice.

## 2. Ubiquitous Language
| Term | Definition | Example |
|---|---|---|
| Resident | Admitted elder staying in the facility | Mrs. Rao, long-stay, Bed A-12 |
| Stay Type | Short-stay (respite) vs long-stay (continuous) | 15-day respite vs 12-month stay |
| Guardian / Payer | Responsible contact / billing party | Son (guardian), daughter (payer) |
| Room / Bed | Allocated accommodation unit | Room 201, Bed 2 |
| Care Plan | Scheduled care bundle: nursing, meds, diet, physio | Diabetic + fall-risk plan |
| ADL / IADL | Basic / instrumental daily-living scores | ADL 4/6, IADL 5/8 |
| Morse Scale | Fall-risk score 0–125 | Morse 55 = high risk |
| Braden Scale | Pressure-ulcer risk, 6–23 (lower = worse) | Braden 14 = moderate risk |
| MNA | Mini Nutritional Assessment screening | MNA 9 = at risk |
| MMSE | Cognitive screen 0–30 | MMSE 22 = mild impairment |
| Polypharmacy Review | Multi-drug reconciliation for interactions/duplication | 9 drugs → deprescribe 2 |
| Daily Care Log | One day's vitals, meds, meals, activity record | 12-Mar log: vitals + lunch + walk |
| Round | Doctor/officer bedside review with orders | Weekly MO round |
| Visiting Log | Register-only entry of visitor in/out | Son visited 17:00–17:40 |
| Family Summary | WhatsApp update of stay, health, activities | Weekly PDF summary sent |
| Stay Invoice | Monthly auto-compiled bill: stay + meals + care | March bill ₹42,500 |

## 3. Scope In/Out
In: resident profile with stay type/guardian/payer/room-bed; advance + continuous billing; listed geriatric scales; daily vitals/meds/meals/physio/activity; rounds, referral, escalation; register-only visiting log; WhatsApp family summary + feedback; monthly auto-compile billing with credit/debit notes. Out: visitor QR-scan verification and full security module; hospital IPD billing rules; advanced dementia locked-ward controls.

## 4. MUST Functionalities
- MUST-0701: Register resident with stay type, guardian, payer, ID, medical history, and advance receipt.
- MUST-0702: Allocate room/bed from floor map; enforce one resident per bed and block double allocation.
- MUST-0703: Score ADL, IADL, Morse, Braden, MNA, MMSE at admission with auto-risk bands.
- MUST-0704: Run polypharmacy review at admission and quarterly, flagging interactions/duplicates for MO sign-off.
- MUST-0705: Capture daily vitals (BP, sugar, SpO2, temp) per resident with due/missed flags.
- MUST-0706: Administer drug chart daily with missed-dose escalation to nurse dashboard.
- MUST-0707: Log meals/diet (type, quantity, refusal) with missed-meal escalation.
- MUST-0708: Log physio/yoga sessions and daily activities (walk, recreation) against care plan.
- MUST-0709: Record MO rounds with orders that convert to nursing tasks; referral to hospital creates referral note.
- MUST-0710: Trigger emergency escalation (fall, chest pain, ulcer) to MO + guardian alert path.
- MUST-0711: Maintain register-only visiting log (visitor, relation, in/out time) without biometric verification.
- MUST-0712: Send WhatsApp family summary (health + meals + activities + dues) on weekly schedule with delivery log.
- MUST-0713: Capture family/staff feedback register with action-taken field.
- MUST-0714: Auto-compile monthly stay invoice from logs: stay days + meals + care + consumables, less advance.
- MUST-0715: Support credit-note/debit-note adjustments on stay invoices with reason audit.

## 5. SHOULD P1
- SHOULD-0701: Birthday/activity calendar with participation marks.
- SHOULD-0702: Diet-plan templates per comorbidity (diabetic, renal).
- SHOULD-0703: Fall/ulcer incident register with root-cause field.
- SHOULD-0704: Guardian portal view-only summary link.
- SHOULD-0705: Occupancy forecast for respite-season planning.

## 6. Entities & States
Entities: Resident (Enquiry → Admitted → Discharged/Transferred), CarePlan (Active → Revised/Closed), ADLScore/GeriatricScore (point-in-time), DailyCareLog (Open → Complete), DrugChart (Active → Held), VisitLog (append-only), StayInvoice (Draft → Final → PartlyPaid/Paid). Bed: Vacant → Occupied → Cleaning → Vacant.

## 7. Workflows
Enquiry → Admission + advance + room/bed → Geriatric assessment + care plan + polypharmacy review → Daily logs (vitals/meds/meals/activity) + weekly rounds → Referral/escalation as needed → Family WhatsApp updates → Month-end auto-compile → Pay/collect → Discharge/transfer with summary. Missed med/meal → dashboard flag → nurse action.

Assessment repeats quarterly (or after fall/illness) and auto-revises the care plan risk flags; hospital referral keeps the bed held for a configured hold period before release.

## 8. Business Rules
- One resident per bed; transfer requires release-then-allocate in one transaction.
- Admission cannot complete without guardian + payer and first care plan.
- Missed meds/meals escalate to nurse dashboard same day; high-risk (Morse/Braden) flags surface on round sheet.
- Monthly bill compiles only from finalized daily logs; unlogged days list as exceptions.
- Visiting log is register-only; no identity verification claim.
- Discharge requires dues settlement or documented payer undertaking.
- Advance-balance alerts fire at 80% consumption so families can top up before month-end.

## 9. CX Requirements
- Admission form under 5 min with guardian/payer capture and bed picker map.
- Daily log is single-screen checklist per resident; round sheet prints one page per floor.
- Family summary is short, warm-language WhatsApp message + PDF; feedback reply captured in one tap.
- Billing shows day-wise breakup (stay/meals/care) the family can understand.
- Incident screens (fall/ulcer) use calm guided steps so caretakers file them in under 2 minutes.

## 10. Reports & Acceptance
Reports: occupancy, ADL trends, fall/ulcer incidents, collection vs dues, round compliance, meal/medication compliance. Acceptance: (a) admission → care plan → first daily log same day; (b) monthly bill auto-compiles from logs with exceptions listed; (c) double-bed allocation blocked; (d) missed med/meal appears on dashboard; (e) WhatsApp summary delivery logged.
