# 17 — Services

## 1. Purpose
One priced, bookable, billable catalog of everything the organization sells — consults, procedures, tests, therapies, packages — so that booking, clinical ordering, and billing all speak the same language. A new service goes from definition to revenue without code changes.

## 2. Ubiquitous Language

| Term | Definition | Example |
|---|---|---|
| Service | Orderable/bookable unit of care or goods-bundle | RCT sitting, MRI Brain |
| Code | Unique short identifier for a service | SRV-RCT-01 |
| Department | Owning clinical area | Dental, Physio |
| Pathy | Medical system the service belongs to | Ayurveda, Allopathy |
| Modality | Care setting the service runs in | OPD / IPD / daycare / tele |
| Duration | Standard slot length for booking | 30 min |
| Facility mapping | Required bookable unit(s) to deliver a service | MRI Brain → MRI room |
| Billing UOM | Governed unit (see 21) a service is billed in | Per `sitting`, per `tooth`, per `visit` |
| Duration UOM | Governed Time-category unit the slot length is expressed in | 30 `min`, 1 `hour` |
| Default pricelist | The seeded `Default` rate card guaranteed per branch; fallback for all pricing | New branch opens with Default live |
| Pricelist | Named, versioned rate card mapping services to fees (managed inside this module) | Cash, CGHS, TPA-XYZ, Default |
| Pricelist price | Service row inside one pricelist (fee + tax + effective dates) | MRI Brain ₹800 on Cash v3 |
| Tax/GST | Tax treatment attached to price | 18% GST slab |
| Package bundling | Grouping services into a prepaid bundle | Physio 10-pack |
| Consent template | Service-linked consent form required pre-procedure | RCT consent |
| Pre-requisite | Clinical readiness check before execution | PAC, fasting report |
| Daycare capture | Procedure documentation for same-day care | Panchkarma sitting note |
| Versioning | Price/master changes as new versions, history kept | v3 from 2026-04 |
| Redemption | Consuming package scope against a visit | 1 sitting redeemed |

## 3. Scope In/Out

In: service master (name/code/dept/pathy/modality/duration + duration/billing UOMs from 21), required facility mapping, pricelist master management (multiple named pricelists + seeded `Default`, payer/branch binding, versioned prices) with cost + tax/discount + package bundling, clinical binding (orders/consent/prereqs/daycare), billing binding (invoice line / package redeem / continuous IPD), versioning, standard create-edit-view pattern.
Out: external charge-master auto-sync (CGHS import), claims adjudication, roster/scheduling engine (see 18), stock management (see 08). UOM definitions themselves live in 21 — services only bind to them.

## 4. MUST Functionalities (P0)

- MUST-1701: Admin MUST create/edit/view a Service with name, unique code, department, pathy, modality, duration, and active flag via a standard pattern UI.
- MUST-1702: Every Service MUST list required facilit(ies); booking MUST be blocked when no facility mapping exists (except pure consult/tele, explicitly exempted).
- MUST-1703: Service MUST carry pricelist-wise prices (cash/CGHS/ECHS/TPA) with GST/tax treatment and effective dates.
- MUST-1704: Admin MUST define discount rules per service/pricelist (max %, approver threshold) consumed by billing.
- MUST-1705: Admin MUST bundle services into packages (sessions, validity, scope) that billing redeems against — e.g. RCT + crown, Panchkarma 7-day.
- MUST-1706: Service MUST bind to clinical order entry: selecting it MUST raise the right order type (lab/radio/procedure/therapy) with defaults.
- MUST-1707: Service MUST bind a consent template where required; execution MUST be blocked until signed consent is on file.
- MUST-1708: Service MUST declare pre-requisites (PAC, reports, fasting); booking/execution MUST warn or block per severity.
- MUST-1709: Daycare-modality services MUST open a procedure-capture note (pre/post, materials) on the appointment/visit.
- MUST-1710: Every Service MUST bill as a sales-invoice line and accrue to continuous IPD tabs where applicable; package-scope visits MUST redeem, not charge.
- MUST-1711: All master and price changes MUST version (new effective row); historical invoices/orders MUST keep the price-at-time.
- MUST-1712: Inactive services MUST hide from booking/ordering while remaining in history and reports.
- MUST-1713: Search MUST work by name, code, department, pathy, and modality with <100ms type-ahead for front-desk speed.
- MUST-1714: Duplicate service (same name + dept + modality) MUST be blocked with a merge suggestion.
- MUST-1715: Every Service MUST declare a Billing UOM and a Duration UOM by reference to the governed UOM master (see 21) — free-text units are forbidden; mismatched-category UOM selection MUST be rejected.
- MUST-1716: Admin MUST manage Pricelists inside this module: create/edit/view named pricelists (name, code, currency, branch scope global/local, payer binding cash/CGHS/ECHS/TPA/corporate, tax-inclusive flag, rounding rule, active flag) via the standard pattern UI.
- MUST-1717: The system MUST seed one `Default` pricelist (code `DEFAULT`, branch-global, tax-inclusive per org setting) on organization setup and copy-attach it to every new branch; `Default` MUST never be deletable and MUST always remain publishable as the fallback price.
- MUST-1718: Price resolution MUST follow a deterministic chain — booking/billing context (branch + payer) → matching pricelist → `Default` fallback; when no price exists anywhere the line MUST block with "no rate on pricelist X nor Default" instead of silently zero-rating.
- MUST-1719: Pricelist versions MUST carry effective-date ranges with exactly one active version per pricelist at any date; switching payer MUST re-price only open/draft lines before finalization, preserving audit of the switch.
- MUST-1720: Bulk price revision (CSV import or % uplift per pricelist) MUST run as draft → preview (affected services × old → new) → approve (maker ≠ checker) → publish; publish MUST be atomic per pricelist version.

## 5. SHOULD P1 (4-6)

- SHOULD-1701: Service bundles with optional add-ons (crown type choice on RCT pack).
- SHOULD-1702: Demand-based duration overrides (senior consultant = longer slot).
- SHOULD-1703: Payer formulary flags (CGHS-approved-only marker).
- SHOULD-1704: Utilization alerts (low-demand services flagged quarterly).
- SHOULD-1705: Bulk price revision with preview + approval before publish.
- SHOULD-1706: Pricelist simulator — preview any service basket across pricelists (Cash vs CGHS vs Default) before selecting payer at booking.
- SHOULD-1707: UOM-aware duration display — slot length auto-renders in the service's Duration UOM with conversion hint (e.g. 90 min = 1.5 hour).

## 6. Entities & States

Entities: Service, ServiceFacilityMap, ServicePrice (versioned), Pricelist, PricelistVersion, DiscountRule, PackageDef (+members), ConsentBinding, PrereqRule, ServiceVersion. UOMs are referenced (never duplicated) from 21: Service.billingUomId → Uom (Session/Count), Service.durationUomId → Uom (Time).
States: Service `draft → published → inactive`; Pricelist `draft → published → inactive` (`Default` can never leave published without a successor version); Price `future → active → superseded`; PackageDef `draft → published → retired`.

## 7. Workflows

Define Service → Bind Billing/Duration UOMs (from 21) → Map required facilit(ies) → Attach to pricelists (Default guaranteed) + Set payer prices + tax → Attach consent/prereqs → Bundle into package (optional) → Publish → Book/Order → Execute (+daycare capture) → Bill/Redeem.
Price change: new version with effective date → future bookings use new price → old invoices untouched.
Pricelist setup: Seed Default at org creation → Copy-attach to each branch → Add payer pricelists (CGHS/TPA/corporate) → First price entry per service falls back to Default until overridden → Publish version → Booking resolves branch + payer → Default.

## 8. Business Rules

- BR-1701: No facility mapping → no booking (consult/tele exempt by explicit flag, not by omission).
- BR-1702: Price change never rewrites history; effective-dating only.
- BR-1703: Package-scope services redeem against balance; direct billing blocked while balance covers.
- BR-1704: Consent-required services block execution (not booking) without signed consent.
- BR-1705: Codes are unique and immutable once published; renames create alias, not rewrite.
- BR-1706: Inactive/retired definitions stay reportable; deletion is forbidden, only retirement.
- BR-1707: Service UOMs MUST reference the governed UOM master (21); free-text or cross-category UOMs are rejected at save.
- BR-1708: Exactly one `Default` pricelist per branch scope MUST exist and stay published; it is the terminal fallback — resolution never ends in a silent zero rate.
- BR-1709: One active pricelist version per date; overlapping effective ranges for the same pricelist are rejected at publish.

## 9. CX Requirements

- Service creation is a single guided form: basics → UOMs → facilities → prices → clinical bindings → publish checklist.
- Booking search shows price (per active pricelist), duration, and facility availability inline.
- Publish checklist shows blockers (no facility, no price, missing consent) before go-live.
- Version history is one click from the service page: what changed, when, by whom.
- Package definition previews redemption math (sessions × services, validity) before publish.

## 10. Reports & Acceptance

Reports: service volumes, revenue by service/dept/pathy/payer, package liability/expiry, facility-wise demand, unpublished/inactive hygiene, price-change audit, pricelist coverage (services missing a payer price but covered by Default), UOM binding hygiene (services without Billing/Duration UOM).
Acceptance: (a) new service + facility + price → bookable and billable with zero code change; (b) every invoice line traces to an ordered service or package redemption; (c) price revision leaves historical invoices byte-identical; (d) consent-required service cannot execute unsigned; (e) fresh org/branch always has a published `Default` pricelist and every service resolves a price through it; (f) service with a mismatched UOM category cannot be saved.
