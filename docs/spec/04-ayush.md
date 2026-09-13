# 04 — AYUSH (Ayurveda, Yoga, Unani, Siddha, Homeopathy)

## 1. Purpose
Pathy-faithful AYUSH consulting: Ayurveda case-taking (Prakriti/Nadi/Dosha/Agni/Mala/Koshtha, Shodhana-Shamana), Homeopathy repertorization with miasm/potency, NAMASTE + ICD-11 TM2 dual coding, Nadi examination as a bookable facility+service, Panchkarma/therapy/physio scheduling with daycare procedures, tailor-made N-sitting packages, per-pathy diet (Pathya-Apathya) and Yoga batches, and Anupana-aware prescriptions.
Where allopathy or dental co-consults occur, this spec links to specs 02/03 for ICD-coded diagnosis and dental charting rather than duplicating them. Therapy revenue lives in packages and sittings, so attended/remaining/expiry discipline is a correctness requirement.

## 2. Ubiquitous Language

| Term | Definition | Example |
|---|---|---|
| Prakriti | Constitutional type (Vata/Pitta/Kapha balance) | "Vata-Pitta Prakriti" |
| Nadi Pariksha | Pulse examination with recorded findings | "Nadi: Vata dominant" |
| Dosha/Agni/Mala/Koshtha | Ayurvedic assessment axes | "Mandagni, Krura Koshtha" |
| Shodhana/Shamana | Purificatory vs. pacifying treatment arms | "Virechana (Shodhana) + Shamana drugs" |
| Repertorization | Homeopathic symptom→remedy analysis sheet | "Repertorized to Sulphur 200" |
| Miasm/Potency | Homeopathic diathesis + dose strength | "Psoric miasm, 200C single dose" |
| NAMASTE / TM2 | AYUSH morbidity codes + ICD-11 TM2 chapter | "NAMASTE A-221 + TM2 code" |
| Nadi Room | Facility where Nadi exam happens as booked slot | "Nadi room, 15-min service" |
| Daycare Procedure | Single therapy sitting with pre/post vitals + consumables | "Abhyanga sitting #3" |
| Tailor Made Package | N sittings over X days, mixed procedures, expiry/pause | "10-sitting physio package, 30-day expiry" |
| Pathya-Apathya | Do/don't diet-lifestyle chart per Prakriti/pathy | "Pitta Pathya chart printed" |
| Anupana | Vehicle/medium for medicine intake | "With warm water (Anupana)" |
| Yoga Batch | Scheduled group asana/pranayama cohort | "6am Yoga batch, 20 seats" |
| Follow-up Grid | Homeopathy response-tracking table across visits | "Grid: stool/sleep/skin improving" |

## 3. Scope In/Out
In: Ayurveda case sheet fields above; Homeopathy repertorization/miasm/potency/follow-up grid; dual NAMASTE+TM2 coding; Nadi exam as Facility+Service slot; Panchkarma/therapy/physio scheduling with conflict detection; daycare procedure (pre/post vitals, consumables, therapist note, billing hook); tailor-made packages (N sittings, expiry, pause/extend, attended/remaining); diet/Prakruti Pathya-Apathya per-pathy templates; Yoga batches; Anupana; recently-used classical + proprietary list. Out: automated dosha ML scoring, tele-Yoga streaming platform.

## 4. MUST Functionalities

- MUST-001: Vaidya records Prakriti + Nadi + Dosha/Agni/Mala/Koshtha on AYUSH case sheet — _accept: all axes present before prescription._
- MUST-002: Vaidya plans Shodhana vs. Shamana arms explicitly — _accept: plan labels each line Shodhana/Shamana._
- MUST-003: Homeopath records chief complaint + repertorization sheet + miasm + potency/dose — _accept: remedy traceable to sheet entries._
- MUST-004: Homeopath maintains follow-up grid across visits — _accept: prior responses visible at review._
- MUST-005: Practitioner dual-codes diagnosis (NAMASTE + ICD-11 TM2) — _accept: both codes stored per diagnosis._
- MUST-006: Reception books Nadi Examination as Service → Facility (Nadi room) slot — _accept: findings land on AyushCaseSheet._
- MUST-007: Coordinator schedules Panchkarma/therapy/physio by therapist + room/equipment + slot with conflict detection — _accept: double-booked therapist blocked._
- MUST-008: Therapist captures each sitting as daycare procedure with pre/post vitals — _accept: sitting without vitals flagged incomplete._
- MUST-009: Therapist logs consumables + note per sitting with billing hook — _accept: sitting posts consumable + charge lines._
- MUST-010: Reception sells tailor-made packages (N sittings / X days, mixed procedures) — _accept: attended/remaining auto-tracked._
- MUST-011: Coordinator pauses/extends packages with expiry handling — _accept: expired package blocks new sittings._
- MUST-012: Practitioner prescribes from recently-used classical + proprietary list with Anupana/dosage — _accept: Anupana prints on prescription._
- MUST-013: Dietician issues per-pathy diet templates (Ayurveda/Homeopathy/Allopathy/Dental variants) — _accept: print/WhatsApp in English/regional language._
- MUST-014: Coordinator runs Yoga asana/pranayama batches with enrollment — _accept: batch roster + attendance kept._
- MUST-015: Practitioner tracks Shodhana/Shamana outcomes over cycles — _accept: outcome note per package completion._

## 5. SHOULD P1
- SHOULD-01: Prakriti questionnaire scoring aid (manual, non-ML).
- SHOULD-02: Therapy room day-roster wallboard.
- SHOULD-03: Package low-balance auto-reminder.
- SHOULD-04: Seasonal Pathya calendar per Prakriti.
- SHOULD-05: Homeopathy remedy interaction check.

## 6. Entities & States
AyushCaseSheet (Open/Signed), PrakritiAssessment, Diagnosis (NAMASTE+TM2), TherapyPackage (Active/Paused/Expired/Completed), TherapySchedule/Session (Booked/Attended/Missed), DaycareProcedure (Open/Billed/Closed), DietPlan (Issued), YogaProtocol/Batch (Open/Full/Closed).

## 7. Workflows
- Case-taking → Dual-code diagnosis → Prescription (+Anupana) + Diet → Therapy package (if needed) → Session scheduling → Attendance with vitals/consumables → Outcome review.
- Nadi: book Service→Facility slot → exam → findings to case sheet → prescription.
- Package: sell N-sittings → schedule sittings → track attended/remaining → pause/extend or expire → outcome note.
- Diet/Yoga: prescription → diet template + Yoga batch enrollment → attendance → review at follow-up.

## 8. Business Rules
- Therapy session requires package + therapist + facility slot.
- Multi-day package tracks attended/remaining; expiry blocks booking.
- Daycare sitting requires pre + post vitals to close.
- Dual coding mandatory for AYUSH diagnoses.
- Diet template selected per pathy (not one-size-fits-all).
- Package pause requires reason + new expiry; extensions beyond one cycle need practitioner approval.

## 9. CX Requirements
- Nadi + Prakriti → prescription + diet prints in one flow.
- Package balance (remaining/expiry) visible to patient on slip.
- Diet charts illustrated and regional-language ready.
- Therapy roster readable at a glance by room/therapist/day.
- Prescription shows classical vs. proprietary grouping clearly.

## 10. Reports & Acceptance
Reports: therapy utilization, package expiry/low-balance, practitioner-wise OPD, medicine usage (classical vs. proprietary), Yoga attendance. Acceptance: Nadi + Prakriti → print verified; therapist double-booking blocked in test; package attended/remaining + expiry enforced end-to-end.
Daycare consumable cost per sitting reviewable against package price.
