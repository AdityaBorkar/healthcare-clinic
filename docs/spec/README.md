# Healthcare Clinic — Spec Index

Small-medium clinics/hospitals: Allopathy, Dental, AYUSH + Rehab, Psychiatry, Old Age Home.

## Files

- `00-overview.md` — platform vision, clinic vs hospital tiers, shared assumptions
- `01-core-registration-queue.md` — registration, OPD tokens, queue, video, certificates
- `02-emr-allopathy.md` — allopathy OPD/IPD encounter, orders, e-prescription
- `03-dental.md` — dental charting, treatment plans, sittings, lab jobs
- `04-ayush.md` — Ayurveda/Homeopathy OPD, Nadi exam, Panchkarma/therapy schedule, diet plans
- `05-rehab.md` — physio/occupational/speech plans, sittings, outcome scores
- `06-psychiatry.md` — psychiatry/psychology/de-addiction encounters, safety, scales
- `07-old-age-home.md` — assisted-living roster, geriatric long-stay, family updates
- `08-pharmacy-inventory.md` — prescription sales, batch/FEFO, PO-GRN-billing, OT indent, continuous IPD
- `09-lab-radiology.md` — test masters, orders, barcodes, authorization, radio slots (HL7 out)
- `10-billing-insurance.md` — invoices/CN/DN, packages, payer pricelists, TPA pre-auth, dues/GST
- `11-ipd-bed-ot-nursing.md` — ADT, beds, OT scheduling, nursing tasks, discharge
- `12-admin-hr-reports-compliance.md` — HR/roster hooks, masters, branches, reports, NABH/NABL, messaging
- `13-administration.md` — company/branch, users/roles, masters governance
- `14-practitioners.md` — practitioner profile, roster, schedule, fees, availability
- `15-patients.md` — patient identity, timeline, dedupe, family, consents
- `16-facilities.md` — bookable units, schedules, categories, floor-plan map
- `17-services.md` — service catalog, facility mapping, pricing/packages, clinical+billing binding
- `18-appointments.md` — slot engine, queue, video, reminders, conflicts, daycare subtype
- `19-nursing.md` — drug chart, vitals, tasks, handover, daycare support
- `20-medical-records.md` — timeline, documents, registers, sharing, retention

## Tiers

- Clinic (OPD-only) = 01 + 08/09/10 subset + specialty EMR (02–06 as needed).
- Hospital (IPD + OT) = all + 11 (ADT/beds/OT/nursing) + 07 for geriatric long-stay.
